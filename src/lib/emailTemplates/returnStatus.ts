/**
 * KHAVYN — Return & Exchange Status Update Email Template
 * Sent to customer when an admin approves or rejects a return/exchange request.
 */

export interface ReturnStatusEmailProps {
  customerName: string;
  orderNumber: string;
  type: "return" | "exchange";
  status: "approved" | "rejected";
  productName?: string;
  exchangeSize?: string;
  adminNotes?: string;
}

export function getReturnStatusEmailHtml(props: ReturnStatusEmailProps): string {
  const isApproved = props.status === "approved";
  const typeTitle = props.type === "exchange" ? "Size Exchange" : "Return & Refund";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${typeTitle} Request ${isApproved ? "Approved" : "Update"} — KHAVYN</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #121212;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #FAF7F2;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #121212; color: #FAF7F2;">
  <span style="display:none;font-size:1px;color:#121212;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Update regarding your ${typeTitle} request for Order #${props.orderNumber}.
  </span>

  <center style="width: 100%; table-layout: fixed; background-color: #121212; padding-top: 30px; padding-bottom: 50px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1A1A1A; border: 1px solid #2E2820; border-radius: 8px; overflow: hidden; margin: 0 auto;">
      
      <!-- Brand Header -->
      <tr>
        <td style="padding: 36px 30px 22px 30px; text-align: center; border-bottom: 1px solid #2E2820; background: linear-gradient(180deg, #22201D 0%, #1A1A1A 100%);">
          <div style="font-family: 'Times New Roman', Times, Georgia, serif; font-size: 30px; font-weight: 700; letter-spacing: 7px; color: #C6A664; text-transform: uppercase; margin: 0;">
            KHAVYN
          </div>
          <div style="font-size: 9.5px; letter-spacing: 3.5px; color: rgba(250, 247, 242, 0.6); text-transform: uppercase; margin-top: 6px;">
            CRAFTING EVERYDAY LUXURY
          </div>
        </td>
      </tr>

      <!-- Golden Line -->
      <tr>
        <td style="height: 2px; background: linear-gradient(90deg, transparent 0%, #C6A664 50%, transparent 100%);"></td>
      </tr>

      <!-- Status Header -->
      <tr>
        <td style="padding: 36px 32px 16px 32px; text-align: center;">
          <div style="display: inline-block; padding: 5px 14px; background-color: ${isApproved ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)"}; border: 1px solid ${isApproved ? "#22c55e" : "#ef4444"}; border-radius: 20px; font-size: 11px; letter-spacing: 2px; color: ${isApproved ? "#22c55e" : "#ef4444"}; text-transform: uppercase; font-weight: 700; margin-bottom: 14px;">
            REQUEST ${isApproved ? "APPROVED" : "NOT APPROVED"}
          </div>
          <h1 style="font-family: 'Times New Roman', Times, Georgia, serif; font-size: 24px; font-weight: 600; color: #FFFFFF; margin: 0 0 10px 0;">
            ${isApproved ? `${typeTitle} Approved` : `${typeTitle} Review Complete`}
          </h1>
          <p style="font-size: 13.5px; line-height: 1.6; color: rgba(250, 247, 242, 0.8); margin: 0 auto; max-width: 480px;">
            Hello ${props.customerName}, our quality assessment team has reviewed your ${typeTitle.toLowerCase()} request for Order <strong style="color: #C6A664;">#${props.orderNumber}</strong>.
          </p>
        </td>
      </tr>

      <!-- Request Details Card -->
      <tr>
        <td style="padding: 10px 32px 24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #22201D; border: 1px solid #332B20; border-radius: 6px; padding: 22px;">
            <tr>
              <td style="font-size: 12px; color: rgba(250,247,242,0.6); padding-bottom: 8px;">
                Request Type:
              </td>
              <td style="font-size: 12px; font-weight: 600; color: #FAF7F2; text-align: right; padding-bottom: 8px;">
                ${typeTitle}
              </td>
            </tr>
            ${
              props.productName
                ? `
            <tr>
              <td style="font-size: 12px; color: rgba(250,247,242,0.6); padding-bottom: 8px;">
                Product:
              </td>
              <td style="font-size: 12px; font-weight: 600; color: #FAF7F2; text-align: right; padding-bottom: 8px;">
                ${props.productName}
              </td>
            </tr>
            `
                : ""
            }
            ${
              props.exchangeSize
                ? `
            <tr>
              <td style="font-size: 12px; color: rgba(250,247,242,0.6); padding-bottom: 8px;">
                Requested Replacement Size:
              </td>
              <td style="font-size: 12px; font-weight: 700; color: #C6A664; text-align: right; padding-bottom: 8px;">
                ${props.exchangeSize}
              </td>
            </tr>
            `
                : ""
            }
            <tr>
              <td style="font-size: 12px; color: rgba(250,247,242,0.6); padding-bottom: 8px; border-top: 1px solid #332B20; padding-top: 8px;">
                Current Status:
              </td>
              <td style="font-size: 12px; font-weight: 700; color: ${isApproved ? "#22c55e" : "#ef4444"}; text-align: right; border-top: 1px solid #332B20; padding-top: 8px; text-transform: uppercase;">
                ${props.status}
              </td>
            </tr>
            ${
              props.adminNotes
                ? `
            <tr>
              <td colspan="2" style="padding-top: 12px; border-top: 1px solid #332B20;">
                <div style="font-size: 11px; color: #C6A664; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Concierge Remarks:</div>
                <div style="font-size: 12px; color: rgba(250,247,242,0.85); line-height: 1.5; font-style: italic;">"${props.adminNotes}"</div>
              </td>
            </tr>
            `
                : ""
            }
          </table>
        </td>
      </tr>

      <!-- Next Steps Guidance -->
      <tr>
        <td style="padding: 0 32px 30px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1F1E1C; border-left: 3px solid #C6A664; padding: 16px; border-radius: 0 4px 4px 0;">
            <tr>
              <td>
                <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #C6A664; margin-bottom: 6px;">
                  ${isApproved ? "NEXT STEPS &amp; PICKUP GUIDELINES" : "SUPPORT ASSISTANCE"}
                </div>
                <div style="font-size: 12px; color: #FAF7F2; line-height: 1.6;">
                  ${
                    isApproved
                      ? "Our courier partner will arrange a doorstep reverse pickup within 24–48 hours. Please ensure the garment is folded in its original luxury packaging with all brand tags and matte hardware intact."
                      : "If you have questions regarding this assessment or have additional proof to submit, our executive desk is here to assist you directly via WhatsApp."
                  }
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CTA Button -->
      <tr>
        <td style="padding: 0 32px 40px 32px; text-align: center;">
          <a href="https://www.khavyn.com/account/dashboard?tab=orders" style="display: inline-block; background-color: #C6A664; color: #1A1A1A; font-weight: 700; font-size: 11.5px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; padding: 14px 32px; border-radius: 4px;">
            VIEW ORDER STATUS
          </a>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 26px 32px; background-color: #141414; border-top: 1px solid #2E2820; text-align: center;">
          <div style="font-size: 11px; color: rgba(250, 247, 242, 0.45); line-height: 1.8;">
            KHAVYN Fashion Private Limited<br/>
            Sr. No. 80/16, Kavita Apartment, Samarth Nagar, New Sangavi, Pune – 411027, Maharashtra<br/>
            Concierge Desk: <a href="mailto:complaint@khavyn.com" style="color: #C6A664; text-decoration: none;">complaint@khavyn.com</a> | WhatsApp: <a href="https://wa.me/919373205258" style="color: #C6A664; text-decoration: none;">+91 93732 05258</a>
          </div>
          <div style="font-size: 10px; color: rgba(250, 247, 242, 0.3); margin-top: 12px;">
            &copy; ${new Date().getFullYear()} KHAVYN. All rights reserved.
          </div>
        </td>
      </tr>

    </table>
  </center>
</body>
</html>
  `;
}
