export const CONTACT = {
	github: {
		url: "https://dub.sh/atharva-github",
		title: "GitHub",
		description: "Explore my open-source projects and code contributions.",
	},
	linkedin: {
		url: "https://dub.sh/atharva-linkedin",
		title: "LinkedIn",
		description: "I don't really like LinkedIn but just putting it out there.",
	},
	x: {
		url: "https://dub.sh/atharva-x",
		title: "X",
		description: "For my random thoughts and projects, tech or otherwise.",
	},
	medium: {
		url: "https://dub.sh/atharva-medium",
		title: "Medium",
		description: "Have been writing less than I'd like to.",
	},
	email: {
		url: "mailto:atharva.verma18@gmail.com",
		title: "Email",
		description: "I keep my inboxes clean (not kidding).",
	},
} as const;

export type Contact = typeof CONTACT;
export type ContactPlatform = keyof Contact;
