import { GeistSans } from "geist/font/sans";
import "./globals.css";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";
import UserProvider from "@/context/UserContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/toaster";
import CookieConsent from "@/components/CookieConsent";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "RottenBrains",
  description: "Your Hub for Movie Reviews and Streaming!",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = 'light';
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme) {
                    theme = savedTheme;
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    theme = 'dark';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Error setting theme:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <UserProvider>
        <body className="overflow-x-hidden bg-background text-foreground">
          <main>{children}</main>
          <Toaster />
          <Analytics />
          <CookieConsent />
          <SpeedInsights />
        </body>
      </UserProvider>
    </html>
  );
}
