/**
 * KHAVYN — Welcome Email Template
 * Branded transactional email sent upon successful signup & dual OTP verification.
 */

export interface WelcomeEmailProps {
  customerName?: string;
  shopUrl?: string;
}

export function getWelcomeEmailHtml({
  customerName,
  shopUrl = "https://www.khavyn.com/shop",
}: WelcomeEmailProps = {}): string {
  const nameDisplay = customerName ? customerName.trim() : "Valued Patron";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to KHAVYN — Crafting Everyday Luxury</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #121212;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #FAF7F2;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-spacing: 0;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #121212;
      padding-bottom: 40px;
    }
    .main-table {
      background-color: #1A1A1A;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border: 1px solid #2E2820;
      border-radius: 8px;
      overflow: hidden;
    }
    .gold-text {
      color: #C6A664;
    }
    .button-gold {
      display: inline-block;
      background-color: #C6A664;
      color: #1A1A1A !important;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      text-decoration: none;
      padding: 16px 36px;
      border-radius: 4px;
      margin-top: 10px;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #121212; color: #FAF7F2;">
  <span style="display:none;font-size:1px;color:#121212;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    Welcome to KHAVYN. Crafting Everyday Luxury with timeless European silhouettes.
  </span>

  <center class="wrapper" style="width: 100%; table-layout: fixed; background-color: #121212; padding-top: 30px; padding-bottom: 50px;">
    <table class="main-table" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1A1A1A; border: 1px solid #2E2820; border-radius: 8px; overflow: hidden; margin: 0 auto;">
      
      <!-- Brand Header -->
      <tr>
        <td style="padding: 40px 30px 25px 30px; text-align: center; border-bottom: 1px solid #2E2820; background: linear-gradient(180deg, #22201D 0%, #1A1A1A 100%);">
          <div style="font-family: 'Times New Roman', Times, Georgia, serif; font-size: 32px; font-weight: 700; letter-spacing: 7px; color: #C6A664; text-transform: uppercase; margin: 0;">
            KHAVYN
          </div>
          <div style="font-size: 10px; letter-spacing: 3.5px; color: rgba(250, 247, 242, 0.6); text-transform: uppercase; margin-top: 8px; font-weight: 500;">
            CRAFTING EVERYDAY LUXURY
          </div>
        </td>
      </tr>

      <!-- Golden Divider Accent -->
      <tr>
        <td style="height: 2px; background: linear-gradient(90deg, transparent 0%, #C6A664 50%, transparent 100%);"></td>
      </tr>

      <!-- Hero Message -->
      <tr>
        <td style="padding: 45px 36px 20px 36px; text-align: center;">
          <div style="font-size: 11px; letter-spacing: 3px; color: #C6A664; text-transform: uppercase; font-weight: 600; margin-bottom: 12px;">
            PATRON ONBOARDING
          </div>
          <h1 style="font-family: 'Times New Roman', Times, Georgia, serif; font-size: 26px; font-weight: 600; color: #FFFFFF; margin: 0 0 16px 0; line-height: 1.3;">
            Welcome to KHAVYN, ${nameDisplay}
          </h1>
          <p style="font-size: 14px; line-height: 1.7; color: rgba(250, 247, 242, 0.85); margin: 0 auto 24px auto; max-width: 480px;">
            We are honored to welcome you into our circle. At KHAVYN, luxury is not an occasional indulgence — it is woven into the very fabric of your daily rhythm.
          </p>
        </td>
      </tr>

      <!-- Feature Card -->
      <tr>
        <td style="padding: 0 36px 30px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #22201D; border: 1px solid #332B20; border-radius: 6px; padding: 24px;">
            <tr>
              <td style="padding: 6px 12px;">
                <div style="font-size: 13px; font-weight: 600; color: #C6A664; margin-bottom: 4px;">✦ Uncompromising European Drapery</div>
                <div style="font-size: 12px; color: rgba(250,247,242,0.7); line-height: 1.5;">Bio-washed combed long-staple cottons tailored for timeless silhouettes and unmatched softness.</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 12px 6px 12px; border-top: 1px solid #2E2820;">
                <div style="font-size: 13px; font-weight: 600; color: #C6A664; margin-bottom: 4px;">✦ Complimentary Concierge Service</div>
                <div style="font-size: 12px; color: rgba(250,247,242,0.7); line-height: 1.5;">Personal styling consultations, priority dispatch, and hassle-free door-to-door exchanges.</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Call to Action -->
      <tr>
        <td style="padding: 10px 36px 45px 36px; text-align: center;">
          <a href="${shopUrl}" class="button-gold" style="display: inline-block; background-color: #C6A664; color: #1A1A1A; font-weight: 700; font-size: 12px; letter-spacing: 2.5px; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border-radius: 4px;">
            EXPLORE THE COLLECTION
          </a>
          <p style="font-size: 11px; color: rgba(250,247,242,0.5); margin-top: 18px;">
            Use code <strong style="color: #C6A664;">KHAVYN10</strong> at checkout for 10% off your inaugural order.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 30px; background-color: #141414; border-top: 1px solid #2E2820; text-align: center;">
          <div style="font-size: 11px; color: rgba(250, 247, 242, 0.45); line-height: 1.8;">
            KHAVYN Fashion Private Limited<br/>
            Sr. No. 80/16, Kavita Apartment, Samarth Nagar, New Sangavi, Pune – 411027, Maharashtra<br/>
            Concierge Desk: <a href="mailto:complaint@khavyn.com" style="color: #C6A664; text-decoration: none;">complaint@khavyn.com</a> | WhatsApp: <a href="https://wa.me/919373205258" style="color: #C6A664; text-decoration: none;">+91 93732 05258</a>
          </div>
          <div style="font-size: 10px; color: rgba(250, 247, 242, 0.3); margin-top: 14px;">
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
