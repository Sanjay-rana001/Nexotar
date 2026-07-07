"use client";

import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedHelicopter = ({ isHovered, isLaunching }: { isHovered: boolean, isLaunching: boolean }) => {
  // Use faster durations for side view because rotateY needs to look like a blur
  const spinSpeed = isLaunching ? 0.05 : isHovered ? 0.1 : 0.4;
  
  return (
    <div className="relative w-8 h-8 drop-shadow-md" style={{ transform: 'scaleX(-1)' }}>
       {/* Body */}
       <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="heliBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          
          {/* Tail */}
          <path d="M 55 55 L 15 50 L 15 58 L 55 65 Z" fill="#334155" />
          {/* Tail Fin */}
          <path d="M 15 58 L 10 35 L 22 45 Z" fill="#1e293b" />
          
          {/* Skids */}
          <rect x="35" y="80" width="40" height="3" rx="1.5" fill="#94a3b8" />
          <rect x="45" y="70" width="3" height="10" fill="#64748b" />
          <rect x="65" y="70" width="3" height="10" fill="#64748b" />

          {/* Main Body */}
          <ellipse cx="55" cy="55" rx="25" ry="18" fill="url(#heliBody)" />
          
          {/* Cockpit Window */}
          <path d="M 55 37 A 25 18 0 0 1 79 50 L 55 50 Z" fill="url(#window)" opacity="0.9" />

          {/* Rotor Mast */}
          <rect x="53" y="28" width="4" height="9" fill="#64748b" />
       </svg>
       
       {/* Main Rotor (Perspective Top-Spin) */}
       <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
          {/* Squashed group to create fake 3D perspective */}
          <g transform="translate(55, 24) scale(1, 0.25) translate(-55, -24)">
             <motion.g
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, ease: "linear", duration: spinSpeed }}
               style={{ transformOrigin: "55px 24px" }}
             >
                {/* Swept area blur */}
                <circle cx="55" cy="24" r="40" fill="#94a3b8" opacity="0.2" />
                {/* 4 Blades in a cross */}
                <rect x="15" y="22.5" width="80" height="3" fill="#0f172a" opacity="0.9" rx="1.5" />
                <rect x="53.5" y="-16" width="3" height="80" fill="#0f172a" opacity="0.9" rx="1.5" />
             </motion.g>
          </g>
          {/* Rotor Hub */}
          <rect x="53" y="22" width="4" height="4" fill="#334155" rx="1" />
       </svg>
       
       {/* Tail Rotor */}
       <motion.svg 
         viewBox="0 0 100 100" 
         className="absolute inset-0 w-full h-full"
         animate={{ rotate: 360 }}
         transition={{ repeat: Infinity, ease: "linear", duration: spinSpeed }}
         style={{ transformOrigin: "15px 45px" }}
       >
          <circle cx="15" cy="45" r="2" fill="#cbd5e1" />
          <rect x="14" y="35" width="2" height="20" fill="#0f172a" rx="1" />
          <rect x="5" y="44" width="20" height="2" fill="#0f172a" rx="1" />
       </motion.svg>
    </div>
  );
};

export function ScrollToTopButton() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  
  const [iconType, setIconType] = useState<'rocket' | 'helicopter'>('rocket');

  useEffect(() => {
    const loadIcon = () => {
      const saved = localStorage.getItem('scrollToTopIcon');
      if (saved === 'helicopter' || saved === 'rocket') {
        setIconType(saved);
      }
    };

    // Load initially
    loadIcon();

    // Listen for changes from Header toggle
    window.addEventListener('scrollIconChanged', loadIcon);
    return () => window.removeEventListener('scrollIconChanged', loadIcon);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress(scrollTop / scrollHeight);
      } else {
        setScrollProgress(0);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    
    const scrollDuration = iconType === 'rocket' ? 1320 : 2750; 
    const startY = window.scrollY;
    const startTime = performance.now();
    
    // Both originally used easeInOutCubic for scrolling
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easingFunc = easeInOutCubic;
    
    const scrollStep = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / scrollDuration, 1);
      
      window.scrollTo(0, startY * (1 - easingFunc(progress)));
      
      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    };
    requestAnimationFrame(scrollStep);
    
    setTimeout(() => {
      setIsLaunching(false);
      setIsHovered(false);
    }, scrollDuration + 300);
  };

  const isVisible = (scrollProgress > 0.02) || isLaunching;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 50, scale: 0.5 }}
          animate={
            isLaunching 
              ? { y: -1000, opacity: 1, scale: 1.2 } 
              : { opacity: 1, y: 0, scale: 1 }
          }
          exit={{ opacity: 0, y: 50, scale: 0.5 }}
          transition={
            isLaunching 
              ? { duration: iconType === 'rocket' ? 1.32 : 2.75, ease: iconType === 'rocket' ? "easeIn" : "easeInOut" } 
              : { type: "spring", stiffness: 400, damping: 25 }
          }
          onClick={handleLaunch}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-20 right-6 md:bottom-24 md:right-8 z-[100] group flex flex-col items-center justify-center cursor-pointer"
          aria-label="Scroll to top"
        >
          <motion.div 
            animate={{ 
              boxShadow: isHovered && !isLaunching
                ? "0 0 30px rgba(0, 112, 243, 0.4)" 
                : "0 8px 30px rgba(0, 0, 0, 0.12)",
              borderColor: isHovered && !isLaunching ? "rgba(0, 112, 243, 0.5)" : "var(--border-color)"
            }}
            className="relative w-12 h-12 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center overflow-hidden"
          >
            {iconType === 'rocket' ? (
              <>
                <motion.div
                  animate={{ 
                    y: isLaunching ? 0 : isHovered ? [0, -3, 0] : [0, -5, 0] 
                  }}
                  transition={{ 
                    repeat: isLaunching ? 0 : Infinity, 
                    duration: isHovered ? 1.0 : 2.5,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <Rocket className={`w-5 h-5 -rotate-45 transition-colors duration-300 ${isHovered || isLaunching ? 'text-[#0070f3] dark:text-[#7c3aed]' : 'text-black/70 dark:text-white/70'}`} strokeWidth={2.5} />
                </motion.div>

                <AnimatePresence>
                  {(isHovered || isLaunching) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: isLaunching ? 90 : 12,
                      }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-1/2 mt-2 w-1.5 bg-gradient-to-b from-[#0070f3] via-purple-500 to-orange-500 rounded-full blur-[1px] -z-10 origin-top"
                    />
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ 
                    y: isLaunching ? 0 : isHovered ? [0, -3, 0] : [0, -5, 0],
                    rotate: isLaunching ? 30 : isHovered ? 10 : 0
                  }}
                  transition={{ 
                    y: { repeat: isLaunching ? 0 : Infinity, duration: isHovered ? 1.0 : 2.5, ease: "easeInOut" },
                    rotate: { duration: 0.3, ease: "easeOut" }
                  }}
                  className="relative z-10 w-full h-full flex items-center justify-center p-1"
                >
                  <AnimatedHelicopter isHovered={isHovered} isLaunching={isLaunching} />
                </motion.div>
              </>
            )}
          </motion.div>
          
          <AnimatePresence>
            {isLaunching && (
              <motion.div
                initial={{ opacity: 1, scale: 0.5 }}
                animate={{ opacity: 0, scale: 3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white dark:bg-white/20 rounded-full blur-md -z-20"
              />
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
