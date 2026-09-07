import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER || "anuragsinghas183@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function sendMail(
  to: string,
  subject: string,
  html: string
) {
  if (!to || !to.includes("@")) {
    console.warn("Invalid email recipient skipped:", to);
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: `"SubziQuick Bhopal" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✓ Email sent to:", to, "ID:", info.messageId);
    return info;
  } catch (error: any) {
    console.error("❌ SendMail Error for", to, ":", error?.message || error);
    return null;
  }
}