import { createContext, useContext, useEffect, useState } from "react";
import { userService } from "../services";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(null); // null = loading
  const [user, setUser] = useState(null);
  const [isInitialising, setIsInitialising] = useState(true);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => {
      setUser(x);
      setIsSignedIn(!!x);
    });

    userService
      .refreshToken()
      .then((refreshedUser) => {
        if (refreshedUser) {
          setUser(refreshedUser);
          setIsSignedIn(true);
        }
      })
      .catch(() => {
        setIsSignedIn(false);
      })
      .finally(() => {
        setIsInitialising(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  if (isInitialising) return null;

  const signIn = (user) => {
    setUser(user);
    setIsSignedIn(true);
  };

  const signOut = () => {
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
