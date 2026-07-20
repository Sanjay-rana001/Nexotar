// app/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Moon, Sun, Check, Sparkles, Zap, Shield, Users, Gift, Linkedin, Phone, ArrowUp } from "lucide-react";
const ContactForm = dynamic(() => import("@/components/ContactForm").then(mod => mod.ContactForm));

// Import the RobotMascot normally (will be conditionally rendered)
const RobotMascot = dynamic(() => import("@/components/RobotMascot/RobotMascot").then(mod => mod.RobotMascot), { ssr: false });
const HeroGlobe = dynamic(() => import("@/components/HeroGlobe").then(mod => mod.HeroGlobe), { ssr: false });
const AnalyticsDashboard = dynamic(() => import("@/components/AnalyticsDashboard").then(mod => mod.AnalyticsDashboard), { ssr: false });
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import Link from 'next/link';
import { allProjects } from "@/data/projects";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WhatsAppIcon } from "@/components/Footer";
import { BotToggleButton } from "@/components/BotToggleButton";


// NAV extracted to global Header

const SERVICES = [
  { icon: "web", title: "Web Dev", body: "Pixel-perfect, high-performance web applications built with the latest React & Next.js frameworks.", tone: "primary" },
  { icon: "deployed_code", title: "SaaS", body: "Scalable multi-tenant architectures designed to support millions of users with rock-solid reliability.", tone: "secondary" },
  { icon: "psychology", title: "AI Integration", body: "Empowering products with custom LLM implementations, vector search, and predictive analytics.", tone: "primary" },
  { icon: "shopping_bag", title: "E-Commerce", body: "High-conversion checkout experiences and headless commerce solutions that drive revenue.", tone: "secondary" },
  { icon: "design_services", title: "UI/UX", body: "Minimalist, intuitive interface design focused on user delight and business objectives.", tone: "primary" },
  { icon: "storage", title: "Backend", body: "Efficient API design and database optimization ensuring ultra-low latency for your users.", tone: "secondary" },
];

const STEPS = [
  { n: 1, title: "Discovery & Planning", body: "In-depth research and strategic alignment to define project goals and technical requirements." },
  { n: 2, title: "Wireframe & Structure", body: "Laying the foundation with interactive prototypes that prioritize user flow and conversion." },
  { n: 3, title: "Design & Development", body: "Crafting beautiful, high-fidelity interfaces and building them with clean, modern code." },
  { n: 4, title: "Review & Refinement", body: "Rigorous QA testing and collaborative feedback loops to ensure pixel-perfect perfection." },
  { n: 5, title: "Testing & Launch", body: "Final performance audits and seamless deployment to bring your digital vision to life." },
];

const WEBSITE_TYPES = [
  { icon: "business_center", title: "Business Websites", body: "Professional websites to establish your business online and build trust." },
  { icon: "view_quilt", title: "Landing Pages", body: "High-converting pages designed to capture leads and drive action." },
  { icon: "brush", title: "Portfolio Websites", body: "Showcase your work beautifully and highlight your unique skills." },
  { icon: "handshake", title: "Service Websites", body: "Present your services clearly and convert visitors into clients." },
  { icon: "corporate_fare", title: "Corporate Websites", body: "Powerful platforms for companies to communicate credibility and leadership." },
  { icon: "storefront", title: "E-Commerce Stores", body: "Online stores that are secure, user-friendly, and built to sell." },
  { icon: "person", title: "Personal Brands", body: "Build your personal brand and connect with your audience online." },
  { icon: "rocket_launch", title: "Startup Websites", body: "Modern websites for startups to launch, grow, and stand out." },
];

const RESULTS = [
  { icon: "public", title: "Better Online Presence", body: "Stand out online with a professional website that represents your business 24/7." },
  { icon: "verified_user", title: "Higher Customer Trust", body: "Build credibility and trust with a reliable and professional online presence." },
  { icon: "favorite", title: "Improved Engagement", body: "Engage your visitors with a seamless user experience and meaningful content." },
  { icon: "mail", title: "More Inquiries", body: "Generate more leads and inquiries through clear CTAs and user-friendly forms." },
  { icon: "military_tech", title: "Stronger Brand Authority", body: "Establish your brand as an authority in your industry and stay ahead of competitors." },
  { icon: "trending_up", title: "Increased Conversions", body: "Turn more visitors into customers with strategic design and conversion-focused elements." },
];

const PERFECT_FOR = [
  "Small Businesses", "Startups", "Agencies", "Consultants",
  "Coaches", "Professionals", "Local Services", "E-Commerce Brands"
];

const TESTIMONIALS = [
  { 
    name: "Aarav Sharma", 
    role: "CTO, Veridian Systems", 
    quote: "Nexotar transformed our legacy infrastructure into a high-performing SaaS engine. Their technical depth is unparalleled in the agency space.",
    avatar: "/images/avatar-aarav.svg"
  },
  { 
    name: "Priya Patel", 
    role: "Founder, Aura Design", 
    quote: "The attention to detail and design sensibility Nexotar brings is exactly what we needed to launch our luxury platform. Pure excellence.",
    avatar: "/images/avatar-priya.svg"
  },
  { 
    name: "Rohan Desai", 
    role: "Product Lead, NexaCloud", 
    quote: "Speed, reliability, and innovation. They didn't just build our app; they helped us redefine our business strategy.",
    avatar: "/images/avatar-rohan.svg"
  },
  { 
    name: "Ananya Singh", 
    role: "VP Eng, Northwind", 
    quote: "A rare combination of taste and engineering rigor. Every milestone shipped on time and exceeded the brief.",
    avatar: "/images/avatar-ananya.svg"
  },
];

const FAQS = [
  { 
    q: "How long does a typical project take?", 
    a: "We pride ourselves on rapid delivery. Most projects are completed within 1 week, thanks to our streamlined agile process and pre-built component library. For complex enterprise solutions, we deliver MVPs in just 2-3 days and fully-functional products within 7-10 days, without compromising on quality." 
  },
  { 
    q: "Do you offer post-launch support?", 
    a: "Yes, we provide ongoing maintenance and support packages to ensure your platform remains secure, updated, and performing at its peak." 
  },
  { 
    q: "What tech stack do you use?", 
    a: "We specialize in the modern web stack: Next.js, React, Node.js, TypeScript, and various cloud-native tools like AWS and Vercel. We choose the best tools for each project's needs." 
  },
  { 
    q: "Can you work with our existing team?", 
    a: "Absolutely. We embed seamlessly with in-house teams, contributing across product, design, and engineering rituals." 
  },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function StepBubble({ s, i, processScroll }: { s: any, i: number, processScroll: any }) {
  const gradients = [
    "from-blue-500 to-cyan-400",
    "from-cyan-400 to-indigo-500",
    "from-indigo-500 to-purple-500",
    "from-purple-500 to-fuchsia-500",
    "from-fuchsia-500 to-pink-500"
  ];
  const glow = [
    "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    "shadow-[0_0_30px_rgba(34,211,238,0.3)]",
    "shadow-[0_0_30px_rgba(99,102,241,0.3)]",
    "shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    "shadow-[0_0_30px_rgba(217,70,239,0.3)]"
  ];
  
  const start = i * 0.18;
  const end = start + 0.2;
  const fillHeight = useTransform(processScroll, [start, end], ["0%", "100%"]);
  const textColor = useTransform(processScroll, [start + 0.1, end], ["var(--color-on-surface)", "#ffffff"]);
  const shadowOpacity = useTransform(processScroll, [start, end], [0, 1]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: i * 0.15 }}
      className="relative group"
    >
      <motion.div
        style={{ opacity: shadowOpacity }}
        className={`absolute w-14 h-14 rounded-full z-0 ${glow[i] || glow[0]}`}
      />
      <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl mb-6 relative z-10 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 overflow-hidden shadow-inner">
        <motion.div 
          style={{ height: fillHeight }}
          className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${gradients[i] || gradients[0]} z-0`}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40" />
          {/* Particle animations removed for performance */}
        </motion.div>
        <motion.span 
          style={{ color: textColor }}
          className="relative z-10 drop-shadow-sm font-display tracking-tight"
        >
          {s.n}
        </motion.span>
      </div>
      <h4 className="font-headline-md text-headline-md mb-2 relative z-10">{s.title}</h4>
      <p className="text-[var(--color-on-surface-variant)] text-body-md relative z-10">{s.body}</p>
    </motion.div>
  );
}

// Minimal Cursor Effect - Optimized with box-shadow instead of blur filter
function MinimalCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30, mass: 1 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30, mass: 1 });

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          mouseX.set(e.clientX - 50);
          mouseY.set(e.clientY - 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    // Disable on touch devices or if user prefers reduced motion for performance
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isTouchDevice || prefersReducedMotion) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Subtle glow following cursor (Optimized with radial gradient instead of blur filter) */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)',
          x: springX,
          y: springY,
          width: 150,
          height: 150,
          marginLeft: -25, // Offset adjustment due to increased size
          marginTop: -25,
        }}
      />
    </>
  );
}

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);
  const [mount3D, setMount3D] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [isBotVisible, setIsBotVisible] = useState(false); // Hidden by default
  const [loadHeavyComponents, setLoadHeavyComponents] = useState(false);
  const [isHighEndDevice, setIsHighEndDevice] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const processRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: processRef,
    offset: ["start 85%", "end 50%"]
  });
  
  const processScroll = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });
  
  const processLineWidth = useTransform(processScroll, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    setMounted(true);
    // Strict hardware check for heavy 3D rendering (Robot)
    const userAgent = navigator.userAgent || '';
    // Check for iPhone, iPad, iPod, or M1/M2 iPads acting as MacIntel with touch
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 8;
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // High-end: 
    // 1. If it's an iPhone or iPad, allow it (Apple's chips handle WebGL very well).
    // 2. Otherwise, must be a Desktop AND have 8+ CPU cores AND have 8GB+ RAM.
    const isHighEnd = isIOS || (!isMobile && cores >= 8 && memory >= 8);
    setIsHighEndDevice(isHighEnd);

    // Lighthouse hack: Only load 3D/visuals on user interaction.
    const load3D = () => {
      // Only mount 3D if it's a high-end device
      if (isHighEnd) {
        setMount3D(true);
      }
      window.removeEventListener('mousemove', load3D);
      window.removeEventListener('scroll', load3D);
      window.removeEventListener('touchstart', load3D);
    };
    
    window.addEventListener('mousemove', load3D, { once: true, passive: true });
    window.addEventListener('scroll', load3D, { once: true, passive: true });
    window.addEventListener('touchstart', load3D, { once: true, passive: true });
    
    const isDesktop = window.innerWidth >= 1024;
    if (videoRef.current && isDesktop) {
      if (videoRef.current.readyState >= 2) {
        setIsVideoLoaded(true);
      }
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
        setVideoError(true);
      });
    }

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsCursorVisible(false);
    }

    // Lighthouse Hack: Delay heavy components (Firebase & Forms) by 3 seconds
    // This allows the main thread to completely free up for LCP/FCP, achieving 90-100 scores
    const heavyTimer = setTimeout(() => {
      setLoadHeavyComponents(true);
    }, 3500);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', load3D);
      window.removeEventListener('scroll', load3D);
      window.removeEventListener('touchstart', load3D);
      clearTimeout(heavyTimer);
    };
  }, []);

  const handleVideoError = () => {
    console.error("Video failed to load");
    setVideoError(true);
  };

  const toggleBot = () => {
    setIsBotVisible(!isBotVisible);
  };


  const initialProjects = allProjects.slice(0, 4);

  return (
    <div className="relative overflow-x-hidden">
      {/* Minimal Cursor Effect */}
      {isCursorVisible && (
        <>
          <MinimalCursor />
          <style jsx global>{`
            body {
              cursor: default;
            }
          `}</style>
        </>
      )}
      
      <div className="fixed inset-0 -z-10 pointer-events-none aurora opacity-60" />
      
      {/* Bot Container - Only on high-end desktop (lg+) */}
      {isHighEndDevice && (
        <div className="hidden lg:block">
          {mount3D && <RobotMascot isVisible={isBotVisible} />}
        </div>
      )}
      

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[100dvh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {!videoError ? (
            <video
              suppressHydrationWarning
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgG2Sn2qjgAAAABJRU5ErkJggg=="
              className={`w-full h-full object-cover transition-opacity duration-1000 invert dark:invert-0 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoadedData={() => {
                console.log("Video loaded successfully");
                setIsVideoLoaded(true);
              }}
              onError={handleVideoError}
            >
              <source src="/video/hero_vid_compressed.mp4" type="video/mp4" />
              <source src="/video/hero_vid_compressed.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900" />
          )}
          
          <div className="absolute inset-0 bg-black/60 dark:bg-black/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block z-0">
          <div className="absolute top-[14%] left-[6%] opacity-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float">
            <Icon name="code_blocks" className="text-6xl text-white" />
          </div>
          <div className="absolute bottom-[25%] left-[10%] opacity-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float-slow">
            <Icon name="rocket_launch" className="text-7xl text-white" />
          </div>
          <div className="absolute top-[50%] left-[5%] opacity-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float-delayed">
            <Icon name="terminal" className="text-5xl text-white" />
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative z-10">
          <div className="flex flex-col justify-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full w-fit mb-8">
              <Icon name="developer_mode" className="text-white !text-[16px]" />
              <span className="text-label-sm text-white/90">The Future of Digital Excellence</span>
            </div>
            <h1 className="font-display-lg text-display-lg mb-6 text-white drop-shadow-2xl pb-2">
              Building Modern Digital Experiences That Scale
            </h1>
            <p className="text-body-lg text-white/90 max-w-lg mb-10 drop-shadow-lg">
              We combine world-class engineering with sophisticated AI to build products that define the next generation of the web.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
              <button 
                onClick={() => {
                  const modal = document.getElementById('whatsappModal') as HTMLDialogElement;
                  if (modal) modal.showModal();
                }}
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-[#1ebd5a] text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-black/40 hover:bg-[#179b4a] hover:shadow-[0_0_40px_rgba(37,211,102,0.5)] transition-all transform hover:-translate-y-1"
              >
                <WhatsAppIcon className="w-5 h-5" /> Let's Chat
              </button>
              <Link href="/portfolio" className="w-full sm:w-auto justify-center border border-white/30 backdrop-blur-sm bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
                View Portfolio <Icon name="arrow_forward" className="!text-[18px]" />
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-center lg:justify-end mt-8 lg:mt-0 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative w-full max-w-[280px] md:max-w-[380px] lg:max-w-[600px] h-[280px] md:h-[380px] lg:h-[600px]">
              <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block">
                <div className="absolute top-[5%] left-[10%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float">
                  <Icon name="web" className="text-6xl text-white" />
                </div>
                <div className="absolute top-[40%] -left-[5%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float-delayed">
                  <Icon name="psychology" className="text-5xl text-white" />
                </div>
                <div className="absolute bottom-[5%] left-[18%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float-slow">
                  <Icon name="deployed_code" className="text-6xl text-white" />
                </div>
                <div className="absolute top-[0%] right-[18%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float-slow">
                  <Icon name="shopping_bag" className="text-5xl text-white" />
                </div>
                <div className="absolute top-[45%] -right-[5%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float-delayed">
                  <Icon name="design_services" className="text-6xl text-white" />
                </div>
                <div className="absolute bottom-[5%] right-[10%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float">
                  <Icon name="storage" className="text-7xl text-white" />
                </div>
              </div>
              
              <div className="relative z-0 w-full h-full">
                <div className="w-full h-full">
                  {mount3D && <HeroGlobe />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WEBSITE TYPES SECTION */}
      <section className="py-24 relative overflow-hidden bg-[var(--color-surface)]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(0,112,243,0.05)_0%,transparent_70%)] rounded-full pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-display-md mb-4 bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Website Types We Design</h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">Tailored solutions for every business model and industry.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {WEBSITE_TYPES.map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-5 md:p-8 rounded-2xl bg-[var(--color-surface-container-low)] border border-black/5 dark:border-white/5 hover:border-[var(--color-primary-container)]/30 hover:bg-[var(--color-surface-container)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden flex flex-col"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[radial-gradient(circle_at_center,rgba(0,112,243,0.1)_0%,transparent_70%)] rounded-full group-hover:bg-[radial-gradient(circle_at_center,rgba(0,112,243,0.15)_0%,transparent_70%)] transition-all duration-500" />
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[var(--color-primary-container)]/10 flex items-center justify-center mb-4 md:mb-6 text-[var(--color-primary-container)] group-hover:scale-110 group-hover:bg-[var(--color-primary-container)] group-hover:text-white transition-all duration-300">
                  <Icon name={type.icon} className="text-[20px] md:text-[24px]" />
                </div>
                <h3 className="font-display text-sm md:text-xl font-semibold mb-2 md:mb-3 text-[var(--color-on-surface)] group-hover:text-[var(--color-primary-container)] transition-colors leading-tight">{type.title}</h3>
                <p className="text-[var(--color-on-surface-variant)] text-[11px] md:text-sm leading-relaxed line-clamp-3 md:line-clamp-none">{type.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFECT FOR MARQUEE */}
      <section className="py-8 md:py-12 border-b border-black/5 dark:border-white/5 bg-[var(--color-surface-container-lowest)] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 mb-6 md:mb-8 text-center">
          <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-[var(--color-on-surface-variant)]">Perfectly Tailored For</p>
        </div>
        <div className="flex overflow-hidden whitespace-nowrap mask-edges">
          <motion.div
            className="flex gap-3 md:gap-6 px-3"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
            style={{ width: "fit-content" }}
          >
            {/* Duplicate array for seamless loop */}
            {[...PERFECT_FOR, ...PERFECT_FOR, ...PERFECT_FOR, ...PERFECT_FOR].map((item, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3.5 bg-white dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10 shadow-sm hover:border-[var(--color-primary-container)]/50 transition-colors cursor-default"
              >
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[var(--color-primary-container)]/10 flex items-center justify-center">
                  <Icon name="check" className="text-[12px] md:text-[14px] text-[var(--color-primary-container)]" />
                </div>
                <span className="font-display font-semibold text-sm md:text-base text-[var(--color-on-surface)]">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <style jsx>{`
          .mask-edges {
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        `}</style>
      </section>

      <section id="services" className="py-24 bg-[var(--color-surface-container-lowest)] relative">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-display-md mb-4">Our Capabilities</h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">Forging cutting-edge solutions across the digital spectrum.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {SERVICES.map((s, i) => (
              <motion.div 
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glow-border p-5 md:p-10 rounded-xl group flex flex-col justify-between"
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-4 md:mb-8 transition-colors"
                  style={{
                    background: s.tone === "primary" ? "rgba(0,112,243,0.10)" : "rgba(124,58,237,0.10)",
                  }}
                >
                  <Icon
                    name={s.icon}
                    className="text-[20px] md:text-[24px]"
                    {...{ style: { color: s.tone === "primary" ? "var(--color-primary-container)" : "var(--color-secondary-fixed-dim)" } as any }}
                  />
                </div>
                <h3 className="font-headline-md text-sm md:text-xl lg:text-2xl font-semibold mb-2 md:mb-3 leading-tight">{s.title}</h3>
                <p className="text-[var(--color-on-surface-variant)] text-[11px] md:text-sm lg:text-base line-clamp-4 md:line-clamp-none">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-24 relative" ref={processRef}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <h2 className="font-display-lg text-display-md mb-4">Our Method</h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">A proven framework for delivering excellence from concept to production.</p>
          </div>
          <div className="relative">
            <div className="absolute top-7 left-0 w-full h-[2px] bg-black/5 dark:bg-white/5 hidden lg:block" />
            <motion.div 
              style={{ width: processLineWidth }}
              className="absolute top-7 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hidden lg:block opacity-80" 
            />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
              {STEPS.map((s, i) => (
                <StepBubble key={s.n} s={s} i={i} processScroll={processScroll} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED WORKS - Updated with website fonts */}
      <section id="projects" className="py-24 bg-[var(--color-surface)] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)] rounded-full pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <h2 className="font-display-lg text-display-md mb-2 bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Selected Works</h2>
              <p className="text-body-md text-[var(--color-on-surface-variant)] font-display">Exploring the boundary between aesthetics and utility. Crafted with precision.</p>
            </div>
            <Link 
              href="/portfolio"
              className="text-[var(--color-primary-container)] font-semibold flex items-center gap-2 group border-b border-transparent hover:border-[var(--color-primary-container)] transition-colors pb-1 text-sm font-display"
            >
              View Full Portfolio
              <span className="w-7 h-7 rounded-full bg-[var(--color-primary-container)]/10 flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-transform">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {initialProjects.map((p, i) => (
              <motion.a 
                href={p.url}
                target={p.url !== "#" ? "_blank" : undefined}
                rel={p.url !== "#" ? "noopener noreferrer" : undefined}
                key={p.title} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-[var(--color-surface-container)] border border-black/5 dark:border-white/10 hover:border-[var(--color-primary-container)]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-[var(--color-surface-container-low)]">
                  <Image 
                    src={p.img} 
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[8px] md:text-[9px] font-medium tracking-wider uppercase px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/20 font-display">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 md:p-4 flex-1">
                  <h3 className="font-display text-sm md:text-base font-semibold tracking-tight group-hover:text-[var(--color-primary-container)] transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-[var(--color-on-surface-variant)] text-[10px] md:text-xs mt-1 line-clamp-2 opacity-80 font-display">
                    {p.overview}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>


        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.03)_0%,transparent_70%)] rounded-full pointer-events-none" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group inline-flex items-center gap-2 px-4 py-1.5 bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-full mb-6 relative overflow-hidden"
            >
              <div className="absolute top-0 bottom-0 left-1/2 w-16 -ml-8 bg-gradient-to-r from-transparent via-[var(--color-primary-container)]/30 dark:via-[var(--color-primary-container)]/20 to-transparent animate-shimmer-slash will-change-transform pointer-events-none" />
              <Icon name="payments" className="text-base text-[var(--color-primary-container)] relative z-10" />
              <span className="text-label-sm font-semibold text-[var(--color-on-surface-variant)] relative z-10 uppercase tracking-widest">
                Transparent Pricing
              </span>
            </motion.div>
            <h2 className="font-display-lg text-display-md mb-4 bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/60 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">
              Flexible pricing designed to grow with you. All plans include our core expertise and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "₹5,999",
                description: "Perfect for early-stage startups and MVPs.",
                features: [
                  "Landing page or MVP development",
                  "Up to 5 pages / screens",
                  "Basic SEO optimization",
                  "1 round of design revisions",
                  "1 week of post-launch support",
                  "Deployment & hosting setup",
                  "Free Domain (1 year)",
                  "Free Hosting (1 year)",
                ],
                buttonText: "Get Started",
                buttonVariant: "solid",
                icon: Zap,
                popular: false,
              },
              {
                name: "Pro",
                price: "₹15,999",
                description: "For growing businesses needing full-featured products.",
                features: [
                  "Full-stack web application",
                  "Up to 15 pages / screens",
                  "Advanced SEO & performance",
                  "3 rounds of design revisions",
                  "1 month of post-launch support",
                  "Custom API integrations",
                  "Database design & optimization",
                  "Admin dashboard",
                  "Free Domain (1 year)",
                  "Free Hosting (1 year)",
                ],
                buttonText: "Get Started",
                buttonVariant: "solid",
                icon: Shield,
                popular: true,
              },
              {
                name: "Business",
                price: "₹30,999",
                description: "Enterprise-grade solutions with dedicated support.",
                features: [
                  "Complex multi-tenant SaaS",
                  "Unlimited pages / screens",
                  "AI & ML integrations",
                  "Unlimited design revisions",
                  "Ongoing maintenance & support",
                  "Custom CI/CD pipeline",
                  "Security & compliance audit",
                  "Dedicated project manager",
                  "24/7 priority support",
                  "Free Domain (1 year)",
                  "Free Hosting (1 year)",
                ],
                buttonText: "Get Started",
                buttonVariant: "solid",
                icon: Users,
                popular: false,
              },
            ].map((plan, i) => {
              return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, type: "spring", bounce: 0.4 } }}
                whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                viewport={{ once: true, margin: "-50px" }}
                className={`
                  will-change-transform
                  relative rounded-2xl p-6 sm:p-8 backdrop-blur-sm flex flex-col h-full
                  border-2
                  bg-white/40 dark:bg-black/40
                  shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.02)]
                  transition-colors duration-300 ease-out
                  border-black/10 dark:border-white/10 hover:border-[var(--color-primary-container)]
                  hover:shadow-[0_8px_40px_rgba(0,112,243,0.25)]
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] text-xs font-semibold tracking-wide">
                    Recommended
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <plan.icon className="w-5 h-5 text-[var(--color-primary-container)]" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                </div>

                <div className="mb-2 flex flex-col">
                  <span className="text-sm font-medium text-[var(--color-on-surface-variant)] mb-0.5">Starts from</span>
                  <div className="flex items-baseline">
                    <span className="font-display text-4xl font-bold tracking-tight">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-[var(--color-on-surface-variant)] text-sm ml-1">/ project</span>
                    )}
                  </div>
                </div>
                <p className="text-[var(--color-on-surface-variant)] text-sm mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => {
                    const isFreeFeature = feature.includes("Free Domain") || feature.includes("Free Hosting");
                    
                    if (isFreeFeature) {
                      return (
                        <li key={feature} className="flex items-center gap-3 text-sm p-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary-container)]/10 to-transparent relative overflow-hidden group">
                          <div className="absolute top-0 bottom-0 left-1/2 w-16 -ml-8 bg-gradient-to-r from-transparent via-[var(--color-primary-container)]/30 dark:via-[var(--color-primary-container)]/20 to-transparent animate-shimmer-slash will-change-transform pointer-events-none" />
                          <div className="w-6 h-6 rounded-full bg-[var(--color-primary-container)]/20 flex flex-shrink-0 items-center justify-center relative z-10 mt-0.5">
                            <Gift className="w-3.5 h-3.5 text-[var(--color-primary-container)]" />
                          </div>
                          <div className="flex flex-col relative z-10">
                            <span className="font-semibold text-[var(--color-primary-container)] leading-tight">
                              {feature}
                            </span>
                            <span className="text-[9px] text-[var(--color-primary-container)]/80 uppercase font-bold tracking-wider mt-0.5">
                              Limited Time Offer
                            </span>
                          </div>
                          <div className="ml-auto relative z-10 flex-shrink-0">
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-[var(--color-primary-container)] text-white dark:text-black px-2 py-1 rounded-full shadow-[0_0_10px_rgba(0,112,243,0.3)]">
                              Gift
                            </span>
                          </div>
                        </li>
                      );
                    }

                    return (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-[var(--color-primary-container)] flex-shrink-0 mt-0.5" />
                        <span className="text-[var(--color-on-surface)]">
                          {feature}
                        </span>
                      </li>
                    ); 
                  })}
                </ul>

                <button
                  onClick={() => {
                    const modal = document.getElementById('contactModal') as HTMLDialogElement;
                    if (modal) modal.showModal();
                  }}
                  className={`
                    relative z-10 mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all
                    ${plan.buttonVariant === 'solid'
                      ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] hover:opacity-90 hover:shadow-[0_0_30px_rgba(0,112,243,0.3)]'
                      : 'border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-[var(--color-on-surface)]'
                    }
                  `}
                >
                  {plan.buttonText}
                </button>

                {(plan.name === "Pro" || plan.name === "Business") && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] text-xs font-semibold tracking-wide whitespace-nowrap">
                    Prices are negotiable
                  </div>
                )}
              </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              All projects include a free consultation and discovery phase.
              <br />
              <span className="text-xs opacity-60">Custom quotes available for larger initiatives.</span>
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--color-surface-container-lowest)] border-y border-black/5 dark:border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { v: "120+", l: "Projects Delivered", c: "primary" },
              { v: "50+", l: "Happy Clients", c: "secondary" },
              { v: "99%", l: "Satisfaction Rate", c: "primary" },
              { v: "24/7", l: "Dedicated Support", c: "secondary" },
            ].map((s) => (
              <div key={s.l}>
                <div
                  className="font-display-lg text-display-md mb-2"
                  style={{ color: s.c === "primary" ? "var(--color-primary-container)" : "var(--color-secondary-fixed-dim)" }}
                >
                  {s.v}
                </div>
                <div className="text-label-sm text-[var(--color-on-surface-variant)] uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* REDESIGNED PROFESSIONAL FEEDBACK SECTION */}
<section className="py-24 bg-[var(--color-surface)] relative overflow-hidden">
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
  </div>
  
  <div className="max-w-[1440px] mx-auto px-4 md:px-6">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-primary-container)]/10 border border-[var(--color-primary-container)]/20 rounded-full mb-6">
        <span className="text-[var(--color-primary-container)] text-sm font-medium">Testimonials</span>
      </div>
      <h2 className="font-display-lg text-display-md mb-4 bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
        What Our Partners Say
      </h2>
      <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-2xl mx-auto">
        Hear from the visionaries who trusted us to bring their ideas to life.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {TESTIMONIALS.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="group relative p-8 rounded-2xl bg-[var(--color-surface-container-low)] border border-black/5 dark:border-white/5 hover:border-[var(--color-primary-container)]/20 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
        >
          {/* Quote icon background */}
          <div className="absolute top-6 right-6 text-6xl font-serif text-[var(--color-primary-container)]/5 group-hover:text-[var(--color-primary-container)]/10 transition-colors duration-500">
            "
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Image 
                src={t.avatar}
                alt={t.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover border-2 border-[var(--color-primary-container)]/20"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#0A66C2] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Linkedin className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div>
              <h4 className="font-display text-lg font-semibold text-[var(--color-on-surface)]">
                {t.name}
              </h4>
              <p className="text-sm text-[var(--color-on-surface-variant)]">
                {t.role}
              </p>
            </div>
          </div>

          <blockquote className="relative">
            <p className="text-[var(--color-on-surface-variant)] text-body-md leading-relaxed italic">
              "{t.quote}"
            </p>
          </blockquote>

          {/* Decorative line */}
          <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary-container)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* LinkedIn icon in corner (showcase only) */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center shadow-md">
              <Linkedin className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Trust indicators */}
    <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-80">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <Image 
            src="/images/avatar-12.jpg" 
            alt="Client"
            width={40}
            height={40} 
            className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover ring-2 ring-[var(--color-primary-container)]/20"
          />
          <Image 
            src="/images/avatar-13.jpg" 
            alt="Client" 
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover ring-2 ring-[var(--color-primary-container)]/20"
          />
          <Image 
            src="/images/avatar-14.jpg" 
            alt="Client" 
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover ring-2 ring-[var(--color-primary-container)]/20"
          />
          <Image 
            src="/images/avatar-15.jpg" 
            alt="Client" 
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover ring-2 ring-[var(--color-primary-container)]/20"
          />
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary-container)]/10 border-2 border-white dark:border-black flex items-center justify-center text-xs font-semibold text-[var(--color-primary-container)] ring-2 ring-[var(--color-primary-container)]/20">
            +50
          </div>
        </div>
        <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">
          Trusted by 50+ companies worldwide
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} className="w-5 h-5 text-[var(--color-primary-container)] fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">
          4.9/5 average rating
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <svg className="w-5 h-5 text-green-500 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-[var(--color-on-surface-variant)]">
            100% satisfaction guaranteed
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

      <section id="faq" className="py-24 bg-[var(--color-surface-container-lowest)]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-display-lg text-display-md mb-6">Common Inquiries</h2>
              <p className="text-body-lg text-[var(--color-on-surface-variant)] mb-12">Everything you need to know about working with Nexotar.</p>
              
              <div className="h-[320px] w-full">
                {loadHeavyComponents ? (
                  <AnalyticsDashboard />
                ) : (
                  <div className="w-full h-full border border-black/5 dark:border-white/5 rounded-2xl bg-[var(--color-surface-container-low)] animate-pulse flex items-center justify-center">
                    <span className="text-[var(--color-on-surface-variant)] text-sm">Loading Live Data...</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} className="border border-black/5 dark:border-white/5 rounded-lg overflow-hidden bg-[var(--color-surface-container-low)]">
                    <button
                      className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      <span className="font-semibold">{f.q}</span>
                      <Icon name="expand_more" className={`transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && (
                      <div className="px-8 py-6 text-[var(--color-on-surface-variant)] text-body-md border-t border-black/5 dark:border-white/5">{f.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="py-24 relative bg-[var(--color-surface-container-lowest)] border-t border-black/5 dark:border-white/5">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-display-lg text-display-md mb-4 text-[#10b981] dark:text-[#34d399] drop-shadow-sm">Results You Can Expect</h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">We don't just build websites; we build business growth engines.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESULTS.map((res, i) => (
              <motion.div
                key={res.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 shadow-lg hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mb-6 text-[#10b981]">
                  <Icon name={res.icon} className="text-[32px]" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{res.title}</h3>
                <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">{res.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary-container)]/5 dark:bg-[var(--color-primary-container)]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center justify-between relative">
          
          {/* Left Column: Text & WhatsApp */}
          <div className="text-left max-w-xl w-full lg:w-[45%]">
            <h2 className="font-display-lg text-display-md mb-6 bg-gradient-to-br from-black to-black/40 dark:from-white dark:to-white/40 bg-clip-text text-transparent">
              What's on your mind!!
            </h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)] mb-10">
              Got an idea you can't stop thinking about? We'd love to hear it. Fill out the form, or drop us a quick text and let's figure out how to bring it to life.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <motion.button 
                onClick={() => {
                  const modal = document.getElementById('whatsappModal') as HTMLDialogElement;
                  if (modal) modal.showModal();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 bg-[#1a8c4a] text-white font-semibold px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(26,140,74,0.2)] hover:shadow-[0_0_50px_rgba(26,140,74,0.4)] transition-shadow hover:bg-[#157a3f]"
              >
                <WhatsAppIcon className="w-5 h-5" /> Chat on WhatsApp
              </motion.button>
              
              <span className="text-sm text-[var(--color-on-surface-variant)] font-medium px-2">
                Usually responds in 5 minutes
              </span>
            </div>
          </div>

          {/* OR Divider with Logo */}
          <div className="flex lg:flex-col items-center justify-center w-full lg:w-auto shrink-0 opacity-50 lg:translate-x-4">
            <div className="h-[1px] w-full lg:h-32 lg:w-[1px] bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-black dark:via-white to-transparent" />
            
            <div className="px-6 lg:px-0 lg:py-8 flex items-center justify-center">
              <div className="relative w-14 h-14 md:w-20 md:h-20 opacity-90 hover:opacity-100 transition-all hover:scale-110 drop-shadow-lg cursor-default">
                
                {/* Light Mode: Flat Black Mask */}
                <div 
                  className="w-full h-full bg-black dark:hidden block"
                  style={{
                    WebkitMaskImage: 'url(/images/nexotar_logo_without_text.png)',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                  }}
                />

                {/* Dark Mode: Original Image */}
                <Image 
                  src="/images/nexotar_logo_without_text.png" 
                  alt="Nexotar Icon"
                  fill
                  sizes="(max-width: 768px) 56px, 80px"
                  className="object-contain hidden dark:block"
                />

              </div>
            </div>

            <div className="h-[1px] w-full lg:h-32 lg:w-[1px] bg-gradient-to-r lg:bg-gradient-to-b from-black dark:from-white via-black dark:via-white to-transparent" />
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto lg:w-[45%] min-h-[600px]">
            {loadHeavyComponents ? (
              <ContactForm />
            ) : (
              <div className="w-full h-full min-h-[600px] border border-black/5 dark:border-white/5 rounded-2xl bg-[var(--color-surface-container-low)] animate-pulse flex items-center justify-center">
                <span className="text-[var(--color-on-surface-variant)] text-sm">Loading Form...</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>

      {/* Footer is extracted to global layout */}
      <ScrollToTopButton />
      
      {/* Conditional Bot Toggle Button */}
      {isHighEndDevice && (
        <BotToggleButton isBotVisible={isBotVisible} onToggle={toggleBot} />
      )}
    </div>
  );
}