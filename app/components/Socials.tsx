import type { StaticImageData } from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { SiGithub, SiGmail, SiMedium, SiX } from "react-icons/si";
import {
	githubHero,
	linkedinHero,
	mediumHero,
	xHero,
} from "../content/assets/images";
import { CONTACT, type ContactPlatform } from "../lib/contact";
import HoverPreviewLink, { type HoverPreviewContent } from "./HoverPreviewLink";

type Props = {
	links?: Partial<
		Record<ContactPlatform, { url: string; title: string; description: string }>
	>;
	className?: string;
	iconSize?: number;
	forceEmailPlacement?: boolean;
};

const PLATFORM_ICONS: Record<
	ContactPlatform,
	React.ComponentType<{ size: number; "aria-hidden": boolean }>
> = {
	github: SiGithub,
	linkedin: FaLinkedin,
	x: SiX,
	medium: SiMedium,
	email: SiGmail,
};

const PREVIEW_IMAGES: Partial<
	Record<ContactPlatform, string | StaticImageData>
> = {
	github: githubHero,
	linkedin: linkedinHero,
	x: xHero,
	medium: mediumHero,
};

export default function Socials({
	links = CONTACT,
	className = "",
	iconSize = 18,
	forceEmailPlacement = false,
}: Props) {
	const commonButtonClasses =
		"inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800";

	return (
		<div className={`flex items-center gap-3 ${className}`}>
			{(Object.keys(links) as ContactPlatform[]).map((platform) => {
				const data = links[platform];
				if (!data) return null;

				const Icon = PLATFORM_ICONS[platform];
				const previewImage = PREVIEW_IMAGES[platform];

				const preview: HoverPreviewContent = {
					title: data.title,
					description: data.description,
					image: previewImage,
				};

				return (
					<HoverPreviewLink
						key={platform}
						href={data.url}
						preview={preview}
						className={`${commonButtonClasses} text-zinc-800 dark:text-zinc-100`}
						external
						placement={platform === "email" ? ["below"] : ["above", "below"]}
						forcePlacement={
							platform === "email" ? forceEmailPlacement : undefined
						}
					>
						<Icon size={iconSize} aria-hidden={true} />
					</HoverPreviewLink>
				);
			})}
		</div>
	);
}
