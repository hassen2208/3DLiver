import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html, Box, Plane, Sphere, PositionalAudio } from "@react-three/drei"
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

// Componente para el modelo de tratamiento (mismo modelo, diferente ambiente)
function TreatmentModel({ path, position = [0, 1, 0], screenSize }) {
  const { scene } = useGLTF(path)
  const modelRef = useRef()
  const audioRef = useRef()
  const [isRotating, setIsRotating] = useState(true)
  const [showTreatmentInfo, setShowTreatmentInfo] = useState(true)
  const [modelPosition, setModelPosition] = useState(position)
  const [isHovered, setIsHovered] = useState(false)
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
      modelRef.current.rotation.y += 0.002 // Very slow rotation for treatment
    }
    // Efecto de hover suave
    if (modelRef.current) {
      const targetScale = isHovered ? getModelScale() * 1.03 : getModelScale()
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

  // Handle model click
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
        scale={getModelScale()}
        position={modelPosition}
        onClick={handleModelClick}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      />
      
      {/* Treatment Message - Enhanced for specialized stage */}
      {showTreatmentInfo && (
        <Html
          position={[modelPosition[0], modelPosition[1] + 2.5, modelPosition[2]]}
          distanceFactor={screenSize.isMobile ? 4 : 3}
          occlude
          transform
        >
          <div className="specialized-treatment-message">
            <div className="treatment-header">
             
            </div>
            <div className="treatment-body">
              <div className="main-treatment-text">
                <h3>Cambiar por hábitos saludables es el tratamiento más efectivo</h3>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Floating particles around the model */}
      <Html
        position={[modelPosition[0] + 1.5, modelPosition[1] + 1.5, modelPosition[2]]}
        distanceFactor={screenSize.isMobile ? 6 : 5}
        occlude
        transform
      >
        <div className="healing-particle">+</div>
      </Html>
      
      <Html
        position={[modelPosition[0] - 1.2, modelPosition[1] + 0.8, modelPosition[2] + 0.5]}
        distanceFactor={screenSize.isMobile ? 6 : 5}
        occlude
        transform
      >
        <div className="healing-particle">💚</div>
      </Html>

      
    </>
  )
}

// Ambiente especializado para tratamiento
function TreatmentEnvironment({ screenSize }) {
  const { scene } = useThree()

  useEffect(() => {
    // Gradiente de colores sanadores
    scene.background = new THREE.Color("#f0fff0")
    scene.fog = new THREE.Fog("#f0fff0", 12, 20)
  }, [scene])

  return (
    <>
      {/* Iluminación especializada para tratamiento */}
      <ambientLight intensity={0.8} color="#f0fff0" />
      <directionalLight position={[2, 6, 3]} intensity={0.6} color="#90EE90" castShadow />
      <pointLight position={[-1, 4, 2]} intensity={0.4} color="#98FB98" />
      <pointLight position={[2, 2, -1]} intensity={0.3} color="#F0FFF0" />
      
      {/* Luz curativa central */}
      <spotLight 
        position={[0, 8, 0]} 
        target-position={[0, 1, 0]}
        intensity={0.3} 
        angle={1.2} 
        penumbra={0.8} 
        color="#ADFF2F" 
      />
      
      {/* Suelo especializado con patrón curativo */}
      <Plane args={[12, 12]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <meshStandardMaterial color="#f8fff8" />
      </Plane>
      
      {/* Círculo de curación alrededor del modelo */}
      <Plane args={[4, 4]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]} receiveShadow>
        <meshStandardMaterial color="#e8f5e8" transparent opacity={0.7} />
      </Plane>
      
      {/* Paredes con gradiente de sanación */}
      <Plane args={[12, 6]} position={[0, 2, -3]} receiveShadow>
        <meshStandardMaterial color="#f5fffa" />
      </Plane>
      
      {/* Elementos decorativos de tratamiento flotantes */}
      {!screenSize.isMobile && (
        <>
          {/* Esferas flotantes de energía curativa */}
          <Sphere args={[0.1]} position={[2, 3, 1]} castShadow>
            <meshStandardMaterial color="#90EE90" emissive="#90EE90" emissiveIntensity={0.2} />
          </Sphere>
          <Sphere args={[0.08]} position={[-1.5, 3.5, 0.5]} castShadow>
            <meshStandardMaterial color="#98FB98" emissive="#98FB98" emissiveIntensity={0.15} />
          </Sphere>
          <Sphere args={[0.12]} position={[1, 4, -0.8]} castShadow>
            <meshStandardMaterial color="#F0FFF0" emissive="#F0FFF0" emissiveIntensity={0.1} />
          </Sphere>
          
          {/* Mesa de consulta especializada */}
          <group position={[2.5, 0, 1.8]}>
            <Box args={[1.5, 0.08, 1]} position={[0, 0, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#e8f5e8" />
            </Box>
            {/* Patas verdes de la mesa */}
            <Box args={[0.06, 0.4, 0.06]} position={[0.6, -0.25, 0.4]} castShadow>
              <meshStandardMaterial color="#90EE90" />
            </Box>
            <Box args={[0.06, 0.4, 0.06]} position={[-0.6, -0.25, 0.4]} castShadow>
              <meshStandardMaterial color="#90EE90" />
            </Box>
            <Box args={[0.06, 0.4, 0.06]} position={[0.6, -0.25, -0.4]} castShadow>
              <meshStandardMaterial color="#90EE90" />
            </Box>
            <Box args={[0.06, 0.4, 0.06]} position={[-0.6, -0.25, -0.4]} castShadow>
              <meshStandardMaterial color="#90EE90" />
            </Box>
          </group>
          
          {/* Plantas medicinales */}
          <group position={[-2.5, 0, 1.2]}>
            <Box args={[0.4, 0.8, 0.4]} position={[0, 0.2, 0]} castShadow>
              <meshStandardMaterial color="#228B22" />
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

export default function TreatmentStage({ modelPath = "/modelos/medicine/FattyTreatment.glb" }) {
  const screenSize = useResponsive()
  const [modelPosition, setModelPosition] = useState([0, 1, 0])

  // Configuración responsiva del canvas
  const getCanvasConfig = () => {
    if (screenSize.isMobile) {
      return {
        width: "100%",
        height: "60vh",
        camera: { position: [0, 3, 7], fov: 35 },
      }
    }
    if (screenSize.isTablet) {
      return {
        width: "100%",
        height: "40vh",
        camera: { position: [0, 3, 8], fov: 30 },
      }
    }
    return {
      width: "100%",
      height: "60vh",
      camera: { position: [0, 3, 9], fov: 25 },
    }
  }

  const canvasConfig = getCanvasConfig()

  return (
    <div className="treatment-stage-container">
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
          dampingFactor={0.03}
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
