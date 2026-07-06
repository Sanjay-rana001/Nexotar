"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useInView } from "framer-motion";

function AnimatedGlobeGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());
  
  useFrame(() => {
    if (!groupRef.current) return;
    const elapsed = (Date.now() - startTime.current) / 1000;
    
    if (elapsed < 2) {
      // Ease out cubic
      const t = elapsed / 2;
      const easeOutCubic = 1 - Math.pow(1 - t, 3);
      // Scale from 0.1 to 1.0
      const scale = 0.1 + (0.9 * easeOutCubic);
      groupRef.current.scale.set(scale, scale, scale);
    } else {
      groupRef.current.scale.set(1, 1, 1);
    }
  });

  return <group ref={groupRef} scale={0.1}>{children}</group>;
}

// ============================================
// SHARED SOLID MAP
// ============================================
function SolidMap({ isDark }: { isDark: boolean }) {
  const earthTexture = useTexture("/earth-map.jpg");
  
  const earthMaterial = useMemo(() => {
    const colorVec = isDark 
      ? new THREE.Vector4(0.145, 0.388, 0.921, 0.85) // Primary blue
      : new THREE.Vector4(0.05, 0.05, 0.05, 0.85); // Almost black for light mode
      
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: earthTexture },
        uColor: { value: colorVec },
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
        uniform vec4 uColor;
        varying vec2 vUv;
        void main() {
          vec4 texColor = texture2D(map, vUv);
          // In the specular map, oceans are white (near 1.0) and land is black (near 0.0)
          if (texColor.r > 0.5) discard; // Discard ocean
          
          gl_FragColor = uColor;
        }
      `,
      transparent: true,
    });
  }, [earthTexture, isDark]);

  return <Sphere args={[2.0, 64, 64]} material={earthMaterial} />;
}

// ============================================
// RANDOM CLIENT LOCATIONS (DOTS ON LAND ONLY)
// ============================================
function BlinkingDot({ position, offset, scaleMultiplier, color }: { position: THREE.Vector3, offset: number, scaleMultiplier: number, color: string }) {
  const coreRef = useRef<THREE.MeshBasicMaterial>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (groupRef.current) {
      // Align perfectly flat against the sphere's surface
      groupRef.current.lookAt(new THREE.Vector3(0, 0, 0));
      groupRef.current.rotateX(Math.PI); // Face outward
    }
  }, []);
  
  useFrame((state) => {
    // 1.8 second cycle for a slightly faster radar sweep/ping
    const duration = 1.8;
    const t = (state.clock.elapsedTime + offset) % duration; 
    const progress = t / duration; 
    
    if (coreRef.current) {
      // Core radar blip breathes
      coreRef.current.opacity = 0.6 + Math.sin(progress * Math.PI) * 0.4;
    }
    
    if (ringRef.current && ringMaterialRef.current) {
      // Flat radar ring expands outward
      ringRef.current.scale.setScalar(1 + progress * 4);
      ringMaterialRef.current.opacity = 0.6 * (1 - Math.pow(progress, 1.5));
    }
  });

  return (
    <group position={position} ref={groupRef} scale={scaleMultiplier}>
      {/* Flat Colored Glow */}
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[0.035, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Expanding Radar Ring */}
      <mesh ref={ringRef} position={[0, 0, 0.002]}>
        <ringGeometry args={[0.015, 0.02, 16]} />
        <meshBasicMaterial ref={ringMaterialRef} color={color} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Solid Radar Core */}
      <mesh position={[0, 0, 0.003]}>
        <circleGeometry args={[0.012, 12]} />
        <meshBasicMaterial ref={coreRef} color={color} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function ClientLocations({ isDark }: { isDark: boolean }) {
  const [points, setPoints] = useState<{pos: THREE.Vector3, offset: number, scale: number}[]>([]);

  useEffect(() => {
    let active = true;
    const loadPoints = async () => {
      // Small delay to prevent freezing during initial 3D load
      await new Promise(r => setTimeout(r, 1500));
      if (!active) return;
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = '/earth-map.jpg';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height).data;
        
        const pts: {pos: THREE.Vector3, offset: number, scale: number}[] = [];
        const R = 2.01; 
        const MAX_ATTEMPTS = 5000;
        let attempts = 0;
        
        while (pts.length < 60 && attempts < MAX_ATTEMPTS) {
          attempts++;
          
          const u = Math.random();
          const v = Math.acos(2 * Math.random() - 1) / Math.PI; 
          
          const xPx = Math.floor(u * img.width);
          const yPx = Math.floor((1 - v) * img.height); 
          
          const safeXPx = Math.min(xPx, img.width - 1);
          const safeYPx = Math.min(yPx, img.height - 1);
          
          const idx = (safeYPx * img.width + safeXPx) * 4;
          const r = imgData[idx]; 
          
          if (r < 128) {
            const phi = (1 - v) * Math.PI; 
            const theta = u * Math.PI * 2;
            
            const x = -R * Math.cos(theta) * Math.sin(phi);
            const y = R * Math.cos(phi);
            const z = R * Math.sin(theta) * Math.sin(phi);
            
            pts.push({
              pos: new THREE.Vector3(x, y, z),
              offset: Math.random() * Math.PI * 2, // Random blink offset
              scale: 0.6 + Math.random() * 1.0 // Random scale between 0.6x and 1.6x
            });
          }
        }
        if (active) setPoints(pts);
      } catch (e) {
        console.error("Failed to map client points to land:", e);
      }
    };
    
    loadPoints();
    return () => { active = false; };
  }, []);

  const dotColor = isDark ? "#00e5ff" : "#ff007f";

  return (
    <group>
      {points.map((p, i) => (
        <BlinkingDot key={i} position={p.pos} offset={p.offset} scaleMultiplier={p.scale} color={dotColor} />
      ))}
    </group>
  );
}

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
      <SolidMap isDark={true} />
      <ClientLocations isDark={true} />
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
        <SolidMap isDark={false} />
        
        {/* Client Locations Dots */}
        <ClientLocations isDark={false} />

        {/* Wireframe Grid aligned and rotating with the globe */}
        <Sphere args={[2.005, 36, 18]}>
          <meshBasicMaterial 
            color="#000000" 
            wireframe 
            transparent 
            opacity={0.15} 
            blending={THREE.NormalBlending}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "200px" });
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof navigator !== 'undefined') {
      setIsLowEnd(navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false);
    }
  }, []);

  if (!mounted) {
    return <div className="w-full h-full" />;
  }

  const isDark = resolvedTheme === "dark";

  // Graceful degradation for low end devices
  if (isLowEnd) {
    return (
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
        
        {/* Crisp Sci-Fi CSS Orbits */}
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 flex items-center justify-center">
          {/* Ring 1 (Outermost) */}
          <div className="absolute inset-0 border-[3px] border-[var(--color-primary-container)]/80 rounded-full animate-[spin_16s_linear_infinite]" style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}>
            <div className="absolute top-4 left-1/4 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff]" />
          </div>
          
          {/* Ring 2 */}
          <div className="absolute inset-4 md:inset-8 border-[2px] border-purple-500/80 rounded-full animate-[spin_12s_linear_infinite_reverse]" style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent' }}>
            <div className="absolute bottom-4 left-4 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
          </div>
          
          {/* Ring 3 */}
          <div className="absolute inset-8 md:inset-16 border-[3px] border-[#00e5ff]/80 rounded-full animate-[spin_10s_linear_infinite]" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }}>
            <div className="absolute top-1/2 -right-1.5 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />
          </div>

          {/* Ring 4 */}
          <div className="absolute inset-12 md:inset-24 border-[2px] border-[var(--color-primary-container)]/70 rounded-full animate-[spin_6s_linear_infinite_reverse]" style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent' }}>
             <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full shadow-[0_0_6px_#fff]" />
          </div>

          {/* Ring 5 (Innermost) */}
          <div className="absolute inset-16 md:inset-32 border-[2px] border-purple-500/90 rounded-full animate-[spin_4s_linear_infinite]" style={{ borderTopColor: 'transparent' }}>
            <div className="absolute top-1 right-1/4 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_8px_#fff]" />
          </div>
          
          {/* Crisp Glowing Core */}
          <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-tr from-[var(--color-primary-container)] via-purple-500 to-[#00e5ff] rounded-full blur-[2px] animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
          <div className="absolute w-6 h-6 md:w-10 md:h-10 bg-white rounded-full blur-[1px] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center cursor-move">
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary-container)]/10 to-transparent blur-3xl -z-10 rounded-full" />
      
      {/* Dynamic Drop Shadow for Light Mode Globe */}
      {!isDark && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[300px] h-[30px] bg-[var(--color-primary-container)]/30 blur-2xl rounded-[100%]" />
      )}

      {/* Single Unified Canvas ensuring no React crashes or WebGL context losses */}
      <div className="w-full h-full absolute inset-0">
        <Canvas 
          frameloop={isInView ? "always" : "never"} 
          dpr={[1, 1.5]} 
          camera={{ position: [0, 0, 6.1], fov: 45 }} 
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={isDark ? 1 : 2} />
          {!isDark && (
            <>
              <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
              <directionalLight position={[-5, -5, -5]} intensity={1} color="#60a5fa" />
            </>
          )}
          
          <Suspense fallback={null}>
            <AnimatedGlobeGroup>
              {isDark ? <DarkGlobe /> : <LightGlobeR3F />}
            </AnimatedGlobeGroup>
          </Suspense>
          
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
        </Canvas>
      </div>
    </div>
  );
}
