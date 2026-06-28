import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user token exists in localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('zenith_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('zenith_user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (name, email, password) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('zenith_user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('zenith_user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('zenith_user');
    setUser(null);
  };

  const authHeader = () => {
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout, authHeader }}>
      {children}
    </AuthContext.Provider>
  );
};
