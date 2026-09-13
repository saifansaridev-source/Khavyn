import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/connect";
import { OtpVerification } from "@/models/OtpVerification";
import { sendEmail } from "@/lib/email";
import { sendPhoneOtp } from "@/lib/otp";
import { wrapInLuxuryEmailTemplate } from "@/lib/email/emailTemplates";

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

function getOtpEmailHtml(name: string, otp: string): string {
  const contentHtml = `
    <h2 style="font-family: 'Georgia', serif; font-size: 22px; color: #1A1A1A; margin-top: 0;">
      Verify Your Email Address
    </h2>
    <p>Hello ${name || "there"},</p>
    <p>Use the verification code below to complete your KHAVYN account registration.</p>
    <div style="text-align: center; margin: 32px 0;">
      <div style="display: inline-block; background-color: #1A1A1A; border: 2px solid #C6A664; border-radius: 8px; padding: 20px 40px;">
        <p style="margin: 0; font-size: 11px; color: #C6A664; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px;">Your OTP</p>
        <p style="margin: 0; font-size: 36px; font-weight: bold; color: #FFFFFF; letter-spacing: 8px; font-family: monospace;">${otp}</p>
      </div>
    </div>
    <p style="font-size: 13px; color: #666;">This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
    <p style="font-size: 12px; color: #999;">If you did not register on khavyn.com, please ignore this email.</p>
  `;
  return wrapInLuxuryEmailTemplate({
    title: "KHAVYN — Email Verification Code",
    preheader: `Your KHAVYN verification code is: ${otp}`,
    contentHtml,
  });
}

// Rate limit: max 3 OTP requests per email per 10 min (in-memory)
const otpRateLimiter = new Map<string, { count: number; firstAttempt: number }>();

export async function POST(req: Request) {
  try {
    const { email, phone, name } = await req.json();

    if (!email || !phone) {
      return NextResponse.json(
        { success: false, error: "Email and phone number are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address format." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    // Rate limit check
    const now = Date.now();
    const key = email.toLowerCase().trim();
    const rl = otpRateLimiter.get(key);
    if (rl && now - rl.firstAttempt < 10 * 60 * 1000) {
      if (rl.count >= 3) {
        return NextResponse.json(
          { success: false, error: "Too many OTP requests. Please wait 10 minutes before trying again." },
          { status: 429 }
        );
      }
      otpRateLimiter.set(key, { ...rl, count: rl.count + 1 });
    } else {
      otpRateLimiter.set(key, { count: 1, firstAttempt: now });
    }

    // Generate OTPs
    const emailOtp = generateOtp();
    const phoneOtp = generateOtp();

    const emailOtpHashed = await bcrypt.hash(emailOtp, 10);
    const phoneOtpHashed = await bcrypt.hash(phoneOtp, 10);

    // Store in DB (upsert to handle resend)
    await connectToDatabase();
    await OtpVerification.deleteMany({ email: key }); // Remove old OTPs for this email
    await OtpVerification.create({
      email: key,
      phone: cleanPhone,
      emailOtpHashed,
      phoneOtpHashed,
      emailVerified: false,
      phoneVerified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send email OTP
    const emailResult = await sendEmail({
      to: key,
      subject: "KHAVYN — Your Email Verification Code",
      html: getOtpEmailHtml(name || "", emailOtp),
    });

    // Send phone OTP
    const phoneResult = await sendPhoneOtp(cleanPhone, phoneOtp);

    const emailSent = emailResult.success;
    const phoneSent = phoneResult.success;

    if (!emailSent && !phoneSent) {
      return NextResponse.json(
        { success: false, error: "Failed to send verification codes. Please try again." },
        { status: 500 }
      );
    }

    // In dev/simulation mode, include OTPs in response for testing
    const isSimulated = emailResult.simulated || phoneResult.simulated;

    return NextResponse.json({
      success: true,
      message: "Verification codes sent to your email and phone.",
      ...(isSimulated && {
        _dev: {
          note: "Simulation mode — OTPs shown here because email/SMS services are not configured.",
          emailOtp,
          phoneOtp,
        },
      }),
    });
  } catch (error: any) {
    console.error("[OTP Send Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send verification codes. Please try again." },
      { status: 500 }
    );
  }
}
