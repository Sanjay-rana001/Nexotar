"use client";

import { useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollToTopButton() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Reset the launch state after it flies off screen (1.2s)
    setTimeout(() => {
      setIsLaunching(false);
      setIsHovered(false);
    }, 1200);
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
              ? { duration: 0.8, ease: "easeIn" } 
              : { type: "spring", stiffness: 400, damping: 25 }
          }
          onClick={handleLaunch}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] group flex flex-col items-center justify-center cursor-pointer"
          aria-label="Scroll to top"
        >
          {/* Main Glass Circle */}
          <motion.div 
            animate={{ 
              boxShadow: isHovered && !isLaunching
                ? "0 0 30px rgba(0, 112, 243, 0.4)" 
                : "0 8px 30px rgba(0, 0, 0, 0.12)",
              borderColor: isHovered && !isLaunching ? "rgba(0, 112, 243, 0.5)" : "var(--border-color)"
            }}
            className="relative w-12 h-12 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center"
          >
            {/* The Rocket Icon (Rotated to point straight up) */}
            <motion.div
              animate={{ 
                y: isHovered && !isLaunching ? [0, -3, 0] : 0 
              }}
              transition={{ repeat: isHovered && !isLaunching ? Infinity : 0, duration: 0.6 }}
              className="relative z-10"
            >
              <Rocket className={`w-5 h-5 -rotate-45 transition-colors duration-300 ${isHovered || isLaunching ? 'text-[#0070f3] dark:text-[#7c3aed]' : 'text-black/70 dark:text-white/70'}`} strokeWidth={2.5} />
            </motion.div>

            {/* Thruster Flames (visible on hover or launch) */}
            <AnimatePresence>
              {(isHovered || isLaunching) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: 0 }}
                  animate={{ 
                    opacity: 1, 
                    height: isLaunching ? 80 : 20,
                    y: isLaunching ? 40 : 10
                  }}
                  exit={{ opacity: 0, height: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-1 w-2 bg-gradient-to-b from-[#0070f3] via-purple-500 to-orange-500 rounded-full blur-[2px] -z-10"
                />
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Cloud burst effect on launch */}
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
