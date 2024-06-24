import { GeistSans } from "geist/font/sans";
import "./globals.css";
import LeftSidebar from "@/components/LeftSidebar";
import Head from "next/head";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "ViewVault",
	description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={GeistSans.className}>
			<Head>
				<script
					src="https://accounts.google.com/gsi/client"
					async
					defer
				></script>
			</Head>
			<body className="bg-background text-foreground overflow-x-hidden">
				<main className="">{children}</main>
			</body>
		</html>
	);
}
