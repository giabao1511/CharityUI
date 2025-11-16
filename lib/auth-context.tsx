"use client";

import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { getStoredUser, isAuthenticated, clearAuthData } from "@/lib/services/auth.service";

interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize user from localStorage immediately (SSR-safe)
const getInitialUser = (): User | null => {
  if (typeof globalThis.window === 'undefined') return null;
  return isAuthenticated() ? getStoredUser() : null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isLoading] = useState(false); // No async initialization needed

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ user, isLoading, setUser, logout }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
