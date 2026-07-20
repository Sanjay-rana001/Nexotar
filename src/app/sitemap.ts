import { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: 'https://nexotar.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://nexotar.com/portfolio',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://nexotar.com/services',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://nexotar.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const dynamicBlogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `https://nexotar.com/blog/${post.slug}`,
    lastModified: new Date(post.date), // Using the post's date for lastModified
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicBlogRoutes];
}
