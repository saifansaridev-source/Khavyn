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
  { slug: "returns", label: "Exchange Policy", icon: RotateCw },
  { slug: "refund", label: "Return & Refund Policy", icon: RotateCw },
  { slug: "cancellation", label: "Cancellation Policy", icon: XCircle },
  { slug: "payment", label: "Payment Policy", icon: CreditCard },
  { slug: "cookie", label: "Cookie Policy", icon: FileText },
];


const POLICY_CONTENT: Record<string, { title: string; date: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    date: "Effective Date: 01-07-2026",
    sections: [
      {
        heading: "Introduction",
        body: "Welcome to KHAVYN Fashion Private Limited (\"KHAVYN\", \"we\", \"our\", \"us\").\n\nKHAVYN respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, disclose, and safeguard your personal data when you visit www.khavyn.com, purchase products through our website or retail stores, communicate with us, or otherwise interact with our services.\n\nBy accessing or using our website or purchasing our products, you acknowledge that you have read, understood, and agree to the terms of this Privacy Policy.",
      },
      {
        heading: "1. Information We Collect",
        body: "We may collect the following categories of information:\n\nA. Personal Information\n• Full Name\n• Mobile Number\n• Email Address\n• Billing Address\n• Shipping Address\n• PIN Code\n• Date of Birth (if voluntarily provided)\n• Gender (if voluntarily provided)\n\nB. Order Information\n• Order Number\n• Products Purchased\n• Product Size\n• Product Colour\n• Quantity\n• Purchase Value\n• Invoice Details\n• Order History\n\nC. Payment Information\nPayments are processed securely through authorized third-party payment gateways.\nKHAVYN does not store your:\n• Credit Card Number\n• Debit Card Number\n• CVV\n• UPI PIN\n• Net Banking Password\n• Other sensitive payment credentials\n\nD. Technical Information\nWhen you visit our website, we may automatically collect:\n• IP Address\n• Browser Type\n• Device Information\n• Operating System\n• Language Preferences\n• Date and Time of Visit\n• Pages Viewed\n• Referral Source\n• Website Usage Data\n• Cookies and Similar Technologies\n\nE. Information Collected at Retail Stores\nWhen you shop at a KHAVYN retail store, we may collect:\n• Name\n• Mobile Number\n• Email Address\n• Purchase History\n• Loyalty Programme Details (if applicable)\n• CCTV Footage for safety and security purposes",
      },
      {
        heading: "2. How We Use Your Information",
        body: "We may use your information to:\n\n• Process and fulfil orders.\n• Deliver products.\n• Verify your identity.\n• Process payments.\n• Provide customer support.\n• Process exchanges, returns, refunds, or warranty claims.\n• Send invoices and order confirmations.\n• Communicate delivery updates.\n• Improve our products and services.\n• Personalize your shopping experience.\n• Detect and prevent fraud.\n• Comply with legal and regulatory obligations.\n• Respond to customer enquiries and complaints.\n\nWhere you have provided consent or where otherwise permitted by law, we may also send you updates regarding new collections, promotions, exclusive offers, events, or marketing communications. You may opt out of marketing communications at any time.",
      },
      {
        heading: "3. Cookies and Similar Technologies",
        body: "Our website uses cookies and similar technologies to:\n\n• Maintain secure login sessions.\n• Remember your shopping cart.\n• Save your preferences.\n• Improve website performance.\n• Analyse visitor behaviour.\n• Enhance user experience.\n• Support security and fraud prevention.\n\nYou can manage or disable cookies through your browser settings. Some website features may not function properly if essential cookies are disabled.\n\nFor more information, please refer to our Cookie Policy.",
      },
      {
        heading: "4. Sharing of Personal Information",
        body: "KHAVYN does not sell or rent your personal information.\n\nWe may share your information only when necessary with trusted service providers, including:\n\n• Payment Gateway Providers.\n• Courier and Logistics Partners.\n• Website Hosting Providers.\n• Technology Service Providers.\n• Customer Support Platforms.\n• SMS and Email Service Providers.\n• Analytics and Marketing Service Providers.\n• Professional advisers (such as auditors or legal advisers).\n• Government authorities, regulators, or law enforcement agencies where required by law.\n\nThese parties are required to handle your information in accordance with applicable laws and contractual obligations.",
      },
      {
        heading: "5. Data Security",
        body: "We implement reasonable administrative, technical, and physical safeguards to protect your personal information, including:\n\n• SSL encryption.\n• Secure servers.\n• Firewalls.\n• Restricted access controls.\n• Password-protected systems.\n• Security monitoring and periodic reviews.\n\nWhile we strive to protect your information, no method of transmission over the internet or electronic storage is completely secure. Accordingly, we cannot guarantee absolute security.",
      },
      {
        heading: "6. Data Retention",
        body: "We retain your personal information only for as long as reasonably necessary to:\n\n• Fulfil the purposes described in this Privacy Policy.\n• Comply with legal, accounting, tax, or regulatory obligations.\n• Resolve disputes.\n• Enforce our agreements.\n\nWhen personal information is no longer required, we will securely delete, anonymize, or otherwise dispose of it in accordance with applicable laws.",
      },
      {
        heading: "7. Your Rights",
        body: "Subject to applicable law, you may request to:\n\n• Access your personal information.\n• Correct or update inaccurate information.\n• Request deletion of eligible personal information.\n• Withdraw consent where processing is based on consent.\n• Request information regarding the processing of your personal data.\n• Opt out of promotional communications.\n\nTo exercise these rights, please contact us using the details provided below.",
      },
      {
        heading: "8. Children's Privacy",
        body: "Our website is intended for individuals who are legally capable of entering into binding contracts under applicable law.\n\nWe do not knowingly collect personal information from children without appropriate authorization. If we become aware that personal information has been collected contrary to applicable law, we will take reasonable steps to delete such information.",
      },
      {
        heading: "9. Third-Party Websites",
        body: "Our website may contain links to third-party websites or services.\n\nKHAVYN is not responsible for the privacy practices, security, or content of such third-party websites. Users are encouraged to review the privacy policies of those websites before providing personal information.",
      },
      {
        heading: "10. International Data Processing",
        body: "If you access our website from outside India, your personal information may be processed and stored in India or in other jurisdictions where our service providers operate, subject to applicable legal safeguards.",
      },
      {
        heading: "11. Legal Disclosure",
        body: "We may disclose personal information where necessary to:\n\n• Comply with applicable laws, regulations, court orders, or lawful requests.\n• Protect the rights, property, or safety of KHAVYN, our customers, employees, or the public.\n• Detect, investigate, or prevent fraud, security incidents, or unlawful activities.\n• Enforce our legal rights, agreements, and policies.",
      },
      {
        heading: "12. Changes to this Privacy Policy",
        body: "KHAVYN reserves the right to amend or update this Privacy Policy at any time.\n\nThe revised version will be published on www.khavyn.com with the updated Effective Date. Continued use of the website after publication of any changes constitutes acceptance of the revised Privacy Policy.",
      },
      {
        heading: "13. Contact Us",
        body: "If you have any questions regarding this Privacy Policy or the processing of your personal information, please contact:\n\nPrivacy Officer\nKHAVYN Fashion Private Limited\nEmail: privacy@khavyn.com\nCustomer Care: +91-9373205258\nWebsite: www.khavyn.com\n\nRegistered Office:\nSr. No. 80/16, Kavita Apartment,\nSamarth Nagar,\nNew Sangavi,\nPune – 411027, Maharashtra, India\n\nBy accessing or using www.khavyn.com, you acknowledge that you have read, understood, and agreed to this Privacy Policy.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    date: "Effective Date: 01-09-2026",
    sections: [
      {
        heading: "Introduction",
        body: "Welcome to KHAVYN Fashion Private Limited (\"KHAVYN\", \"Company\", \"we\", \"our\", \"us\").\n\nThese Terms & Conditions (\"Terms\") govern your access to and use of www.khavyn.com, including all purchases, services, content, features, and transactions made through our website and, where applicable, our retail stores.\n\nBy accessing our website, creating an account, placing an order, or purchasing any product, you acknowledge that you have read, understood, and agree to be legally bound by these Terms.",
      },
      {
        heading: "1. Eligibility",
        body: "By using our website, you represent and warrant that:\n\n• You are legally capable of entering into a binding contract under applicable law.\n• The information provided by you is true, accurate, and complete.\n• You will use the website only for lawful purposes.\n• You will not misuse our website or services.\n\nIf you are using the website on behalf of a business or organization, you represent that you have authority to bind that entity to these Terms.",
      },
      {
        heading: "2. Account Registration",
        body: "Certain features may require you to create an account.\n\nYou are responsible for:\n\n• Maintaining the confidentiality of your login credentials.\n• Restricting unauthorized access to your account.\n• Promptly notifying KHAVYN of any unauthorized use.\n• Ensuring that your account information remains accurate and up to date.\n\nKHAVYN shall not be responsible for losses resulting from your failure to protect your account credentials.",
      },
      {
        heading: "3. Products",
        body: "KHAVYN makes reasonable efforts to accurately display product descriptions, specifications, colours, pricing, and availability.\n\nHowever:\n\n• Actual product colours may vary due to monitor or device settings.\n• Minor variations in fabric texture, stitching, embroidery, measurements, or finish may occur.\n• Such variations shall not be considered manufacturing defects.\n\nAll products are subject to availability.",
      },
      {
        heading: "4. Orders",
        body: "Placing an order constitutes an offer to purchase a product.\n\nAn order is accepted only after:\n\n• successful payment confirmation; or\n• successful receipt of the required 50% advance payment for eligible Partial Cash on Delivery (COD) orders,\n\nand confirmation by KHAVYN.\n\nKHAVYN reserves the right to refuse or cancel any order before dispatch for reasons including pricing errors, stock unavailability, suspected fraud, payment verification failure, or any other legitimate business reason.",
      },
      {
        heading: "5. Pricing",
        body: "• All prices are displayed in Indian Rupees (INR) unless otherwise specified.\n• Prices are inclusive of applicable GST unless expressly stated otherwise.\n• Shipping charges, if applicable, will be displayed during checkout.\n• KHAVYN reserves the right to change prices at any time before an order is accepted.",
      },
      {
        heading: "6. Payment",
        body: "Payment options include:\n\n• UPI\n• Credit Cards\n• Debit Cards\n• Net Banking\n• Mobile Wallets\n• Eligible Partial Cash on Delivery (COD)\n\nFor eligible COD orders:\n\n• 50% of the order value must be paid in advance.\n• The remaining 50% is payable at the time of delivery.\n\nFurther details are available in our Payment Policy.",
      },
      {
        heading: "7. Shipping and Delivery",
        body: "Shipping and delivery are governed by our Shipping & Delivery Policy.\n\nDelivery timelines are estimates only and may vary due to operational or external factors beyond KHAVYN's reasonable control.",
      },
      {
        heading: "8. Cancellation, Returns, Exchanges and Refunds",
        body: "Cancellation, return, exchange, refund, and warranty matters are governed by the respective policies published on www.khavyn.com.\n\nCustomers are encouraged to review these policies before placing an order.",
      },
      {
        heading: "9. Intellectual Property",
        body: "All intellectual property associated with KHAVYN, including but not limited to:\n\n• Brand name.\n• Logos.\n• Trademarks.\n• Product designs.\n• Product photographs.\n• Videos.\n• Catalogues.\n• Website design.\n• Graphics.\n• Text.\n• Software.\n• Marketing materials.\n• Packaging.\n\nis owned by or licensed to KHAVYN and is protected by applicable intellectual property laws.\n\nNo content may be copied, reproduced, distributed, modified, published, or commercially exploited without prior written permission.",
      },
      {
        heading: "10. Acceptable Use",
        body: "You agree not to:\n\n• Use the website for unlawful purposes.\n• Attempt unauthorized access to our systems.\n• Upload malicious software or harmful code.\n• Interfere with website security or functionality.\n• Copy or scrape website content without authorization.\n• Misrepresent your identity.\n• Engage in fraudulent transactions.\n• Violate applicable laws or regulations.",
      },
      {
        heading: "11. User Reviews and Content",
        body: "If you submit reviews, comments, photographs, testimonials, or other content:\n\n• You confirm that the content is lawful and does not infringe third-party rights.\n• You grant KHAVYN a non-exclusive, worldwide, royalty-free licence to use, reproduce, publish, display, adapt, and distribute such content for business, promotional, and marketing purposes, subject to applicable law.\n\nKHAVYN reserves the right to remove content that is unlawful, abusive, misleading, or otherwise inappropriate.",
      },
      {
        heading: "12. Privacy",
        body: "The collection, use, storage, and protection of personal information are governed by our Privacy Policy.\n\nBy using our website, you consent to the processing of your information in accordance with that Policy.",
      },
      {
        heading: "13. Third-Party Services",
        body: "Our website may integrate with or link to third-party services, including payment gateways, logistics providers, analytics tools, and social media platforms.\n\nKHAVYN is not responsible for the content, availability, or practices of third-party services. Your use of such services is governed by their own terms and policies.",
      },
      {
        heading: "14. Limitation of Liability",
        body: "To the fullest extent permitted by applicable law, KHAVYN shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages arising from or related to:\n\n• Use of or inability to use the website.\n• Delays in processing or delivery.\n• Technical failures.\n• Service interruptions.\n• Loss of data.\n• Unauthorized access to user accounts.\n• Third-party service failures.\n• Any reliance on information available on the website.\n\nNothing in these Terms limits liability that cannot be excluded under applicable law.",
      },
      {
        heading: "15. Indemnity",
        body: "You agree to indemnify and hold harmless KHAVYN, its directors, officers, employees, affiliates, and representatives from any claims, losses, damages, liabilities, costs, or expenses arising from:\n\n• Your breach of these Terms.\n• Your misuse of the website.\n• Your violation of any law.\n• Your infringement of any third-party rights.",
      },
      {
        heading: "16. Force Majeure",
        body: "KHAVYN shall not be liable for any delay or failure to perform its obligations due to events beyond its reasonable control, including but not limited to:\n\n• Natural disasters.\n• Floods.\n• Fire.\n• Epidemics or pandemics.\n• Labour disputes.\n• Transportation disruptions.\n• Government restrictions.\n• War or civil disturbances.\n• Power outages.\n• Internet or telecommunications failures.",
      },
      {
        heading: "17. Suspension or Termination",
        body: "KHAVYN may suspend or terminate access to the website or cancel orders where a user:\n\n• Violates these Terms.\n• Engages in fraudulent activity.\n• Misuses promotional offers.\n• Abuses return, exchange, or complaint processes.\n• Interferes with website operations.\n• Acts unlawfully or in bad faith.",
      },
      {
        heading: "18. Governing Law and Jurisdiction",
        body: "These Terms shall be governed by and construed in accordance with the laws of India.\n\nSubject to applicable law, the courts located in Pune, Maharashtra, shall have exclusive jurisdiction over any dispute arising out of or relating to these Terms or the use of the website.",
      },
      {
        heading: "19. Changes to these Terms",
        body: "KHAVYN reserves the right to amend or update these Terms & Conditions at any time without prior notice.\n\nThe updated version will be published on www.khavyn.com and will become effective from the date of publication.\n\nContinued use of the website after such publication constitutes acceptance of the revised Terms.",
      },
      {
        heading: "20. Contact Us",
        body: "For questions regarding these Terms & Conditions, please contact:\n\nKHAVYN Fashion Private Limited\nCustomer Care: +91-9373205258\nEmail: complaint.khavyn@gmail.com\nWebsite: www.khavyn.com\n\nRegistered Office:\nSr. No. 80/16, Kavita Apartment,\nSamarth Nagar,\nNew Sangavi,\nPune – 411027, Maharashtra, India\n\nBy accessing or using www.khavyn.com, creating an account, or placing an order, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.",
      },
    ],
  },
  shipping: {
    title: "Shipping & Delivery Policy",
    date: "Effective Date: 01-09-2026",
    sections: [
      {
        heading: "Introduction",
        body: "Welcome to KHAVYN Fashion Private Limited (\"KHAVYN\", \"we\", \"our\", \"us\").\n\nThis Shipping & Delivery Policy explains how orders placed through www.khavyn.com are processed, shipped, and delivered. By placing an order with KHAVYN, you acknowledge that you have read, understood, and agree to this Policy.",
      },
      {
        heading: "1. Order Processing",
        body: "• Orders are processed only after successful payment confirmation or receipt of the required 50% advance payment for eligible Partial Cash on Delivery (COD) orders.\n• Orders are generally processed within 1–3 business days, excluding Sundays and public holidays.\n• During product launches, festivals, promotional campaigns, or unforeseen circumstances, processing times may be extended. Customers will be notified where reasonably practicable.",
      },
      {
        heading: "2. Shipping Coverage",
        body: "KHAVYN currently ships across India to serviceable PIN codes through trusted logistics partners.\n\nDelivery to certain remote, restricted, or non-serviceable locations may not be available.\n\nWe reserve the right to refuse or cancel orders for locations that cannot be serviced.",
      },
      {
        heading: "3. Delivery Time",
        body: "Estimated delivery timelines are:\n\n• Metro Cities: 2–5 business days after dispatch.\n• Non-Metro Cities: 3–7 business days after dispatch.\n• Remote or Rural Locations: 5–10 business days after dispatch.\n\nThese timelines are estimates only and are not guaranteed. Actual delivery times may vary due to courier operations, weather conditions, festivals, public holidays, transportation disruptions, government restrictions, or other events beyond KHAVYN's reasonable control.",
      },
      {
        heading: "4. Shipping Charges",
        body: "Applicable shipping charges, if any, will be displayed during checkout before the order is confirmed.\n\nFrom time to time, KHAVYN may offer free shipping promotions or other shipping benefits at its sole discretion.",
      },
      {
        heading: "5. Order Tracking",
        body: "Once an order has been dispatched, customers will receive shipment confirmation through email, SMS, WhatsApp, or other available communication channels, together with tracking information where available.\n\nTracking updates are provided by the respective logistics partner and may occasionally be delayed.",
      },
      {
        heading: "6. Delivery Attempts",
        body: "Courier partners generally make multiple delivery attempts in accordance with their operational policies.\n\nIf delivery cannot be completed because:\n\n• the customer is unavailable;\n• the delivery address is incorrect or incomplete;\n• the customer refuses to accept the shipment without a valid reason; or\n• the customer cannot be contacted,\n\nthe shipment may be returned to KHAVYN.\n\nAdditional shipping charges may apply for re-dispatch, where permitted by law.",
      },
      {
        heading: "7. Partial Cash on Delivery (COD)",
        body: "For eligible COD orders:\n\n• 50% of the total order value must be paid in advance at the time of placing the order.\n• The remaining 50% is payable to the delivery partner at the time of delivery.\n• Orders will not be processed until the advance payment has been successfully received.\n• COD availability depends on the delivery location, order value, and operational feasibility.\n\nKHAVYN reserves the right to withdraw or restrict the COD facility at any time.",
      },
      {
        heading: "8. Delivery Address",
        body: "Customers are responsible for providing a complete, accurate, and deliverable shipping address at the time of placing an order. To help ensure successful delivery, customers should provide:\n\n• Full Name of the Recipient.\n• House/Flat/Apartment Number.\n• Building Name (if applicable).\n• Street, Area, or Locality.\n• Nearest Landmark (mandatory where applicable).\n• Accurate Location Details, including a Google Maps location or map pin, where requested or available, especially for difficult-to-locate addresses.\n• City.\n• State.\n• PIN Code.\n• Mobile Number.\n\nCustomers are solely responsible for ensuring that all delivery information is accurate and complete.\n\nKHAVYN shall not be liable for any delay, failed delivery, additional delivery charges, or return of the shipment arising from:\n\n• Incorrect or incomplete delivery address.\n• Incorrect PIN Code.\n• Missing or inaccurate landmark.\n• Incorrect or unavailable map location.\n• Incorrect recipient name or contact number.\n• Failure of the customer to respond to delivery calls or messages from the courier partner.\n• Any other information provided by the customer that prevents successful delivery.\n\nIf an order is returned to KHAVYN due to an incorrect or incomplete delivery address or because the customer could not be contacted or the location could not be identified, KHAVYN reserves the right to charge applicable re-shipping, handling, and logistics costs before arranging a re-delivery, where permitted by applicable law.",
      },
      {
        heading: "9. Inspection at Delivery",
        body: "Customers are advised to inspect the package at the time of delivery.\n\nIf the outer package appears:\n\n• tampered;\n• damaged;\n• opened;\n• torn; or\n• otherwise compromised,\n\ncustomers should:\n\n• take photographs or videos before opening the parcel, where possible;\n• notify the delivery representative if appropriate; and\n• contact KHAVYN Customer Care within 24 hours of delivery.\n\nFailure to report visible transit damage promptly may affect our ability to investigate claims with logistics partners.",
      },
      {
        heading: "10. Delayed Deliveries",
        body: "KHAVYN is not liable for delays caused by circumstances beyond its reasonable control, including but not limited to:\n\n• severe weather;\n• natural disasters;\n• transportation disruptions;\n• strikes or labour disputes;\n• government restrictions;\n• public holidays;\n• pandemics or epidemics;\n• courier operational delays; or\n• force majeure events.\n\nWhere feasible, customers will be informed of significant delays.",
      },
      {
        heading: "11. Lost Shipments",
        body: "If a shipment is confirmed by the logistics partner as lost before delivery, KHAVYN will, after completing its verification process, either:\n\n• dispatch a replacement product (subject to availability); or\n• process a refund in accordance with our applicable policies.",
      },
      {
        heading: "12. International Shipping",
        body: "At present, KHAVYN ships only within India unless otherwise announced on www.khavyn.com.\n\nIf international shipping becomes available in the future, separate terms and conditions may apply.",
      },
      {
        heading: "13. Refused Deliveries",
        body: "If a customer refuses delivery without a valid reason after the order has been shipped:\n\n• the order may be treated as a refused shipment;\n• any applicable shipping, return shipping, packaging, payment gateway, and operational costs may be deducted from amounts refundable, where permitted by applicable law and our published policies;\n• KHAVYN may restrict Partial COD or other payment options for future purchases.",
      },
      {
        heading: "14. Force Majeure",
        body: "KHAVYN shall not be liable for delays or failure to perform its shipping obligations due to events beyond its reasonable control, including but not limited to natural disasters, floods, fires, pandemics, transportation failures, labour disputes, governmental actions, war, civil disturbances, power failures, or internet disruptions.",
      },
      {
        heading: "15. Changes to this Policy",
        body: "KHAVYN reserves the right to amend or update this Shipping & Delivery Policy at any time without prior notice.\n\nThe latest version will always be available on www.khavyn.com and will become effective from the date of publication.",
      },
      {
        heading: "16. Contact Us",
        body: "For shipping or delivery-related queries, please contact:\n\nKHAVYN Fashion Private Limited\nCustomer Care: +91-9373205258\nEmail: complaint.khavyn@gmail.com\nWebsite: www.khavyn.com\n\nRegistered Office:\nSr. No. 80/16, Kavita Apartment,\nSamarth Nagar,\nNew Sangavi,\nPune – 411027, Maharashtra, India\n\nBy placing an order on www.khavyn.com, you acknowledge that you have read, understood, and agreed to this Shipping & Delivery Policy.",
      },
    ],

  },
  returns: {
    title: "Exchange Policy",
    date: "Effective Date: 01-09-2026",
    sections: [
      {
        heading: "Introduction",
        body: "Welcome to KHAVYN Fashion Private Limited (\"KHAVYN\", \"we\", \"our\", \"us\").\n\nAt KHAVYN, we are committed to delivering premium-quality apparel and an exceptional shopping experience. If your purchase meets the eligibility criteria outlined below, you may request an exchange in accordance with this Exchange Policy.\n\nBy placing an order on www.khavyn.com, you agree to this Exchange Policy.",
      },
      {
        heading: "1. Exchange Eligibility",
        body: "An exchange request may be accepted only if:\n\n• The request is submitted within 3 (three) calendar days from the date of delivery.\n• The product is unused, unworn, unwashed, and undamaged.\n• All original tags, labels, packaging, accessories, invoices, and promotional items are returned with the product.\n• The product is in its original condition and suitable for resale.\n• The product successfully passes our Quality Inspection after it is received at our warehouse.\n\nExchange requests submitted after the above period may not be accepted.",
      },
      {
        heading: "2. Eligible Reasons for Exchange",
        body: "Subject to verification and quality inspection, exchanges may be permitted for:\n\n• Incorrect size received.\n• Incorrect colour received.\n• Incorrect product delivered.\n• Manufacturing defect.\n• Product damaged during transit.\n• Product received with missing components or accessories (where applicable).\n\nKHAVYN reserves the right to verify all exchange requests before approval.",
      },
      {
        heading: "3. Non-Exchangeable Products",
        body: "The following items are not eligible for exchange:\n\n• Products returned after 3 days from delivery.\n• Used, worn, washed, altered, ironed, stained, or damaged products.\n• Products without original tags or packaging.\n• Products with perfume, deodorant, smoke, makeup, detergent, pet hair, or other signs of use.\n• Gift cards or store credits.\n• Customized, personalised, embroidered-on-demand, or altered products.\n• Products marked as Final Sale, Clearance, Non-Returnable, or Non-Exchangeable, unless required by applicable law.\n• Products damaged due to improper use, negligence, or incorrect washing by the customer.",
      },
      {
        heading: "4. Exchange Process",
        body: "To request an exchange:\n\n1. Contact Customer Care within 3 days of delivery.\n2. Provide:\n   o Order Number;\n   o Reason for exchange;\n   o Photographs or videos of the product (if requested).\n3. If approved, KHAVYN will provide further instructions regarding pickup or return shipment.\n4. The returned product will undergo a Quality Inspection after receipt.\n5. If the inspection is successful, the replacement product will be dispatched subject to stock availability.",
      },
      {
        heading: "5. Quality Inspection",
        body: "Every returned product undergoes a detailed quality inspection.\n\nAn exchange may be rejected if:\n\n• The product has been used or worn.\n• The returned item does not match the original order.\n• Tags or packaging are missing.\n• The product is damaged by the customer.\n• The product fails our quality standards.\n\nKHAVYN's quality inspection findings shall be final for the purpose of determining exchange eligibility.",
      },
      {
        heading: "6. Wrong or Tampered Return",
        body: "To protect against fraudulent returns, KHAVYN may record a video during the unboxing and inspection of returned parcels.\n\nIf, during inspection, it is found that:\n\n• a different product has been returned;\n• the product has been tampered with;\n• the product is counterfeit or not originally supplied by KHAVYN;\n• essential components, accessories, tags, or packaging are missing due to customer actions; or\n• the returned product is materially different from the item originally delivered,\n\nthe exchange request will be rejected. The returned item may be shipped back to the customer at the customer's cost, and KHAVYN reserves the right to refuse any refund or exchange in such cases.",
      },
      {
        heading: "7. Exchange Subject to Availability",
        body: "Exchanges are subject to inventory availability.\n\nIf the requested size, colour, or product is unavailable, KHAVYN may, at its discretion:\n\n• offer another available size or colour;\n• offer an equivalent product of equal value (with the customer's consent); or\n• issue store credit or process a refund only where required under our Return & Refund Policy or applicable law.",
      },
      {
        heading: "8. Shipping Charges for Exchanges",
        body: "If the exchange is due to:\n\n• a manufacturing defect;\n• a damaged product received;\n• an incorrect product shipped by KHAVYN; or\n• an incorrect size or colour dispatched by KHAVYN,\n\nKHAVYN will bear the applicable exchange shipping charges.\n\nFor exchanges requested due to customer preference (such as ordering the wrong size or changing colour preference), exchange shipping or handling charges may apply, where permitted by law. Any applicable charges will be communicated before processing the exchange.",
      },
      {
        heading: "9. Retail Store Purchases",
        body: "Products purchased from a KHAVYN retail store may be exchanged only at eligible KHAVYN stores, subject to:\n\n• presentation of the original purchase invoice;\n• compliance with this Exchange Policy; and\n• successful quality inspection.\n\nCash refunds for retail store purchases will not be provided unless required by applicable law.",
      },
      {
        heading: "10. Abuse of the Exchange Policy",
        body: "KHAVYN reserves the right to reject exchange requests or restrict future purchases if a customer is found to have:\n\n• repeatedly misused the exchange process;\n• submitted false or fraudulent claims;\n• returned products that do not match the original order; or\n• otherwise acted in bad faith.",
      },
      {
        heading: "11. Changes to this Policy",
        body: "KHAVYN reserves the right to modify, update, or revise this Exchange Policy at any time without prior notice. The updated version will be published on www.khavyn.com and will become effective from the date of publication.",
      },
      {
        heading: "12. Contact Us",
        body: "For exchange requests or assistance, please contact:\n\nKHAVYN Fashion Private Limited\nCustomer Care: +91-9373205258\nEmail: complaint.khavyn@gmail.com\nWebsite: www.khavyn.com\n\nRegistered Office:\nSr. No. 80/16, Kavita Apartment,\nSamarth Nagar, New Sangavi,\nPune – 411027, Maharashtra, India\n\nBy placing an order on www.khavyn.com, you acknowledge that you have read, understood, and agreed to this Exchange Policy.",
      },
    ],
  },
  cancellation: {
    title: "Cancellation Policy",
    date: "Effective Date: 01-09-2026",
    sections: [
      {
        heading: "Introduction",
        body: "Welcome to KHAVYN Fashion Private Limited (\"KHAVYN\", \"we\", \"our\", \"us\").\n\nAt KHAVYN, we strive to provide a seamless shopping experience. This Cancellation Policy explains the circumstances under which an order may be cancelled by a customer or by KHAVYN. By placing an order on www.khavyn.com, you acknowledge that you have read, understood, and agree to this Cancellation Policy.",
      },
      {
        heading: "1. Customer-Initiated Cancellation",
        body: "Customers may request cancellation of an order only before the order has entered processing, packing, or shipment.\n\nCancellation requests may be submitted through:\n\n• Your account on www.khavyn.com (where available);\n• Email: complaint.khavyn@gmail.com; or\n• Customer Care: +91-9373205258.\n\nOnce an order has entered processing, packing, or has been dispatched, it cannot be cancelled.\n\nAny request after dispatch shall be governed by KHAVYN's Return & Refund Policy, where applicable.",
      },
      {
        heading: "2. Cancellation After Shipment",
        body: "Once an order has been dispatched from our warehouse, it cannot be cancelled.\n\nCustomers who no longer wish to keep a delivered product may submit a return request only if the product qualifies under KHAVYN's Return & Refund Policy. Submission of a return request does not guarantee acceptance, and all requests are subject to eligibility, verification, and quality inspection.",
      },
      {
        heading: "3. Partial Cash on Delivery (COD) Orders",
        body: "KHAVYN offers Partial Cash on Delivery (COD) for eligible orders.\n\nUnder this payment option:\n\n• 50% of the total order value must be paid in advance at the time of placing the order.\n• The remaining 50% is payable at the time of delivery.\n\nCustomers selecting Partial COD are requested to place orders only if they genuinely intend to complete the purchase.\n\nKHAVYN reserves the right to:\n\n• Cancel suspicious, fraudulent, duplicate, or unverifiable Partial COD orders;\n• Restrict, suspend, or permanently disable the Partial COD facility for customers who repeatedly refuse deliveries, misuse the facility, or violate KHAVYN policies;\n• Require full prepaid payment for future purchases at its sole discretion.",
      },
      {
        heading: "4. Cancellation by KHAVYN",
        body: "KHAVYN reserves the right to cancel any order, in whole or in part, without prior notice, under circumstances including but not limited to:\n\n• Product becoming unavailable or out of stock;\n• Pricing, technical, or typographical errors;\n• Duplicate orders;\n• Incorrect product information;\n• Failure of payment authorization or verification;\n• Failure to receive the required advance payment for eligible Partial COD orders;\n• Suspected fraudulent or unauthorized transactions;\n• Violation of our Terms & Conditions or other published policies;\n• Delivery address being incomplete, incorrect, or non-serviceable;\n• Force majeure events including natural disasters, strikes, transportation disruptions, government restrictions, pandemics, or other events beyond KHAVYN's reasonable control.\n\nWhere payment has already been received for an order cancelled by KHAVYN, an appropriate refund will be processed in accordance with this Policy.",
      },
      {
        heading: "5. Refund for Cancelled Orders",
        body: "If an order is cancelled before it enters processing or shipment:\n\n• Prepaid Orders: The full amount paid, including applicable taxes, will be refunded to the original payment method.\n• Partial COD Orders: The 50% advance payment will be refunded to the original payment method, provided the cancellation request is approved and received before the order enters processing, packing, or shipment.\n\nIf a customer refuses delivery of a dispatched Partial COD order without a valid reason or otherwise breaches this Cancellation Policy, KHAVYN reserves the right to retain or deduct all or part of the advance payment towards shipping, return shipping, packaging, payment gateway charges, and other reasonable operational costs, to the extent permitted by applicable law and in accordance with our Payment Policy.\n\nApproved refunds are generally processed within 7 to 10 business days. The time required for the refund to reflect in the customer's account may vary depending on the customer's bank or payment service provider.",
      },
      {
        heading: "6. Modification of Orders",
        body: "Customers may request modifications relating to:\n\n• Product;\n• Size;\n• Colour;\n• Quantity;\n• Shipping Address;\n• Billing Address; or\n• Contact Details,\n\nonly before the order enters processing.\n\nOnce an order has entered processing, packing, or shipment, modifications cannot be guaranteed.\n\nFor Partial COD orders, if an approved modification changes the order value, the advance payment may need to be adjusted before the order is processed.\n\nKHAVYN will make reasonable efforts to accommodate modification requests but does not guarantee that all requests can be fulfilled.",
      },
      {
        heading: "7. Promotional and Limited Edition Orders",
        body: "Orders placed during:\n\n• Product launches;\n• Limited edition collections;\n• Exclusive releases;\n• Festival campaigns;\n• Flash sales;\n• Clearance events; or\n• Special promotional campaigns,\n\nmay not be eligible for cancellation once confirmed due to limited inventory, operational requirements, or high order volumes.",
      },
      {
        heading: "8. Abuse of the Cancellation Policy",
        body: "KHAVYN reserves the right to refuse service, suspend customer accounts, cancel future orders, restrict available payment methods, or take any other appropriate action if a customer is found to have:\n\n• Repeatedly cancelled confirmed orders without reasonable cause;\n• Misused promotional offers or discount benefits;\n• Placed fraudulent, fake, or speculative orders;\n• Repeatedly refused delivery without a valid reason;\n• Misused the Partial COD facility;\n• Submitted false information; or\n• Engaged in activities that adversely affect KHAVYN, its operations, employees, logistics partners, or other customers.",
      },
      {
        heading: "9. Relationship with Other Policies",
        body: "This Cancellation Policy should be read together with KHAVYN's:\n\n• Terms & Conditions;\n• Payment Policy;\n• Shipping & Delivery Policy;\n• Return & Refund Policy;\n• Exchange Policy;\n• Warranty & Product Care Policy; and\n• Privacy Policy.\n\nIn the event of any inconsistency, the policy specifically governing the relevant subject matter shall prevail to the extent of such inconsistency.",
      },
      {
        heading: "10. Contact Us",
        body: "For cancellation requests or assistance, please contact:\n\nKHAVYN Fashion Private Limited\nCustomer Care: +91-9373205258\nEmail: complaint.khavyn@gmail.com\nWebsite: www.khavyn.com\n\nRegistered Office:\nSr. No. 80/16, Kavita Apartment,\nSamarth Nagar,\nNew Sangavi,\nPune – 411027, Maharashtra, India\n\nBy placing an order on www.khavyn.com, you acknowledge that you have read, understood, and agreed to this Cancellation Policy.",
      },
    ],
  },
  refund: {
    title: "Return & Refund Policy",
    date: "Effective Date: 01-09-2026",
    sections: [
      {
        heading: "1. Introduction",
        body: "At KHAVYN Fashion Private Limited (\"KHAVYN\", \"we\", \"our\", or \"us\"), customer satisfaction is important to us. We take great care in manufacturing, inspecting, packaging, and shipping every product.\n\nThis Return & Refund Policy explains the conditions under which products purchased from www.khavyn.com or authorized KHAVYN sales channels may be returned, exchanged, or refunded.\n\nBy placing an order, you agree to this Policy.",
      },
      {
        heading: "2. Return Eligibility",
        body: "A return request must be submitted within three (3) calendar days from the date the product is marked as delivered by our logistics partner.\n\nReturn requests received after this period will ordinarily not be accepted unless required by applicable law.",
      },
      {
        heading: "3. Eligible Reasons for Return",
        body: "Returns may be accepted only in the following circumstances:\n\n• Incorrect product delivered.\n• Incorrect size delivered by KHAVYN.\n• Manufacturing defect.\n• Product damaged during transit.\n• Missing item(s) from the shipment.\n• Product substantially different from the order confirmation.\n\nApproval of a return request is subject to verification by KHAVYN.",
      },
      {
        heading: "4. Non-Returnable Products",
        body: "Returns will not be accepted if:\n\n• The request is made after three (3) calendar days of delivery.\n• The product has been worn, washed, altered, or used.\n• The product has stains, perfume, deodorant, smoke, makeup, pet hair, or any other signs of use.\n• Original tags, labels, or packaging are missing or damaged.\n• The product has been intentionally damaged after delivery.\n• The product was purchased during a final sale or marked as non-returnable (where clearly stated).\n• The product is customized or personalized.",
      },
      {
        heading: "5. Return Request Process",
        body: "Customers must initiate a return by contacting KHAVYN Customer Support through the designated support channels.\n\nThe following information may be required:\n\n• Order Number\n• Invoice (if available)\n• Product photographs\n• Packaging photographs\n• Description of the issue\n\nSubmission of a return request does not automatically guarantee approval.",
      },
      {
        heading: "6. Return Approval",
        body: "KHAVYN reserves the right to review all return requests before approving them.\n\nAdditional photographs or information may be requested.\n\nIf the return is approved, the customer will receive return instructions.",
      },
      {
        heading: "7. Condition of Returned Products",
        body: "Returned products must be received by KHAVYN in the same condition in which they were delivered, including:\n\n• Original product\n• Original tags attached\n• Original packaging\n• Accessories (if any)\n• Complimentary items (if any)\n\nProducts failing inspection may be rejected.",
      },
      {
        heading: "8. Inspection of Returned Products",
        body: "To ensure transparency, maintain quality standards, and prevent fraudulent return claims, every returned shipment received by KHAVYN may undergo a documented inspection process.\n\nThe inspection process may include, without limitation:\n\n• Continuous video recording of the unopened return parcel from the time it is received until the inspection is completed.\n• Photographs of the outer packaging before opening.\n• Recording of courier labels, shipment details, and package condition.\n• Verification of the product's SKU, size, colour, barcode, QR code, serial identifiers (where applicable), tags, labels, and packaging.\n• Inspection of the returned product for signs of use, washing, alteration, damage, substitution, or tampering.\n• Comparison of the returned product with the original order records, dispatch records, and quality control records.\n\nKHAVYN may preserve these records for internal verification, fraud prevention, payment dispute resolution, insurance claims, chargeback proceedings, regulatory compliance, or legal proceedings.",
      },
      {
        heading: "9. Verification of Returned Products and Fraud Prevention",
        body: "Customers must return the exact original KHAVYN product supplied against the relevant order.\n\nIf, during inspection, KHAVYN reasonably determines that:\n\n• the returned parcel has been tampered with;\n• the parcel contains a product different from the one originally supplied;\n• a counterfeit, duplicate, or substituted product has been returned;\n• the product has been intentionally damaged after delivery;\n• the returned item has been worn, washed, altered, or used beyond reasonable inspection;\n• original tags, labels, accessories, packaging, or complimentary items are missing without reasonable explanation;\n• the returned parcel contains any item other than the original KHAVYN product; or\n• there is evidence of attempted return fraud or abuse,\n\nKHAVYN reserves the right, subject to applicable law, to:\n\n• reject the return request;\n• decline any refund, replacement, exchange, or store credit;\n• return the disputed product to the customer at the customer's cost, where appropriate;\n• suspend or permanently deactivate the customer's KHAVYN account in cases of repeated or fraudulent conduct;\n• refuse future orders from the customer;\n• contest payment disputes, chargebacks, or fraudulent claims before banks, payment gateways, card networks, or other authorities; and\n• pursue any civil or criminal remedies available under applicable law.\n\nIn reaching its decision, KHAVYN may rely on one or more forms of evidence, including:\n\n• the continuous unboxing and inspection video;\n• photographs taken during inspection;\n• courier tracking records;\n• courier weight and package details, where available;\n• dispatch records;\n• warehouse quality control records;\n• product identification records; and\n• any other relevant documentary or electronic evidence.\n\nThe inspection video forms part of the verification process and is not the sole basis for determining a claim.",
      },
      {
        heading: "10. Refund Approval",
        body: "Refunds will be processed only after:\n\n• the returned product has been received by KHAVYN; and\n• the returned product successfully passes our inspection.\n\nApproval of the return request alone does not guarantee a refund.",
      },
      {
        heading: "11. Refund Method",
        body: "Approved refunds will generally be processed to the original payment method used for the purchase.\n\nFor Cash on Delivery (COD) orders, refunds may be processed through bank transfer or another method specified by KHAVYN after verification of the customer's details.",
      },
      {
        heading: "12. Refund Timeline",
        body: "Once approved, refunds are generally initiated within 7–10 business days.\n\nThe time taken for the credited amount to appear in the customer's account may vary depending on the bank or payment service provider.",
      },
      {
        heading: "13. Shipping Charges",
        body: "Original shipping charges are generally non-refundable unless:\n\n• the wrong product was delivered;\n• the product had a verified manufacturing defect;\n• the product was damaged during transit due to reasons attributable to KHAVYN.",
      },
      {
        heading: "14. Return Shipping",
        body: "Where KHAVYN arranges the return pickup, customers must securely pack the product and hand it over to the authorized logistics partner.\n\nWhere customers are instructed to self-ship, they should use a reliable courier service and retain proof of dispatch until the return process is completed.",
      },
      {
        heading: "15. Fraudulent Returns and Abuse of the Return Policy",
        body: "KHAVYN is committed to maintaining a fair return process for all customers.\n\nAny attempt to misuse the Return & Refund Policy, including but not limited to:\n\n• returning a different product;\n• returning counterfeit merchandise;\n• intentionally damaging products before return;\n• removing or replacing original tags;\n• submitting false or misleading claims;\n• manipulating packaging or shipment contents;\n• repeated abuse of return privileges; or\n• engaging in fraudulent or unlawful conduct,\n\nmay result in one or more of the following actions, subject to applicable law:\n\n• rejection of the return or refund request;\n• cancellation of pending orders;\n• suspension or termination of the customer's account;\n• refusal of future purchases;\n• recovery of losses or associated costs where legally permissible;\n• reporting the matter to payment providers, logistics partners, insurers, or law enforcement authorities where appropriate.\n\nKHAVYN reserves the right to investigate any suspicious return request before issuing a final decision.",
      },
      {
        heading: "16. Limitation of Liability",
        body: "KHAVYN shall not be responsible for products that are lost, damaged, altered, or substituted while in the customer's possession or due to improper packaging by the customer before return shipment.",
      },
      {
        heading: "17. Customer Responsibilities",
        body: "Customers agree to:\n\n• return only the original product supplied by KHAVYN;\n• keep the product unused until any approved return is completed;\n• retain original tags and packaging;\n• provide accurate information during the return process; and\n• cooperate with any reasonable verification requested by KHAVYN.",
      },
      {
        heading: "18. Governing Law",
        body: "This Policy shall be governed by the laws of India.\n\nSubject to applicable consumer protection laws, disputes relating to this Policy shall be subject to the exclusive jurisdiction of the competent courts in Pune, Maharashtra.",
      },
      {
        heading: "19. Contact Us",
        body: "KHAVYN Fashion Private Limited\nCustomer Care: +91-9373205258\nEmail: support@khavyn.com\nWebsite: www.khavyn.com\n\nBusiness Hours:\nMonday–Saturday\n10:00 AM – 6:00 PM IST",
      },
      {
        heading: "20. Changes to This Policy",
        body: "KHAVYN reserves the right to amend this Return & Refund Policy at any time. The latest version will be published on www.khavyn.com and shall become effective from the stated \"Last Updated\" date.",
      },
    ],
  },
    payment: {
    title: "Payment Policy",
    date: "Effective Date: 01-09-2026",
    sections: [
      {
        heading: "Introduction",
        body: "Welcome to KHAVYN Fashion Private Limited (\"KHAVYN\", \"we\", \"our\", \"us\").\n\nThis Payment Policy explains the payment methods, payment terms, and conditions applicable to purchases made through www.khavyn.com and, where applicable, at KHAVYN retail stores. By placing an order with KHAVYN, you agree to this Payment Policy.",
      },
      {
        heading: "1. Accepted Payment Methods",
        body: "KHAVYN accepts the following payment methods:\n\n• UPI\n• Credit Cards\n• Debit Cards\n• Net Banking\n• Mobile Wallets\n• Cash on Delivery (COD) – Partial Advance (where available)\n\nAll online payments are processed through secure, PCI-DSS-compliant payment gateway partners.",
      },
      {
        heading: "2. Cash on Delivery (COD) – Partial Advance",
        body: "To reduce fraudulent orders and ensure efficient order processing, KHAVYN offers Partial Cash on Delivery (COD) for eligible orders.\n\nUnder this payment option:\n\n• 50% of the total order value must be paid in advance at the time of placing the order.\n• The remaining 50% is payable at the time of delivery to the delivery partner.\n• Orders will be processed only after the advance payment has been successfully received.\n• COD availability may vary depending on the delivery location, order value, product category, and serviceability.\n\nKHAVYN reserves the right to disable the COD option for specific orders, customers, products, or locations at its sole discretion.",
      },
      {
        heading: "3. Advance Payment for COD Orders",
        body: "The advance amount paid for a COD order:\n\n• confirms the customer's intention to purchase;\n• enables order processing and shipment; and\n• may be adjusted against cancellation or return charges where permitted under applicable policies and law.\n\nIf a customer refuses to accept a valid COD shipment without an approved reason, the advance amount may be retained by KHAVYN to recover shipping, handling, packaging, payment gateway, and other operational costs, subject to applicable law.",
      },
      {
        heading: "4. Full Prepaid Orders",
        body: "Customers may choose to pay 100% of the order value online using any of the available digital payment methods.\n\nOrders are processed only after successful payment authorization.",
      },
      {
        heading: "5. Payment Security",
        body: "KHAVYN does not store or have access to sensitive payment information such as:\n\n• Credit Card Number\n• Debit Card Number\n• CVV\n• UPI PIN\n• Net Banking Passwords\n\nPayment information is securely processed by authorized payment gateway providers using industry-standard encryption and security protocols.",
      },
      {
        heading: "6. Order Confirmation",
        body: "An order is considered confirmed only after:\n\n• successful payment authorization for prepaid orders; or\n• successful receipt of the required 50% advance payment for eligible COD orders.\n\nCustomers will receive an order confirmation by email and/or SMS/WhatsApp, where applicable.",
      },
      {
        heading: "7. Pricing and Taxes",
        body: "• All prices displayed on www.khavyn.com are in Indian Rupees (INR) unless otherwise stated.\n• Prices are inclusive of applicable Goods and Services Tax (GST), unless clearly specified otherwise.\n• Shipping charges, if applicable, will be displayed during checkout before payment confirmation.",
      },
      {
        heading: "8. Failed or Declined Transactions",
        body: "If a payment fails or is declined:\n\n• no order will be processed until successful payment is received;\n• customers may retry the transaction using the same or another payment method; and\n• KHAVYN is not responsible for delays caused by banks, payment gateways, or network issues.\n\nIf an amount is debited but the order is not confirmed, the refund (if applicable) will be processed in accordance with the payment gateway or banking partner's timelines.",
      },
      {
        heading: "9. Refunds",
        body: "Approved refunds will be processed in accordance with KHAVYN's Return & Refund Policy.\n\nRefunds for prepaid transactions will generally be credited to the original payment method within 7–10 business days, although the actual credit timeline depends on the customer's bank or payment service provider.\n\nFor COD orders, any eligible refund will be processed to the customer's designated bank account or another approved refund method.",
      },
      {
        heading: "10. Fraud Prevention",
        body: "KHAVYN reserves the right to:\n\n• verify payment information;\n• request additional identity or address verification;\n• cancel or hold orders suspected of fraud or unauthorized activity;\n• restrict payment methods for customers with repeated failed deliveries, refused COD orders, chargeback abuse, or fraudulent transactions.",
      },
      {
        heading: "11. Payment Disputes",
        body: "Any payment-related dispute should be reported to KHAVYN Customer Care as soon as possible with the relevant order details and proof of payment.\n\nKHAVYN will investigate the matter and work with the payment service provider to resolve genuine disputes in accordance with applicable laws.",
      },
      {
        heading: "12. Changes to this Policy",
        body: "KHAVYN reserves the right to amend or update this Payment Policy at any time without prior notice. The latest version will always be available on www.khavyn.com and will take effect from the date of publication.",
      },
      {
        heading: "13. Contact Us",
        body: "For any payment-related queries or assistance, please contact:\n\nKHAVYN Fashion Private Limited\nCustomer Care: +91-9373205258\nEmail: complaint.khavyn@gmail.com\nWebsite: www.khavyn.com\n\nRegistered Office:\nSr. No. 80/16, Kavita Apartment,\nSamarth Nagar, New Sangavi,\nPune – 411027, Maharashtra, India\n\nBy placing an order on www.khavyn.com, you acknowledge that you have read, understood, and agreed to this Payment Policy.",
      },
    ],
  },
    cookie: {
    title: "Cookie Policy",
    date: "Effective Date: 01-09-2026",
    sections: [
      {
        heading: "Introduction",
        body: "Welcome to KHAVYN Fashion Private Limited (\"KHAVYN\", \"we\", \"our\", \"us\").\n\nThis Cookie Policy explains how KHAVYN uses cookies and similar technologies when you visit www.khavyn.com. By continuing to browse or use our website, you consent to our use of cookies as described in this policy, except where you choose to disable or manage them through your browser or our cookie preferences (where available).",
      },
      {
        heading: "1. What Are Cookies?",
        body: "Cookies are small text files that are stored on your computer, mobile device, or other internet-enabled device when you visit a website. They help websites function efficiently, remember your preferences, improve performance, and provide a more personalized browsing experience.\n\nCookies generally do not contain information that directly identifies you. However, they may be linked to information you provide to us or information collected through your use of our website.",
      },
      {
        heading: "2. Types of Cookies We Use",
        body: "a. Essential Cookies\nThese cookies are necessary for the proper operation of our website and cannot be disabled in our systems.\n\nThey help us:\n\n• Maintain secure login sessions.\n• Enable shopping cart functionality.\n• Process orders and payments.\n• Prevent fraudulent activity.\n• Protect website security.\n• Ensure basic website functionality.\n\nWithout these cookies, certain features of the website may not function properly.\n\nb. Performance and Analytics Cookies\nThese cookies help us understand how visitors interact with our website.\n\nThey may collect information such as:\n\n• Pages visited.\n• Time spent on pages.\n• Navigation patterns.\n• Website performance.\n• Error reports.\n• Device and browser information.\n\nThis information helps us improve website performance and the overall customer experience.\n\nc. Functional Cookies\nThese cookies remember your preferences to provide a more convenient browsing experience.\n\nExamples include:\n\n• Preferred language.\n• Region or location settings.\n• Saved shopping cart.\n• Recently viewed products.\n• Login preferences.\n• User interface settings.\n\nd. Marketing and Advertising Cookies\nWith your consent, these cookies may be used to:\n\n• Display relevant advertisements.\n• Measure advertising effectiveness.\n• Limit repeated advertisements.\n• Show personalized product recommendations.\n• Support remarketing campaigns.\n\nThese cookies may be placed by KHAVYN or trusted third-party advertising partners.",
      },
      {
        heading: "3. Third-Party Cookies",
        body: "Our website may use cookies provided by trusted third-party service providers, including those that support:\n\n• Payment processing.\n• Website analytics.\n• Marketing campaigns.\n• Customer support.\n• Social media integration.\n• Security and fraud prevention.\n\nThese third parties manage their own cookies in accordance with their respective privacy policies.",
      },
      {
        heading: "4. Information Collected Through Cookies",
        body: "Cookies may collect information such as:\n\n• IP Address.\n• Browser type and version.\n• Device information.\n• Operating system.\n• Referring website.\n• Pages visited.\n• Date and time of visits.\n• Session duration.\n• Clickstream data.\n• Shopping cart information.\n• General geographic location derived from your IP address.\n\nWhere required by applicable law, this information is processed in accordance with our Privacy Policy.",
      },
      {
        heading: "5. Managing Cookies",
        body: "Most web browsers allow you to:\n\n• View stored cookies.\n• Delete cookies.\n• Block cookies.\n• Configure cookie preferences.\n• Receive notifications before cookies are stored.\n\nPlease note that disabling certain cookies may affect the availability or functionality of some features on our website, including shopping cart, checkout, account login, and personalized services.",
      },
      {
        heading: "6. Cookie Retention",
        body: "Some cookies remain active only during your browsing session and are automatically deleted when you close your browser.\n\nOther cookies may remain on your device for a longer period to remember your preferences or improve future visits. The retention period varies depending on the type and purpose of the cookie.",
      },
      {
        heading: "7. Changes to this Cookie Policy",
        body: "KHAVYN may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our business practices.\n\nThe latest version will always be available on www.khavyn.com and will become effective from the date it is published.",
      },
      {
        heading: "8. Contact Us",
        body: "If you have any questions regarding this Cookie Policy or our use of cookies, please contact:\n\nKHAVYN Fashion Private Limited\nCustomer Care: +91-9373205258\nEmail: privacy@khavyn.com\nWebsite: www.khavyn.com\n\nRegistered Office:\nSr. No. 80/16, Kavita Apartment,\nSamarth Nagar, New Sangavi,\nPune – 411027, Maharashtra, India\n\nBy using www.khavyn.com, you acknowledge that you have read, understood, and agreed to this Cookie Policy.",
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
                    className={`flex items-center justify-between p-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${isActive
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
                <p className="text-sm text-[#1A1A1A]/85 leading-relaxed font-light whitespace-pre-line">
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
