"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useCartStore } from "@/store/useCartStore";
import { ShieldCheck, Truck, CreditCard, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const subtotal = getCartTotal();

  const freeShippingThreshold = 2499;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + shippingFee;

  const [paymentType, setPaymentType] = useState<"full" | "partial_cod">("full");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);

  const advanceToPay = paymentType === "full" ? grandTotal : Math.round(grandTotal * 0.5);
  const codBalanceRemaining = grandTotal - advanceToPay;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      // 1. Create order on server
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: formData,
          paymentType,
        }),
      });

      const orderData = await res.json();

      if (!orderData.success) {
        alert(orderData.error || "Failed to create order");
        setIsSubmitting(false);
        return;
      }

      // 2. Client Razorpay Checkout Modal
      const options = {
        key: orderData.key,
        amount: orderData.amount * 100,
        currency: "INR",
        name: "KHAVYN",
        description:
          paymentType === "full"
            ? "100% Prepaid Luxury Order"
            : "50% Advance Payment for Partial COD",
        order_id: orderData.razorpayOrderId.startsWith("order_mock_")
          ? undefined
          : orderData.razorpayOrderId,
        handler: async function (response: any) {
          // Verify payment server-side
          const verifyRes = await fetch("/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || orderData.razorpayOrderId,
              razorpay_payment_id: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || "signature_demo",
              orderNumber: orderData.orderNumber,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            setOrderConfirmed(verifyData);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
          setIsSubmitting(false);
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#1A1A1A",
        },
      };

      // Check if Razorpay SDK script is loaded in browser
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback for demo mode
        console.warn("Razorpay SDK script not present, triggering demo confirmation");
        setTimeout(async () => {
          const verifyRes = await fetch("/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: orderData.razorpayOrderId,
              razorpay_payment_id: `pay_mock_${Date.now()}`,
              razorpay_signature: "signature_demo",
              orderNumber: orderData.orderNumber,
            }),
          });
          const verifyData = await verifyRes.json();
          clearCart();
          setOrderConfirmed(verifyData);
          setIsSubmitting(false);
        }, 1000);
      }
    } catch (err: any) {
      console.error("Checkout submit error:", err);
      alert("Error initiating checkout. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
        <AnnouncementBar />
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6 flex-1">
          <div className="w-16 h-16 bg-[#C6A664]/20 rounded-full flex items-center justify-center mx-auto text-[#C6A664]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#C6A664]">
            ORDER CONFIRMED
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A]">
            Thank You for Your Order
          </h1>
          <p className="text-sm text-[#1A1A1A]/70 max-w-md mx-auto">
            Order <strong className="text-[#1A1A1A]">{orderConfirmed.orderNumber}</strong> has been placed. Confirmation email sent to your inbox.
          </p>

          <div className="bg-[#F5F3EF] border border-[#D8C9B0] p-6 rounded-lg text-left space-y-3 text-xs max-w-md mx-auto">
            <div className="flex justify-between border-b border-[#D8C9B0]/40 pb-2">
              <span className="text-[#1A1A1A]/60">Payment Mode:</span>
              <span className="font-semibold uppercase text-[#1A1A1A]">
                {orderConfirmed.paymentType === "full" ? "100% Prepaid" : "Partial COD (50% Advance)"}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D8C9B0]/40 pb-2">
              <span className="text-[#1A1A1A]/60">Advance Paid via Razorpay:</span>
              <span className="font-semibold text-[#C6A664]">
                ₹{orderConfirmed.advancePaid?.toLocaleString("en-IN")}
              </span>
            </div>
            {orderConfirmed.balanceDue > 0 && (
              <div className="flex justify-between font-bold text-[#1A1A1A]">
                <span>Cash Payable on Delivery:</span>
                <span>₹{orderConfirmed.balanceDue?.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          <div className="pt-6">
            <Link
              href="/shop"
              className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] px-8 py-3.5 rounded text-xs uppercase font-semibold tracking-widest transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]/60 hover:text-[#C6A664] mb-6 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Cart</span>
        </Link>

        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-8">
          Secure Luxury Checkout
        </h1>

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="font-serif text-xl text-[#1A1A1A]">Your shopping bag is empty.</p>
            <Link
              href="/shop"
              className="bg-[#1A1A1A] text-white text-xs uppercase tracking-widest px-6 py-3 rounded inline-block hover:bg-[#C6A664]"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Shipping & Payment Info (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Shipping Address Form */}
              <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 p-6 rounded-lg space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A] uppercase tracking-wider border-b border-[#D8C9B0]/50 pb-3">
                  1. Shipping & Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#1A1A1A]/70 mb-1 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Vikramaditya Sharma"
                      className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A1A1A]/70 mb-1 font-semibold">
                      Phone Number (For Delivery SMS) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#1A1A1A]/70 mb-1 font-semibold">
                      Email Address (For Order Receipts) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="vikram@example.com"
                      className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#1A1A1A]/70 mb-1 font-semibold">
                      Street Address & Flat / House No *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="House/Flat No., Apartment name, Street"
                      className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A1A1A]/70 mb-1 font-semibold">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai / Pune"
                      className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A1A1A]/70 mb-1 font-semibold">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A1A1A]/70 mb-1 font-semibold">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Type Selection */}
              <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 p-6 rounded-lg space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A] uppercase tracking-wider border-b border-[#D8C9B0]/50 pb-3">
                  2. Select Payment Method
                </h3>

                <div className="space-y-3">
                  {/* Full Prepaid Option */}
                  <label
                    onClick={() => setPaymentType("full")}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentType === "full"
                        ? "bg-white border-[#C6A664] ring-2 ring-[#C6A664]/30"
                        : "bg-[#FAF7F2] border-[#D8C9B0] hover:border-[#1A1A1A]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentType"
                          checked={paymentType === "full"}
                          onChange={() => setPaymentType("full")}
                          className="accent-[#C6A664]"
                        />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                            Full Online Payment (Razorpay Prepaid)
                          </span>
                          <p className="text-[11px] text-[#1A1A1A]/60">
                            Pay 100% via UPI, Credit/Debit Cards, Net Banking, or Wallets. Fast processing.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#C6A664]">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </label>

                  {/* Partial COD Option */}
                  <label
                    onClick={() => setPaymentType("partial_cod")}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentType === "partial_cod"
                        ? "bg-white border-[#C6A664] ring-2 ring-[#C6A664]/30"
                        : "bg-[#FAF7F2] border-[#D8C9B0] hover:border-[#1A1A1A]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentType"
                          checked={paymentType === "partial_cod"}
                          onChange={() => setPaymentType("partial_cod")}
                          className="accent-[#C6A664]"
                        />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                            Partial COD (50% Advance via Razorpay)
                          </span>
                          <p className="text-[11px] text-[#1A1A1A]/60">
                            Pay 50% advance online via Razorpay now to confirm order; remaining 50% cash on delivery.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#C6A664]">
                        ₹{advanceToPay.toLocaleString("en-IN")} now
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Summary Box (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 p-6 rounded-lg space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A] uppercase tracking-wider border-b border-[#D8C9B0]/50 pb-3">
                  Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
                </h3>

                <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs border-b border-[#D8C9B0]/30 pb-3">
                      <div className="relative w-12 h-14 bg-white rounded border border-gray-200 overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-serif font-medium text-[#1A1A1A] line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#1A1A1A]/60">
                          Qty: {item.quantity} | Size: {item.size}
                        </p>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-semibold text-[#1A1A1A]">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                          {item.compareAtPrice && item.compareAtPrice > item.price && (
                            <span className="text-[10px] text-[#1A1A1A]/40 line-through">
                              ₹{(item.compareAtPrice * item.quantity).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-xs border-t border-[#D8C9B0]/50 pt-4">
                  <div className="flex justify-between text-[#1A1A1A]/70">
                    <span>Item Subtotal</span>
                    <span className="font-semibold text-[#1A1A1A]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#1A1A1A]/70">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-emerald-800">
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between font-serif text-base font-bold text-[#1A1A1A] border-t border-[#D8C9B0]/50 pt-3">
                    <span>Total Order Value</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Advance vs COD Balance Breakdown */}
                <div className="bg-[#F0E9DD] p-3 rounded text-xs space-y-1 border border-[#D8C9B0]">
                  <div className="flex justify-between font-semibold text-[#1A1A1A]">
                    <span>Amount Payable Now (Razorpay):</span>
                    <span className="text-[#C6A664] font-bold">
                      ₹{advanceToPay.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {paymentType === "partial_cod" && (
                    <div className="flex justify-between text-[#1A1A1A]/70 text-[11px]">
                      <span>Remaining Cash Balance on Delivery:</span>
                      <span className="font-semibold">
                        ₹{codBalanceRemaining.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:shadow-xl py-4 rounded font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#C6A664]" />
                  <span>
                    {isSubmitting
                      ? "INITIATING SECURE PAYMENT..."
                      : `PAY ₹${advanceToPay.toLocaleString("en-IN")} & CONFIRM ORDER`}
                  </span>
                </button>

                <p className="text-[10px] text-[#1A1A1A]/50 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C6A664]" />
                  <span>256-Bit SSL Encrypted Razorpay Gateway</span>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
}
