import { Metadata } from 'next';
import ServicesClient from './services-client';

export const metadata: Metadata = {
  title: 'Web Development & AI Services | Nexotar',
  description: 'We offer full-stack development, SaaS architecture, UI/UX design, and AI integration services to build scalable digital products.',
  keywords: ['Full Stack Development Services', 'Hire AI Developers', 'Custom Web App Development', 'Tech Consulting', 'SaaS Development Company', 'UI/UX Design Agency'],
};

export default function ServicesPage() {
  return <ServicesClient />;
}
