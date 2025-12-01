import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarData?: string | null;
  language?: string | null;
  region?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
  setUserData: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Load fresh profile data from server to get latest avatar
          const response = await fetch('/api/auth/profile');
          if (response.ok) {
            const profileData = await response.json();
            const userData: User = {
              id: profileData.id?.toString() || '1',
              email: profileData.email,
              name: profileData.displayName || profileData.firstName + ' ' + profileData.lastName,
              role: 'USER',
              avatarData: profileData.avatarData || null,
              language: profileData.language || null,
              region: profileData.region || null
            };
            setUserData(userData);
          } else {
            // Fallback to localStorage if API call fails
            const userData = localStorage.getItem('user');
            if (userData) {
              setUser(JSON.parse(userData));
            }
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
          // Fallback to localStorage
          const userData = localStorage.getItem('user');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const setUserData = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };
  
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Use relative URL - Vite proxy will handle routing to Gateway
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData: User = {
          id: data.id.toString(),
          email: data.email,
          name: data.name,
          role: data.role,
          avatarData: data.avatarData || null,
          language: data.language || null,
          region: data.region || null
        };

        localStorage.setItem('token', data.token);
        setUserData(userData);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Use relative URL - Vite proxy will handle routing to Gateway
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData: User = {
          id: data.id.toString(),
          email: data.email,
          name: data.name,
          role: data.role,
          avatarData: data.avatarData || null,
          language: data.language || null,
          region: data.region || null
        };

        localStorage.setItem('token', data.token);
        setUserData(userData);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
