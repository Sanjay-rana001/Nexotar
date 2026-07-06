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
        {/* Matte Inner Core (Soft Blue, no glaring white reflections) */}
        <Sphere args={[1.96, 64, 64]}>
          <meshStandardMaterial 
            color="#60a5fa"
            transparent
            opacity={0.8}
            roughness={0.7}
            metalness={0.1}
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
  // === THEME COLORS ===
  // You can easily change these colors to match any aesthetic!
  
  // 1. ECLIPSE SHADOW COLORS (Use RGB format: 'R, G, B')
  const eclipsePrimary = '253, 224, 71';   // Center glow
  const eclipseSecondary = '234, 179, 8'; // Outer glow
  const eclipsePale = '254, 240, 138';    // Inner highlight
  
  // 2. ECG HEARTBEAT COLORS
  const ecgColor = '#f59e0b'; // Hex color for the heartbeat line
  const ecgDropShadow = 'rgba(245, 158, 11, 0.4)'; // Glow shadow for the line
  const coreGlowClasses = 'from-amber-500 to-orange-600'; // Inner core faint glow
  // ====================
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
    if (isDark) {
      return (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes color-shift {
              0% { filter: hue-rotate(0deg); }
              100% { filter: hue-rotate(360deg); }
            }
          `}} />
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] flex items-center justify-center" style={{ animation: 'color-shift 20s linear infinite' }}>
            <div className="absolute inset-[-40%] rounded-full blur-[40px] opacity-100" style={{
              background: `radial-gradient(circle, rgba(${eclipsePrimary}, 0.13) 0%, rgba(${eclipseSecondary}, 0.08) 40%, transparent 70%)`
            }} />
            <div className="absolute inset-[-20%] rounded-full blur-[20px] opacity-100" style={{
              background: `radial-gradient(circle, rgba(${eclipsePale}, 0.15) 0%, transparent 60%)`
            }} />
            <div className="absolute inset-[4px] rounded-full flex items-center justify-center z-10 bg-black" style={{
              boxShadow: `0 0 4px rgba(${eclipsePrimary}, 0.35), 0 0 20px rgba(${eclipseSecondary}, 0.2), inset 0 0 20px rgba(0,0,0,1)`
            }}>
               <div className="absolute inset-10 rounded-full border-[1px] border-dashed border-white/10 animate-spin" style={{ animationDuration: '20s' }} />
               <div className={`w-16 h-16 bg-gradient-to-tr ${coreGlowClasses} rounded-full opacity-20 blur-xl animate-pulse`} style={{ animationDuration: '4s' }} />
               <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                 <svg viewBox="0 0 100 30" className="w-[85%] h-auto" style={{ filter: `drop-shadow(0 0 4px ${ecgDropShadow})` }}>
                   <defs>
                     <linearGradient id="ecg-grad" x1="-50%" y1="0%" x2="0%" y2="0%">
                       <animate attributeName="x1" values="-50%; 100%" dur="2.5s" repeatCount="indefinite" />
                       <animate attributeName="x2" values="0%; 150%" dur="2.5s" repeatCount="indefinite" />
                       <stop offset="0%" stopColor={ecgColor} stopOpacity="0" />
                       <stop offset="40%" stopColor={ecgColor} stopOpacity="0.2" />
                       <stop offset="90%" stopColor={ecgColor} stopOpacity="1" />
                       <stop offset="95%" stopColor="#ffffff" stopOpacity="1" />
                       <stop offset="100%" stopColor={ecgColor} stopOpacity="0" />
                     </linearGradient>
                   </defs>
                   <path d="M 0 15 L 20 15 L 25 5 L 30 25 L 35 15 L 55 15 L 60 10 L 65 20 L 70 15 L 100 15"
                         fill="none" stroke="url(#ecg-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes colorCycle {
              0%, 24.99% { border-color: #0070f3; filter: drop-shadow(0 0 14px rgba(0,112,243,0.9)); }
              25%, 49.99% { border-color: #a855f7; filter: drop-shadow(0 0 14px rgba(168,85,247,0.9)); }
              50%, 74.99% { border-color: #f43f5e; filter: drop-shadow(0 0 14px rgba(244,63,94,0.9)); }
              75%, 99.99% { border-color: #00e5ff; filter: drop-shadow(0 0 14px rgba(0,229,255,0.9)); }
              100% { border-color: #0070f3; filter: drop-shadow(0 0 14px rgba(0,112,243,0.9)); }
            }
            @keyframes colorCycleReverse {
              0%, 24.99% { border-color: #f43f5e; filter: drop-shadow(0 0 14px rgba(244,63,94,0.9)); }
              25%, 49.99% { border-color: #00e5ff; filter: drop-shadow(0 0 14px rgba(0,229,255,0.9)); }
              50%, 74.99% { border-color: #0070f3; filter: drop-shadow(0 0 14px rgba(0,112,243,0.9)); }
              75%, 99.99% { border-color: #a855f7; filter: drop-shadow(0 0 14px rgba(168,85,247,0.9)); }
              100% { border-color: #f43f5e; filter: drop-shadow(0 0 14px rgba(244,63,94,0.9)); }
            }
            .ring-1-shape { border-top-color: transparent !important; border-left-color: transparent !important; }
            .ring-2-shape { border-bottom-color: transparent !important; border-right-color: transparent !important; }
            .ring-3-shape { border-top-color: transparent !important; border-right-color: transparent !important; }
            .ring-4-shape { border-bottom-color: transparent !important; border-left-color: transparent !important; }
            .ring-5-shape { border-top-color: transparent !important; }
          `}} />
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 flex items-center justify-center">
            <div className="absolute inset-0 pointer-events-none opacity-50">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
              <div className="absolute inset-0 border border-blue-500/10 rounded-full scale-[1.15]" />
              <div className="absolute inset-0 border border-blue-500/10 rounded-full scale-[1.3]" />
            </div>
            <div className="absolute inset-2 md:inset-6 pointer-events-none opacity-60">
              <div className="w-full h-full border-[1px] border-dashed border-blue-400/20 rounded-full animate-[spin_40s_linear_infinite]" />
            </div>
            <div className="absolute inset-10 md:inset-20 pointer-events-none opacity-60">
              <div className="w-full h-full border-[1px] border-dotted border-purple-400/20 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
            </div>
            <div className="absolute inset-0">
              <div className="w-full h-full border-[5px] rounded-full ring-1-shape" style={{ animation: 'spin 4s linear infinite, colorCycle 16s linear infinite' }} />
              <div className="absolute inset-0 animate-[spin_4s_linear_infinite_reverse]">
                <div className="absolute inset-0 border-[5px] border-white/90 rounded-full drop-shadow-[0_0_12px_#fff]" style={{ WebkitMaskImage: 'conic-gradient(from 0deg, black 0%, transparent 20%)', maskImage: 'conic-gradient(from 0deg, black 0%, transparent 20%)' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff] animate-pulse" style={{ animationDuration: '2s' }} />
              </div>
            </div>
            <div className="absolute inset-4 md:inset-8">
              <div className="w-full h-full border-[4px] rounded-full ring-2-shape" style={{ animation: 'spin 7s linear infinite reverse, colorCycleReverse 28s linear infinite' }} />
              <div className="absolute inset-0 animate-[spin_7s_linear_infinite]">
                <div className="absolute inset-0 border-[4px] border-white/90 rounded-full drop-shadow-[0_0_12px_#fff]" style={{ WebkitMaskImage: 'conic-gradient(from 0deg, transparent 80%, black 100%)', maskImage: 'conic-gradient(from 0deg, transparent 80%, black 100%)' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff] animate-pulse" style={{ animationDuration: '0.8s' }} />
              </div>
            </div>
            <div className="absolute inset-8 md:inset-16">
              <div className="w-full h-full border-[5px] rounded-full ring-3-shape" style={{ animation: 'spin 5.5s linear infinite, colorCycle 22s linear infinite' }} />
              <div className="absolute inset-0 animate-[spin_5.5s_linear_infinite_reverse]">
                <div className="absolute inset-0 border-[5px] border-white/90 rounded-full drop-shadow-[0_0_12px_#fff]" style={{ WebkitMaskImage: 'conic-gradient(from 0deg, black 0%, transparent 20%)', maskImage: 'conic-gradient(from 0deg, black 0%, transparent 20%)' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff] animate-pulse" style={{ animationDuration: '1.5s' }} />
              </div>
            </div>
            <div className="absolute inset-12 md:inset-24">
              <div className="w-full h-full border-[4px] rounded-full ring-4-shape" style={{ animation: 'spin 3.3s linear infinite reverse, colorCycleReverse 13.2s linear infinite' }} />
              <div className="absolute inset-0 animate-[spin_3.3s_linear_infinite]">
                <div className="absolute inset-0 border-[4px] border-white/90 rounded-full drop-shadow-[0_0_12px_#fff]" style={{ WebkitMaskImage: 'conic-gradient(from 0deg, transparent 80%, black 100%)', maskImage: 'conic-gradient(from 0deg, transparent 80%, black 100%)' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff] animate-pulse" style={{ animationDuration: '1.2s' }} />
              </div>
            </div>
            <div className="absolute inset-16 md:inset-32">
              <div className="w-full h-full border-[4px] rounded-full ring-5-shape" style={{ animation: 'spin 1.1s linear infinite, colorCycle 4.4s linear infinite' }} />
              <div className="absolute inset-0 animate-[spin_1.1s_linear_infinite_reverse]">
                <div className="absolute inset-0 border-[4px] border-white/90 rounded-full drop-shadow-[0_0_12px_#fff]" style={{ WebkitMaskImage: 'conic-gradient(from 0deg, black 0%, transparent 30%)', maskImage: 'conic-gradient(from 0deg, black 0%, transparent 30%)' }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff] animate-pulse" style={{ animationDuration: '2.5s' }} />
              </div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,112,243,0.15)_0%,rgba(168,85,247,0.05)_40%,transparent_70%)] animate-pulse" style={{ animationDuration: '6s' }} />
            <div className="absolute w-20 h-20 bg-[var(--color-primary-container)] rounded-full blur-[30px] opacity-30 animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute w-8 h-8 bg-white rounded-full blur-[15px] opacity-40 animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute w-12 h-12 md:w-16 md:h-16 border-[1px] border-dashed border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute w-4 h-4 bg-white rounded-full blur-[4px] opacity-90 shadow-[0_0_20px_#fff]" />
          </div>
        </div>
      );
    }
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
          <ambientLight intensity={isDark ? 1 : 1.2} />
          {!isDark && (
            <>
              <directionalLight position={[5, 5, 5]} intensity={1.5} color="#60a5fa" />
              <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#3b82f6" />
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
