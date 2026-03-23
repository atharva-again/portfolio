import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	images: {
		// Only configure domains if you are loading images from external websites
		qualities: [100, 75],
	},
	async rewrites() {
		const code = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;
		if (!code) return [];

		return [
			{
				source: "/api/stats/script",
				destination: "https://gc.zgo.at/count.js",
			},
			{
				source: "/api/stats/count",
				destination: `https://${code}.goatcounter.com/count`,
			},
			{
				source: "/api/stats/total",
				destination: `https://${code}.goatcounter.com/counter/TOTAL.json`,
			},
		];
	},
};

const withMDX = createMDX({
	extension: /\.(md|mdx)$/,
	options: {
		remarkPlugins: ["remark-gfm"],
		rehypePlugins: [],
	},
});

export default withMDX(nextConfig);
