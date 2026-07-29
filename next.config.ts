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

      // ---- 旧サイト (WordPress) のURLを引き継ぐ ----
      // 継続事業: 店舗集客 (G-ran) → MEO運用代行
      { source: "/g-ran", destination: "/services/meo", permanent: true },
      { source: "/g-ran/:path*", destination: "/services/meo", permanent: true },

      // 終了事業 (造園・草刈り・害虫害獣・不用品) → トップへ
      { source: "/landscaping", destination: "/", permanent: true },
      { source: "/landscaping/:path*", destination: "/", permanent: true },
      { source: "/mowing", destination: "/", permanent: true },
      { source: "/mowing/:path*", destination: "/", permanent: true },
      { source: "/pest-control", destination: "/", permanent: true },
      { source: "/pest-control/:path*", destination: "/", permanent: true },
      { source: "/unwanted-items", destination: "/", permanent: true },
      { source: "/unwanted-items/:path*", destination: "/", permanent: true },

      // 対応事例 → 事業内容一覧
      { source: "/case", destination: "/services", permanent: true },
      { source: "/case/:path*", destination: "/services", permanent: true },
      { source: "/case-cat/:path*", destination: "/services", permanent: true },

      // ブログ → お知らせ
      { source: "/blog", destination: "/news", permanent: true },
      { source: "/blog/:path*", destination: "/news", permanent: true },

      // WordPress固有のパス
      { source: "/wp-admin/:path*", destination: "/", permanent: false },
      { source: "/wp-login.php", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
