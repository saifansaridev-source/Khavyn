export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailPayload): Promise<{ success: boolean; messageId?: string }> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpFrom = process.env.SMTP_FROM || "concierge@khavyn.com";

    // If Resend API key is provided, send via Resend REST API
    if (resendApiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `KHAVYN Concierge <${smtpFrom}>`,
          to: [to],
          subject,
          html,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[EMAIL DISPATCH SUCCESS] Resend ID: ${data.id}`);
        return { success: true, messageId: data.id };
      }
    }

    // Default console logger for demo & local development
    console.log(`[EMAIL SYSTEM DEMO LOG] Outgoing Email Triggered:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body Length: ${html.length} chars`);

    return { success: true, messageId: `demo-msg-${Date.now()}` };
  } catch (error: any) {
    console.error("[EMAIL DISPATCH ERROR]", error);
    return { success: false };
  }
}
