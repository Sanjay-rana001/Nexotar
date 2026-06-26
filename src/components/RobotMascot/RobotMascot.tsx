"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useMascotStore, MascotAction, MascotEmotion } from "@/store/mascotStore";
import { useRobotMovement } from "@/hooks/useRobotMovement";
import { RobotBody } from "./RobotBody";
import { RobotParticles } from "./RobotParticles";

import { useTheme } from "next-themes";

// Logic Controller that manages high-level actions/emotions
function RobotLogic({ isDark }: { isDark: boolean }) {
  const { emotion, action, setEmotion, setAction, updateInteractionTime, lastInteractionTime, targetPosition } = useMascotStore();
  const mascotRef = useRef<THREE.Group>(null);
  const { viewport } = useThree(); 
  
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const clickCount = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Fast mouse tracking refs
  const lastPointer = useRef({ x: 0, y: 0, time: 0 });
  const mouseVelocity = useRef(0);
  const dizzyTriggered = useRef(false);
  const lastCloudTriggerTime = useRef(0);

  // Responsive scale: 0.35 on desktop, 0.25 on smaller screens
  const responsiveScale = typeof window !== 'undefined' && window.innerWidth < 768 ? 0.25 : 0.35;

  // Hook handles setting targetPosition based on scroll safe zones
  useRobotMovement();

  // Smoothly move the robot globally towards targetPosition
  useFrame((state) => {
    if (!mascotRef.current) return;
    // Increased speed by double (0.055 to 0.11)
    mascotRef.current.position.lerp(targetPosition, 0.11);
    
    // Face the exact direction of movement, or face the user when idle
    if (Math.abs(targetPosition.x - mascotRef.current.position.x) > 0.1) {
      // Turn completely sideways (90 degrees / Math.PI / 2) to point exactly at the destination!
      const targetRotation = targetPosition.x > mascotRef.current.position.x ? Math.PI / 2 : -Math.PI / 2;
      mascotRef.current.rotation.y = THREE.MathUtils.lerp(mascotRef.current.rotation.y, targetRotation, 0.4);
    } else {
      // Counteract perspective distortion by angling the body towards the camera [0,0,5]
      // If the robot is on the right (+x), it should rotate left (-y).
      const lookAtCameraRotation = -mascotRef.current.position.x * 0.15;
      mascotRef.current.rotation.y = THREE.MathUtils.lerp(mascotRef.current.rotation.y, lookAtCameraRotation, 0.1);
    }

    // Fast Mouse Tracking
    const now = performance.now();
    const dt = now - lastPointer.current.time;
    if (dt > 0 && !dizzyTriggered.current && emotion !== 'dizzy' && action !== 'fall') {
      const dx = state.pointer.x - lastPointer.current.x;
      const dy = state.pointer.y - lastPointer.current.y;
      const speed = Math.sqrt(dx*dx + dy*dy) / dt;
      
      mouseVelocity.current = THREE.MathUtils.lerp(mouseVelocity.current, speed, 0.2);
      
      // Threshold for fast movement (lowered so it triggers more easily)
      if (mouseVelocity.current > 0.007) {
        dizzyTriggered.current = true;
        setEmotion('dizzy');
        setAction('fall');
        
        // Recovery Sequence
        setTimeout(() => {
          setAction('sitUp');
          setTimeout(() => {
            setAction('rubHead');
            setTimeout(() => {
              setEmotion('idle');
              setAction('none');
              dizzyTriggered.current = false;
              mouseVelocity.current = 0;
            }, 1500);
          }, 1000);
        }, 3000);
      }
    }
    lastPointer.current = { x: state.pointer.x, y: state.pointer.y, time: now };
  });

  // State Machine logic (Idle timer)
  useEffect(() => {
    const interval = setInterval(() => {
      const idleTime = Date.now() - useMascotStore.getState().lastInteractionTime;
      
      if (idleTime > 10000 && !['sleeping', 'dizzy', 'angry', 'love', 'laugh'].includes(useMascotStore.getState().emotion) && useMascotStore.getState().action !== 'fall') {
        setEmotion('sleeping');
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [setEmotion, setAction]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    updateInteractionTime();
    
    const state = useMascotStore.getState();
    if (state.emotion === 'dizzy' || state.action === 'fall' || state.emotion === 'angry') return;
    
    if (state.emotion === 'sleeping') {
      setEmotion('idle');
      setAction('jump');
      setTimeout(() => setAction('none'), 1000);
      return;
    }
    
    clickCount.current += 1;
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    
    clickTimeout.current = setTimeout(() => {
      const count = clickCount.current;
      clickCount.current = 0;
      
      if (count === 1) {
        setEmotion('happy'); setAction('wave');
        setTimeout(() => { if (useMascotStore.getState().emotion === 'happy') { setEmotion('idle'); setAction('none'); } }, 2000);
      } else if (count === 2) {
        setEmotion('love'); setAction('handsOnChest');
        setTimeout(() => { if (useMascotStore.getState().emotion === 'love') { setEmotion('idle'); setAction('none'); } }, 2000);
      } else if (count === 3) {
        setEmotion('laugh'); setAction('handsOnBelly');
        setTimeout(() => { if (useMascotStore.getState().emotion === 'laugh') { setEmotion('idle'); setAction('none'); } }, 2000);
      } else if (count >= 4) {
        setEmotion('angry'); setAction('crossArms');
        setTimeout(() => { if (useMascotStore.getState().emotion === 'angry') { setEmotion('idle'); setAction('none'); } }, 2000);
      }
    }, 350);
  };

  return (
    <group ref={mascotRef} scale={responsiveScale}>
      {/* Invisible hit box */}
      <mesh 
        onPointerDown={() => {
          updateInteractionTime();
          const state = useMascotStore.getState();
          if (state.emotion === 'sleeping') {
            setEmotion('idle'); setAction('jump');
            setTimeout(() => setAction('none'), 1000);
            return;
          }
          if (state.emotion === 'dizzy' || state.action === 'fall') return;

          pressTimer.current = setTimeout(() => {
            const now = Date.now();
            if (now - lastCloudTriggerTime.current >= 300000) { // 5 minute cooldown
              setEmotion('thinking');
              setAction('think');
              clickCount.current = 0;
              lastCloudTriggerTime.current = now;
              // Disappear after 1 second
              setTimeout(() => {
                if (useMascotStore.getState().emotion === 'thinking') {
                  setEmotion('idle');
                  setAction('none');
                }
              }, 1000);
            }
          }, 400); // 400ms long press
        }}
        onPointerMove={() => {
          // Cancel long press if mouse moves (scrolling/dragging)
          if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
          }
        }}
        onPointerUp={() => {
          if (pressTimer.current) clearTimeout(pressTimer.current);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          updateInteractionTime();
          
          const now = Date.now();
          const state = useMascotStore.getState();
          
          if (now - lastCloudTriggerTime.current >= 300000) { // 5 minute cooldown
            if (state.emotion === 'idle' || state.emotion === 'eager') {
              setEmotion('curious');
              setAction('think');
              lastCloudTriggerTime.current = now;
              
              // Cloud only lasts for 1 second while hovering
              setTimeout(() => {
                if (useMascotStore.getState().emotion === 'curious') {
                  setEmotion('idle');
                  setAction('none');
                }
              }, 1000);
            }
          }
        }}
        onPointerOut={(e) => {
          if (useMascotStore.getState().emotion === 'curious') {
            setEmotion('idle');
            setAction('none');
          }
        }}
        onClick={handleClick}
      >
        <boxGeometry args={[4, 6, 4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <RobotBody isDark={isDark} />
      <RobotParticles isDark={isDark} />
      
      {/* Soft Shadow */}
      <ContactShadows resolution={256} position={[0, -1.5, 0]} opacity={0.6} scale={6} blur={2.5} far={4} color="#000000" />
    </group>
  );
}

export function RobotMascot() {
  const setScrollProgress = useMascotStore(state => state.setScrollProgress);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined; // Default to dark

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

  useEffect(() => {
    const isElementClickable = (target: HTMLElement | null): HTMLElement | null => {
      let el = target;
      while (el && el !== document.body) {
        if (el.matches('button, a, [role="button"], input[type="submit"], input[type="button"]')) return el;
        try {
          if (window.getComputedStyle(el).cursor === 'pointer') return el;
        } catch (e) {}
        el = el.parentElement;
      }
      return null;
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isElementClickable(target)) {
        useMascotStore.getState().updateInteractionTime();
        useMascotStore.getState().setEmotion('happy');
        setTimeout(() => {
          if (target.matches(':hover') || isElementClickable(document.elementFromPoint(e.clientX, e.clientY) as HTMLElement)) {
            useMascotStore.getState().setEmotion('eager');
          } else {
            useMascotStore.getState().setEmotion('idle');
          }
        }, 1500);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isElementClickable(target)) {
        useMascotStore.getState().updateInteractionTime();
        const currentEmotion = useMascotStore.getState().emotion;
        if (currentEmotion !== 'happy' && currentEmotion !== 'eager' && currentEmotion !== 'curious' && currentEmotion !== 'thinking') {
          useMascotStore.getState().setEmotion('eager');
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickableElement = isElementClickable(target);
      
      if (clickableElement) {
        const relatedTarget = e.relatedTarget as Node | null;
        if (relatedTarget && clickableElement.contains(relatedTarget)) {
          return; // Ignore if moving to a child element inside the same button
        }

        if (useMascotStore.getState().emotion === 'eager') {
          useMascotStore.getState().setEmotion('idle');
        }
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      <Canvas dpr={[1, 1.5]} eventSource={typeof window !== 'undefined' ? document.body : undefined} eventPrefix="client" camera={{ position: [0, 0, 5], fov: 50 }} gl={{ powerPreference: "high-performance" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#00e5ff" /> 
        
        {/* Synthetic local environment. Zero downloads, instant metallic reflections! */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <directionalLight position={[0, 10, 0]} intensity={4} color="white" />
            <directionalLight position={[-10, 0, 10]} intensity={2} color="#00e5ff" />
            <directionalLight position={[10, 0, 10]} intensity={2} color="#ff007f" />
          </group>
        </Environment>
        
        <RobotLogic isDark={isDark} />
      </Canvas>
    </div>
  );
}
