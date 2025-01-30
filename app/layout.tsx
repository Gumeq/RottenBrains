import Bottombar from "@/components/navigation/Bottombar";
import React from "react";
import HomeNav from "./protected/home/HomeNav";
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
import MainContent from "./protected/home/Main";
import { SidebarProvider } from "@/context/SidebarContext";

export const metadata = {
  title:
    "Rotten Brains | Stream Movies & TV Shows, Share Reviews, Connect with Friends",
  description:
    "Discover Rotten Brains – your ultimate destination to watch the latest movies and TV shows. Read and post reviews, share favorites with friends, and join a vibrant community of entertainment enthusiasts. Start streaming and sharing today!",
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
      <UserProvider initialUser={initialUser}>
        <ThemeProvider initialTheme={themeCookie}>
          <SidebarProvider>
            <body className="custom-scrollbar w-full overflow-x-hidden bg-background text-foreground transition-all duration-300">
              <header>
                <div className="hidden lg:flex">
                  <HomeNav></HomeNav>
                </div>
              </header>
              <MainContent>{children}</MainContent>
              <footer></footer>
              <CookieConsent />
              <LegalConsent />
              <Toaster />
              <Analytics />
              <SpeedInsights />
              <GoogleAdsense pId="4557341861686356" />
            </body>
          </SidebarProvider>
        </ThemeProvider>
      </UserProvider>
    </html>
  );
}
