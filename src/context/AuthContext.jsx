import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../utils/api';

const AuthContext = createContext(undefined);

const STORAGE_KEYS = {
  user: 'minimal_user',
  token: 'minimal_token',
};

const getStoredValue = (key, fallback = null) => {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredValue(STORAGE_KEYS.user));
  const [token, setToken] = useState(() => getStoredValue(STORAGE_KEYS.token));
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        cleanupSession();
        setIsInitializing(false);
        return;
      }

      try {
        const profile = await getCurrentUser(token);
        setUser(profile);
        persist('user', profile);
      } catch {
        cleanupSession();
      } finally {
        setIsInitializing(false);
      }
    };

    restoreSession();
  }, [token]);

  const persist = (type, value) => {
    if (typeof window === 'undefined') return;
    if (value) {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(STORAGE_KEYS[type], serialized);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS[type]);
    }
  };

  const cleanupSession = () => {
    setUser(null);
    setToken(null);
    persist('user', null);
    persist('token', null);
  };

  const handleAuthSuccess = (payload) => {
    const nextUser = payload.user;
    const nextToken = payload.token;
    setUser(nextUser);
    setToken(nextToken);
    persist('user', nextUser);
    persist('token', nextToken);
  };

  const signup = async (formData) => {
    setIsLoading(true);
    try {
      const result = await registerUser(formData);
      handleAuthSuccess(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (formData) => {
    setIsLoading(true);
    try {
      const result = await loginUser(formData);
      handleAuthSuccess(result);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    cleanupSession();
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isInitializing,
      isAuthenticated: Boolean(user && token),
      login,
      signup,
      logout,
      setUser,
    }),
    [user, token, isLoading, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
