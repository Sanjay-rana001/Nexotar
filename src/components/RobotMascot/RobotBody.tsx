import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useMascotStore } from "@/store/mascotStore";
import { RobotFace } from "./RobotFace";

const DizzyStars = ({ emotion, starGeometry, starMaterial }: { emotion: string, starGeometry: THREE.ExtrudeGeometry, starMaterial: THREE.MeshStandardMaterial }) => {
  const starsRef = useRef<THREE.Group>(null);
  const starRefs = useRef<(THREE.Mesh | null)[]>([]);
  
  useFrame((state) => {
    if (starsRef.current && emotion === 'dizzy') {
      starsRef.current.rotation.y = state.clock.elapsedTime * 2.5; // Smooth orbit speed
      starsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.1; // Slight wobble
      
      // Spin each star locally so they aren't flat!
      starRefs.current.forEach((star) => {
        if (star) {
          star.rotation.y = state.clock.elapsedTime * 4;
        }
      });
    }
  });

  if (emotion !== 'dizzy') return null;

  return (
    <group ref={starsRef} position={[0, 0.7, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh 
          key={i} 
          ref={(el) => { starRefs.current[i] = el; }}
          geometry={starGeometry} 
          material={starMaterial} 
          position={[Math.cos((i * Math.PI * 2) / 3) * 0.9, 0, Math.sin((i * Math.PI * 2) / 3) * 0.9]}
        />
      ))}
    </group>
  );
};

export function RobotBody({ isDark }: { isDark: boolean }) {
  const { emotion, action, targetPosition } = useMascotStore();
  
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Mesh>(null);
  const chestCoreRef = useRef<THREE.Mesh>(null);
  const capeRef = useRef<THREE.Group>(null);
  
  // Track world position to calculate flight speed
  const lastWorldPos = useRef(new THREE.Vector3());

  const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: isDark ? "#ffffff" : "#ffe4e8", // Cute pastel pink body
    roughness: 0.15, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1
  }), [isDark]);
  
  const jointMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isDark ? "#111111" : "#ffb6c1", // Soft pink joints
    roughness: 0.2, metalness: 0.8 // Glossy dark joints
  }), [isDark]);

  const coreMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: isDark ? "#00e5ff" : "#ff007f", // Hot pink core in light mode
    emissive: isDark ? "#00e5ff" : "#ff007f", 
    emissiveIntensity: 2, toneMapped: false
  }), [isDark]);

  const capeMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: isDark ? "#ff0000" : "#ff3b30", // Pure red in dark mode, slightly softer red in light mode
        metalness: 0.1,
        roughness: 0.7,
        clearcoat: 0.2,
        side: THREE.DoubleSide,
      }),
    [isDark]
  );

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
  
  // Hover and Animation Logic
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    if (rootRef.current) {
      // 1. Calculate how far he is from his destination
      // This is completely bug-free because it doesn't rely on frame timing or derivatives.
      let flightFactor = 0;
      let poseLerp = 0.1; // Default smooth idle speed
      
      if (rootRef.current.parent) {
        const targetPos = useMascotStore.getState().targetPosition;
        const dist = rootRef.current.parent.position.distanceTo(targetPos);
        // Trigger Superman pose immediately if he has to move!
        // Stays in full pose until he is very close (1.5 units)
        flightFactor = THREE.MathUtils.clamp((dist - 1.0) / 0.5, 0, 1);
        
        // If he's flying, snap into the pose 4x faster!
        if (flightFactor > 0.1) {
          poseLerp = 0.4;
        }
      }

      // Default idle motions
      let rootPosY = Math.sin(t * 1.5) * 0.05;
      
      if (!headRef.current || !leftArmRef.current || !rightArmRef.current || !leftLegRef.current || !rightLegRef.current || !antennaRef.current || !rootRef.current) return;

      // Get exact screen position of the robot
      headRef.current.getWorldPosition(worldPos);
      worldPos.project(state.camera);
      
      // Calculate cursor position RELATIVE to the robot's actual position
      const pointerOffsetX = THREE.MathUtils.clamp(state.pointer.x - worldPos.x, -1.5, 1.5);
      const pointerOffsetY = THREE.MathUtils.clamp(state.pointer.y - worldPos.y, -1.5, 1.5);

      // Direct cursor tracking (much wider head movements, perfectly aligned with his body)
      const targetHeadRotY = (pointerOffsetX * Math.PI) / 6; // Reduced sweep
      const targetHeadRotX = -(pointerOffsetY * Math.PI) / 8 + Math.sin(t) * 0.05; // Reduced pitch

      let headRotX = targetHeadRotX;
      let headRotY = targetHeadRotY;
      let headRotZ = -(pointerOffsetX * Math.PI) / 32; // Reduced tilt
      
      let leftArmRotZ = -0.2 + Math.sin(t * 2) * 0.1;
      let rightArmRotZ = 0.2 + Math.sin(t * 2 + Math.PI) * 0.1;
      let leftArmRotX = 0;
      let rightArmRotX = 0;
      
      let leftLegPosY = Math.sin(t * 2 + Math.PI / 2) * 0.05;
      let rightLegPosY = Math.sin(t * 2 + Math.PI * 1.5) * 0.05;
      let leftLegRotX = 0;
      let rightLegRotX = 0;
      
      let rootRotX = 0;
      let rootRotZ = 0;

      if (emotion === 'sleeping') {
        headRotX = 0.4;
        leftArmRotZ = -0.5; rightArmRotZ = 0.5;
        rootPosY = -0.6;
      }

      if (emotion === 'dizzy') {
        // Slower, smoother dizzy wobble (t * 5 instead of t * 10)
        headRotZ = Math.sin(t * 5) * 0.3;
        headRotX = Math.cos(t * 5) * 0.3;
        headRotY = Math.sin(t * 3) * 0.5; // Gentle wobble left and right instead of full Exorcist spin
        leftArmRotZ = -0.8 + Math.sin(t * 5) * 0.2;
        rightArmRotZ = 0.8 + Math.cos(t * 5) * 0.2;
      }

      if (action === 'wave') {
        rightArmRotZ = 2.5 + Math.sin(t * 15) * 0.5;
      } else if (action === 'sit') {
        rootPosY = -0.5;
        leftLegPosY = 0.2; rightLegPosY = 0.2;
        leftArmRotZ = -0.4; rightArmRotZ = 0.4;
      } else if (action === 'fall') {
        rootRotX = 0.2; // Gentle slump forward instead of flipping on back
        rootPosY = -0.6; // Fall a little down vertically
        leftLegRotX = 0.2; // Legs dangle
        rightLegRotX = 0.2;
      } else if (action === 'jump') {
        rootPosY = Math.abs(Math.sin(t * 8)) * 1.5;
        leftArmRotZ = -2.5; rightArmRotZ = 2.5;
      } else if (action === 'celebrate') {
        rootPosY = Math.abs(Math.sin(t * 10)) * 1.0;
        leftArmRotZ = -3 + Math.sin(t * 20) * 0.5;
        rightArmRotZ = 3 + Math.cos(t * 20) * 0.5;
        headRotY = t * 5;
      } else if (action === 'handsOnChest') {
        rootPosY = Math.abs(Math.sin(t * 6)) * 0.15; // Bounce
        leftArmRotZ = -1.2; leftArmRotX = -0.8;
        rightArmRotZ = 1.2; rightArmRotX = -0.8;
      } else if (action === 'handsOnBelly') {
        rootRotX = -0.2 + Math.sin(t * 15) * 0.05; // Lean back laughing
        rootRotZ = Math.sin(t * 20) * 0.08; // Shake side to side
        rootPosY = Math.sin(t * 20) * 0.05; // Bounce up and down
        leftArmRotZ = -0.5; leftArmRotX = -0.5;
        rightArmRotZ = 0.5; rightArmRotX = -0.5;
        headRotX = -0.3 + Math.sin(t * 15) * 0.1; // Throw head back
      } else if (action === 'crossArms') {
        rootRotX = 0.15; // Lean forward aggressively
        rootRotZ = Math.sin(t * 35) * 0.04; // Shake violently with rage
        rootPosY = Math.sin(t * 20) * 0.02; // Heavy breathing tension
        leftArmRotZ = -1.2; leftArmRotX = -1.0; // Tighter arm cross
        rightArmRotZ = 1.2; rightArmRotX = -1.0;
        headRotX = 0.3 + Math.sin(t * 35) * 0.02; // Head down and vibrating
      } else if (action === 'sitUp') {
        rootPosY = -0.6;
        rootRotX = -0.1; // Slight lean back
        leftLegRotX = -Math.PI / 2; rightLegRotX = -Math.PI / 2; // Legs straight out
      } else if (action === 'rubHead') {
        rootPosY = -0.6;
        rootRotX = -0.1;
        leftLegRotX = -Math.PI / 2; rightLegRotX = -Math.PI / 2;
        rightArmRotZ = 2.5; rightArmRotX = -0.2; // Hand to head
        headRotZ = 0.2; // Tilt head into hand
      }
      
      // SUPERMAN FLIGHT OVERRIDE
      // Smoothly blend the final rotations towards the Superman pose based on flight speed!
      if (emotion !== 'dizzy' && action !== 'fall' && action !== 'sit') {
        rootRotX = THREE.MathUtils.lerp(rootRotX, 1.57, flightFactor); // Positive 1.57 pitches head forward!
        
        // Classic Superman pose: One arm forward, one arm tucked!
        leftArmRotZ = THREE.MathUtils.lerp(leftArmRotZ, 0.0, flightFactor); // Tucked against body
        leftArmRotX = THREE.MathUtils.lerp(leftArmRotX, 0.0, flightFactor); // Pointing back along the body
        
        rightArmRotZ = THREE.MathUtils.lerp(rightArmRotZ, 0.0, flightFactor); 
        rightArmRotX = THREE.MathUtils.lerp(rightArmRotX, -3.14, flightFactor); // Right arm straight forward
        
        headRotX = THREE.MathUtils.lerp(headRotX, -1.2, flightFactor); // Negative to tilt head up/forward
      }

      headRef.current.rotation.set(
        THREE.MathUtils.lerp(headRef.current.rotation.x, headRotX, poseLerp),
        THREE.MathUtils.lerp(headRef.current.rotation.y, headRotY, poseLerp),
        THREE.MathUtils.lerp(headRef.current.rotation.z, headRotZ, poseLerp)
      );

      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, leftArmRotZ, poseLerp);
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, leftArmRotX, poseLerp);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, rightArmRotZ, poseLerp);
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, rightArmRotX, poseLerp);

      leftLegRef.current.position.y = THREE.MathUtils.lerp(leftLegRef.current.position.y, leftLegPosY, poseLerp);
      leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, leftLegRotX, poseLerp);
      rightLegRef.current.position.y = THREE.MathUtils.lerp(rightLegRef.current.position.y, rightLegPosY, poseLerp);
      rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, rightLegRotX, poseLerp);

      rootRef.current.position.y = THREE.MathUtils.lerp(rootRef.current.position.y, rootPosY, poseLerp);
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, rootRotX, poseLerp);
      rootRef.current.rotation.z = THREE.MathUtils.lerp(rootRef.current.rotation.z, rootRotZ, poseLerp);

      antennaRef.current.rotation.z = Math.sin(t * 5) * 0.1;
      if (action === 'jump' || action === 'celebrate') antennaRef.current.rotation.z = Math.sin(t * 15) * 0.5;

      // Animated LED Chest Core
      if (chestCoreRef.current) {
        chestCoreRef.current.rotation.z += delta * 2; // Spin smoothly
        chestCoreRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.1);
      }
      
      // Dynamic Cape Waving
      if (capeRef.current) {
        // Base rotation + wave + extra flair if falling or dizzy
        let targetX = 0.4 + Math.sin(t * 3) * 0.1;
        let targetZ = Math.sin(t * 2) * 0.05;
        
        if (action === 'fall') {
          targetX = 1.2; // cape flies up
        }
        
        // Superman Cape Override! Blows straight back in the wind!
        // The body is already horizontal, so a slight rotation makes it float right off his back.
        targetX = THREE.MathUtils.lerp(targetX, 0.4, flightFactor);
        
        capeRef.current.rotation.x = THREE.MathUtils.lerp(capeRef.current.rotation.x, targetX, 0.1);
        capeRef.current.rotation.z = THREE.MathUtils.lerp(capeRef.current.rotation.z, targetZ, 0.1);
      }
    }
  });

  return (
    <group ref={rootRef} scale={0.9}>
      {/* Head */}
      <group ref={headRef} position={[0, 0.7, 0]}>
        {/* Wide Pill Head */}
        <RoundedBox args={[1.2, 0.9, 1.0]} radius={0.4} smoothness={8} material={bodyMaterial} />
        
        {/* Dizzy Stars! */}
        <DizzyStars emotion={emotion} starGeometry={starGeometry} starMaterial={starMaterial} />
        
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
        <RobotFace isDark={isDark} />
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
        
        {/* Dynamic Cape */}
        <group position={[0, 0.3, 0]} ref={capeRef}>
          {/* We translate the mesh down so it hinges exactly from the upper back/neck */}
          {/* By keeping X and Z at 0, the cylinder shares the same origin as the torso, wrapping it perfectly! */}
          <mesh material={capeMaterial} position={[0, -0.4, 0]}>
            {/* Flared Cylinder: radiusTop=0.42 (hugs 0.4 torso), radiusBottom=0.7 (flares out) */}
            {/* thetaStart=Math.PI * 0.6, thetaLength=Math.PI * 0.8 perfectly centers it on the back (-Z) */}
            <cylinderGeometry args={[0.42, 0.7, 0.8, 16, 1, true, Math.PI * 0.6, Math.PI * 0.8]} />
          </mesh>
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
