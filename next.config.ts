import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/blog/post/2020/:slug*",
        destination: "/blog/post/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
