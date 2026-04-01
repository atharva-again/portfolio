import type { Metadata } from "next";
import "./globals.css";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import { LightboxProvider } from "./components/LightboxProvider";
import Navbar from "./components/Navbar";

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
			<body style={{ margin: 0, padding: 0 }}>
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
