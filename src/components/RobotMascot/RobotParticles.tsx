import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useMascotStore } from "@/store/mascotStore";

export function RobotParticles({ isDark }: { isDark: boolean }) {
  const { emotion, action } = useMascotStore();
  const time = useRef(0);
  
  const zzzGroupRef = useRef<THREE.Group>(null);
  const dizzyGroupRef = useRef<THREE.Group>(null);
  const eagerGroupRef = useRef<THREE.Group>(null);
  const heartsGroupRef = useRef<THREE.Group>(null);
  const steamGroupRef = useRef<THREE.Group>(null);
  const laughGroupRef = useRef<THREE.Group>(null);
  const angryTextGroupRef = useRef<THREE.Group>(null);
  const eagerMaterial = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  const loadingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ff0055", emissive: "#ff0055", emissiveIntensity: 2, toneMapped: false
  }), []);
  
  const zzzMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: isDark ? "#00e5ff" : "#0070f3", toneMapped: false, transparent: true, opacity: 0.8
  }), [isDark]);

  const cloudMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: isDark ? "#87CEEB" : "#ffcce6", // Light Blue in Dark, Cute Pink in Light
    roughness: 0.2, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.2, toneMapped: false
  }), [isDark]);

  const angrySteamMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ff1100", roughness: 0.2, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.2, toneMapped: false
  }), []);

  const smokeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: isDark ? "#ffffff" : "#ffb3cc", // White smoke in Dark, Pink smoke in Light
    transparent: true, opacity: 0.7, toneMapped: false
  }), [isDark]);

  const smokeGroupRef = useRef<THREE.Group>(null);
  const smokeTime = useRef(0);
  const isSmoking = useRef(false);
  const prevEmotion = useRef(emotion);

  useEffect(() => {
    // If emotion changed from curious/thinking to something else
    if ((prevEmotion.current === 'curious' || prevEmotion.current === 'thinking') && 
        (emotion !== 'curious' && emotion !== 'thinking')) {
      isSmoking.current = true;
      smokeTime.current = 0;
    }
    prevEmotion.current = emotion;
  }, [emotion]);

  useFrame((_, delta) => {
    time.current += delta;
    const t = time.current;

    if (zzzGroupRef.current && emotion === 'sleeping') {
      zzzGroupRef.current.position.y = 1.0 + (t % 2) * 0.5;
      zzzGroupRef.current.position.x = Math.sin(t * 4) * 0.2;
      zzzGroupRef.current.scale.setScalar(0.5 + (t % 2) * 0.5);
      const mat = zzzGroupRef.current.children[0] as THREE.Mesh;
      if (mat.material) {
        (mat.material as THREE.MeshBasicMaterial).opacity = 1 - (t % 2) / 2;
      }
    }

    if (eagerGroupRef.current) {
      if (emotion === 'eager') {
        eagerMaterial.color.setHSL((t * 0.4) % 1, 0.8, 0.6); // Slower, softer pastel rainbow
        eagerGroupRef.current.children.forEach((childGroup, i) => {
          const textMesh = childGroup.children[0] as THREE.Mesh;
          if (textMesh) {
            const localT = t * 3 + i * 2;
            textMesh.position.y = Math.sin(localT) * 0.1; // Independent bobbing
            textMesh.rotation.z = Math.sin(localT * 1.5) * 0.15; // Independent wobbling
            // Smoothly pop in
            textMesh.scale.x = THREE.MathUtils.lerp(textMesh.scale.x, 1, 0.15);
            textMesh.scale.y = THREE.MathUtils.lerp(textMesh.scale.y, 1, 0.15);
          }
        });
      } else {
        eagerGroupRef.current.children.forEach((childGroup) => {
          const textMesh = childGroup.children[0] as THREE.Mesh;
          if (textMesh) {
            // Smoothly shrink out when not confused
            textMesh.scale.x = THREE.MathUtils.lerp(textMesh.scale.x, 0, 0.2);
            textMesh.scale.y = THREE.MathUtils.lerp(textMesh.scale.y, 0, 0.2);
          }
        });
      }
    }

    if (heartsGroupRef.current && emotion === 'love') {
      heartsGroupRef.current.position.y = 1.2 + (t % 1.5) * 0.5;
      heartsGroupRef.current.children.forEach((child, i) => {
        child.position.x += Math.sin(t * 5 + i) * 0.005;
        const s = 1 - ((t % 1.5) / 1.5);
        child.scale.setScalar(s);
      });
    }

    if (laughGroupRef.current && emotion === 'laugh') {
      laughGroupRef.current.children.forEach((child, i) => {
        const localT = t * 2 + i * 0.5;
        child.position.y = (localT % 1.5) * 1.2; // Float up
        child.position.x = Math.sin(t * 5 + i) * 0.2 + (i - 1.5) * 0.6; // Spread out and wobble
        child.rotation.z = Math.sin(t * 4 + i) * 0.3; // Tilt back and forth
        const s = 1 - ((localT % 1.5) / 1.5); // Fade out by shrinking
        child.scale.setScalar(s);
      });
    }

    if (steamGroupRef.current && emotion === 'angry') {
      steamGroupRef.current.children.forEach((child, i) => {
        const localT = t * 6 + i; // Faster steam
        child.position.y = (localT % 2) * 1.5; // Shoot up higher
        child.position.x = Math.sin(localT * 3) * 0.3; // Wider wobble
        const s = 1 - ((localT % 2) / 2); // Shrink out
        child.scale.setScalar(s);
      });
    }

    if (angryTextGroupRef.current && emotion === 'angry') {
      angryTextGroupRef.current.children.forEach((child, i) => {
        const localT = t * 3 + i * 0.5;
        child.position.y = (localT % 1.5) * 1.5; // Float up fast
        child.position.x = (i - 1.5) * 0.5 + Math.sin(t * 30 + i) * 0.05; // Spread out and shake violently
        child.rotation.z = Math.sin(t * 40 + i) * 0.2; // Violent rotation shake
        const s = 1 - ((localT % 1.5) / 1.5); // Fade out by shrinking
        child.scale.setScalar(s);
      });
    }

    if (isSmoking.current && smokeGroupRef.current) {
      const smokeGroup = smokeGroupRef.current;
      smokeTime.current += delta;
      const st = smokeTime.current;
      
      if (st < 0.4) { // Fast smoke puff
        smokeGroup.children.forEach((child, i) => {
          const mesh = child as THREE.Mesh;
          const angle = (i / smokeGroup.children.length) * Math.PI * 2;
          const speed = 4; // Faster explosion
          mesh.position.x = Math.cos(angle) * (0.2 + st * speed);
          mesh.position.y = Math.sin(angle) * (0.1 + st * speed * 0.5);
          
          const s = Math.max(0, 1 - st * 2.5); // Shrink to 0 quickly
          mesh.scale.setScalar(s);
        });
      } else {
        isSmoking.current = false;
        smokeGroup.children.forEach(child => child.scale.setScalar(0));
      }
    }
  });

  return (
    <group>
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

      {/* Eager Question Marks */}
      <group ref={eagerGroupRef} position={[0, 1.8, 0]}>
        <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <Text scale={0} fontSize={0.7} material={eagerMaterial} anchorX="center" anchorY="middle">?</Text>
        </group>
        <group position={[0.4, 0.3, -0.1]} rotation={[0, 0, -0.2]}>
          <Text scale={0} fontSize={0.5} material={eagerMaterial} anchorX="center" anchorY="middle">?</Text>
        </group>
        <group position={[-0.4, 0.2, 0.1]} rotation={[0, 0, 0.3]}>
          <Text scale={0} fontSize={0.4} material={eagerMaterial} anchorX="center" anchorY="middle">?</Text>
        </group>
        <group position={[0.65, 0.6, -0.2]} rotation={[0, 0, -0.4]}>
          <Text scale={0} fontSize={0.25} material={eagerMaterial} anchorX="center" anchorY="middle">?</Text>
        </group>
        <group position={[-0.55, 0.5, 0.2]} rotation={[0, 0, 0.5]}>
          <Text scale={0} fontSize={0.3} material={eagerMaterial} anchorX="center" anchorY="middle">?</Text>
        </group>
      </group>

      {/* Floating Hearts */}
      {emotion === 'love' && (
        <group ref={heartsGroupRef} position={[0, 1.2, 0]}>
           <Text position={[-0.5, 0, 0]} fontSize={0.3} color="#ff0055" anchorX="center" anchorY="middle">❤️</Text>
           <Text position={[0.5, 0.2, 0]} fontSize={0.4} color="#ff0055" anchorX="center" anchorY="middle">❤️</Text>
           <Text position={[0, 0.4, 0]} fontSize={0.25} color="#ff0055" anchorX="center" anchorY="middle">❤️</Text>
        </group>
      )}

      {/* Laughing 'ha ha' */}
      {emotion === 'laugh' && (
        <group ref={laughGroupRef} position={[0, 1.0, 0]}>
           <Text fontSize={0.3} color={isDark ? "#ffcc00" : "#ff007f"} anchorX="center" anchorY="middle">ha</Text>
           <Text fontSize={0.4} color={isDark ? "#ffcc00" : "#ff007f"} anchorX="center" anchorY="middle">HA</Text>
           <Text fontSize={0.25} color={isDark ? "#ffcc00" : "#ff007f"} anchorX="center" anchorY="middle">ha</Text>
           <Text fontSize={0.35} color={isDark ? "#ffcc00" : "#ff007f"} anchorX="center" anchorY="middle">ha!</Text>
        </group>
      )}

      {/* Steam Puffs */}
      {emotion === 'angry' && (
        <group ref={steamGroupRef} position={[0, 0.7, 0]}>
           <mesh position={[-0.7, 0, 0]} material={angrySteamMaterial}><sphereGeometry args={[0.15, 12, 12]} /></mesh>
           <mesh position={[0.7, 0, 0]} material={angrySteamMaterial}><sphereGeometry args={[0.15, 12, 12]} /></mesh>
           <mesh position={[-0.8, 0.2, 0]} material={angrySteamMaterial}><sphereGeometry args={[0.1, 12, 12]} /></mesh>
           <mesh position={[0.8, 0.2, 0]} material={angrySteamMaterial}><sphereGeometry args={[0.1, 12, 12]} /></mesh>
        </group>
      )}

      {/* Angry 'ugh' */}
      {emotion === 'angry' && (
        <group ref={angryTextGroupRef} position={[0, 1.0, 0]}>
           <Text fontSize={0.3} color="#ff0000" anchorX="center" anchorY="middle">ugh</Text>
           <Text fontSize={0.4} color="#ff0000" anchorX="center" anchorY="middle">UGHH</Text>
           <Text fontSize={0.25} color="#ff0000" anchorX="center" anchorY="middle">ugh</Text>
           <Text fontSize={0.35} color="#ff0000" anchorX="center" anchorY="middle">ughh!</Text>
        </group>
      )}

      {/* Cloud Vanishing Smoke Effect */}
      <group ref={smokeGroupRef} position={[0.6, 2.8, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} material={smokeMaterial} scale={0}>
            <sphereGeometry args={[0.3, 12, 12]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
