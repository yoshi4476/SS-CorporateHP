import type { NextConfig } from "next";

// Cloudflare Pages への静的配信構成。
// DNSをGMOに置いたまま独自ドメインを当てられるようにするため、
// サーバー機能を使わない静的書き出し (output: "export") にしている。
// リダイレクトは静的書き出しでは無効になるため public/_redirects で行う。
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
