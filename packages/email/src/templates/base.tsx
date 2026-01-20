// @ts-nocheck - React 18/19 type mismatch with @react-email/components
import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Preview,
  Hr,
} from "@react-email/components";

// Kaitif brand colors
const colors = {
  background: "#080808",
  cardBackground: "#111111",
  primary: "#FFCC00",
  text: "#F5F5F0",
  textMuted: "rgba(245, 245, 240, 0.6)",
  textFaint: "rgba(245, 245, 240, 0.4)",
  border: "rgba(245, 245, 240, 0.1)",
};

const styles = {
  body: {
    backgroundColor: colors.background,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: 0,
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  logoSection: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },
  logo: {
    fontSize: "32px",
    fontWeight: "bold",
    color: colors.primary,
    letterSpacing: "4px",
    margin: 0,
    textDecoration: "none",
  },
  card: {
    backgroundColor: colors.cardBackground,
    border: `2px solid ${colors.border}`,
    padding: "32px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: colors.text,
    textTransform: "uppercase" as const,
    letterSpacing: "2px",
    margin: "0 0 16px 0",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "24px",
    color: colors.textMuted,
    margin: "0 0 16px 0",
  },
  button: {
    display: "inline-block",
    backgroundColor: colors.primary,
    color: colors.background,
    fontSize: "14px",
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    padding: "16px 32px",
    textDecoration: "none",
    textAlign: "center" as const,
    border: "none",
    cursor: "pointer",
  },
  buttonSecondary: {
    display: "inline-block",
    backgroundColor: "transparent",
    color: colors.text,
    fontSize: "14px",
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    padding: "14px 30px",
    textDecoration: "none",
    textAlign: "center" as const,
    border: `2px solid ${colors.border}`,
    cursor: "pointer",
  },
  hr: {
    borderColor: colors.border,
    margin: "24px 0",
  },
  footer: {
    textAlign: "center" as const,
    marginTop: "32px",
  },
  footerText: {
    fontSize: "12px",
    color: colors.textFaint,
    margin: 0,
  },
  footerLink: {
    color: colors.textFaint,
    textDecoration: "underline",
  },
  smallText: {
    fontSize: "12px",
    color: colors.textFaint,
    margin: "16px 0 0 0",
  },
  highlight: {
    color: colors.primary,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "rgba(255, 204, 0, 0.1)",
    border: `1px solid ${colors.primary}`,
    padding: "16px",
    marginBottom: "16px",
  },
  warningBox: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid #EF4444",
    padding: "16px",
    marginBottom: "16px",
  },
};

interface BaseEmailProps {
  previewText: string;
  children: React.ReactNode;
}

export function BaseEmail({ previewText, children }: BaseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Logo Header */}
          <Section style={styles.logoSection}>
            <Link href="https://kaitif.com" style={styles.logo}>
              KAITIF
            </Link>
          </Section>

          {/* Content Card */}
          <Section style={styles.card}>{children}</Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Kaitif Skatepark | Your local shred destination
            </Text>
            <Text style={{ ...styles.footerText, marginTop: "8px" }}>
              <Link href="https://kaitif.com/privacy" style={styles.footerLink}>
                Privacy Policy
              </Link>
              {" | "}
              <Link href="https://kaitif.com/terms" style={styles.footerLink}>
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Export styles for use in other templates
export { styles, colors };
