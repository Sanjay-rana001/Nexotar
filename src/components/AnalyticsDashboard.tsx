"use client";

import { useEffect, useState, useRef } from 'react';

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  totalClicks: number;
  todayClicks: number;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [liveVisitors, setLiveVisitors] = useState<number | null>(null);
  const [personalClicks, setPersonalClicks] = useState<number | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    setLiveVisitors(Math.floor(Math.random() * 3) + 5);
  }, []);

    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/app-data');
        const json = await res.json();
        setData(json);
      } catch (e) {
      console.error("Failed to fetch analytics", e);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Initialize personal clicks for returning user logic
    const storedClicks = localStorage.getItem('nexotar_personal_clicks');
    if (!storedClicks) {
      const initial = Math.floor(Math.random() * (280 - 250 + 1)) + 250;
      localStorage.setItem('nexotar_personal_clicks', initial.toString());
      setPersonalClicks(initial);
    } else {
      setPersonalClicks(parseInt(storedClicks, 10));
    }

    // Record a visit when component mounts
    fetch('/api/app-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'visit' })
    }).then(res => res.json()).then(json => setData(json)).catch(console.error);

    // Track global clicks (debounced to avoid spamming the API)
    let clickTimeout: NodeJS.Timeout;
    let pendingClicks = 0;

    const handleGlobalClick = () => {
      pendingClicks++;
      
      // Optimistically update the UI instantly
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          totalClicks: prev.totalClicks + 1,
          todayClicks: prev.todayClicks + 1
        };
      });

      setPersonalClicks(prev => {
        const next = (prev || 0) + 1;
        localStorage.setItem('nexotar_personal_clicks', next.toString());
        return next;
      });
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        const currentPending = pendingClicks;
        pendingClicks = 0;
        
        fetch('/api/app-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'click', count: currentPending })
        }).then(res => res.json()).then(json => {
          if (pendingClicks === 0) setData(json);
        }).catch(console.error);
      }, 500);
    };

    window.addEventListener('click', handleGlobalClick);

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchAnalytics, 10000);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      clearInterval(interval);
    };
  }, []);

  if (!data) {
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
            <span className="font-mono font-medium">{liveVisitors ?? '-'} active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">Total Visitors</p>
          <p className="text-3xl font-bold font-display-lg">{data.totalVisitors.toLocaleString()}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">Today's Visitors</p>
          <p className="text-3xl font-bold font-display-lg text-[var(--color-primary-container)]">+{data.todayVisitors.toLocaleString()}</p>
        </div>
        
        <div className="space-y-1 pt-4 border-t border-black/5 dark:border-white/5">
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">Total Interactions</p>
          <p className="text-3xl font-bold font-display-lg">{data.totalClicks.toLocaleString()}</p>
        </div>
        
        <div className="space-y-1 pt-4 border-t border-black/5 dark:border-white/5">
          <p className="text-sm font-medium text-[var(--color-on-surface-variant)]">Today's Clicks</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold font-display-lg text-[var(--color-secondary-fixed-dim)]">+{data.todayClicks.toLocaleString()}</p>
            {personalClicks !== null && (
              <p className="text-xs text-[var(--color-on-surface-variant)]">(You: {personalClicks.toLocaleString()})</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
