import { renameSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fetchGitHubContributionSnapshot } from "../lib/github-contributions-source";

const snapshotPath = fileURLToPath(
	new URL("../lib/github-contributions-snapshot.ts", import.meta.url),
);
const temporaryPath = `${snapshotPath}.${process.pid}.tmp`;
const snapshot = await fetchGitHubContributionSnapshot();
const refreshedOn = new Date().toISOString().slice(0, 10);
const source = `// Last-known-good data captured from GitHub's public contributions page on ${refreshedOn}.
export type GitHubContributionSnapshot = {
	total: number;
	firstDate: string;
	levels: string;
	counts: string;
};

// Refresh deliberately with \`bun run update:github-contributions\`.
export const githubContributionsSnapshot: GitHubContributionSnapshot = {
	total: ${snapshot.total},
	firstDate: ${JSON.stringify(snapshot.firstDate)},
	levels:
		${JSON.stringify(snapshot.levels)},
	counts:
		${JSON.stringify(snapshot.counts)},
};
`;

try {
	writeFileSync(temporaryPath, source, { encoding: "utf8", flag: "wx" });
	renameSync(temporaryPath, snapshotPath);
	console.log(`Updated GitHub contribution snapshot (${snapshot.total} contributions).`);
} catch (error) {
	rmSync(temporaryPath, { force: true });
	throw error;
}
