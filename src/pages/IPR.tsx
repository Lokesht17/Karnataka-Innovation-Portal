import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Award, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function IPR() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    inventor: '',
    institution: '',
    filed_date: '',
    application_number: '',
    description: ''
  });

  const { data: patents, isLoading } = useQuery({
    queryKey: ['patents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createPatent = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('patents')
        .insert([{
          ...data,
          created_by: user?.id,
          status: 'filed'
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patents'] });
      toast({ title: 'Patent application submitted successfully' });
      setShowForm(false);
      setFormData({
        title: '',
        inventor: '',
        institution: '',
        filed_date: '',
        application_number: '',
        description: ''
      });
    },
    onError: () => {
      toast({ title: 'Failed to submit patent', variant: 'destructive' });
    }
  });

  const updatePatentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'filed' | 'under_review' | 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('patents')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patents'] });
      toast({ title: 'Patent status updated' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPatent.mutate(formData);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { icon: any; variant: any; label: string }> = {
      filed: { icon: Clock, variant: 'default', label: 'Filed' },
      under_review: { icon: Clock, variant: 'secondary', label: 'Under Review' },
      approved: { icon: CheckCircle, variant: 'default', label: 'Approved' },
      rejected: { icon: XCircle, variant: 'destructive', label: 'Rejected' }
    };
    
    const config = variants[status] || variants.filed;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant as any} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Award className="h-8 w-8" />
            IPR & Patents
          </h1>
          <p className="text-muted-foreground mt-2">Manage intellectual property rights and patent applications</p>
        </div>
        {role === 'researcher' && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            {showForm ? 'Cancel' : 'File Patent'}
          </Button>
        )}
      </div>

      {showForm && role === 'researcher' && (
        <Card>
          <CardHeader>
            <CardTitle>File New Patent Application</CardTitle>
            <CardDescription>Submit your patent details for review</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Patent Title*</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inventor">Inventor Name*</Label>
                  <Input
                    id="inventor"
                    required
                    value={formData.inventor}
                    onChange={(e) => setFormData({ ...formData, inventor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution*</Label>
                  <Input
                    id="institution"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filed_date">Filing Date*</Label>
                  <Input
                    id="filed_date"
                    type="date"
                    required
                    value={formData.filed_date}
                    onChange={(e) => setFormData({ ...formData, filed_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="application_number">Application Number</Label>
                  <Input
                    id="application_number"
                    value={formData.application_number}
                    onChange={(e) => setFormData({ ...formData, application_number: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={createPatent.isPending}>
                {createPatent.isPending ? 'Submitting...' : 'Submit Patent Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Patent Applications</CardTitle>
          <CardDescription>
            {role === 'admin' ? 'All patent applications' : 'Your submitted patents'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : patents && patents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Inventor</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Filed Date</TableHead>
                  <TableHead>Status</TableHead>
                  {role === 'admin' && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {patents.map((patent) => (
                  <TableRow key={patent.id}>
                    <TableCell className="font-medium">{patent.title}</TableCell>
                    <TableCell>{patent.inventor}</TableCell>
                    <TableCell>{patent.institution}</TableCell>
                    <TableCell>{new Date(patent.filed_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(patent.status)}</TableCell>
                    {role === 'admin' && (
                      <TableCell>
                        <Select
                          value={patent.status}
                          onValueChange={(value) => updatePatentStatus.mutate({ id: patent.id, status: value as 'filed' | 'under_review' | 'approved' | 'rejected' })}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="filed">Filed</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No patent applications found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
