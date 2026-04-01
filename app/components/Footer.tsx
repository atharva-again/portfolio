import Link from "next/link";
import { ATHARVA_ASCII_ART } from "../lib/ascii";
import { CONTACT } from "../lib/contact";
import Socials from "./Socials";
import VisitorCount from "./VisitorCount";

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer
			className="site-footer"
			style={{
				fontFamily: "Tahoma, 'MS Sans Serif', Arial, sans-serif",
				fontSize: "11px",
				background: "#d4d0c8",
				borderTop: "2px solid #ffffff",
			}}
		>
			{/* Window-chrome title bar */}
			<div
				style={{
					background: "linear-gradient(to right, #0a246a, #a6caf0)",
					color: "#fff",
					fontWeight: "bold",
					fontSize: "11px",
					padding: "3px 8px",
					display: "flex",
					alignItems: "center",
					gap: "6px",
				}}
			>
				<span>🖥️</span>
				<span>Atharva Verma — Portfolio v1.0 © {year}</span>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
					gap: "12px",
					padding: "12px",
					background: "#ece9d8",
					borderTop: "1px solid #ffffff",
					borderBottom: "1px solid #808080",
				}}
			>
				{/* Brand */}
				<div>
					<Link
						href="/"
						style={{
							fontWeight: "bold",
							fontSize: "13px",
							textDecoration: "none",
							color: "#000",
						}}
					>
						AV
					</Link>
					<p
						style={{
							marginTop: "4px",
							color: "#444",
							lineHeight: "1.5",
							fontSize: "11px",
						}}
					>
						I&apos;m Atharva. I love building, learning, investing, designing,
						writing, reading, thrifting, traveling, rails, food, fashion, music,
						and probably a lot more.
					</p>
				</div>

				{/* Explore */}
				<div>
					<h4
						style={{
							fontWeight: "bold",
							marginBottom: "6px",
							fontSize: "11px",
							borderBottom: "1px solid #808080",
							paddingBottom: "2px",
						}}
					>
						📂 Explore
					</h4>
					<ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
						{[
							{ href: "/", label: "🏠 Home" },
							{ href: "/projects", label: "📁 Projects" },
							{ href: "/blogs", label: "📝 Blog" },
						].map(({ href, label }) => (
							<li key={href} style={{ marginBottom: "3px" }}>
								<Link href={href} style={{ color: "#0000ee", fontSize: "11px" }}>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Connect */}
				<div>
					<h4
						style={{
							fontWeight: "bold",
							marginBottom: "6px",
							fontSize: "11px",
							borderBottom: "1px solid #808080",
							paddingBottom: "2px",
						}}
					>
						📬 Connect
					</h4>
					<Socials links={CONTACT} className="" iconSize={16} forceEmailPlacement />
					<div style={{ marginTop: "8px", color: "#555", fontSize: "11px" }}>
						<VisitorCount />
						<div style={{ marginTop: "2px" }}>© {year} Atharva Verma</div>
					</div>
				</div>
			</div>

			{/* ASCII art in classic inset panel */}
			<div
				style={{
					background: "#d4d0c8",
					padding: "8px",
					textAlign: "center",
					overflow: "hidden",
					borderTop: "1px solid #808080",
				}}
			>
				<pre
					aria-hidden="true"
					style={{
						pointerEvents: "none",
						userSelect: "none",
						whiteSpace: "pre",
						fontFamily: "Courier New, monospace",
						fontSize: "0.35rem",
						lineHeight: 1,
						color: "#808080",
						opacity: 0.6,
					}}
				>
					{ATHARVA_ASCII_ART}
				</pre>
			</div>

			{/* Status bar */}
			<div
				style={{
					background: "#d4d0c8",
					borderTop: "1px solid #808080",
					padding: "2px 8px",
					display: "flex",
					gap: "8px",
					fontSize: "11px",
				}}
			>
				<div
					style={{
						borderTop: "1px solid #808080",
						borderLeft: "1px solid #808080",
						borderRight: "1px solid #fff",
						borderBottom: "1px solid #fff",
						padding: "0 6px",
					}}
				>
					✅ Done
				</div>
				<div
					style={{
						borderTop: "1px solid #808080",
						borderLeft: "1px solid #808080",
						borderRight: "1px solid #fff",
						borderBottom: "1px solid #fff",
						padding: "0 6px",
						flex: 1,
					}}
				>
					Built with Next.js · Deployed on Vercel
				</div>
			</div>
		</footer>
	);
}
