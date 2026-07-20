import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/blog';

export const metadata: Metadata = {
  title: 'Blog & Insights | Nexotar',
  description: 'Read the latest insights on web development, SaaS architecture, and AI integration from the engineering team at Nexotar.',
  keywords: ['Web Development Blog', 'SaaS Architecture', 'AI Integration Guides', 'Next.js Tutorials', 'Nexotar Engineering'],
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif mb-6">Blog & Insights</h1>
        <p className="text-lg md:text-xl text-black/60 dark:text-white/60 mb-12 max-w-2xl">
          Deep dives into software engineering, artificial intelligence, and how we build the future of the web.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="border border-black/10 dark:border-white/10 rounded-2xl p-6 h-full transition-all duration-300 hover:border-black/30 dark:hover:border-white/30 hover:bg-black/5 dark:hover:bg-white/5">
                <div className="flex items-center gap-3 text-sm text-black/50 dark:text-white/50 mb-4">
                  <time>{post.date}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-2xl font-medium mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-black/70 dark:text-white/70 line-clamp-3">
                  {post.description}
                </p>
                <div className="mt-6 text-sm font-medium flex items-center gap-2 group-hover:text-blue-600">
                  Read article &rarr;
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
