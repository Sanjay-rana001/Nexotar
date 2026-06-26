"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Check, Zap, Shield, Users, Sparkles, Linkedin, Phone, ArrowUp } from "lucide-react";
import { RobotMascot } from "@/components/RobotMascot/RobotMascot";
import { HeroGlobe } from "@/components/HeroGlobe";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#projects" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const SERVICES = [
  { icon: "web", title: "Web Dev", body: "Pixel-perfect, high-performance web applications built with the latest React & Next.js frameworks.", tone: "primary" },
  { icon: "deployed_code", title: "SaaS", body: "Scalable multi-tenant architectures designed to support millions of users with rock-solid reliability.", tone: "secondary" },
  { icon: "psychology", title: "AI Integration", body: "Empowering products with custom LLM implementations, vector search, and predictive analytics.", tone: "primary" },
  { icon: "shopping_bag", title: "E-Commerce", body: "High-conversion checkout experiences and headless commerce solutions that drive revenue.", tone: "secondary" },
  { icon: "design_services", title: "UI/UX", body: "Minimalist, intuitive interface design focused on user delight and business objectives.", tone: "primary" },
  { icon: "storage", title: "Backend", body: "Efficient API design and database optimization ensuring ultra-low latency for your users.", tone: "secondary" },
];

const STEPS = [
  { n: 1, title: "Discovery", body: "In-depth research and strategic alignment to define project goals and technical requirements." },
  { n: 2, title: "Design", body: "Interactive prototypes and high-fidelity interfaces that prioritize user flow and brand identity." },
  { n: 3, title: "Development", body: "Iterative sprints building clean, documented code using a modern, scalable tech stack." },
  { n: 4, title: "Launch", body: "Rigorous QA testing, deployment automation, and continuous monitoring for success." },
  { n: 5, title: "Maintenance", body: "Continuous support, performance optimization, and seamless feature scaling to ensure long-term platform health." },
];

const TESTIMONIALS = [
  { 
    name: "Aarav Sharma", 
    role: "CTO, Veridian Systems", 
    quote: "Nexotar transformed our legacy infrastructure into a high-performing SaaS engine. Their technical depth is unparalleled in the agency space.",
    avatar: "https://ui-avatars.com/api/?name=Aarav+Sharma&background=FF9933&color=fff&size=150&bold=true"
  },
  { 
    name: "Priya Patel", 
    role: "Founder, Aura Design", 
    quote: "The attention to detail and design sensibility Nexotar brings is exactly what we needed to launch our luxury platform. Pure excellence.",
    avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=138808&color=fff&size=150&bold=true"
  },
  { 
    name: "Rohan Desai", 
    role: "Product Lead, NexaCloud", 
    quote: "Speed, reliability, and innovation. They didn't just build our app; they helped us redefine our business strategy.",
    avatar: "https://ui-avatars.com/api/?name=Rohan+Desai&background=FF9933&color=fff&size=150&bold=true"
  },
  { 
    name: "Ananya Singh", 
    role: "VP Eng, Northwind", 
    quote: "A rare combination of taste and engineering rigor. Every milestone shipped on time and exceeded the brief.",
    avatar: "https://ui-avatars.com/api/?name=Ananya+Singh&background=138808&color=fff&size=150&bold=true"
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

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm hover:scale-110 transition-transform relative overflow-hidden hover:bg-white/20 border ${
        isScrolled && !isDark
          ? 'border-black/20 bg-black/10 text-black hover:bg-black/20'
          : isScrolled && isDark
          ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
          : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
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
          <motion.div 
            animate={{ y: [0, -50], opacity: [0, 0.8, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeIn", delay: 0.1 }}
            className="absolute -bottom-2 left-[20%] w-1.5 h-1.5 bg-white rounded-full"
          />
          <motion.div 
            animate={{ y: [0, -50], opacity: [0, 0.6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeIn", delay: 0.5 }}
            className="absolute -bottom-2 left-[50%] w-2 h-2 bg-white rounded-full"
          />
          <motion.div 
            animate={{ y: [0, -40], opacity: [0, 0.9, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeIn", delay: 0.8 }}
            className="absolute -bottom-2 left-[75%] w-1 h-1 bg-white rounded-full"
          />
          <motion.div 
            animate={{ y: [0, -60], opacity: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeIn", delay: 0.3 }}
            className="absolute -bottom-2 left-[35%] w-2.5 h-2.5 bg-white rounded-full"
          />
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

// Minimal Cursor Effect - Just a subtle glow
function MinimalCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Subtle glow following cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full bg-gradient-to-r from-[var(--color-primary-container)]/20 to-purple-500/20 blur-2xl"
        animate={{
          x: mousePosition.x - 50,
          y: mousePosition.y - 50,
          width: 100,
          height: 100,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 30,
          mass: 1,
        }}
      />
    </>
  );
}

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
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
    
    if (videoRef.current) {
      if (videoRef.current.readyState >= 2) {
        setIsVideoLoaded(true);
      }
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
        setVideoError(true);
      });
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsCursorVisible(false);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVideoError = () => {
    console.error("Video failed to load");
    setVideoError(true);
  };

  const allProjects = [
    {
      title: "FreshMart NZ",
      tags: ["E-Commerce", "2024"],
      body: "A modern, responsive online grocery store platform.",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
      url: "https://grocery-store-a57l.vercel.app/"
    },
    {
      title: "Dietitian Suruchi",
      tags: ["Health", "2023"],
      body: "A comprehensive digital booking platform for a clinical dietitian.",
      img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
      url: "https://sanjay-rana001.github.io/Dietetian_Suruchi_website/"
    },
    {
      title: "SSPI Plastics",
      tags: ["Manufacturing", "2026"],
      body: "Complete digital presence for a leading plastics manufacturing company.",
      img: "https://images.unsplash.com/photo-1716191300020-b52dec5b70a8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      url: "https://sspiplastics.com/"
    },
    {
      title: "Airlines eTicket",
      tags: ["Travel", "2026"],
      body: "Streamlined flight booking and e-ticketing platform for modern travelers.",
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800",
      url: "https://airlineseticket.com/"
    },
    {
      title: "Package Reservation",
      tags: ["Travel", "2026"],
      body: "Comprehensive tour and travel package booking platform.",
      img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800",
      url: "https://packagereservation.com/"
    },
  ];

  const initialProjects = allProjects.slice(0, 4);
  const hiddenProjects = allProjects.slice(4);

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
      <div className="hidden md:block">
        {mounted && <RobotMascot />}
      </div>
      
<header 
  className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl transition-all duration-300 ${
    isScrolled 
      ? 'bg-white/80 dark:bg-black/80 border-b border-black/10 dark:border-white/10' 
      : 'bg-transparent border-b border-black/10 dark:border-white/10'
  }`}
>
  <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-0.5 md:py-1 flex items-center justify-between">
    <a href="#home" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
      {/* Responsive Theme & Scroll Logo */}
      <div className="relative w-12 h-12 md:w-16 md:h-16 lg:w-[72px] lg:h-[72px]">
        {/* Light Mode: White Logo (visible at top) */}
        <img 
          src="/images/nexotar_logo.png" 
          alt="Nexotar" 
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 dark:hidden ${isScrolled ? 'opacity-0' : 'opacity-100'}`}
        />
        {/* Light Mode: Dark Logo (visible when scrolled) */}
        <img 
          src="/images/nexotar_logo_dark.png" 
          alt="Nexotar" 
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 dark:hidden ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Dark Mode: Always use White Logo */}
        <img 
          src="/images/nexotar_logo.png" 
          alt="Nexotar" 
          className="absolute inset-0 w-full h-full object-contain transition-all duration-500 hidden dark:block"
        />
      </div>
    </a>
    
    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
      {NAV.map((n) => (
        <a 
          key={n.href} 
          href={n.href} 
          className={`text-sm font-medium transition-all duration-300 ${
            isScrolled 
              ? 'text-gray-700 dark:text-white/80 hover:text-black dark:hover:text-white' 
              : 'text-white/90 hover:text-white drop-shadow-md' // Always white at top because video is dark
          }`}
        >
          {n.label}
        </a>
      ))}
    </nav>
    
    <div className="flex items-center gap-2 md:gap-3">
      <ThemeToggle />
      <a 
        href="tel:+917703988597" 
        className={`hidden sm:inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all shadow-lg whitespace-nowrap ${
          isScrolled 
            ? 'border-[var(--color-primary-container)]/30 bg-[var(--color-primary-container)]/10 text-[var(--color-primary-container)] hover:bg-[var(--color-primary-container)] hover:text-[var(--color-on-primary-container)] border' 
            : 'border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border' // Always glass/white at top
        }`}
      >
        <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
        <span>Call now</span>
      </a>
    </div>
  </div>
</header>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          {!videoError ? (
            <video
              suppressHydrationWarning
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
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
          <motion.div animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-[14%] left-[6%] opacity-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Icon name="code_blocks" className="text-6xl text-white" />
          </motion.div>
          <motion.div animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute bottom-[25%] left-[10%] opacity-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Icon name="rocket_launch" className="text-7xl text-white" />
          </motion.div>
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} className="absolute top-[50%] left-[5%] opacity-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Icon name="terminal" className="text-5xl text-white" />
          </motion.div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
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
            <div className="flex flex-wrap gap-4">
              <a href="https://wa.me/8178546141" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#1ebd5a] text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-black/40 hover:bg-[#179b4a] hover:shadow-[0_0_40px_rgba(37,211,102,0.5)] transition-all transform hover:-translate-y-1">
                <WhatsAppIcon className="w-5 h-5" /> Let's Chat
              </a>
              <button className="border border-white/30 backdrop-blur-sm bg-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
                View Portfolio <Icon name="arrow_forward" className="!text-[18px]" />
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden md:flex items-center justify-end"
          >
            <div className="relative w-full max-w-[600px] h-[400px] md:h-[600px]">
              <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
                <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-[5%] left-[10%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <Icon name="web" className="text-6xl text-white" />
                </motion.div>
                <motion.div animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} className="absolute top-[40%] -left-[5%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <Icon name="psychology" className="text-5xl text-white" />
                </motion.div>
                <motion.div animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }} className="absolute bottom-[5%] left-[18%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <Icon name="deployed_code" className="text-6xl text-white" />
                </motion.div>
                <motion.div animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-[0%] right-[18%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <Icon name="shopping_bag" className="text-5xl text-white" />
                </motion.div>
                <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut" }} className="absolute top-[45%] -right-[5%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <Icon name="design_services" className="text-6xl text-white" />
                </motion.div>
                <motion.div animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 7.2, ease: "easeInOut" }} className="absolute bottom-[5%] right-[10%] opacity-30 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <Icon name="storage" className="text-7xl text-white" />
                </motion.div>
              </div>
              
              <div className="relative z-0 w-full h-full">
                <div className="w-full h-full">
                  <HeroGlobe />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="py-24 bg-[var(--color-surface-container-lowest)] relative">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-display-md mb-4">Our Capabilities</h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">Forging cutting-edge solutions across the digital spectrum.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div 
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glow-border p-10 rounded-xl group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-8 transition-colors"
                  style={{
                    background: s.tone === "primary" ? "rgba(0,112,243,0.10)" : "rgba(124,58,237,0.10)",
                  }}
                >
                  <Icon
                    name={s.icon}
                    className=""
                    {...{ style: { color: s.tone === "primary" ? "var(--color-primary-container)" : "var(--color-secondary-fixed-dim)" } as any }}
                  />
                </div>
                <h3 className="font-headline-md text-headline-md mb-3">{s.title}</h3>
                <p className="text-[var(--color-on-surface-variant)] text-body-md">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="py-24 relative" ref={processRef}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <h2 className="font-display-lg text-display-md mb-2 bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Selected Works</h2>
              <p className="text-body-md text-[var(--color-on-surface-variant)] font-display">Exploring the boundary between aesthetics and utility. Crafted with precision.</p>
            </div>
            <button 
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="text-[var(--color-primary-container)] font-semibold flex items-center gap-2 group border-b border-transparent hover:border-[var(--color-primary-container)] transition-colors pb-1 text-sm font-display"
            >
              {showAllProjects ? 'Show Less' : 'View All Case Studies'}
              <span className={`w-7 h-7 rounded-full bg-[var(--color-primary-container)]/10 flex items-center justify-center group-hover:scale-110 transition-transform ${showAllProjects ? 'rotate-180' : ''}`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
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
                className="group relative overflow-hidden rounded-2xl bg-[var(--color-surface-container)] border border-black/5 dark:border-white/10 hover:border-[var(--color-primary-container)]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-[var(--color-surface-container-low)]">
                  <img 
                    src={p.img} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[9px] font-medium tracking-wider uppercase px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/20 font-display">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-[var(--color-primary-container)] transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="text-[var(--color-on-surface-variant)] text-xs mt-1 line-clamp-2 opacity-80 font-display">
                    {p.body}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>

          {showAllProjects && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-4 lg:mt-5"
            >
              {hiddenProjects.map((p, i) => (
                <motion.a 
                  href={p.url}
                  target={p.url !== "#" ? "_blank" : undefined}
                  rel={p.url !== "#" ? "noopener noreferrer" : undefined}
                  key={p.title} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl bg-[var(--color-surface-container)] border border-black/5 dark:border-white/10 hover:border-[var(--color-primary-container)]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="aspect-[4/3] overflow-hidden relative bg-[var(--color-surface-container-low)]">
                    <img 
                      src={p.img} 
                      alt={p.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((t) => (
                          <span key={t} className="text-[9px] font-medium tracking-wider uppercase px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/20 font-display">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-[var(--color-primary-container)] transition-colors line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-[var(--color-on-surface-variant)] text-xs mt-1 line-clamp-2 opacity-80 font-display">
                      {p.body}
                    </p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[var(--color-primary-container)]" />
              <span className="text-label-sm text-[var(--color-on-surface-variant)]">Transparent Pricing</span>
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
                  "Free Domain",
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
                  "Free Domain",
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
                  "Free Domain",
                  "Free Hosting (1 year)",
                ],
                buttonText: "Get Started",
                buttonVariant: "solid",
                icon: Users,
                popular: false,
              },
            ].map((plan, i) => {
              const isSelected = selectedPlan === plan.name;
              return (
              <motion.div
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, type: "spring", bounce: 0.4 }}
                className={`
                  relative rounded-2xl p-8 backdrop-blur-sm cursor-pointer flex flex-col h-full
                  border-2
                  bg-white/40 dark:bg-black/40
                  shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.02)]
                  transition-all duration-300 ease-out hover:-translate-y-2
                  ${isSelected 
                    ? 'border-[var(--color-primary-container)] shadow-[0_8px_40px_rgba(0,112,243,0.25)] scale-[1.02]' 
                    : 'border-black/10 dark:border-white/10 hover:border-[var(--color-primary-container)]'}
                  hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_60px_rgba(255,255,255,0.04)]
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] text-xs font-semibold tracking-wide">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <plan.icon className="w-5 h-5 text-[var(--color-primary-container)]" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                </div>

                <div className="mb-2">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)] font-semibold mb-1">Starts from</p>
                  <span className="font-display text-4xl font-bold tracking-tight">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-[var(--color-on-surface-variant)] text-sm ml-1">/ project</span>
                  )}
                </div>
                <p className="text-[var(--color-on-surface-variant)] text-sm mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => {
                    const isFreeFeature = feature.includes("Free Domain") || feature.includes("Free Hosting");
                    return (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        {isFreeFeature ? (
                          <span className="text-[var(--color-primary-container)] flex-shrink-0 mt-0.5">✦</span>
                        ) : (
                          <Check className="w-4 h-4 text-[var(--color-primary-container)] flex-shrink-0 mt-0.5" />
                        )}
                        <span className={isFreeFeature ? "text-[var(--color-primary-container)] font-medium" : "text-[var(--color-on-surface)]"}>
                          {feature}
                        </span>
                      </li>
                    ); 
                  })}
                </ul>

                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all
                    ${plan.buttonVariant === 'solid'
                      ? 'bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] hover:opacity-90 hover:shadow-[0_0_30px_rgba(0,112,243,0.3)]'
                      : 'border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-[var(--color-on-surface)]'
                    }
                  `}
                >
                  {plan.buttonText}
                </a>

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
              <img 
                src={t.avatar}
                alt={t.name}
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
          <img 
            src="https://i.pravatar.cc/40?img=12" 
            alt="Client" 
            className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover ring-2 ring-[var(--color-primary-container)]/20"
          />
          <img 
            src="https://i.pravatar.cc/40?img=13" 
            alt="Client" 
            className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover ring-2 ring-[var(--color-primary-container)]/20"
          />
          <img 
            src="https://i.pravatar.cc/40?img=14" 
            alt="Client" 
            className="w-10 h-10 rounded-full border-2 border-white dark:border-black object-cover ring-2 ring-[var(--color-primary-container)]/20"
          />
          <img 
            src="https://i.pravatar.cc/40?img=15" 
            alt="Client" 
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
                <AnalyticsDashboard />
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

    <section id="contact" className="py-32 relative">
  <div className="max-w-[1440px] mx-auto px-4 md:px-6 text-center">
    <h2 className="font-display-lg text-display-md mb-6 bg-gradient-to-br from-black to-black/40 dark:from-white dark:to-white/40 bg-clip-text text-transparent">
      Let's build what's next.
    </h2>
    <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-xl mx-auto mb-10">
      Tell us about your product. We'll respond within one business day with a plan to move forward.
    </p>
    <motion.a 
      href="https://wa.me/918178546141" 
      target="_blank" 
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-3 bg-[#1a8c4a] text-white font-semibold px-10 py-4 rounded-full shadow-[0_0_40px_rgba(26,140,74,0.3)] hover:shadow-[0_0_60px_rgba(26,140,74,0.5)] transition-shadow hover:bg-[#157a3f]"
    >
      <WhatsAppIcon className="w-6 h-6" /> Chat on WhatsApp
    </motion.a>
  </div>
</section>

 <footer className="border-t border-black/5 dark:border-white/5 py-12">
  <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-6 items-center justify-between">
    <div className="flex items-center gap-3">
      {/* Light mode logo */}
      <div className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 dark:hidden block">
        <img 
          src="/images/nexotar_logo_dark.png" 
          alt="Nexotar" 
          className="w-full h-full object-contain"
        />
      </div>
      {/* Dark mode logo */}
      <div className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 dark:block hidden">
        <img 
          src="/images/nexotar_logo.png" 
          alt="Nexotar" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
    <div className="text-sm text-[var(--color-on-surface-variant)]">© {new Date().getFullYear()} Nexotar. All rights reserved.</div>
    <div className="flex gap-6 text-sm text-[var(--color-on-surface-variant)]">
      <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
      <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
      <button 
        onClick={() => (document.getElementById('contactModal') as HTMLDialogElement)?.showModal()}
        className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
      >
        Contact
      </button>
    </div>
  </div>

  {/* Contact Modal - Updated with different logos */}
  <dialog 
    id="contactModal" 
    className="rounded-2xl p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm max-w-md w-full mx-auto border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-2xl"
  >
    <div className="p-8 relative">
      {/* Close button */}
      <button 
        onClick={() => (document.getElementById('contactModal') as HTMLDialogElement)?.close()}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center mb-8">
        {/* Light mode logo in modal */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 dark:hidden block">
          <img 
            src="/images/nexotar_logo_dark.png" 
            alt="Nexotar" 
            className="w-full h-full object-contain"
          />
        </div>
        {/* Dark mode logo in modal */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 dark:block hidden">
          <img 
            src="/images/nexotar_logo.png" 
            alt="Nexotar" 
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="font-display text-2xl font-semibold text-black dark:text-white transition-colors duration-300">
          Contact Us
        </h3>
        <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Reach out to us via phone or WhatsApp</p>
      </div>

      <div className="space-y-4">
        {/* Phone Number */}
        <a 
          href="tel:+917703988597" 
          className="flex items-center gap-4 p-4 rounded-xl border border-black/5 dark:border-white/5 hover:border-[var(--color-primary-container)]/30 transition-all hover:bg-[var(--color-surface-container)] group"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary-container)]/10 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-[var(--color-primary-container)]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm text-[var(--color-on-surface-variant)]">Phone</p>
            <p className="font-semibold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary-container)] transition-colors">
              +91 77039 88597
            </p>
          </div>
          <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>

        {/* WhatsApp Number 1 */}
        <a 
          href="https://wa.me/918178546141" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 rounded-xl border border-black/5 dark:border-white/5 hover:border-[#1a8c4a]/30 transition-all hover:bg-[#1a8c4a]/5 group"
        >
          <div className="w-12 h-12 rounded-full bg-[#1a8c4a]/10 flex items-center justify-center flex-shrink-0">
            <WhatsAppIcon className="w-5 h-5 text-[#1a8c4a]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm text-[var(--color-on-surface-variant)]">WhatsApp</p>
            <p className="font-semibold text-[var(--color-on-surface)] group-hover:text-[#1a8c4a] transition-colors">
              +91 81785 46141
            </p>
          </div>
          <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>

        {/* WhatsApp Number 2 */}
        <a 
          href="https://wa.me/917703988597" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 rounded-xl border border-black/5 dark:border-white/5 hover:border-[#1a8c4a]/30 transition-all hover:bg-[#1a8c4a]/5 group"
        >
          <div className="w-12 h-12 rounded-full bg-[#1a8c4a]/10 flex items-center justify-center flex-shrink-0">
            <WhatsAppIcon className="w-5 h-5 text-[#1a8c4a]" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm text-[var(--color-on-surface-variant)]">WhatsApp (Alt)</p>
            <p className="font-semibold text-[var(--color-on-surface)] group-hover:text-[#1a8c4a] transition-colors">
              +91 77039 88597
            </p>
          </div>
          <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5 text-center">
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          We respond within 1 business day
        </p>
      </div>
    </div>
  </dialog>
</footer>
      <ScrollToTopButton />
    </div>
  );
}