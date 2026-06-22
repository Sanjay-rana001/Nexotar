import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useMascotStore } from "@/store/mascotStore";
import { RobotFace } from "./RobotFace";

export function RobotBody() {
  const { emotion, action, targetPosition } = useMascotStore();
  
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Mesh>(null);
  const chestCoreRef = useRef<THREE.Mesh>(null);

  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff", roughness: 0.15, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1
  }), []);
  
  const jointMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#111111", roughness: 0.2, metalness: 0.8 // Glossy dark joints
  }), []);

  const coreMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#00e5ff", emissive: "#00e5ff", emissiveIntensity: 2, toneMapped: false
  }), []);

  const starMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ffd700", emissive: "#ffaa00", emissiveIntensity: 1.5, toneMapped: false
  }), []);

  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 0.16; // Doubled size
    const innerRadius = 0.07;
    const spikes = 5;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      // Start at top (-PI/2)
      const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.04, // Made it thicker
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01
    });
    geo.center();
    return geo;
  }, []);

  const time = useRef(0);
  const { viewport } = useThree();
  const worldPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    time.current += delta;
    const t = time.current;

    if (!headRef.current || !leftArmRef.current || !rightArmRef.current || !leftLegRef.current || !rightLegRef.current || !antennaRef.current || !rootRef.current) return;

    // Get exact screen position of the robot
    headRef.current.getWorldPosition(worldPos);
    worldPos.project(state.camera);
    
    // Calculate cursor position RELATIVE to the robot's actual position
    const pointerOffsetX = THREE.MathUtils.clamp(state.pointer.x - worldPos.x, -1.5, 1.5);
    const pointerOffsetY = THREE.MathUtils.clamp(state.pointer.y - worldPos.y, -1.5, 1.5);

    // Direct cursor tracking (much wider head movements, perfectly aligned with his body)
    const targetHeadRotY = (pointerOffsetX * Math.PI) / 3; // Wider 60 degree sweep left/right
    const targetHeadRotX = -(pointerOffsetY * Math.PI) / 4 + Math.sin(t) * 0.05; // Wider 45 degree pitch up/down

    let headRotX = targetHeadRotX;
    let headRotY = targetHeadRotY;
    let headRotZ = -(pointerOffsetX * Math.PI) / 12; // Adorable tilt based on relative offset
    
    let leftArmRotZ = -0.2 + Math.sin(t * 2) * 0.1;
    let rightArmRotZ = 0.2 + Math.sin(t * 2 + Math.PI) * 0.1;
    let leftArmRotX = 0;
    let rightArmRotX = 0;
    
    let leftLegPosY = Math.sin(t * 2 + Math.PI / 2) * 0.05;
    let rightLegPosY = Math.sin(t * 2 + Math.PI * 1.5) * 0.05;
    
    let rootPosY = Math.sin(t * 1.5) * 0.05;
    let rootRotX = 0;
    let rootRotZ = 0;

    if (emotion === 'sleeping') {
      headRotX = 0.4;
      leftArmRotZ = -0.5; rightArmRotZ = 0.5;
      rootPosY = -0.6;
    }

    if (emotion === 'dizzy') {
      headRotZ = Math.sin(t * 5) * 0.3;
      headRotX = Math.cos(t * 5) * 0.3;
      leftArmRotZ = -0.8 + Math.sin(t * 10) * 0.2;
      rightArmRotZ = 0.8 + Math.cos(t * 10) * 0.2;
    }

    if (action === 'wave') {
      rightArmRotZ = 2.5 + Math.sin(t * 15) * 0.5;
    } else if (action === 'sit') {
      rootPosY = -0.5;
      leftLegPosY = 0.2; rightLegPosY = 0.2;
      leftArmRotZ = -0.4; rightArmRotZ = 0.4;
    } else if (action === 'fall') {
      rootRotX = -Math.PI / 2;
      rootPosY = -0.8; headRotX = -0.2;
    } else if (action === 'jump') {
      rootPosY = Math.abs(Math.sin(t * 8)) * 1.5;
      leftArmRotZ = -2.5; rightArmRotZ = 2.5;
    } else if (action === 'celebrate') {
      rootPosY = Math.abs(Math.sin(t * 10)) * 1.0;
      leftArmRotZ = -3 + Math.sin(t * 20) * 0.5;
      rightArmRotZ = 3 + Math.cos(t * 20) * 0.5;
      headRotY = t * 5;
    }

    headRef.current.rotation.set(
      THREE.MathUtils.lerp(headRef.current.rotation.x, headRotX, 0.1),
      THREE.MathUtils.lerp(headRef.current.rotation.y, headRotY, 0.1),
      THREE.MathUtils.lerp(headRef.current.rotation.z, headRotZ, 0.1)
    );

    leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, leftArmRotZ, 0.1);
    leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, leftArmRotX, 0.1);
    rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, rightArmRotZ, 0.1);
    rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, rightArmRotX, 0.1);

    leftLegRef.current.position.y = THREE.MathUtils.lerp(leftLegRef.current.position.y, leftLegPosY, 0.1);
    rightLegRef.current.position.y = THREE.MathUtils.lerp(rightLegRef.current.position.y, rightLegPosY, 0.1);

    rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, rootPosY, 0.1);
    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, rootRotX, 0.1);
    rootRef.current.rotation.z = THREE.MathUtils.lerp(rootRef.current.rotation.z, rootRotZ, 0.1);

    antennaRef.current.rotation.z = Math.sin(t * 5) * 0.1;
    if (action === 'jump' || action === 'celebrate') antennaRef.current.rotation.z = Math.sin(t * 15) * 0.5;

    // Animated LED Chest Core
    if (chestCoreRef.current) {
      chestCoreRef.current.rotation.z += delta * 2; // Spin smoothly
      const pulse = 1 + Math.sin(t * 4) * 0.1; // Gentle digital breathing pulse
      chestCoreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={rootRef} scale={0.9}>
      {/* Head */}
      <group ref={headRef} position={[0, 0.7, 0]}>
        {/* Wide Pill Head */}
        <RoundedBox args={[1.2, 0.9, 1.0]} radius={0.4} smoothness={8} material={bodyMaterial} />
        
        {/* Earmuffs */}
        <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={bodyMaterial}>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
          <mesh position={[0, 0.06, 0]} material={coreMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          </mesh>
        </mesh>
        <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={bodyMaterial}>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
          <mesh position={[0, -0.06, 0]} material={coreMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          </mesh>
        </mesh>
        
        {/* Antenna */}
        <group ref={antennaRef} position={[0, 0.45, -0.1]} rotation={[0.2, 0, 0]}>
          <mesh material={jointMaterial} position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3]} />
          </mesh>
          <mesh material={coreMaterial} position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.08, 32, 32]} />
          </mesh>
        </group>

        {/* Visor & Face */}
        <RobotFace />
      </group>

      {/* Body Core */}
      <group position={[0, -0.2, 0]}>
        {/* Sleek Torso */}
        <mesh material={bodyMaterial} position={[0, 0.05, 0]}>
          <capsuleGeometry args={[0.4, 0.3, 32, 32]} />
        </mesh>
        
        {/* Glowing Chest Core */}
        <group position={[0, 0.15, 0.38]}>
          <mesh material={bodyMaterial} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 32]} />
          </mesh>
          <mesh material={coreMaterial} position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
          </mesh>
          {/* Animated Glowing Star Core */}
          <mesh ref={chestCoreRef} material={starMaterial} position={[0, 0, 0.08]} geometry={starGeometry} />
        </group>
      </group>

      {/* Arms */}
      {/* Left Arm */}
      <group position={[-0.55, 0.1, 0]}>
        <group ref={leftArmRef}>
          {/* Shoulder Joint */}
          <mesh material={jointMaterial}><sphereGeometry args={[0.12, 32, 32]} /></mesh>
          {/* Upper Arm */}
          <mesh material={bodyMaterial} position={[-0.1, -0.2, 0]} rotation={[0, 0, -0.3]}>
             <capsuleGeometry args={[0.12, 0.2, 32, 32]} />
          </mesh>
          {/* Hand/Fingers */}
          <mesh material={jointMaterial} position={[-0.2, -0.45, 0]}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <mesh position={[-0.05, -0.1, 0.05]}><capsuleGeometry args={[0.03, 0.08, 16, 16]} /></mesh>
            <mesh position={[-0.05, -0.1, -0.05]}><capsuleGeometry args={[0.03, 0.08, 16, 16]} /></mesh>
            <mesh position={[0.05, -0.1, 0]}><capsuleGeometry args={[0.03, 0.08, 16, 16]} /></mesh>
          </mesh>
        </group>
      </group>

      {/* Right Arm */}
      <group position={[0.55, 0.1, 0]}>
        <group ref={rightArmRef}>
          {/* Shoulder Joint */}
          <mesh material={jointMaterial}><sphereGeometry args={[0.12, 32, 32]} /></mesh>
          {/* Upper Arm */}
          <mesh material={bodyMaterial} position={[0.1, -0.2, 0]} rotation={[0, 0, 0.3]}>
             <capsuleGeometry args={[0.12, 0.2, 32, 32]} />
          </mesh>
          {/* Hand/Fingers */}
          <mesh material={jointMaterial} position={[0.2, -0.45, 0]}>
            <sphereGeometry args={[0.1, 32, 32]} />
            <mesh position={[0.05, -0.1, 0.05]}><capsuleGeometry args={[0.03, 0.08, 16, 16]} /></mesh>
            <mesh position={[0.05, -0.1, -0.05]}><capsuleGeometry args={[0.03, 0.08, 16, 16]} /></mesh>
            <mesh position={[-0.05, -0.1, 0]}><capsuleGeometry args={[0.03, 0.08, 16, 16]} /></mesh>
          </mesh>
        </group>
      </group>
      
      {/* Legs */}
      {/* Left Leg */}
      <group position={[-0.25, -0.65, 0]}>
        <group ref={leftLegRef}>
          {/* Hip Joint */}
          <mesh material={jointMaterial}><sphereGeometry args={[0.12, 32, 32]} /></mesh>
          {/* Boot */}
          <RoundedBox args={[0.3, 0.25, 0.35]} radius={0.1} smoothness={4} material={bodyMaterial} position={[0, -0.25, 0.05]} />
          {/* Boot Glow Accent */}
          <mesh material={coreMaterial} position={[0, -0.2, 0.23]}>
            <boxGeometry args={[0.15, 0.05, 0.05]} />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group position={[0.25, -0.65, 0]}>
        <group ref={rightLegRef}>
          {/* Hip Joint */}
          <mesh material={jointMaterial}><sphereGeometry args={[0.12, 32, 32]} /></mesh>
          {/* Boot */}
          <RoundedBox args={[0.3, 0.25, 0.35]} radius={0.1} smoothness={4} material={bodyMaterial} position={[0, -0.25, 0.05]} />
          {/* Boot Glow Accent */}
          <mesh material={coreMaterial} position={[0, -0.2, 0.23]}>
            <boxGeometry args={[0.15, 0.05, 0.05]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
