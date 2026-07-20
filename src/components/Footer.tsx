"use client";

import { Phone } from "lucide-react";
import dynamic from "next/dynamic";

const ContactForm = dynamic(() => import("@/components/ContactForm").then(mod => mod.ContactForm));

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/5 py-4 bg-[var(--color-surface)] relative z-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Light mode logo */}
          <div className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 dark:hidden block">
            <img 
              src="/images/nexotar_logo_dark.png" 
              alt="Nexotar" 
              className="w-full h-full object-contain"
            />
          </div>
          {/* Dark mode logo */}
          <div className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 dark:block hidden">
            <img 
              src="/images/nexotar_logo.png" 
              alt="Nexotar" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="text-sm text-[var(--color-on-surface-variant)]">© 2024 Nexotar. All rights reserved.</div>
        <div className="flex gap-6 text-sm text-[var(--color-on-surface-variant)]">
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
          <button 
            onClick={() => {
              const modal = document.getElementById('contactModal') as HTMLDialogElement;
              if (modal) modal.showModal();
            }}
            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      <dialog 
        id="contactModal" 
        className="rounded-2xl p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm max-w-md w-full mx-auto border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-2xl"
      >
        <div className="p-8 relative">
          {/* Close button */}
          <button 
            onClick={() => {
              const modal = document.getElementById('contactModal') as HTMLDialogElement;
              if (modal) modal.close();
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-8">
            {/* Light mode logo in modal */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 dark:hidden block">
              <img 
                src="/images/nexotar_logo_dark.png" 
                alt="Nexotar" 
                className="w-full h-full object-contain"
              />
            </div>
            {/* Dark mode logo in modal */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 dark:block hidden">
              <img 
                src="/images/nexotar_logo.png" 
                alt="Nexotar" 
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-display text-2xl font-semibold text-black dark:text-white transition-colors duration-300">
              Contact Us
            </h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">Reach out to us via phone or WhatsApp</p>
          </div>

          <div className="space-y-4">
            {/* WhatsApp 1 */}
            <a 
              href="https://wa.me/917703988597" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-black/5 dark:border-white/5 hover:border-[#1a8c4a]/30 transition-all hover:bg-[#1a8c4a]/5 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#1a8c4a]/10 flex items-center justify-center flex-shrink-0">
                <WhatsAppIcon className="w-5 h-5 text-[#1a8c4a]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-[var(--color-on-surface-variant)]">WhatsApp Sanjay Rana</p>
                <p className="font-semibold text-[var(--color-on-surface)] group-hover:text-[#1a8c4a] transition-colors">
                  +91 77039 88597
                </p>
              </div>
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* WhatsApp 2 */}
            <a 
              href="https://wa.me/918178546141" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-black/5 dark:border-white/5 hover:border-[#1a8c4a]/30 transition-all hover:bg-[#1a8c4a]/5 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#1a8c4a]/10 flex items-center justify-center flex-shrink-0">
                <WhatsAppIcon className="w-5 h-5 text-[#1a8c4a]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-[var(--color-on-surface-variant)]">WhatsApp Nikhil Soni</p>
                <p className="font-semibold text-[var(--color-on-surface)] group-hover:text-[#1a8c4a] transition-colors">
                  +91 81785 46141
                </p>
              </div>
              <svg className="w-5 h-5 text-[var(--color-on-surface-variant)] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5 text-center">
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              We respond within 1 business day
            </p>
          </div>
        </div>
      </dialog>
    </footer>
  );
}
