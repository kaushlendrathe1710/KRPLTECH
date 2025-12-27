import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth";
import Home from "@/pages/home";
import AdminDashboard from "@/pages/admin-dashboard";
import ClientDashboard from "@/pages/client-dashboard";
import NotFound from "@/pages/not-found";

function ProtectedAdminRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated || !isAdmin) {
    return <Redirect to="/" />;
  }
  
  return <AdminDashboard />;
}

function ProtectedClientRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  
  // Admin users should go to admin dashboard
  if (isAdmin) {
    return <Redirect to="/admin" />;
  }
  
  return <ClientDashboard />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={ProtectedAdminRoute} />
      <Route path="/dashboard" component={ProtectedClientRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
