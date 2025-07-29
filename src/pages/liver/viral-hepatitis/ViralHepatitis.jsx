import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import LiverModel from "../LiverModelDisease"
import { IoIosHelpCircleOutline } from "react-icons/io"
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md"
import "./ViralHepatitis.css"
import "../controls.css"

export default function ViralHepatitis() {
  const [isHealthy, setIsHealthy] = useState(false)
  const [showInstructionsPopover, setShowInstructionsPopover] = useState(false)
  const [activeTab, setActiveTab] = useState("what-is")
  const [showHtmlInstructions, setShowHtmlInstructions] = useState(false)
  const [showTreatment, setShowTreatment] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const iconRef = useRef(null)
  const popoverRef = useRef(null)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleTreatmentToggle = () => {
    setShowTreatment(true)
    setIsHealthy(false)
  }

  const handleHepatitis = () => {
    setIsHealthy(false)
    setShowTreatment(false)
  }

  const handleHealthyLiver = () => {
    setIsHealthy(true)
    setShowInstructionsPopover(false)
    setShowTreatment(false)
  }

  const toggleInstructionsPopover = () => {
    setShowHtmlInstructions(!showHtmlInstructions)
    setShowInstructionsPopover(false)
  }

  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
  }

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

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [showInstructionsPopover])

  const lessons = [
    {
      id: "what-is",
      title: "¿Qué es la hepatitis viral?",
      icon: "🦠",
      content: (
        <div className="lesson-content">
          <div className="content-highlight">
            <p>
              La <strong>hepatitis viral</strong> es una inflamación del hígado causada por virus. Existen varios tipos,
              siendo los más comunes los virus de la hepatitis A, B, C, D y E.
            </p>
          </div>

          <div className="content-section">
            <h4>🔴 Tipos más preocupantes</h4>
            <p>
              La hepatitis B y C son las más preocupantes, ya que pueden llevar a <em>cirrosis</em> y{" "}
              <em>cáncer de hígado</em>.
            </p>
          </div>

          <div className="content-section">
            <h4>💧 Transmisión por agua/alimentos</h4>
            <p>
              La hepatitis A y E son generalmente autolimitadas y se transmiten principalmente a través de agua o
              alimentos contaminados.
            </p>
          </div>

          <div className="content-section">
            <h4>🩸 Transmisión por fluidos corporales</h4>
            <p>
              La hepatitis B y C se transmiten a través de fluidos corporales, como sangre y relaciones sexuales
              desprotegidas.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "symptoms",
      title: "Síntomas comunes",
      icon: "⚕️",
      content: (
        <div className="lesson-content">
          <div className="content-highlight">
            <p>Los síntomas de la hepatitis viral pueden variar según el tipo y la gravedad de la infección.</p>
          </div>

          <div className="content-section">
            <h4>🔍 Síntomas principales</h4>
            <div className="symptoms-grid">
              <div className="symptom-card">
                <span className="symptom-icon">😴</span>
                <span>Fatiga</span>
              </div>
              <div className="symptom-card">
                <span className="symptom-icon">🟡</span>
                <span>Ictericia (color amarillento)</span>
              </div>
              <div className="symptom-card">
                <span className="symptom-icon">🤕</span>
                <span>Dolor abdominal</span>
              </div>
              <div className="symptom-card">
                <span className="symptom-icon">🍽️</span>
                <span>Pérdida de apetito</span>
              </div>
              <div className="symptom-card">
                <span className="symptom-icon">🤢</span>
                <span>Náuseas y vómitos</span>
              </div>
            </div>
          </div>

          <div className="content-warning">
            <h4>⚠️ Importante</h4>
            <p>Algunas personas pueden no presentar síntomas, especialmente en las etapas iniciales de la infección.</p>
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
            <p>El tratamiento de la hepatitis viral depende del tipo de virus y la gravedad de la infección.</p>
          </div>

          <div className="content-section">
            <h4>🔬 Tratamientos específicos</h4>
            <div className="treatment-cards">
              <div className="treatment-card hepatitis-b">
                <h5>Hepatitis B y C</h5>
                <p>
                  Tratamientos antivirales específicos que pueden ayudar a reducir la carga viral y prevenir el daño
                  hepático.
                </p>
              </div>
              <div className="treatment-card hepatitis-a">
                <h5>Hepatitis A y E</h5>
                <p>
                  Generalmente no requieren tratamiento específico. Es importante mantener buena hidratación y reposo.
                </p>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h4>🛡️ Prevención</h4>
            <div className="prevention-list">
              <div className="prevention-item">
                <span className="prevention-icon">💉</span>
                <div>
                  <strong>Vacunas disponibles</strong>
                  <p>Para hepatitis A y B</p>
                </div>
              </div>
              <div className="prevention-item">
                <span className="prevention-icon">🔒</span>
                <div>
                  <strong>Hepatitis C</strong>
                  <p>No tiene vacuna, pero se pueden tomar medidas preventivas</p>
                </div>
              </div>
              <div className="prevention-item">
                <span className="prevention-icon">🧼</span>
                <div>
                  <strong>Hepatitis E</strong>
                  <p>Prevención mediante mejores condiciones de higiene</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="viral-hepatitis-container">
      {/* Migaja de pan */}
      <nav className="hepatitis-breadcrumbs">
        <Link to="/"> Inicio / </Link>
        <Link to="/higado"> Enfermedades /</Link>
        <span>Hepatitis Viral</span>
      </nav>

      <h2 className="hepatitis-title"> HEPATITIS VIRAL </h2>

      <div className="hepatitis-model-wrapper">
        {/* Solo mostrar el icono de ayuda en desktop */}
        {!isMobile && (
          <div className="hepatitis-instructions-help-container">
            <button
              ref={iconRef}
              className="hepatitis-help-icon"
              onClick={toggleInstructionsPopover}
              aria-label="Mostrar controles del modelo 3D"
            >
              <IoIosHelpCircleOutline />
            </button>

            {showInstructionsPopover && (
              <div ref={popoverRef} className="hepatitis-instructions-popover">
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

        <div className="hepatitis-model-container">
          <LiverModel
            modelPath={
              showTreatment
                ? "/modelos/medicine/MedicineModel.glb"
                : isHealthy
                  ? "/modelos/Liver/healthy-liver.glb"
                  : "/modelos/hepatitis/HepatitsLiver.glb"
            }
            showHtmlInstructions={showHtmlInstructions}
            isHealthy={isHealthy}
          />
        </div>

        <div className="hepatitis-toggle-container">
          <button
            className={`hepatitis-toggle-button ${isHealthy && !showTreatment ? "active" : ""}`}
            onClick={handleHealthyLiver}
          >
            <span className="button-icon">❤️</span>
            <span className="button-text">{isMobile ? "Sano" : "Hígado sano"}</span>
          </button>
          <button
            className={`hepatitis-toggle-button ${!isHealthy && !showTreatment ? "active" : ""}`}
            onClick={handleHepatitis}
          >
            <span className="button-icon">🦠</span>
            <span className="button-text">{isMobile ? "Hepatitis" : "Hepatitis Viral"}</span>
          </button>
          <button
            className={`hepatitis-toggle-button ${showTreatment ? "active" : ""}`}
            onClick={handleTreatmentToggle}
          >
            <span className="button-icon">💊</span>
            <span className="button-text">Tratamiento</span>
          </button>
        </div>

        <div className="hepatitis-scroll-container">
          <button
            className="hepatitis-scroll-button"
            onClick={() => {
              const section = document.getElementById("lecciones")
              if (section) section.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <span className="scroll-button-icon">📚</span>
            <span>{isMobile ? "Ver lecciones" : "Explorar lecciones"}</span>
            <MdOutlineKeyboardDoubleArrowDown />
          </button>
        </div>

        <section className="hepatitis-lesson-section" id="lecciones">
          {/* Vista móvil - Acordeón */}
          <div className="hepatitis-mobile-accordion">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="hepatitis-accordion-item">
                <button
                  className={`hepatitis-accordion-header ${activeTab === lesson.id ? "active" : ""}`}
                  onClick={() => handleTabClick(lesson.id)}
                >
                  <div className="accordion-header-content">
                    <span className="accordion-icon">{lesson.icon}</span>
                    <span className="accordion-title">{lesson.title}</span>
                  </div>
                  <svg
                    className={`hepatitis-accordion-arrow ${activeTab === lesson.id ? "rotated" : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                <div className={`hepatitis-accordion-content ${activeTab === lesson.id ? "active" : ""}`}>
                  <div className="hepatitis-accordion-body">{lesson.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Vista desktop - Tabs */}
          <div className="hepatitis-desktop-tabs">
            <div className="hepatitis-tabs-header">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  className={`hepatitis-tab-button ${activeTab === lesson.id ? "active" : ""}`}
                  onClick={() => handleTabClick(lesson.id)}
                >
                  <span className="tab-icon">{lesson.icon}</span>
                  <span>{lesson.title}</span>
                </button>
              ))}
            </div>

            <div className="hepatitis-tab-content">
              {lessons.map(
                (lesson) =>
                  activeTab === lesson.id && (
                    <div key={lesson.id} className="hepatitis-tab-pane">
                      {lesson.content}
                    </div>
                  ),
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
