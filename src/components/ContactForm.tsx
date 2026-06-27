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

      setIsSuccess(true);
      setFormData({ name: "", email: "", websiteType: "", budget: "" });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Something went wrong. Please try again or reach out on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative rounded-2xl p-6 backdrop-blur-md border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/70 shadow-lg h-full">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center h-full min-h-[300px]"
          >
            <div className="w-12 h-12 rounded-full bg-[#1a8c4a]/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-[#1a8c4a]" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Message Received!</h3>
            <p className="text-[var(--color-on-surface-variant)] text-sm">
              Thanks {formData.name || "friend"}. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-6 text-sm font-semibold text-[var(--color-primary-container)] hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-[var(--color-on-surface-variant)]">
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
                className="w-full px-3 py-2 text-sm rounded-lg border border-black/15 dark:border-white/15 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]/50 focus:border-[var(--color-primary-container)] transition-all placeholder:text-black/30 dark:placeholder:text-white/30"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[var(--color-on-surface-variant)]">
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
                className="w-full px-3 py-2 text-sm rounded-lg border border-black/15 dark:border-white/15 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]/50 focus:border-[var(--color-primary-container)] transition-all placeholder:text-black/30 dark:placeholder:text-white/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="websiteType" className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                  Project Type
                </label>
                <div className="relative">
                  <select
                    id="websiteType"
                    name="websiteType"
                    required
                    value={formData.websiteType}
                    onChange={handleChange}
                    className="w-full appearance-none px-3 py-2 text-sm rounded-lg border border-black/15 dark:border-white/15 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]/50 focus:border-[var(--color-primary-container)] transition-all"
                  >
                    <option value="" disabled>Select type...</option>
                    <option value="Landing Page">Landing Page</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="SaaS / Web App">SaaS / Web App</option>
                    <option value="Portfolio / Corporate">Portfolio / Corporate</option>
                    <option value="Custom">Custom</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="budget" className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                  Estimated Budget
                </label>
                <div className="relative">
                  <select
                    id="budget"
                    name="budget"
                    required
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full appearance-none px-3 py-2 text-sm rounded-lg border border-black/15 dark:border-white/15 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]/50 focus:border-[var(--color-primary-container)] transition-all"
                  >
                    <option value="" disabled>Select budget...</option>
                    <option value="Under ₹20,000">Under ₹20,000</option>
                    <option value="₹20,000 - ₹50,000">₹20,000 - ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000+">₹1,00,000+</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Submit Request <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
