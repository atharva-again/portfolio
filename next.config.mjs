/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use 'use: "swc"' is now the default for Next.js 14 and often omitted.
  images: {
    // Only configure domains if you are loading images from external websites
    remotePatterns: [
      // Example: If you load images from example.com
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },
};

export default nextConfig;