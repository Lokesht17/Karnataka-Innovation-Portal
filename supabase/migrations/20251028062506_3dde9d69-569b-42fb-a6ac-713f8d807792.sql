-- Create storage bucket for project documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-documents', 'project-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for project-documents bucket
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Admins can view all project documents" ON storage.objects;
CREATE POLICY "Admins can view all project documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-documents' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Add document_path columns
ALTER TABLE public.research_projects 
ADD COLUMN IF NOT EXISTS document_path text;

ALTER TABLE public.patents 
ADD COLUMN IF NOT EXISTS document_path text;

ALTER TABLE public.startups 
ADD COLUMN IF NOT EXISTS document_path text;

-- Update RLS policies to allow document path updates
DROP POLICY IF EXISTS "Researchers can update own project documents" ON public.research_projects;
CREATE POLICY "Researchers can update own project documents"
ON public.research_projects FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Researchers can update own patent documents" ON public.patents;
CREATE POLICY "Researchers can update own patent documents"
ON public.patents FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);