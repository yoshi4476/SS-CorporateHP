import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// 静的書き出し (output: export) でファイルとして生成させる
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // AIクローラーにも明示的に許可 (AIO/LLMO対策)
      // ChatGPTの学習・検索
      { userAgent: "GPTBot", allow: "/" },
      // ChatGPT検索の索引
      { userAgent: "OAI-SearchBot", allow: "/" },
      // ChatGPTがユーザー指示で開くとき
      { userAgent: "ChatGPT-User", allow: "/" },
      // Claudeの索引
      { userAgent: "ClaudeBot", allow: "/" },
      // Claudeの閲覧
      { userAgent: "Claude-Web", allow: "/" },
      // Claude検索
      { userAgent: "Claude-SearchBot", allow: "/" },
      // Anthropic（旧表記）
      { userAgent: "anthropic-ai", allow: "/" },
      // Perplexityの索引
      { userAgent: "PerplexityBot", allow: "/" },
      // Perplexityがユーザー指示で開くとき
      { userAgent: "Perplexity-User", allow: "/" },
      // GeminiとAI回答の利用可否
      { userAgent: "Google-Extended", allow: "/" },
      // Bing・Copilotの索引
      { userAgent: "Bingbot", allow: "/" },
      // Appleの索引
      { userAgent: "Applebot", allow: "/" },
      // Apple Intelligenceの利用可否
      { userAgent: "Applebot-Extended", allow: "/" },
      // Meta AI
      { userAgent: "meta-externalagent", allow: "/" },
      // Alexa・Rufus
      { userAgent: "Amazonbot", allow: "/" },
      // Le Chat（Mistral）
      { userAgent: "MistralAI-User", allow: "/" },
      // DuckDuckGo AI
      { userAgent: "DuckAssistBot", allow: "/" },
      // Common Crawl（多くのLLMの学習元）
      { userAgent: "CCBot", allow: "/" },
      // Cohere
      { userAgent: "cohere-ai", allow: "/" },
      // You.com
      { userAgent: "YouBot", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
