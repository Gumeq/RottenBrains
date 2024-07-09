import { GeistSans } from "geist/font/sans";
import "./globals.css";
const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

import { GoogleAnalytics } from "@next/third-parties/google";

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
			<body className="bg-background text-foreground overflow-x-hidden">
				<main className="">{children}</main>
				<div className="w-full h-[200px] "> </div>
			</body>
			<GoogleAnalytics
				gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""}
			/>
		</html>
	);
}
