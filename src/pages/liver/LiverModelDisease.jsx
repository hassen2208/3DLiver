import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html, Box, Plane, KeyboardControls, PositionalAudio } from "@react-three/drei"
import * as THREE from "three"

// Hook para detectar el tamaño de pantalla
function useResponsive() {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 768 : false,
    isTablet: typeof window !== "undefined" ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
      })
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return screenSize
}

// Componente para el modelo 3D
function Model({ path, showInstructions, position = [0, 1, 0], screenSize, diseaseStage, showTreatment, isHealthy }) {
  const { scene } = useGLTF(path)
  const modelRef = useRef()
  const audioRef = useRef()
  const [isRotating, setIsRotating] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [modelPosition, setModelPosition] = useState(position)
  const [isHovered, setIsHovered] = useState(false)
  const [modelScale, setModelScale] = useState(1)
  const [showFButton, setShowFButton] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  // Control de la rotación del modelo con la tecla "R"
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "r") {
        setIsRotating((prev) => !prev)
      }
      // Nuevo evento de teclado - mover modelo con WASD
      if (event.key.toLowerCase() === "w") {
        setModelPosition(prev => [prev[0], prev[1], prev[2] - 0.5])
      }
      if (event.key.toLowerCase() === "s") {
        setModelPosition(prev => [prev[0], prev[1], prev[2] + 0.5])
      }
      if (event.key.toLowerCase() === "a") {
        setModelPosition(prev => [prev[0] - 0.5, prev[1], prev[2]])
      }
      if (event.key.toLowerCase() === "d") {
        setModelPosition(prev => [prev[0] + 0.5, prev[1], prev[2]])
      }
    }
    window.addEventListener("keypress", handleKeyPress)
    return () => window.removeEventListener("keypress", handleKeyPress)
  }, [])

  // Show F button hint for disease progression - ONLY for fatty liver, not healthy liver
  useEffect(() => {
    if (!showTreatment && !isHealthy && diseaseStage !== undefined) {
      setShowFButton(true)
      const timer = setTimeout(() => setShowFButton(false), 5000) // Hide after 5 seconds
      return () => clearTimeout(timer)
    } else {
      setShowFButton(false)
    }
  }, [diseaseStage, showTreatment, isHealthy, path])

  useFrame(() => {
    if (modelRef.current && isRotating) {
      modelRef.current.rotation.y += 0.005
    }
    // Efecto de hover - escala suave
    if (modelRef.current) {
      const targetScale = isHovered ? getModelScale() * 1.1 : getModelScale()
      modelRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene])

  // Escala responsiva del modelo
  const getModelScale = () => {
    if (screenSize.isMobile) return 3
    if (screenSize.isTablet) return 4
    return 5
  }

  // Nuevo evento onWheel para zoom personalizado
  const handleWheel = (event) => {
    event.stopPropagation()
    const delta = event.delta
    setModelScale(prev => Math.max(0.5, Math.min(3, prev + delta * 0.001)))
  }

  // Handle model click - show message and play audio
  const handleModelClick = () => {
    setShowMessage(true)
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause()
        setIsAudioPlaying(false)
      } else {
        audioRef.current.play()
        setIsAudioPlaying(true)
      }
    }
  }

  return (
    <>
      <primitive
        ref={modelRef}
        object={scene}
        scale={getModelScale() * modelScale}
        position={modelPosition}
        onClick={handleModelClick}
        onPointerMissed={() => setShowMessage(false)}
        onWheel={handleWheel}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      />
      
      {/* Información Hígado - HTML 3D Mejorado */}
      {showMessage && (
        <Html
          position={[modelPosition[0]-0.5, modelPosition[1] + 1.6, modelPosition[2]]}
          distanceFactor={screenSize.isMobile ? 3 : 2}
          occlude
          transform
        >
          <div className={`liver-info-3d ${screenSize.isMobile ? "liver-info-mobile" : ""}`}>
            <div className="liver-info-header">
              <h2>🫀 Información del Hígado</h2>
              <button 
                className="close-btn"
                onClick={() => setShowMessage(false)}
              >
                ✕
              </button>
            </div>
            <div className="liver-info-content">
              <div className="info-section">
                <h3>Función Principal</h3>
                <p>El hígado filtra la sangre y elimina toxinas del cuerpo.</p>
              </div>
              <div className="info-section">
                <h3>Datos Importantes</h3>
                <ul>
                  <li>• Pesa aproximadamente 1.5 kg</li>
                  <li>• Procesa 1.4 litros de sangre por minuto</li>
                  <li>• Tiene más de 500 funciones</li>
                </ul>
              </div>
              <div className="info-section">
                <h3>🔊 Audio</h3>
                <p>
                  {isAudioPlaying ? "🔊 Sonido reproduciéndose" : "🔇 Haz clic para activar sonido"}
                </p>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Instrucciones HTML dentro de la escena 3D - Actualizadas */}
      {showInstructions && !screenSize.isMobile && (
        <Html
          position={[-2, 2, 0]}
          className="html-3d-instructions"
          transform
          occlude
          distanceFactor={screenSize.isTablet ? 3 : 2}
        >
          <div className={`instructions-3d-container ${screenSize.isTablet ? "instructions-tablet" : ""}`}>
            <h1 className="instructions-3d-title">Controles del Modelo 3D</h1>
            <div className="instructions-3d-content">
              <p>🖱 Eventos de Mouse:</p>
              <ul className="instructions-3d-list">
                <li>• Clic: Mostrar información</li>
                <li>• Hover: Resaltar modelo</li>
                <li>• Scroll: Zoom personalizado</li>
                <li>• Arrastrar: Rotar vista</li>
              </ul>
              <p>⌨️ Controles de Teclado:</p>
              <ul className="instructions-3d-list">
                <li>• R: Activar/desactivar rotación</li>
                <li>• WASD: Mover modelo</li>
                {diseaseStage !== undefined && !showTreatment && !isHealthy && (
                  <li>• F: Ver progreso de la enfermedad</li>
                )}
              </ul>
            </div>
          </div>
        </Html>
      )}

      {/* 3D Button for Disease Progression - Only for fatty liver, not healthy liver */}
      {showFButton && diseaseStage !== undefined && !showTreatment && !isHealthy && (
        <Html
          position={[modelPosition[0] + 1.5, modelPosition[1] + 0.5, modelPosition[2]]}
          distanceFactor={screenSize.isMobile ? 4 : 3}
          occlude
          transform
        >
          <div className="f-button-3d">
            <div className="f-button-content">
              <div className="f-key">F</div>
              <div className="f-text">
                {diseaseStage === 0 ? "Ver progreso" : 
                 diseaseStage === 1 ? "Ver etapa final" : 
                 "Volver al inicio"}
              </div>
              <div className="f-stage">
                Etapa {diseaseStage + 1}/3
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Treatment Message - Only shown during treatment */}
      {showTreatment && (
        <Html
          position={[modelPosition[0], modelPosition[1] + 2, modelPosition[2]]}
          distanceFactor={screenSize.isMobile ? 4 : 3}
          occlude
          transform
        >
          <div className="treatment-message-3d">
            <div className="treatment-message-content">
              
              <div className="treatment-text">
                Cambiar por hábitos saludables es el tratamiento más efectivo
              
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Hospital Ambient Sound - Triggered by clicking the model */}
      <PositionalAudio
        ref={audioRef}
        url="/sonidos/HospitalSound.mp3"
        distance={10}
        loop
        volume={0.3}
        position={modelPosition}
      />
    </>
  )
}

// Componente para la sala de hospital
function HospitalRoom({ isHealthy, screenSize }) {
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color("#f0f0f0")
    scene.fog = new THREE.Fog("#f0f0f0", 20, 30)
  }, [scene])

  return (
    <>
      {/* Iluminación de hospital */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[2, 3, 2]} intensity={0.5} color="#ffffff" />
      
      {/* Suelo de hospital */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <meshStandardMaterial color="#e6e6e6" />
      </Plane>
      
      {/* Paredes de la sala */}
      <Plane args={[20, 10]} position={[0, 4, -5]} receiveShadow>
        <meshStandardMaterial color="#f0f8ff" />
      </Plane>
      <Plane args={[20, 10]} position={[-5, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <meshStandardMaterial color="#f0f8ff" />
      </Plane>
      <Plane args={[20, 10]} position={[5, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <meshStandardMaterial color="#f0f8ff" />
      </Plane>
      
      {/* Mesa de examen médico */}
      <group position={[0, 0, 0]}>
        <Box args={[3, 0.1, 2]} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={isHealthy ? "#a8d8ea" : "#ffcccb"} />
        </Box>
        {/* Patas de la mesa */}
        <Box args={[0.1, 0.5, 0.1]} position={[1.4, -0.3, 0.9]} castShadow>
          <meshStandardMaterial color="#888888" />
        </Box>
        <Box args={[0.1, 0.5, 0.1]} position={[-1.4, -0.3, 0.9]} castShadow>
          <meshStandardMaterial color="#888888" />
        </Box>
        <Box args={[0.1, 0.5, 0.1]} position={[1.4, -0.3, -0.9]} castShadow>
          <meshStandardMaterial color="#888888" />
        </Box>
        <Box args={[0.1, 0.5, 0.1]} position={[-1.4, -0.3, -0.9]} castShadow>
          <meshStandardMaterial color="#888888" />
        </Box>
      </group>
      
      {/* Líneas de color en la pared */}
      <Box args={[10, 0.2, 0.1]} position={[0, 1.5, -5]} castShadow>
        <meshStandardMaterial color={isHealthy ? "#5d8aa8" : "#e58c8a"} />
      </Box>
      <Box args={[0.1, 0.2, 10]} position={[5, 1.5, 0]} castShadow>
        <meshStandardMaterial color={isHealthy ? "#5d8aa8" : "#e58c8a"} />
      </Box>
      <Box args={[0.1, 0.2, 10]} position={[-5, 1.5, 0]} castShadow>
        <meshStandardMaterial color={isHealthy ? "#5d8aa8" : "#e58c8a"} />
      </Box>
      
      {/* Carrito médico - Solo en pantallas grandes */}
      {!screenSize.isMobile && (
        <group position={[3, 0, 2]}>
          <Box args={[1, 0.8, 0.6]} position={[0, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#ffffff" />
          </Box>
          <Box args={[0.05, 0.1, 0.05]} position={[0.4, -0.45, 0.25]} castShadow>
            <meshStandardMaterial color="#888888" />
          </Box>
          <Box args={[0.05, 0.1, 0.05]} position={[-0.4, -0.45, 0.25]} castShadow>
            <meshStandardMaterial color="#888888" />
          </Box>
          <Box args={[0.05, 0.1, 0.05]} position={[0.4, -0.45, -0.25]} castShadow>
            <meshStandardMaterial color="#888888" />
          </Box>
          <Box args={[0.05, 0.1, 0.05]} position={[-0.4, -0.45, -0.25]} castShadow>
            <meshStandardMaterial color="#888888" />
          </Box>
        </group>
      )}
    </>
  )
}

// Componente para controlar la cámara
function CameraController({ target }) {
  const { camera } = useThree()
  
  useEffect(() => {
    camera.lookAt(new THREE.Vector3(...target))
  }, [camera, target])
  
  return null
}

export default function LiverModel({
  modelPath = "/placeholder.svg?height=400&width=400",
  showHtmlInstructions = false,
  isHealthy = false,
  diseaseStage,
  showTreatment = false,
}) {
  const screenSize = useResponsive()
  const [modelPosition, setModelPosition] = useState([0, 1, 0])

  // Configuración responsiva del canvas
  const getCanvasConfig = () => {
    if (screenSize.isMobile) {
      return {
        width: "100%",
        height: "60vh",
        camera: { position: [0, 2, 6], fov: 35 },
      }
    }
    if (screenSize.isTablet) {
      return {
        width: "100%",
        height: "40vh",
        camera: { position: [0, 2, 7], fov: 30 },
      }
    }
    return {
      width: "100%",
      height: "60vh",
      camera: { position: [0, 2, 8], fov: 25 },
    }
  }

  const canvasConfig = getCanvasConfig()

  return (
    <div className="liver-model-container">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "rotate", keys: ["r", "R"] },
        ]}
      >
        <Canvas
          style={{
            width: canvasConfig.width,
            height: canvasConfig.height,
            maxWidth: "100%",
          }}
          shadows
          camera={canvasConfig.camera}
        >
          <HospitalRoom isHealthy={isHealthy} screenSize={screenSize} />
          <OrbitControls
            target={modelPosition}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={0}
            enableDamping={true}
            dampingFactor={0.05}
          />
          <CameraController target={modelPosition} />
          <Model
            path={modelPath}
            showInstructions={showHtmlInstructions}
            position={modelPosition}
            screenSize={screenSize}
            diseaseStage={diseaseStage}
            showTreatment={showTreatment}
            isHealthy={isHealthy}
          />
        </Canvas>
      </KeyboardControls>
    </div>
  )
}
