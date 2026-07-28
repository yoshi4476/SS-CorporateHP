import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // オウンドメディア事業は AIO運用代行 に統合
      {
        source: "/services/owned-media",
        destination: "/services/aio",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
