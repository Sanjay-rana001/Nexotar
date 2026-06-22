"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useMascotStore, MascotAction, MascotEmotion } from "@/store/mascotStore";
import { useRobotMovement } from "@/hooks/useRobotMovement";
import { RobotBody } from "./RobotBody";
import { RobotParticles } from "./RobotParticles";

// Logic Controller that manages high-level actions/emotions
function RobotLogic() {
  const { emotion, action, setEmotion, setAction, updateInteractionTime, lastInteractionTime, targetPosition } = useMascotStore();
  const mascotRef = useRef<THREE.Group>(null);
  const { viewport } = useThree(); // Added for responsive scaling
  
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const clickCount = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  // Responsive scale: 0.35 on desktop, 0.25 on smaller screens
  const responsiveScale = viewport.width < 6 ? 0.25 : 0.35;

  // Hook handles setting targetPosition based on scroll safe zones
  useRobotMovement();

  // Smoothly move the robot globally towards targetPosition
  useFrame((state) => {
    if (!mascotRef.current) return;
    mascotRef.current.position.lerp(targetPosition, 0.05);
    
    // Face the direction of movement, or face the user when idle
    if (Math.abs(targetPosition.x - mascotRef.current.position.x) > 0.1) {
      const targetRotation = targetPosition.x > mascotRef.current.position.x ? Math.PI / 6 : -Math.PI / 6;
      mascotRef.current.rotation.y = THREE.MathUtils.lerp(mascotRef.current.rotation.y, targetRotation, 0.1);
    } else {
      // Counteract perspective distortion by angling the body towards the camera [0,0,5]
      // If the robot is on the right (+x), it should rotate left (-y).
      const lookAtCameraRotation = -mascotRef.current.position.x * 0.15;
      mascotRef.current.rotation.y = THREE.MathUtils.lerp(mascotRef.current.rotation.y, lookAtCameraRotation, 0.1);
    }
  });

  // State Machine logic (Idle timer)
  useEffect(() => {
    const interval = setInterval(() => {
      const idleTime = Date.now() - useMascotStore.getState().lastInteractionTime;
      
      // If inactive for 10 seconds, go to sleep
      if (idleTime > 10000 && useMascotStore.getState().emotion !== 'sleeping') {
        setEmotion('sleeping');
      }
      
      // If dizzy, recover after 5 seconds
      if (useMascotStore.getState().emotion === 'dizzy' && idleTime > 5000) {
        setAction('recover');
        setTimeout(() => {
          setEmotion('idle');
          setAction('none');
        }, 1000);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [setEmotion, setAction]);

  // Mesh Click Handlers
  const handlePointerDown = () => {
    updateInteractionTime();
    if (emotion === 'sleeping') {
      setEmotion('idle');
      setAction('jump');
      setTimeout(() => setAction('none'), 1000);
      return;
    }

    pressTimer.current = setTimeout(() => {
      setEmotion('thinking');
      setAction('think');
      clickCount.current = 0;
    }, 500); // Long press
  };

  const handlePointerUp = () => {
    updateInteractionTime();
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      if (useMascotStore.getState().emotion === 'thinking') {
        setEmotion('idle');
        setAction('none');
        return;
      }
    }
  };

  const handleClick = () => {
    updateInteractionTime();
    if (useMascotStore.getState().emotion === 'thinking') return;
    
    clickCount.current += 1;
    if (clickCount.current === 1) {
      clickTimeout.current = setTimeout(() => {
        setEmotion('happy');
        setAction('wave');
        setTimeout(() => {
          setEmotion('idle');
          setAction('none');
        }, 1500);
        clickCount.current = 0;
      }, 250);
    }
  };

  const handleDoubleClick = () => {
    updateInteractionTime();
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickCount.current = 0;

    setAction('celebrate');
    setEmotion('laugh');
    
    setTimeout(() => {
      setAction('none');
      setEmotion('idle');
    }, 2000);
  };

  return (
    <group ref={mascotRef} scale={responsiveScale}>
      {/* Invisible hit box */}
      <mesh 
        onPointerOver={() => {
          updateInteractionTime();
          if (useMascotStore.getState().emotion === 'idle') {
            setEmotion('excited');
            setAction('wave');
          }
        }}
        onPointerOut={() => {
          handlePointerUp();
          if (useMascotStore.getState().emotion === 'excited') {
            setEmotion('idle');
            setAction('none');
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        <boxGeometry args={[4, 6, 4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <RobotBody />
      <RobotParticles />
      
      {/* Soft Shadow */}
      <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={6} blur={2.5} far={4} color="#000000" />
    </group>
  );
}

export function RobotMascot() {
  const setScrollProgress = useMascotStore(state => state.setScrollProgress);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress from 0.0 to 1.0
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        setScrollProgress(scrollTop / scrollHeight);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      <Canvas eventSource={typeof window !== 'undefined' ? document.body : undefined} eventPrefix="client" camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#00e5ff" /> 
        
        <Environment preset="city" />
        
        <RobotLogic />
      </Canvas>
    </div>
  );
}
