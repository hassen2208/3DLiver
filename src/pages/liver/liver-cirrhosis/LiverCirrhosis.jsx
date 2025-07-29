import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import LiverModel from "../LiverModelDisease" // Asegúrate de que la ruta sea correcta
import { IoIosHelpCircleOutline } from "react-icons/io"
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md"
import "./LiverCirrhosis.css" // Importa los nuevos estilos
import "../controls.css" // Si tienes estilos de controles adicionales

export default function LiverCirrhosis() {
  const [isHealthy, setIsHealthy] = useState(false)
  const [showInstructionsPopover, setShowInstructionsPopover] = useState(false)
  const [activeTab, setActiveTab] = useState("what-is")
  const [isMobile, setIsMobile] = useState(false)

  const iconRef = useRef(null)
  const popoverRef = useRef(null)

  // Detectar si la vista es móvil para cambiar entre tabs y acordeón
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
  
  // Handlers para los botones de estado del hígado
  const handleCirrhosisLiver = () => setIsHealthy(false)
  const handleHealthyLiver = () => setIsHealthy(true)

  const toggleInstructionsPopover = () => {
    setShowInstructionsPopover(!showInstructionsPopover)
  }

  // Cambiar la pestaña/acordeón activo
  const handleTabClick = (tabId) => {
    setActiveTab(activeTab === tabId ? null : tabId) // Permite cerrar el acordeón
  }

  // Cerrar popover de instrucciones al hacer clic fuera
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        showInstructionsPopover &&
        iconRef.current &&
        !iconRef.current.contains(event.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target)
      ) {
        setShowInstructionsPopover(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [showInstructionsPopover])
  
  // Contenido de las lecciones de Cirrosis
  const lessons = [
    {
      id: "what-is",
      title: "¿Qué es la Cirrosis?",
      icon: "🧱",
      content: (
        <div className="lesson-content">
          <div className="content-highlight">
            <p>
              La <strong>cirrosis hepática</strong> es una condición crónica e irreversible donde el tejido del hígado sano es reemplazado por <strong>tejido cicatricial</strong>.
            </p>
          </div>
          <div className="content-section">
            <h4>Resultado de Daño Prolongado</h4>
            <p>
              Es la etapa final de un daño hepático continuo, que puede ser causado por diversas condiciones como el consumo excesivo de alcohol, hepatitis viral crónica o enfermedad del hígado graso.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "stages-symptoms",
      title: "Etapas y Síntomas",
      icon: "⚕️",
      content: (
        <div className="lesson-content">
          <div className="content-section">
            <h4>Etapas de la Cirrosis</h4>
            <ul>
                <li><strong>Compensada:</strong> El hígado, aunque cicatrizado, todavía puede realizar la mayoría de sus funciones vitales.</li>
                <li><strong>Descompensada:</strong> El daño es tan extenso que el hígado ya no puede funcionar adecuadamente, llevando a complicaciones graves.</li>
                <li><strong>Insuficiencia hepática:</strong> Es la fase final donde el hígado pierde casi toda su capacidad de funcionar.</li>
            </ul>
          </div>
          <div className="content-warning">
            <h4>⚠️ Síntomas Comunes</h4>
            <p>En etapas tempranas puede no haber síntomas. Conforme avanza, pueden aparecer:</p>
            <div className="symptoms-grid">
              <div className="symptom-card"><span className="symptom-icon">😴</span> Fatiga y debilidad</div>
              <div className="symptom-card"><span className="symptom-icon">🟡</span> Ictericia (piel y ojos amarillos)</div>
              <div className="symptom-card"><span className="symptom-icon">🎈</span> Hinchazón en abdomen y piernas</div>
              <div className="symptom-card"><span className="symptom-icon">🧠</span> Confusión mental (encefalopatía)</div>
              <div className="symptom-card"><span className="symptom-icon">🩸</span> Facilidad para sangrar o tener moretones</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "treatment",
      title: "Tratamiento",
      icon: "💊",
      content: (
        <div className="lesson-content">
            <div className="content-highlight">
                <p>El tratamiento se enfoca en detener el daño, manejar los síntomas y prevenir complicaciones.</p>
            </div>
          <div className="content-section">
            <h4>Enfoques Principales</h4>
            <div className="treatment-list">
              <div className="treatment-item">
                <span className="treatment-icon">🎯</span>
                <p><strong>Tratar la causa subyacente:</strong> Controlar el alcoholismo, tratar la hepatitis, manejar el hígado graso, etc.</p>
              </div>
              <div className="treatment-item">
                <span className="treatment-icon">🥗</span>
                <p><strong>Cambios en el estilo de vida:</strong> Dieta baja en sodio, nutrición adecuada y evitar alcohol y drogas tóxicas para el hígado.</p>
              </div>
              <div className="treatment-item">
                <span className="treatment-icon">🩺</span>
                <p><strong>Control de complicaciones:</strong> Medicamentos para manejar la hinchazón, la presión portal y el riesgo de infecciones.</p>
              </div>
              <div className="treatment-item">
                <span className="treatment-icon">🔄</span>
                <p><strong>Trasplante hepático:</strong> En casos de insuficiencia hepática avanzada, es la única opción curativa.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="liver-cirrhosis-container">
      {/* Migaja de pan */}
      <nav className="cirrhosis-breadcrumbs">
        <Link to="/"> Inicio / </Link>
        <Link to="/higado"> Enfermedades /</Link>
        <span>Cirrosis Hepática</span>
      </nav>

      <h2 className="cirrhosis-title">CIRROSIS HEPÁTICA</h2>

      <div className="cirrhosis-model-wrapper">
        {/* Icono de ayuda solo en desktop */}
        {!isMobile && (
          <div className="cirrhosis-instructions-help-container">
            <button
              ref={iconRef}
              className="cirrhosis-help-icon"
              onClick={toggleInstructionsPopover}
              aria-label="Mostrar controles del modelo 3D"
            >
              <IoIosHelpCircleOutline />
            </button>
            {showInstructionsPopover && (
              <div ref={popoverRef} className="cirrhosis-instructions-popover">
                <p>
                  🖱 Usa el mouse para explorar el modelo 3D:
                  <br />• Haz clic y arrastra para rotar
                  <br />• Usa scroll para hacer zoom
                  <br />• Haz clic derecho para mover la vista
                </p>
              </div>
            )}
          </div>
        )}

        <div className="cirrhosis-model-container">
          <LiverModel
            modelPath={
              isHealthy
                ? "/modelos/fattyliver/healthy-liver.glb"
                : "/modelos/livercirrhosis/CirrosisLiver.glb"
            }
            scale={isHealthy ? 0.09 : 0.09} // Ajusta la escala si es necesario
          />
        </div>

        <div className="cirrhosis-toggle-container">
          <button
            className={`cirrhosis-toggle-button ${isHealthy ? "active" : ""}`}
            onClick={handleHealthyLiver}
          >
            <span className="button-icon">❤️</span>
            <span className="button-text">{isMobile ? "Sano" : "Ver Hígado Sano"}</span>
          </button>
          <button
            className={`cirrhosis-toggle-button ${!isHealthy ? "active" : ""}`}
            onClick={handleCirrhosisLiver}
          >
            <span className="button-icon">🧱</span>
            <span className="button-text">{isMobile ? "Cirrosis" : "Ver Hígado con Cirrosis"}</span>
          </button>
        </div>

        <div className="cirrhosis-scroll-container">
          <a
            href="#lecciones"
            className="cirrhosis-scroll-button"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById("lecciones").scrollIntoView({ behavior: "smooth" })
            }}
          >
            <span className="scroll-button-icon">📚</span>
            <span>{isMobile ? "Ver Lecciones" : "Explorar Lecciones"}</span>
            <MdOutlineKeyboardDoubleArrowDown />
          </a>
        </div>

        <section className="cirrhosis-lesson-section" id="lecciones">
          {/* Vista móvil - Acordeón */}
          <div className="cirrhosis-mobile-accordion">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="cirrhosis-accordion-item">
                <button
                  className={`cirrhosis-accordion-header ${activeTab === lesson.id ? "active" : ""}`}
                  onClick={() => handleTabClick(lesson.id)}
                >
                  <div className="accordion-header-content">
                    <span className="accordion-icon">{lesson.icon}</span>
                    <span className="accordion-title">{lesson.title}</span>
                  </div>
                  <svg className={`cirrhosis-accordion-arrow ${activeTab === lesson.id ? "rotated" : ""}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                <div className={`cirrhosis-accordion-content ${activeTab === lesson.id ? "active" : ""}`}>
                  <div className="cirrhosis-accordion-body">{lesson.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Vista desktop - Tabs */}
          <div className="cirrhosis-desktop-tabs">
            <div className="cirrhosis-tabs-header">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  className={`cirrhosis-tab-button ${activeTab === lesson.id ? "active" : ""}`}
                  onClick={() => setActiveTab(lesson.id)}
                >
                  <span className="tab-icon">{lesson.icon}</span>
                  <span>{lesson.title}</span>
                </button>
              ))}
            </div>
            <div className="cirrhosis-tab-content">
              {lessons.map(
                (lesson) =>
                  activeTab === lesson.id && (
                    <div key={lesson.id} className="cirrhosis-tab-pane">
                      {lesson.content}
                    </div>
                  )
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}