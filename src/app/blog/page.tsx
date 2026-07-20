"use client";

import Link from 'next/link';
import { blogPosts } from '@/data/blog';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

export default function BlogIndex() {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--color-primary-container)]/5 dark:bg-[var(--color-primary-container)]/10 blur-[120px] rounded-full pointer-events-none w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/5 dark:bg-white/10 backdrop-blur-sm border border-black/10 dark:border-white/20 rounded-full w-fit mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-on-surface)]">Insights & News</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-semibold mb-6 tracking-tight text-[var(--color-on-surface)]">
              Nexotar <span className="text-[var(--color-primary-container)]">Journal</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-on-surface-variant)] max-w-2xl mx-auto">
              Deep dives into software engineering, artificial intelligence, and how we build the future of the web.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 md:px-8 pb-32 relative z-10">
        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <Link href={`/blog/${featuredPost.slug}`} className="group block relative rounded-3xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 transition-all hover:border-[var(--color-primary-container)]/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="h-[300px] lg:h-[500px] relative overflow-hidden">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-wide uppercase">
                  {featuredPost.category}
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-on-surface-variant)] mb-6 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <time>{featuredPost.date}</time>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
                <h2 className="text-3xl lg:text-5xl font-display font-semibold mb-6 text-[var(--color-on-surface)] group-hover:text-[var(--color-primary-container)] transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-[var(--color-on-surface-variant)] mb-8 line-clamp-3 leading-relaxed">
                  {featuredPost.description}
                </p>
                <div className="mt-auto flex items-center gap-2 text-[var(--color-on-surface)] font-semibold group-hover:text-[var(--color-primary-container)] transition-colors">
                  Read Article <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {remainingPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + (index * 0.1) }}
            >
              <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden hover:border-[var(--color-primary-container)]/50 transition-all">
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-wider uppercase">
                    {post.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-[var(--color-on-surface-variant)] mb-4 font-medium">
                    <time>{post.date}</time>
                    <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-display font-semibold mb-4 text-[var(--color-on-surface)] group-hover:text-[var(--color-primary-container)] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-[var(--color-on-surface-variant)] line-clamp-3 mb-8 leading-relaxed">
                    {post.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[var(--color-primary-container)]" />
                      <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">{post.tags[0]}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-[var(--color-primary-container)] group-hover:text-white transition-all group-hover:border-transparent">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
