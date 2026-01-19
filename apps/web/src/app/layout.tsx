import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "@kaitif/ui";
import "@/styles/globals.css";
import { Providers } from "./providers";
import { InstallPrompt } from "@/components/InstallPrompt";

export const metadata: Metadata = {
  title: {
    default: "Kaitif Skatepark",
    template: "%s | Kaitif Skatepark",
  },
  description: "The premier indoor skatepark experience. Buy passes, join events, complete challenges, and connect with the community.",
  keywords: ["skatepark", "skateboarding", "BMX", "scooter", "indoor park", "skate"],
  authors: [{ name: "Kaitif Skatepark" }],
  creator: "Kaitif Skatepark",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kaitif",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kaitifskatepark.com",
    title: "Kaitif Skatepark",
    description: "The premier indoor skatepark experience",
    siteName: "Kaitif Skatepark",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaitif Skatepark",
    description: "The premier indoor skatepark experience",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-[#080808] antialiased">
        <Providers>
          {children}
          <InstallPrompt />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
