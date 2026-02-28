import { User, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../backend/firebase';
import * as authService from '../services/authService';
import { fetchUserProfile } from '../services/userService';

interface AuthContextValue {
  user: User | null;
  userProfile: { name?: string; email?: string } | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      setUser(usr);
      setLoading(false);

      if (usr) {
        const profile = await fetchUserProfile(usr.uid);
        setUserProfile(
          profile
            ? { name: profile.name || usr.displayName, email: profile.email }
            : { name: usr.displayName || 'User', email: usr.email }
        );
      } else {
        setUserProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    return authService.logout();
  };

  const value: AuthContextValue = { user, userProfile, loading, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
