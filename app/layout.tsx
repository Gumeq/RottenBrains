// app/layout.tsx

import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import CookieConsent from "@/components/CookieConsent";
import UserProvider from "@/context/UserContext";
import { cookies } from "next/headers";
import { Theme, ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "RottenBrains",
  description: "Your Hub for Movie Reviews and Streaming!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read theme from cookie
  const themeCookieValue = cookies().get("theme")?.value;

  // Validate and assign theme
  const themeCookie: Theme = themeCookieValue === "dark" ? "dark" : "light";

  return (
    <html lang="en" className={`${GeistSans.className} ${themeCookie}`}>
      <head>{/* Other head elements */}</head>
      <body className="overflow-x-hidden bg-background text-foreground">
        <UserProvider>
          <ThemeProvider initialTheme={themeCookie}>
            {children}
            <Toaster />
            <Analytics />
            <CookieConsent />
            <SpeedInsights />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
