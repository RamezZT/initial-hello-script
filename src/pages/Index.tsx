
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "@/lib/auth";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "CHARITY") {
        navigate("/charity/dashboard");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default Index;
