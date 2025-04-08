import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase/firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { Alert } from "react-native";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await auth.signOut();

      await updateProfile(userCredential.user, {
        displayName: username,
      });

      await updateProfile(userCredential.user, {
        displayName: username,
      });

      return { success: true };
    } catch (error: any) {
      let message = "Registration failed";
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "Email already in use";
          break;
        case "auth/invalid-email":
          message = "Invalid email format";
          break;
        case "auth/weak-password":
          message = "Password should be at least 6 characters";
          break;
        case "auth/network-request-failed":
          message = "Network error. Please check your connection";
          break;
        default:
          message = error.message || "Unknown error occurred";
      }
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      let message = "Login failed";

      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          message = "Invalid email or password";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Try again later";
          break;
        case "auth/network-request-failed":
          message = "Network error. Please check your connection";
          break;
        default:
          message = error.message || "Unknown error occurred";
      }

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      Alert.alert("Logout Error", "Failed to sign out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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
