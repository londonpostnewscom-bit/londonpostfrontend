import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Admin { email: string; role: string; token: string; }
interface Ctx { admin: Admin | null; login: (e: string, p: string) => Promise<void>; logout: () => void; loading: boolean; }

const AdminAuthContext = createContext<Ctx | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lp_admin_token');
    const email = localStorage.getItem('lp_admin_email');
    if (token && email) setAdmin({ token, email, role: 'admin' });
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('lp_admin_token', data.token);
    localStorage.setItem('lp_admin_email', data.email);
    setAdmin({ token: data.token, email: data.email, role: data.role });
  };

  const logout = () => {
    localStorage.removeItem('lp_admin_token');
    localStorage.removeItem('lp_admin_email');
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}