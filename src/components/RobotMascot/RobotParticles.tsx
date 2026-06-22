import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMascotStore } from "@/store/mascotStore";

export function RobotParticles() {
  const { emotion, action } = useMascotStore();
  const time = useRef(0);
  
  const zzzGroupRef = useRef<THREE.Group>(null);
  const dizzyGroupRef = useRef<THREE.Group>(null);
  const loadingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ff0055", emissive: "#ff0055", emissiveIntensity: 2, toneMapped: false
  }), []);
  
  const zzzMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#00e5ff", toneMapped: false, transparent: true, opacity: 0.8
  }), []);

  useFrame((_, delta) => {
    time.current += delta;
    const t = time.current;

    if (dizzyGroupRef.current && emotion === 'dizzy') {
      dizzyGroupRef.current.rotation.y = t * 5;
      dizzyGroupRef.current.position.y = 1.2 + Math.sin(t * 10) * 0.1;
    }

    if (zzzGroupRef.current && emotion === 'sleeping') {
      zzzGroupRef.current.position.y = 1.0 + (t % 2) * 0.5;
      zzzGroupRef.current.position.x = Math.sin(t * 4) * 0.2;
      zzzGroupRef.current.scale.setScalar(0.5 + (t % 2) * 0.5);
      const mat = zzzGroupRef.current.children[0] as THREE.Mesh;
      if (mat.material) {
        (mat.material as THREE.MeshBasicMaterial).opacity = 1 - (t % 2) / 2;
      }
    }
  });

  return (
    <group>
      {/* Dizzy Stars */}
      {emotion === 'dizzy' && (
        <group ref={dizzyGroupRef}>
          <mesh position={[0.6, 0, 0]} material={loadingMaterial}><sphereGeometry args={[0.06]} /></mesh>
          <mesh position={[-0.6, 0, 0]} material={loadingMaterial}><sphereGeometry args={[0.06]} /></mesh>
          <mesh position={[0, 0, 0.6]} material={loadingMaterial}><sphereGeometry args={[0.06]} /></mesh>
          <mesh position={[0, 0, -0.6]} material={loadingMaterial}><sphereGeometry args={[0.06]} /></mesh>
        </group>
      )}

      {/* Sleeping ZZZ */}
      {emotion === 'sleeping' && (
        <group ref={zzzGroupRef} position={[0.5, 1, 0]}>
          <mesh material={zzzMaterial}>
            {/* simple Z made of thin boxes */}
            <boxGeometry args={[0.2, 0.05, 0.05]} />
          </mesh>
          <mesh material={zzzMaterial} position={[0, -0.15, 0]}>
            <boxGeometry args={[0.2, 0.05, 0.05]} />
          </mesh>
          <mesh material={zzzMaterial} position={[0, -0.075, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.25, 0.05, 0.05]} />
          </mesh>
        </group>
      )}

      {/* Thinking Bubble */}
      {emotion === 'thinking' && (
        <group position={[0.6, 1.2, 0]}>
          <mesh material={zzzMaterial}>
            <sphereGeometry args={[0.15, 16, 16]} />
          </mesh>
          <mesh material={zzzMaterial} position={[-0.2, -0.2, 0]}>
            <sphereGeometry args={[0.05, 16, 16]} />
          </mesh>
        </group>
      )}
    </group>
  );
}
