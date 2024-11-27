import { GeistSans } from "geist/font/sans";
import "./globals.css";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";
import UserProvider from "@/context/UserContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ThemeScript from "@/components/ThemeScript";
import { Toaster } from "@/components/ui/toaster";
import CookieConsent from "@/components/CookieConsent"; // Import the CookieConsent component
import Head from "next/head";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "RottenBrains",
  description: "Your Hub for Movie Reviews and Streaming!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <Head>
        <ThemeScript /> {/* Include ThemeScript in the head */}
      </Head>
      <UserProvider>
        <body className="overflow-x-hidden bg-background text-foreground">
          <main>{children}</main>
          <Toaster />
          <Analytics />
          <SpeedInsights />
          <CookieConsent /> {/* Add the CookieConsent component here */}
        </body>
      </UserProvider>
    </html>
  );
}
