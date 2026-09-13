/**
 * KHAVYN — Order Confirmation Email Template
 * Branded transactional email sent immediately after payment confirmation
 * (full online prepaid or 50% advance for Partial COD).
 */

export interface OrderConfirmationItem {
  name: string;
  size?: string;
  colour?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderConfirmationItem[];
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
  paymentType: "prepaid" | "partial_cod" | string;
  advancePaid: number;
  balanceDue: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string;
  };
  estimatedDelivery?: string;
  hasInvoiceAttachment?: boolean;
}

export function getOrderConfirmationEmailHtml(props: OrderConfirmationEmailProps): string {
  const isPartialCod = props.paymentType === "partial_cod";
  const paymentModeTitle = isPartialCod
    ? "Partial COD (50% Advance Online + 50% on Delivery)"
    : "100% Prepaid (Razorpay)";

  const itemsHtml = props.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 0; border-bottom: 1px solid #2E2820; vertical-align: top;">
          <div style="font-size: 13px; font-weight: 600; color: #FAF7F2; line-height: 1.4;">
            ${item.name}
          </div>
          <div style="font-size: 11px; color: rgba(250, 247, 242, 0.6); margin-top: 4px;">
            ${item.size ? `Size: <strong style="color: #FAF7F2;">${item.size}</strong>` : ""}
            ${item.colour ? ` &bull; Colour: <strong style="color: #FAF7F2;">${item.colour}</strong>` : ""}
            &bull; Qty: <strong style="color: #FAF7F2;">${item.quantity}</strong>
          </div>
        </td>
        <td style="padding: 14px 0; border-bottom: 1px solid #2E2820; text-align: right; vertical-align: top; font-weight: 600; font-size: 13px; color: #C6A664; white-space: nowrap;">
          ₹${(item.price * item.quantity).toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  const formattedAddress = `${props.shippingAddress.street}, ${props.shippingAddress.city}, ${props.shippingAddress.state} – ${props.shippingAddress.pincode}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed #${props.orderNumber} — KHAVYN</title>
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
    Your KHAVYN Order #${props.orderNumber} has been verified and confirmed.
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

      <!-- Status Banner -->
      <tr>
        <td style="padding: 36px 32px 16px 32px; text-align: center;">
          <div style="display: inline-block; padding: 5px 14px; background-color: rgba(198, 166, 100, 0.15); border: 1px solid rgba(198, 166, 100, 0.4); border-radius: 20px; font-size: 11px; letter-spacing: 2px; color: #C6A664; text-transform: uppercase; font-weight: 700; margin-bottom: 14px;">
            ORDER CONFIRMED &amp; PROCESSING
          </div>
          <h1 style="font-family: 'Times New Roman', Times, Georgia, serif; font-size: 24px; font-weight: 600; color: #FFFFFF; margin: 0 0 10px 0;">
            Thank you, ${props.customerName}
          </h1>
          <p style="font-size: 13.5px; line-height: 1.6; color: rgba(250, 247, 242, 0.8); margin: 0 auto; max-width: 480px;">
            Your payment has been successfully verified. Order <strong style="color: #C6A664;">#${props.orderNumber}</strong> is currently being prepared for tailored dispatch.
          </p>
        </td>
      </tr>

      <!-- Order Details Card -->
      <tr>
        <td style="padding: 10px 32px 24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #22201D; border: 1px solid #332B20; border-radius: 6px; padding: 22px;">
            
            <!-- Items header -->
            <tr>
              <td colspan="2" style="padding-bottom: 10px; border-bottom: 1px solid #332B20;">
                <span style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #C6A664;">
                  ITEMIZED LUXURY PIECES
                </span>
              </td>
            </tr>

            <!-- Product rows -->
            ${itemsHtml}

            <!-- Subtotal & Shipping breakdown -->
            <tr>
              <td style="padding-top: 16px; font-size: 12px; color: rgba(250,247,242,0.7);">
                Item Subtotal:
              </td>
              <td style="padding-top: 16px; text-align: right; font-size: 12px; font-weight: 600; color: #FAF7F2;">
                ₹${props.subtotal.toLocaleString("en-IN")}
              </td>
            </tr>
            <tr>
              <td style="padding-top: 6px; font-size: 12px; color: rgba(250,247,242,0.7);">
                Flat Shipping Charge:
              </td>
              <td style="padding-top: 6px; text-align: right; font-size: 12px; font-weight: 600; color: #FAF7F2;">
                ₹${props.shippingCharge.toLocaleString("en-IN")}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0 6px 0; border-top: 1px solid #332B20; font-size: 14px; font-weight: 700; color: #FFFFFF;">
                Total Order Value:
              </td>
              <td style="padding: 12px 0 6px 0; border-top: 1px solid #332B20; text-align: right; font-size: 15px; font-weight: 700; color: #FFFFFF;">
                ₹${props.totalAmount.toLocaleString("en-IN")}
              </td>
            </tr>

            <!-- Payment Breakdown -->
            <tr>
              <td colspan="2" style="padding-top: 12px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border: 1px solid #332B20; border-radius: 4px; padding: 12px;">
                  <tr>
                    <td style="font-size: 11px; color: rgba(250,247,242,0.6); padding-bottom: 4px;">
                      Payment Mode:
                    </td>
                    <td style="font-size: 11px; font-weight: 600; color: #FAF7F2; text-align: right; padding-bottom: 4px;">
                      ${paymentModeTitle}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; font-weight: 600; color: #22c55e;">
                      ✓ Advance Paid via Razorpay:
                    </td>
                    <td style="font-size: 13px; font-weight: 700; color: #22c55e; text-align: right;">
                      ₹${props.advancePaid.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  ${
                    isPartialCod
                      ? `
                  <tr>
                    <td style="font-size: 12px; font-weight: 600; color: #F59E0B; padding-top: 6px; border-top: 1px solid #2E2820;">
                      Cash Payable on Delivery:
                    </td>
                    <td style="font-size: 13px; font-weight: 700; color: #F59E0B; text-align: right; padding-top: 6px; border-top: 1px solid #2E2820;">
                      ₹${props.balanceDue.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- Shipping & Logistics Note -->
      <tr>
        <td style="padding: 0 32px 24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1F1E1C; border-left: 3px solid #C6A664; padding: 16px; border-radius: 0 4px 4px 0;">
            <tr>
              <td>
                <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #C6A664; margin-bottom: 6px;">
                  DELIVERY ADDRESS &amp; TIMELINE
                </div>
                <div style="font-size: 12px; color: #FAF7F2; line-height: 1.6;">
                  <strong>${props.shippingAddress.fullName}</strong><br/>
                  ${formattedAddress}<br/>
                  ${props.shippingAddress.phone ? `Phone: ${props.shippingAddress.phone}` : ""}
                </div>
                <div style="font-size: 12px; color: #C6A664; margin-top: 8px; font-weight: 500;">
                  ✦ Estimated Delivery: ${props.estimatedDelivery || "3 – 5 Business Days via Express Courier"}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Invoice Attachment Note -->
      <tr>
        <td style="padding: 0 32px 30px 32px; text-align: center;">
          <div style="padding: 12px; background-color: rgba(198, 166, 100, 0.08); border: 1px dashed rgba(198, 166, 100, 0.3); border-radius: 4px; font-size: 11.5px; color: rgba(250,247,242,0.85);">
            📄 <strong>Official GST Tax Invoice Attached:</strong> A formal tax invoice PDF (<code style="color: #C6A664;">KHAVYN_Invoice_${props.orderNumber}.pdf</code>) is attached to this email for your financial and tax records.
          </div>
        </td>
      </tr>

      <!-- Account / Track Order CTA -->
      <tr>
        <td style="padding: 0 32px 40px 32px; text-align: center;">
          <a href="https://www.khavyn.com/account" style="display: inline-block; background-color: #C6A664; color: #1A1A1A; font-weight: 700; font-size: 11.5px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; padding: 14px 32px; border-radius: 4px;">
            TRACK ORDER STATUS
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
