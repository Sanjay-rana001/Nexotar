"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const WHATS_INCLUDED = [
  { icon: "design_services", title: "Custom Website Design", body: "Unique, modern and tailored to your brand." },
  { icon: "smartphone", title: "Mobile Responsive Layout", body: "Perfect look and performance on all devices." },
  { icon: "mail", title: "Contact Form Setup", body: "Fully functional contact forms to connect with your visitors." },
  { icon: "speed", title: "Speed Optimization", body: "Faster loading for a better user experience and higher rankings." },
  { icon: "search", title: "Basic SEO Setup", body: "On-page SEO essentials to help your site get found." },
  { icon: "language", title: "Domain & Hosting Guidance", body: "Expert help to choose the right domain and hosting." },
  { icon: "rocket_launch", title: "Launch Assistance", body: "We handle the final setup and go live with confidence." },
  { icon: "support_agent", title: "Post-Launch Support", body: "Reliable support even after your website goes live." },
];

const WEBSITE_FEATURES = [
  { icon: "devices", title: "Responsive Design", body: "Looks perfect on all devices: desktops, tablets, and smartphones." },
  { icon: "web_asset", title: "Modern UI/UX", body: "Clean, modern design that provides an intuitive and engaging experience." },
  { icon: "bolt", title: "Fast Loading Speed", body: "Optimized for performance to ensure faster loading and better results." },
  { icon: "find_in_page", title: "SEO Friendly Structure", body: "Built with SEO best practices to help your website rank higher on search engines." },
  { icon: "route", title: "Easy Navigation", body: "Clear structure and smooth navigation to help visitors find what they need." },
  { icon: "ads_click", title: "Conversion Focused", body: "Strategic layout designed to turn visitors into customers and leads." },
  { icon: "security", title: "Secure Framework", body: "Built with security in mind to protect your website and your users." },
  { icon: "monitoring", title: "Scalable Design", body: "Flexible and scalable structure that grows with your business needs." },
];

const WHY_INVEST = [
  { icon: "handshake", title: "Build Trust", body: "A professional website builds credibility and helps people trust your business." },
  { icon: "visibility", title: "Increase Visibility", body: "Get found by more people on search engines and expand your reach online." },
  { icon: "group_add", title: "Generate More Leads", body: "Turn visitors into leads with clear calls-to-action and optimized user journeys." },
  { icon: "sentiment_very_satisfied", title: "Improve Experience", body: "Provide a seamless and enjoyable experience that keeps visitors coming back." },
  { icon: "workspace_premium", title: "Strengthen Your Brand", body: "Showcase your brand identity and stand out from the competition." },
  { icon: "star", title: "Better First Impressions", body: "Your website is often the first interaction—make it count and leave a lasting impact." },
  { icon: "emoji_events", title: "Stay Competitive Online", body: "A modern website keeps you ahead of competitors and relevant in your industry." },
  { icon: "trending_up", title: "Support Business Growth", body: "A strong website lays the foundation for scaling your business and achieving long-term success." },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function ServicesPage() {
  return (
    <div className="relative overflow-hidden pt-24 pb-20">
      <div className="fixed inset-0 -z-10 pointer-events-none aurora opacity-40" />

      {/* Hero Section */}
      <section className="py-20 relative">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display-lg text-5xl md:text-7xl mb-6 bg-gradient-to-br from-black to-black/60 dark:from-white dark:to-white/60 bg-clip-text text-transparent">
              Elevate Your Digital Presence
            </h1>
            <p className="text-xl text-[var(--color-on-surface-variant)] max-w-2xl mx-auto mb-10">
              We provide end-to-end web design and development solutions crafted to grow your business, build trust, and drive conversions.
            </p>
            <Link href="/#contact" className="inline-flex items-center gap-2 bg-[var(--color-primary-container)] text-white font-bold px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(0,112,243,0.3)] hover:shadow-[0_0_50px_rgba(0,112,243,0.5)] transition-all transform hover:-translate-y-1">
              Start Your Project <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 relative">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">What's Included</h2>
            <p className="text-lg text-[var(--color-on-surface-variant)]">Everything you need to launch a professional website.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHATS_INCLUDED.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex gap-4 p-6 rounded-2xl bg-[var(--color-surface-container-low)] border border-black/5 dark:border-white/5 hover:border-[var(--color-primary-container)]/30 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary-container)]/10 flex-shrink-0 flex items-center justify-center text-[var(--color-primary-container)] group-hover:bg-[var(--color-primary-container)] group-hover:text-white transition-colors">
                  <Icon name={item.icon} className="text-[24px]" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Website Features / What Makes Us Different */}
      <section className="py-24 relative bg-[var(--color-surface-container-lowest)] border-y border-black/5 dark:border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Website Features</h2>
            <p className="text-lg text-[var(--color-on-surface-variant)]">Powerful features to deliver a great experience and grow your business.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WEBSITE_FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-3xl backdrop-blur-sm bg-white/40 dark:bg-black/40 border border-black/10 dark:border-white/10 hover:border-purple-500/50 hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                  <Icon name={feature.icon} className="text-[32px]" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">{feature.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Invest */}
      <section className="py-24 relative">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ff5722]/10 border border-[#ff5722]/20 rounded-full mb-6">
              <span className="text-[#ff5722] text-sm font-semibold tracking-wide uppercase">The ROI</span>
            </div>
            <h2 className="font-display text-4xl font-bold mb-4">Why Invest In A Professional Website?</h2>
            <p className="text-lg text-[var(--color-on-surface-variant)]">A website is not an expense; it's an investment in your business's future.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_INVEST.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-8 rounded-2xl bg-[var(--color-surface-container-low)] border border-black/5 dark:border-white/5 overflow-hidden group hover:-translate-y-1 transition-transform"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 font-display text-6xl font-black text-[#ff5722] group-hover:scale-110 group-hover:opacity-20 transition-all">
                  0{i + 1}
                </div>
                <div className="w-12 h-12 flex items-center justify-center text-[#ff5722] mb-6">
                  <Icon name={reason.icon} className="text-[40px]" />
                </div>
                <h3 className="font-display text-lg font-bold mb-3 relative z-10">{reason.title}</h3>
                <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed relative z-10">{reason.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-br from-[var(--color-primary-container)] to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Transform Your Business?</h2>
              <p className="text-white/80 text-lg mb-10">
                Let's build a website that not only looks stunning but actually drives results.
              </p>
              <Link href="/#contact" className="inline-flex items-center gap-2 bg-white text-black font-bold px-10 py-4 rounded-xl shadow-xl hover:bg-gray-100 transition-colors transform hover:-translate-y-1">
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
