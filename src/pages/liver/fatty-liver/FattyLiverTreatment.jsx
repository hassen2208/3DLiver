import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html, Box, Plane, PositionalAudio } from "@react-three/drei"
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

// Componente para el modelo 3D de tratamiento
function TreatmentModel({ path, position = [0, 1, 0], screenSize }) {
  const { scene } = useGLTF(path)
  const modelRef = useRef()
  const audioRef = useRef()
  const [isRotating, setIsRotating] = useState(true)
  const [showTreatmentInfo, setShowTreatmentInfo] = useState(true)
  const [modelPosition, setModelPosition] = useState(position)
  const [isHovered, setIsHovered] = useState(false)
  const [modelScale, setModelScale] = useState(1)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  // Control de la rotación del modelo con la tecla "R"
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key.toLowerCase() === "r") {
        setIsRotating((prev) => !prev)
      }
    }
    window.addEventListener("keypress", handleKeyPress)
    return () => window.removeEventListener("keypress", handleKeyPress)
  }, [])

  useFrame(() => {
    if (modelRef.current && isRotating) {
      modelRef.current.rotation.y += 0.003 // Slower rotation for treatment
    }
    // Efecto de hover - escala suave
    if (modelRef.current) {
      const targetScale = isHovered ? getModelScale() * 1.05 : getModelScale()
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
    if (screenSize.isMobile) return 3.5
    if (screenSize.isTablet) return 4.5
    return 5.5
  }

  // Handle model click - show treatment info and play audio
  const handleModelClick = () => {
    setShowTreatmentInfo(!showTreatmentInfo)
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
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      />
      
      {/* Treatment Information - Always visible for treatment */}
      {showTreatmentInfo && (
        <Html
          position={[modelPosition[0], modelPosition[1] + 2.5, modelPosition[2]]}
          distanceFactor={screenSize.isMobile ? 4 : 3}
          occlude
          transform
        >
          <div className="treatment-info-3d">
            <div className="treatment-info-header">
              <h2>💊 Tratamiento del Hígado Graso</h2>
              <button 
                className="close-btn"
                onClick={() => setShowTreatmentInfo(false)}
              >
                ✕
              </button>
            </div>
            <div className="treatment-info-content">
              <div className="treatment-main-message">
                <h3>🌟 Cambiar por hábitos saludables es el tratamiento más efectivo</h3>
              </div>
              <div className="treatment-steps">
                <div className="treatment-step">
                  <span className="step-icon">🥗</span>
                  <div className="step-content">
                    <h4>Alimentación Balanceada</h4>
                    <p>Reduce grasas saturadas y azúcares procesados</p>
                  </div>
                </div>
                <div className="treatment-step">
                  <span className="step-icon">🏃‍♂️</span>
                  <div className="step-content">
                    <h4>Ejercicio Regular</h4>
                    <p>30 minutos de actividad física diaria</p>
                  </div>
                </div>
                <div className="treatment-step">
                  <span className="step-icon">💧</span>
                  <div className="step-content">
                    <h4>Hidratación</h4>
                    <p>Mantén una hidratación adecuada</p>
                  </div>
                </div>
                <div className="treatment-step">
                  <span className="step-icon">⚖️</span>
                  <div className="step-content">
                    <h4>Control de Peso</h4>
                    <p>Pérdida gradual del 5-10% del peso corporal</p>
                  </div>
                </div>
              </div>
              <div className="treatment-success">
                <p>✅ Con estos cambios, el hígado graso puede revertirse completamente</p>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Floating Treatment Tips */}
      <Html
        position={[modelPosition[0] + 2, modelPosition[1] + 1, modelPosition[2]]}
        distanceFactor={screenSize.isMobile ? 5 : 4}
        occlude
        transform
      >
        <div className="floating-treatment-tip">
          <div className="tip-content">
            <div className="tip-icon">💡</div>
            <div className="tip-text">
              Haz clic en el modelo para ver más información del tratamiento
            </div>
          </div>
        </div>
      </Html>

      {/* Calming Ambient Sound for treatment */}
      <PositionalAudio
        ref={audioRef}
        url="/sonidos/HospitalSound.mp3"
        distance={8}
        loop
        volume={0.2}
        position={modelPosition}
      />
    </>
  )
}

// Componente para el ambiente de tratamiento
function TreatmentEnvironment({ screenSize }) {
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color("#f8fffe")
    scene.fog = new THREE.Fog("#f8fffe", 15, 25)
  }, [scene])

  return (
    <>
      {/* Iluminación cálida y sanadora */}
      <ambientLight intensity={0.7} color="#fff8e7" />
      <directionalLight position={[3, 4, 2]} intensity={0.8} color="#ffefb7" castShadow />
      <pointLight position={[-2, 3, 1]} intensity={0.6} color="#e8f5e8" />
      
      {/* Healing green light */}
      <spotLight 
        position={[0, 5, 0]} 
        target-position={[0, 0, 0]}
        intensity={0.4} 
        angle={0.8} 
        penumbra={0.7} 
        color="#90EE90" 
      />
      
      {/* Suelo de ambiente sanador */}
      <Plane args={[15, 15]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <meshStandardMaterial color="#f0f8f0" />
      </Plane>
      
      {/* Paredes del ambiente de tratamiento */}
      <Plane args={[15, 8]} position={[0, 3, -4]} receiveShadow>
        <meshStandardMaterial color="#f8fff8" />
      </Plane>
      
      {/* Mesa de tratamiento */}
      <group position={[0, 0, 0]}>
        <Box args={[2.5, 0.1, 1.8]} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#e8f5e8" />
        </Box>
        {/* Patas de la mesa */}
        <Box args={[0.08, 0.5, 0.08]} position={[1.1, -0.3, 0.8]} castShadow>
          <meshStandardMaterial color="#90EE90" />
        </Box>
        <Box args={[0.08, 0.5, 0.08]} position={[-1.1, -0.3, 0.8]} castShadow>
          <meshStandardMaterial color="#90EE90" />
        </Box>
        <Box args={[0.08, 0.5, 0.08]} position={[1.1, -0.3, -0.8]} castShadow>
          <meshStandardMaterial color="#90EE90" />
        </Box>
        <Box args={[0.08, 0.5, 0.08]} position={[-1.1, -0.3, -0.8]} castShadow>
          <meshStandardMaterial color="#90EE90" />
        </Box>
      </group>
      
      {/* Elementos decorativos de tratamiento */}
      {!screenSize.isMobile && (
        <>
          {/* Planta medicinal */}
          <group position={[2.5, 0, 1.5]}>
            <Box args={[0.3, 0.6, 0.3]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color="#8FBC8F" />
            </Box>
          </group>
          
          {/* Botella de agua */}
          <group position={[-2.2, 0.3, 1.2]}>
            <Box args={[0.15, 0.4, 0.15]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color="#87CEEB" />
            </Box>
          </group>
        </>
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

export default function FattyLiverTreatment({ modelPath = "/modelos/medicine/MedicineModel.glb" }) {
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
    <div className="treatment-model-container">
      <Canvas
        style={{
          width: canvasConfig.width,
          height: canvasConfig.height,
          maxWidth: "100%",
        }}
        shadows
        camera={canvasConfig.camera}
      >
        <TreatmentEnvironment screenSize={screenSize} />
        <OrbitControls
          target={modelPosition}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0}
          enableDamping={true}
          dampingFactor={0.05}
        />
        <CameraController target={modelPosition} />
        <TreatmentModel
          path={modelPath}
          position={modelPosition}
          screenSize={screenSize}
        />
      </Canvas>
    </div>
  )
}
