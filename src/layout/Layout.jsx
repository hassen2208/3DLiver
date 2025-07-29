import React, { useState} from 'react';
import Footer from './footer/Footer';
import Header from './header/Header';
import PropTypes from 'prop-types';
import Sidebar from './header/Sidebar';
import './Layout.css'


const Layout = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    return (
        <div className={`layout${isMenuOpen ? ' menu-open' : ''}`}>
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <div className="main-container">
                <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                <main className='layout-content'>{children}</main>
                <Footer />
            </div>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};
  

export default Layout