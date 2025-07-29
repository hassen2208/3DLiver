import { useAuth } from '../contexts/SupabaseAuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a1929, #1a4c72, #2a5c82)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          Cargando...
        </div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
