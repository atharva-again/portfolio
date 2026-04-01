"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		const open = () => setHidden(true);
		const close = () => setHidden(false);
		window.addEventListener("infopanel:open", open);
		window.addEventListener("infopanel:close", close);
		return () => {
			window.removeEventListener("infopanel:open", open);
			window.removeEventListener("infopanel:close", close);
		};
	}, []);

	return (
		<nav
			style={{ fontFamily: "Tahoma, 'MS Sans Serif', Arial, sans-serif" }}
			className={`sticky top-0 z-50 transition-opacity duration-200 ${
				hidden ? "opacity-0 pointer-events-none" : "opacity-100"
			}`}
		>
			{/* Classic Windows taskbar */}
			<div
				style={{
					background: "linear-gradient(to bottom, #3168d5 0%, #1e40af 40%, #1e3a8a 100%)",
					borderBottom: "2px solid #0a246a",
					minHeight: "30px",
					display: "flex",
					alignItems: "center",
					padding: "0 4px",
					gap: "4px",
				}}
			>
				{/* Start button */}
				<button
					type="button"
					style={{
						background: "linear-gradient(to bottom, #5a8f2a 0%, #3d6e1a 100%)",
						border: "1px solid #2d5a0e",
						borderRadius: "0 12px 12px 0",
						padding: "2px 10px 2px 6px",
						color: "#fff",
						fontWeight: "bold",
						fontSize: "12px",
						fontFamily: "Tahoma, Arial, sans-serif",
						display: "flex",
						alignItems: "center",
						gap: "4px",
						cursor: "pointer",
						height: "24px",
						boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
					}}
					aria-label="Start"
				>
					<span style={{ fontSize: "14px" }}>⊞</span>
					start
				</button>

				{/* Separator */}
				<div
					style={{
						width: "1px",
						height: "20px",
						background: "rgba(255,255,255,0.2)",
						margin: "0 2px",
					}}
				/>

				{/* Nav tabs looking like taskbar buttons */}
				{[
					{ href: "/", label: "🏠 Atharva Verma - Home" },
					{ href: "/projects", label: "📁 Projects" },
					{ href: "/blogs", label: "📝 Blog" },
				].map(({ href, label }) => (
					<Link
						key={href}
						href={href}
						style={{
							background: "rgba(255,255,255,0.15)",
							border: "1px solid rgba(255,255,255,0.25)",
							borderRadius: "3px",
							padding: "2px 8px",
							color: "#fff",
							fontSize: "11px",
							fontFamily: "Tahoma, Arial, sans-serif",
							textDecoration: "none",
							display: "flex",
							alignItems: "center",
							height: "22px",
							whiteSpace: "nowrap",
						}}
					>
						{label}
					</Link>
				))}

				{/* Spacer */}
				<div style={{ flex: 1 }} />

				{/* System clock area */}
				<div
					style={{
						background: "rgba(0,0,0,0.2)",
						border: "1px solid rgba(0,0,0,0.3)",
						borderRadius: "3px",
						padding: "2px 8px",
						color: "#fff",
						fontSize: "11px",
						fontFamily: "Tahoma, Arial, sans-serif",
						height: "22px",
						display: "flex",
						alignItems: "center",
					}}
				>
					<ClockDisplay />
				</div>
			</div>
		</nav>
	);
}

function ClockDisplay() {
	const [time, setTime] = useState("");

	useEffect(() => {
		const update = () => {
			const now = new Date();
			setTime(
				now.toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: true,
				}),
			);
		};
		update();
		const timer = setInterval(update, 1000);
		return () => clearInterval(timer);
	}, []);

	return <time>{time}</time>;
}
