export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailPayload): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
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
        return { success: true, messageId: data.id, simulated: false };
      }

      // Log full raw error response for visibility in Vercel logs
      console.error("[EMAIL DISPATCH RESEND ERROR]", data);

      // Parse error details from Resend response
      let errorMessage = "Unknown error from Resend API";
      if (typeof data?.message === "string" && data.message) {
        errorMessage = data.message;
      } else if (typeof data?.error?.message === "string" && data.error.message) {
        errorMessage = data.error.message;
      } else if (typeof data?.error === "string" && data.error) {
        errorMessage = data.error;
      } else if (typeof data?.name === "string" && data.name) {
        errorMessage = data.name;
      } else if (typeof data === "string" && data) {
        errorMessage = data;
      } else if (data && typeof data === "object") {
        try {
          errorMessage = JSON.stringify(data);
        } catch {
          errorMessage = "Unknown error from Resend API";
        }
      }

      return { success: false, error: errorMessage, simulated: false };
    }

    // Default console logger for demo & local development (only when RESEND_API_KEY is unset)
    console.log(`[EMAIL SYSTEM DEMO LOG] Outgoing Email Triggered:`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body Length: ${html.length} chars`);

    return { success: true, messageId: `demo-msg-${Date.now()}`, simulated: true };
  } catch (error: any) {
    console.error("[EMAIL DISPATCH ERROR]", error);
    return {
      success: false,
      error: error?.message || "Internal error dispatching email",
      simulated: false,
    };
  }
}
