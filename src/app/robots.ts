import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// 静的書き出し (output: export) でファイルとして生成させる
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // AIクローラーにも明示的に許可 (AIO対策)
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      // Bing系はCopilotの参照元になるため明示的に許可する
      { userAgent: "Bingbot", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
