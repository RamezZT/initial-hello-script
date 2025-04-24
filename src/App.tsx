
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "@/components/auth/AuthGuard";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/login";
import CharitySignUp from "./pages/charity/SignUp";  // Import the CharitySignUp component

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import CharitiesList from "./pages/admin/CharitiesList";
import EventsList from "./pages/admin/EventsList";
import TransactionsList from "./pages/admin/TransactionsList";

// Charity pages
import CharityDashboard from "./pages/charity/Dashboard";
import CharityEventsList from "./pages/charity/EventsList";
import CharityTransactions from "./pages/charity/Transactions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/charity/signup" element={<CharitySignUp />} />
          
          {/* Admin routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AuthGuard allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </AuthGuard>
            } 
          />
          <Route 
            path="/admin/charities" 
            element={
              <AuthGuard allowedRoles={["ADMIN"]}>
                <CharitiesList />
              </AuthGuard>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <AuthGuard allowedRoles={["ADMIN"]}>
                <EventsList />
              </AuthGuard>
            } 
          />
          <Route 
            path="/admin/transactions" 
            element={
              <AuthGuard allowedRoles={["ADMIN"]}>
                <TransactionsList />
              </AuthGuard>
            } 
          />
          
          {/* Charity routes */}
          <Route 
            path="/charity/dashboard" 
            element={
              <AuthGuard allowedRoles={["CHARITY"]}>
                <CharityDashboard />
              </AuthGuard>
            } 
          />
          <Route 
            path="/charity/events" 
            element={
              <AuthGuard allowedRoles={["CHARITY"]}>
                <CharityEventsList />
              </AuthGuard>
            } 
          />
          <Route 
            path="/charity/transactions" 
            element={
              <AuthGuard allowedRoles={["CHARITY"]}>
                <CharityTransactions />
              </AuthGuard>
            } 
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
