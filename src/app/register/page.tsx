"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

type Step = "form" | "otp";

export default function RegisterPage() {
  const router = useRouter();
  const { fetchUser, isAuthenticated } = useUserStore();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Multi-step state
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // OTP fields
  const [emailOtp, setEmailOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Dev simulation OTPs (shown when services not configured)
  const [devEmailOtp, setDevEmailOtp] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace("/account");
    }
  }, [mounted, isAuthenticated, router]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const passwordStrength = (): { label: string; color: string; width: string } => {
    if (!password) return { label: "", color: "#333", width: "0%" };
    if (password.length < 8) return { label: "Too short", color: "#ef4444", width: "25%" };
    if (password.length < 10 && !/\d/.test(password)) return { label: "Weak", color: "#f97316", width: "40%" };
    if (!/[A-Z]/.test(password) || !/\d/.test(password)) return { label: "Fair", color: "#eab308", width: "60%" };
    if (!/[!@#$%^&*]/.test(password)) return { label: "Good", color: "#22c55e", width: "80%" };
    return { label: "Strong", color: "#10b981", width: "100%" };
  };
  const strength = passwordStrength();

  // STEP 1: Submit form → send OTPs
  const handleFormSubmit = async (e: React.FormEvent) => {
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
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone && cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number, or leave it blank.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: cleanPhone }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to send verification code. Please try again.");
        return;
      }

      // Dev simulation mode: auto-fill OTP input for convenience
      if (data._dev?.emailOtp) {
        setDevEmailOtp(`Email OTP: ${data._dev.emailOtp}`);
      }

      setStep("otp");
      setResendCooldown(60);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Submit OTP → verify email & create account
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: phone.replace(/\D/g, ""),
          name,
          password,
          emailOtp: emailOtp.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Verification failed. Please check your codes and try again.");
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

  // Resend OTPs
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone.replace(/\D/g, "") }),
      });
      const data = await res.json();
      if (data._dev?.emailOtp) {
        setDevEmailOtp(`Email OTP: ${data._dev.emailOtp}`);
      }
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to resend codes.");
      } else {
        setResendCooldown(60);
        setEmailOtp("");
      }
    } catch {
      setError("Network error.");
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
              {step === "form" ? "Join KHAVYN" : "Verify Your Identity"}
            </h1>
            <p className="text-white/40 text-sm leading-relaxed">
              {step === "form"
                ? "Create your account and unlock member-exclusive prices, order tracking, and early access to collections."
                : `We've sent a 6-digit verification code to ${email}. Please enter it below to activate your account.`}
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
            ) : step === "form" ? (
              <form onSubmit={handleFormSubmit} className="space-y-5">
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

                {/* Phone — Optional contact field (not used for verification) */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest text-white/40 uppercase font-medium">
                    Mobile Number <span className="text-white/20 normal-case text-[10px]">(optional)</span>
                  </label>
                  <div className="relative flex">
                    <span className="flex items-center px-3 bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-white/40 text-sm select-none">
                      +91
                    </span>
                    <div className="relative flex-1">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="register-phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="10-digit mobile number (optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-r-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#C6A664]/50 focus:ring-1 focus:ring-[#C6A664]/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-white/20">Used for delivery coordination only. Not required for account creation.</p>
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
                  <Link href="/policies/terms" className="text-[#C6A664]/60 hover:text-[#C6A664] underline underline-offset-2">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/policies/privacy" className="text-[#C6A664]/60 hover:text-[#C6A664] underline underline-offset-2">
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
                      <span>Sending Codes…</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP Step */
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                {/* Shield icon */}
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 rounded-full bg-[#C6A664]/10 border border-[#C6A664]/30 flex items-center justify-center">
                    <ShieldCheck className="w-7 h-7 text-[#C6A664]" />
                  </div>
                </div>

                {/* Error alert */}
                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* Dev mode OTP hint */}
                {devEmailOtp && (
                  <div className="rounded-xl bg-[#C6A664]/10 border border-[#C6A664]/30 px-4 py-3 text-xs text-[#C6A664] space-y-1">
                    <p className="font-semibold uppercase tracking-wider">Dev Mode — Email OTP</p>
                    <p className="font-mono">{devEmailOtp}</p>
                  </div>
                )}

                {/* Email OTP */}
                <div className="space-y-2">
                  <label className="text-xs tracking-widest text-white/40 uppercase font-medium">Email Verification Code</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="register-email-otp"
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      required
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit code from your email"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#C6A664]/50 focus:ring-1 focus:ring-[#C6A664]/20 transition-all duration-200 font-mono tracking-[0.3em] text-center"
                    />
                  </div>
                  <p className="text-[10px] text-white/25">Check your inbox (and spam folder) for the 6-digit code.</p>
                </div>

                {/* Phone OTP is disabled — email-only verification */}

                {/* Verify button */}
                <button
                  id="register-verify-btn"
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-[#C6A664] hover:bg-[#B8955A] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm tracking-widest uppercase rounded-xl py-4 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(198,166,100,0.25)] hover:shadow-[0_8px_40px_rgba(198,166,100,0.4)]"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Verifying…</span>
                    </>
                  ) : (
                    <>
                      <span>Verify &amp; Create Account</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>

                {/* Resend & back */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep("form"); setError(""); setEmailOtp(""); }}
                    className="text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    ← Change details
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    className="flex items-center gap-1.5 text-xs text-[#C6A664]/70 hover:text-[#C6A664] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend codes"}
                  </button>
                </div>
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
