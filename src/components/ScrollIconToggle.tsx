"use client";

import { useEffect, useState } from "react";
import { Rocket, Helicopter } from "lucide-react";

export function ScrollIconToggle({ alwaysDarkOnTop }: { alwaysDarkOnTop?: boolean }) {
  const [iconType, setIconType] = useState<'rocket' | 'helicopter'>('rocket');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('scrollToTopIcon');
    if (saved === 'helicopter' || saved === 'rocket') {
      setIconType(saved);
    }
  }, []);

  const toggleIcon = () => {
    const nextIcon = iconType === 'rocket' ? 'helicopter' : 'rocket';
    setIconType(nextIcon);
    localStorage.setItem('scrollToTopIcon', nextIcon);
    window.dispatchEvent(new Event('scrollIconChanged'));
  };

  const isDarkArea = alwaysDarkOnTop && !isScrolled;

  return (
    <button
      onClick={toggleIcon}
      className={`p-2 rounded-xl transition-all border ${
        isDarkArea
          ? 'border-white/30 text-white hover:bg-white/10'
          : 'border-black/10 dark:border-white/10 text-gray-700 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10'
      }`}
      title={`Switch to ${iconType === 'rocket' ? 'Helicopter' : 'Rocket'} Scroll Icon`}
    >
      {iconType === 'rocket' ? (
        <Rocket className="w-4.5 h-4.5" />
      ) : (
        <Helicopter className="w-4.5 h-4.5" style={{ transform: 'scaleX(-1)' }} />
      )}
    </button>
  );
}
