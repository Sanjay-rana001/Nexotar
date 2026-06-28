// components/BotToggleButton.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOff } from "lucide-react";

export function BotToggleButton({ isBotVisible, onToggle }: { isBotVisible: boolean; onToggle: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <motion.button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-24 left-18 z-[9999] group hidden lg:flex" // Hidden on mobile and tablet
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Glow Effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl transition-opacity duration-500 ${isBotVisible ? 'opacity-40' : 'opacity-20'} group-hover:opacity-60`} />
        
        {/* Button Background */}
        <div className={`
          relative w-16 h-16 rounded-full 
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
            {/* Robot SVG Icon */}
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-8 h-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Robot Head */}
              <rect x="4" y="6" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
              {/* Antenna */}
              <line x1="12" y1="6" x2="12" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="2" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
              {/* Eyes */}
              <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="11" r="1.5" fill="currentColor"/>
              {/* Mouth - Smile */}
              <path d="M8 15.5C9 17 11 17.5 12 17.5C13 17.5 15 17 16 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              {/* Ears/Side panels */}
              <rect x="2" y="10" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.6"/>
              <rect x="20" y="10" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.6"/>
              {/* Eyes glow effect */}
              <circle cx="9" cy="11" r="2.5" fill="currentColor" opacity="0.2"/>
              <circle cx="15" cy="11" r="2.5" fill="currentColor" opacity="0.2"/>
            </svg>

            {/* Visibility indicator overlay */}
            {!isBotVisible && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <EyeOff className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            )}
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
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 
                bg-black/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg
                whitespace-nowrap shadow-xl border border-white/10"
            >
              {isBotVisible ? 'Hide Robot' : 'Show Robot'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}