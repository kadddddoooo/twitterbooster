import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/ProtectedRoute";

import Dashboard from "@/pages/Dashboard";
import AIGenerator from "@/pages/AIGenerator";
import Automation from "@/pages/Automation";
import Analytics from "@/pages/Analytics";
import Trending from "@/pages/Trending";
import Web3 from "@/pages/Web3";
import Settings from "@/pages/Settings";
import AIPersonality from "@/pages/AIPersonality";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Pagine accessibili senza autenticazione */}
      <Route path="/" component={Dashboard} />
      <Route path="/trending" component={Trending} />
      <Route path="/web3" component={Web3} />
      
      {/* Pagina delle impostazioni con funnel per login */}
      <Route path="/settings" component={Settings} />
      
      {/* Pagine che richiedono autenticazione */}
      <Route path="/ai-generator">
        {() => (
          <ProtectedRoute>
            <AIGenerator />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/automation">
        {() => (
          <ProtectedRoute>
            <Automation />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/analytics">
        {() => (
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/ai-personality">
        {() => (
          <ProtectedRoute>
            <AIPersonality />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
