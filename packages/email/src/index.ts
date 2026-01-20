// Kaitif Email Package
// Provides transactional email functionality using Resend

// Client exports
export { resend, EMAIL_CONFIG } from "./client";

// Email sending functions
export {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendRoleChangeEmail,
  sendSecurityAlertEmail,
  sendInviteEmail,
} from "./send";

// Template exports (for preview/testing)
export { WelcomeEmail } from "./templates/welcome";
export { VerifyEmail } from "./templates/verify";
export { ResetPasswordEmail } from "./templates/reset";
export { RoleChangeEmail } from "./templates/role-change";
export { SecurityAlertEmail } from "./templates/security";
export { InviteEmail } from "./templates/invite";
export { BaseEmail, styles as emailStyles, colors as emailColors } from "./templates/base";
