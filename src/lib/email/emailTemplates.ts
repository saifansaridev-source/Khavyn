export interface EmailWrapperProps {
  title: string;
  preheader?: string;
  contentHtml: string;
}

export function wrapInLuxuryEmailTemplate({
  title,
  preheader = "KHAVYN — Crafting Everyday Luxury",
  contentHtml,
}: EmailWrapperProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1A1A1A; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; padding: 30px 20px; }
    .card { background-color: #FFFFFF; border: 1px solid #D8C9B0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    .header { background-color: #1A1A1A; text-align: center; padding: 30px 20px; border-bottom: 2px solid #C6A664; }
    .brand-title { color: #C6A664; font-family: 'Georgia', serif; font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 0; text-transform: uppercase; }
    .brand-tagline { color: rgba(255,255,255,0.6); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin-top: 6px; }
    .body-content { padding: 36px 30px; line-height: 1.6; font-size: 14px; color: #2C2C2C; }
    .gold-accent { color: #C6A664; font-weight: 600; }
    .btn-primary { display: inline-block; background-color: #1A1A1A; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 4px; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-top: 20px; border: 1px solid #C6A664; }
    .btn-primary:hover { background-color: #C6A664; color: #1A1A1A !important; }
    .footer { text-align: center; padding: 24px 20px; font-size: 11px; color: rgba(26,26,26,0.5); border-top: 1px solid #D8C9B0; }
    .footer a { color: #C6A664; text-decoration: none; }
  </style>
</head>
<body>
  <span style="display:none;font-size:1px;color:#FAF7F2;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="brand-title">KHAVYN</div>
        <div class="brand-tagline">CRAFTING EVERYDAY LUXURY</div>
      </div>
      <div class="body-content">
        ${contentHtml}
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} KHAVYN Fashion Private Limited. All rights reserved.<br/>
        Need assistance? Contact our concierge at <a href="mailto:support@khavyn.com">support@khavyn.com</a> or WhatsApp <a href="https://wa.me/919373205258">+91 93732 05258</a>.
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function getWelcomeEmailHtml(customerName: string): string {
  const content = `
    <h2 style="font-family: 'Georgia', serif; font-size: 22px; color: #1A1A1A; margin-top: 0;">Welcome to KHAVYN, ${customerName}</h2>
    <p>We are delighted to welcome you to the world of modern European luxury menswear.</p>
    <p>At KHAVYN, every piece is crafted with meticulous attention to detail — from our bio-washed combed long-staple cottons to custom matte hardware and structured drapes built for effortlessness.</p>
    <p>As a member, you enjoy exclusive access to new collection previews, priority concierge support, and tailored fit assistance.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.khavyn.com/shop" class="btn-primary">EXPLORE THE COLLECTION</a>
    </div>
  `;
  return wrapInLuxuryEmailTemplate({
    title: "Welcome to KHAVYN — Crafting Everyday Luxury",
    preheader: "Welcome to KHAVYN. Discover timeless European menswear.",
    contentHtml: content,
  });
}

export function getPasswordResetEmailHtml(adminName: string, resetUrl: string): string {
  const content = `
    <h2 style="font-family: 'Georgia', serif; font-size: 22px; color: #1A1A1A; margin-top: 0;">Password Reset Request</h2>
    <p>Hello ${adminName},</p>
    <p>We received a request to reset your access password for the KHAVYN Executive Control Console.</p>
    <p>Click the secure link below to set a new password. This link will expire in 60 minutes for security purposes.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" class="btn-primary">RESET PASSWORD NOW</a>
    </div>
    <p style="font-size: 12px; color: #666;">If you did not request this password reset, please ignore this message or alert security immediately.</p>
  `;
  return wrapInLuxuryEmailTemplate({
    title: "KHAVYN Security — Password Reset Link",
    preheader: "Secure password reset request for your KHAVYN account.",
    contentHtml: content,
  });
}

export interface OrderItemSummary {
  name: string;
  size: string;
  colour: string;
  quantity: number;
  price: number;
}

export interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  items: OrderItemSummary[];
  totalAmount: number;
  paymentType: "Prepaid Full" | "Partial COD";
  advancePaid: number;
  balanceDue: number;
  shippingAddress: string;
  estimatedDelivery: string;
}

export function getOrderConfirmationEmailHtml(props: OrderConfirmationProps): string {
  const itemRowsHtml = props.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #EFEAE1;">
        <strong>${item.name}</strong><br/>
        <span style="font-size: 11px; color: #666;">Size: ${item.size} | Colour: ${item.colour} | Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #EFEAE1; text-align: right; font-weight: bold;">
        ₹${(item.price * item.quantity).toLocaleString("en-IN")}
      </td>
    </tr>
  `
    )
    .join("");

  const content = `
    <h2 style="font-family: 'Georgia', serif; font-size: 22px; color: #1A1A1A; margin-top: 0;">Order Confirmed #${props.orderId}</h2>
    <p>Thank you for your order, ${props.customerName}. We are preparing your luxury garments for dispatch.</p>
    
    <div style="background-color: #FAF7F2; border: 1px solid #D8C9B0; border-radius: 6px; padding: 16px; margin: 20px 0;">
      <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #C6A664;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        ${itemRowsHtml}
      </table>
      <div style="margin-top: 14px; border-top: 1px border-dashed #D8C9B0; padding-top: 10px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span>Payment Structure:</span>
          <strong>${props.paymentType}</strong>
        </div>
        ${
          props.paymentType === "Partial COD"
            ? `
          <div style="display: flex; justify-content: space-between; color: #22c55e;">
            <span>Advance Paid Now (10%):</span>
            <strong>₹${props.advancePaid.toLocaleString("en-IN")}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; color: #b91c1c; font-weight: bold;">
            <span>Balance Due on Delivery:</span>
            <strong>₹${props.balanceDue.toLocaleString("en-IN")}</strong>
          </div>
        `
            : ""
        }
        <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: bold; margin-top: 8px; border-top: 1px solid #D8C9B0; padding-top: 8px;">
          <span>Total Order Value:</span>
          <span>₹${props.totalAmount.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <p><strong>Shipping Address:</strong><br/>${props.shippingAddress}</p>
    <p><strong>Estimated Delivery:</strong> ${props.estimatedDelivery}</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.khavyn.com/account" class="btn-primary">TRACK YOUR ORDER</a>
    </div>
  `;

  return wrapInLuxuryEmailTemplate({
    title: `Order Confirmed #${props.orderId} — KHAVYN`,
    preheader: `Thank you for your order #${props.orderId}. Your items are being crafted and prepared.`,
    contentHtml: content,
  });
}

export function getLowStockAlertEmailHtml(productName: string, size: string, colour: string, currentStock: number): string {
  const content = `
    <h2 style="font-family: 'Georgia', serif; font-size: 22px; color: #b91c1c; margin-top: 0;">⚠️ Low Stock Alert</h2>
    <p>Inventory threshold alert triggered for item size in catalog:</p>
    <div style="background-color: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 6px; padding: 16px; margin: 16px 0; font-size: 13px;">
      <p style="margin: 4px 0;"><strong>Product:</strong> ${productName}</p>
      <p style="margin: 4px 0;"><strong>Variant:</strong> ${colour} (Size: ${size})</p>
      <p style="margin: 4px 0;"><strong>Remaining Stock:</strong> <span style="color: #b91c1c; font-weight: bold;">${currentStock} units</span></p>
    </div>
    <p>Please update production or restock orders to avoid customer out-of-stock experience.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://www.khavyn.com/admin/inventory" class="btn-primary">OPEN INVENTORY CONSOLE</a>
    </div>
  `;
  return wrapInLuxuryEmailTemplate({
    title: `Low Stock Alert: ${productName} (${size})`,
    preheader: `Stock level dropped below threshold for ${productName}.`,
    contentHtml: content,
  });
}
