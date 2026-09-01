import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ShieldCheck, FileText, Truck, RotateCw, XCircle, CreditCard, ChevronRight, Cookie } from "lucide-react";

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
  { slug: "cookie", label: "Cookie Policy", icon: Cookie },
];

const POLICY_CONTENT: Record<string, { title: string; date: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    date: "Effective Date: August 1, 2026",
    sections: [
      {
        heading: "1. Corporate Commitment & Data Scope",
        body: "KHAVYN ('We', 'Us', or 'Our') respects your privacy and is committed to protecting your personal data in strict compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) Act. This Privacy Policy governs your access to www.khavyn.com.",
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
        body: "Welcome to www.khavyn.com, operated by KHAVYN. By browsing or purchasing from KHAVYN, you agree to be bound by these legal Terms and Conditions.",
      },
      {
        heading: "2. Intellectual Property Rights",
        body: "All content, garment designs, logo monograms, photography, 360-degree spin assets, brand trademarks, and website code are the exclusive intellectual property of KHAVYN. Any unauthorized reproduction or distribution is strictly prohibited.",
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
        heading: "1. 7-Day Doorstep Exchange & Return Window",
        body: "We offer a 7-day return and exchange window from the date of delivery. If your KHAVYN garment requires a size adjustment or has any manufacturing issue, you may easily initiate a request through your Account Portal or by contacting Concierge.",
      },
      {
        heading: "2. Apparel Scope & Product Categories",
        body: "Our standard Return & Exchange policy applies exclusively to apparel items (Formal Shirts, Polo T-Shirts, Oversized T-Shirts, and Round Neck T-Shirts). Items must be unworn, unwashed, unaltered, free of fragrance/stains, and returned in original KHAVYN packaging with all tags attached. Future non-apparel capsules (such as accessories or footwear) may carry specific category terms.",
      },
      {
        heading: "3. Quality Inspection Protocol",
        body: "All returned parcels undergo a standard physical inspection at our Pune fulfillment center. Items meeting eligibility criteria are approved within 24–48 hours of receipt.",
      },
      {
        heading: "4. Complimentary Reverse Pickup",
        body: "Complimentary reverse pickup is arranged nationwide across supported pincodes through our logistics partners. Our courier partner collects the parcel within 24–48 hours of request approval.",
      },
      {
        heading: "5. Refund & Exchange Fulfillment Timeline",
        body: "Upon inspection approval, size replacement shipments dispatch within 2 business days. For return refunds, credit is processed within 5–7 business days to the original payment source or KHAVYN store credit as preferred.",
      },
    ],
  },
  cancellation: {
    title: "Cancellation Policy",
    date: "Effective Date: September 1, 2026",
    sections: [
      {
        heading: "1. Customer-Initiated Cancellation",
        body: "Customers may request cancellation of an order only before the order has entered processing, packing, or shipment. Cancellation requests may be submitted through your account on www.khavyn.com (where available), by emailing complaint.khavyn@gmail.com, or by contacting Customer Care at +91-9373205258. Once an order has entered processing, packing, or has been dispatched, it cannot be cancelled. Any request after dispatch shall be governed by KHAVYN’s Return & Refund Policy, where applicable.",
      },
      {
        heading: "2. Cancellation After Shipment",
        body: "Once an order has been dispatched from our warehouse, it cannot be cancelled. Customers who no longer wish to keep a delivered product may submit a return request only if the product qualifies under KHAVYN’s Return & Refund Policy. Submission of a return request does not guarantee acceptance, and all requests are subject to eligibility, verification, and quality inspection.",
      },
      {
        heading: "3. Partial Cash on Delivery (COD) Orders",
        body: "KHAVYN offers Partial Cash on Delivery (COD) for eligible orders. Under this payment option: 50% of the total order value must be paid in advance at the time of placing the order. The remaining 50% is payable at the time of delivery. Customers selecting Partial COD are requested to place orders only if they genuinely intend to complete the purchase. KHAVYN reserves the right to cancel suspicious, fraudulent, duplicate, or unverifiable Partial COD orders; restrict, suspend, or permanently disable the Partial COD facility for customers who repeatedly refuse deliveries, misuse the facility, or violate KHAVYN policies; or require full prepaid payment for future purchases at its sole discretion.",
      },
      {
        heading: "4. Cancellation by KHAVYN",
        body: "KHAVYN reserves the right to cancel any order, in whole or in part, without prior notice, under circumstances including but not limited to: Product becoming unavailable or out of stock; Pricing, technical, or typographical errors; Duplicate orders; Incorrect product information; Failure of payment authorization or verification; Failure to receive the required advance payment for eligible Partial COD orders; Suspected fraudulent or unauthorized transactions; Violation of our Terms & Conditions or other published policies; Delivery address being incomplete, incorrect, or non-serviceable; Force majeure events including natural disasters, strikes, transportation disruptions, government restrictions, pandemics, or other events beyond KHAVYN’s reasonable control. Where payment has already been received for an order cancelled by KHAVYN, an appropriate refund will be processed in accordance with this Policy.",
      },
      {
        heading: "5. Refund for Cancelled Orders",
        body: "If an order is cancelled before it enters processing or shipment: Prepaid Orders: The full amount paid, including applicable taxes, will be refunded to the original payment method. Partial COD Orders: The 50% advance payment will be refunded to the original payment method, provided the cancellation request is approved and received before the order enters processing, packing, or shipment. If a customer refuses delivery of a dispatched Partial COD order without a valid reason or otherwise breaches this Cancellation Policy, KHAVYN reserves the right to retain or deduct all or part of the advance payment towards shipping, return shipping, packaging, payment gateway charges, and other reasonable operational costs, to the extent permitted by applicable law and in accordance with our Payment Policy. Approved refunds are generally processed within 7 to 10 business days.",
      },
      {
        heading: "6. Modification of Orders",
        body: "Customers may request modifications relating to Product, Size, Colour, Quantity, Shipping Address, Billing Address, or Contact Details, only before the order enters processing. Once an order has entered processing, packing, or shipment, modifications cannot be guaranteed. For Partial COD orders, if an approved modification changes the order value, the advance payment may need to be adjusted before the order is processed. KHAVYN will make reasonable efforts to accommodate modification requests but does not guarantee that all requests can be fulfilled.",
      },
      {
        heading: "7. Promotional and Limited Edition Orders",
        body: "Orders placed during Product launches, Limited edition collections, Exclusive releases, Festival campaigns, Flash sales, Clearance events, or Special promotional campaigns may not be eligible for cancellation once confirmed due to limited inventory, operational requirements, or high order volumes.",
      },
      {
        heading: "8. Abuse of the Cancellation Policy",
        body: "KHAVYN reserves the right to refuse service, suspend customer accounts, cancel future orders, restrict available payment methods, or take any other appropriate action if a customer is found to have repeatedly cancelled confirmed orders without reasonable cause, misused promotional offers or discount benefits, placed fraudulent, fake, or speculative orders, repeatedly refused delivery without a valid reason, misused the Partial COD facility, submitted false information, or engaged in activities that adversely affect KHAVYN, its operations, employees, logistics partners, or other customers.",
      },
      {
        heading: "9. Relationship with Other Policies",
        body: "This Cancellation Policy should be read together with KHAVYN’s Terms & Conditions, Payment Policy, Shipping & Delivery Policy, Return & Refund Policy, Exchange Policy, Warranty & Product Care Policy, and Privacy Policy. In the event of any inconsistency, the policy specifically governing the relevant subject matter shall prevail to the extent of such inconsistency.",
      },
      {
        heading: "10. Contact Us",
        body: "For cancellation requests or assistance, please contact: KHAVYN Fashion Private Limited Customer Care: +91-9373205258 | Email: complaint.khavyn@gmail.com | Registered Office: Sr. No. 80/16, Kavita Apartment, Samarth Nagar, New Sangavi, Pune – 411027, Maharashtra, India.",
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
  cookie: {
    title: "Cookie Policy",
    date: "Effective Date: August 1, 2026",
    sections: [
      {
        heading: "1. What Are Cookies?",
        body: "Cookies are small text files that are stored on your computer, mobile device, or other internet-enabled device when you visit a website. They help websites function efficiently, remember your preferences, improve performance, and provide a more personalized browsing experience. Cookies generally do not contain information that directly identifies you. However, they may be linked to information you provide to us or information collected through your use of our website.",
      },
      {
        heading: "2. Types of Cookies We Use",
        body: "a. Essential Cookies: These cookies are necessary for the proper operation of our website and cannot be disabled in our systems. They help us maintain secure login sessions, enable shopping cart functionality, process orders and payments, prevent fraudulent activity, protect website security, and ensure basic website functionality. b. Performance and Analytics Cookies: These cookies help us understand how visitors interact with our website. They may collect information such as pages visited, time spent on pages, navigation patterns, website performance, error reports, and device and browser information. c. Functional Cookies: These cookies remember your preferences to provide a more convenient browsing experience (e.g., preferred language, region, saved cart, recently viewed). d. Marketing and Advertising Cookies: With your consent, these cookies may be used to display relevant advertisements, measure advertising effectiveness, limit repeated advertisements, show personalized product recommendations, and support remarketing campaigns.",
      },
      {
        heading: "3. Third-Party Cookies",
        body: "Our website may use cookies provided by trusted third-party service providers, including those that support payment processing, website analytics, marketing campaigns, customer support, social media integration, and security and fraud prevention. These third parties manage their own cookies in accordance with their respective privacy policies.",
      },
      {
        heading: "4. Information Collected Through Cookies",
        body: "Cookies may collect information such as IP Address, browser type and version, device information, operating system, referring website, pages visited, date and time of visits, session duration, clickstream data, shopping cart information, and general geographic location derived from your IP address. Where required by applicable law, this information is processed in accordance with our Privacy Policy.",
      },
      {
        heading: "5. Managing Cookies",
        body: "Most web browsers allow you to view stored cookies, delete cookies, block cookies, configure cookie preferences, and receive notifications before cookies are stored. Please note that disabling certain cookies may affect the availability or functionality of some features on our website, including shopping cart, checkout, account login, and personalized services.",
      },
      {
        heading: "6. Cookie Retention",
        body: "Some cookies remain active only during your browsing session and are automatically deleted when you close your browser. Other cookies may remain on your device for a longer period to remember your preferences or improve future visits. The retention period varies depending on the type and purpose of the cookie.",
      },
      {
        heading: "7. Changes to this Cookie Policy",
        body: "KHAVYN may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our business practices. The latest version will always be available on www.khavyn.com and will become effective from the date it is published.",
      },
      {
        heading: "8. Contact Us",
        body: "If you have any questions regarding this Cookie Policy or our use of cookies, please contact KHAVYN Fashion Private Limited Customer Care: +91-9373205258 | Email: privacy@khavyn.com | Registered Office: Sr. No. 80/16, Kavita Apartment, Samarth Nagar, New Sangavi, Pune – 411027, Maharashtra, India.",
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
              <p className="text-xs font-semibold text-[#C6A664]">KHAVYN</p>
              <p className="text-[11px] text-white/60">
                Crafting Everyday Luxury • Timeless European Menswear
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
