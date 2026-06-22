import { create } from 'zustand';
import * as THREE from 'three';

export type MascotEmotion = 
  | 'idle' 
  | 'happy' 
  | 'sad' 
  | 'laugh' 
  | 'thinking' 
  | 'excited' 
  | 'dizzy' 
  | 'angry' 
  | 'sleeping';

export type MascotAction = 
  | 'none' 
  | 'wave' 
  | 'point' 
  | 'jump' 
  | 'celebrate' 
  | 'sit' 
  | 'fall' 
  | 'recover' 
  | 'search' 
  | 'think';

interface MascotState {
  emotion: MascotEmotion;
  action: MascotAction;
  targetPosition: THREE.Vector3;
  targetRotation: number;
  lastInteractionTime: number;
  scrollProgress: number;
  setEmotion: (emotion: MascotEmotion) => void;
  setAction: (action: MascotAction) => void;
  setTargetPosition: (pos: THREE.Vector3) => void;
  setTargetRotation: (rot: number) => void;
  updateInteractionTime: () => void;
  setScrollProgress: (progress: number) => void;
}

export const useMascotStore = create<MascotState>((set) => ({
  emotion: 'idle',
  action: 'none',
  targetPosition: new THREE.Vector3(3.5, 1.5, 0),
  targetRotation: 0,
  lastInteractionTime: Date.now(),
  scrollProgress: 0,
  setEmotion: (emotion) => set({ emotion }),
  setAction: (action) => set({ action }),
  setTargetPosition: (targetPosition) => set({ targetPosition }),
  setTargetRotation: (targetRotation) => set({ targetRotation }),
  updateInteractionTime: () => set({ lastInteractionTime: Date.now() }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
}));
