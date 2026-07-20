import { Metadata } from 'next';
import PortfolioClient from './portfolio-client';

export const metadata: Metadata = {
  title: 'Our Work & Portfolio | Nexotar',
  description: 'Explore our recent digital products, web development case studies, and SaaS projects. See how Nexotar builds modern digital experiences that scale.',
  keywords: ['Software Portfolio', 'Web Development Case Studies', 'SaaS Projects', 'UI/UX Design Work', 'Nexotar Projects', 'Custom App Development Examples'],
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
