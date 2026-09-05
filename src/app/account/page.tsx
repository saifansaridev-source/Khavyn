"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Package, RotateCw, User, MapPin, LogOut, ArrowRight, ShieldAlert, Upload } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "returns" | "profile">("orders");
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const { user, logout } = useUserStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const mockOrders = [
    {
      id: "KHV-849201",
      date: "2026-07-28",
      total: 5998,
      advancePaid: 2999,
      balanceDue: 2999,
      status: "Shipped",
      paymentType: "Partial COD",
      items: [
        { name: "White Signature Premium Formal Shirt", qty: 1, price: 2999, size: "M" },
        { name: "Blue Signature Premium Formal Shirt", qty: 1, price: 2999, size: "M" },
      ],
      trackingId: "AWB938201948IN",
    },
    {
      id: "KHV-719302",
      date: "2026-07-15",
      total: 2499,
      advancePaid: 2499,
      balanceDue: 0,
      status: "Delivered",
      paymentType: "Prepaid",
      items: [
        { name: "Sage Green Signature Premium Polo T-Shirt", qty: 1, price: 2499, size: "L" },
      ],
      trackingId: "AWB104928102IN",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      <AnnouncementBar />
      <Header />

      <div className="bg-[#1A1A1A] text-white py-10 px-4 text-center border-b border-[#C6A664]/30">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#C6A664] font-semibold">
          KHAVYN PRIVATE CLIENT PORTAL
        </span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-white mt-1">
          Welcome, {user?.name || "Valued Client"}
        </h1>
        <p className="text-white/40 text-xs mt-1 tracking-widest">{user?.email}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-lg p-4 space-y-2 h-fit">
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "orders"
                  ? "bg-[#1A1A1A] text-[#C6A664]"
                  : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2]"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders & Tracking</span>
            </button>

            <button
              onClick={() => setActiveTab("returns")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "returns"
                  ? "bg-[#1A1A1A] text-[#C6A664]"
                  : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2]"
              }`}
            >
              <RotateCw className="w-4 h-4" />
              <span>Return & Exchange Requests</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === "profile"
                  ? "bg-[#1A1A1A] text-[#C6A664]"
                  : "text-[#1A1A1A]/70 hover:bg-[#FAF7F2]"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Client Profile & Addresses</span>
            </button>

            <div className="pt-2 border-t border-[#D8C9B0]/50 mt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-colors text-red-500/70 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Display Box */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-bold text-[#1A1A1A] uppercase tracking-wider border-b border-[#D8C9B0]/50 pb-3">
                  Order History & Real-Time Tracking
                </h2>

                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-lg p-6 space-y-4 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D8C9B0]/40 pb-4 gap-2">
                        <div>
                          <span className="font-serif text-lg font-bold text-[#1A1A1A]">
                            Order #{order.id}
                          </span>
                          <p className="text-xs text-[#1A1A1A]/60">
                            Placed on {order.date} • {order.paymentType}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-[#1A1A1A] text-[#C6A664] rounded text-[11px] font-bold uppercase tracking-wider">
                            {order.status}
                          </span>
                          {order.status === "Delivered" && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order.id);
                                setReturnModalOpen(true);
                              }}
                              className="text-xs text-[#C6A664] hover:underline font-semibold"
                            >
                              Request Return/Exchange
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-[#1A1A1A]">
                            <span>
                              {item.name} ({item.size}) x {item.qty}
                            </span>
                            <span className="font-semibold font-numeric">
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Financial Breakdown */}
                      <div className="bg-[#FAF7F2] p-3 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-[#D8C9B0]/40">
                        <div>
                          <p className="text-[#1A1A1A]/70">
                            Total Order Value: <strong className="text-[#1A1A1A] font-numeric">₹{order.total.toLocaleString("en-IN")}</strong>
                          </p>
                          <p className="text-[11px] text-[#1A1A1A]/60">
                            Advance Paid: <span className="font-numeric">₹{order.advancePaid.toLocaleString("en-IN")}</span> | Balance Due: <span className="font-numeric">₹{order.balanceDue.toLocaleString("en-IN")}</span>
                          </p>
                        </div>
                        {order.trackingId && (
                          <span className="text-[11px] font-mono text-[#C6A664] bg-[#1A1A1A] px-2.5 py-1 rounded">
                            AWB: {order.trackingId}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "returns" && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-bold text-[#1A1A1A] uppercase tracking-wider border-b border-[#D8C9B0]/50 pb-3">
                  Return & Size Exchange Center
                </h2>

                <div className="bg-[#F0E9DD] p-4 rounded-lg border border-[#D8C9B0] text-xs text-[#1A1A1A] space-y-2">
                  <h4 className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#1A1A1A]">
                    <ShieldAlert className="w-4 h-4 text-[#C6A664]" />
                    <span>KHAVYN Return & Exchange Policy Guidelines</span>
                  </h4>
                  <p className="text-[#1A1A1A]/80 leading-relaxed font-light">
                    Requests must be submitted within 3 days of delivery. All items undergo physical quality inspection upon return. Items must be unwashed, unused, with original tags intact. Photo or video proof of defect/unboxing is required.
                  </p>
                </div>

                <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-lg p-6 text-center py-12 space-y-3">
                  <RotateCw className="w-10 h-10 text-[#C6A664] mx-auto stroke-[1.25]" />
                  <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No Active Return Requests</h3>
                  <p className="text-xs text-[#1A1A1A]/60 max-w-sm mx-auto">
                    To request a size exchange or return on a delivered order, click &quot;Request Return/Exchange&quot; under your Order History tab.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="font-serif text-xl font-bold text-[#1A1A1A] uppercase tracking-wider border-b border-[#D8C9B0]/50 pb-3">
                  Client Profile & Saved Addresses
                </h2>

                <div className="bg-[#F5F3EF] border border-[#D8C9B0]/50 rounded-lg p-6 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[#1A1A1A]/60 block font-semibold">Client Name:</span>
                      <span className="font-bold text-[#1A1A1A] text-sm">Vikramaditya Sharma</span>
                    </div>
                    <div>
                      <span className="text-[#1A1A1A]/60 block font-semibold">Email:</span>
                      <span className="font-bold text-[#1A1A1A]">vikram@example.com</span>
                    </div>
                    <div>
                      <span className="text-[#1A1A1A]/60 block font-semibold">Phone:</span>
                      <span className="font-bold text-[#1A1A1A]">+91 9876543210</span>
                    </div>
                    <div>
                      <span className="text-[#1A1A1A]/60 block font-semibold">Membership:</span>
                      <span className="font-bold text-[#C6A664] uppercase tracking-widest">KHAVYN Private Tier</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Return Request Modal */}
      {returnModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] max-w-lg w-full rounded-lg p-6 relative border border-[#C6A664] shadow-2xl space-y-4">
            <button
              onClick={() => setReturnModalOpen(false)}
              className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
            >
              ✕
            </button>

            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] uppercase tracking-wider">
              Return / Size Exchange Request ({selectedOrder})
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Return/Exchange request submitted. Our Concierge team will review your photos and respond within 24 hours.");
                setReturnModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[#1A1A1A]/70 mb-1 font-semibold">
                  Request Type *
                </label>
                <select className="w-full bg-white border border-[#D8C9B0] rounded p-2 text-[#1A1A1A]">
                  <option value="exchange">Size Exchange</option>
                  <option value="return">Refund Return</option>
                </select>
              </div>

              <div>
                <label className="block text-[#1A1A1A]/70 mb-1 font-semibold">
                  Reason for Request *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please describe the fit issue or reason..."
                  className="w-full bg-white border border-[#D8C9B0] rounded p-2 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#1A1A1A]/70 mb-1 font-semibold">
                  Upload Photo / Video Evidence (Original Tags Required) *
                </label>
                <div className="border-2 border-dashed border-[#D8C9B0] rounded-lg p-4 text-center cursor-pointer hover:border-[#C6A664] bg-white">
                  <Upload className="w-6 h-6 text-[#C6A664] mx-auto mb-1" />
                  <span className="text-[11px] text-[#1A1A1A]/70">Click or drag image file here</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] text-white py-3 rounded uppercase font-semibold tracking-widest hover:bg-[#C6A664] transition-colors"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
