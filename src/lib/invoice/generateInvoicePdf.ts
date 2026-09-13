import { jsPDF } from "jspdf";

/**
 * KHAVYN Fashion Private Limited — GST Tax Invoice Generator
 * Generates an official, GST-compliant PDF invoice using jsPDF.
 */

// =========================================================================
// GST & COMPANY CONFIGURATION
// =========================================================================
export const COMPANY_DETAILS = {
  legalName: "KHAVYN Fashion Private Limited",
  brandName: "KHAVYN",
  registeredAddress: "Sr. No. 80/16, Kavita Apartment, Samarth Nagar, New Sangavi, Pune – 411027, Maharashtra",
  state: "Maharashtra",
  stateCode: "27",
  contactEmail: "complaint@khavyn.com",
  phone: "+91 93732 05258",
  website: "www.khavyn.com",
  /**
   * GSTIN PLACEHOLDER:
   * To be updated with the actual 15-digit GSTIN issued by the Government of India.
   * e.g., "27ABCDE1234F1Z5"
   */
  gstin: process.env.COMPANY_GSTIN || "GSTIN_PLACEHOLDER", // [OWNER ACTION REQUIRED: Update with official GSTIN]
};

export interface InvoiceItem {
  name: string;
  size?: string;
  colour?: string;
  hsnCode?: string;
  quantity: number;
  price: number; // Unit selling price inclusive of tax
}

export interface GenerateInvoiceProps {
  orderNumber: string;
  orderDate?: Date | string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
  paymentType: "prepaid" | "partial_cod" | string;
  advancePaid: number;
  balanceDue: number;
  razorpayPaymentId?: string;
}

/**
 * Generates a GST compliant invoice PDF as a Node.js Buffer.
 */
export async function generateInvoicePdf(props: GenerateInvoiceProps): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const charcoal = [26, 26, 26]; // #1A1A1A
  const gold = [198, 166, 100]; // #C6A664
  const lightBg = [250, 247, 242]; // #FAF7F2
  const grey = [100, 100, 100];
  const borderGrey = [216, 201, 176]; // #D8C9B0

  let y = margin;

  // 1. Header Bar
  doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.rect(margin, y, contentWidth, 24, "F");

  // KHAVYN Brand Title
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text("K H A V Y N", margin + 8, y + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(250, 247, 242);
  doc.text("C R A F T I N G   E V E R Y D A Y   L U X U R Y", margin + 8, y + 18);

  // TAX INVOICE header badge
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("TAX INVOICE", pageWidth - margin - 8, y + 12, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text("ORIGINAL FOR RECIPIENT", pageWidth - margin - 8, y + 18, { align: "right" });

  y += 26;

  // 2. Gold Accent Divider
  doc.setDrawColor(gold[0], gold[1], gold[2]);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // 3. Seller & Invoice Metadata Block
  const colWidth = (contentWidth - 6) / 2;

  // Left Column: Seller Details
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin, y, colWidth, 40, "F");
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.setLineWidth(0.2);
  doc.rect(margin, y, colWidth, 40, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text("SOLD BY / SUPPLIER:", margin + 4, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(COMPANY_DETAILS.legalName, margin + 4, y + 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(grey[0], grey[1], grey[2]);
  const addressLines = doc.splitTextToSize(COMPANY_DETAILS.registeredAddress, colWidth - 8);
  doc.text(addressLines, margin + 4, y + 17);

  const afterAddressY = y + 17 + addressLines.length * 3.5;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text(`GSTIN: ${COMPANY_DETAILS.gstin}`, margin + 4, afterAddressY + 2);
  doc.setFont("helvetica", "normal");
  doc.text(`State: ${COMPANY_DETAILS.state} (Code: ${COMPANY_DETAILS.stateCode})`, margin + 4, afterAddressY + 6);

  // Right Column: Invoice & Order Metadata
  const rightColX = margin + colWidth + 6;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(rightColX, y, colWidth, 40, "F");
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(rightColX, y, colWidth, 40, "S");

  const invoiceNumber = `INV-${props.orderNumber.replace("KHV-", "")}`;
  const formattedDate = props.orderDate
    ? new Date(props.orderDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text("INVOICE DETAILS:", rightColX + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Invoice Number:", rightColX + 4, y + 12);
  doc.setFont("helvetica", "bold");
  doc.text(invoiceNumber, rightColX + 32, y + 12);

  doc.setFont("helvetica", "normal");
  doc.text("Order Number:", rightColX + 4, y + 17);
  doc.setFont("helvetica", "bold");
  doc.text(props.orderNumber, rightColX + 32, y + 17);

  doc.setFont("helvetica", "normal");
  doc.text("Invoice Date:", rightColX + 4, y + 22);
  doc.text(formattedDate, rightColX + 32, y + 22);

  doc.text("Payment Mode:", rightColX + 4, y + 27);
  doc.setFont("helvetica", "bold");
  const modeText = props.paymentType === "partial_cod" ? "Partial COD (50% Adv)" : "100% Prepaid (Razorpay)";
  doc.text(modeText, rightColX + 32, y + 27);

  if (props.razorpayPaymentId) {
    doc.setFont("helvetica", "normal");
    doc.text("Payment Ref:", rightColX + 4, y + 32);
    doc.text(props.razorpayPaymentId.substring(0, 18), rightColX + 32, y + 32);
  }

  y += 44;

  // 4. Billing & Shipping Address
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(margin, y, contentWidth, 22, "F");
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(margin, y, contentWidth, 22, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text("BILL TO / SHIP TO:", margin + 4, y + 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(props.shippingAddress.fullName || props.customerName, margin + 4, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(grey[0], grey[1], grey[2]);
  const custAddr = `${props.shippingAddress.street}, ${props.shippingAddress.city}, ${props.shippingAddress.state} – ${props.shippingAddress.pincode} | Phone: ${props.shippingAddress.phone || props.customerPhone || "N/A"} | Email: ${props.customerEmail}`;
  const custLines = doc.splitTextToSize(custAddr, contentWidth - 8);
  doc.text(custLines, margin + 4, y + 15);

  y += 26;

  // 5. Itemized Table
  // Table columns:
  // Item # | Description | HSN | Qty | Unit Price | Taxable | GST (5%) | Total
  const thHeight = 7;
  doc.setFillColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.rect(margin, y, contentWidth, thHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  const cX = {
    idx: margin + 3,
    desc: margin + 12,
    hsn: margin + 85,
    qty: margin + 104,
    rate: margin + 122,
    taxable: margin + 144,
    gst: margin + 163,
    total: pageWidth - margin - 3,
  };

  doc.text("#", cX.idx, y + 5);
  doc.text("Product Description", cX.desc, y + 5);
  doc.text("HSN", cX.hsn, y + 5);
  doc.text("Qty", cX.qty, y + 5);
  doc.text("Unit Rate", cX.rate, y + 5);
  doc.text("Taxable", cX.taxable, y + 5);
  doc.text("GST (5%)", cX.gst, y + 5);
  doc.text("Total (INR)", cX.total, y + 5, { align: "right" });

  y += thHeight;

  // Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  // Fashion items standard GST is 5% for price <= 1000, 12% for > 1000 (apparel slab).
  // Using 5% effective blended rate calculation for standard luxury apparel:
  const GST_RATE = 0.05;

  let totalTaxableCalculated = 0;
  let totalGstCalculated = 0;

  props.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    const taxableVal = itemTotal / (1 + GST_RATE);
    const gstVal = itemTotal - taxableVal;

    totalTaxableCalculated += taxableVal;
    totalGstCalculated += gstVal;

    const rowBg = index % 2 === 0 ? [255, 255, 255] : [248, 246, 242];
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(margin, y, contentWidth, 9, "F");
    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.line(margin, y + 9, pageWidth - margin, y + 9);

    doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
    doc.text(String(index + 1), cX.idx, y + 6);

    const descStr = `${item.name}${item.size ? ` (Size: ${item.size})` : ""}`;
    doc.text(descStr.substring(0, 42), cX.desc, y + 6);

    const hsnDisplay = item.hsnCode || "6205";
    doc.text(hsnDisplay, cX.hsn, y + 6);
    doc.text(String(item.quantity), cX.qty, y + 6);
    doc.text(`₹${item.price.toLocaleString("en-IN")}`, cX.rate, y + 6);
    doc.text(`₹${taxableVal.toFixed(2)}`, cX.taxable, y + 6);
    doc.text(`₹${gstVal.toFixed(2)}`, cX.gst, y + 6);
    doc.text(`₹${itemTotal.toLocaleString("en-IN")}`, cX.total, y + 6, { align: "right" });

    y += 9;
  });

  // Flat Shipping Row
  const shippingTaxable = props.shippingCharge / (1 + GST_RATE);
  const shippingGst = props.shippingCharge - shippingTaxable;
  totalTaxableCalculated += shippingTaxable;
  totalGstCalculated += shippingGst;

  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.line(margin, y + 8, pageWidth - margin, y + 8);

  doc.setTextColor(grey[0], grey[1], grey[2]);
  doc.text(String(props.items.length + 1), cX.idx, y + 5.5);
  doc.text("Standard Flat Shipping & Handling", cX.desc, y + 5.5);
  doc.text("9968", cX.hsn, y + 5.5); // SAC code for courier/freight transport
  doc.text("1", cX.qty, y + 5.5);
  doc.text(`₹${props.shippingCharge}`, cX.rate, y + 5.5);
  doc.text(`₹${shippingTaxable.toFixed(2)}`, cX.taxable, y + 5.5);
  doc.text(`₹${shippingGst.toFixed(2)}`, cX.gst, y + 5.5);
  doc.text(`₹${props.shippingCharge.toLocaleString("en-IN")}`, cX.total, y + 5.5, { align: "right" });

  y += 12;

  // 6. Summary Totals & Tax Breakdown Block
  const summaryBoxWidth = 85;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;

  // Left Note: Inter-state vs Intra-state GST
  const isIntraState =
    props.shippingAddress.state?.trim().toLowerCase().includes("maharashtra");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(grey[0], grey[1], grey[2]);
  doc.text("TAX BREAKDOWN SUMMARY:", margin + 2, y + 4);

  if (isIntraState) {
    const halfGst = totalGstCalculated / 2;
    doc.text(`• CGST (2.5%): ₹${halfGst.toFixed(2)}`, margin + 2, y + 9);
    doc.text(`• SGST (2.5%): ₹${halfGst.toFixed(2)}`, margin + 2, y + 14);
  } else {
    doc.text(`• IGST (5.0%): ₹${totalGstCalculated.toFixed(2)} (Inter-State Supply)`, margin + 2, y + 9);
  }
  doc.text("• Prices are inclusive of all applicable GST under Composition/Standard Scheme.", margin + 2, y + 19);

  // Right Totals Table
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.rect(summaryBoxX, y, summaryBoxWidth, 42, "F");
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.rect(summaryBoxX, y, summaryBoxWidth, 42, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);

  doc.text("Item Subtotal:", summaryBoxX + 4, y + 6);
  doc.text(`₹${props.subtotal.toLocaleString("en-IN")}`, summaryBoxX + summaryBoxWidth - 4, y + 6, { align: "right" });

  doc.text("Flat Shipping Charge:", summaryBoxX + 4, y + 12);
  doc.text(`₹${props.shippingCharge.toLocaleString("en-IN")}`, summaryBoxX + summaryBoxWidth - 4, y + 12, { align: "right" });

  doc.text("Total GST (Included):", summaryBoxX + 4, y + 18);
  doc.text(`₹${totalGstCalculated.toFixed(2)}`, summaryBoxX + summaryBoxWidth - 4, y + 18, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.line(summaryBoxX, y + 22, summaryBoxX + summaryBoxWidth, y + 22);

  doc.text("Grand Total:", summaryBoxX + 4, y + 28);
  doc.text(`₹${props.totalAmount.toLocaleString("en-IN")}`, summaryBoxX + summaryBoxWidth - 4, y + 28, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(34, 197, 94);
  doc.text("Amount Paid (Razorpay):", summaryBoxX + 4, y + 33);
  doc.text(`₹${props.advancePaid.toLocaleString("en-IN")}`, summaryBoxX + summaryBoxWidth - 4, y + 33, { align: "right" });

  if (props.balanceDue > 0) {
    doc.setTextColor(180, 83, 9);
    doc.setFont("helvetica", "bold");
    doc.text("Balance Due on Delivery:", summaryBoxX + 4, y + 38);
    doc.text(`₹${props.balanceDue.toLocaleString("en-IN")}`, summaryBoxX + summaryBoxWidth - 4, y + 38, { align: "right" });
  }

  y += 50;

  // 7. Declaration & Signatory
  doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(grey[0], grey[1], grey[2]);
  doc.text(
    "Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
    margin,
    y
  );

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(charcoal[0], charcoal[1], charcoal[2]);
  doc.text("For KHAVYN Fashion Private Limited", pageWidth - margin, y + 4, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(grey[0], grey[1], grey[2]);
  doc.text("Authorized Signatory (Computer Generated)", pageWidth - margin, y + 14, { align: "right" });

  // Return generated Buffer
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
