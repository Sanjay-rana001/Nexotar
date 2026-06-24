"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { RobotMascot } from "@/components/RobotMascot/RobotMascot";
import { HeroGlobe } from "@/components/HeroGlobe";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Work", href: "#projects" },
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
  { name: "Aarav Sharma", role: "CTO, Veridian Systems", quote: "Nexotar transformed our legacy infrastructure into a high-performing SaaS engine. Their technical depth is unparalleled in the agency space." },
  { name: "Priya Patel", role: "Founder, Aura Design", quote: "The attention to detail and design sensibility Nexotar brings is exactly what we needed to launch our luxury platform. Pure excellence." },
  { name: "Rohan Desai", role: "Product Lead, NexaCloud", quote: "Speed, reliability, and innovation. They didn't just build our app; they helped us redefine our business strategy." },
  { name: "Ananya Singh", role: "VP Eng, Northwind", quote: "A rare combination of taste and engineering rigor. Every milestone shipped on time and exceeded the brief." },
];

const FAQS = [
  { q: "How long does a typical project take?", a: "Most projects range from 8 to 16 weeks depending on complexity. We prioritize quality over speed, but our agile process ensures rapid delivery of MVPs within the first 4–6 weeks." },
  { q: "Do you offer post-launch support?", a: "Yes, we provide ongoing maintenance and support packages to ensure your platform remains secure, updated, and performing at its peak." },
  { q: "What tech stack do you use?", a: "We specialize in the modern web stack: Next.js, React, Node.js, TypeScript, and various cloud-native tools like AWS and Vercel. We choose the best tools for each project's needs." },
  { q: "Can you work with our existing team?", a: "Absolutely. We embed seamlessly with in-house teams, contributing across product, design, and engineering rituals." },
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

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[var(--color-on-surface)] hover:scale-110 transition-transform relative overflow-hidden"
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
        {/* Water Fill Background */}
        <motion.div 
          style={{ height: fillHeight }}
          className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${gradients[i] || gradients[0]} z-0`}
        >
          {/* Subtle wave highlight at the top of the water */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40" />
          
          {/* Floating water bubbles */}
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
        
        {/* Number text */}
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

export default function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);
  
  const processRef = useRef<HTMLElement>(null);
  
  // The optimal window: Starts as soon as it appears, finishes when the bottom of the section is at the middle of the screen.
  // This gives the maximum possible smooth scrolling distance while ensuring the timeline is still fully visible.
  const { scrollYProgress } = useScroll({
    target: processRef,
    offset: ["start 85%", "end 50%"]
  });
  
  // Perfectly tuned liquid physics: feels weighty but responsive
  const processScroll = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });
  
  // 1:1 linear mapping so the water strictly obeys the scroll wheel position
  const processLineWidth = useTransform(processScroll, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative overflow-x-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none aurora opacity-60" />
      {mounted && <RobotMascot />}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-black/60 border-b border-black/5 dark:border-white/5 transition-colors">
        <div className="max-w-container-max mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-[var(--color-primary-container)] grid place-items-center text-[var(--color-on-primary-container)] font-bold">N</span>
            <span className="font-display text-xl tracking-tight">Nexotar</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] text-sm hover:bg-[#25D366] hover:text-white transition-all shadow-[0_0_15px_rgba(37,211,102,0.2)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)]">
              <WhatsAppIcon className="w-4 h-4" /> Book a call
            </a>
          </div>
        </div>
      </header>

      <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 aurora pointer-events-none -z-10 opacity-70 dark:opacity-40" />
        <div className="absolute inset-0 grid-bg pointer-events-none opacity-40" />
        
        {/* Floating Animated Icons (Left Side Only) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block z-0">
          <motion.div animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-[14%] left-[6%] opacity-40 drop-shadow-[0_0_15px_var(--color-primary-container)]">
            <Icon name="code_blocks" className="text-6xl text-[var(--color-on-surface)]" />
          </motion.div>
          <motion.div animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute bottom-[25%] left-[10%] opacity-40 drop-shadow-[0_0_15px_var(--color-primary-container)]">
            <Icon name="rocket_launch" className="text-7xl text-[var(--color-on-surface)]" />
          </motion.div>
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} className="absolute top-[50%] left-[5%] opacity-40 drop-shadow-[0_0_15px_var(--color-primary-container)]">
            <Icon name="terminal" className="text-5xl text-[var(--color-on-surface)]" />
          </motion.div>
        </div>
        


        <div className="max-w-container-max mx-auto px-6 md:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-full w-fit mb-8">
              <Icon name="developer_mode" className="text-[var(--color-primary-container)] !text-[16px]" />
              <span className="text-label-sm text-[var(--color-on-surface-variant)]">The Future of Digital Excellence</span>
            </div>
            <h1 className="font-display-lg text-display-lg mb-6 bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/60 bg-clip-text text-transparent pb-2">
              Building Modern Digital Experiences That Scale
            </h1>
            <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-lg mb-10">
              We combine world-class engineering with sophisticated AI to build products that define the next generation of the web.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#1ebd5a] hover:shadow-[0_0_40px_rgba(37,211,102,0.4)] transition-all transform hover:-translate-y-1">
                <WhatsAppIcon className="w-5 h-5" /> Let's Chat
              </a>
              <button className="border border-black/10 dark:border-white/10 glass font-semibold px-8 py-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-2">
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
              {/* Orbiting Service Icons */}
              <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
                <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-[5%] left-[10%] opacity-40 drop-shadow-[0_0_15px_var(--color-primary-container)]">
                  <Icon name="web" className="text-6xl text-[var(--color-on-surface)]" />
                </motion.div>
                <motion.div animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} className="absolute top-[40%] -left-[5%] opacity-40 drop-shadow-[0_0_15px_var(--color-primary-container)]">
                  <Icon name="psychology" className="text-5xl text-[var(--color-on-surface)]" />
                </motion.div>
                <motion.div animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }} className="absolute bottom-[5%] left-[18%] opacity-40 drop-shadow-[0_0_15px_var(--color-primary-container)]">
                  <Icon name="deployed_code" className="text-6xl text-[var(--color-on-surface)]" />
                </motion.div>
                <motion.div animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-[0%] right-[18%] opacity-40 drop-shadow-[0_0_15px_var(--color-primary-container)]">
                  <Icon name="shopping_bag" className="text-5xl text-[var(--color-on-surface)]" />
                </motion.div>
                <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 7.5, ease: "easeInOut" }} className="absolute top-[45%] -right-[5%] opacity-40 drop-shadow-[0_0_15px_var(--color-primary-container)]">
                  <Icon name="design_services" className="text-6xl text-[var(--color-on-surface)]" />
                </motion.div>
                <motion.div animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 7.2, ease: "easeInOut" }} className="absolute bottom-[5%] right-[10%] opacity-40 drop-shadow-[0_0_15px_var(--color-primary-container)]">
                  <Icon name="storage" className="text-7xl text-[var(--color-on-surface)]" />
                </motion.div>
              </div>
              <div className="relative z-0 w-full h-full">
                <HeroGlobe />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="py-24 bg-[var(--color-surface-container-lowest)] relative">
        <div className="max-w-container-max mx-auto px-6 md:px-8">
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
        <div className="max-w-container-max mx-auto px-6 md:px-8">
          <div className="mb-16 max-w-2xl">
            <h2 className="font-display-lg text-display-md mb-4">Our Method</h2>
            <p className="text-body-lg text-[var(--color-on-surface-variant)]">A proven framework for delivering excellence from concept to production.</p>
          </div>
          <div className="relative">
            {/* Empty background track */}
            <div className="absolute top-7 left-0 w-full h-[2px] bg-black/5 dark:bg-white/5 hidden lg:block" />
            
            {/* Animated filling gradient track */}
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

      <section id="projects" className="py-32 bg-[var(--color-surface)] relative overflow-hidden">
        {/* Subtle premium background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-container-max mx-auto px-6 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="font-display-lg text-display-md mb-4 bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Selected Works</h2>
              <p className="text-body-lg text-[var(--color-on-surface-variant)]">Exploring the boundary between aesthetics and utility. Crafted with precision.</p>
            </div>
            <a href="#" className="text-[var(--color-primary-container)] font-semibold flex items-center gap-2 group border-b border-transparent hover:border-[var(--color-primary-container)] transition-colors pb-1">
              View All Case Studies
              <span className="w-8 h-8 rounded-full bg-[var(--color-primary-container)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
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
                title: "Nexus CRM",
                tags: ["Enterprise", "2023"],
                body: "A next-generation customer relationship management interface.",
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
                url: "https://stripe.com/"
              },
              {
                title: "Aura System",
                tags: ["Design", "2024"],
                body: "A scalable, component-driven design system for modern web apps.",
                img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
                url: "https://linear.app/"
              },
            ].map((p, i) => (
              <motion.a 
                href={p.url}
                target={p.url !== "#" ? "_blank" : undefined}
                rel={p.url !== "#" ? "noopener noreferrer" : undefined}
                key={p.title} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="group block relative rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-black/5 to-transparent dark:from-white/5 dark:to-transparent border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)]"
              >
                {/* Premium MacOS Browser Window Mockup */}
                <div className="relative rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 mb-5 shadow-inner">
                  {/* Browser Top Bar */}
                  <div className="h-8 w-full bg-black/5 dark:bg-white/5 backdrop-blur-md flex items-center px-3 gap-1.5 border-b border-black/5 dark:border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                  </div>
                  {/* Image Container */}
                  <div className="h-40 sm:h-48 overflow-hidden relative bg-[var(--color-surface)]">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover object-top group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-out" />
                  </div>
                </div>
                
                <div className="px-2 pb-2">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] rounded-full border border-black/5 dark:border-white/5">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-[var(--color-primary-container)] transition-colors line-clamp-1">{p.title}</h3>
                    <div className="w-7 h-7 flex-shrink-0 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </div>
                  </div>
                  <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed line-clamp-2">{p.body}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--color-surface-container-lowest)] border-y border-black/5 dark:border-white/5">
        <div className="max-w-container-max mx-auto px-6 md:px-8">
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

      <section className="py-24 overflow-hidden">
        <div className="max-w-container-max mx-auto px-6 md:px-8 mb-16">
          <h2 className="font-display-lg text-display-md">What Our Partners Say</h2>
        </div>
        <div className="relative">
          <div className="flex gap-8 animate-scroll w-max px-8">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="min-w-[400px] max-w-[400px] p-10 rounded-xl border border-black/5 dark:border-white/5 bg-[var(--color-surface-container-low)]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <Icon name="person" className="text-[var(--color-on-surface-variant)]" />
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-[var(--color-on-surface-variant)] text-sm">{t.role}</div>
                  </div>
                </div>
                <p className="italic text-[var(--color-on-surface-variant)] text-body-md leading-relaxed">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-[var(--color-surface-container-lowest)]">
        <div className="max-w-container-max mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-display-lg text-display-md mb-6">Common Inquiries</h2>
              <p className="text-body-lg text-[var(--color-on-surface-variant)]">Everything you need to know about working with Nexotar AI.</p>
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
        <div className="max-w-container-max mx-auto px-6 md:px-8 text-center">
          <h2 className="font-display-lg text-display-md mb-6 bg-gradient-to-br from-black to-black/40 dark:from-white dark:to-white/40 bg-clip-text text-transparent">
            Let's build what's next.
          </h2>
          <p className="text-body-lg text-[var(--color-on-surface-variant)] max-w-xl mx-auto mb-10">
            Tell us about your product. We'll respond within one business day with a plan to move forward.
          </p>
          <motion.a 
            href="https://wa.me/1234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-[#25D366] text-white font-semibold px-10 py-4 rounded-full shadow-[0_0_40px_rgba(37,211,102,0.3)] hover:shadow-[0_0_60px_rgba(37,211,102,0.5)] transition-shadow"
          >
            <WhatsAppIcon className="w-6 h-6" /> Chat on WhatsApp
          </motion.a>
        </div>
      </section>

      <footer className="border-t border-black/5 dark:border-white/5 py-12">
        <div className="max-w-container-max mx-auto px-6 md:px-8 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-[var(--color-primary-container)] grid place-items-center text-[var(--color-on-primary-container)] font-bold">N</span>
            <span className="font-display text-lg">Nexotar</span>
          </div>
          <div className="text-sm text-[var(--color-on-surface-variant)]">© {new Date().getFullYear()} Nexotar AI. All rights reserved.</div>
          <div className="flex gap-6 text-sm text-[var(--color-on-surface-variant)]">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
