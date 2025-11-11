import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Award, Rocket, DollarSign } from 'lucide-react';

export default function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const [research, patents, startups, funding] = await Promise.all([
        supabase.from('research_projects').select('status, created_at, funding_amount'),
        supabase.from('patents').select('status, created_at'),
        supabase.from('startups').select('sector, stage, funding_received, created_at'),
        supabase.from('investor_interest').select('amount')
      ]);

      return {
        research: research.data || [],
        patents: patents.data || [],
        startups: startups.data || [],
        funding: funding.data || []
      };
    }
  });

  // Process data for charts
  const researchByStatus = stats?.research.reduce((acc: any, proj: any) => {
    acc[proj.status] = (acc[proj.status] || 0) + 1;
    return acc;
  }, {});

  const researchStatusData = researchByStatus ? [
    { name: 'Submitted', value: researchByStatus.submitted || 0, color: '#3b82f6' },
    { name: 'Approved', value: researchByStatus.approved || 0, color: '#22c55e' },
    { name: 'Rejected', value: researchByStatus.rejected || 0, color: '#ef4444' }
  ] : [];

  const patentsByYear = stats?.patents.reduce((acc: any, patent: any) => {
    const year = new Date(patent.created_at).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const patentYearData = patentsByYear ? Object.entries(patentsByYear).map(([year, count]) => ({
    year,
    patents: count
  })) : [];

  const startupsBySector = stats?.startups.reduce((acc: any, startup: any) => {
    acc[startup.sector] = (acc[startup.sector] || 0) + 1;
    return acc;
  }, {});

  const sectorData = startupsBySector ? Object.entries(startupsBySector).map(([sector, count]) => ({
    sector,
    count
  })).slice(0, 5) : [];

  const startupsByStage = stats?.startups.reduce((acc: any, startup: any) => {
    acc[startup.stage] = (acc[startup.stage] || 0) + 1;
    return acc;
  }, {});

  const stageData = startupsByStage ? [
    { name: 'Ideation', value: startupsByStage.ideation || 0, color: '#3b82f6' },
    { name: 'MVP', value: startupsByStage.mvp || 0, color: '#22c55e' },
    { name: 'Prototype', value: startupsByStage.prototype || 0, color: '#eab308' },
    { name: 'Growth', value: startupsByStage.growth || 0, color: '#f97316' },
    { name: 'Scaling', value: startupsByStage.scaling || 0, color: '#a855f7' }
  ] : [];

  const totalFunding = stats?.funding.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0;
  const totalStartupFunding = stats?.startups.reduce((sum: number, startup: any) => sum + (startup.funding_received || 0), 0) || 0;

  const totalMetrics = [
    {
      title: 'Total Research Projects',
      value: stats?.research.length || 0,
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Total Patents',
      value: stats?.patents.length || 0,
      icon: Award,
      color: 'text-amber-600'
    },
    {
      title: 'Total Startups',
      value: stats?.startups.length || 0,
      icon: Rocket,
      color: 'text-green-600'
    },
    {
      title: 'Total Funding',
      value: `₹${((totalFunding + totalStartupFunding) / 10000000).toFixed(2)}Cr`,
      icon: DollarSign,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">Karnataka Innovation Ecosystem Insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {totalMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Research Projects by Status</CardTitle>
            <CardDescription>Distribution of project statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={researchStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {researchStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patents Filed Over Time</CardTitle>
            <CardDescription>Yearly patent application trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={patentYearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="patents" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Startups by Sector</CardTitle>
            <CardDescription>Top 5 startup sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Startups by Stage</CardTitle>
            <CardDescription>Distribution across growth stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
