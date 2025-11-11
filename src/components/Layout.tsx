import { Link, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Beaker, 
  Award, 
  Building2, 
  Users, 
  BarChart3,
  LogOut,
  Home,
  Lightbulb,
  Info,
  LogIn,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import karnatakaEmblemImg from "@/assets/karnataka-emblem.png";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const menuItems = [
  { 
    title: 'Home', 
    icon: Home, 
    path: '/',
    allowedRoles: []
  },
  { 
    title: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/dashboard',
    allowedRoles: ['admin', 'researcher', 'startup', 'investor']
  },
  { 
    title: 'Research', 
    icon: Beaker, 
    path: '/research',
    allowedRoles: ['admin', 'researcher', 'investor']
  },
  { 
    title: 'IPR', 
    icon: Award, 
    path: '/ipr',
    allowedRoles: ['admin', 'researcher', 'investor']
  },
  { 
    title: 'Startups', 
    icon: Building2, 
    path: '/startups',
    allowedRoles: ['admin', 'startup', 'investor']
  },
  { 
    title: 'Innovation', 
    icon: Lightbulb, 
    path: '/innovation',
    allowedRoles: []
  },
  { 
    title: 'Collaboration', 
    icon: Users, 
    path: '/collaboration',
    allowedRoles: ['researcher', 'startup']
  },
  { 
    title: 'Analytics', 
    icon: BarChart3, 
    path: '/analytics',
    allowedRoles: ['admin', 'investor']
  },
  { 
    title: 'About', 
    icon: Info, 
    path: '/about',
    allowedRoles: []
  },
];

function NavBar() {
  const { user, role, signOut, profile } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleItems = menuItems.filter(item => 
    item.allowedRoles.length === 0 || !user || (role && item.allowedRoles.includes(role))
  );

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg border-b border-accent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src={karnatakaEmblemImg} alt="Karnataka Emblem" className="h-10" />
            <div className="hidden md:block">
              <div className="text-lg font-bold">Karnataka Innovation Portal</div>
              <div className="text-xs text-accent">Government of Karnataka</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-accent text-accent-foreground font-semibold'
                        : 'hover:bg-primary-foreground/10'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <div className="text-sm mr-2">
                  <div className="font-semibold">{profile?.name}</div>
                  <div className="text-xs text-accent capitalize">{role}</div>
                </div>
                <Button 
                  onClick={signOut} 
                  variant="outline" 
                  size="sm"
                  className="border-accent text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" size="sm" className="border-accent text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="sm" className="border-accent">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-primary text-primary-foreground">
              <div className="flex flex-col gap-4 mt-8">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.title}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                        isActive
                          ? 'bg-accent text-accent-foreground font-semibold'
                          : 'hover:bg-primary-foreground/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t border-accent pt-4 mt-4">
                  {user ? (
                    <>
                      <div className="px-4 mb-3">
                        <div className="font-semibold">{profile?.name}</div>
                        <div className="text-sm text-accent capitalize">{role}</div>
                      </div>
                      <Button 
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-accent"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button 
                      asChild 
                      variant="outline"
                      className="w-full border-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link to="/auth">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-primary text-primary-foreground border-t border-accent py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold">© 2024 Government of Karnataka</p>
              <p className="text-sm text-accent">All rights reserved</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm">For support, contact:</p>
              <p className="text-accent font-semibold">support@karnatakainnovation.gov.in</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { Layout };
