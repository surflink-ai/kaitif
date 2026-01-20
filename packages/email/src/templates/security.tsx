// @ts-nocheck - React 18/19 type mismatch
import * as React from "react";
import { Text, Button, Section, Hr } from "@react-email/components";
import { BaseEmail, styles, colors } from "./base";

interface DeviceInfo {
  browser?: string;
  os?: string;
  location?: string;
  ip?: string;
  time?: string;
}

interface SecurityAlertEmailProps {
  name: string;
  event: "new_login" | "password_changed" | "email_changed";
  deviceInfo?: DeviceInfo;
  actionUrl?: string;
}

const eventTitles = {
  new_login: "New Login Detected",
  password_changed: "Password Changed",
  email_changed: "Email Address Changed",
};

const eventDescriptions = {
  new_login: "A new login to your Kaitif account was detected.",
  password_changed: "The password for your Kaitif account was recently changed.",
  email_changed: "The email address for your Kaitif account was recently changed.",
};

export function SecurityAlertEmail({
  name = "there",
  event,
  deviceInfo = {},
  actionUrl = "https://kaitif.com/profile/security",
}: SecurityAlertEmailProps) {
  const title = eventTitles[event] || "Security Alert";
  const description = eventDescriptions[event] || "A security event occurred on your account.";

  return (
    <BaseEmail previewText={`Security Alert: ${title}`}>
      <Text style={styles.heading}>{title}</Text>

      <Text style={styles.paragraph}>Hey {name},</Text>

      <Text style={styles.paragraph}>{description}</Text>

      {Object.keys(deviceInfo).length > 0 && (
        <>
          <Hr style={styles.hr} />

          <Section
            style={{
              backgroundColor: "rgba(245, 245, 240, 0.05)",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <Text
              style={{
                ...styles.paragraph,
                margin: "0 0 12px 0",
                fontWeight: "bold",
                color: colors.text,
              }}
            >
              Device Details:
            </Text>

            {deviceInfo.browser && (
              <Text style={{ ...styles.paragraph, margin: "4px 0", fontSize: "14px" }}>
                <span style={{ color: colors.textMuted }}>Browser:</span>{" "}
                {deviceInfo.browser}
              </Text>
            )}

            {deviceInfo.os && (
              <Text style={{ ...styles.paragraph, margin: "4px 0", fontSize: "14px" }}>
                <span style={{ color: colors.textMuted }}>Operating System:</span>{" "}
                {deviceInfo.os}
              </Text>
            )}

            {deviceInfo.location && (
              <Text style={{ ...styles.paragraph, margin: "4px 0", fontSize: "14px" }}>
                <span style={{ color: colors.textMuted }}>Location:</span>{" "}
                {deviceInfo.location}
              </Text>
            )}

            {deviceInfo.ip && (
              <Text style={{ ...styles.paragraph, margin: "4px 0", fontSize: "14px" }}>
                <span style={{ color: colors.textMuted }}>IP Address:</span>{" "}
                {deviceInfo.ip}
              </Text>
            )}

            {deviceInfo.time && (
              <Text style={{ ...styles.paragraph, margin: "4px 0", fontSize: "14px" }}>
                <span style={{ color: colors.textMuted }}>Time:</span>{" "}
                {deviceInfo.time}
              </Text>
            )}
          </Section>
        </>
      )}

      <Section style={styles.warningBox}>
        <Text
          style={{
            ...styles.paragraph,
            margin: 0,
            fontSize: "14px",
            color: "#EF4444",
          }}
        >
          <strong>Wasn't you?</strong> If you don't recognize this activity,
          your account may be compromised. Please secure your account
          immediately.
        </Text>
      </Section>

      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button href={actionUrl} style={styles.button}>
          Review Account Security
        </Button>
      </Section>

      <Hr style={styles.hr} />

      <Text style={styles.smallText}>
        For your security, we recommend:
      </Text>
      <Text style={{ ...styles.smallText, margin: "8px 0 0 16px" }}>
        - Using a strong, unique password
        <br />
        - Signing out from devices you don't recognize
        <br />
        - Enabling two-factor authentication when available
      </Text>
    </BaseEmail>
  );
}

export default SecurityAlertEmail;
