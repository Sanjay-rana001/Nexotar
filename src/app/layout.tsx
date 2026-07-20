import type { Metadata } from 'next';
import './globals.css';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'], 
  variable: '--font-sans' 
});

const dmSerif = DM_Serif_Display({ 
  subsets: ['latin'], 
  weight: ['400'], 
  variable: '--font-serif' 
});

import { SmoothScroll } from '@/components/SmoothScroll';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexotar.com'),
  title: {
    default: 'Nexotar | Premium SaaS, AI & Custom Web Development Agency',
    template: '%s | Nexotar',
  },
  description: 'Nexotar is a premium software development agency specializing in scalable SaaS applications, custom AI integrations, and high-performance Next.js web development for modern businesses.',
  keywords: [
    'Software Development Agency', 'SaaS Development Company', 'Custom AI Integration',
    'Next.js Web Development', 'React Developers', 'Full Stack Engineering', 
    'Web App Development', 'E-commerce Solutions', 'UI/UX Design Agency',
    'Digital Transformation', 'Tech Startup Developers', 'Enterprise Software',
    'Nexotar', 'Web Development India'
  ],
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Nexotar Engineering' }],
  creator: 'Nexotar',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexotar.com',
    title: 'Nexotar | Premium SaaS, AI & Custom Web Development',
    description: 'We build scalable SaaS applications, custom AI integrations, and high-performance websites that drive growth and digital transformation.',
    siteName: 'Nexotar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexotar | Premium SaaS & Web Development',
    description: 'We build scalable SaaS applications, custom AI integrations, and high-performance websites.',
    creator: '@nexotar',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${dmSerif.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Nexotar",
              "url": "https://nexotar.com",
              "logo": "https://nexotar.com/favicon.ico",
              "description": "Nexotar is a premium software development agency specializing in scalable SaaS applications, custom AI integrations, and high-performance Next.js web development for modern businesses."
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Nexotar",
              "url": "https://nexotar.com/"
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SmoothScroll>
            <Header />
            {children}
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}