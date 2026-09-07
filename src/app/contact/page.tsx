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

interface FAQItem {
  q: string;
  a: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    q: "What is KHAVYN's exchange policy?",
    a: (
      <span>
        We offer a 3-day exchange window from the date of delivery for unused, unworn, and unwashed garments with all original tags, labels, and packaging intact. Every returned piece undergoes a mandatory quality inspection at our atelier before an exchange shipment is dispatched. See our full{" "}
        <Link href="/policies/returns" className="text-[#C6A664] underline hover:text-[#1A1A1A] font-medium">
          Exchange Policy
        </Link>{" "}
        for details.
      </span>
    ),
  },
  {
    q: "How long does delivery take?",
    a: (
      <span>
        Orders are processed within 1–3 business days. Following dispatch, estimated transit times are 2–5 business days for Metro cities, 3–7 business days for Non-Metro regions, and 5–10 business days for remote or rural locations across India. Refer to our{" "}
        <Link href="/policies/shipping" className="text-[#C6A664] underline hover:text-[#1A1A1A] font-medium">
          Shipping & Delivery Policy
        </Link>{" "}
        for tracking details.
      </span>
    ),
  },
  {
    q: "Is there a Cash on Delivery option?",
    a: (
      <span>
        Yes, KHAVYN offers a Partial Cash on Delivery (COD) facility for eligible pin codes. Customers complete a 50% advance payment online at checkout, with the remaining 50% balance collected by our courier partner upon delivery. Full details are available in our{" "}
        <Link href="/policies/payment" className="text-[#C6A664] underline hover:text-[#1A1A1A] font-medium">
          Payment Policy
        </Link>.
      </span>
    ),
  },
  {
    q: "How do I care for my KHAVYN garments?",
    a: (
      <span>
        To preserve the rich texture and structure of our bio-washed combed cotton, machine wash cold on a gentle cycle or hand wash with mild detergent. Dry in the shade away from direct sunlight, avoid bleach or tumble drying, and iron on reverse for embroidered pieces.
      </span>
    ),
  },
  {
    q: "Do you offer bulk/corporate orders?",
    a: (
      <span>
        Yes. Our corporate concierge assists organizations with executive gifting, bespoke company uniforms, and bulk orders of our formal shirts and polo collections. Please contact our concierge desk directly at{" "}
        <a href="mailto:complaint.khavyn@gmail.com" className="text-[#C6A664] underline hover:text-[#1A1A1A] font-medium">
          complaint.khavyn@gmail.com
        </a>{" "}
        for custom quantities and embroidery specifications.
      </span>
    ),
  },
  {
    q: "Where are KHAVYN garments manufactured?",
    a: (
      <span>
        All KHAVYN garments are drafted with European architectural proportions and tailored at our dedicated production hub in Bangalore and Tripur, India. Every creation reflects our steadfast Make in India commitment and passes a 14-point checkpoint before earning the KHAVYN mark.
      </span>
    ),
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
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, #C6A664 39px, #C6A664 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #C6A664 39px, #C6A664 40px)",
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

      {/* MAIN CONTACT SECTION */}
      <section className="py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* LEFT — Info & Channels (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                  Our Concierge Channels
                </h2>
                <div className="h-px w-12 bg-gradient-to-r from-[#C6A664] to-transparent" />

                <div className="space-y-5">
                  <a
                    href="mailto:complaint@khavyn.com"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#C6A664]/20 transition-colors">
                      <Mail className="w-4 h-4 text-[#C6A664]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-medium">Email</p>
                      <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#C6A664] transition-colors">complaint.khavyn@gmail.com</p>
                      <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#C6A664] transition-colors">complaint@khavyn.com</p>
                      <p className="text-[11px] text-[#1A1A1A]/50 font-light mt-0.5">Response within 4–6 hours</p>
                    </div>
                  </a>

                  <a
                    href="tel:+919373205258"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#C6A664]/20 transition-colors">
                      <Phone className="w-4 h-4 text-[#C6A664]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-medium">Phone / WhatsApp</p>
                      <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#C6A664] transition-colors">+91-9373205258</p>
                      <p className="text-[11px] text-[#1A1A1A]/50 font-light mt-0.5">Mon–Sat, 10 AM – 7 PM IST</p>
                    </div>
                  </a>

                  <a href="https://share.google/LjPlIkzfZOwNMAwEU" target="_blank" rel="noreferrer" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#C6A664]/20 transition-colors">
                      <MapPin className="w-4 h-4 text-[#C6A664]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A]/50 font-medium">Registered Office</p>
                      <p className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#C6A664] transition-colors">KHAVYN</p>
                      <p className="text-[11px] text-[#1A1A1A]/60 font-light mt-0.5 leading-relaxed group-hover:text-[#C6A664]/80 transition-colors">
                        Sr No 80/16 Samarth Nagar, New Sangavi,<br />
                        Kavita Appt, Pimple Gurav, Haveli,<br />
                        Pune - 411061, Maharashtra<br />
                        GST: 27AAMCK8767F1ZW
                      </p>
                    </div>
                  </a>

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
            </div>

            {/* RIGHT — Contact Form (3 cols) */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-5 bg-[#F5F3EF] rounded-lg border border-[#D8C9B0]/40 p-10">
                  <CheckCircle2 className="w-14 h-14 text-[#C6A664] stroke-[1]" />
                  <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Message Received</h3>
                  <p className="text-sm text-[#1A1A1A]/65 leading-relaxed max-w-xs font-light">
                    Thank you for reaching out to the KHAVYN Concierge. Our team will respond to your enquiry within 4–6 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#C6A664] hover:text-[#1A1A1A] transition-colors border-b border-[#C6A664] pb-0.5"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="bg-[#F5F3EF] rounded-lg border border-[#D8C9B0]/40 p-8 sm:p-10 shadow-sm">
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

          {/* PART 10 FIX: Side-by-Side Map & Quick Self-Service Grid */}
          <div className="pt-8 border-t border-[#D8C9B0]/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* Column 1: Location Map */}
              <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-lg p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                      Registered Atelier Map
                    </p>
                    <a
                      href="https://share.google/LjPlIkzfZOwNMAwEU"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#C6A664] hover:underline font-medium"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                  <p className="text-xs text-[#1A1A1A]/60 font-light">
                    New Sangavi, Pune — 411061, Maharashtra
                  </p>
                </div>

                <div className="w-full h-56 rounded-md overflow-hidden border border-[#D8C9B0]/40 flex-1 min-h-[220px]">
                  <iframe
                    src="https://maps.google.com/maps?q=Sr+No+80/16+Samarth+Nagar,+New+Sangavi,+Pune,+Maharashtra&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Column 2: Quick Self-Service Links */}
              <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-lg p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                    Quick Self-Service Portal
                  </p>
                  <p className="text-xs text-[#1A1A1A]/60 font-light">
                    Instant access to order tracking, exchanges, and verified brand policies.
                  </p>
                </div>

                <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                  {[
                    { href: "/account", label: "Track Your Order", desc: "Real-time dispatch status via AWB tracking" },
                    { href: "/account", label: "Initiate Exchange / Return", desc: "Submit 3-day window exchange requests" },
                    { href: "/policies/shipping", label: "Shipping Information", desc: "Timelines across Metro and Non-Metro pincodes" },
                    { href: "/policies/returns", label: "Return & Exchange Policy", desc: "Review 14-point inspection criteria" },
                  ].map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="flex items-center justify-between p-3 rounded-md bg-white border border-[#D8C9B0]/40 text-xs text-[#1A1A1A]/80 hover:text-[#C6A664] hover:border-[#C6A664]/60 transition-all group shadow-2xs"
                    >
                      <div>
                        <span className="font-semibold block text-[#1A1A1A] group-hover:text-[#C6A664] transition-colors">
                          {l.label}
                        </span>
                        <span className="text-[10px] text-[#1A1A1A]/50 font-light">
                          {l.desc}
                        </span>
                      </div>
                      <span className="text-[#D8C9B0] group-hover:text-[#C6A664] group-hover:translate-x-0.5 transition-all text-sm font-bold">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION — Policy-Accurate Answers per Part 9 */}
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
                  <span className="text-sm font-semibold text-[#1A1A1A] pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-[#C6A664] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#1A1A1A]/40 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-[#D8C9B0]/30">
                    <p className="text-xs text-[#1A1A1A]/75 leading-relaxed font-light pt-4">
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
              <a href="mailto:complaint@khavyn.com" className="text-[#C6A664] hover:underline font-medium">
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
