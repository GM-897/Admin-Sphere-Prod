// context/AuthContext.js
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
      // Fetch all users
      const userResponse = await fetch("https://dashboard-psi-murex-25.vercel.app/api/users/");
      if (!userResponse.ok) {
        throw new Error(`Error fetching users: ${userResponse.status}`);
      }
      const users = await userResponse.json();
      const foundUser = users.find((u) => u.email === email);
      if (!foundUser) {
        throw new Error("User not found");
      }

      // Fetch all roles
      const rolesResponse = await fetch("https://dashboard-psi-murex-25.vercel.app/api/roles/");
      if (!rolesResponse.ok) {
        throw new Error(`Error fetching roles: ${rolesResponse.status}`);
      }
      const roles = await rolesResponse.json();
      const userRole = roles.find(
        (role) => role.name.toLowerCase() === foundUser.role.toLowerCase()
      );

      if (!userRole) {
        throw new Error("User role not found in roles collection");
      }

      // Attach permissions to the user object
      const authenticatedUser = {
        ...foundUser,
        permissions: userRole.permissions || [],
      };

      console.log("authenticatedUser", authenticatedUser);

      setUser(authenticatedUser);
      router.push("/"); // Redirect to Home Page
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