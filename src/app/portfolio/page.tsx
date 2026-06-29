'use client';

import { allProjects, Project } from "@/data/projects";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, Layout, X, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from 'embla-carousel-react';

const OTHER_WORKS = [
  { title: "NeoBank Landing Page", type: "FinTech", img: "/images/neobank.jpg", status: "In Progress" },
  { title: "FitLife App Website", type: "Health & Fitness", img: "/images/fitlife.jpg", status: "Upcoming" },
  { title: "Urban Coffee Roasters", type: "E-Commerce", img: "/images/coffee.jpg", status: "In Progress" },
  { title: "Creative Agency Portfolio", type: "B2B Services", img: "/images/creative.jpg", status: "Upcoming" },
  { title: "EcoTech Dashboard", type: "SaaS", img: "/images/ecotech.jpg", status: "In Progress" },
  { title: "Luxury Real Estate", type: "Property", img: "/images/luxury.jpg", status: "Upcoming" },
];

const PLAYGROUND = [
  { title: "Glassmorphism UI Kit", category: "Open Source", img: "/images/ui-kit.jpg" },
  { title: "Spotify App Redesign", category: "Concept", img: "/images/spotify.jpg" },
  { title: "Web3 Wallet Interaction", category: "Experiment", img: "/images/web3.jpg" },
];

const TESTIMONIALS = [
  { 
    name: "Aarav Sharma", 
    role: "CTO, Veridian Systems", 
    quote: "Nexotar transformed our legacy infrastructure into a high-performing SaaS engine. Their technical depth is unparalleled in the agency space.",
    avatar: "/images/avatar-aarav.png"
  },
  { 
    name: "Priya Patel", 
    role: "Founder, Aura Design", 
    quote: "The attention to detail and design sensibility Nexotar brings is exactly what we needed to launch our luxury platform. Pure excellence.",
    avatar: "/images/avatar-priya.png"
  },
  { 
    name: "Rohan Desai", 
    role: "Product Lead, NexaCloud", 
    quote: "Speed, reliability, and innovation. They didn't just build our app; they helped us redefine our business strategy.",
    avatar: "/images/avatar-rohan.png"
  },
  { 
    name: "Ananya Singh", 
    role: "VP Eng, Northwind", 
    quote: "A rare combination of taste and engineering rigor. Every milestone shipped on time and exceeded the brief.",
    avatar: "/images/avatar-ananya.png"
  },
];

export default function PortfolioPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center',
    skipSnaps: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredProjects = activeTag ? allProjects.filter(p => p.tags.includes(activeTag)) : allProjects;

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const nodes = emblaApi.slideNodes();
    const viewportCenter = window.innerWidth / 2;
    
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = center - viewportCenter;
      
      const normalized = distance / window.innerWidth;
      
      const inner = node.firstElementChild as HTMLElement;
      if (inner) {
        const rotateY = Math.max(-35, Math.min(35, normalized * -100));
        const scale = Math.max(0.8, 1 - Math.abs(normalized) * 0.5);
        const translateZ = Math.abs(normalized) * -200;
        const opacity = Math.max(0.2, 1 - Math.abs(normalized) * 1.5);
        
        inner.style.transform = `scale(${scale}) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
        node.style.opacity = opacity.toString();
        node.style.zIndex = Math.round((1 - Math.abs(normalized)) * 100).toString();
      }
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    onScroll();
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('reInit', onScroll);
  }, [emblaApi, onSelect, onScroll]);

  // Re-initialize carousel when filters change to ensure proper centering
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({
        loop: filteredProjects.length > 2,
        containScroll: false
      });
      emblaApi.scrollTo(0, true);
    }
  }, [emblaApi, activeTag, filteredProjects.length]);

  // Lock body scroll and pause Lenis when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.dispatchEvent(new Event('pause-scroll'));
    } else {
      document.body.style.overflow = 'unset';
      window.dispatchEvent(new Event('resume-scroll'));
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      window.dispatchEvent(new Event('resume-scroll'));
    }
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] relative overflow-x-hidden pt-24 pb-12">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 mt-12 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-primary-container)]/10 text-[var(--color-primary-container)] border border-[var(--color-primary-container)]/20 rounded-full mb-6"
          >
            <span className="text-label-sm font-semibold uppercase tracking-widest">Selected Works</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            className="font-display-lg text-[3rem] md:text-[4rem] leading-tight mb-6 bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/60 bg-clip-text text-transparent font-bold tracking-tight"
          >
            Engineering digital excellence.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="text-xl md:text-2xl text-[var(--color-on-surface-variant)] font-display max-w-2xl mx-auto mb-12"
          >
            We don't just write code. We build robust, scalable platforms that drive real business impact.
          </motion.p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 px-4">
          <button 
            onClick={() => { setActiveTag(null); emblaApi?.scrollTo(0); }}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${!activeTag ? 'bg-[var(--color-primary-container)] text-white border-transparent shadow-lg shadow-[var(--color-primary-container)]/30' : 'bg-transparent text-[var(--color-on-surface-variant)] border-black/10 dark:border-white/10 hover:border-[var(--color-primary-container)]/50'}`}
          >
            All Projects
          </button>
          {Array.from(new Set(allProjects.flatMap(p => p.tags))).map(tag => (
            <button
              key={tag}
              onClick={() => { setActiveTag(tag); emblaApi?.scrollTo(0); }}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${activeTag === tag ? 'bg-[var(--color-primary-container)] text-white border-transparent shadow-lg shadow-[var(--color-primary-container)]/30' : 'bg-transparent text-[var(--color-on-surface-variant)] border-black/10 dark:border-white/10 hover:border-[var(--color-primary-container)]/50'}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Theater Carousel Section */}
        <div className="relative w-full overflow-hidden pb-4 md:pb-8">
           <div className="embla" ref={emblaRef}>
              <div className={`embla__container flex touch-pan-y items-center py-8 md:py-12 ${filteredProjects.length <= 1 ? 'justify-center' : ''}`}>
                {filteredProjects.map((p, i) => {
                   const isActive = i === selectedIndex;
                   
                   return (
                      <div 
                        key={p.title} 
                        className="embla__slide relative flex-shrink-0 w-[88vw] md:w-[60vw] lg:w-[50vw] xl:w-[45vw] mx-1 md:mx-2 lg:mx-3 transition-none" 
                        style={{ perspective: '1500px' }}
                      >
                         <div className="w-full h-full transition-none"> {/* This wrapper gets the 3D transform from JS */}
                            <div 
                              className={`relative w-full h-full aspect-[4/3] md:aspect-[16/10] rounded-[2rem] overflow-hidden shadow-2xl border border-black/5 dark:border-white/10 group transition-none ${isActive ? 'cursor-pointer ring-4 ring-[var(--color-primary-container)]/30' : 'cursor-grab'}`} 
                              style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                              onClick={() => {
                                  if (isActive) {
                                    setSelectedProject(p);
                                  } else {
                                    emblaApi?.scrollTo(i);
                                  }
                              }}
                            >
                               <Image 
                                 src={p.img} 
                                 alt={p.title} 
                                 fill
                                 sizes="(max-width: 768px) 88vw, 50vw"
                                 className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                               />
                               
                               <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-500" />
                               
                               <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10 pb-8 md:pb-12 transform transition-transform duration-500">
                                <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-2 md:mb-3 drop-shadow-lg leading-tight">{p.title}</h2>
                                <p className="text-white/90 font-medium text-xs md:text-base line-clamp-2 mb-4 md:mb-6 drop-shadow-md">{p.hook}</p>
                                
                                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-4">
                                   {p.tags.map(t => (
                                     <span key={t} className="px-2.5 py-1 md:px-3 md:py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] md:text-xs font-bold text-white uppercase tracking-widest border border-white/20">
                                       {t}
                                     </span>
                                   ))}
                                </div>

                                {isActive && (
                                  <div className="inline-flex items-center gap-2 mt-3 md:mt-4 px-4 py-2 md:px-6 md:py-3 bg-white text-black rounded-xl font-bold text-xs md:text-sm hover:bg-gray-100 transition-colors shadow-xl">
                                    Read Case Study <ExternalLink size={14} className="md:w-4 md:h-4" />
                                  </div>
                                )}
                             </div>
                          </div>
                         </div>
                      </div>
                   )
                })}
              </div>
           </div>

           {/* Carousel Controls */}
           <div className="flex items-center justify-center gap-4 md:gap-6 mt-2 md:mt-4 lg:mt-8 relative z-20">
              <button 
                onClick={scrollPrev} 
                className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-[var(--color-primary-container)] hover:border-[var(--color-primary-container)] hover:text-white transition-all shadow-sm"
                aria-label="Previous Project"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex gap-2">
                 {filteredProjects.map((_, i) => (
                   <button 
                     key={i} 
                     aria-label={`Go to slide ${i + 1}`}
                     onClick={() => emblaApi?.scrollTo(i)} 
                     className={`h-2.5 rounded-full transition-all duration-300 ${i === selectedIndex ? 'bg-[var(--color-primary-container)] w-8' : 'bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40 w-2.5'}`} 
                   />
                 ))}
              </div>
              
              <button 
                onClick={scrollNext} 
                className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-[var(--color-primary-container)] hover:border-[var(--color-primary-container)] hover:text-white transition-all shadow-sm"
                aria-label="Next Project"
              >
                <ChevronRight size={24} />
              </button>
           </div>
        </div>

        {/* 1. Our Design Philosophy */}
        <div className="py-24 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-display-lg text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              We design for conversion.
            </h2>
            <p className="text-xl md:text-2xl text-[var(--color-on-surface-variant)] leading-relaxed">
              Every pixel we place and every line of code we write serves a single purpose: to elevate your brand and drive measurable business growth. Aesthetics mean nothing without performance.
            </p>
          </motion.div>
        </div>

        {/* 2. Other Works / Archive */}
        <div className="py-20 max-w-[1440px] mx-auto px-4 md:px-6 border-t border-black/5 dark:border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h3 className="font-display text-3xl font-bold mb-2">Upcoming & In Progress</h3>
              <p className="text-[var(--color-on-surface-variant)]">A sneak peek at what we're currently building in the lab.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OTHER_WORKS.map((work, i) => (
              <motion.div
                key={work.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-black/5 dark:border-white/5">
                  <Image src={work.img} alt={work.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-semibold text-lg">{work.title}</h4>
                    <span className="text-sm text-[var(--color-primary-container)] font-medium">{work.type}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] flex items-center shadow-sm">
                    {work.status}
                    <span className="ml-0.5 inline-flex tracking-normal">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}>.</motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>.</motion.span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Industry Expertise & Stats */}
        <div className="py-20 max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="bg-[var(--color-surface-container-low)] rounded-[2rem] p-12 border border-black/5 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary-container)]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-5xl md:text-6xl font-display-lg font-bold text-[var(--color-primary-container)] mb-4">0.8s</div>
                <h4 className="font-bold text-lg mb-2">Average Load Time</h4>
                <p className="text-[var(--color-on-surface-variant)] text-sm">Lightning fast performance across all our builds.</p>
              </div>
              <div className="md:border-x border-black/5 dark:border-white/5 px-4">
                <div className="text-5xl md:text-6xl font-display-lg font-bold text-[var(--color-primary-container)] mb-4">120+</div>
                <h4 className="font-bold text-lg mb-2">Projects Shipped</h4>
                <p className="text-[var(--color-on-surface-variant)] text-sm">Successfully delivered for clients worldwide.</p>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-display-lg font-bold text-[var(--color-primary-container)] mb-4">99%</div>
                <h4 className="font-bold text-lg mb-2">Client Satisfaction</h4>
                <p className="text-[var(--color-on-surface-variant)] text-sm">Our partners stay with us for the long haul.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Wall of Love */}
        <div className="py-20 max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl font-bold mb-2">Wall of Love</h3>
            <p className="text-[var(--color-on-surface-variant)]">Don't just take our word for it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-[var(--color-surface-container-lowest)] border border-black/5 dark:border-white/5 shadow-sm hover:-translate-y-1 transition-transform"
              >
                <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed italic mb-8">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover border border-black/10 dark:border-white/10" />
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <span className="text-xs text-[var(--color-on-surface-variant)]">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. The Playground */}
        <div className="py-20 max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl font-bold mb-2">The Playground</h3>
            <p className="text-[var(--color-on-surface-variant)]">Concepts, experiments, and open-source contributions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLAYGROUND.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl bg-[var(--color-surface-container-low)] border border-black/5 dark:border-white/5 overflow-hidden shadow-sm"
              >
                <div className="relative w-full aspect-video">
                  <Image src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white uppercase tracking-widest">
                    {item.category}
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <h4 className="font-display font-semibold">{item.title}</h4>
                  <ChevronRight size={18} className="text-[var(--color-on-surface-variant)] group-hover:text-[var(--color-primary-container)] group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Start a Project Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="mt-20 mb-20 text-center max-w-4xl mx-auto py-20 px-6 lg:px-12 bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-primary-container)]/10 rounded-[3rem] border border-[var(--color-primary-container)]/20 shadow-2xl mx-4 md:mx-auto"
        >
          <div className="w-20 h-20 mx-auto bg-[var(--color-primary-container)] text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-[var(--color-primary-container)]/30 transform -rotate-6">
            <Layout size={40} />
          </div>
          <h3 className="text-4xl md:text-5xl font-bold font-display mb-6 tracking-tight">Ready to scale your digital presence?</h3>
          <p className="text-lg md:text-xl text-[var(--color-on-surface-variant)] mb-10 max-w-2xl mx-auto">
            Stop losing customers to slow, outdated digital experiences. Let's engineer a high-performance platform that drives real business growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1769ff] text-white rounded-xl font-bold hover:bg-[#1456d3] transition-all transform hover:-translate-y-1 w-full sm:w-auto justify-center shadow-xl shadow-[#1769ff]/20 text-lg">
              Explore Behance <ExternalLink size={20} />
            </a>
            <button onClick={() => (document.getElementById('contactModal') as HTMLDialogElement)?.showModal()} className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/20 rounded-xl font-bold hover:bg-black/5 dark:hover:bg-white/20 transition-all w-full sm:w-auto justify-center text-lg">
              Get a Free Audit <Code2 size={20} />
            </button>
          </div>
        </motion.div>

      </div>
      <ScrollToTopButton />

      {/* Expanding Case Study Lightbox (Modal) */}
      <AnimatePresence>
        {selectedProject && (
           <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 lg:p-12 bg-black/60 dark:bg-black/80 backdrop-blur-md overflow-hidden"
              onClick={() => setSelectedProject(null)}
           >
              <motion.div 
                 data-lenis-prevent="true"
                 initial={{ y: 50, opacity: 0, scale: 0.95 }}
                 animate={{ y: 0, opacity: 1, scale: 1 }}
                 exit={{ y: 30, opacity: 0, scale: 0.95 }}
                 transition={{ type: "spring", damping: 25, stiffness: 300 }}
                 className="bg-[var(--color-surface)] w-full max-w-6xl max-h-[95vh] h-full lg:h-auto overflow-y-auto rounded-[2rem] shadow-2xl flex flex-col relative"
                 onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
              >
                 {/* Floating Close Button */}
                 <button 
                    onClick={() => setSelectedProject(null)} 
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-12 h-12 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg"
                 >
                    <X size={24} />
                 </button>
                 
                 {/* Hero Image Section */}
                 <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[350px] shrink-0 rounded-t-[2rem] overflow-hidden" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
                    <Image 
                      src={selectedProject.img} 
                      alt={selectedProject.title}
                      fill
                      sizes="100vw"
                      className="object-cover" 
                    />
                    {/* Gradient to blend with background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-10 left-6 md:left-12 max-w-3xl">
                       <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-white drop-shadow-lg">{selectedProject.title}</h2>
                       <a 
                         href={selectedProject.url} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--color-primary-container)] text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-xl shadow-blue-500/30"
                       >
                          Visit Live Site <ExternalLink size={18} />
                       </a>
                    </div>
                 </div>

                 {/* Content Section */}
                 <div className="p-6 md:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12 bg-[var(--color-surface)] relative shrink-0">
                    
                    {/* Left Col: Overview & Tech Stack */}
                    <div className="lg:col-span-1 space-y-10">
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-on-surface)] opacity-50 mb-3">Overview</h4>
                        <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">
                          {selectedProject.overview}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-on-surface)] opacity-50 mb-3">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.technologies.map(tech => (
                            <span key={tech} className="text-xs px-3 py-1.5 bg-[var(--color-surface-container)] rounded-lg text-[var(--color-on-surface)] font-medium border border-black/5 dark:border-white/5 shadow-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Middle Col: Problem & Solution */}
                    <div className="lg:col-span-2 space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-sm uppercase tracking-widest font-bold text-[var(--color-error)] mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-error)]"></span> The Challenge
                          </h4>
                          <p className="text-sm md:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
                            {selectedProject.problem}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm uppercase tracking-widest font-bold text-[var(--color-primary-container)] mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-primary-container)]"></span> The Solution
                          </h4>
                          <p className="text-sm md:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
                            {selectedProject.solution}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-black/5 dark:border-white/5">
                        <div>
                          <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-on-surface)] opacity-50 mb-4">Key Features Delivered</h4>
                          <ul className="space-y-4">
                            {selectedProject.features.map(f => (
                              <li key={f} className="text-sm text-[var(--color-on-surface-variant)] flex items-start gap-3">
                                <span className="text-[var(--color-primary-container)] mt-0.5">•</span> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-6">
                           <div className="bg-[var(--color-surface-container)] rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-sm">
                             <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-primary-container)] mb-3">Strategic Insight</h4>
                             <p className="text-sm md:text-base text-[var(--color-on-surface-variant)] leading-relaxed italic">
                               "{selectedProject.insight}"
                             </p>
                           </div>
                           <div className="bg-[var(--color-primary-container)]/10 rounded-2xl p-6 border border-[var(--color-primary-container)]/20 shadow-sm">
                             <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-primary-container)] mb-2">Key Impact</h4>
                             <p className="text-sm md:text-base font-bold text-[var(--color-on-surface)]">
                               {selectedProject.results}
                             </p>
                           </div>
                        </div>
                      </div>
                    </div>
                 </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
