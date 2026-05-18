import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "../services/auth";
import type { User } from "../types";

type AuthContextValue = {
  user: (User & { memberships?: unknown[] }) | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<(User & { memberships?: unknown[] }) | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("pm_token"));
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const currentToken = localStorage.getItem("pm_token");
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await authService.me();
      setUser(profile);
      setToken(currentToken);
    } catch {
      localStorage.removeItem("pm_token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const login = async (email: string, password: string) => {
    const payload = await authService.login(email, password);
    localStorage.setItem("pm_token", payload.token);
    setToken(payload.token);
    await refresh();
  };

  const register = async (name: string, email: string, password: string) => {
    const payload = await authService.register(name, email, password);
    localStorage.setItem("pm_token", payload.token);
    setToken(payload.token);
    await refresh();
  };

  const logout = () => {
    localStorage.removeItem("pm_token");
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      refresh,
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
