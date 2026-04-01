import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import { LightboxProvider } from "./components/LightboxProvider";
import Navbar from "./components/Navbar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Atharva Verma | Software Engineer",
	description:
		"Software engineer and builder. Building with React, TypeScript, Python, ASR, RAG, and AI/ML. Based in India.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* GoatCounter analytics — tracks unique visitors, no cookies */}
				{process.env.NEXT_PUBLIC_GOATCOUNTER_CODE && (
					<script
						async
						data-goatcounter="/api/stats/count"
						src="/api/stats/script"
					/>
				)}
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<LightboxProvider>
					<Navbar />
					{children}
					<Footer />
					<BackToTop />
				</LightboxProvider>
			</body>
		</html>
	);
}
