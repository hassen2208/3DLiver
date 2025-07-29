import React from 'react';
import { useNavigate } from 'react-router';
import LiverModelHome from './LiverModelHome';
import './Home.css';
import '../liver/Liver';

const Home = () => {
    const navigate =  useNavigate();

    const handleClick = () =>{
        navigate('/higado')
    }

    return (
        <div className='home-container'>
            <div className='top-section'>
                <div className='home-content'>
                    <div className='home-text'>
                        <img src='/imagenes/logo/3DLIVER Tipografia.svg' alt='3DLIVER' />
                        <p>
                            Conoce tu hígado, protege tu vida.
                            Aprende sobre las enfermedades hepáticas de manera interactiva y sencilla.
                        </p>
                        <button className='learn-button' onClick={handleClick}> Aprender </button>
                    </div>
                    <div className='liver-container'>
                        <LiverModelHome modelPath={'/modelos/fattyliver/healthy-liver.glb'} />
                    </div>
                </div>
            </div>

            {/* Bottom White Section */}
            <div className='bottom-section'>
                <h2> Mas cosas pronto... </h2>
                <p> colocar mas cosas, mas adelante </p>
            </div>
        </div>
    );
};

export default Home;