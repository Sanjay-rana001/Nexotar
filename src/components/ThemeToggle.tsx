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

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
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
