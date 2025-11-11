import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Award, TrendingUp, Users, Target, Zap } from "lucide-react";
import innovationBgImg from "@/assets/innovation-bg.jpg";

const Innovation = () => {
  const initiatives = [
    {
      icon: Lightbulb,
      title: "Innovation Labs",
      description: "State-of-the-art facilities for prototyping and product development across Karnataka",
      stats: "25+ Labs"
    },
    {
      icon: Award,
      title: "Innovation Awards",
      description: "Annual recognition program for outstanding innovations and research contributions",
      stats: "50+ Winners"
    },
    {
      icon: Users,
      title: "Mentorship Programs",
      description: "Connect with industry experts and successful entrepreneurs for guidance",
      stats: "100+ Mentors"
    },
    {
      icon: TrendingUp,
      title: "Funding Support",
      description: "Government grants and seed funding for promising innovation projects",
      stats: "₹100Cr+ Allocated"
    },
    {
      icon: Target,
      title: "Incubation Centers",
      description: "Comprehensive support ecosystem for early-stage startups and innovators",
      stats: "15+ Centers"
    },
    {
      icon: Zap,
      title: "Technology Transfer",
      description: "Bridge the gap between research institutions and industry applications",
      stats: "200+ Transfers"
    }
  ];

  const sectors = [
    { name: "Biotechnology", projects: 85 },
    { name: "Information Technology", projects: 120 },
    { name: "Clean Energy", projects: 45 },
    { name: "Agriculture Tech", projects: 60 },
    { name: "Healthcare", projects: 75 },
    { name: "Manufacturing", projects: 55 }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[400px] flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 43, 92, 0.9), rgba(0, 43, 92, 0.9)), url(${innovationBgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-5xl font-bold mb-4">Innovation Ecosystem</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Driving Karnataka's transformation into India's leading innovation hub
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">Karnataka: India's Innovation Capital</CardTitle>
            <CardDescription className="text-lg">
              A thriving ecosystem of research, entrepreneurship, and technological advancement
            </CardDescription>
          </CardHeader>
          <CardContent className="text-lg space-y-4">
            <p>
              Karnataka has established itself as the innovation powerhouse of India, home to over 400 R&D 
              centers and 30% of India's total tech workforce. Our state leads the nation in startup density, 
              patent filings, and technology exports.
            </p>
            <p>
              The Karnataka Innovation Portal serves as the central nervous system of this ecosystem, 
              connecting researchers, entrepreneurs, investors, and government agencies to accelerate 
              innovation and drive economic growth.
            </p>
          </CardContent>
        </Card>

        {/* Key Initiatives */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">
            Key Innovation Initiatives
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((initiative, index) => {
              const Icon = initiative.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-primary">{initiative.title}</CardTitle>
                    <CardDescription>{initiative.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">{initiative.stats}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Focus Sectors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Innovation Focus Sectors</CardTitle>
            <CardDescription>
              Active innovation projects across key sectors driving Karnataka's growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectors.map((sector, index) => (
                <div key={index} className="p-6 bg-secondary rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-primary">{sector.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-accent">{sector.projects}</span>
                    <span className="text-muted-foreground">Active Projects</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Statement */}
        <Card className="mt-12 bg-primary text-primary-foreground">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-accent">Our Vision</h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              To establish Karnataka as a global innovation destination by 2030, creating 1 million 
              high-skilled jobs and contributing to India's goal of becoming a $5 trillion economy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Innovation;
