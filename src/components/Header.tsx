"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollIconToggle } from "@/components/ScrollIconToggle";

const NAV = [
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Work", href: "/#projects" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Pages that have a dark full-screen cover at the top (video or dark image)
  const isHomePage = pathname === "/";
  const isBlogPost = pathname.startsWith("/blog/") && pathname.length > 6;
  const isDarkHero = isHomePage || isBlogPost;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-black/80 border-b border-black/10 dark:border-white/10' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-0.5 md:py-1 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {/* Responsive Theme & Scroll Logo */}
          <div className="relative w-12 h-12 md:w-16 md:h-16 lg:w-[72px] lg:h-[72px]">
            {/* Light Mode: White Logo (visible at top of dark hero pages ONLY) */}
            <img 
              src="/images/nexotar_logo.png" 
              alt="Nexotar" 
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 dark:hidden ${isScrolled || !isDarkHero ? 'opacity-0' : 'opacity-100'}`}
            />
            {/* Light Mode: Dark Logo (visible when scrolled OR on non-dark-hero routes) */}
            <img 
              src="/images/nexotar_logo_dark.png" 
              alt="Nexotar" 
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 dark:hidden ${isScrolled || !isDarkHero ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Dark Mode: Always use White Logo */}
            <img 
              src="/images/nexotar_logo.png" 
              alt="Nexotar" 
              className="absolute inset-0 w-full h-full object-contain transition-all duration-500 hidden dark:block"
            />
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV.map((n) => (
            <Link 
              key={n.href} 
              href={n.href} 
              className={`text-sm font-medium transition-all duration-300 ${
                isScrolled || !isDarkHero
                  ? 'text-gray-700 dark:text-white/80 hover:text-black dark:hover:text-white' 
                  : 'text-white/90 hover:text-white drop-shadow-md' // Always white at top of dark hero pages
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2 md:gap-3">
          <ScrollIconToggle alwaysDarkOnTop={isDarkHero} />
          <ThemeToggle alwaysDarkOnTop={isDarkHero} />
          <button 
            onClick={() => {
              const modal = document.getElementById('contactModal') as HTMLDialogElement;
              if (modal) modal.showModal();
            }}
            className={`hidden sm:inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all shadow-lg whitespace-nowrap ${
              isScrolled || !isDarkHero
                ? 'border-[var(--color-primary-container)]/30 bg-[var(--color-primary-container)]/10 text-[var(--color-primary-container)] hover:bg-[var(--color-primary-container)] hover:text-[var(--color-on-primary-container)] border' 
                : 'border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border' // Always glass/white at top of dark hero
            }`}
          >
            <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
            <span>Contact</span>
          </button>
        </div>
      </div>
    </header>
  );
}
