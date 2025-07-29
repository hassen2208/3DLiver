import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LiverModel from "../LiverModelDisease";
import TreatmentStage from "./TreatmentStage";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import "./FattyLiver.css";
import "./TreatmentStage.css";
import "../controls.css";
import { Text3D } from '@react-three/drei'


export default function FattyLiver() {
  const [isHealthy, setIsHealthy] = useState(false)
  const [isAdvancedFatty, setIsAdvancedFatty] = useState(false)

  const [showInstructionsPopover, setShowInstructionsPopover] = useState(false)
  const [activeTab, setActiveTab] = useState("what-is")
  const [showHtmlInstructions, setShowHtmlInstructions] = useState(false)
  const [showTreatment, setShowTreatment] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [diseaseStage, setDiseaseStage] = useState(0) // 0: early, 1: moderate, 2: full

  const iconRef = useRef(null)
  const popoverRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // F key functionality to advance disease stages
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "f" && !isHealthy && !showTreatment) {
        setDiseaseStage(prev => (prev + 1) % 3) // Cycle through 0, 1, 2
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isHealthy, showTreatment])

  const handleTreatmentToggle = () => {
    setShowTreatment(true)
    setIsHealthy(false)
    setDiseaseStage(0)
  }

  const handleCloseTreatment = () => {
    setShowTreatment(false)
  }

  const handleFatty = () => {
    setIsHealthy(false)
    setShowTreatment(false)
    setDiseaseStage(0)
  }

  const handleHealthyLiver = () => {
    setIsHealthy(true)
    setShowInstructionsPopover(false)
    setShowTreatment(false)
    setDiseaseStage(0)
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

  useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === "f") {
      setIsAdvancedFatty((prev) => !prev)
    }
  }
  window.addEventListener("keydown", handleKeyDown)
  return () => window.removeEventListener("keydown", handleKeyDown)
}, [])

  const lessons = [
    {
      id: "what-is",
      title: "¿Qué es el hígado graso?",
      icon: "🧈",
      content: (
        <div className="lesson-content">
          <div className="content-highlight">
            <p>
              El <strong>hígado graso</strong> es una condición donde se acumula grasa en las células hepáticas, lo que puede interferir con el funcionamiento normal del órgano.
            </p>
          </div>
          <div className="content-section">
            <h4>🍔 Causas comunes</h4>
            <p>Incluyen el consumo excesivo de alcohol, obesidad, diabetes tipo 2 y dieta alta en grasas.</p>
          </div>
          <div className="content-section">
            <h4>🔬 Tipos</h4>
            <p>Existen dos tipos: el hígado graso alcohólico y el no alcohólico (NAFLD).</p>
          </div>
        </div>
      )
    },
    {
      id: "symptoms",
      title: "Síntomas frecuentes",
      icon: "📋",
      content: (
        <div className="lesson-content">
          <div className="content-section">
            <h4>🔍 Síntomas principales</h4>
            <div className="symptoms-grid">
              <div className="symptom-card"><span className="symptom-icon">😴</span> Fatiga</div>
              <div className="symptom-card"><span className="symptom-icon">⚖️</span> Pérdida de peso</div>
              <div className="symptom-card"><span className="symptom-icon">📈</span> Aumento de enzimas hepáticas</div>
              <div className="symptom-card"><span className="symptom-icon">🥴</span> Malestar general</div>
            </div>
          </div>
          <div className="content-warning">
            <h4>⚠️ Importante</h4>
            <p>Puede no presentar síntomas hasta estar en etapas avanzadas como esteatosis grave o cirrosis.</p>
          </div>
        </div>
      )
    },
    {
      id: "treatment",
      title: "Tratamiento",
      icon: "💊",
      content: (
        <div className="lesson-content">
          <div className="content-highlight">
            <p>El tratamiento se basa principalmente en cambios de estilo de vida y control de condiciones asociadas.</p>
          </div>
          <div className="content-section">
            <h4>Enfoques terapéuticos</h4>
            <div className="treatment-list">
              <div className="treatment-item">
                <span className="treatment-icon">🏃‍♂️</span>
                <p>Ejercicio regular y pérdida de peso progresiva.</p>
              </div>
              <div className="treatment-item">
                <span className="treatment-icon">🥗</span>
                <p>Alimentación equilibrada baja en grasas saturadas y azúcares.</p>
              </div>
              <div className="treatment-item">
                <span className="treatment-icon">💉</span>
                <p>Tratamiento de condiciones subyacentes como diabetes o colesterol alto.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
  id: "prevencion",
  title: "Prevención",
  icon: "🛡️",
  content: (
    <div className="lesson-content">
      <div className="content-highlight">
        <p>Mantener un estilo de vida saludable ayuda a prevenir el hígado graso.</p>
      </div>
      <div className="content-section">
        <h4>✅ Recomendaciones:</h4>
        <ul>
          <li>• Evita el alcohol en exceso</li>
          <li>• Mantén un peso saludable</li>
          <li>• Realiza actividad física regular</li>
        </ul>
      </div>
    </div>
  )
}
  ]

  return (
    <div className="fatty-container">
      <nav className="fatty-breadcrumbs">
        <Link to="/">Inicio / </Link>
        <Link to="/higado">Enfermedades / </Link>
        <span>Hígado Graso</span>
      </nav>

      <h2 className="fatty-title">HÍGADO GRASO</h2>

      <div className="fatty-model-wrapper">
        {!isMobile && (
          <div className="fatty-instructions-help-container">
            <button
              ref={iconRef}
              className="fatty-help-icon"
              onClick={toggleInstructionsPopover}
              aria-label="Mostrar controles del modelo 3D"
            >
              <IoIosHelpCircleOutline />
            </button>
            {showInstructionsPopover && (
              <div ref={popoverRef} className="fatty-instructions-popover">
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

        <div className="fatty-model-container">
          {showTreatment ? (
            <TreatmentStage 
              onCloseTreatment={handleCloseTreatment}
            />
          ) : (
            <LiverModel
              modelPath={
                isHealthy
                  ? "/modelos/Liver/healthy-liver.glb"
                  : diseaseStage === 0
                  ? "/modelos/fattyliver/early-fatty-liver.glb"
                  : diseaseStage === 1
                  ? "/modelos/fattyliver/full-fatty-liver.glb"
                  : "/modelos/fattyliver/fatty-liver.glb"
              }
              showHtmlInstructions={showHtmlInstructions}
              isHealthy={isHealthy}
              diseaseStage={diseaseStage}
              showTreatment={showTreatment}
            />
          )}
        </div>

        <div className="fatty-toggle-container">
          <button
            className={`fatty-toggle-button ${isHealthy && !showTreatment ? "active" : ""}`}
            onClick={handleHealthyLiver}
          >
            <span className="button-icon">❤️</span>
            <span className="button-text">{isMobile ? "Sano" : "Hígado sano"}</span>
          </button>
          <button
            className={`fatty-toggle-button ${!isHealthy && !showTreatment ? "active" : ""}`}
            onClick={handleFatty}
          >
            <span className="button-icon">🧈</span>
            <span className="button-text">{isMobile ? "Graso" : "Hígado graso"}</span>
          </button>

          <button
            className={`fatty-toggle-button ${showTreatment ? "active" : ""}`}
            onClick={handleTreatmentToggle}
          >
            <span className="button-icon">💊</span>
            <span className="button-text">Tratamiento</span>
          </button>
        </div>

        <div className="fatty-scroll-container">
          <button
            className="fatty-scroll-button"
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

        <section className="fatty-lesson-section" id="lecciones">
          <div className="fatty-mobile-accordion">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="fatty-accordion-item">
                <button
                  className={`fatty-accordion-header ${activeTab === lesson.id ? "active" : ""}`}
                  onClick={() => handleTabClick(lesson.id)}
                >
                  <div className="accordion-header-content">
                    <span className="accordion-icon">{lesson.icon}</span>
                    <span className="accordion-title">{lesson.title}</span>
                  </div>
                  <svg
                    className={`fatty-accordion-arrow ${activeTab === lesson.id ? "rotated" : ""}`}
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                <div className={`fatty-accordion-content ${activeTab === lesson.id ? "active" : ""}`}>
                  <div className="fatty-accordion-body">{lesson.content}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="fatty-desktop-tabs">
            <div className="fatty-tabs-header">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  className={`fatty-tab-button ${activeTab === lesson.id ? "active" : ""}`}
                  onClick={() => handleTabClick(lesson.id)}
                >
                  <span className="tab-icon">{lesson.icon}</span>
                  <span>{lesson.title}</span>
                </button>
              ))}
            </div>

            <div className="fatty-tab-content">
              {lessons.map(
                (lesson) =>
                  activeTab === lesson.id && (
                    <div key={lesson.id} className="fatty-tab-pane">
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
