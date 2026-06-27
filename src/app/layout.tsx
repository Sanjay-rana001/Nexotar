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
    default: 'Nexotar | Building Modern Digital Experiences That Scale',
    template: '%s | Nexotar',
  },
  description: 'Nexotar is a digital studio combining world-class engineering and AI to ship products that define the next generation of the web. Web Dev, SaaS, AI integrations.',
  keywords: ['Web Development', 'SaaS', 'AI Integration', 'Digital Studio', 'Nexotar', 'React', 'Next.js', 'UI/UX Design', 'Software Agency'],
  authors: [{ name: 'Nexotar' }],
  creator: 'Nexotar',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexotar.com',
    title: 'Nexotar | Building Modern Digital Experiences That Scale',
    description: 'Nexotar is a digital studio combining world-class engineering and AI to ship products that define the next generation of the web.',
    siteName: 'Nexotar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexotar | Building Modern Digital Experiences That Scale',
    description: 'Nexotar is a digital studio combining world-class engineering and AI to ship products that define the next generation of the web.',
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