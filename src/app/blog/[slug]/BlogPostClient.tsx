"use client";

import { use } from 'react';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

import { BlogPost } from '@/data/blog';

interface Props {
  post: BlogPost;
}

export default function BlogPostClient({ post }: Props) {

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-[var(--color-surface)] relative pb-32">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-[var(--color-primary-container)] to-purple-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Hero Cover Image Header */}
      <header className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 dark:bg-black/80 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[var(--color-surface)] z-10" />
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-[800px] mx-auto relative z-20">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-8 transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/20">
            <ArrowLeft className="w-4 h-4" /> Back to journal
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80 mb-6 font-medium">
              <span className="px-3 py-1 bg-[var(--color-primary-container)] text-white rounded-full text-xs font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <time>{post.date}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold mb-8 text-white leading-snug md:leading-snug drop-shadow-lg">
              {post.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
              {post.description}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-12 relative z-20 pt-8">
        
        {/* Left Sidebar (Author & Share) */}
        <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-32 h-fit hidden lg:block">
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-6 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-4">Written By</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary-container)] to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <div>
                <p className="font-semibold text-[var(--color-on-surface)]">{post.author}</p>
                <p className="text-sm text-[var(--color-on-surface-variant)]">Editorial Team</p>
              </div>
            </div>
          </div>

          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-3xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share Article
            </p>
            <div className="flex gap-2">
              <a 
                href={`https://twitter.com/intent/tweet?url=https://nexotar.com/blog/${post.slug}&text=Check out this article: ${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-black/10 dark:border-white/10 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://nexotar.com/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-black/10 dark:border-white/10 flex items-center justify-center hover:text-blue-800 hover:border-blue-800 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=https://nexotar.com/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-black/10 dark:border-white/10 flex items-center justify-center hover:text-blue-700 hover:border-blue-700 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </aside>

        {/* Article Body */}
        <div className="flex-1 max-w-[800px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg md:prose-xl dark:prose-invert prose-headings:font-display prose-headings:font-semibold prose-a:text-[var(--color-primary-container)] max-w-none text-[var(--color-on-surface)] whitespace-pre-wrap leading-relaxed"
          >
            {post.content}
          </motion.div>

          <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10">
            <p className="font-semibold text-[var(--color-on-surface)] mb-4">Tags</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-sm text-[var(--color-on-surface-variant)]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}
