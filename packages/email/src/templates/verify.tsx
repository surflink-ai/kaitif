// @ts-nocheck - React 18/19 type mismatch
import * as React from "react";
import { Text, Button, Section } from "@react-email/components";
import { BaseEmail, styles } from "./base";

interface VerifyEmailProps {
  name?: string;
  verifyUrl: string;
  expiresInHours?: number;
}

export function VerifyEmail({
  name = "there",
  verifyUrl,
  expiresInHours = 6,
}: VerifyEmailProps) {
  return (
    <BaseEmail previewText="Verify your Kaitif email address">
      <Text style={styles.heading}>Verify Your Email</Text>

      <Text style={styles.paragraph}>Hey {name},</Text>

      <Text style={styles.paragraph}>
        Thanks for signing up for Kaitif! Please verify your email address by
        clicking the button below.
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={verifyUrl} style={styles.button}>
          Verify Email Address
        </Button>
      </Section>

      <Text style={styles.smallText}>
        This link will expire in {expiresInHours} hours. If you didn't create an
        account with Kaitif, you can safely ignore this email.
      </Text>

      <Text style={{ ...styles.smallText, marginTop: "16px" }}>
        If the button doesn't work, copy and paste this link into your browser:
        <br />
        <span style={{ color: "#FFCC00", wordBreak: "break-all" }}>
          {verifyUrl}
        </span>
      </Text>
    </BaseEmail>
  );
}

export default VerifyEmail;
