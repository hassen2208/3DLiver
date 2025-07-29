import { NavLink, useNavigate } from 'react-router';
import { CiSearch } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from '../../contexts/SupabaseAuthContext';
import { useState } from 'react';
import './Header.css';

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

  return (
    <header className='header'>
      <div className='header-left'>
        <div className='hamburger-menu' onClick={toggleMenu}>
          <div className='bar'></div>
          <div className='bar'></div>
          <div className='bar'></div>
        </div>
        <NavLink to="/" className="home-header-button" aria-label='Ir al inicio'>
          <img src='/imagenes/logo/3DLIVER Logo.svg' alt='Inicio' className='logo-header'/>
          <img src='/imagenes/logo/3DLIVER Tipografia.svg' alt='3DLIVER' className='logo-text-header'/>
        </NavLink>
      </div>
      <div className='search-container'>
        <input type='search' className='search-input' placeholder='Buscar'/>
        <button className='search-button'>
          <CiSearch className='search-icon'/>
        </button>
      </div>
      <div className='user-container'>
        {currentUser ? (
          <>
            <div className='notification-container'>
              <button className='notification-button'>
                <IoMdNotificationsOutline className='notification-icon'/>
              </button>
            </div>
            <div className='user-profile' onClick={toggleUserMenu}>
              <div className='user-info'>
                <span className='user-name'>
                  {currentUser.displayName || currentUser.email?.split('@')[0] || 'Usuario'}
                </span>
                <img src='/imagenes/user/user.png' alt="Perfil de usuario" className='user-avatar'/>
              </div>
              {showUserMenu && (
                <div className='user-dropdown'>
                  <NavLink to="/quiz-history" className='dropdown-link' onClick={() => setShowUserMenu(false)}>
                    📊 Mi Historial
                  </NavLink>
                  <button onClick={handleLogout} className='logout-button'>
                    <FiLogOut className='logout-icon'/>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='auth-buttons'>
            <NavLink to="/login" className='login-btn'>
              Iniciar Sesión con Google
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;