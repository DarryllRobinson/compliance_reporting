import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(null); // null = loading
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => {
      setUser(x);
    });

    userService
      .refreshToken()
      .then((user) => {
        try {
          if (user) {
            setIsSignedIn(true);
          } else {
            setIsSignedIn(false);
          }
        } catch (err) {
          console.error("Error while handling refreshed user:", err);
          setIsSignedIn(false);
        }
      })
      .catch(() => {
        console.error("Failed to refresh token or fetch user");
        setIsSignedIn(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (user) => {
    userService.user.next(user);
    setUser(user);
    setIsSignedIn(true);
  };

  const signOut = () => {
    userService.logout();
    setUser(null);
    setIsSignedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isSignedIn, setIsSignedIn, user, setUser, signIn, signOut }}
    >
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
