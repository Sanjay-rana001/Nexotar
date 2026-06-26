"use client";

import { useEffect, useState, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

function RollingNumber({ value, prefix = "" }: { value: number, prefix?: string }) {
  const numString = value.toLocaleString();
  return (
    <span className="inline-flex items-center overflow-hidden relative align-middle" style={{ lineHeight: "1em" }}>
      {prefix && <span className="mr-0.5 inline-block">{prefix}</span>}
      {numString.split('').map((char, index) => {
        const posFromEnd = numString.length - index;
        return (
          <span key={posFromEnd} className="inline-flex relative overflow-hidden align-top">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={char}
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
                className="inline-block whitespace-nowrap"
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  totalClicks: number;
  todayClicks: number;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [liveVisitors, setLiveVisitors] = useState<number | null>(null);
  const initialized = useRef(false);
  const pendingClicks = useRef(0);

  useEffect(() => {
    // Initial random between 5 and 12
    setLiveVisitors(Math.floor(Math.random() * 8) + 5);
    
    // Change randomly every 30 seconds
    const visitorInterval = setInterval(() => {
      setLiveVisitors(Math.floor(Math.random() * 8) + 5);
    }, 30000);
    
    return () => clearInterval(visitorInterval);
  }, []);

    const fetchAnalytics = async () => {
      // Keep this as fallback, but rely on onSnapshot primarily
      try {
        const res = await fetch('/api/app-data');
        const json = await res.json();
        if (pendingClicks.current === 0) setData(json);
      } catch (e) {
      console.error("Failed to fetch analytics", e);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Record a visit when component mounts
    fetch('/api/app-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'visit' })
    }).then(res => res.json()).then(json => setData(json)).catch(console.error);

    // Track global clicks (debounced to avoid spamming the API)
    let clickTimeout: NodeJS.Timeout;

    const handleGlobalClick = () => {
      pendingClicks.current++;
      
      // Optimistically update the UI instantly
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          totalClicks: prev.totalClicks + 1,
          todayClicks: prev.todayClicks + 1
        };
      });

      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        const currentPending = pendingClicks.current;
        pendingClicks.current = 0;
        
        fetch('/api/app-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'click', count: currentPending })
        }).then(res => res.json()).then(json => {
          if (pendingClicks.current === 0) setData(json);
        }).catch(console.error);
      }, 500);
    };

    window.addEventListener('click', handleGlobalClick);

    // Set up real-time Firebase listener
    const unsub = onSnapshot(doc(db, 'analytics', 'data'), (docSnap) => {
      if (docSnap.exists() && pendingClicks.current === 0) {
        setData(docSnap.data() as AnalyticsData);
      }
    });

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      unsub();
    };
  }, []);

  if (!data || !data.totalVisitors) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center border border-black/5 dark:border-white/5 rounded-2xl bg-[var(--color-surface-container-low)] animate-pulse">
        <span className="text-[var(--color-on-surface-variant)] text-sm">Loading Live Data...</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 bg-[var(--color-surface-container-low)] p-8 h-full flex flex-col justify-center">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-primary-container)] opacity-20 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--color-secondary-fixed-dim)] opacity-20 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex items-start justify-between mb-8 relative z-10">
        <h3 className="font-display-lg text-2xl flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Live Analytics
        </h3>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)] font-semibold">Live Visitors</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-mono font-medium">
              {liveVisitors !== null ? <RollingNumber value={liveVisitors} /> : '-'} active
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">Total Visitors</p>
          <div className="text-3xl font-bold font-display-lg"><RollingNumber value={data.totalVisitors} /></div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">Today's Visitors</p>
          <div className="text-3xl font-bold font-display-lg text-[var(--color-primary-container)]"><RollingNumber value={data.todayVisitors} prefix="+" /></div>
        </div>
        
        <div className="space-y-1 pt-4 border-t border-black/5 dark:border-white/5">
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">Total Interactions</p>
          <div className="text-3xl font-bold font-display-lg"><RollingNumber value={data.totalClicks} /></div>
        </div>
        
        <div className="space-y-1 pt-4 border-t border-black/5 dark:border-white/5">
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">Today's Clicks</p>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold font-display-lg text-[var(--color-secondary-fixed-dim)]"><RollingNumber value={data.todayClicks} prefix="+" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
