import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        port: "",
        protocol: "https",
        hostname: "bu-khaled-2002.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
