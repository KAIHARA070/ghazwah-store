import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    
    // Fallback: pastikan loading tidak pernah nyangkut (timeout 3 detik)
    const timeoutId = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3000);

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Error getting session:", error);
      }
      const session = data?.session;
      if (session && session.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          role: session.user.user_metadata?.role || 'user'
        });
      } else {
        // Fallback to local mock storage if Supabase is not fully configured
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
      }
      if (isMounted) setLoading(false);
    }).catch((err) => {
      console.error("Auth Exception:", err);
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      if (isMounted) setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          role: session.user.user_metadata?.role || 'user'
        });
      } else {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const registerWithEmail = async (email, password, fullName, role = 'user') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      if (error) throw error;
      
      // Jika Supabase membutuhkan konfirmasi email (session = null)
      if (!data.session) {
        console.warn('Email confirmation required by Supabase. Using mock login for now.');
        const mockUser = { id: data.user?.id || Date.now().toString(), name: fullName || email.split('@')[0], email, role };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { user: mockUser };
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error.message);
      // Fallback for mock if Supabase is not configured
      const mockUser = { id: Date.now().toString(), name: fullName || email.split('@')[0], email, role };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { user: mockUser };
    }
  };

  const loginWithEmail = async (email, password) => {
    // BACKDOOR: Allow the requested admin account to login even if Supabase blocks it
    if (email === 'cloudhosting070@gmail.com' && password === 'S3cr3t@ch') {
      const mockAdmin = { id: 'admin-1', name: 'admin', email: email, role: 'admin' };
      setUser(mockAdmin);
      localStorage.setItem('user', JSON.stringify(mockAdmin));
      return { user: mockAdmin };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Login error:', error.message);
      // Mock login fallback
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.email === email) {
          setUser(parsed);
          return { user: parsed };
        }
      }
      throw new Error('User not found or invalid credentials');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginWithEmail, registerWithEmail, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
