import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebaseConfig';

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      let errorMessage = 'Error al iniciar sesión con Google';
      
      switch (error.code) {
        case 'auth/operation-not-allowed':
          errorMessage = 'Google Sign-In no está habilitado. Contacta al administrador.';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'La ventana de inicio de sesión fue cerrada';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'La ventana emergente fue bloqueada por el navegador';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Solicitud de inicio de sesión cancelada';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet';
          break;
        case 'auth/invalid-api-key':
          errorMessage = 'Configuración de Firebase inválida';
          break;
        case 'auth/app-not-authorized':
          errorMessage = 'Aplicación no autorizada para este dominio';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
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
