import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Award, Rocket, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { profile, role, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<'approve' | 'reject' | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [itemType, setItemType] = useState<'project' | 'patent' | 'startup' | null>(null);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', profile?.id],
    queryFn: async () => {
      const [researchRes, patentsRes, startupsRes, collabRes] = await Promise.all([
        supabase.from('research_projects').select('*', { count: 'exact', head: true }),
        supabase.from('patents').select('*', { count: 'exact', head: true }),
        supabase.from('startups').select('*', { count: 'exact', head: true }),
        supabase.from('collaborations').select('*', { count: 'exact', head: true })
      ]);

      return {
        totalResearch: researchRes.count || 0,
        totalPatents: patentsRes.count || 0,
        totalStartups: startupsRes.count || 0,
        totalCollaborations: collabRes.count || 0
      };
    }
  });

  const statCards = [
    {
      title: 'Research Projects',
      value: stats?.totalResearch || 0,
      icon: FileText,
      description: 'Total research projects',
      color: 'text-blue-600'
    },
    {
      title: 'Patents Filed',
      value: stats?.totalPatents || 0,
      icon: Award,
      description: 'IPR applications',
      color: 'text-amber-600'
    },
    {
      title: 'Active Startups',
      value: stats?.totalStartups || 0,
      icon: Rocket,
      description: 'Registered startups',
      color: 'text-green-600'
    },
    {
      title: 'Collaborations',
      value: stats?.totalCollaborations || 0,
      icon: Users,
      description: 'Research partnerships',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome, {profile?.name} ({role})
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Based on your role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {role === 'researcher' && (
              <>
                <a href="/research" className="block p-3 rounded-lg border hover:bg-secondary transition-colors">
                  <div className="font-medium">Submit Research Project</div>
                  <p className="text-sm text-muted-foreground">Add new project for approval</p>
                </a>
                <a href="/ipr" className="block p-3 rounded-lg border hover:bg-secondary transition-colors">
                  <div className="font-medium">File Patent Application</div>
                  <p className="text-sm text-muted-foreground">Submit IPR documentation</p>
                </a>
              </>
            )}
            {role === 'startup' && (
              <a href="/startups" className="block p-3 rounded-lg border hover:bg-secondary transition-colors">
                <div className="font-medium">Register Your Startup</div>
                <p className="text-sm text-muted-foreground">Get verified by government</p>
              </a>
            )}
            {role === 'investor' && (
              <>
                <a href="/research" className="block p-3 rounded-lg border hover:bg-secondary transition-colors">
                  <div className="font-medium">Browse Research Projects</div>
                  <p className="text-sm text-muted-foreground">Find investment opportunities</p>
                </a>
                <a href="/startups" className="block p-3 rounded-lg border hover:bg-secondary transition-colors">
                  <div className="font-medium">Explore Startups</div>
                  <p className="text-sm text-muted-foreground">Connect with innovators</p>
                </a>
              </>
            )}
            {role === 'admin' && (
              <>
                <a href="/research" className="block p-3 rounded-lg border hover:bg-secondary transition-colors">
                  <div className="font-medium">Review Submissions</div>
                  <p className="text-sm text-muted-foreground">Approve or reject projects</p>
                </a>
                <a href="/analytics" className="block p-3 rounded-lg border hover:bg-secondary transition-colors">
                  <div className="font-medium">View Analytics</div>
                  <p className="text-sm text-muted-foreground">Track ecosystem growth</p>
                </a>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in the ecosystem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New research project submitted</p>
                  <p className="text-xs text-muted-foreground">AI in Agriculture - IISc Bangalore</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <Award className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Patent application approved</p>
                  <p className="text-xs text-muted-foreground">IoT Device for Smart Farming</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Rocket className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Startup verified</p>
                  <p className="text-xs text-muted-foreground">HealthTech startup from Mysuru</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}