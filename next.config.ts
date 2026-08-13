import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Permite cualquier imagen HTTPS (para URLs pegadas desde cualquier dominio)
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
