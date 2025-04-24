
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "@/lib/auth";
import { Role } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  allowedRoles = ["ADMIN", "CHARITY"], 
  redirectTo = "/login" 
}: AuthGuardProps) {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  useEffect(() => {
    if (!authenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
      navigate(redirectTo);
      return;
    }

    if (userRole && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [authenticated, userRole, allowedRoles, navigate, redirectTo]);

  if (!authenticated || (userRole && allowedRoles.length > 0 && !allowedRoles.includes(userRole))) {
    return null;
  }

  return <>{children}</>;
}
