import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Diseases.css';

const Diseases = () => {
    const navigate = useNavigate();

    const diseases = [
        {
            id: 'fatty-liver',
            title: 'Hígado Graso',
            description: 'Acumulación de grasa en las células del hígado que puede progresar a condiciones más graves.',
            image: '/modelos/fattyliver/fatty-liver.glb',
            imagePreview: '/imagenes/diseases/fatty-liver.jpg', // You'll need to add preview images
            route: '/higado/higado-graso',
            color: '#FFA726'
        },
        {
            id: 'liver-cancer',
            title: 'Cáncer de Hígado',
            description: 'Crecimiento anormal de células malignas en el hígado que requiere tratamiento especializado.',
            image: '/modelos/cancerliver/CancerLiver.glb',
            imagePreview: '/imagenes/diseases/liver-cancer.jpg',
            route: '/higado/cancer-higado',
            color: '#EF5350'
        },
        {
            id: 'viral-hepatitis',
            title: 'Hepatitis Viral',
            description: 'Inflamación del hígado causada por virus que puede ser aguda o crónica.',
            image: '/modelos/hepatitis/HepatitsLiver.glb',
            imagePreview: '/imagenes/diseases/hepatitis.jpg',
            route: '/higado/hepatitis-viral',
            color: '#AB47BC'
        },
        {
            id: 'liver-cirrhosis',
            title: 'Cirrosis Hepática',
            description: 'Cicatrización avanzada del hígado que puede llevar a insuficiencia hepática.',
            image: '/modelos/livercirrhosis/CirrosisLiver.glb',
            imagePreview: '/imagenes/diseases/cirrhosis.jpg',
            route: '/higado/cirrosis-hepatica',
            color: '#8D6E63'
        }
    ];

    const handleDiseaseClick = (route) => {
        navigate(route);
    };

    return (
        <div className="diseases-container">
            <div className="diseases-header">
                <h1>Enfermedades del Hígado</h1>
                <p>
                    Explora y aprende sobre las principales enfermedades hepáticas a través de 
                    modelos 3D interactivos y contenido educativo detallado.
                </p>
            </div>

            <div className="diseases-grid">
                {diseases.map((disease) => (
                    <div 
                        key={disease.id} 
                        className="disease-card"
                        onClick={() => handleDiseaseClick(disease.route)}
                        style={{ '--accent-color': disease.color }}
                    >
                        <div className="disease-image">
                            <div className="disease-placeholder" style={{ backgroundColor: disease.color }}>
                                {disease.id === 'fatty-liver' && (
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                                    </svg>
                                )}
                                {disease.id === 'liver-cancer' && (
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                                        <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
                                    </svg>
                                )}
                                {disease.id === 'viral-hepatitis' && (
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                                        <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M16.59,7.58L10,14.17L7.41,11.59L6,13L10,17L18,9L16.59,7.58Z"/>
                                    </svg>
                                )}
                                {disease.id === 'liver-cirrhosis' && (
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                                        <path d="M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div className="disease-content">
                            <h3>{disease.title}</h3>
                            <p>{disease.description}</p>
                            <div className="learn-more">
                                <span>Explorar →</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="diseases-footer">
                <div className="info-section">
                    <h3>¿Por qué es importante conocer sobre estas enfermedades?</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-icon">🩺</div>
                            <h4>Detección Temprana</h4>
                            <p>Conocer los síntomas puede ayudar en la detección temprana y el tratamiento oportuno.</p>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">🛡️</div>
                            <h4>Prevención</h4>
                            <p>Entender las causas te permite tomar medidas preventivas para proteger tu hígado.</p>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📚</div>
                            <h4>Educación</h4>
                            <p>El conocimiento te empodera para tomar decisiones informadas sobre tu salud.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Diseases;
