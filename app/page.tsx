import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HoverPreviewLink, {
	type HoverPreviewContent,
} from "./components/HoverPreviewLink";
import Socials from "./components/Socials";
import { mitsHero } from "./content/assets/images";
import { getFeaturedBlogs } from "./lib/blogs";
import { CONTACT } from "./lib/contact";
import { getAllProjects } from "./lib/projects";
import { FEATURED_PROJECT_TAGS } from "./lib/tags";

export const metadata: Metadata = {
	title: "Atharva Verma",
	description: "Software engineer and builder",
};

const hyperlinkPreviews: Record<string, HoverPreviewContent> = {
	"https://web.mitsgwalior.in/": {
		title: "MITS Gwalior",
		description:
			"Madhav Institute of Technology & Science is a NAAC A++ deemed university in Gwalior, MP, India",
		image: mitsHero,
	},
};

/** Tiny Win2K window panel */
function Win2KWindow({
	title,
	icon,
	children,
}: {
	title: string;
	icon?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="win-window" style={{ marginBottom: "12px" }}>
			{/* Title bar */}
			<div className="win-titlebar">
				<span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
					{icon && <span>{icon}</span>}
					{title}
				</span>
				<div className="win-titlebar-buttons">
					<span className="win-titlebar-btn" aria-hidden="true">
						_
					</span>
					<span className="win-titlebar-btn" aria-hidden="true">
						□
					</span>
					<span
						className="win-titlebar-btn"
						style={{ fontWeight: "bold", color: "#000" }}
						aria-hidden="true"
					>
						✕
					</span>
				</div>
			</div>
			{/* Content */}
			<div className="win-content">{children}</div>
		</div>
	);
}

export default function Home() {
	const projects = getAllProjects();
	const featuredProjects = projects.filter((p) => p.featured);
	const featuredBlogs = getFeaturedBlogs();

	return (
		<main
			style={{
				background: "#008080",
				minHeight: "100vh",
				padding: "8px",
				fontFamily: "Tahoma, 'MS Sans Serif', Arial, sans-serif",
				fontSize: "11px",
			}}
		>
			{/* ── Marquee ticker ── */}
			<div
				className="win-statusbar"
				style={{ marginBottom: "8px", background: "#d4d0c8" }}
			>
				<div className="win-statusbar-pane" style={{ flex: 1 }}>
					<marquee behavior="scroll" direction="left" scrollamount={3}>
						🌐 Welcome to Atharva Verma&apos;s Personal Website &nbsp;•&nbsp;
						Software Engineer &amp; Builder &nbsp;•&nbsp; AI &middot; Robotics
						&middot; RAG &middot; Next.js &nbsp;•&nbsp; MITS Gwalior &nbsp;•&nbsp;
						Page last updated: March 2026 &nbsp;•&nbsp; Best viewed in Internet
						Explorer 6.0 at 800×600 resolution
					</marquee>
				</div>
			</div>

			{/* ── Main layout: two columns ── */}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "220px 1fr",
					gap: "8px",
					alignItems: "start",
				}}
			>
				{/* ── LEFT sidebar ── */}
				<aside>
					{/* Profile window */}
					<Win2KWindow title="Atharva Verma" icon="👤">
						<div style={{ textAlign: "center", marginBottom: "8px" }}>
							<div
								style={{
									width: "64px",
									height: "64px",
									margin: "0 auto 6px",
									background: "#ece9d8",
									border: "2px inset #808080",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: "32px",
								}}
								aria-hidden="true"
							>
								👨‍💻
							</div>
							<div style={{ fontWeight: "bold", fontSize: "12px" }}>
								Atharva Verma
							</div>
							<div style={{ color: "#444", marginTop: "2px" }}>
								Software Engineer
							</div>
						</div>

						<hr
							style={{ border: "none", borderTop: "1px solid #808080", margin: "6px 0" }}
						/>

						<div style={{ marginBottom: "6px" }}>
							<div
								className="win-section-header"
								style={{ marginBottom: "4px" }}
							>
								🔗 Links
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
								<Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
									<span>🏠</span> Home
								</Link>
								<Link href="/projects" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
									<span>📁</span> Projects
								</Link>
								<Link href="/blogs" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
									<span>📝</span> Blog
								</Link>
							</div>
						</div>

						<hr
							style={{ border: "none", borderTop: "1px solid #808080", margin: "6px 0" }}
						/>

						<div>
							<div className="win-section-header" style={{ marginBottom: "4px" }}>
								📬 Contact
							</div>
							<Socials links={CONTACT} className="" iconSize={16} />
						</div>
					</Win2KWindow>

					{/* System info window */}
					<Win2KWindow title="System Properties" icon="🖥️">
						<table
							style={{
								width: "100%",
								fontSize: "11px",
								borderCollapse: "collapse",
							}}
						>
							<tbody>
								{[
									["Status", "Online ✅"],
									["Location", "India 🇮🇳"],
									["College", "MITS Gwalior"],
									["Year", "3rd Year"],
									["Major", "AI & Robotics"],
									["Mode", "Builder"],
								].map(([key, val]) => (
									<tr key={key}>
										<td
											style={{
												padding: "2px 4px",
												fontWeight: "bold",
												color: "#000",
												whiteSpace: "nowrap",
												verticalAlign: "top",
											}}
										>
											{key}:
										</td>
										<td style={{ padding: "2px 4px", color: "#222" }}>{val}</td>
									</tr>
								))}
							</tbody>
						</table>
					</Win2KWindow>

					{/* Visitor counter */}
					<Win2KWindow title="Site Statistics" icon="📊">
						<div
							className="win-field"
							style={{ textAlign: "center", fontFamily: "'Courier New', monospace", letterSpacing: "2px" }}
						>
							👁 You are visitor #<br />
							<span style={{ fontSize: "16px", fontWeight: "bold" }}>
								0 0 3 4 7
							</span>
						</div>
						<div style={{ textAlign: "center", marginTop: "4px", color: "#555" }}>
							Since Jan 2024
						</div>
					</Win2KWindow>
				</aside>

				{/* ── RIGHT main content ── */}
				<div>
					{/* About window */}
					<Win2KWindow title="About Me - Notepad" icon="📄">
						<div
							className="win-field"
							style={{
								background: "#ffffff",
								minHeight: "120px",
								padding: "8px",
								lineHeight: "1.6",
								fontSize: "12px",
								color: "#000",
							}}
						>
							<p style={{ margin: "0 0 8px" }}>
								I am a product-first developer. What that means is in order for
								me to commit to a project, it needs to have some kind of
								inherent coolness.
							</p>
							<p style={{ margin: "0 0 8px" }}>
								Beyond the tech side of things, I love and advocate for good
								public transport. I think for any city, public transport and
								infra is crucial. My other interests are modern cinema, hip-hop
								and electronic music.
							</p>
						</div>
					</Win2KWindow>

					{/* Experience window */}
					<Win2KWindow title="Experience (Technologies) - Windows Explorer" icon="🔧">
						<p style={{ margin: "0 0 8px", color: "#333", lineHeight: "1.5" }}>
							I&apos;ve worked across frontend and backend stacks, created mobile
							and desktop apps, RAG systems, and developed some robotic systems.
							Click any tag to filter projects:
						</p>
						<div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
							{FEATURED_PROJECT_TAGS.map((tag) => (
								<Link
									key={tag}
									href={`/projects?tags=${encodeURIComponent(tag)}`}
									className="win-tag"
								>
									{tag}
								</Link>
							))}
						</div>
						<div style={{ color: "#555", fontStyle: "italic", fontSize: "11px" }}>
							ℹ PS: Click any tag to view projects related to that technology.
						</div>
					</Win2KWindow>

					{/* What I'm up to */}
					<Win2KWindow title="Status Update - Now.txt" icon="📋">
						<div
							className="win-field"
							style={{ background: "#fff", padding: "8px", lineHeight: "1.6", fontSize: "12px" }}
						>
							<p style={{ margin: "0 0 6px" }}>
								<strong>Building:</strong> Working on two side-projects:{" "}
								<em>AudioRAG</em> and <em>trackmebaby</em>.
							</p>
							<p style={{ margin: "0" }}>
								<strong>Learning:</strong> Experimenting with{" "}
								<a
									href="https://electrobun.dev/"
									target="_blank"
									rel="noopener noreferrer"
								>
									Electrobun
								</a>
								. Also a third-year student at{" "}
								<HoverPreviewLink
									href="https://web.mitsgwalior.in/"
									preview={hyperlinkPreviews["https://web.mitsgwalior.in/"]}
									placement={["above", "below"]}
								>
									MITS Gwalior
								</HoverPreviewLink>{" "}
								studying AI and Robotics.
							</p>
						</div>
						<div style={{ marginTop: "4px", color: "#555", fontSize: "11px", fontStyle: "italic" }}>
							Last modified: Mar 11, 2026
						</div>
					</Win2KWindow>

					{/* Selected Projects */}
					<Win2KWindow title="Selected Projects - File Explorer" icon="📁">
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "6px",
							}}
						>
							<span className="win-section-header" style={{ margin: 0 }}>
								📂 Featured Projects
							</span>
							<Link href="/projects" className="win-btn" style={{ fontSize: "11px" }}>
								View All →
							</Link>
						</div>

						<div
							className="win-field"
							style={{ background: "#fff", padding: "0" }}
						>
							{/* Table header */}
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 2fr",
									background: "#d4d0c8",
									borderBottom: "1px solid #808080",
									padding: "2px 8px",
									fontWeight: "bold",
									fontSize: "11px",
								}}
							>
								<span>Name</span>
								<span>Description</span>
							</div>
							{featuredProjects.map((project, i) => (
								<Link
									key={project.id}
									href={`/projects/${project.id}`}
									style={{
										display: "grid",
										gridTemplateColumns: "1fr 2fr",
										padding: "4px 8px",
										textDecoration: "none",
										color: "#000",
										borderBottom:
											i < featuredProjects.length - 1
												? "1px solid #ece9d8"
												: "none",
										background: i % 2 === 0 ? "#ffffff" : "#f5f3ee",
										alignItems: "center",
										gap: "8px",
									}}
								>
									<span
										style={{
											display: "flex",
											alignItems: "center",
											gap: "4px",
											fontWeight: "bold",
											color: "#0000ee",
										}}
									>
										{project.heroImage ? (
											<Image
												src={project.heroImage}
												alt=""
												width={16}
												height={16}
												style={{ objectFit: "cover" }}
											/>
										) : (
											<span>📄</span>
										)}
										{project.title}
									</span>
									<span style={{ fontSize: "11px", color: "#333" }}>
										{project.description}
									</span>
								</Link>
							))}
						</div>
					</Win2KWindow>

					{/* Featured Writing */}
					<Win2KWindow title="Featured Writing - Internet Explorer" icon="🌐">
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "6px",
							}}
						>
							<span className="win-section-header" style={{ margin: 0 }}>
								📰 Articles
							</span>
							<Link href="/blogs" className="win-btn" style={{ fontSize: "11px" }}>
								View All →
							</Link>
						</div>

						<div
							className="win-field"
							style={{ background: "#fff", padding: "0" }}
						>
							{featuredBlogs.map((blog, i) => (
								<Link
									key={blog.slug}
									href={`/blogs/${blog.slug}`}
									style={{
										display: "flex",
										gap: "8px",
										padding: "6px 8px",
										textDecoration: "none",
										color: "#000",
										borderBottom:
											i < featuredBlogs.length - 1
												? "1px solid #ece9d8"
												: "none",
										background: i % 2 === 0 ? "#ffffff" : "#f5f3ee",
										alignItems: "flex-start",
									}}
								>
									{blog.heroImage && (
										<div
											style={{
												width: "48px",
												height: "32px",
												flexShrink: 0,
												border: "1px solid #808080",
												overflow: "hidden",
												position: "relative",
											}}
										>
											<Image
												src={blog.heroImage}
												alt={blog.title}
												fill
												sizes="48px"
												style={{ objectFit: "cover" }}
											/>
										</div>
									)}
									<div>
										<div
											style={{
												fontWeight: "bold",
												color: "#0000ee",
												textDecoration: "underline",
											}}
										>
											{blog.title}
										</div>
										<div style={{ color: "#333", fontSize: "11px", marginTop: "2px" }}>
											{blog.description}
										</div>
									</div>
								</Link>
							))}
						</div>
					</Win2KWindow>
				</div>
			</div>

			{/* ── Bottom status bar ── */}
			<div className="win-statusbar" style={{ marginTop: "8px" }}>
				<div className="win-statusbar-pane">✅ Done</div>
				<div className="win-statusbar-pane" style={{ flex: 1 }}>
					atharvaverma.dev — Personal Website
				</div>
				<div className="win-statusbar-pane">🔒 Internet Zone</div>
			</div>
		</main>
	);
}
