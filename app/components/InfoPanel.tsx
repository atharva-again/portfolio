"use client";

import { ChevronLeft, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaPython } from "react-icons/fa";
import { SiGithub, SiHuggingface, SiMedium } from "react-icons/si";
import type { Blog } from "../lib/blogs";
import type { Heading } from "../lib/extract-headings";
import type { Project } from "../lib/projects";

const cx = (...classes: Array<string | false | null | undefined>) =>
	classes.filter(Boolean).join(" ");

type InfoSection = {
	title?: string;
	content: React.ReactNode;
};

type InfoPanelProps = {
	sections: InfoSection[];
	toc?: Heading[];
	variant?: "desktop" | "mobile";
	className?: string;
};

const smoothScrollTo = (targetY: number, duration = 800) => {
	const startY = window.scrollY;
	const difference = targetY - startY;
	const startTime = performance.now();

	const step = (currentTime: number) => {
		let progress = (currentTime - startTime) / duration;
		if (progress > 1) progress = 1;

		const ease =
			progress < 0.5
				? 16 * progress * progress * progress * progress * progress
				: 1 - (-2 * progress + 2) ** 5 / 2;

		window.scrollTo(0, startY + difference * ease);

		if (progress < 1) {
			requestAnimationFrame(step);
		}
	};

	requestAnimationFrame(step);
};

const TableOfContents = ({ headings }: { headings: Heading[] }) => {
	const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (headings.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				setActiveIds((prev) => {
					const next = new Set(prev);
					for (const entry of entries) {
						if (entry.isIntersecting) {
							next.add(entry.target.id);
						} else {
							next.delete(entry.target.id);
						}
					}
					return next;
				});
			},
			{ rootMargin: "-10% 0% -10% 0%" },
		);

		for (const heading of headings) {
			const element = document.getElementById(heading.id);
			if (element) {
				observer.observe(element);
			}
		}

		return () => observer.disconnect();
	}, [headings]);

	if (headings.length === 0) return null;

	return (
		<div className="mt-8">
			<h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
				Contents
			</h3>
			<nav className="relative">
				<div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-700" />
				<ul className="space-y-0">
					{headings.map((heading) => (
						<li
							key={heading.id}
							style={{ paddingLeft: `${(heading.level - 2) * 12 + 16}px` }}
							className="relative"
						>
							{activeIds.has(heading.id) && (
								<div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-900 dark:bg-zinc-100" />
							)}
							<a
								href={`#${heading.id}`}
								onClick={(e) => {
									e.preventDefault();
									const element = document.getElementById(heading.id);
									if (element) {
										const y =
											element.getBoundingClientRect().top +
											window.scrollY -
											100;
										smoothScrollTo(y, 600);
										window.history.pushState(null, "", `#${heading.id}`);
									}
								}}
								className={cx(
									"text-sm block py-1 pl-4 transition-colors",
									activeIds.has(heading.id)
										? "text-zinc-900 dark:text-zinc-100 font-medium"
										: "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
								)}
							>
								{heading.text}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

const InfoSections = ({ sections }: { sections: InfoSection[] }) => (
	<>
		{sections.map((section, index) => {
			return (
				<div
					key={String(index)}
					className={index === sections.length - 1 ? "mb-0" : "mb-6"}
				>
					{section.title ? (
						<h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
							{section.title}
						</h3>
					) : null}
					{section.content}
				</div>
			);
		})}
	</>
);

const MobilePanel = ({
	sections,
	toc,
}: {
	sections: InfoSection[];
	toc?: Heading[];
}) => {
	const [isFloating, setIsFloating] = useState(false);
	const [isOpen, setIsOpen] = useState(true);
	const hasCollapsedRef = useRef(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const floatingRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (!sidebarRef.current) return;

			const sidebarRect = sidebarRef.current.getBoundingClientRect();
			const sidebarBottom = sidebarRect.bottom;
			const viewportHeight = window.innerHeight;

			// Show button when sidebar bottom is near the top of viewport (with some buffer)
			const shouldFloat = sidebarBottom < viewportHeight * 0.3; // When 70% of sidebar is out of view

			setIsFloating(shouldFloat);
			if (shouldFloat && !hasCollapsedRef.current) {
				setIsOpen(false);
				hasCollapsedRef.current = true;
			}
			if (!shouldFloat) {
				setIsOpen(true);
				hasCollapsedRef.current = false;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (!isOpen || !floatingRef.current) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				!floatingRef.current?.contains(event.target as Node) &&
				!buttonRef.current?.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	useEffect(() => {
		const isPanelOpen = isFloating && isOpen;
		window.dispatchEvent(
			new CustomEvent(isPanelOpen ? "infopanel:open" : "infopanel:close"),
		);
	}, [isFloating, isOpen]);

	useEffect(() => {
		return () => {
			window.dispatchEvent(new CustomEvent("infopanel:close"));
		};
	}, []);

	const togglePanel = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<div className="md:hidden">
			<div
				ref={sidebarRef}
				className="mt-8 mb-15 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6"
			>
				<InfoSections sections={sections} />
				{toc && <TableOfContents headings={toc} />}
			</div>

			<div
				ref={floatingRef}
				className={cx(
					"fixed bottom-10 left-8 right-8 z-40 shadow-2xl rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-md p-4 transition-all duration-300 ease-in-out",
					isFloating
						? isOpen
							? "opacity-100"
							: "opacity-0 pointer-events-none"
						: "opacity-0 pointer-events-none",
				)}
				style={
					isFloating && isOpen
						? {
								transform: "translateY(0)",
							}
						: {
								// animate from the top instead of from bottom; final position unchanged
								transform: "translateY(-120%) scale(0.95)",
								opacity: 0,
								pointerEvents: "none",
							}
				}
			>
				<InfoSections sections={sections} />
				{toc && <TableOfContents headings={toc} />}
			</div>

			<button
				ref={buttonRef}
				type="button"
				onClick={togglePanel}
				aria-label={isOpen ? "Hide info" : "Show info"}
				aria-expanded={isOpen}
				className={cx(
					"fixed top-1/2 -translate-y-1/2 -right-1 z-50 inline-flex h-10 w-9 items-center justify-center rounded-l-xl bg-black/60 dark:bg-zinc-800/60 backdrop-blur-md text-white/90 shadow-lg border-y border-l border-white/20 dark:border-zinc-700/50 outline-none transition-all duration-500 ease-in-out hover:bg-black/80 dark:hover:bg-zinc-700/80 hover:pr-1",
					isFloating
						? "opacity-100 translate-x-0"
						: "opacity-0 translate-x-12 pointer-events-none",
				)}
			>
				<ChevronLeft
					className={cx(
						"w-5 h-5 transition-transform duration-500 ease-in-out",
						isOpen ? "rotate-180" : "rotate-0",
					)}
					aria-hidden="true"
				/>
			</button>
		</div>
	);
};

const DesktopPanel = ({
	sections,
	toc,
	className,
}: {
	sections: InfoSection[];
	toc?: Heading[];
	className?: string;
}) => (
	<div
		className={cx(
			"rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-6",
			className,
		)}
	>
		<InfoSections sections={sections} />
		{toc && <TableOfContents headings={toc} />}
	</div>
);

export default function InfoPanel({
	sections,
	toc,
	variant = "desktop",
	className,
}: InfoPanelProps) {
	if (variant === "mobile") {
		return <MobilePanel sections={sections} toc={toc} />;
	}
	return <DesktopPanel sections={sections} toc={toc} className={className} />;
}

// BlogInfoPanel - formats Blog data into sections for the generic InfoPanel
export function BlogInfoPanel({
	blog,
	toc,
	variant = "desktop",
	className,
}: {
	blog: Blog;
	toc?: Heading[];
	variant?: "desktop" | "mobile";
	className?: string;
}) {
	const sections: InfoSection[] = [];

	sections.push({
		title: "Year",
		content: (
			<p className="text-base text-zinc-900 dark:text-zinc-100">{blog.date}</p>
		),
	});

	if (blog.tags && blog.tags.length > 0) {
		sections.push({
			title: "Tags",
			content: (
				<div className="flex flex-wrap gap-2">
					{blog.tags.map((tag) => (
						<Link
							key={tag}
							href={`/blogs?tags=${encodeURIComponent(tag)}`}
							className="inline-block bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all duration-150 cursor-pointer"
						>
							{tag}
						</Link>
					))}
				</div>
			),
		});
	}

	if (blog.links && blog.links.length > 0) {
		sections.push({
			title: "Links",
			content: (
				<div className="flex flex-row flex-wrap gap-4">
					{blog.links.map((link) => {
						const icon =
							link.type === "repo" ? (
								<SiGithub className="w-6 h-6" />
							) : link.type === "demo" ? (
								<ExternalLink className="w-6 h-6" />
							) : link.type === "medium" ? (
								<SiMedium className="w-6 h-6" />
							) : link.type === "huggingface" ? (
								<SiHuggingface className="w-6 h-6" />
							) : link.type === "pypi" ? (
								<FaPython className="w-6 h-6" />
							) : (
								<FileText className="w-6 h-6" />
							);
						return (
							<a
								key={link.url}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
								aria-label={link.type}
							>
								{icon}
							</a>
						);
					})}
				</div>
			),
		});
	}

	return (
		<InfoPanel
			sections={sections}
			toc={toc}
			variant={variant}
			className={className}
		/>
	);
}

// Legacy ProjectInfoPanel - now uses the generic InfoPanel
export function ProjectInfoPanel({
	project,
	toc,
	variant = "desktop",
	className,
}: {
	project: Project;
	toc?: Heading[];
	variant?: "desktop" | "mobile";
	className?: string;
}) {
	const sections: InfoSection[] = [];

	if (project.year || project.status) {
		sections.push({
			content: (
				<div className="flex gap-8">
					{project.year && (
						<div>
							<h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
								Year
							</h4>
							<p className="text-base text-zinc-900 dark:text-zinc-100">
								{project.year}
							</p>
						</div>
					)}
					{project.status && (
						<div>
							<h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
								Status
							</h4>
							<p className="text-base text-zinc-900 dark:text-zinc-100 capitalize">
								{project.status}
							</p>
						</div>
					)}
				</div>
			),
		});
	}

	if (project.tags && project.tags.length > 0) {
		sections.push({
			title: "Tech Stack",
			content: (
				<div className="flex flex-wrap gap-2">
					{project.tags.map((tag) => (
						<Link
							key={tag}
							href={`/projects?tags=${encodeURIComponent(tag)}`}
							className="inline-block bg-zinc-200 dark:bg-zinc-800 px-3 py-1 rounded-full text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200 cursor-pointer"
						>
							{tag}
						</Link>
					))}
				</div>
			),
		});
	}

	if (project.links && project.links.length > 0) {
		sections.push({
			title: "Links",
			content: (
				<div className="flex flex-row flex-wrap gap-4">
					{project.links.map((link) => {
						const icon =
							link.type === "repo" ? (
								<SiGithub className="w-6 h-6" />
							) : link.type === "demo" ? (
								<ExternalLink className="w-6 h-6" />
							) : link.type === "medium" ? (
								<SiMedium className="w-6 h-6" />
							) : link.type === "huggingface" ? (
								<SiHuggingface className="w-6 h-6" />
							) : link.type === "pypi" ? (
								<FaPython className="w-6 h-6" />
							) : (
								<FileText className="w-6 h-6" />
							);
						return (
							<a
								key={link.url}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
								aria-label={link.type}
							>
								{icon}
							</a>
						);
					})}
				</div>
			),
		});
	}

	return (
		<InfoPanel
			sections={sections}
			toc={toc}
			variant={variant}
			className={className}
		/>
	);
}
