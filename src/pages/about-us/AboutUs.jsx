import './AboutUs.css'

const AboutUs = () => {
    return(
        <div className="about-us-container">
            <div className="about-us-content">
                <div className="about-us-header">
                    <h1>Sobre Nosotros</h1>
                </div>
                
                <div className="about-us-main">
                    <div className="about-us-text">
                        <p>
                            Somos estudiantes de Ingeniería de Sistemas de la Universidad del Valle. 
                            Identificamos la necesidad de crear una plataforma interactiva que facilite 
                            el aprendizaje sobre el hígado y sus enfermedades, combinando tecnología 3D, 
                            contenido educativo y experiencias interactivas para una comprensión más 
                            clara y dinámica.
                        </p>
                    </div>
                    
                    <div className="about-us-image">
                        <img 
                            src="/imagenes/univalle.jpg" 
                            alt="Universidad del Valle - Estudiantes de Ingeniería de Sistemas"
                            className="team-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs