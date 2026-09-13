"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

// Google icon SVG as a component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchUser, isAuthenticated } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  // Show Google OAuth errors passed via query params
  useEffect(() => {
    const oauthError = searchParams?.get("error");
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
    }
  }, [searchParams]);

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
      const redirect = searchParams?.get("redirect") || "/account";
      router.push(redirect);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const redirect = searchParams?.get("redirect") || "/account";
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirect)}`;
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

              {/* Google Sign-In */}
              <button
                id="login-google-btn"
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed text-[#1A1A1A] font-semibold text-sm rounded-xl py-3.5 px-4 transition-all duration-300 border border-white/20 shadow-sm"
              >
                {googleLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                    <span>Redirecting…</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/25 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

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
                disabled={loading || googleLoading}
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C6A664] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

