import { GeistSans } from "geist/font/sans";
import "./globals.css";
import LeftSidebar from "@/components/LeftSidebar";
import Head from "next/head";
import { useState } from "react";

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: "ViewVault",
	description: "The Media Social Media Platform",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [loading, setLoading] = useState(false);
	return (
		<html lang="en" className={GeistSans.className}>
			<body className="bg-background text-foreground overflow-x-hidden">
				<main className="">{children}</main>
			</body>
		</html>
	);
}
