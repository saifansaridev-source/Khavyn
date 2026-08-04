import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ShieldCheck, FileText, Truck, RotateCw, XCircle, CreditCard, ChevronRight } from "lucide-react";

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

const POLICIES_NAV = [
  { slug: "privacy", label: "Privacy Policy", icon: ShieldCheck },
  { slug: "terms", label: "Terms & Conditions", icon: FileText },
  { slug: "shipping", label: "Shipping & Delivery", icon: Truck },
  { slug: "returns", label: "Return & Exchange Policy", icon: RotateCw },
  { slug: "cancellation", label: "Cancellation Policy", icon: XCircle },
  { slug: "payment", label: "Payment Policy", icon: CreditCard },
];

const POLICY_CONTENT: Record<string, { title: string; date: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    date: "Effective Date: August 1, 2026",
    sections: [
      {
        heading: "1. Corporate Commitment & Data Scope",
        body: "KHAVYN FASHION PRIVATE LIMITED ('KHAVYN', 'We', 'Us', or 'Our') respects your privacy and is committed to protecting your personal data in strict compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) Act. This Privacy Policy governs your access to www.khavyn.com.",
      },
      {
        heading: "2. Personal Information Collected",
        body: "We collect information you explicitly provide when placing an order, creating an account, or communicating with our Concierge: full name, shipping address, email address, phone number, and payment preferences strictly to process orders, facilitate 50% Partial COD advance payments via Razorpay, deliver shipments, and send order updates.",
      },
      {
        heading: "3. Payment Credential Security",
        body: "Your sensitive financial credentials (Credit Card/Debit Card numbers, CVV, Netbanking passwords, UPI PINs) are processed directly through Razorpay's PCI-DSS Level 1 certified secure payment gateway with 256-bit SSL encryption. KHAVYN never stores or logs raw credit card numbers or banking secrets on its servers.",
      },
      {
        heading: "4. Data Sharing & Third Parties",
        body: "We do not sell, rent, trade, or monetize your personal information to third-party ad networks. Customer data is shared exclusively with our contracted courier partners (Blue Dart, Delhivery, Expressbees) solely for shipment dispatch and doorstep fulfillment.",
      },
      {
        heading: "5. Your Rights & Data Rectification",
        body: "You have the right to request access to, correction of, or complete deletion of your personal account data stored on KHAVYN servers. To submit a data erasure request, please email privacy@khavyn.com.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    date: "Effective Date: August 1, 2026",
    sections: [
      {
        heading: "1. Ownership & Binding Agreement",
        body: "Welcome to www.khavyn.com, operated by KHAVYN FASHION PRIVATE LIMITED (GSTIN: 27AAMCK8767F1ZW, CIN: U74999PN2022PTC212345, Registered Office: Samarth Nagar, New Sangavi, Pune – 411027, Maharashtra). By browsing or purchasing from KHAVYN, you agree to be bound by these legal Terms and Conditions.",
      },
      {
        heading: "2. Intellectual Property Rights",
        body: "All content, garment designs, logo monograms, photography, 360-degree spin assets, brand trademarks, and website code are the exclusive intellectual property of KHAVYN FASHION PRIVATE LIMITED. Any unauthorized reproduction or distribution is strictly prohibited.",
      },
      {
        heading: "3. Product Pricing & Taxes",
        body: "All prices on KHAVYN are listed in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST). We reserve the right to modify prices, update catalog specifications, or discontinue products without prior notice.",
      },
      {
        heading: "4. Partial COD Financial Obligations",
        body: "Orders placed under our Partial COD facility require a non-refundable 50% advance payment processed via Razorpay. The remaining 50% balance must be paid in cash or UPI directly to the delivery representative upon parcel receipt.",
      },
      {
        heading: "5. Jurisdiction & Legal Dispute Resolution",
        body: "Any legal dispute, claim, or controversy arising out of or relating to transactions on www.khavyn.com shall be governed by the laws of India and subject to the exclusive jurisdiction of the competent courts in Pune, Maharashtra, India.",
      },
    ],
  },
  shipping: {
    title: "Shipping & Delivery Policy",
    date: "Effective Date: August 1, 2026",
    sections: [
      {
        heading: "1. Coverage & Delivery Network",
        body: "KHAVYN provides nationwide coverage across 26,000+ pincodes in India through premier express courier logistics partners including Blue Dart, Delhivery, and Xpressbees.",
      },
      {
        heading: "2. Shipping Rates & Thresholds",
        body: "Orders totaling ₹2,499 or more qualify for Complimentary Express Shipping anywhere in India. For orders below ₹2,499, a flat shipping fee of ₹150 is applied at checkout.",
      },
      {
        heading: "3. Dispatch & Manufacturing Timelines",
        body: "Standard dispatch timeline for Formal Shirts is 1–2 business days. Polo T-Shirts, Oversized T-Shirts, and Round Neck T-Shirts dispatch within 2–4 business days following quality inspection.",
      },
      {
        heading: "4. Real-Time Order Tracking",
        body: "Once your shipment leaves our Pune fulfillment warehouse, a unique AWB tracking link is dispatched via SMS and Email to monitor live location status.",
      },
      {
        heading: "5. Estimated Delivery Windows",
        body: "Metro Cities: 2–3 business days post-dispatch. Rest of India: 3–5 business days. Remote regions: 5–7 business days.",
      },
    ],
  },
  returns: {
    title: "Return & Exchange Policy",
    date: "Effective Date: August 1, 2026",
    sections: [
      {
        heading: "1. 3-Day Inspection & Exchange Window",
        body: "We offer a 3-day exchange window from the date of delivery. If your KHAVYN garment requires a size adjustment or has a manufacturing defect, you may initiate a exchange through your Account Portal.",
      },
      {
        heading: "2. Condition Requirements for Acceptance",
        body: "To be eligible for exchange or refund, items must be unworn, unwashed, unaltered, free of perfume/stains, and returned in their original KHAVYN box with all woven labels and tags intact.",
      },
      {
        heading: "3. Quality Inspection Protocol",
        body: "All returned parcels undergo a 14-point physical inspection at our Pune facility. Returns showing signs of wear, laundering, or missing tags will be returned to the customer at their expense.",
      },
      {
        heading: "4. Reverse Pickup & Shipping",
        body: "Complimentary reverse pickup is arranged by KHAVYN for size exchange requests. Our courier partner will collect the parcel within 48 hours of approval.",
      },
      {
        heading: "5. Refund Timeline",
        body: "Upon quality approval, store credit or direct bank refund is processed within 5–7 business days to the original payment source.",
      },
    ],
  },
  cancellation: {
    title: "Cancellation Policy",
    date: "Effective Date: August 1, 2026",
    sections: [
      {
        heading: "1. Pre-Dispatch Order Cancellation",
        body: "You may cancel your order free of cost prior to dispatch directly from your Account Portal or by contacting our Concierge at care@khavyn.com.",
      },
      {
        heading: "2. Post-Dispatch Cancellation Restrictions",
        body: "Once an order has been handed over to the courier partner and an AWB tracking code has been issued, it cannot be cancelled in transit.",
      },
      {
        heading: "3. Partial COD Advance Forfeiture",
        body: "For Partial COD orders, the 50% advance payment is non-refundable if the customer refuses parcel acceptance at their doorstep without documented physical defect proof.",
      },
      {
        heading: "4. Account Restriction for Fraudulent Refusals",
        body: "KHAVYN reserves the right to restrict Partial COD privileges for user accounts exhibiting repeated door-step delivery rejections.",
      },
    ],
  },
  payment: {
    title: "Payment Policy",
    date: "Effective Date: August 1, 2026",
    sections: [
      {
        heading: "1. Supported Online Payment Gateways",
        body: "KHAVYN partners with Razorpay Payment Gateway to process transactions via Credit Cards (Visa, Mastercard, RuPay, Amex), Netbanking (50+ banks), UPI (Google Pay, PhonePe, Paytm, BHIM), and Digital Wallets.",
      },
      {
        heading: "2. Dual Payment Options (Prepaid vs. Partial COD)",
        body: "Customers may choose 100% Full Prepaid payment or 50% Partial COD (where 50% is paid online as advance and 50% cash is paid to courier upon delivery).",
      },
      {
        heading: "3. Encryption & 3D Secure Protection",
        body: "All online transactions are protected by 256-bit SSL certificates and mandatory 3D Secure OTP verification from your issuing bank.",
      },
      {
        heading: "4. Payment Failure Resolution",
        body: "If funds are debited during a failed transaction, Razorpay automatically initiates an auto-reversal to your account within 3–5 business days.",
      },
    ],
  },
};

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = POLICY_CONTENT[slug];

  if (!policy) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      {/* Header Banner */}
      <div className="bg-[#1A1A1A] text-white py-12 px-4 text-center border-b border-[#C6A664]/30">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C6A664] font-semibold">
          KHAVYN LEGAL GOVERNANCE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
          {policy.title}
        </h1>
        <p className="text-xs text-[#C6A664]/80 mt-2 font-mono">{policy.date}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Navigation Sidebar */}
          <aside className="lg:col-span-4 space-y-3">
            <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-xl p-5 space-y-2 sticky top-24 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#1A1A1A] border-b border-[#D8C9B0]/40 pb-3 mb-2">
                Legal & Governance Index
              </h3>
              {POLICIES_NAV.map((nav) => {
                const Icon = nav.icon;
                const isActive = nav.slug === slug;
                return (
                  <Link
                    key={nav.slug}
                    href={`/policies/${nav.slug}`}
                    className={`flex items-center justify-between p-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? "bg-[#1A1A1A] text-[#C6A664] shadow-md"
                        : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2] hover:text-[#1A1A1A]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#C6A664]" : "text-[#1A1A1A]/50"}`} />
                      <span>{nav.label}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? "text-[#C6A664]" : "text-[#1A1A1A]/30"}`} />
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Right Policy Document Body */}
          <main className="lg:col-span-8 space-y-6">
            {policy.sections.map((sec, idx) => (
              <div
                key={idx}
                className="bg-[#F5F3EF] border border-[#D8C9B0]/50 p-6 sm:p-8 rounded-xl shadow-sm space-y-3"
              >
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A] border-b border-[#D8C9B0]/30 pb-2">
                  {sec.heading}
                </h3>
                <p className="text-sm text-[#1A1A1A]/85 leading-relaxed font-light">
                  {sec.body}
                </p>
              </div>
            ))}

            <div className="bg-[#1A1A1A] text-white p-6 rounded-xl border border-[#C6A664]/30 text-center space-y-2">
              <p className="text-xs font-semibold text-[#C6A664]">KHAVYN FASHION PRIVATE LIMITED</p>
              <p className="text-[11px] text-white/60">
                GSTIN: 27AAMCK8767F1ZW • Registered Office: Samarth Nagar, New Sangavi, Pune – 411027, Maharashtra
              </p>
              <p className="text-[11px] text-white/40 pt-1">
                For questions regarding this policy, email <a href="mailto:legal@khavyn.com" className="text-[#C6A664] hover:underline">legal@khavyn.com</a>
              </p>
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}
