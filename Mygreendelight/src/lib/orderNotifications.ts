import { sendMail } from "./mailer";

export interface OrderNotificationPayload {
  orderId: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  address: {
    fullname?: string;
    mobile?: string;
    fulladress?: string;
    city?: string;
    pincode?: string;
    landmark?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    unit?: string;
    variationWeight?: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  walletDiscount?: number;
  farmerTip?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentId?: string;
  deliverySlot?: string;
  createdAt: Date;
}

/**
 * Generates an aesthetic HTML invoice email for Admin and Customer
 */
export function generateOrderHtmlEmail(payload: OrderNotificationPayload, isAdmin: boolean = false): string {
  const itemsHtml = payload.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #edf2f7;">
        <td style="padding: 10px 0; font-size: 13px; color: #2d3748; font-weight: 600;">
          ${item.name} ${item.variationWeight ? `(${item.variationWeight})` : item.unit ? `(${item.unit})` : ""}
        </td>
        <td style="padding: 10px 0; font-size: 13px; color: #718096; text-align: center;">
          x${item.quantity}
        </td>
        <td style="padding: 10px 0; font-size: 13px; color: #2d3748; font-weight: bold; text-align: right;">
          ₹${item.price * item.quantity}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #093e21 0%, #0c831f 100%); color: #ffffff; padding: 25px 30px; text-align: left; }
          .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
          .content { padding: 30px; }
          .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 15px; margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .total-row { border-top: 2px solid #e2e8f0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #a0aec0; border-top: 1px solid #e2e8f0; }
          .btn { display: inline-block; background: #0c831f; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 12px; font-weight: bold; font-size: 13px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">${isAdmin ? "🚨 NEW ORDER ALERT" : "✓ ORDER CONFIRMED"}</span>
            <h1 style="margin: 10px 0 0 0; font-size: 24px; font-weight: 900;">SubziQuick Bhopal</h1>
            <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;">Order #${payload.orderId.slice(-6).toUpperCase()}</p>
          </div>

          <div class="content">
            <div class="info-box">
              <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #166534;">
                ${isAdmin ? `👤 Customer: ${payload.customerName} (${payload.customerMobile})` : `Hi ${payload.customerName}, your farm fresh order is confirmed!`}
              </p>
              <p style="margin: 0; font-size: 12px; color: #15803d; line-height: 1.5;">
                📍 <strong>Delivery Address:</strong> ${payload.address.fulladress || "Bhopal"}, PIN: ${payload.address.pincode || "462043"}<br>
                ⏰ <strong>Delivery Slot:</strong> ${payload.deliverySlot || "Standard Express"}<br>
                💳 <strong>Payment Mode:</strong> ${payload.paymentMethod.toUpperCase()} ${payload.paymentId ? `(Ref: ${payload.paymentId})` : ""}
              </p>
            </div>

            <h3 style="margin: 20px 0 10px 0; font-size: 15px; color: #1a202c;">Items Ordered</h3>
            <table class="table">
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #edf2f7;">
              <table style="width: 100%; font-size: 13px; color: #4a5568;">
                <tr>
                  <td>Subtotal:</td>
                  <td style="text-align: right; font-weight: 600;">₹${payload.subtotal}</td>
                </tr>
                <tr>
                  <td>Delivery Fee:</td>
                  <td style="text-align: right; font-weight: 600;">₹${payload.deliveryFee}</td>
                </tr>
                ${
                  payload.discount > 0
                    ? `<tr><td style="color: #16a34a;">Coupon Discount:</td><td style="text-align: right; color: #16a34a; font-weight: 600;">-₹${payload.discount}</td></tr>`
                    : ""
                }
                ${
                  (payload.walletDiscount || 0) > 0
                    ? `<tr><td style="color: #16a34a;">GreenPoints Wallet:</td><td style="text-align: right; color: #16a34a; font-weight: 600;">-₹${payload.walletDiscount}</td></tr>`
                    : ""
                }
                ${
                  (payload.farmerTip || 0) > 0
                    ? `<tr><td>Farmer Tip:</td><td style="text-align: right; font-weight: 600;">+₹${payload.farmerTip}</td></tr>`
                    : ""
                }
                <tr style="border-top: 2px solid #e2e8f0; font-size: 16px; font-weight: 900; color: #093e21;">
                  <td style="padding-top: 10px;">Total Bill:</td>
                  <td style="padding-top: 10px; text-align: right;">₹${payload.totalAmount}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center;">
              ${
                isAdmin
                  ? `<a href="https://subziquick.in/admin/manageorder" class="btn">Open Admin Dashboard & Dispatch Fleet →</a>`
                  : `<a href="https://subziquick.in/user/myorder" class="btn">Track Your Fresh Delivery →</a>`
              }
            </div>
          </div>

          <div class="footer">
            SubziQuick Bhopal • Amrai, Bagsewaniya, Bhopal (MP - 462043)<br>
            Helpline: +91 9981418565 • subziquick.in
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Builds formatted WhatsApp receipt message
 */
export function formatOrderWhatsAppMessage(payload: OrderNotificationPayload): string {
  const itemsText = payload.items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`
    )
    .join("\n");

  return (
    `*🔔 NAYA ORDER RECEIVED - SubziQuick*\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `🛒 *Order ID:* #${payload.orderId.slice(-6).toUpperCase()}\n` +
    `👤 *Customer:* ${payload.customerName} (${payload.customerMobile})\n` +
    `📍 *Address:* ${payload.address.fulladress || "Bhopal"}, PIN: ${payload.address.pincode || "462043"}\n` +
    `⏰ *Delivery Slot:* ${payload.deliverySlot || "Standard Express"}\n` +
    `💳 *Payment:* ${payload.paymentMethod.toUpperCase()} ${payload.paymentId ? `(Ref: ${payload.paymentId})` : ""}\n\n` +
    `📦 *Items Ordered:*\n${itemsText}\n\n` +
    `💵 *Total Bill:* ₹${payload.totalAmount}\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `👉 Manage Order: https://subziquick.in/admin/manageorder`
  );
}

/**
 * Dispatch Multi-Channel Notifications (Email, SMS & Webhook)
 */
export async function sendOrderNotifications(payload: OrderNotificationPayload) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_USER || "anuragsinghas183@gmail.com";

  // 1. 📧 Send Admin Instant Email
  try {
    const adminHtml = generateOrderHtmlEmail(payload, true);
    await sendMail(
      adminEmail,
      `🚨 New Order #${payload.orderId.slice(-6).toUpperCase()} Received! (₹${payload.totalAmount}) - SubziQuick`,
      adminHtml
    );
    console.log("✓ Admin order notification email sent to:", adminEmail);
  } catch (emailErr) {
    console.warn("Admin email dispatch warning:", emailErr);
  }

  // 2. 📧 Send Customer Receipt Email (if customer has email)
  if (payload.customerEmail && payload.customerEmail.includes("@")) {
    try {
      const customerHtml = generateOrderHtmlEmail(payload, false);
      await sendMail(
        payload.customerEmail,
        `✓ Order Confirmed #${payload.orderId.slice(-6).toUpperCase()} - SubziQuick Farm Fresh`,
        customerHtml
      );
      console.log("✓ Customer receipt email sent to:", payload.customerEmail);
    } catch (cEmailErr) {
      console.warn("Customer receipt email warning:", cEmailErr);
    }
  }

  // 3. 📱 Fast2SMS Instant SMS to Admin & Customer (If FAST2SMS_API_KEY is configured in .env)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const adminPhone = process.env.ADMIN_PHONE || "9981418565";
      const smsMessage = `SubziQuick: New Order #${payload.orderId.slice(-6).toUpperCase()} for Rs.${payload.totalAmount} by ${payload.customerName} (${payload.customerMobile}). Deliver to: ${payload.address.fulladress?.slice(0, 40)}`;

      await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "q",
          message: smsMessage,
          language: "english",
          flash: 0,
          numbers: adminPhone,
        }),
      });
      console.log("✓ Instant SMS dispatched via Fast2SMS to:", adminPhone);
    } catch (smsErr) {
      console.warn("Fast2SMS dispatch warning:", smsErr);
    }
  }
}
