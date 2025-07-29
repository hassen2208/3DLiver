import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseQuizService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        return { success: false, error: getErrorMessage(error.message) };
      }

      return { success: true };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return { success: false, error: 'Error inesperado al iniciar sesión' };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getErrorMessage = (error) => {
    switch (error) {
      case 'Invalid login credentials':
        return 'Credenciales de inicio de sesión inválidas';
      case 'Email not confirmed':
        return 'Email no confirmado';
      case 'Too many requests':
        return 'Demasiados intentos. Intenta más tarde.';
      default:
        return 'Error al iniciar sesión con Google';
    }
  };

  const value = {
    user,
    currentUser: user,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
