/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["img.freepik.com"],
    remotePatterns: [{ hostname: "freepik.com" }],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "127.0.0.1:3000"],
    },
  },
};

export default nextConfig;
