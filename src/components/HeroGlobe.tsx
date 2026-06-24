"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

// ============================================
// SHARED SOLID BLUE MAP
// ============================================
function SolidBlueMap() {
  const earthTexture = useTexture("/earth-map.jpg");
  
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: earthTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        varying vec2 vUv;
        void main() {
          vec4 texColor = texture2D(map, vUv);
          // In the specular map, oceans are white (near 1.0) and land is black (near 0.0)
          if (texColor.r > 0.5) discard; // Discard ocean
          
          gl_FragColor = vec4(0.145, 0.388, 0.921, 0.85); // Primary blue (#2563eb)
        }
      `,
      transparent: true,
    });
  }, [earthTexture]);

  return <Sphere args={[2.0, 64, 64]} material={earthMaterial} />;
}

// Preload the texture for faster initial load
// Removed useTexture.preload as it causes SSR crashes without dynamic imports.

// ============================================
// DARK MODE GLOBE
// ============================================
function DarkGlobe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.z = 0.2;
      groupRef.current.rotation.x = 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <SolidBlueMap />
      <Sphere args={[1.98, 32, 32]}>
        <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.15} />
      </Sphere>
      <Sphere args={[1.95, 32, 32]}>
        <meshBasicMaterial color="#0f172a" transparent opacity={0.8} />
      </Sphere>
    </group>
  );
}

// ============================================
// LIGHT MODE GLOBE
// ============================================
function LightGlobeR3F() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.z = 0.2;
      groupRef.current.rotation.x = 0.1;
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        {/* Glassy Inner Core */}
        <Sphere args={[1.96, 64, 64]}>
          <meshPhysicalMaterial 
            color="#ffffff"
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.1}
            transmission={0.9}
            thickness={2}
          />
        </Sphere>
        
        {/* Solid Continents Layer */}
        <SolidBlueMap />

        {/* Wireframe Grid aligned and rotating with the globe */}
        <Sphere args={[2.005, 36, 18]}>
          <meshBasicMaterial 
            color="#3b82f6" 
            wireframe 
            transparent 
            opacity={0.25} 
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      </group>
    </group>
  );
}

// ============================================
// MAIN WRAPPER
// ============================================
export function HeroGlobe() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-full h-full min-h-[400px] md:min-h-[500px]" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] relative flex items-center justify-center cursor-move">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary-container)]/10 to-transparent blur-3xl -z-10 rounded-full" />
      
      {/* Dynamic Drop Shadow for Light Mode Globe */}
      {!isDark && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[300px] h-[30px] bg-[var(--color-primary-container)]/30 blur-2xl rounded-[100%]" />
      )}

      {/* Single Unified Canvas ensuring no React crashes or WebGL context losses */}
      <Canvas camera={{ position: [0, 0, 6.1], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={isDark ? 1 : 2} />
        {!isDark && (
          <>
            <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
            <directionalLight position={[-5, -5, -5]} intensity={1} color="#60a5fa" />
          </>
        )}
        
        <Suspense fallback={null}>
          {isDark ? <DarkGlobe /> : <LightGlobeR3F />}
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
