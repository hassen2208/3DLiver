import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';

function Model({ path }) {
  const { scene } = useGLTF(path);
  const modelRef = useRef();

  useFrame (() => {
    if(modelRef.current) {
      modelRef.current.rotation.y += 0.005
    }
  });

  useEffect(() => {
    if(scene) {
      scene.traverse((child) => {
        if(child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      })
    }
  }, [scene])

  return (
    <Center>
      <primitive
        ref={modelRef}
        object={scene}
        scale={5}
        position={[0, 0, 0]}
      />
    </Center>
  );
}

  export default function LiverModelHome({ modelPath, width = '1200px', height = '800px' }) {
    return (
      <Canvas 
        style={{ width, height }}
        shadows
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={20}/>
        <ambientLight intensity={0.7}/>
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-witdh={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight 
          position={[-5, -5, -5]} 
          intensity={0.5} 
          color="#ffffff" 
        />
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5, 0]}
          {...props}
        >
          <planeGeometry args={[5, 5]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        <OrbitControls/>
        <Model path={modelPath} />
      </Canvas>
    );
  }
