"use client";
import { createContext, useState, useContext, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize with null

  const GoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider).then()
    } catch (error) {
      console.error(error); // Handle errors gracefully
    }
  };

  const logout = () => {
    signOut(auth);
    //removing user id from localstorage when logged out
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
    });
    // No need for dependency array here
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, GoogleSignIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function UserAuth() {
  return useContext(AuthContext);
}

export const Loading = createContext();
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Loading.Provider value={{ loading, setLoading }}>
      {children}
    </Loading.Provider>
  );
};
