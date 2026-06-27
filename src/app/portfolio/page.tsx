'use client';

import { allProjects, Project } from "@/data/projects";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Phone, ExternalLink, Code2, Layout, Database, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { useState, useEffect } from "react";

// Individual Project Card Component
function ProjectCard({ p }: { p: Project }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
      className="bg-[var(--color-surface-container)] rounded-[2rem] border border-black/5 dark:border-white/5 overflow-hidden flex flex-col group shadow-xl"
    >
      {/* Header Container: Flow column on mobile, relative container on md+ */}
      <div className="w-full flex flex-col md:block relative bg-[var(--color-surface-container)] md:bg-black/5 dark:md:bg-white/5">
        
        {/* Image Section */}
        <div className="relative w-full aspect-square md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
          <img 
            src={p.img} 
            alt={p.title}
            loading="lazy"
            className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Overlay gradient only on md+ */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
        </div>
        
        {/* Title & Hook - Flow below on mobile, absolute overlay on md+ */}
        <div className="relative md:absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[var(--color-surface-container)] md:bg-transparent">
          <div className="md:text-white text-[var(--color-on-surface)]">
            <div className="flex flex-wrap gap-2 mb-4">
              {p.tags.map((t) => (
                <span key={t} className="text-xs font-bold tracking-wider uppercase px-3 py-1 bg-[var(--color-primary-container)]/10 md:bg-white/20 backdrop-blur-md rounded-full border border-[var(--color-primary-container)]/20 md:border-white/30 text-[var(--color-primary-container)] md:text-white md:shadow-lg">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-2 md:drop-shadow-xl">{p.title}</h2>
            <h3 className="text-lg md:text-2xl font-medium text-[var(--color-on-surface-variant)] md:text-white/90 md:drop-shadow-md max-w-2xl">{p.hook}</h3>
          </div>
          
          <div className="shrink-0 bg-[var(--color-primary-container)]/5 md:bg-white/10 backdrop-blur-md border border-[var(--color-primary-container)]/20 md:border-white/20 rounded-2xl p-5 max-w-sm text-[var(--color-on-surface)] md:text-white md:shadow-2xl">
            <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-primary-container)] md:text-green-400 mb-2">Key Impact</h4>
            <p className="text-sm md:text-base font-semibold leading-relaxed">
              {p.results}
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Case Study Section */}
      <div className="bg-[var(--color-surface)] relative z-10">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-6 flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-b border-black/5 dark:border-white/5 cursor-pointer"
        >
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-on-surface)]">
            {isExpanded ? "Close Case Study" : "Read Full Case Study"}
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="p-6 md:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12 bg-[var(--color-surface)]">
                
                {/* Left Col: Overview & Tech Stack */}
                <div className="lg:col-span-1 space-y-8">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-on-surface)] opacity-50 mb-3">Overview</h4>
                    <p className="text-base text-[var(--color-on-surface-variant)] leading-relaxed">
                      {p.overview}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-on-surface)] opacity-50 mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {p.technologies.map(tech => (
                        <span key={tech} className="text-xs px-3 py-1.5 bg-[var(--color-surface-container)] rounded-lg text-[var(--color-on-surface)] font-medium border border-black/5 dark:border-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle Col: Problem & Solution */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-sm uppercase tracking-widest font-bold text-[var(--color-error)] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-error)]"></span> The Challenge
                      </h4>
                      <p className="text-sm md:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
                        {p.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm uppercase tracking-widest font-bold text-[var(--color-primary-container)] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary-container)]"></span> The Solution
                      </h4>
                      <p className="text-sm md:text-base text-[var(--color-on-surface-variant)] leading-relaxed">
                        {p.solution}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-black/5 dark:border-white/5">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-on-surface)] opacity-50 mb-4">Key Features Delivered</h4>
                      <ul className="space-y-3">
                        {p.features.map(f => (
                          <li key={f} className="text-sm text-[var(--color-on-surface-variant)] flex items-start gap-3">
                            <span className="text-[var(--color-primary-container)] mt-0.5">•</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-[var(--color-surface-container)] rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-sm">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-[var(--color-primary-container)] mb-3">Strategic Insight</h4>
                      <p className="text-sm md:text-base text-[var(--color-on-surface-variant)] leading-relaxed italic">
                        "{p.insight}"
                      </p>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Bottom Close Button */}
              <div className="border-t border-black/5 dark:border-white/5 bg-[var(--color-surface)]">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="w-full py-6 flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-on-surface)]">
                    Close Case Study
                  </span>
                  <ChevronDown className="w-5 h-5 rotate-180" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] relative overflow-x-hidden pt-24 pb-12">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20 mt-12">
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
            className="text-xl md:text-2xl text-[var(--color-on-surface-variant)] font-display max-w-2xl mx-auto mb-16"
          >
            We don't just write code. We build robust, scalable platforms that drive real business impact.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
            className="max-w-3xl mx-auto text-left bg-[var(--color-surface-container)] rounded-2xl p-8 border border-black/5 dark:border-white/5 shadow-sm"
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-on-surface)] mb-4">Our Approach</h3>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed text-lg">
              We treat your product as our own. By combining world-class engineering, conversion-focused design, and strategic business thinking, we don't just deliver code—we deliver measurable growth and operational efficiency. No fluff, just high-performance results.
            </p>
          </motion.div>
        </div>

        {/* Project Grid */}
        <div className="space-y-16 lg:space-y-24">
          {allProjects.map((p) => (
            <ProjectCard key={p.title} p={p} />
          ))}
        </div>

        {/* Start a Project Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="mt-40 text-center max-w-4xl mx-auto py-20 px-6 lg:px-12 bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-primary-container)]/10 rounded-[3rem] border border-[var(--color-primary-container)]/20 shadow-2xl"
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
    </div>
  );
}
