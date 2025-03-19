/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["img.freepik.com"],
    remotePatterns: [{ hostname: "freepik.com" }],
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
