import { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check if there's a token in localStorage and validate it?
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to validate the token by making an API call to /me or decode it
      // For now, we'll just set the user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } else {
      throw new Error(data.error || 'Login failed');
    }
  };
  const register = async (name, email, password) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return data;
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };
  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}