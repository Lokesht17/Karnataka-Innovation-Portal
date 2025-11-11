import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Award, Beaker, Building2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import vidhanaSoudhaImg from "@/assets/vidhana-soudha.jpg";

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Beaker,
      title: "Research Management",
      description: "Submit and track cutting-edge research projects with comprehensive funding support",
      link: "/research"
    },
    {
      icon: Award,
      title: "Intellectual Property Rights",
      description: "Streamlined patent filing and IPR management system",
      link: "/ipr"
    },
    {
      icon: Building2,
      title: "Startup Ecosystem",
      description: "Register startups and connect with investors in Karnataka's innovation hub",
      link: "/startups"
    },
    {
      icon: Users,
      title: "Collaboration Network",
      description: "Foster partnerships between researchers, startups, and institutions",
      link: "/collaboration"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Real-time insights into Karnataka's innovation and research landscape",
      link: "/analytics"
    }
  ];

  const stats = [
    { value: "500+", label: "Research Projects" },
    { value: "200+", label: "Patents Filed" },
    { value: "300+", label: "Startups Registered" },
    { value: "₹500Cr+", label: "Funding Allocated" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 43, 92, 0.85), rgba(0, 43, 92, 0.85)), url(${vidhanaSoudhaImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Karnataka Innovation Portal
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Enhancing Monitoring and Management of Research, IPR, Innovation, and Startups in Karnataka
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/auth">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                  <Link to="/about">Learn More</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-accent">{stat.value}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-primary">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions for research, innovation, and entrepreneurship
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow border-2">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-primary">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="ghost" className="w-full justify-between text-primary hover:text-primary">
                      <Link to={feature.link}>
                        Explore <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Innovate?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join Karnataka's thriving innovation ecosystem today
          </p>
          {!user && (
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/auth">
                Register Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
