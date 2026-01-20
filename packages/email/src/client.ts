import { Resend } from "resend";

// Initialize Resend client
// API Key should be set in environment variable: RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.FROM_EMAIL || "Kaitif <noreply@yourdomain.com>",
  replyTo: process.env.REPLY_TO_EMAIL || "support@yourdomain.com",
} as const;
