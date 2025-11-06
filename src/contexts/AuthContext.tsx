import type React from "react";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { useAuth as apiUseAuth } from "../services/api";
import type { User } from "../types";

export type ThemeMode = 'light' | 'dark';

interface AuthContextType {
  user: User | null;
  token: string | null;
  theme: ThemeMode;
  toggleTheme: () => void;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [loading, setLoading] = useState(true);
  const { login: authLogin, register: authRegister } = apiUseAuth();

  useEffect(() => {
    // 检查本地存储中是否有用户信息和令牌
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedTheme = localStorage.getItem("theme") as ThemeMode | null;

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    // 加载主题设置
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }

    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await authLogin({ usernameOrEmail, password });

      setToken(response.access_token);
      setUser(response.user);

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authRegister({ username, email, password });

      setToken(response.access_token);
      setUser(response.user);

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // 由于API中没有logout方法，我们只需要清除本地状态
      console.log("User logged out");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const value = {
    user,
    token,
    theme,
    toggleTheme,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
