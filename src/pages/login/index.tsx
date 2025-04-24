import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, isAuthenticated, getUserRole } from "@/lib/auth";
import { UserRoundPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "CHARITY") {
        navigate("/charity/dashboard");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      
      if (result) {
        const { user } = result;
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.email}!`,
        });

        // Redirect based on role
        if (user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (user.role === "CHARITY") {
          navigate("/charity/dashboard");
        } else {
          toast({
            title: "Access Denied",
            description: "Only administrators and charities can access the dashboard",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCharitySignUp = () => {
    navigate("/charity/signup");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login to Dashboard</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              className="w-full mt-2" 
              onClick={handleCharitySignUp}
            >
              <UserRoundPlus className="mr-2 h-4 w-4" />
              Sign Up as a Charity
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
