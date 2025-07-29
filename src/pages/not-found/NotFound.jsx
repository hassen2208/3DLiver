import './NotFound.css'


const NotFound = () => {
    // En este const se coloca todos los enlaces diposibles de la pagina
    const availableLinks =[
        {name: 'Inicio', url:'/'},
        {name: 'Enfermedades', url:'/higado'},
        {name: 'Quiz', url:'/quiz'},
        {name: 'Recursos', url:'/recursos'},
        {name: 'Sobre Nosotros', url:'/sobre-nosotros'},
        {name: 'Contacto', url:'/contacto'}
    ];

    return (
        <div className='error-container'>
            <div className='error-content'>
                <div className='error-text'>
                    <h1 className='error-title'> 
                        Ops!! No se encontro la pagina 
                    </h1>
                    <p className='error-message'> ERROR 404</p>

                    <div className='available-links'>
                        <p> Los siguiente links estan diposibles: </p>
                        <ul>
                            {availableLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.url}>{link.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className='error-image'>
                    <img 
                        src='/imagenes/Error_404/HigadoError.png'
                        alt='Imagen Error 404'
                    />
                </div>
            </div>
        </div>
    )
}

export default NotFound;