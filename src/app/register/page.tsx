"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export default function RegisterPage() {
  const router = useRouter();
  const { fetchUser, isAuthenticated } = useUserStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace("/account");
    }
  }, [mounted, isAuthenticated, router]);

  const passwordStrength = (): { label: string; color: string; width: string } => {
    if (!password) return { label: "", color: "#333", width: "0%" };
    if (password.length < 8) return { label: "Too short", color: "#ef4444", width: "25%" };
    if (password.length < 10 && !/\d/.test(password)) return { label: "Weak", color: "#f97316", width: "40%" };
    if (!/[A-Z]/.test(password) || !/\d/.test(password)) return { label: "Fair", color: "#eab308", width: "60%" };
    if (!/[!@#$%^&*]/.test(password)) return { label: "Good", color: "#22c55e", width: "80%" };
    return { label: "Strong", color: "#10b981", width: "100%" };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      setSuccess(true);
      await fetchUser();
      setTimeout(() => router.push("/account"), 1800);
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
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#C6A664]/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C6A664]/5 blur-[100px]" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/8">
        <Link href="/" className="font-serif text-2xl tracking-[0.3em] text-[#C6A664] hover:text-white transition-colors duration-300">
          KHAVYN
        </Link>
        <Link href="/login" className="text-sm text-white/50 hover:text-[#C6A664] transition-colors duration-300">
          Already a member?{" "}
          <span className="underline underline-offset-2">Sign in</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-3 leading-tight">
              Join KHAVYN
            </h1>
            <p className="text-white/40 text-sm leading-relaxed">
              Create your account and unlock member-exclusive prices, order tracking, and early access to collections.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_60px_rgba(0,0,0,0.5)]">
            {success ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-[#C6A664]" />
                </div>
                <h2 className="font-serif text-2xl text-white">Account Created!</h2>
                <p className="text-white/40 text-sm">Welcome to KHAVYN. Redirecting to your account…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error alert */}
                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Full name */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest text-white/40 uppercase font-medium">Full Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="register-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#C6A664]/50 focus:ring-1 focus:ring-[#C6A664]/20 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest text-white/40 uppercase font-medium">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="register-email"
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
                  <label className="text-xs tracking-widest text-white/40 uppercase font-medium">Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
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
                  {/* Strength bar */}
                  {password && (
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: strength.width, backgroundColor: strength.color }}
                        />
                      </div>
                      <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest text-white/40 uppercase font-medium">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="register-confirm-password"
                      type={showConfirm ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className={`w-full bg-white/5 border rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-white/20 text-sm focus:outline-none transition-all duration-200 ${
                        confirmPassword && confirmPassword !== password
                          ? "border-red-500/40 focus:border-red-500/60"
                          : "border-white/10 focus:border-[#C6A664]/50 focus:ring-1 focus:ring-[#C6A664]/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-white/25 leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <Link href="/legal/terms" className="text-[#C6A664]/60 hover:text-[#C6A664] underline underline-offset-2">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/legal/privacy" className="text-[#C6A664]/60 hover:text-[#C6A664] underline underline-offset-2">
                    Privacy Policy
                  </Link>.
                </p>

                {/* Submit */}
                <button
                  id="register-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-[#C6A664] hover:bg-[#B8955A] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm tracking-widest uppercase rounded-xl py-4 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(198,166,100,0.25)] hover:shadow-[0_8px_40px_rgba(198,166,100,0.4)]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Creating Account…</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-white/30 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#C6A664] hover:text-[#D4B86A] underline underline-offset-2 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
