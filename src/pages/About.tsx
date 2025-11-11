import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import karnatakaEmblemImg from "@/assets/karnataka-emblem.png";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-12">
        <img 
          src={karnatakaEmblemImg} 
          alt="Karnataka State Emblem" 
          className="h-24 mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold mb-4 text-primary">
          About Karnataka Innovation Portal
        </h1>
        <p className="text-xl text-muted-foreground">
          Empowering Innovation and Research in Karnataka
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-lg space-y-4">
            <p>
              The Karnataka Innovation Portal is a flagship initiative by the Government of Karnataka 
              to create a unified platform for monitoring, managing, and promoting research, intellectual 
              property rights, innovation, and startup ecosystems across the state.
            </p>
            <p>
              Our mission is to foster collaboration between researchers, entrepreneurs, investors, and 
              institutions, thereby accelerating innovation and economic growth in Karnataka.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Key Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-lg list-disc list-inside">
              <li>Streamline research project submissions and funding allocation</li>
              <li>Simplify patent filing and IPR management processes</li>
              <li>Provide a comprehensive platform for startup registration and verification</li>
              <li>Facilitate collaboration between researchers, startups, and investors</li>
              <li>Offer real-time analytics and insights into Karnataka's innovation landscape</li>
              <li>Create transparency in government-funded research and innovation programs</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Who Can Use This Portal?</CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-primary mb-2">Researchers</h3>
                <p className="text-muted-foreground">
                  Submit research proposals, track project status, file patents, and collaborate 
                  with other researchers and institutions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Startups</h3>
                <p className="text-muted-foreground">
                  Register your startup, get government verification, connect with investors, 
                  and access funding opportunities.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Investors</h3>
                <p className="text-muted-foreground">
                  Discover verified startups, express investment interest, and access analytics 
                  on Karnataka's innovation ecosystem.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Administrators</h3>
                <p className="text-muted-foreground">
                  Manage research approvals, verify startups, track IPR applications, and 
                  monitor ecosystem performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Contact Information</CardTitle>
            <CardDescription>Karnataka Innovation Cell</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-muted-foreground">
                  Vidhana Soudha, Dr. Ambedkar Veedhi,<br />
                  Bangalore, Karnataka 560001
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-muted-foreground">+91-80-2220-0100</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-muted-foreground">support@karnatakainnovation.gov.in</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold">Website</p>
                <p className="text-muted-foreground">www.karnataka.gov.in</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-8 text-center">
            <p className="text-lg mb-2">
              For technical support or inquiries, please reach out to us at
            </p>
            <p className="text-xl font-semibold text-accent">
              support@karnatakainnovation.gov.in
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
