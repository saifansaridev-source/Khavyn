/**
 * Phone OTP Dispatch and Verification Service using MSG91
 * Supports live MSG91 API requests and development simulation fallback
 */

export interface PhoneOtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  simulated?: boolean;
}

/**
 * Send OTP to a phone number via MSG91 OTP API
 */
export async function sendPhoneOtp(
  phone: string,
  otpCode: string
): Promise<PhoneOtpResponse> {
  const authKey = process.env.MSG91_AUTH_KEY;
  // Clean phone number (strip whitespace, ensure India +91 or raw 10 digits)
  const cleanedPhone = phone.replace(/\D/g, "");
  const formattedPhone = cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone;

  // Development / fallback simulation when MSG91 auth key is not configured
  if (!authKey || authKey.trim() === "" || authKey.includes("XXXXXXXX")) {
    console.log("--------------------------------------------------");
    console.log(`[KHAVYN SMS SERVICE - SIMULATED MSG91 OTP]`);
    console.log(`To Phone: +${formattedPhone}`);
    console.log(`OTP Code: ${otpCode}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log("--------------------------------------------------");
    return {
      success: true,
      simulated: true,
      message: `Simulated OTP sent to +${formattedPhone}`,
    };
  }

  try {
    // MSG91 OTP API v5
    const url = new URL("https://control.msg91.com/api/v5/otp");
    url.searchParams.set("template_id", process.env.MSG91_TEMPLATE_ID || "khavyn_otp");
    url.searchParams.set("mobile", formattedPhone);
    url.searchParams.set("authkey", authKey);
    url.searchParams.set("otp", otpCode);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.type === "error" || !res.ok) {
      console.error("[MSG91 Error]:", data);
      return { success: false, error: data.message || "Failed to send SMS OTP" };
    }

    return { success: true, message: "OTP sent successfully" };
  } catch (err: any) {
    console.error("[MSG91 Exception]:", err);
    return { success: false, error: err.message || "Network error sending SMS OTP" };
  }
}

/**
 * Verify OTP directly with MSG91 (if using MSG91 managed verification)
 */
export async function verifyPhoneOtp(
  phone: string,
  code: string
): Promise<PhoneOtpResponse> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const cleanedPhone = phone.replace(/\D/g, "");
  const formattedPhone = cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone;

  if (!authKey || authKey.trim() === "" || authKey.includes("XXXXXXXX")) {
    return { success: true, simulated: true, message: "Simulated OTP verified" };
  }

  try {
    const url = new URL("https://control.msg91.com/api/v5/otp/verify");
    url.searchParams.set("mobile", formattedPhone);
    url.searchParams.set("otp", code);
    url.searchParams.set("authkey", authKey);

    const res = await fetch(url.toString(), {
      method: "GET",
    });

    const data = await res.json();

    if (data.type === "error" || !res.ok) {
      return { success: false, error: data.message || "Invalid OTP code" };
    }

    return { success: true, message: "OTP verified successfully" };
  } catch (err: any) {
    return { success: false, error: err.message || "Verification failed" };
  }
}
