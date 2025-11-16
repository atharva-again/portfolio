import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    // Only configure domains if you are loading images from external websites
    remotePatterns: [
      // Example: If you load images from example.com
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
    ],
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig);