/**
 * Reusable Email Dispatch Service using Resend
 * Supports HTML templates, text fallbacks, attachments (such as PDF invoices),
 * and development simulation when RESEND_API_KEY is not configured.
 */

export interface EmailAttachment {
  filename: string;
  content: string | Buffer; // base64 string or Buffer
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  attachments?: EmailAttachment[];
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = "KHAVYN <onboarding@resend.dev>",
  attachments,
}: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string; simulated?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;

  const formattedAttachments = attachments?.map((att) => ({
    filename: att.filename,
    content: Buffer.isBuffer(att.content) ? att.content.toString("base64") : att.content,
  }));

  // Development / fallback simulation when API key is not yet configured
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("XXXXXXXX")) {
    console.log("--------------------------------------------------");
    console.log(`[KHAVYN EMAIL SERVICE - SIMULATED DISPATCH]`);
    console.log(`To: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Attachments: ${formattedAttachments ? formattedAttachments.map(a => a.filename).join(", ") : "None"}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log("--------------------------------------------------");
    return { success: true, simulated: true, id: `sim_${Date.now()}` };
  }

  try {
    const payload: any = {
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ""),
    };

    if (formattedAttachments && formattedAttachments.length > 0) {
      payload.attachments = formattedAttachments;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Resend API Error]:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    console.error("[Email Dispatch Exception]:", err);
    return { success: false, error: err.message || "Network error sending email" };
  }
}
