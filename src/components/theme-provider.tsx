"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// Suppress React 19 / Next.js 15 warning for next-themes script tag
if (typeof console !== "undefined") {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag while rendering React component")) {
      return; // Ignore this specific warning
    }
    
    // Ignore hydration errors caused by password managers (e.g., Bitwarden) injecting fdprocessedid
    const hasFdProcessedId = args.some(arg => 
      typeof arg === "string" && arg.includes("fdprocessedid")
    );
    if (hasFdProcessedId) {
      return;
    }

    originalError.apply(console, args);
  };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
