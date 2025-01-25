import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import CookieConsent from "@/components/CookieConsent";
import UserProvider from "@/context/UserContext";
import { cookies } from "next/headers";
import { Theme, ThemeProvider } from "@/context/ThemeContext";
import LegalConsent from "@/components/LegalConsent";
import Head from "next/head";

export const metadata = {
  title: "RottenBrains",
  description: "Your Hub for Movie Reviews and Streaming!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read theme from cookie
  const cookieStore = await cookies();
  const themeCookieValue = cookieStore.get("theme")?.value;

  // Validate and assign theme
  const themeCookie: Theme = themeCookieValue === "dark" ? "dark" : "light";

  return (
    <html lang="en" className={`${GeistSans.className} ${themeCookie}`}>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4557341861686356"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body className="overflow-x-hidden bg-background text-foreground">
        <UserProvider>
          <ThemeProvider initialTheme={themeCookie}>
            {children}
            <Toaster />
            <Analytics />
            <CookieConsent />
            <LegalConsent />
            <SpeedInsights />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
