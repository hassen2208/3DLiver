import { Link } from 'react-router';
import './Footer.css';

const Footer = () => {
  return (
    <footer className='footer'>
      <ul className='footer-links'>
        <li>
          <Link to='/higado/hepatitis-viral'>Hepatitis Viral</Link>
        </li>
        <li>
          <Link to='/higado/higado-graso'>Hígado Graso</Link>
        </li>
        <li>
          <Link to='/higado/cancer-higado'>Cáncer de Hígado</Link>
        </li>
        <li>
          <Link to='/higado/cirrosis-hepatica'>Cirrosis Hepática</Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
