"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { useCartStore } from "@/store/useCartStore";
import { useUserStore } from "@/store/useUserStore";
import { SHIPPING_FLAT_RATE } from "@/lib/config";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  MapPin,
} from "lucide-react";

interface SavedAddress {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user } = useUserStore();
  const subtotal = getCartTotal();
  const shippingCharge = SHIPPING_FLAT_RATE;
  const grandTotal = subtotal + shippingCharge;

  const [paymentType, setPaymentType] = useState<"prepaid" | "partial_cod">("prepaid");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState<any>(null);

  // Load saved addresses and autofill form for logged in user
  useEffect(() => {
    async function loadAddresses() {
      setIsLoadingAddresses(true);
      try {
        const res = await fetch("/api/user/addresses");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.addresses) && data.addresses.length > 0) {
            setSavedAddresses(data.addresses);
            const defaultAddr =
              data.addresses.find((a: SavedAddress) => a.isDefault) || data.addresses[0];
            setSelectedAddressId(defaultAddr._id);

            const streetParts = [
              defaultAddr.addressLine1,
              defaultAddr.addressLine2,
              defaultAddr.landmark ? `Near ${defaultAddr.landmark}` : "",
            ].filter(Boolean);

            setFormData({
              fullName: defaultAddr.fullName || user?.name || "",
              email: user?.email || "",
              phone: defaultAddr.phone || "",
              street: streetParts.join(", ") || defaultAddr.addressLine1 || "",
              city: defaultAddr.city || "",
              state: defaultAddr.state || "",
              pincode: defaultAddr.pincode || "",
            });
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load user addresses:", err);
      } finally {
        setIsLoadingAddresses(false);
      }

      // If user is logged in with no saved addresses, prefill name and email
      if (user) {
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || user.name || "",
          email: prev.email || user.email || "",
        }));
      }
    }

    loadAddresses();
  }, [user]);

  const handleSelectAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setFormData({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
      return;
    }

    const addr = savedAddresses.find((a) => a._id === addrId);
    if (addr) {
      const streetParts = [
        addr.addressLine1,
        addr.addressLine2,
        addr.landmark ? `Near ${addr.landmark}` : "",
      ].filter(Boolean);

      setFormData({
        fullName: addr.fullName || user?.name || "",
        email: user?.email || "",
        phone: addr.phone || "",
        street: streetParts.join(", ") || addr.addressLine1 || "",
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pincode || "",
      });
    }
  };

  // 50% advance includes subtotal + shipping charge
  const advanceToPay =
    paymentType === "prepaid" ? grandTotal : Math.round(grandTotal * 0.5);
  const codBalanceRemaining = grandTotal - advanceToPay;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setCheckoutError(null);

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
        setCheckoutError(orderData.error || "Failed to create order. Please check details and try again.");
        setIsSubmitting(false);
        return;
      }

      // 2. Client Razorpay Checkout Modal
      const options = {
        key: orderData.key,
        amount: orderData.amount * 100, // in paise
        currency: "INR",
        name: "KHAVYN",
        description:
          paymentType === "prepaid"
            ? "100% Prepaid Luxury Order"
            : "50% Advance Payment for Partial COD",
        order_id: orderData.razorpayOrderId.startsWith("order_mock_")
          ? undefined
          : orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            setIsSubmitting(true);
            // Verify payment server-side before confirming order
            const verifyRes = await fetch("/api/checkout/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || orderData.razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderNumber: orderData.orderNumber,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              setOrderConfirmed(verifyData);
            } else {
              setCheckoutError(
                verifyData.error ||
                  "Payment verification failed. Your order has not been placed. Please retry or contact support."
              );
            }
          } catch (verifyErr: any) {
            console.error("[Verification Network Error]:", verifyErr);
            setCheckoutError("Payment verification network error. Please try again.");
          } finally {
            setIsSubmitting(false);
          }
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
      if (typeof window !== "undefined" && (window as any).Razorpay && !orderData.isMockOrder) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (failureResponse: any) {
          console.error("Razorpay payment failed:", failureResponse.error);
          setCheckoutError(
            failureResponse.error?.description ||
              "Payment failed or was declined by the bank. Please retry."
          );
          setIsSubmitting(false);
        });
        rzp.open();
      } else if (orderData.isMockOrder) {
        // Fallback for development / demo mode when Razorpay credentials are placeholder
        console.warn("[KHAVYN] Executing in demo mode (Razorpay mock order)");
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
        if (verifyData.success) {
          clearCart();
          setOrderConfirmed(verifyData);
        } else {
          setCheckoutError(verifyData.error || "Payment verification failed in demo mode.");
        }
        setIsSubmitting(false);
      } else {
        // Gateway SDK loading delay
        setCheckoutError(
          "Payment gateway is loading. Please wait a moment and click Pay again."
        );
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Checkout submit error:", err);
      setCheckoutError("Error initiating checkout. Please try again.");
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
            Order <strong className="text-[#1A1A1A]">{orderConfirmed.orderNumber}</strong> has been placed successfully. A confirmation email has been dispatched to your inbox.
          </p>

          <div className="bg-[#F5F3EF] border border-[#D8C9B0] p-6 rounded-lg text-left space-y-3 text-xs max-w-md mx-auto shadow-sm">
            <div className="flex justify-between border-b border-[#D8C9B0]/40 pb-2">
              <span className="text-[#1A1A1A]/60">Payment Mode:</span>
              <span className="font-semibold uppercase text-[#1A1A1A]">
                {orderConfirmed.paymentType === "partial_cod"
                  ? "Partial COD (50% Advance)"
                  : "100% Prepaid (Razorpay)"}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D8C9B0]/40 pb-2">
              <span className="text-[#1A1A1A]/60">Item Subtotal:</span>
              <span className="font-semibold font-numeric text-[#1A1A1A]">
                ₹{(orderConfirmed.subtotal ?? (orderConfirmed.totalAmount - (orderConfirmed.shippingCharge ?? SHIPPING_FLAT_RATE)))?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D8C9B0]/40 pb-2">
              <span className="text-[#1A1A1A]/60">Shipping (Flat Rate):</span>
              <span className="font-semibold font-numeric text-[#1A1A1A]">
                ₹{(orderConfirmed.shippingCharge ?? SHIPPING_FLAT_RATE)?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D8C9B0]/40 pb-2">
              <span className="text-[#1A1A1A]/60 font-medium">Total Order Value:</span>
              <span className="font-bold font-numeric text-[#1A1A1A]">
                ₹{orderConfirmed.totalAmount?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#D8C9B0]/40 pb-2">
              <span className="text-[#1A1A1A]/60">Advance Paid via Razorpay:</span>
              <span className="font-semibold font-numeric text-[#C6A664]">
                ₹{orderConfirmed.advancePaid?.toLocaleString("en-IN")}
              </span>
            </div>
            {orderConfirmed.balanceDue > 0 && (
              <div className="flex justify-between font-bold text-[#1A1A1A] pt-1">
                <span>Cash Payable on Delivery:</span>
                <span className="font-numeric text-amber-800">
                  ₹{orderConfirmed.balanceDue?.toLocaleString("en-IN")}
                </span>
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
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
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

                {/* Saved Address Selector (Autofill support) */}
                {savedAddresses.length > 0 && (
                  <div className="bg-white border border-[#D8C9B0] rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] uppercase tracking-wider font-bold text-[#1A1A1A] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C6A664]" />
                        <span>Select From Saved Addresses</span>
                      </label>
                      <span className="text-[10px] text-[#C6A664] font-medium font-mono">
                        {savedAddresses.length} saved
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr._id;
                        return (
                          <div
                            key={addr._id}
                            onClick={() => handleSelectAddress(addr._id)}
                            className={`p-3 rounded border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                              isSelected
                                ? "border-[#1A1A1A] bg-[#FAF7F2] ring-1 ring-[#1A1A1A]"
                                : "border-[#D8C9B0]/60 hover:border-[#1A1A1A]/40 bg-white"
                            }`}
                          >
                            <input
                              type="radio"
                              name="savedAddressOption"
                              checked={isSelected}
                              onChange={() => handleSelectAddress(addr._id)}
                              className="mt-0.5 text-[#1A1A1A] focus:ring-[#C6A664] cursor-pointer"
                            />
                            <div className="flex-1 space-y-0.5 leading-snug">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#1A1A1A]">{addr.fullName}</span>
                                <span className="px-1.5 py-0.5 bg-[#1A1A1A]/5 text-[#1A1A1A] text-[9px] font-mono rounded uppercase font-semibold">
                                  {addr.label}
                                </span>
                                {addr.isDefault && (
                                  <span className="text-[9px] text-[#C6A664] font-semibold tracking-wide uppercase">
                                    • Default Address
                                  </span>
                                )}
                              </div>
                              <p className="text-[#1A1A1A]/80 text-[11px]">
                                {[addr.addressLine1, addr.addressLine2, addr.landmark].filter(Boolean).join(", ")}
                              </p>
                              <p className="text-[#1A1A1A]/70 text-[11px]">
                                {addr.city}, {addr.state} — <span className="font-mono">{addr.pincode}</span> | Tel: {addr.phone}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      <div
                        onClick={() => handleSelectAddress("new")}
                        className={`p-2.5 rounded border text-xs cursor-pointer transition-all flex items-center gap-2.5 ${
                          selectedAddressId === "new"
                            ? "border-[#1A1A1A] bg-[#FAF7F2] ring-1 ring-[#1A1A1A]"
                            : "border-[#D8C9B0]/60 hover:border-[#1A1A1A]/40 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="savedAddressOption"
                          checked={selectedAddressId === "new"}
                          onChange={() => handleSelectAddress("new")}
                          className="text-[#1A1A1A] focus:ring-[#C6A664] cursor-pointer"
                        />
                        <span className="font-semibold text-[#1A1A1A]">
                          + Deliver to a new / different address
                        </span>
                      </div>
                    </div>
                  </div>
                )}

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

                  <div className="sm:col-span-2">
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
                    onClick={() => setPaymentType("prepaid")}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentType === "prepaid"
                        ? "bg-white border-[#C6A664] ring-2 ring-[#C6A664]/30"
                        : "bg-[#FAF7F2] border-[#D8C9B0] hover:border-[#1A1A1A]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentType"
                          checked={paymentType === "prepaid"}
                          onChange={() => setPaymentType("prepaid")}
                          className="accent-[#C6A664]"
                        />
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-[#C6A664]" />
                            Full Online Payment (Razorpay 100% Prepaid)
                          </span>
                          <p className="text-[11px] text-[#1A1A1A]/60 mt-0.5">
                            Pay 100% upfront via UPI, Credit/Debit Cards, Net Banking, or Wallets. Instant order processing.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-numeric text-[#C6A664]">
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
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-2">
                            <Truck className="w-3.5 h-3.5 text-[#C6A664]" />
                            Partial COD (50% Advance via Razorpay)
                          </span>
                          <p className="text-[11px] text-[#1A1A1A]/60 mt-0.5">
                            Pay 50% advance now online via Razorpay to confirm dispatch; pay remaining 50% in cash upon delivery.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold font-numeric text-[#C6A664]">
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
                          <span className="font-semibold font-numeric text-[#1A1A1A]">
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                          {item.compareAtPrice && item.compareAtPrice > item.price && (
                            <span className="text-[10px] text-[#1A1A1A]/40 line-through font-numeric">
                              ₹{(item.compareAtPrice * item.quantity).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal, Shipping, and Total line items */}
                <div className="space-y-2 text-xs border-t border-[#D8C9B0]/50 pt-4">
                  <div className="flex justify-between text-[#1A1A1A]/70">
                    <span>Item Subtotal</span>
                    <span className="font-semibold font-numeric text-[#1A1A1A]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#1A1A1A]/70">
                    <span>Shipping Charge (Flat Rate)</span>
                    <span className="font-semibold font-numeric text-[#1A1A1A]">
                      ₹{shippingCharge.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between font-serif text-base font-bold text-[#1A1A1A] border-t border-[#D8C9B0]/50 pt-3">
                    <span>Total Order Value</span>
                    <span className="font-numeric">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Advance vs COD Balance Breakdown */}
                <div className="bg-[#F0E9DD] p-3.5 rounded text-xs space-y-1.5 border border-[#D8C9B0]">
                  <div className="flex justify-between font-semibold text-[#1A1A1A]">
                    <span>Amount Payable Now (Razorpay):</span>
                    <span className="text-[#C6A664] font-bold font-numeric text-sm">
                      ₹{advanceToPay.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {paymentType === "partial_cod" ? (
                    <div className="flex justify-between text-[#1A1A1A]/70 text-[11px] pt-1 border-t border-[#D8C9B0]/60">
                      <span>Remaining Cash Balance on Delivery:</span>
                      <span className="font-bold font-numeric text-amber-800">
                        ₹{codBalanceRemaining.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-emerald-800 font-medium">
                      ✓ 100% Paid Online. No cash payment needed upon delivery.
                    </p>
                  )}
                </div>

                {/* Error Banner with Retry */}
                {checkoutError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-lg flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">Payment / Order Failed</p>
                      <p className="text-[11px] text-red-600 mt-0.5">{checkoutError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCheckoutError(null)}
                      className="text-red-400 hover:text-red-700 font-bold ml-1 text-sm leading-none"
                      aria-label="Dismiss error"
                    >
                      ×
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:shadow-xl py-4 rounded font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-[#C6A664] animate-spin" />
                      <span>PROCESSING PAYMENT...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#C6A664]" />
                      <span>
                        {paymentType === "partial_cod"
                          ? `PAY ₹${advanceToPay.toLocaleString("en-IN")} ADVANCE & CONFIRM`
                          : `PAY ₹${advanceToPay.toLocaleString("en-IN")} & CONFIRM ORDER`}
                      </span>
                    </>
                  )}
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
