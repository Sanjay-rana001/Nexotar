import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useMascotStore } from "@/store/mascotStore";

export function RobotFace() {
  const { emotion, targetPosition } = useMascotStore();
  const { viewport } = useThree();
  
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);

  const screenMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#050505", roughness: 0.1, metalness: 0.8, clearcoat: 1.0
  }), []);
  
  const eyeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#0088ff", toneMapped: false
  }), []);

  // Fake bloom/glow effect for the digital screen
  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#0088ff", transparent: true, opacity: 0.4, toneMapped: false
  }), []);

  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const time = useRef(0);

  useFrame((state, delta) => {
    time.current += delta;
    const t = time.current;

    if (!leftEyeRef.current || !rightEyeRef.current) return;

    // Calculate cursor position RELATIVE to the robot's exact screen position
    leftEyeRef.current.getWorldPosition(worldPos);
    worldPos.project(state.camera);
    
    const pointerOffsetX = state.pointer.x - worldPos.x;
    const pointerOffsetY = state.pointer.y - worldPos.y;

    let leftEyeScaleY = 1, rightEyeScaleY = 1;
    let leftEyeScaleX = 1, rightEyeScaleX = 1;
    
    // Base positions
    let leftEyeBaseX = -0.25;
    let rightEyeBaseX = 0.25;
    let leftEyeBaseY = 0.05;
    let rightEyeBaseY = 0.05;
    
    let leftEyeRotZ = 0, rightEyeRotZ = 0;

    switch (emotion) {
      case 'idle':
        if (Math.sin(t * 3) > 0.98) { // Blink
          leftEyeScaleY = 0.1; rightEyeScaleY = 0.1;
        }
        break;
      case 'happy':
      case 'excited':
        leftEyeScaleY = 0.4; rightEyeScaleY = 0.4;
        leftEyeScaleX = 1.2; rightEyeScaleX = 1.2;
        leftEyeBaseY = 0.08; rightEyeBaseY = 0.08;
        leftEyeRotZ = 0.2; rightEyeRotZ = -0.2; // cute angled eyes
        break;
      case 'laugh':
        leftEyeScaleY = 0.1; rightEyeScaleY = 0.1;
        leftEyeScaleX = 1.5; rightEyeScaleX = 1.5;
        leftEyeBaseY = 0.05; rightEyeBaseY = 0.05;
        leftEyeRotZ = 0.3; rightEyeRotZ = -0.3;
        break;
      case 'sad':
        leftEyeScaleY = 0.6; rightEyeScaleY = 0.6;
        leftEyeBaseY = -0.05; rightEyeBaseY = -0.05;
        leftEyeRotZ = -0.2; rightEyeRotZ = 0.2;
        break;
      case 'angry':
        leftEyeScaleY = 0.4; rightEyeScaleY = 0.4;
        leftEyeRotZ = 0.3; rightEyeRotZ = -0.3;
        break;
      case 'thinking':
        leftEyeScaleY = 1; rightEyeScaleY = 0.5;
        leftEyeBaseY = 0.08; rightEyeBaseY = 0.02;
        break;
      case 'dizzy':
        leftEyeRotZ = t * 10; rightEyeRotZ = t * 10;
        break;
      case 'sleeping':
        leftEyeScaleY = 0.05; rightEyeScaleY = 0.05;
        leftEyeBaseY = -0.05; rightEyeBaseY = -0.05;
        break;
    }

    // Direct cursor tracking for eyes - strictly clamped to stay inside the physical screen!
    const maxEyeOffsetX = 0.16; // Exact distance to the edge of the screen
    const maxEyeOffsetY = 0.12; 
    
    // Use high multipliers for sensitivity, but strict bounds for clamping
    // Increased to 0.6 so eyes dart towards cursor aggressively
    const eyeOffsetX = THREE.MathUtils.clamp(pointerOffsetX * 0.6, -maxEyeOffsetX, maxEyeOffsetX);
    const eyeOffsetY = THREE.MathUtils.clamp(pointerOffsetY * 0.6, -maxEyeOffsetY, maxEyeOffsetY);

    const targetLeftEyeX = leftEyeBaseX + eyeOffsetX;
    const targetRightEyeX = rightEyeBaseX + eyeOffsetX;
    const targetLeftEyeY = leftEyeBaseY + eyeOffsetY;
    const targetRightEyeY = rightEyeBaseY + eyeOffsetY;

    leftEyeRef.current.scale.set(THREE.MathUtils.lerp(leftEyeRef.current.scale.x, leftEyeScaleX, 0.2), THREE.MathUtils.lerp(leftEyeRef.current.scale.y, leftEyeScaleY, 0.2), 1);
    rightEyeRef.current.scale.set(THREE.MathUtils.lerp(rightEyeRef.current.scale.x, rightEyeScaleX, 0.2), THREE.MathUtils.lerp(rightEyeRef.current.scale.y, rightEyeScaleY, 0.2), 1);
    
    // Lerp both X and Y positions
    leftEyeRef.current.position.x = THREE.MathUtils.lerp(leftEyeRef.current.position.x, targetLeftEyeX, 0.2);
    leftEyeRef.current.position.y = THREE.MathUtils.lerp(leftEyeRef.current.position.y, targetLeftEyeY, 0.2);
    rightEyeRef.current.position.x = THREE.MathUtils.lerp(rightEyeRef.current.position.x, targetRightEyeX, 0.2);
    rightEyeRef.current.position.y = THREE.MathUtils.lerp(rightEyeRef.current.position.y, targetRightEyeY, 0.2);
    
    leftEyeRef.current.rotation.z = THREE.MathUtils.lerp(leftEyeRef.current.rotation.z, leftEyeRotZ, 0.2);
    rightEyeRef.current.rotation.z = THREE.MathUtils.lerp(rightEyeRef.current.rotation.z, rightEyeRotZ, 0.2);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Visor - Wider flat surface to prevent clipping */}
      <RoundedBox args={[0.95, 0.55, 0.15]} radius={0.05} smoothness={4} material={screenMaterial} position={[0, 0, 0.45]} />
      
      {/* Eyes (Perfectly flush against the glass surface) */}
      <group ref={leftEyeRef} position={[-0.25, 0.05, 0.526]}>
        <mesh material={eyeMaterial}>
          <RoundedBox args={[0.12, 0.2, 0.001]} radius={0.06} smoothness={4} />
        </mesh>
      </group>
      <group ref={rightEyeRef} position={[0.25, 0.05, 0.526]}>
        <mesh material={eyeMaterial}>
          <RoundedBox args={[0.12, 0.2, 0.001]} radius={0.06} smoothness={4} />
        </mesh>
      </group>
    </group>
  );
}
