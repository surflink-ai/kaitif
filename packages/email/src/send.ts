import { resend, EMAIL_CONFIG } from "./client";
import { WelcomeEmail } from "./templates/welcome";
import { VerifyEmail } from "./templates/verify";
import { ResetPasswordEmail } from "./templates/reset";
import { RoleChangeEmail } from "./templates/role-change";
import { SecurityAlertEmail } from "./templates/security";
import { InviteEmail } from "./templates/invite";

// Common response type
interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  to: string,
  name: string,
  loginUrl?: string
): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: "Welcome to Kaitif Skatepark!",
      react: WelcomeEmail({ name, loginUrl }),
    });

    if (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error("Error sending welcome email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  verifyUrl: string,
  expiresInHours = 6
): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: "Verify your Kaitif email address",
      react: VerifyEmail({ name, verifyUrl, expiresInHours }),
    });

    if (error) {
      console.error("Failed to send verification email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error("Error sending verification email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send password reset link
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string,
  expiresInMinutes = 60
): Promise<EmailResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: "Reset your Kaitif password",
      react: ResetPasswordEmail({ name, resetUrl, expiresInMinutes }),
    });

    if (error) {
      console.error("Failed to send password reset email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error("Error sending password reset email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send role change notification
 */
export async function sendRoleChangeEmail(
  to: string,
  name: string,
  oldRole: string,
  newRole: string,
  changedBy?: string
): Promise<EmailResponse> {
  try {
    const isPromotion =
      (oldRole === "USER" && (newRole === "ADMIN" || newRole === "SUPERADMIN")) ||
      (oldRole === "ADMIN" && newRole === "SUPERADMIN");

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: `Your Kaitif account has been ${isPromotion ? "upgraded" : "updated"}`,
      react: RoleChangeEmail({ name, oldRole, newRole, changedBy }),
    });

    if (error) {
      console.error("Failed to send role change email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error("Error sending role change email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send security alert (new login, password changed, etc.)
 */
export async function sendSecurityAlertEmail(
  to: string,
  name: string,
  event: "new_login" | "password_changed" | "email_changed",
  deviceInfo?: {
    browser?: string;
    os?: string;
    location?: string;
    ip?: string;
    time?: string;
  },
  actionUrl?: string
): Promise<EmailResponse> {
  try {
    const subjects = {
      new_login: "New login to your Kaitif account",
      password_changed: "Your Kaitif password was changed",
      email_changed: "Your Kaitif email was changed",
    };

    const { data, error } = await resend.emails.send({
      from: `Kaitif Security <${EMAIL_CONFIG.from.split("<")[1]?.replace(">", "") || "noreply@yourdomain.com"}>`,
      to,
      subject: subjects[event],
      react: SecurityAlertEmail({ name, event, deviceInfo, actionUrl }),
    });

    if (error) {
      console.error("Failed to send security alert email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error("Error sending security alert email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send admin invitation email
 */
export async function sendInviteEmail(
  to: string,
  inviterName: string,
  role: "USER" | "ADMIN",
  inviteUrl: string,
  expiresInDays = 7
): Promise<EmailResponse> {
  try {
    const isAdmin = role === "ADMIN";

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject: `${inviterName} invited you to join Kaitif${isAdmin ? " as an Admin" : ""}`,
      react: InviteEmail({ inviterName, role, inviteUrl, expiresInDays }),
    });

    if (error) {
      console.error("Failed to send invite email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error("Error sending invite email:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
