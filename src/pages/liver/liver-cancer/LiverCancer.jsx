import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import LiverModel from "../LiverModelDisease"
import { IoIosHelpCircleOutline } from "react-icons/io"
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md"
import "./LiverCancer.css"
import "../controls.css"

export default function LiverCancer() {
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

  const handleCancer = () => {
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
      title: "¿Qué es el cancer de higado?",
      icon: "💡",
      content: (
        <div className="lesson-content">
          <div className="content-highlight">
            <p>
              El <strong>cáncer de hígado</strong> es una enfermedad en la que se forman células malignas (cancerosas) en los tejidos del hígado. Puede ser primario (inicia en el hígado) o secundario/metastásico (se origina en otro órgano y se disemina al hígado). El tipo más común de cáncer hepático primario es el carcinoma hepatocelular (CHC).
            </p>
          </div>

          <div className="content-section">
            <h4>🚨 Causas y factores de riesgo 🚨</h4>
            <p>
              Algunos factores aumentan el riesgo de desarrollar cáncer de hígado, entre ellos:
            </p>
            <div className="causes-grid">
              <div className="cause-card">
                <span className="card-icon">🦠</span>
                <span>Infeccion cronica por hepatitis B o C</span>
              </div>
              <div className="cause-card">
                <span className="card-icon">🤕</span>
                <span>Cirrosis hepatica</span>
              </div>
              <div className="cause-card">
                <span className="card-icon">🍺</span>
                <span>Consumo excesivo de alcohol</span>
              </div>
              <div className="cause-card">
                <span className="card-icon">💉</span>
                <span>Diabetes y obesisdad</span>
              </div>
              <div className="cause-card">
                <span className="card-icon">🚬</span>
                <span>Tabaquismo</span>
              </div>
              <div className="cause-card">
                <span className="card-icon">☣️</span>
                <span>Aflatoxinas (toxinas en alimentos mal almacenados)</span>
              </div>
            </div>
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
            <p>A medida que progresa la enfermedad pueden aparecer los siguientes sintomas:</p>
          </div>

          <div className="content-section">
            <h4>🔍 Síntomas principales</h4>
            <div className="symptoms-grid">
            <div className="symptom-card">
                <span className="card-icon">🤕</span>
                <span>Dolor abdominal (en el lado derecho)</span>
              </div>
              <div className="symptom-card">
                <span className="card-icon">🔻</span>
                <span>Perdida de peso inexplicada</span>
              </div>
              <div className="symptom-card">
                <span className="card-icon">🍽️</span>
                <span>Pérdida de apetito</span>
              </div>
              <div className="symptom-card">
                <span className="card-icon">🟡</span>
                <span>Ictericia (color amarillento en pies y ojos)</span>
              </div>
              <div className="symptom-card">
                <span className="card-icon">😴</span>
                <span>Fatiga extrema</span>
              </div><div className="symptom-card">
                <span className="card-icon">↔️</span>
                <span>Hinchazon en el abdomen</span>
              </div>
              <div className="symptom-card">
                <span className="card-icon">🤢</span>
                <span>Náuseas y vómitos</span>
              </div>
            </div>
          </div>

          <div className="content-warning">
            <h4>⚠️ Importante</h4>
            <p>El cáncer de hígado en etapas tempranas puede no causar síntomas.</p>
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
            <p>El tratamiento depende de varios factores como: la etapa de la enfermedad, la función hepática, el estado general del paciente y la presencia de otras condiciones médicas.</p>
          </div>

          <div className="content-section">
            <h4>🔬 Tratamiento</h4>
            <div className="treatments-list">
              <div className="treatments-item">
                <span className="treatment-icon">🏥</span>
                <div>
                  <strong>Cirugía</strong>
                  <p> Resección del tumor o trasplante de hígado.</p>
                </div>
              </div>
              <div className="treatments-item">
                <span className="treatment-icon">☢️</span>
                <div>
                  <strong>Ablación</strong>
                  <p> Destrucción del tumor sin cirugía (radiofrecuencia, microondas, etc.).</p>
                </div>
              </div>
              <div className="treatments-item">
                <span className="treatment-icon">🧪</span>
                <div>
                  <strong>Quimioterapia</strong>
                  <p> Se usa en casos avanzados o no operables.</p>
                </div>
              </div>
              <div className="treatments-item">
                <span className="treatment-icon">💊</span>
                <div>
                  <strong>Terapia dirigida</strong>
                  <p> Medicamentos que bloquean el crecimiento de células cancerosas (ej. sorafenib).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="liver-cancer-container">
      {/* Migaja de pan */}
      <nav className="cancer-breadcrumbs">
        <Link to="/"> Inicio / </Link>
        <Link to="/higado"> Enfermedades /</Link>
        <span>Cáncer de hígado</span>
      </nav>

      <h2 className="cancer-title"> CÁNCER DE HÍGADO </h2>

      <div className="cancer-model-wrapper">
        {/* Solo mostrar el icono de ayuda en desktop */}
        {!isMobile && (
          <div className="cancer-instructions-help-container">
            <button
              ref={iconRef}
              className="cancer-help-icon"
              onClick={toggleInstructionsPopover}
              aria-label="Mostrar controles del modelo 3D"
            >
              <IoIosHelpCircleOutline />
            </button>

            {showInstructionsPopover && (
              <div ref={popoverRef} className="cancer-instructions-popover">
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
        
        <div className="cancer-model-container">
          <LiverModel
            modelPath={
              showTreatment
                ? "/modelos/cancerliver/chemo-treatment.glb"
                : isHealthy
                  ? "/modelos/Liver/healthy-liver.glb"
                  : "/modelos/cancerliver/CancerLiver.glb"
            }
            showHtmlInstructions={showHtmlInstructions}
            isHealthy={isHealthy}
            scale={
              showTreatment ? [0.1, 0.1, 0.1]: [1, 1, 1]
            }
          />
        </div>
        

        <div className="cancer-toggle-container">
          <button
            className={`cancer-toggle-button ${isHealthy && !showTreatment ? "active" : ""}`}
            onClick={handleHealthyLiver}
          >
            <span className="button-icon">❤️</span>
            <span className="button-text">{isMobile ? "Sano" : "Hígado sano"}</span>
          </button>
          <button
            className={`cancer-toggle-button ${!isHealthy && !showTreatment ? "active" : ""}`}
            onClick={handleCancer}
          >
            <span className="button-icon">🚩</span>
            <span className="button-text">{isMobile ? "Cáncer" : "Cáncer de hígado"}</span>
          </button>
          <button
            className={`cancer-toggle-button ${showTreatment ? "active" : ""}`}
            onClick={handleTreatmentToggle}
          >
            <span className="button-icon">💊</span>
            <span className="button-text">Tratamiento</span>
          </button>
        </div>

        <div className="cancer-scroll-container">
          <button
            className="cancer-scroll-button"
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

        <section className="cancer-lesson-section" id="lecciones">
          {/* Vista móvil - Acordeón */}
          <div className="cancer-mobile-accordion">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="cancer-accordion-item">
                <button
                  className={`cancer-accordion-header ${activeTab === lesson.id ? "active" : ""}`}
                  onClick={() => handleTabClick(lesson.id)}
                >
                  <div className="accordion-header-content">
                    <span className="accordion-icon">{lesson.icon}</span>
                    <span className="accordion-title">{lesson.title}</span>
                  </div>
                  <svg
                    className={`cancer-accordion-arrow ${activeTab === lesson.id ? "rotated" : ""}`}
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
                <div className={`cancer-accordion-content ${activeTab === lesson.id ? "active" : ""}`}>
                  <div className="cancer-accordion-body">{lesson.content}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Vista desktop - Tabs */}
          <div className="cancer-desktop-tabs">
            <div className="cancer-tabs-header">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  className={`cancer-tab-button ${activeTab === lesson.id ? "active" : ""}`}
                  onClick={() => handleTabClick(lesson.id)}
                >
                  <span className="tab-icon">{lesson.icon}</span>
                  <span>{lesson.title}</span>
                </button>
              ))}
            </div>

            <div className="cancer-tab-content">
              {lessons.map(
                (lesson) =>
                  activeTab === lesson.id && (
                    <div key={lesson.id} className="cancer-tab-pane">
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
