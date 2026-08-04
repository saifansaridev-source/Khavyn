"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const faqs = [
  {
    q: "What is KHAVYN's exchange policy?",
    a: "We offer a 3-day exchange window from the date of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached. Initiate your exchange request from your account portal.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery within India takes 4–7 business days. Express delivery (2–3 days) is available for select pin codes. International orders to UAE, UK, and US ship within 10–14 business days.",
  },
  {
    q: "Is there a Cash on Delivery option?",
    a: "Yes. KHAVYN offers a Partial COD option where you pay 50% online and the remaining balance on delivery. Full prepaid orders receive priority shipping.",
  },
  {
    q: "How do I care for my KHAVYN garments?",
    a: "Machine wash cold on gentle cycle. Dry in shade — avoid tumble drying. Iron on medium heat with a damp cloth between iron and fabric. Our bio-washed cotton actually improves softness with gentle washes.",
  },
  {
    q: "Do you offer bulk/corporate orders?",
    a: "Absolutely. We work with companies looking to outfit their teams in premium KHAVYN formal shirts and polos. Contact us directly for bulk pricing, custom embroidery, and branded packaging options.",
  },
  {
    q: "Where are KHAVYN garments manufactured?",
    a: "All KHAVYN garments are designed with European proportions and manufactured in our partner facility in Sangavi, Pune, Maharashtra — under strict 14-point quality control.",
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1800));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* PAGE HEADER */}
      <section className="bg-[#1A1A1A] py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, #C6A664 39px, #C6A664 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #C6A664 39px, #C6A664 40px)"
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-[#C6A664]/60" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C6A664]">
              Get in Touch
            </span>
            <div className="h-px w-10 bg-[#C6A664]/60" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
            Contact Us
          </h1>
          <p className="text-sm text-white/60 font-light leading-relaxed">
            Our concierge team is available to assist you with any questions about your order, sizing, or the KHAVYN experience.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* LEFT — Info & Channels */}
            <div className="lg:col-span-2 space-y-10">
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                  Our Concierge Channels
                </h2>
                <div className="h-px w-12 bg-gradient-to-r from-[#C6A664] to-transparent" />

                <div className="space-y-5">
                  <a
                    href="mailto:care@khavyn.com"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#C6A664]/20 transition-colors">
                      <Mail className="w-4 h-4 text-[#C6A664]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-medium">Email</p>
                      <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#C6A664] transition-colors">care@khavyn.com</p>
                      <p className="text-[11px] text-[#1A1A1A]/50 font-light mt-0.5">Response within 4–6 hours</p>
                    </div>
                  </a>

                  <a
                    href="tel:+917841000001"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#C6A664]/20 transition-colors">
                      <Phone className="w-4 h-4 text-[#C6A664]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-medium">Phone / WhatsApp</p>
                      <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#C6A664] transition-colors">+91 78410 00001</p>
                      <p className="text-[11px] text-[#1A1A1A]/50 font-light mt-0.5">Mon–Sat, 10 AM – 7 PM IST</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-[#C6A664]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-medium">Registered Office</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">KHAVYN Fashion Private Limited</p>
                      <p className="text-[11px] text-[#1A1A1A]/60 font-light mt-0.5 leading-relaxed">
                        Samarth Nagar, New Sangavi,<br />
                        Pune – 411027, Maharashtra, India<br />
                        GST: 27AAMCK8767F1ZW
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-[#C6A664]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-medium">Business Hours</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">Monday – Saturday</p>
                      <p className="text-[11px] text-[#1A1A1A]/60 font-light mt-0.5">10:00 AM – 7:00 PM IST</p>
                      <p className="text-[11px] text-[#1A1A1A]/40 font-light mt-0.5">Closed on national holidays</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#D8C9B0]/40" />

              {/* Quick Links */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Quick Self-Service
                </p>
                <div className="space-y-2">
                  {[
                    { href: "/account", label: "Track Your Order" },
                    { href: "/account", label: "Initiate Exchange / Return" },
                    { href: "/policies/shipping", label: "Shipping Information" },
                    { href: "/policies/returns", label: "Return & Exchange Policy" },
                  ].map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="flex items-center justify-between py-2 border-b border-[#D8C9B0]/30 text-xs text-[#1A1A1A]/70 hover:text-[#C6A664] transition-colors group"
                    >
                      <span>{l.label}</span>
                      <span className="text-[#D8C9B0] group-hover:text-[#C6A664] transition-colors">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-5 bg-[#F5F3EF] rounded-lg border border-[#D8C9B0]/40 p-10">
                  <CheckCircle2 className="w-14 h-14 text-[#C6A664] stroke-[1]" />
                  <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Message Received</h3>
                  <p className="text-sm text-[#1A1A1A]/65 leading-relaxed max-w-xs font-light">
                    Thank you for reaching out to the KHAVYN Concierge. Our team will respond to your enquiry within 4–6 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormState({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                    className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#C6A664] hover:text-[#1A1A1A] transition-colors border-b border-[#C6A664] pb-0.5"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="bg-[#F5F3EF] rounded-lg border border-[#D8C9B0]/40 p-8 sm:p-10">
                  <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-1">
                    Send Us a Message
                  </h2>
                  <p className="text-xs text-[#1A1A1A]/55 font-light mb-8">
                    Fill in the form below and our concierge will respond within 4–6 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Arjun Mehta"
                          className="w-full bg-white border border-[#D8C9B0]/60 rounded px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#C6A664] transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          placeholder="you@email.com"
                          className="w-full bg-white border border-[#D8C9B0]/60 rounded px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#C6A664] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                          Phone (optional)
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          placeholder="+91 98XXX XXXXX"
                          className="w-full bg-white border border-[#D8C9B0]/60 rounded px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#C6A664] transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                          Subject *
                        </label>
                        <select
                          id="contact-subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          required
                          className="w-full bg-white border border-[#D8C9B0]/60 rounded px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#C6A664] transition-colors appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Select a subject</option>
                          <option value="order">Order Inquiry</option>
                          <option value="exchange">Exchange / Return</option>
                          <option value="sizing">Sizing Assistance</option>
                          <option value="bulk">Bulk / Corporate Order</option>
                          <option value="payment">Payment Issue</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Describe your enquiry in detail..."
                        className="w-full bg-white border border-[#D8C9B0]/60 rounded px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#C6A664] transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 bg-[#1A1A1A] text-white hover:bg-[#C6A664] disabled:opacity-60 disabled:cursor-not-allowed px-8 py-4 rounded text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#F0E9DD] border-t border-[#D8C9B0]/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C6A664]">
              Common Questions
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">
              Frequently Asked Questions
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C6A664] to-transparent mx-auto" />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-[#D8C9B0]/40 rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-sm font-medium text-[#1A1A1A] pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-[#C6A664] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#1A1A1A]/40 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-[#D8C9B0]/30">
                    <p className="text-xs text-[#1A1A1A]/65 leading-relaxed font-light pt-4">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-xs text-[#1A1A1A]/50 font-light">
              Didn&apos;t find your answer?{" "}
              <a href="mailto:care@khavyn.com" className="text-[#C6A664] hover:underline font-medium">
                Email our concierge
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
