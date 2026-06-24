import { useEffect } from 'react';
import * as THREE from 'three';
import { useMascotStore } from '@/store/mascotStore';
import { useThree } from '@react-three/fiber';

export function useRobotMovement() {
  const { scrollProgress, setTargetPosition, setEmotion, emotion, action } = useMascotStore();
  const { viewport } = useThree(); // Get real screen dimensions

  useEffect(() => {
    // If the robot is dizzy or sleeping, don't force an emotion override on scroll
    const isBusy = emotion === 'dizzy' || emotion === 'sleeping' || action === 'sit' || action === 'fall';

    // Dynamically calculate the safe X position so he NEVER goes off screen
    // On mobile, remove padding completely to push him to the absolute edge
    const isMobile = viewport.width < 5;
    const padding = isMobile ? 0 : 0.5;
    const safeX = Math.max(0, (viewport.width / 2) - padding);

    const SAFE_ZONES = [
      { progress: 0.0, position: new THREE.Vector3(safeX, 1.5, 0), emotion: 'excited' }, // Hero Top Right
      { progress: 0.2, position: new THREE.Vector3(-safeX, 0.5, -1), emotion: 'happy' }, // Services Left
      { progress: 0.4, position: new THREE.Vector3(safeX, 0.0, -1), emotion: 'idle' }, // Process Right
      { progress: 0.6, position: new THREE.Vector3(-safeX, -0.5, -1), emotion: 'happy' }, // Works Left
      { progress: 0.8, position: new THREE.Vector3(safeX, 0.5, 0), emotion: 'laugh' }, // Testimonials Right
      { progress: 1.0, position: new THREE.Vector3(-safeX, 0.0, 0), emotion: 'idle' }, // Footer Left
    ];

    // Find the nearest safe zone based on scroll progress
    let nearestZone = SAFE_ZONES[0];
    let minDiff = Infinity;

    for (const zone of SAFE_ZONES) {
      const diff = Math.abs(scrollProgress - zone.progress);
      if (diff < minDiff) {
        minDiff = diff;
        nearestZone = zone;
      }
    }

    // Set the new target destination
    setTargetPosition(nearestZone.position);

  }, [scrollProgress, setTargetPosition, emotion, action, viewport.width]);
}
