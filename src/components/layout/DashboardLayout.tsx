
import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Role } from "@/types";
import { logout, getUser } from "@/lib/auth";
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, Users, Calendar, Folder, Settings, LogOut, BarChart2 } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "ADMIN" | "CHARITY";
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser() as User;
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define menu items based on role
  const getMenuItems = () => {
    if (role === "ADMIN") {
      return [
        { title: "Dashboard", icon: Home, path: "/admin/dashboard" },
        { title: "Charities", icon: Users, path: "/admin/charities" },
        { title: "Events", icon: Calendar, path: "/admin/events" },
        { title: "Transactions", icon: BarChart2, path: "/admin/transactions" },
      ];
    } else {
      return [
        { title: "Dashboard", icon: Home, path: "/charity/dashboard" },
        { title: "Your Events", icon: Calendar, path: "/charity/events" },
        { title: "Your Transactions", icon: BarChart2, path: "/charity/transactions" },
      ];
    }
  };

  const menuItems = getMenuItems();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-medium">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === item.path}
                      >
                        <Link to={item.path}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> 
              Log out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex h-screen flex-col flex-1">
          <header className="border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-xl font-semibold">
                  {role === "ADMIN" ? "Admin Dashboard" : "Charity Dashboard"}
                </h1>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
