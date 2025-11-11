-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'researcher', 'startup', 'investor');

-- Create startup stage enum
CREATE TYPE public.startup_stage AS ENUM ('ideation', 'prototype', 'mvp', 'growth', 'scaling');

-- Create project status enum
CREATE TYPE public.project_status AS ENUM ('submitted', 'under_review', 'approved', 'rejected');

-- Create patent status enum
CREATE TYPE public.patent_status AS ENUM ('filed', 'under_review', 'approved', 'rejected');

-- Create collaboration status enum
CREATE TYPE public.collab_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role public.user_role NOT NULL,
  institution_or_startup TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create research_projects table
CREATE TABLE public.research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  institution TEXT NOT NULL,
  principal_investigator TEXT NOT NULL,
  funding_amount NUMERIC,
  duration_months INTEGER,
  status public.project_status NOT NULL DEFAULT 'submitted',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approved_by UUID REFERENCES auth.users(id),
  review_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on research_projects
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;

-- Research projects policies
CREATE POLICY "Researchers can create projects"
  ON public.research_projects FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'researcher')
  );

CREATE POLICY "Users can view own projects"
  ON public.research_projects FOR SELECT
  USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'investor'))
  );

CREATE POLICY "Admins can update projects"
  ON public.research_projects FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create patents table
CREATE TABLE public.patents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  inventor TEXT NOT NULL,
  institution TEXT NOT NULL,
  application_number TEXT,
  filed_date DATE NOT NULL,
  status public.patent_status NOT NULL DEFAULT 'filed',
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on patents
ALTER TABLE public.patents ENABLE ROW LEVEL SECURITY;

-- Patents policies
CREATE POLICY "Researchers can create patents"
  ON public.patents FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'researcher')
  );

CREATE POLICY "Users can view patents"
  ON public.patents FOR SELECT
  USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'investor'))
  );

CREATE POLICY "Admins can update patents"
  ON public.patents FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create startups table
CREATE TABLE public.startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  stage public.startup_stage NOT NULL,
  recognition_id TEXT,
  sector TEXT NOT NULL,
  funding_received NUMERIC DEFAULT 0,
  description TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on startups
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;

-- Startups policies
CREATE POLICY "Startup founders can create startups"
  ON public.startups FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'startup')
  );

CREATE POLICY "Users can view verified startups"
  ON public.startups FOR SELECT
  USING (
    is_verified = true OR
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'investor'))
  );

CREATE POLICY "Admins can update startups"
  ON public.startups FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Founders can update own startups"
  ON public.startups FOR UPDATE
  USING (auth.uid() = created_by);

-- Create collaborations table
CREATE TABLE public.collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
  message TEXT,
  status public.collab_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on collaborations
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;

-- Collaborations policies
CREATE POLICY "Researchers can create collaboration requests"
  ON public.collaborations FOR INSERT
  WITH CHECK (
    auth.uid() = requester_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'researcher')
  );

CREATE POLICY "Users can view own collaborations"
  ON public.collaborations FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Receivers can update collaboration status"
  ON public.collaborations FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Create investor_interest table
CREATE TABLE public.investor_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('research', 'startup')),
  amount NUMERIC,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on investor_interest
ALTER TABLE public.investor_interest ENABLE ROW LEVEL SECURITY;

-- Investor interest policies
CREATE POLICY "Investors can express interest"
  ON public.investor_interest FOR INSERT
  WITH CHECK (
    auth.uid() = investor_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'investor')
  );

CREATE POLICY "Users can view relevant interests"
  ON public.investor_interest FOR SELECT
  USING (
    auth.uid() = investor_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_projects_updated_at
  BEFORE UPDATE ON public.research_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patents_updated_at
  BEFORE UPDATE ON public.patents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_startups_updated_at
  BEFORE UPDATE ON public.startups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaborations_updated_at
  BEFORE UPDATE ON public.collaborations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, institution_or_startup)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'researcher'),
    NEW.raw_user_meta_data->>'institution_or_startup'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();