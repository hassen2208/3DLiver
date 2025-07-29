import { Outlet } from 'react-router';
import { Link } from 'react-router-dom'
import LiverModel from './LiverModel'
import './Liver.css';

const Liver = () => {

    return (
        <div className="main-content-area">
            {/* Migaja de pan*/}
            <nav className='breadcrumbs'>
                <Link to="/">Inicion /</Link>
                <span>Enfermedades</span>
            </nav>

            {/* Sección de Estadísticas/Tarjetas Superiores */}
            <div className="stats-section">
                <div className="stat-card">
                    <h3>Total Lecciones</h3>
                    <p>60</p>
                </div>
                <div className="stat-card">
                    <h3>Completadas</h3>
                    <p>16</p>
                </div>
                <div className="stat-card">
                    <h3>Pendientes</h3>
                    <p>43</p>
                </div>
                <div className="stat-card">
                    <h3>Quiz</h3>
                    <p>15</p>
                </div>
            </div>

            {/* Sección Central con el Modelo 3D */}
            <div className="model-display-section">
                <div className="liver-model-placeholder">
                    <LiverModel 
                        modelPath={'/modelos/Liver/healthy-liver.glb'}
                        width={800}
                        height ={400}
                    />
                </div>
            </div>

            {/* Sección de Tarjetas de Enfermedades */}
            <div className="disease-cards-section">
                <h2>Haz click sobre la tarjeta para aprender más sobre esa enfermedad</h2>
                <div className="cards-grid">
                    <div className="disease-card" onClick={() => {window.location.href = '/higado/hepatitis-viral'}}>
                        <p>Hepatitis Viral</p>
                    </div>
                    <div className="disease-card" onClick={() => {window.location.href ='/higado/cirrosis-hepatica'}}>
                         <p>Cirrosis hepática</p>
                    </div>
                     <div className="disease-card" onClick={() => {window.location.href = '/higado/cancer-higado'}}>
                         <p>Cáncer de Hígado</p>
                    </div>
                    <div className="disease-card" onClick={() => {window.location.href = '/higado/higado-graso'}}>
                         <p>Hígado Graso</p>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Liver
