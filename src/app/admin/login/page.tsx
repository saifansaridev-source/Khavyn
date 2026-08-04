"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Mail, ShieldAlert, Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@khavyn.com");
  const [password, setPassword] = useState("KhavynAdmin2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = "/admin/dashboard";
      } else {
        setErrorMsg(data.error || "Login failed");
      }
    } catch (err: any) {
      setErrorMsg("Network error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center p-4 selection:bg-[#C6A664] selection:text-black">
      <div className="w-full max-w-md bg-[#222222] border border-[#C6A664]/40 rounded-xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Gold Flourish Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1A1A1A] via-[#C6A664] to-[#1A1A1A]" />

        <div className="text-center space-y-2">
          <span className="font-serif text-3xl font-bold tracking-[0.25em] text-[#C6A664]">
            KHAVYN
          </span>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C6A664]/80 font-medium">
            EXECUTIVE CONTROL CONSOLE
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-800 text-red-200 text-xs p-3 rounded flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-white/70 mb-1 font-semibold uppercase tracking-wider">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#C6A664] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/20 rounded pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-[#C6A664]"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-1 font-semibold uppercase tracking-wider">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#C6A664] absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/20 rounded pl-10 pr-10 py-2.5 text-white focus:outline-none focus:border-[#C6A664]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-white/40 hover:text-[#C6A664] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-[#1A1A1A] p-3 rounded border border-white/10 text-[11px] text-white/60 space-y-1">
            <p className="font-semibold text-[#C6A664]">Demo Console Access:</p>
            <p>Email: admin@khavyn.com</p>
            <p>Password: KhavynAdmin2026!</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C6A664] text-black font-semibold uppercase tracking-[0.2em] py-3.5 rounded hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>{loading ? "AUTHENTICATING..." : "ACCESS DASHBOARD"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-[11px] text-white/40 hover:text-[#C6A664] transition-colors">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
