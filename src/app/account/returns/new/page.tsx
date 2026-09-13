"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { DragDropUpload } from "@/components/admin/DragDropUpload";
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
  MessageSquare,
  HelpCircle,
  Box,
  Plus,
  Trash2,
} from "lucide-react";

function ReturnRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [isDelivered, setIsDelivered] = useState(false);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Form state
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [requestType, setRequestType] = useState<"return" | "exchange">("exchange");
  const [reason, setReason] = useState<string>("Incorrect size");
  const [exchangeSize, setExchangeSize] = useState<string>("L");
  const [images, setImages] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      setCheckError("No orderId was provided. Please select an order from your dashboard.");
      setLoading(false);
      return;
    }

    fetch(`/api/returns/check?orderId=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrderData(data.order);
          setIsDelivered(data.isDelivered);
          setIsWindowOpen(data.isWindowOpen);
          setDaysRemaining(data.daysRemaining);
          setExistingRequest(data.existingRequest);

          // Pre-select first item
          if (data.order?.items && data.order.items.length > 0) {
            setSelectedProductId(data.order.items[0].productId || data.order.items[0].name);
          }
        } else {
          setCheckError(data.error || "Failed to inspect order eligibility.");
        }
      })
      .catch((err) => {
        setCheckError("Network error checking return eligibility.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  const handleImageChange = (index: number, url: string) => {
    const updated = [...images];
    updated[index] = url;
    setImages(updated);
  };

  const handleAddImageSlot = () => {
    if (images.length < 4) {
      setImages([...images, ""]);
    }
  };

  const handleRemoveImageSlot = (index: number) => {
    if (images.length > 1) {
      const updated = images.filter((_, i) => i !== index);
      setImages(updated);
    } else {
      setImages([""]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validImages = images.filter((img) => img && img.trim() !== "");
    if (validImages.length === 0) {
      setSubmitError(
        "Mandatory Photo Proof Required: Please upload at least one clear photo of the garment with brand tags intact before submitting."
      );
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          productId: selectedProductId,
          type: requestType,
          reason,
          exchangeSize: requestType === "exchange" ? exchangeSize : undefined,
          images: validImages,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(data.returnRequest);
      } else {
        setSubmitError(data.error || "Failed to submit request.");
      }
    } catch {
      setSubmitError("Failed to submit request due to a network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {/* Back Link */}
        <Link
          href="/account/dashboard?tab=orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]/60 hover:text-[#C6A664] mb-6 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>

        {loading ? (
          <div className="bg-[#F5F3EF] border border-[#D8C9B0] rounded-xl p-12 text-center text-xs text-[#1A1A1A]/60">
            Checking order delivery verification and policy window...
          </div>
        ) : checkError ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
            <h2 className="font-serif text-xl font-bold text-red-900">Order Verification Issue</h2>
            <p className="text-xs text-red-700 max-w-md mx-auto">{checkError}</p>
            <Link
              href="/account/dashboard?tab=orders"
              className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider inline-block"
            >
              Return to Orders
            </Link>
          </div>
        ) : submitSuccess ? (
          /* ================================================================ */
          /* SUCCESS CONFIRMATION STATE */
          /* ================================================================ */
          <div className="bg-[#F5F3EF] border border-[#D8C9B0] rounded-xl p-8 sm:p-12 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 bg-[#C6A664]/20 rounded-full flex items-center justify-center mx-auto text-[#C6A664]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C6A664] font-bold block">
              REQUEST SUBMITTED &amp; PENDING REVIEW
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Your {requestType === "exchange" ? "Size Exchange" : "Return"} Request is Registered
            </h1>
            <p className="text-xs text-[#1A1A1A]/70 max-w-lg mx-auto leading-relaxed">
              We have received your photo proof and reason details for Order{" "}
              <strong className="text-[#1A1A1A]">#{orderId}</strong>. Our quality inspection desk will review the garment photos within <strong>24 business hours</strong>.
            </p>

            <div className="bg-white border border-[#D8C9B0]/60 p-5 rounded-lg text-left text-xs max-w-md mx-auto space-y-2.5">
              <div className="flex justify-between border-b border-[#D8C9B0]/30 pb-2">
                <span className="text-[#1A1A1A]/60">Request Type:</span>
                <span className="font-semibold uppercase text-[#1A1A1A]">
                  {submitSuccess.type}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#D8C9B0]/30 pb-2">
                <span className="text-[#1A1A1A]/60">Selected Reason:</span>
                <span className="font-semibold text-[#1A1A1A]">{submitSuccess.reason}</span>
              </div>
              {submitSuccess.exchangeSize && (
                <div className="flex justify-between border-b border-[#D8C9B0]/30 pb-2">
                  <span className="text-[#1A1A1A]/60">Requested Replacement Size:</span>
                  <span className="font-bold text-[#C6A664]">{submitSuccess.exchangeSize}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#1A1A1A]/60">Initial Status:</span>
                <span className="font-bold uppercase text-amber-700">
                  {submitSuccess.status}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Link
                href="/account/dashboard?tab=orders"
                className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] px-8 py-3 rounded text-xs font-semibold uppercase tracking-widest transition-colors inline-block"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : !isDelivered ? (
          /* ================================================================ */
          /* ORDER NOT YET DELIVERED */
          /* ================================================================ */
          <div className="bg-[#F5F3EF] border border-[#D8C9B0] rounded-xl p-8 sm:p-12 text-center space-y-4">
            <Clock className="w-12 h-12 text-[#C6A664] mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Parcel Still In Transit / Not Delivered
            </h2>
            <p className="text-xs text-[#1A1A1A]/70 max-w-md mx-auto leading-relaxed">
              In accordance with KHAVYN policies, returns and size exchanges can only be initiated <strong>after</strong> your order has been marked as delivered by the courier.
            </p>
            <div className="pt-4">
              <Link
                href="/account/dashboard?tab=orders"
                className="bg-[#1A1A1A] text-white hover:bg-[#C6A664] px-6 py-2.5 rounded text-xs font-semibold uppercase tracking-wider inline-block"
              >
                View Order Status
              </Link>
            </div>
          </div>
        ) : !isWindowOpen ? (
          /* ================================================================ */
          /* 3-DAY WINDOW CLOSED */
          /* ================================================================ */
          <div className="bg-[#F5F3EF] border border-amber-300 rounded-xl p-8 sm:p-12 text-center space-y-4">
            <ShieldAlert className="w-12 h-12 text-amber-700 mx-auto" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-800">
              POLICY WINDOW EXPIRED
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Return &amp; Exchange Window Has Closed
            </h2>
            <p className="text-xs text-[#1A1A1A]/70 max-w-lg mx-auto leading-relaxed">
              Per KHAVYN's Return &amp; Exchange Policy, requests must be submitted within <strong>3 calendar days</strong> of the verified delivery date. The window for Order <strong>#{orderId}</strong> has lapsed.
            </p>
            <p className="text-[11px] text-[#1A1A1A]/60 max-w-md mx-auto">
              If you have experienced an exceptional manufacturing flaw, please contact our VIP Concierge directly with your order receipt.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <a
                href="https://wa.me/919373205258?text=Hello%20KHAVYN%20Team,%20inquiry%20regarding%20return%20for%20order%20"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C6A664] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Concierge (+91 93732 05258)</span>
              </a>
            </div>
          </div>
        ) : (
          /* ================================================================ */
          /* VALID RETURN FORM (WINDOW OPEN) */
          /* ================================================================ */
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-[11px] font-semibold mb-2">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Return Window Open &bull; {daysRemaining} days remaining</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                Request Return or Size Exchange
              </h1>
              <p className="text-xs text-[#1A1A1A]/60 mt-1">
                Order #{orderId} &bull; Verified delivery within 3-day policy period.
              </p>
            </div>

            {existingRequest && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg text-xs space-y-1">
                <p className="font-bold">⚠️ An existing request is already on file for this order:</p>
                <p>Status: <strong className="uppercase">{existingRequest.status}</strong> &bull; Type: {existingRequest.type}</p>
                <p className="text-[11px] text-amber-800">Submitting again will create a secondary inquiry for review.</p>
              </div>
            )}

            {submitError && (
              <div className="p-3.5 rounded-lg text-xs bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#F5F3EF] border border-[#D8C9B0]/70 rounded-xl p-6 sm:p-8 space-y-6 text-xs shadow-sm">
              {/* 1. Request Type */}
              <div className="space-y-2">
                <label className="block text-[#1A1A1A] font-bold uppercase tracking-wider text-[11px]">
                  1. Select Request Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRequestType("exchange")}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                      requestType === "exchange"
                        ? "bg-white border-[#C6A664] ring-2 ring-[#C6A664]/30"
                        : "bg-[#FAF7F2] border-[#D8C9B0] hover:border-[#1A1A1A]"
                    }`}
                  >
                    <div className="font-bold text-xs text-[#1A1A1A]">Size Exchange</div>
                    <p className="text-[10px] text-[#1A1A1A]/60 mt-0.5">
                      Fast door-to-door replacement for a different size.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestType("return")}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                      requestType === "return"
                        ? "bg-white border-[#C6A664] ring-2 ring-[#C6A664]/30"
                        : "bg-[#FAF7F2] border-[#D8C9B0] hover:border-[#1A1A1A]"
                    }`}
                  >
                    <div className="font-bold text-xs text-[#1A1A1A]">Return &amp; Refund</div>
                    <p className="text-[10px] text-[#1A1A1A]/60 mt-0.5">
                      Return garment for store credit or source account refund.
                    </p>
                  </button>
                </div>
              </div>

              {/* 2. Select Garment */}
              <div className="space-y-2">
                <label className="block text-[#1A1A1A] font-bold uppercase tracking-wider text-[11px]">
                  2. Select Item from Order *
                </label>
                <div className="space-y-2">
                  {(orderData?.items || []).map((item: any) => {
                    const isSelected = selectedProductId === (item.productId || item.name);

                    return (
                      <label
                        key={item.productId || item.name}
                        onClick={() => setSelectedProductId(item.productId || item.name)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-white border-[#C6A664] ring-2 ring-[#C6A664]/20"
                            : "bg-[#FAF7F2] border-[#D8C9B0]/60 hover:border-[#1A1A1A]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="returnItem"
                            checked={isSelected}
                            onChange={() => setSelectedProductId(item.productId || item.name)}
                            className="accent-[#C6A664]"
                          />
                          <div>
                            <p className="font-semibold text-xs text-[#1A1A1A]">{item.name}</p>
                            <p className="text-[11px] text-[#1A1A1A]/60">
                              Size: {item.size || "M"} &bull; Qty: {item.quantity} &bull; ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-xs text-[#1A1A1A] font-numeric">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Reason & Replacement Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#1A1A1A] font-bold uppercase tracking-wider text-[11px] mb-1">
                    3. Reason for {requestType === "exchange" ? "Exchange" : "Return"} *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                  >
                    <option value="Incorrect size">Incorrect size (Too tight / Too loose)</option>
                    <option value="Incorrect product">Incorrect product or colour received</option>
                    <option value="Manufacturing defect">Manufacturing defect / Stitching flaw</option>
                    <option value="Damaged in transit">Damaged in transit</option>
                    <option value="Other">Other reason</option>
                  </select>
                </div>

                {requestType === "exchange" && (
                  <div>
                    <label className="block text-[#1A1A1A] font-bold uppercase tracking-wider text-[11px] mb-1">
                      Requested Replacement Size *
                    </label>
                    <select
                      value={exchangeSize}
                      onChange={(e) => setExchangeSize(e.target.value)}
                      className="w-full bg-white border border-[#D8C9B0] rounded p-2.5 text-[#1A1A1A] focus:outline-none focus:border-[#C6A664]"
                    >
                      <option value="S">Small (S)</option>
                      <option value="M">Medium (M)</option>
                      <option value="L">Large (L)</option>
                      <option value="XL">Extra Large (XL)</option>
                      <option value="XXL">Double Extra Large (XXL)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 4. MANDATORY PHOTO PROOF (reusing DragDropUpload) */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[#1A1A1A] font-bold uppercase tracking-wider text-[11px]">
                    4. Mandatory Photo Proof (At least 1 photo required) *
                  </label>
                  <p className="text-[11px] text-[#1A1A1A]/60 mt-0.5">
                    Upload clear photos of the garment with brand tags and matte collar labels intact, plus any flaw close-ups.
                  </p>
                </div>

                <div className="space-y-4">
                  {images.map((imgUrl, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-[#D8C9B0]/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#1A1A1A]">
                          Photo Proof #{index + 1} {index === 0 ? "(Mandatory)" : "(Optional Additional)"}
                        </span>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImageSlot(index)}
                            className="text-red-500 hover:text-red-700 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <DragDropUpload
                        label={`Upload Photo Proof #${index + 1}`}
                        value={imgUrl}
                        onChange={(url) => handleImageChange(index, url)}
                        folder="khavyn/returns"
                        helperText="Upload JPG/PNG/WebP photo. Tags must be clearly visible."
                      />
                    </div>
                  ))}

                  {images.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddImageSlot}
                      className="inline-flex items-center gap-1.5 text-xs text-[#1A1A1A] hover:text-[#C6A664] border border-dashed border-[#D8C9B0] hover:border-[#C6A664] px-4 py-2 rounded-lg transition-colors font-medium bg-white/50 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C6A664]" />
                      <span>Add Another Photo Proof Slot</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Policy agreement reminder */}
              <div className="bg-[#FAF7F2] p-4 rounded-lg border border-[#D8C9B0]/40 text-[11px] text-[#1A1A1A]/70 space-y-1">
                <p className="font-bold text-[#1A1A1A]">KHAVYN Return Conditions:</p>
                <p>&bull; Garment must be unworn, unwashed, and in pristine condition with all tags affixed.</p>
                <p>&bull; Reverse pickup is arranged by our courier partner within 48 hours of photo approval.</p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1A1A1A] text-white hover:bg-[#C6A664] hover:text-[#1A1A1A] py-4 rounded font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
                >
                  {submitting
                    ? "VALIDATING & SUBMITTING REQUEST..."
                    : `SUBMIT ${requestType === "exchange" ? "EXCHANGE" : "RETURN"} REQUEST FOR REVIEW`}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function NewReturnRequestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C6A664] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ReturnRequestContent />
    </Suspense>
  );
}

