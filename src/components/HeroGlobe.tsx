"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function HeroGlobe() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full" />;
  }

  const isDark = resolvedTheme === "dark";

  // === THEME COLORS ===
  const eclipsePrimary = '253, 224, 71';
  const eclipseSecondary = '234, 179, 8';
  const eclipsePale = '254, 240, 138';
  
  const ecgColor = '#f59e0b';
  const ecgDropShadow = 'rgba(245, 158, 11, 0.4)';

  if (isDark) {
    return (
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes color-shift {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
          }
        `}} />
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px] flex items-center justify-center" style={{ animation: 'color-shift 20s linear infinite' }}>
          <div className="absolute inset-[-40%] rounded-full opacity-100" style={{
            background: `radial-gradient(circle, rgba(${eclipsePrimary}, 0.05) 0%, rgba(${eclipseSecondary}, 0.03) 40%, transparent 70%)`
          }} />
          <div className="absolute inset-[-20%] rounded-full opacity-100" style={{
            background: `radial-gradient(circle, rgba(${eclipsePale}, 0.08) 0%, transparent 60%)`
          }} />
          <div className="absolute inset-[4px] rounded-full flex items-center justify-center z-10 bg-black" style={{
            boxShadow: `0 0 4px rgba(${eclipsePrimary}, 0.35), 0 0 20px rgba(${eclipseSecondary}, 0.2), inset 0 0 20px rgba(0,0,0,1)`
          }}>
             <div className="absolute inset-10 rounded-full border-[1px] border-dashed border-white/10 animate-spin" style={{ animationDuration: '20s' }} />
             <div className={`w-16 h-16 bg-[radial-gradient(circle,rgba(245,158,11,0.2)_0%,transparent_70%)] rounded-full animate-pulse`} style={{ animationDuration: '4s' }} />
             <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
               <svg viewBox="0 0 100 30" className="w-[85%] h-auto" style={{ filter: `drop-shadow(0 0 4px ${ecgDropShadow})` }}>
                 <defs>
                   <linearGradient id="ecg-grad" x1="-50%" y1="0%" x2="0%" y2="0%">
                     <animate attributeName="x1" values="-50%; 100%" dur="2.5s" repeatCount="indefinite" />
                     <animate attributeName="x2" values="0%; 150%" dur="2.5s" repeatCount="indefinite" />
                     <stop offset="0%" stopColor={ecgColor} stopOpacity="0" />
                     <stop offset="40%" stopColor={ecgColor} stopOpacity="0.2" />
                     <stop offset="90%" stopColor={ecgColor} stopOpacity="1" />
                     <stop offset="95%" stopColor="#ffffff" stopOpacity="1" />
                     <stop offset="100%" stopColor={ecgColor} stopOpacity="0" />
                   </linearGradient>
                 </defs>
                 <path d="M 0 15 L 20 15 L 25 5 L 30 25 L 35 15 L 55 15 L 60 10 L 65 20 L 70 15 L 100 15"
                       fill="none" stroke="url(#ecg-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
             </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes colorCycle {
            0%, 24.99% { border-color: #0070f3; filter: drop-shadow(0 0 14px rgba(0,112,243,0.9)); }
            25%, 49.99% { border-color: #a855f7; filter: drop-shadow(0 0 14px rgba(168,85,247,0.9)); }
            50%, 74.99% { border-color: #f43f5e; filter: drop-shadow(0 0 14px rgba(244,63,94,0.9)); }
            75%, 99.99% { border-color: #00e5ff; filter: drop-shadow(0 0 14px rgba(0,229,255,0.9)); }
            100% { border-color: #0070f3; filter: drop-shadow(0 0 14px rgba(0,112,243,0.9)); }
          }
          @keyframes colorCycleReverse {
            0%, 24.99% { border-color: #f43f5e; filter: drop-shadow(0 0 14px rgba(244,63,94,0.9)); }
            25%, 49.99% { border-color: #00e5ff; filter: drop-shadow(0 0 14px rgba(0,229,255,0.9)); }
            50%, 74.99% { border-color: #0070f3; filter: drop-shadow(0 0 14px rgba(0,112,243,0.9)); }
            75%, 99.99% { border-color: #a855f7; filter: drop-shadow(0 0 14px rgba(168,85,247,0.9)); }
            100% { border-color: #f43f5e; filter: drop-shadow(0 0 14px rgba(244,63,94,0.9)); }
          }
          .ring-1-shape { border-top-color: transparent !important; border-left-color: transparent !important; }
          .ring-2-shape { border-bottom-color: transparent !important; border-right-color: transparent !important; }
          .ring-3-shape { border-top-color: transparent !important; border-right-color: transparent !important; }
          .ring-4-shape { border-bottom-color: transparent !important; border-left-color: transparent !important; }
          .ring-5-shape { border-top-color: transparent !important; }
        `}} />
        <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 flex items-center justify-center">
          <div className="absolute inset-0 pointer-events-none opacity-50">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
            <div className="absolute inset-0 border border-blue-500/10 rounded-full scale-[1.15]" />
            <div className="absolute inset-0 border border-blue-500/10 rounded-full scale-[1.3]" />
          </div>
          <div className="absolute inset-2 md:inset-6 pointer-events-none opacity-60">
            <div className="w-full h-full border-[1px] border-dashed border-blue-400/20 rounded-full animate-[spin_40s_linear_infinite]" />
          </div>
          <div className="absolute inset-10 md:inset-20 pointer-events-none opacity-60">
            <div className="w-full h-full border-[1px] border-dotted border-purple-400/20 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
          </div>
          <div className="absolute inset-0">
            <div className="w-full h-full border-[5px] rounded-full ring-1-shape" style={{ animation: 'spin 4s linear infinite, colorCycle 16s linear infinite' }} />
            <div className="absolute inset-0 animate-[spin_4s_linear_infinite_reverse]">
              <div className="absolute inset-0 border-[5px] border-white/90 rounded-full drop-shadow-[0_0_12px_#fff]" style={{ WebkitMaskImage: 'conic-gradient(from 0deg, black 0%, transparent 20%)', maskImage: 'conic-gradient(from 0deg, black 0%, transparent 20%)' }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff] animate-pulse" style={{ animationDuration: '2s' }} />
            </div>
          </div>
          <div className="absolute inset-4 md:inset-8">
            <div className="w-full h-full border-[4px] rounded-full ring-2-shape" style={{ animation: 'spin 7s linear infinite reverse, colorCycleReverse 28s linear infinite' }} />
            <div className="absolute inset-0 animate-[spin_7s_linear_infinite]">
              <div className="absolute inset-0 border-[4px] border-white/90 rounded-full drop-shadow-[0_0_12px_#fff]" style={{ WebkitMaskImage: 'conic-gradient(from 0deg, transparent 80%, black 100%)', maskImage: 'conic-gradient(from 0deg, transparent 80%, black 100%)' }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff] animate-pulse" style={{ animationDuration: '0.8s' }} />
            </div>
          </div>
          <div className="absolute inset-8 md:inset-16">
            <div className="w-full h-full border-[5px] rounded-full ring-3-shape" style={{ animation: 'spin 5.5s linear infinite, colorCycle 22s linear infinite' }} />
            <div className="absolute inset-0 animate-[spin_5.5s_linear_infinite_reverse]">
              <div className="absolute inset-0 border-[5px] border-white/90 rounded-full drop-shadow-[0_0_12px_#fff]" style={{ WebkitMaskImage: 'conic-gradient(from 0deg, black 0%, transparent 20%)', maskImage: 'conic-gradient(from 0deg, black 0%, transparent 20%)' }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff] animate-pulse" style={{ animationDuration: '1.5s' }} />
            </div>
          </div>
          <div className="absolute inset-12 md:inset-24">
            <div className="w-full h-full border-[4px] rounded-full ring-4-shape" style={{ animation: 'spin 3.3s linear infinite reverse, colorCycleReverse 13.2s linear infinite' }} />
            <div className="absolute inset-0 animate-[spin_3.3s_linear_infinite]">
              <div className="absolute inset-0 border-[4px] border-white/90 rounded-full drop-shadow-[0_0_12px_#fff]" style={{ WebkitMaskImage: 'conic-gradient(from 0deg, transparent 80%, black 100%)', maskImage: 'conic-gradient(from 0deg, transparent 80%, black 100%)' }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff] animate-pulse" style={{ animationDuration: '1.2s' }} />
            </div>
          </div>
          <div className="absolute inset-16 md:inset-32">
            <div className="w-full h-full border-[4px] rounded-full ring-5-shape" style={{ animation: 'spin 1.1s linear infinite, colorCycle 4.4s linear infinite' }} />
            <div className="absolute inset-0 animate-[spin_1.1s_linear_infinite_reverse]">
              <div className="absolute inset-0 border-[4px] border-white/90 rounded-full drop-shadow-[0_0_12px_#fff]" style={{ WebkitMaskImage: 'conic-gradient(from 0deg, black 0%, transparent 30%)', maskImage: 'conic-gradient(from 0deg, black 0%, transparent 30%)' }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_#fff] animate-pulse" style={{ animationDuration: '2.5s' }} />
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,112,243,0.15)_0%,rgba(168,85,247,0.05)_40%,transparent_70%)] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute w-20 h-20 bg-[radial-gradient(circle,rgba(0,112,243,0.3)_0%,transparent_70%)] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute w-8 h-8 bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute w-12 h-12 md:w-16 md:h-16 border-[1px] border-dashed border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-4 h-4 bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,transparent_70%)] rounded-full shadow-[0_0_20px_#fff]" />
        </div>
      </div>
    );
  }
}
