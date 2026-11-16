export const PROJECT_TAGS = [
	"Python",
	"GenAI",
	"ASR",
	"TTS",
	"NLP",
	"Next.js",
	"TypeScript",
	"Go",
	"Bash",
	"Powershell",
	"Electrobun",
	"Bun",
	"RAG",
	"React.js",
	"Base UI",
	"React Native",
	"Astro",
	"Vite+",
	"Hono",
	"PostgreSQL",
	"Yjs",
	"MCP",
	"Vite",
	"ONNX",
	"FastAPI",
	"HTML",
	"CSS",
	"JavaScript",
] as const;

export const BLOG_TAGS = ["Tech", "Workflow"] as const;

export type ProjectTag = (typeof PROJECT_TAGS)[number];
export type BlogTag = (typeof BLOG_TAGS)[number];
