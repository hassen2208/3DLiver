import { NavLink } from 'react-router';
import { GiLiver } from 'react-icons/gi';
import { IoMdHome } from "react-icons/io";
import { RiBookShelfLine } from "react-icons/ri";
import { HiLightBulb } from "react-icons/hi";
import { FaEnvelope, FaTrophy } from "react-icons/fa";
import { CiCircleInfo } from "react-icons/ci";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleSubmenu = () => setIsSubmenuOpen(!isSubmenuOpen);

  return (
    <aside className={`sidebar ${isMenuOpen ? 'active' : 'hidden'}`}>
      <div className='sidebar-button-container'>
        <button className='sidebar-button' onClick={closeMenu} type="button">
        </button>
      </div>
      <div className='sidebar-logo'>
        <img src="/imagenes/logo/3DLIVER Logotipo Blanco.svg" alt="3DLIVER logo" />
      </div>
      <nav className='sidebar-menu'>
        <NavLink to="/" className="sidebar-item">
          <IoMdHome className='sidebar-icon'/> Inicio
        </NavLink>
        <div className="sidebar-item-with-submenu">
          <div className="sidebar-item submenu-trigger" onClick={toggleSubmenu}>
            <GiLiver className='sidebar-icon'/>
            Enfermedades
            {isSubmenuOpen ? (
              <IoChevronUp className='submenu-icon' />
            ) : (
              <IoChevronDown className='submenu-icon' />
            )}
          </div>
          <div className={`submenu ${isSubmenuOpen ? 'open' : ''}`}>
            <NavLink to="/higado/hepatitis-viral" className="submenu-item">
              Hepatitis Viral
            </NavLink>
            <NavLink to="/higado/higado-graso" className="submenu-item">
              Higado Graso
            </NavLink>
            <NavLink to="/higado/cancer-higado" className="submenu-item">
              Cancer De Higado
            </NavLink>
            <NavLink to="/higado/cirrosis-hepatica" className="submenu-item">
              Cirrosis Hepática
            </NavLink>
          </div>
        </div>
        <NavLink to="/quiz" className="sidebar-item">
          <HiLightBulb className='sidebar-icon'/> Quiz
        </NavLink>
        <NavLink to="/resultados-publicos" className="sidebar-item">
          <FaTrophy className='sidebar-icon'/> Resultados Públicos
        </NavLink>
        <NavLink to="/recursos" className="sidebar-item">
          <RiBookShelfLine className='sidebar-icon'/>
          Recursos
        </NavLink>
        <NavLink to="/contacto" className="sidebar-item">
          <FaEnvelope className='sidebar-icon' />
          Contactos
        </NavLink>
        <NavLink to="/sobre-nosotros" className="sidebar-item">
          <CiCircleInfo className='sidebar-icon'/>
          Acerca de nosotros
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;