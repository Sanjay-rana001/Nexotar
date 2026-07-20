"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ alwaysDarkOnTop = false }: { alwaysDarkOnTop?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = theme === "dark";
  
  // If we are on a page where the top hero is ALWAYS dark (like the landing page with the globe video),
  // and we haven't scrolled down yet, we MUST force white/glass styling so it's visible.
  const forceWhite = alwaysDarkOnTop && !isScrolled;

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }
    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const points = 40;
      const startWavyBottom = [];
      const endWavyBottom = [];
      for (let i = points; i >= 0; i--) {
        const x = (i / points) * 100;
        const wave = Math.sin((i / points) * Math.PI * 6) * 5;
        startWavyBottom.push(`${x.toFixed(1)}% ${(-10 + wave).toFixed(1)}%`);
        endWavyBottom.push(`${x.toFixed(1)}% ${(120 + wave).toFixed(1)}%`);
      }
      const startClip = `polygon(0% 0%, 100% 0%, ${startWavyBottom.join(', ')})`;
      const endClip = `polygon(0% 0%, 100% 0%, ${endWavyBottom.join(', ')})`;

      document.documentElement.animate(
        [
          { clipPath: startClip },
          { clipPath: endClip }
        ],
        { 
          duration: 1500, 
          easing: "cubic-bezier(0.4, 0, 0.2, 1)", 
          pseudoElement: "::view-transition-new(root)", 
          fill: "forwards" 
        }
      );
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm hover:scale-110 transition-colors relative overflow-hidden border ${
        forceWhite
          ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
          : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[var(--color-on-surface)] hover:bg-black/10 dark:hover:bg-white/10'
      }`}
    >
      <motion.div
        initial={false}
        animate={{ y: isDark ? 0 : -30, opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Moon size={18} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ y: isDark ? 30 : 0, opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Sun size={18} />
      </motion.div>
    </button>
  );
}
