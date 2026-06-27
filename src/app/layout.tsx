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

export const metadata: Metadata = {
  title: 'Nexotar — Building Modern Digital Experiences That Scale',
  description: 'Nexotar is a digital studio combining world-class engineering and AI to ship products that define the next generation of the web.',
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
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}