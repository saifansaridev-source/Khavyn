"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function LoginPage() {
  const router = useRouter();
  const { fetchUser, isAuthenticated } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace("/account");
    }
  }, [mounted, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed. Please check your credentials.");
        return;
      }

      await fetchUser();
      router.push("/account");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex flex-col relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#C6A664]/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C6A664]/6 blur-[100px]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/8">
        <Link href="/" className="font-serif text-2xl tracking-[0.3em] text-[#C6A664] hover:text-white transition-colors duration-300">
          KHAVYN
        </Link>
        <Link href="/register" className="text-sm text-white/50 hover:text-[#C6A664] transition-colors duration-300">
          New here? <span className="underline underline-offset-2">Create account</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#C6A664]/10 border border-[#C6A664]/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A664]" />
              <span className="text-xs tracking-[0.2em] text-[#C6A664] font-medium uppercase">Member Exclusive</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
              Welcome Back
            </h1>
            <p className="text-white/40 text-sm leading-relaxed">
              Sign in to access your KHAVYN account, orders, and exclusive member benefits.
            </p>
          </div>

          {/* Demo credentials banner */}
          <div className="mb-6 rounded-xl border border-[#C6A664]/30 bg-[#C6A664]/10 p-4 space-y-2 text-center text-xs">
            <p className="text-[#C6A664] font-semibold uppercase tracking-wider">
              Demo Credentials (No DB Required)
            </p>
            <p className="text-white/80 leading-relaxed font-mono">
              Email: <span className="text-white">customer@khavyn.com</span> &nbsp;·&nbsp;
              Password: <span className="text-white">KhavynCustomer2026!</span>
            </p>
            <p className="text-[11px] text-white/50 border-t border-white/10 pt-2">
              Looking for Executive Control Console?{" "}
              <Link href="/admin/login" className="text-[#C6A664] hover:underline font-semibold">
                Go to Admin Login →
              </Link>
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_60px_rgba(0,0,0,0.5)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error alert */}
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs tracking-widest text-white/40 uppercase font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#C6A664]/50 focus:ring-1 focus:ring-[#C6A664]/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs tracking-widest text-white/40 uppercase font-medium">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#C6A664]/70 hover:text-[#C6A664] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#C6A664]/50 focus:ring-1 focus:ring-[#C6A664]/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="group w-full bg-[#C6A664] hover:bg-[#B8955A] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm tracking-widest uppercase rounded-xl py-4 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(198,166,100,0.25)] hover:shadow-[0_8px_40px_rgba(198,166,100,0.4)]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-white/30 mt-8">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#C6A664] hover:text-[#D4B86A] underline underline-offset-2 transition-colors">
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
