// @ts-nocheck - React 18/19 type mismatch
import * as React from "react";
import { Text, Button, Section, Hr } from "@react-email/components";
import { BaseEmail, styles } from "./base";

interface WelcomeEmailProps {
  name: string;
  loginUrl?: string;
}

export function WelcomeEmail({
  name = "Skater",
  loginUrl = "https://kaitif.com/login",
}: WelcomeEmailProps) {
  return (
    <BaseEmail previewText={`Welcome to Kaitif, ${name}! Let's shred.`}>
      <Text style={styles.heading}>Welcome to Kaitif</Text>

      <Text style={styles.paragraph}>Hey {name},</Text>

      <Text style={styles.paragraph}>
        Welcome to the Kaitif Skatepark community! We're stoked to have you join
        us. Whether you're here to land your first kickflip or perfect your
        900s, you've found your spot.
      </Text>

      <Hr style={styles.hr} />

      <Text style={{ ...styles.paragraph, fontWeight: "bold", color: "#F5F5F0" }}>
        Here's what you can do:
      </Text>

      <Text style={styles.paragraph}>
        <span style={styles.highlight}>Buy Passes</span> - Get day, week, month, or annual
        passes for unlimited park access.
      </Text>

      <Text style={styles.paragraph}>
        <span style={styles.highlight}>Join Events</span> - Competitions, workshops, and
        community sessions are happening all the time.
      </Text>

      <Text style={styles.paragraph}>
        <span style={styles.highlight}>Complete Challenges</span> - Earn XP, level up, and
        collect badges by landing tricks.
      </Text>

      <Text style={styles.paragraph}>
        <span style={styles.highlight}>Trade Gear</span> - Buy and sell skateboards, scooters,
        and gear in our marketplace.
      </Text>

      <Hr style={styles.hr} />

      <Section style={{ textAlign: "center", marginTop: "24px" }}>
        <Button href={loginUrl} style={styles.button}>
          Get Started
        </Button>
      </Section>

      <Text style={styles.smallText}>
        See you at the park!
        <br />- The Kaitif Crew
      </Text>
    </BaseEmail>
  );
}

export default WelcomeEmail;
