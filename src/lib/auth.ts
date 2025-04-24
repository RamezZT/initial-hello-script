
import { toast } from "@/components/ui/use-toast";
import { Role, User } from "@/types";

const API_URL = "http://localhost:3000"; // Replace with your NestJS API URL

export async function signIn(email: string, password: string): Promise<{
  token: string;
  user: User;
} | null> {
  try {
    const response = await fetch(`${API_URL}/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to sign in");
    }
    
    const data = await response.json();
    
    // Store the token and user data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    toast({
      title: "Authentication Error",
      description: error instanceof Error ? error.message : "Failed to sign in",
      variant: "destructive",
    });
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getUser(): User | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function getUserRole(): Role | null {
  const user = getUser();
  return user?.role || null;
}

export function isAuthenticated(): boolean {
  return getToken() !== null && getUser() !== null;
}

export function hasRole(role: Role): boolean {
  const userRole = getUserRole();
  return userRole === role;
}

export function isAdmin(): boolean {
  return hasRole("ADMIN");
}

export function isCharity(): boolean {
  return hasRole("CHARITY");
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

export async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      logout();
      throw new Error("Session expired. Please sign in again.");
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
}
