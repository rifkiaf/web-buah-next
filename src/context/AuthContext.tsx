"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export interface CustomUser extends FirebaseUser {
  role?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  currentUser: CustomUser | null;
  isAdmin: boolean;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    displayName: string,
    isAdmin: boolean,
    phone: string,
    address: string
  ) => Promise<FirebaseUser>;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: {
    displayName?: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CustomUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (user: FirebaseUser | null) => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const isUserAdmin = userDoc.exists() && userDoc.data().role === "admin";
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    isAdmin = false,
    phone = "",
    address = ""
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName });
      const userData = {
        email: user.email,
        displayName: displayName,
        role: isAdmin ? "admin" : "user",
        createdAt: new Date().toISOString(),
        phone: phone,
        address: address,
      };
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, userData);
      await checkAdminRole(user);
      return user;
    } catch (error) {
      console.error("Error in signup process:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await checkAdminRole(user);
      return user;
    } catch (error) {
      console.error("Error in login process:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsAdmin(false);
      await signOut(auth);
    } catch (error) {
      console.error("Error in logout process:", error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: {
    displayName?: string;
    phone?: string;
    address?: string;
  }) => {
    const user = auth.currentUser;
    if (!user) return;

    // Update Firebase Auth profile for display name
    if (updates.displayName && updates.displayName !== user.displayName) {
      await updateProfile(user, { displayName: updates.displayName });
    }

    // Prepare and update Firestore document for other profile data
    const firestoreUpdates: { phone?: string; address?: string } = {};
    if (updates.phone) firestoreUpdates.phone = updates.phone;
    if (updates.address) firestoreUpdates.address = updates.address;

    if (Object.keys(firestoreUpdates).length > 0) {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, firestoreUpdates, { merge: true });
    }

    // Refresh local state to reflect changes immediately
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const firestoreData = userDocSnap.data();
      // Use the previous state to merge and avoid losing object prototype
      setCurrentUser(prevUser => {
        if (!prevUser) return null; // Should not be null if we are here
        return {
          ...prevUser,
          ...firestoreData,
          displayName: user.displayName, // Ensure auth display name is current
          email: user.email,
        }
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const mergedUser = {
            ...user,
            ...userData,
          };
          setCurrentUser(mergedUser as CustomUser);
          setIsAdmin(userData.role === "admin");
        } else {
          setCurrentUser(user as CustomUser);
          setIsAdmin(false);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};