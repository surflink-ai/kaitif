// @ts-nocheck - React 18/19 type mismatch
import * as React from "react";
import { Text, Section, Hr } from "@react-email/components";
import { BaseEmail, styles, colors } from "./base";

interface RoleChangeEmailProps {
  name: string;
  oldRole: string;
  newRole: string;
  changedBy?: string;
}

const roleDescriptions: Record<string, string> = {
  USER: "You have standard user access to the Kaitif app including passes, events, challenges, and marketplace.",
  ADMIN: "You now have access to the admin dashboard where you can manage users, events, challenges, and more.",
  SUPERADMIN: "You have full administrative access including user role management and system settings.",
};

const roleDisplayNames: Record<string, string> = {
  USER: "User",
  ADMIN: "Admin",
  SUPERADMIN: "Super Admin",
};

export function RoleChangeEmail({
  name = "there",
  oldRole,
  newRole,
  changedBy,
}: RoleChangeEmailProps) {
  const isPromotion =
    (oldRole === "USER" && (newRole === "ADMIN" || newRole === "SUPERADMIN")) ||
    (oldRole === "ADMIN" && newRole === "SUPERADMIN");

  return (
    <BaseEmail
      previewText={`Your Kaitif account role has been ${isPromotion ? "upgraded" : "updated"}`}
    >
      <Text style={styles.heading}>
        {isPromotion ? "Role Upgraded" : "Role Updated"}
      </Text>

      <Text style={styles.paragraph}>Hey {name},</Text>

      <Text style={styles.paragraph}>
        Your account role on Kaitif has been{" "}
        {isPromotion ? "upgraded" : "updated"}.
      </Text>

      <Hr style={styles.hr} />

      <Section style={styles.infoBox}>
        <Text
          style={{
            margin: 0,
            fontSize: "14px",
            color: colors.text,
          }}
        >
          <span style={{ color: colors.textMuted }}>Previous Role:</span>{" "}
          <span style={{ textDecoration: "line-through", opacity: 0.6 }}>
            {roleDisplayNames[oldRole] || oldRole}
          </span>
        </Text>
        <Text
          style={{
            margin: "8px 0 0 0",
            fontSize: "14px",
            color: colors.text,
          }}
        >
          <span style={{ color: colors.textMuted }}>New Role:</span>{" "}
          <span style={styles.highlight}>
            {roleDisplayNames[newRole] || newRole}
          </span>
        </Text>
      </Section>

      <Text style={styles.paragraph}>
        <strong style={{ color: colors.text }}>What this means:</strong>
      </Text>

      <Text style={styles.paragraph}>
        {roleDescriptions[newRole] ||
          "Your access level has been updated. Contact support if you have questions."}
      </Text>

      {newRole === "ADMIN" || newRole === "SUPERADMIN" ? (
        <Text style={styles.paragraph}>
          You can access the admin dashboard at{" "}
          <span style={{ color: colors.primary }}>admin.kaitif.com</span>
        </Text>
      ) : null}

      <Hr style={styles.hr} />

      {changedBy && (
        <Text style={styles.smallText}>
          This change was made by a system administrator.
        </Text>
      )}

      <Text style={styles.smallText}>
        If you believe this change was made in error, please contact support
        immediately.
      </Text>
    </BaseEmail>
  );
}

export default RoleChangeEmail;
