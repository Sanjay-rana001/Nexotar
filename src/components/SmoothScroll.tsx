"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Listen for custom events to pause/resume
    const handlePause = () => lenis.stop();
    const handleResume = () => lenis.start();
    
    window.addEventListener('pause-scroll', handlePause);
    window.addEventListener('resume-scroll', handleResume);

    return () => {
      window.removeEventListener('pause-scroll', handlePause);
      window.removeEventListener('resume-scroll', handleResume);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
