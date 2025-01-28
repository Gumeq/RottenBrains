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
import GoogleAdsense from "@/components/GoogleAdSense";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "RottenBrains",
  description: "Your Hub for Movie Reviews and Streaming!",
  other: {
    // Add the AdSense script as part of the metadata API
    script: [
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4557341861686356",
        async: true,
        crossOrigin: "anonymous",
      },
    ],
  },
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

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  let initialUser = null;

  if (authUser) {
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    initialUser = userData;
  }

  return (
    <html lang="en" className={`${GeistSans.className} ${themeCookie}`}>
      <body className="overflow-x-hidden bg-background text-foreground">
        <UserProvider initialUser={initialUser}>
          <ThemeProvider initialTheme={themeCookie}>
            {children}
            <Toaster />
            <Analytics />
            <CookieConsent />
            <LegalConsent />
            <SpeedInsights />
            <GoogleAdsense pId="4557341861686356" />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
