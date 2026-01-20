// @ts-nocheck - React 18/19 type mismatch
import * as React from "react";
import { Text, Button, Section } from "@react-email/components";
import { BaseEmail, styles, colors } from "./base";

interface ResetPasswordEmailProps {
  name?: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

export function ResetPasswordEmail({
  name = "there",
  resetUrl,
  expiresInMinutes = 60,
}: ResetPasswordEmailProps) {
  return (
    <BaseEmail previewText="Reset your Kaitif password">
      <Text style={styles.heading}>Reset Password</Text>

      <Text style={styles.paragraph}>Hey {name},</Text>

      <Text style={styles.paragraph}>
        We received a request to reset the password for your Kaitif account.
        Click the button below to create a new password.
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={resetUrl} style={styles.button}>
          Reset Password
        </Button>
      </Section>

      <Section style={styles.warningBox}>
        <Text
          style={{
            ...styles.paragraph,
            margin: 0,
            fontSize: "14px",
            color: "#EF4444",
          }}
        >
          This link will expire in {expiresInMinutes} minutes for security
          reasons. If you didn't request a password reset, please ignore this
          email or contact support if you're concerned.
        </Text>
      </Section>

      <Text style={styles.smallText}>
        If the button doesn't work, copy and paste this link into your browser:
        <br />
        <span style={{ color: colors.primary, wordBreak: "break-all" }}>
          {resetUrl}
        </span>
      </Text>
    </BaseEmail>
  );
}

export default ResetPasswordEmail;
