import React, { createContext, useContext, useState } from "react";
import { API_BASE_URL } from "../Config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);

  const logout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include any authorization headers if needed
        },
      });

      if (response.ok) {
        setIsAuthenticated(false); // Update the auth state
        // Optionally clear any saved user info from localStorage or sessionStorage
        localStorage.removeItem('user'); // Adjust based on how you're storing user data
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
