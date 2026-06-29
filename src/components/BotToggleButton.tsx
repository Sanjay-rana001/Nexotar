// components/BotToggleButton.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOff } from "lucide-react";

export function BotToggleButton({ isBotVisible, onToggle }: { isBotVisible: boolean; onToggle: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [yOffset, setYOffset] = useState(96);

  useEffect(() => {
    setIsMounted(true);
    const updatePosition = () => {
      const bottomOffset = window.innerWidth >= 768 ? 160 : 144;
      if (isBotVisible) {
        setYOffset(window.innerHeight - bottomOffset - 48); // 48px is button height
      } else {
        setYOffset(96); // 96px is top-24
      }
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isBotVisible]);

  if (!isMounted) return null;

  return (
    <motion.button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-0 right-6 md:right-8 z-[9999] group hidden lg:flex flex-col items-center justify-center cursor-pointer"
      initial={{ scale: 0, opacity: 0, y: 96 }}
      animate={{ scale: 1, opacity: 1, y: yOffset }}
      transition={
        isBotVisible 
          ? { type: "spring", stiffness: 500, damping: 30 } // Zips down instantly
          : { type: "spring", stiffness: 260, damping: 20 } // Smoothly floats back up
      }
      whileHover={{ scale: 1.1, opacity: 1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative">
        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl transition-opacity duration-500 ${isBotVisible ? 'opacity-40' : 'opacity-20'} group-hover:opacity-60`} />
        
        {/* Button Background */}
        <div className={`
          relative w-12 h-12 rounded-full 
          bg-gradient-to-br from-blue-900 to-cyan-400
          shadow-[0_0_40px_rgba(59,130,246,0.3)]
          group-hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]
          transition-all duration-300
          flex items-center justify-center
          border-2 border-white/20
        `}>
          {/* Animated Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Robot Face Icon */}
          <motion.div
            animate={{ 
              rotate: isBotVisible ? 0 : 0,
              scale: isBotVisible ? 0.9 : 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative"
          >
            {/* Custom Robot Mascot SVG Icon */}
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-6 h-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Antenna */}
              <motion.g
                animate={isHovered ? { rotate: [0, 15, -10, 5, 0] } : { rotate: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "12px 5px" }}
              >
                <line x1="12" y1="5" x2="12" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="2" r="1.5" fill="currentColor" />
              </motion.g>
              
              {/* Earmuffs */}
              <rect x="2" y="10" width="3" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
              <rect x="19" y="10" width="3" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
              
              {/* Pill Head */}
              <rect x="4" y="6" width="16" height="12" rx="5" stroke="currentColor" strokeWidth="1.5" fill="rgba(255,255,255,0.05)" />
              
              {/* Visor Screen */}
              <rect x="6" y="9.5" width="12" height="5" rx="2.5" fill="currentColor" opacity="0.2" />
              
              {/* Glowing Eyes */}
              <motion.g
                animate={isHovered ? { x: [0, 1.5, -1.5, 0] } : { x: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <circle cx="9.5" cy="12" r="1.2" fill="currentColor" />
                <circle cx="14.5" cy="12" r="1.2" fill="currentColor" />
                
                {/* Eye Glow Effect */}
                <circle cx="9.5" cy="12" r="2.5" fill="currentColor" opacity="0.2" />
                <circle cx="14.5" cy="12" r="2.5" fill="currentColor" opacity="0.2" />
              </motion.g>
            </svg>

          </motion.div>

          {/* Status Dot */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-black shadow-lg transition-colors duration-300 ${isBotVisible ? 'bg-green-500' : 'bg-gray-400'}`}>
            <div className={`absolute inset-0 rounded-full ${isBotVisible ? 'bg-green-500 animate-ping' : ''} opacity-75`} />
          </div>
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              className={`absolute left-1/2 -translate-x-1/2 px-3 py-1.5 
                bg-black/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg
                whitespace-nowrap shadow-xl border border-white/10 ${
                  isBotVisible ? "bottom-full mb-3" : "top-full mt-3"
                }`}
            >
              {isBotVisible ? 'Hide Robot' : 'Show Robot'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}