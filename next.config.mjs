/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/**',
      },
      {
        pathname: '/**',
        search: '?t=*',
      },
    ],
    remotePatterns: [
      // Add allowed remote image sources here if needed
    ],
  },
};

export default nextConfig;
