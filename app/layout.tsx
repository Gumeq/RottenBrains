import React from "react";
import HomeNav from "../components/features/navigation/desktop/Navbar";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import CookieConsent from "@/components/features/consent/CookieConsent";
import UserProvider from "@/hooks/UserContext";
import { cookies } from "next/headers";
import LegalConsent from "@/components/features/consent/LegalConsent";
import GoogleAdsense from "@/components/common/GoogleAdSense";
import MainContent from "../components/common/MainContent";
import { SidebarProvider } from "@/hooks/SidebarContext";
import { createClient } from "@/lib/supabase/server";
import TopLoader from "@/components/features/loaders/TopLoader";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";
import { ThemeProvider } from "next-themes";
import IubendaScripts from "@/components/features/consent/IubendaConsent";
import PopunderAd from "@/components/features/ads/PopunderAd";

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
    <html>
      <body>404 error</body>
    </html>
  );

  // return (
  //   <html lang="en" suppressHydrationWarning>
  //     <head>
  //       <meta
  //         httpEquiv="Delegate-CH"
  //         content="Sec-CH-UA https://s.magsrv.com;
  //                  Sec-CH-UA-Mobile https://s.magsrv.com;
  //                  Sec-CH-UA-Arch https://s.magsrv.com;
  //                  Sec-CH-UA-Model https://s.magsrv.com;
  //                  Sec-CH-UA-Platform https://s.magsrv.com;
  //                  Sec-CH-UA-Platform-Version https://s.magsrv.com;
  //                  Sec-CH-UA-Bitness https://s.magsrv.com;
  //                  Sec-CH-UA-Full-Version-List https://s.magsrv.com;
  //                  Sec-CH-UA-Full-Version https://s.magsrv.com;"
  //       />
  //     </head>
  //     <UserProvider initialUser={initialUser}>
  //       <SidebarProvider>
  //         <body className="custom-scrollbar max-h-[100dvh] w-full overflow-x-hidden bg-background text-foreground transition-all duration-300">
  //           <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  //             <TopLoader />
  //             <header>
  //               <div className="hidden lg:flex">
  //                 <HomeNav></HomeNav>
  //               </div>
  //             </header>
  //             <MainContent>{children}</MainContent>
  //             <footer></footer>
  //             {/* <CookieConsent /> */}
  //             {/* <OneTapComponent /> */}
  //             <LegalConsent />
  //             <Toaster />
  //             {/* <IubendaScripts /> */}
  //             {/* <Analytics />
  // 						<SpeedInsights /> */}
  //             <GoogleAnalytics gtag={"G-06SFYC5DWK"} />
  //             {/* <GoogleAdsense pId="4557341861686356" /> */}
  //           </ThemeProvider>
  //         </body>
  //       </SidebarProvider>
  //     </UserProvider>
  //   </html>
  // );
}
