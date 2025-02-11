import Bottombar from "@/components/features/navigation/mobile/NavBottom";
import React from "react";
import HomeNav from "../components/features/navigation/desktop/Navbar";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import CookieConsent from "@/components/features/consent/CookieConsent";
import UserProvider from "@/hooks/UserContext";
import { cookies } from "next/headers";
import { Theme, ThemeProvider } from "@/hooks/ThemeContext";
import LegalConsent from "@/components/features/consent/LegalConsent";
import GoogleAdsense from "@/components/common/GoogleAdSense";
import MainContent from "../components/common/MainContent";
import { SidebarProvider } from "@/hooks/SidebarContext";
import { createClient } from "@/lib/supabase/server";
import TopLoader from "@/components/features/loaders/TopLoader";
import OneTapComponent from "@/components/features/auth/GoogleOneTap";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";

export const metadata = {
  title: "Rotten Brains | Stream movies and TV for free in HD quality.",
  description:
    "Watch movies and tv shows in HD quality for free. Discover all new movies in 2025. Stream for free in the best HD quality possible | Rotten Brains",
  other: {
    script: [
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4557341861686356",
        async: true,
        crossOrigin: "anonymous",
      },
    ],
  },
};

export default async function NotProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read theme from cookie
  const cookieStore = await cookies();
  const themeCookieValue = cookieStore.get("theme")?.value;

  // Validate and assign theme
  const themeCookie: Theme = themeCookieValue === "light" ? "light" : "dark";

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
      <UserProvider initialUser={initialUser}>
        <ThemeProvider initialTheme={themeCookie}>
          <SidebarProvider>
            <body className="custom-scrollbar w-full overflow-x-hidden bg-background text-foreground transition-all duration-300">
              <TopLoader />
              <header>
                <div className="hidden lg:flex">
                  <HomeNav></HomeNav>
                </div>
              </header>
              <MainContent>{children}</MainContent>
              <footer></footer>
              <CookieConsent />
              {/* <OneTapComponent /> */}
              <LegalConsent />
              <Toaster />
              {/* <Analytics />
							<SpeedInsights /> */}
              <GoogleAnalytics gtag={"G-06SFYC5DWK"} />
              <GoogleAdsense pId="4557341861686356" />
            </body>
          </SidebarProvider>
        </ThemeProvider>
      </UserProvider>
    </html>
  );
}
