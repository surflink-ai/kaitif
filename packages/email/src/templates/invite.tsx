// @ts-nocheck - React 18/19 type mismatch
import * as React from "react";
import { Text, Button, Section, Hr } from "@react-email/components";
import { BaseEmail, styles, colors } from "./base";

interface InviteEmailProps {
  inviterName: string;
  role: "USER" | "ADMIN";
  inviteUrl: string;
  expiresInDays?: number;
}

const roleDescriptions = {
  USER: "As a member, you'll be able to purchase passes, join events, complete challenges, and trade gear in our marketplace.",
  ADMIN: "As an admin, you'll have access to the admin dashboard to help manage the park, users, events, and more.",
};

export function InviteEmail({
  inviterName,
  role = "USER",
  inviteUrl,
  expiresInDays = 7,
}: InviteEmailProps) {
  const isAdminInvite = role === "ADMIN";

  return (
    <BaseEmail
      previewText={`${inviterName} invited you to join Kaitif${isAdminInvite ? " as an Admin" : ""}`}
    >
      <Text style={styles.heading}>You're Invited!</Text>

      <Text style={styles.paragraph}>
        <span style={styles.highlight}>{inviterName}</span> has invited you to
        join Kaitif Skatepark
        {isAdminInvite ? " as an Admin" : ""}.
      </Text>

      <Text style={styles.paragraph}>
        Kaitif is your all-in-one skatepark companion. {roleDescriptions[role]}
      </Text>

      <Section style={{ textAlign: "center", margin: "32px 0" }}>
        <Button href={inviteUrl} style={styles.button}>
          Accept Invitation
        </Button>
      </Section>

      {isAdminInvite && (
        <Section style={styles.infoBox}>
          <Text
            style={{
              ...styles.paragraph,
              margin: 0,
              fontSize: "14px",
              color: colors.primary,
            }}
          >
            <strong>Admin Access</strong>
          </Text>
          <Text
            style={{
              ...styles.paragraph,
              margin: "8px 0 0 0",
              fontSize: "14px",
            }}
          >
            You're being invited as an Admin. After signing up, you'll have
            access to the admin dashboard at admin.kaitif.com
          </Text>
        </Section>
      )}

      <Hr style={styles.hr} />

      <Text style={styles.smallText}>
        This invitation expires in {expiresInDays} days. If you didn't expect
        this invitation, you can safely ignore this email.
      </Text>

      <Text style={{ ...styles.smallText, marginTop: "16px" }}>
        If the button doesn't work, copy and paste this link into your browser:
        <br />
        <span style={{ color: colors.primary, wordBreak: "break-all" }}>
          {inviteUrl}
        </span>
      </Text>
    </BaseEmail>
  );
}

export default InviteEmail;
