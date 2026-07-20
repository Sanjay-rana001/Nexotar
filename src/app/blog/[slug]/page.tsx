import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

// Generate static params for all known blog posts
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Dynamically generate metadata based on the post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Nexotar',
    };
  }

  return {
    title: `${post.title} | Nexotar Blog`,
    description: post.description,
    keywords: [post.title.split(' ').join(', '), 'Nexotar Blog', 'Web Development'], 
  };
}

export default function BlogPost({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-[800px] mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-black/50 dark:text-white/50 mb-6">
            <time>{post.date}</time>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl md:text-2xl text-black/60 dark:text-white/60 leading-relaxed">
            {post.description}
          </p>
        </header>

        {/* Dummy content renderer for MVP. Later this would be a markdown parser like react-markdown */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-black/80 dark:text-white/80 whitespace-pre-wrap">
          {post.content}
        </div>
      </div>
    </article>
  );
}
