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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Plus, CheckCircle, Building2, DollarSign } from 'lucide-react';

export default function Startups() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    founder_name: '',
    sector: '',
    stage: 'ideation' as 'ideation' | 'mvp' | 'prototype' | 'growth' | 'scaling',
    recognition_id: '',
    description: '',
    funding_received: ''
  });

  const { data: startups, isLoading } = useQuery({
    queryKey: ['startups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createStartup = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('startups')
        .insert([{
          ...data,
          funding_received: data.funding_received ? parseFloat(data.funding_received) : 0,
          created_by: user?.id,
          is_verified: false
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      toast({ title: 'Startup registered successfully' });
      setShowForm(false);
      setFormData({
        company_name: '',
        founder_name: '',
        sector: '',
        stage: 'ideation',
        recognition_id: '',
        description: '',
        funding_received: ''
      });
    },
    onError: () => {
      toast({ title: 'Failed to register startup', variant: 'destructive' });
    }
  });

  const verifyStartup = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('startups')
        .update({ is_verified: true })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startups'] });
      toast({ title: 'Startup verified successfully' });
    }
  });

  const expressInterest = useMutation({
    mutationFn: async ({ startupId, amount, message }: { startupId: string; amount: string; message: string }) => {
      const { error } = await supabase
        .from('investor_interest')
        .insert([{
          investor_id: user?.id,
          target_id: startupId,
          target_type: 'startup',
          amount: parseFloat(amount),
          message
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Interest recorded successfully' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStartup.mutate(formData);
  };

  const getStageBadge = (stage: string) => {
    const colors: Record<string, string> = {
      ideation: 'bg-blue-500',
      mvp: 'bg-green-500',
      prototype: 'bg-yellow-500',
      growth: 'bg-orange-500',
      scaling: 'bg-purple-500'
    };
    
    return (
      <Badge className={`${colors[stage]} text-white capitalize`}>
        {stage}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Rocket className="h-8 w-8" />
            Startups
          </h1>
          <p className="text-muted-foreground mt-2">Karnataka's innovation ecosystem startups</p>
        </div>
        {role === 'startup' && (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            {showForm ? 'Cancel' : 'Register Startup'}
          </Button>
        )}
      </div>

      {showForm && role === 'startup' && (
        <Card>
          <CardHeader>
            <CardTitle>Register Your Startup</CardTitle>
            <CardDescription>Get verified and connect with investors</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name*</Label>
                  <Input
                    id="company_name"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founder_name">Founder Name*</Label>
                  <Input
                    id="founder_name"
                    required
                    value={formData.founder_name}
                    onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector*</Label>
                  <Input
                    id="sector"
                    required
                    placeholder="e.g., AI, AgriTech, HealthTech"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage*</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value: any) => setFormData({ ...formData, stage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ideation">Ideation</SelectItem>
                      <SelectItem value="mvp">MVP</SelectItem>
                      <SelectItem value="prototype">Prototype</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="scaling">Scaling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recognition_id">Recognition ID</Label>
                  <Input
                    id="recognition_id"
                    placeholder="DPIIT Recognition Number"
                    value={formData.recognition_id}
                    onChange={(e) => setFormData({ ...formData, recognition_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funding_received">Funding Received (₹)</Label>
                  <Input
                    id="funding_received"
                    type="number"
                    placeholder="0"
                    value={formData.funding_received}
                    onChange={(e) => setFormData({ ...formData, funding_received: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea
                  id="description"
                  required
                  rows={4}
                  placeholder="Tell us about your startup"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={createStartup.isPending}>
                {createStartup.isPending ? 'Submitting...' : 'Register Startup'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 text-center py-8">Loading...</div>
        ) : startups && startups.length > 0 ? (
          startups.map((startup) => (
            <Card key={startup.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-10 w-10 text-primary" />
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {startup.company_name}
                        {startup.is_verified && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </CardTitle>
                      <CardDescription>{startup.founder_name}</CardDescription>
                    </div>
                  </div>
                  {getStageBadge(startup.stage)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{startup.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sector</p>
                    <p className="font-medium">{startup.sector}</p>
                  </div>
                  {startup.funding_received > 0 && (
                    <div>
                      <p className="text-muted-foreground">Funding</p>
                      <p className="font-medium flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ₹{startup.funding_received.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                {role === 'admin' && !startup.is_verified && (
                  <Button 
                    onClick={() => verifyStartup.mutate(startup.id)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Startup
                  </Button>
                )}
                {role === 'investor' && startup.is_verified && (
                  <Button
                    onClick={() => {
                      const amount = prompt('Enter investment amount (₹):');
                      const message = prompt('Add a message (optional):');
                      if (amount) {
                        expressInterest.mutate({ 
                          startupId: startup.id, 
                          amount, 
                          message: message || '' 
                        });
                      }
                    }}
                    className="w-full"
                  >
                    Express Interest
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            No startups registered yet
          </div>
        )}
      </div>
    </div>
  );
}
