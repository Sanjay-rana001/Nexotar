"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    websiteType: "",
    budget: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!db) {
        throw new Error("Firebase is not initialized properly.");
      }

      await addDoc(collection(db, "leads"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      // Send to Telegram via our secure API route
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Telegram API route returned an error:", errorData);
          // Optional: throw new Error("Failed to send to Telegram");
        }
      } catch (tgError) {
        console.error("Failed to send Telegram notification:", tgError);
        // We don't fail the whole submission just because Telegram failed
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", websiteType: "", budget: "" });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong. Please try again or reach out on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 sm:py-3.5 text-[15px] sm:text-base rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]/40 focus:border-[var(--color-primary-container)] transition-all duration-300 placeholder:text-black/30 dark:placeholder:text-white/30 hover:border-black/20 dark:hover:border-white/20";
  const labelClasses = "block text-sm font-semibold text-[var(--color-on-surface-variant)] mb-2 ml-1";

  return (
    <div className="relative rounded-3xl p-8 sm:p-10 backdrop-blur-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/60 shadow-2xl h-full transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,112,243,0.15)] hover:-translate-y-1">
      
      {/* Subtle background glow for eye-catching effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-container)]/10 rounded-full blur-[50px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-secondary-fixed-dim)]/10 rounded-full blur-[50px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center h-full min-h-[350px] relative z-10"
          >
            <div className="w-16 h-16 rounded-full bg-[#1a8c4a]/10 flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-[#1a8c4a]" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3">Message Received!</h3>
            <p className="text-[var(--color-on-surface-variant)] text-base max-w-[250px]">
              Thanks {formData.name || "friend"}. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-8 px-6 py-2.5 rounded-full bg-black/5 dark:bg-white/5 text-sm font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6 relative z-10"
          >
            <div>
              <label htmlFor="name" className={labelClasses}>
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Sanjay Rana"
                className={inputClasses}
              />
            </div>

            <div className="flex gap-4 sm:gap-6">
              <div className="w-[60%]">
                <label htmlFor="email" className={labelClasses}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sanjay.rana@example.com"
                  className={inputClasses}
                />
              </div>

              <div className="w-[40%]">
                <label htmlFor="phone" className={labelClasses}>
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="websiteType" className={labelClasses}>
                  Project Type
                </label>
                <div className="relative">
                  <select
                    id="websiteType"
                    name="websiteType"
                    required
                    value={formData.websiteType}
                    onChange={handleChange}
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    <option className="bg-white dark:bg-zinc-900" value="" disabled>Select type...</option>
                    <option className="bg-white dark:bg-zinc-900" value="Landing Page">Landing Page</option>
                    <option className="bg-white dark:bg-zinc-900" value="E-commerce">E-commerce</option>
                    <option className="bg-white dark:bg-zinc-900" value="SaaS / Web App">SaaS / Web App</option>
                    <option className="bg-white dark:bg-zinc-900" value="Portfolio / Corporate">Portfolio / Corporate</option>
                    <option className="bg-white dark:bg-zinc-900" value="Custom">Custom</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="budget" className={labelClasses}>
                  Estimated Budget
                </label>
                <div className="relative">
                  <select
                    id="budget"
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={handleChange}
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    <option className="bg-white dark:bg-zinc-900" value="" disabled>Select budget...</option>
                    <option className="bg-white dark:bg-zinc-900" value="Under ₹20,000">Under ₹20,000</option>
                    <option className="bg-white dark:bg-zinc-900" value="₹20,000 - ₹50,000">₹20,000 - ₹50,000</option>
                    <option className="bg-white dark:bg-zinc-900" value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option className="bg-white dark:bg-zinc-900" value="₹1,00,000+">₹1,00,000+</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium px-1">{error}</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full flex items-center justify-center gap-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] text-base font-bold px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(0,112,243,0.2)] hover:shadow-[0_0_35px_rgba(0,112,243,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    Submit Request <Send className="w-4 h-4 ml-1 group-hover:animate-[rocket-bounce_0.6s_ease-in-out_infinite]" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
