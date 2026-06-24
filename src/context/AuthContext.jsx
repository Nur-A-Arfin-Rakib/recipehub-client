'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/utils/firebase';
import api from '@/utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async (name, email, password, image) => {
    const res = await api.post('/api/auth/register', { name, email, password, image });
    setUser(res.data.user);
    return res.data.user;
  };

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    setUser(res.data.user);
    return res.data.user;
  };

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = result.user;
    const res = await api.post('/api/auth/google', { name: displayName, email, image: photoURL });
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, register, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// auth
