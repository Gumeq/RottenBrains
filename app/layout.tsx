import { GeistSans } from "geist/font/sans";
import "./globals.css";
const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";
import UserProvider from "@/context/UserContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ThemeScript from "@/components/ThemeScript";

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
			<head>
				<ThemeScript /> {/* Include ThemeScript in the head */}
			</head>
			<UserProvider>
				<body className="bg-background text-foreground overflow-x-hidden">
					<main className="">{children}</main>
					<Analytics />
					<SpeedInsights />
				</body>
			</UserProvider>
		</html>
	);
}
