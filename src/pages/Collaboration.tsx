import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Send, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Collaboration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const { data: projects } = useQuery({
    queryKey: ['available-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_projects')
        .select('*')
        .eq('status', 'approved')
        .neq('created_by', user?.id || '');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: sentRequests } = useQuery({
    queryKey: ['sent-collaborations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaborations')
        .select(`
          *,
          receiver:profiles!collaborations_receiver_id_fkey(name),
          project:research_projects(title)
        `)
        .eq('requester_id', user?.id || '');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: receivedRequests } = useQuery({
    queryKey: ['received-collaborations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaborations')
        .select(`
          *,
          requester:profiles!collaborations_requester_id_fkey(name),
          project:research_projects(title)
        `)
        .eq('receiver_id', user?.id || '');
      
      if (error) throw error;
      return data;
    }
  });

  const sendRequest = useMutation({
    mutationFn: async ({ projectId, receiverId }: { projectId: string; receiverId: string }) => {
      const { error } = await supabase
        .from('collaborations')
        .insert([{
          requester_id: user?.id,
          receiver_id: receiverId,
          project_id: projectId,
          message,
          status: 'pending'
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sent-collaborations'] });
      toast({ title: 'Collaboration request sent' });
      setSelectedProject(null);
      setMessage('');
    }
  });

  const respondToRequest = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'accepted' | 'rejected' }) => {
      const { error } = await supabase
        .from('collaborations')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-collaborations'] });
      toast({ title: 'Response sent' });
    }
  });

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: any; variant: any; label: string }> = {
      pending: { icon: Clock, variant: 'secondary', label: 'Pending' },
      accepted: { icon: CheckCircle, variant: 'default', label: 'Accepted' },
      rejected: { icon: XCircle, variant: 'destructive', label: 'Rejected' }
    };
    
    const { icon: Icon, variant, label } = config[status] || config.pending;
    
    return (
      <Badge variant={variant as any} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Users className="h-8 w-8" />
          Collaboration
        </h1>
        <p className="text-muted-foreground mt-2">Connect with researchers on similar projects</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Projects</CardTitle>
            <CardDescription>Send collaboration requests to researchers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects && projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg space-y-3">
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.abstract}</p>
                    <p className="text-xs text-muted-foreground mt-1">{project.institution}</p>
                  </div>
                  {selectedProject === project.id ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Introduce yourself and explain why you'd like to collaborate..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => sendRequest.mutate({ 
                            projectId: project.id, 
                            receiverId: project.created_by 
                          })}
                          disabled={!message || sendRequest.isPending}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedProject(null);
                            setMessage('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setSelectedProject(project.id)}
                    >
                      Request Collaboration
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">No projects available</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Received Requests</CardTitle>
              <CardDescription>Respond to collaboration invitations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {receivedRequests && receivedRequests.length > 0 ? (
                receivedRequests.map((req: any) => (
                  <div key={req.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{req.requester?.name || 'Researcher'}</h3>
                        <p className="text-sm text-muted-foreground">{req.project?.title || 'Project'}</p>
                      </div>
                      {getStatusBadge(req.status)}
                    </div>
                    {req.message && (
                      <p className="text-sm">{req.message}</p>
                    )}
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => respondToRequest.mutate({ id: req.id, status: 'accepted' })}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => respondToRequest.mutate({ id: req.id, status: 'rejected' })}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">No requests received</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sent Requests</CardTitle>
              <CardDescription>Track your collaboration requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sentRequests && sentRequests.length > 0 ? (
                sentRequests.map((req: any) => (
                  <div key={req.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{req.receiver?.name || 'Researcher'}</h3>
                        <p className="text-sm text-muted-foreground">{req.project?.title || 'Project'}</p>
                      </div>
                      {getStatusBadge(req.status)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">No requests sent</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
