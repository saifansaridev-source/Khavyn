import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { UserSessionProvider } from "@/components/auth/UserSessionProvider";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { OfferPopup } from "@/components/layout/OfferPopup";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KHAVYN | Crafting Everyday Luxury",
  description:
    "Explore timeless European luxury menswear by KHAVYN Fashion Private Limited. Premium Formal Shirts, Polo T-Shirts, Oversized T-Shirts & Round Neck T-Shirts.",
  keywords: [
    "KHAVYN",
    "Luxury Menswear",
    "Everyday Luxury",
    "Formal Shirts",
    "Polo Shirts",
    "Oversized T-Shirts",
    "Premium Indian Menswear",
  ],
  authors: [{ name: "Khavyn Fashion Private Limited" }],
  openGraph: {
    title: "KHAVYN | Crafting Everyday Luxury",
    description: "Premium European luxury fashion house for modern menswear.",
    url: "https://www.khavyn.com",
    siteName: "KHAVYN",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1A1A1A] font-sans selection:bg-[#C6A664] selection:text-white">
        <UserSessionProvider>
          {children}
          <WhatsAppButton />
          <OfferPopup />
        </UserSessionProvider>
      </body>
    </html>
  );
}

