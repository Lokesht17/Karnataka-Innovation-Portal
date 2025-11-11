import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Research() {
  const { profile, role } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    institution: profile?.institution_or_startup || '',
    principal_investigator: profile?.name || '',
    funding_amount: '',
    duration_months: ''
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ['research-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newProject: any) => {
      const { data, error } = await supabase
        .from('research_projects')
        .insert([newProject])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-projects'] });
      toast.success('Research project submitted successfully!');
      setIsDialogOpen(false);
      setFormData({
        title: '',
        abstract: '',
        institution: profile?.institution_or_startup || '',
        principal_investigator: profile?.name || '',
        funding_amount: '',
        duration_months: ''
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit project');
    }
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, status, comment }: { id: string; status: 'approved' | 'rejected'; comment?: string }) => {
      const { error } = await supabase
        .from('research_projects')
        .update({ 
          status, 
          review_comment: comment,
          approved_by: profile?.id 
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research-projects'] });
      toast.success('Project status updated');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      funding_amount: formData.funding_amount ? parseFloat(formData.funding_amount) : null,
      duration_months: formData.duration_months ? parseInt(formData.duration_months) : null,
      created_by: profile?.id
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      submitted: { variant: 'secondary', icon: Clock },
      under_review: { variant: 'default', icon: Clock },
      approved: { variant: 'default', icon: CheckCircle },
      rejected: { variant: 'destructive', icon: XCircle }
    };
    const config = variants[status] || variants.submitted;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Research Projects</h1>
          <p className="text-muted-foreground mt-2">Submit and track research initiatives</p>
        </div>
        {role === 'researcher' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Research Project</DialogTitle>
                <DialogDescription>
                  Submit your research proposal for government review and funding consideration
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract *</Label>
                  <Textarea
                    id="abstract"
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution *</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pi">Principal Investigator *</Label>
                    <Input
                      id="pi"
                      value={formData.principal_investigator}
                      onChange={(e) => setFormData({ ...formData, principal_investigator: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="funding">Funding Amount (₹)</Label>
                    <Input
                      id="funding"
                      type="number"
                      value={formData.funding_amount}
                      onChange={(e) => setFormData({ ...formData, funding_amount: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (months)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration_months}
                      onChange={(e) => setFormData({ ...formData, duration_months: e.target.value })}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Submitting...' : 'Submit Project'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <p>Loading projects...</p>
        ) : projects?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No research projects yet. Be the first to submit one!
            </CardContent>
          </Card>
        ) : (
          projects?.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {project.institution} • {project.principal_investigator}
                    </CardDescription>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{project.abstract}</p>
                
                <div className="flex gap-4 text-sm text-muted-foreground">
                  {project.funding_amount && (
                    <span>Funding: ₹{project.funding_amount.toLocaleString()}</span>
                  )}
                  {project.duration_months && (
                    <span>Duration: {project.duration_months} months</span>
                  )}
                </div>
                
                {project.review_comment && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Review Comment:</p>
                    <p className="text-sm text-muted-foreground mt-1">{project.review_comment}</p>
                  </div>
                )}
                
                {role === 'admin' && project.status === 'submitted' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate({ id: project.id, status: 'approved' })}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const comment = prompt('Enter rejection reason:');
                        if (comment) {
                          approveMutation.mutate({ id: project.id, status: 'rejected', comment });
                        }
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}