import { GeistSans } from "geist/font/sans";
import "./globals.css";
const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "Discover & Share Your Passion for Movies and TV",
	description:
		"Connect with fellow enthusiasts and dive deep into your favorite media.",
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
		</html>
	);
}
