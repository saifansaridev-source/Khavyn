"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, CheckCircle, XCircle, Trash2, MessageSquare, ArrowLeft, ShieldCheck } from "lucide-react";

interface ReviewItem {
  _id: string;
  productSlug: string;
  productName: string;
  userName: string;
  userEmail: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status: "pending" | "approved" | "rejected";
  storeResponse?: string;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (reviewId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleSaveResponse = async (reviewId: string) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, storeResponse: responseText }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? { ...r, storeResponse: responseText } : r))
        );
        setActiveReplyId(null);
        setResponseText("");
      }
    } catch (err) {
      console.error("Failed to save store response", err);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to remove this review permanently?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${reviewId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      }
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  const filteredReviews = reviews.filter((r) =>
    filterStatus === "all" ? true : r.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-[#C6A664]/30 pb-6">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-xs text-[#C6A664] hover:underline flex items-center gap-1.5 mb-2 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Executive Dashboard</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-[#C6A664] tracking-wider uppercase">
              Product Review Moderation Queue
            </h1>
            <p className="text-xs text-white/60 mt-1">
              Curate customer reviews to maintain KHAVYN's luxury brand standards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {["all", "pending", "approved", "rejected"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded text-xs uppercase font-semibold tracking-wider transition-all ${
                  filterStatus === st
                    ? "bg-[#C6A664] text-black"
                    : "bg-[#2A2A2A] text-white/70 hover:bg-[#333]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/40 text-sm">
            Loading reviews queue...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-[#222] border border-white/10 rounded-xl p-12 text-center text-white/50 text-sm">
            No reviews found matching status "{filterStatus}".
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-[#222] border border-white/10 rounded-xl p-6 space-y-4 relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">{rev.userName}</span>
                      <span className="text-xs text-white/40">({rev.userEmail})</span>
                      {rev.isVerifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#C6A664] font-mono mt-0.5">
                      Product: {rev.productName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded border ${
                        rev.status === "approved"
                          ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                          : rev.status === "rejected"
                          ? "bg-red-950 text-red-300 border-red-700"
                          : "bg-amber-950 text-amber-300 border-amber-700"
                      }`}
                    >
                      {rev.status}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {rev.status !== "approved" && (
                        <button
                          onClick={() => handleUpdateStatus(rev._id, "approved")}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 font-medium transition-colors"
                          title="Approve Review"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {rev.status !== "rejected" && (
                        <button
                          onClick={() => handleUpdateStatus(rev._id, "rejected")}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 font-medium transition-colors"
                          title="Reject Review"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="bg-red-900/60 hover:bg-red-800 text-red-300 text-xs p-2 rounded transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rating & Content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#C6A664]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rev.rating ? "fill-[#C6A664]" : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                    {rev.title && (
                      <span className="font-semibold text-white text-xs">{rev.title}</span>
                    )}
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed bg-[#1A1A1A] p-3.5 rounded border border-white/5">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Store Response */}
                {rev.storeResponse ? (
                  <div className="bg-[#2A2416] border border-[#C6A664]/30 rounded-lg p-3 text-xs space-y-1">
                    <span className="font-semibold text-[#C6A664] uppercase text-[10px] tracking-wider block">
                      KHAVYN Official Store Response:
                    </span>
                    <p className="text-white/80">{rev.storeResponse}</p>
                  </div>
                ) : (
                  <div>
                    {activeReplyId === rev._id ? (
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={2}
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Type official store response..."
                          className="w-full bg-[#1A1A1A] border border-white/20 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#C6A664]"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveResponse(rev._id)}
                            className="bg-[#C6A664] text-black text-xs px-3 py-1.5 rounded font-semibold hover:bg-white"
                          >
                            Post Response
                          </button>
                          <button
                            onClick={() => setActiveReplyId(null)}
                            className="text-xs text-white/50 hover:text-white px-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveReplyId(rev._id);
                          setResponseText("");
                        }}
                        className="text-xs text-[#C6A664] hover:underline flex items-center gap-1 font-medium"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Add Store Response</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
