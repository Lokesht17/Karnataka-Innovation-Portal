import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Innovation from "./pages/Innovation";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Research from "./pages/Research";
import IPR from "./pages/IPR";
import Startups from "./pages/Startups";
import Collaboration from "./pages/Collaboration";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/innovation" element={<Innovation />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/research"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'researcher', 'investor']}>
                    <Research />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ipr"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'researcher', 'investor']}>
                    <IPR />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/startups"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'startup', 'investor']}>
                    <Startups />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collaboration"
                element={
                  <ProtectedRoute allowedRoles={['researcher', 'startup']}>
                    <Collaboration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'investor']}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
