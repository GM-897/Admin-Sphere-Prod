"use client";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Holds the authenticated user
  const [loading, setLoading] = useState(false); // Indicates if a login request is in progress
  const [error, setError] = useState(null); // Holds any login errors
  const router = useRouter();

  // Login Function
  const login = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://dashboard-psi-murex-25.vercel.app/api/users/");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const users = await response.json();
      const foundUser = users.find((u) => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        router.push("/"); // Redirect to Home Page
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    router.push("/login"); // Redirect to Login Page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to Use Auth Context
export function useAuth() {
  return useContext(AuthContext);
}