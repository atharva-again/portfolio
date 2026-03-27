import type { Element, Root } from "hast";
import rehypeSlug from "rehype-slug";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type Heading = {
	id: string;
	text: string;
	level: number;
};

export async function extractHeadings(mdxContent: string): Promise<Heading[]> {
	const headings: Heading[] = [];

	const processor = unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeSlug);

	const tree = processor.parse(mdxContent);
	const hast = (await processor.run(tree)) as Root;

	visit(hast, "element", (node: Element) => {
		if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)) {
			const level = parseInt(node.tagName.charAt(1), 10);
			const id = (node.properties?.id as string) || "";

			let text = "";
			visit(node, "text", (textNode) => {
				text += textNode.value;
			});

			if (text.trim()) {
				headings.push({
					id,
					text: text.trim(),
					level,
				});
			}
		}
	});

	return headings;
}
