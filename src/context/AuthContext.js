import React, { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../features/users/user.service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false); // Default to not signed in
  const [user, setUser] = useState(null); // Store user details

  useEffect(() => {
    // Subscribe to userService to track user state
    const subscription = userService.user.subscribe((x) => {
      setUser(x);
      setIsSignedIn(!!x); // Set isSignedIn to true if user exists
    });

    // Fetch the current user on mount
    userService.refreshToken().catch(() => {
      console.error("Failed to refresh token or fetch user");
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (user) => {
    setIsSignedIn(true);
    setUser(user);
  };

  const signOut = () => {
    setIsSignedIn(false);
    setUser(null);
    userService.logout(); // Call logout from userService
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
