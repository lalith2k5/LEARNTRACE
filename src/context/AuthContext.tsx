import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserGoal } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  currentGoal: UserGoal | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginAsDemo: () => Promise<void>;
  refreshCurrentGoal: () => Promise<void>;
  setCurrentGoal: (goal: UserGoal) => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(api.getToken());
  const [currentGoal, setCurrentGoal] = useState<UserGoal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const storedToken = api.getToken();
      if (storedToken) {
        const userData = await api.getMe();
        setUser(userData);
        try {
          const goalData = await api.getCurrentGoal();
          setCurrentGoal(goalData);
        } catch {
          // ignore goal error
        }
      } else {
        setUser(null);
        setCurrentGoal(null);
      }
    } catch (err) {
      console.warn('Session verification failed, prompting login:', err);
      api.setToken(null);
      setToken(null);
      setUser(null);
      setCurrentGoal(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      const goal = await api.getCurrentGoal();
      setCurrentGoal(goal);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.register(email, password);
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      const goal = await api.getCurrentGoal();
      setCurrentGoal(goal);
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async () => {
    try {
      const res = await api.login('learner@learntrace.ai', 'password123');
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
      const goal = await api.getCurrentGoal();
      setCurrentGoal(goal);
    } catch (err) {
      console.warn('Demo login fallback note:', err);
      const fallbackToken = 'demo_token';
      api.setToken(fallbackToken);
      setToken(fallbackToken);
      setUser({
        id: 'user_demo_learner',
        email: 'learner@learntrace.ai',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const logout = () => {
    api.setToken(null);
    setToken(null);
    setUser(null);
    setCurrentGoal(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshCurrentGoal = async () => {
    try {
      const goal = await api.getCurrentGoal();
      setCurrentGoal(goal);
    } catch (err) {
      console.error('Error refreshing goal:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        currentGoal,
        loading,
        login,
        register,
        logout,
        loginAsDemo,
        refreshCurrentGoal,
        setCurrentGoal,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
