import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, UserProfile } from './api';
import { clearToken, getToken, setToken } from './storage';

type AuthState = {
  token: string | null;
  isAuthed: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<UserProfile | null>(null);

  async function refreshUser() {
    if (!getToken()) {
      setUser(null);
      return;
    }
    try {
      const me = await api.users.me();
      setUser(me);
    } catch {
      clearToken();
      setTokenState(null);
      setUser(null);
    }
  }

  useEffect(() => {
    if (token) {
      void refreshUser();
    } else {
      setUser(null);
    }
  }, [token]);

  const value = useMemo<AuthState>(
    () => ({
      token,
      isAuthed: Boolean(token),
      user,
      login: async (email, password) => {
        const res = await api.auth.login(email, password);
        setToken(res.token);
        setTokenState(res.token);
        try {
          const me = await api.users.me();
          setUser(me);
        } catch {
          setUser(null);
        }
      },
      logout: () => {
        clearToken();
        setTokenState(null);
        setUser(null);
      },
      refreshUser,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

