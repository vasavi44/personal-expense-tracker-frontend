import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [token, setToken] = useState(authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyExistingSession = async () => {
      const storedToken = authService.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userProfile = await authService.getCurrentUser();
        setUser(userProfile);
        setToken(storedToken);
      } catch (err) {
        console.warn('Session expired or token invalid. Clearing session.', err);
        authService.logout();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyExistingSession();
  }, []);

  const login = async (email, password) => {
    const authData = await authService.login(email, password);
    setToken(authData.token);
    setUser({
      id: authData.id,
      name: authData.name,
      email: authData.email,
    });
    return authData;
  };

  const register = async (name, email, password) => {
    const authData = await authService.register(name, email, password);
    setToken(authData.token);
    setUser({
      id: authData.id,
      name: authData.name,
      email: authData.email,
    });
    return authData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
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

export default AuthContext;
