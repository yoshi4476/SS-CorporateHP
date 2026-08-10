import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { news } from "@/lib/news";
import { posts } from "@/lib/blog";
import { site } from "@/lib/site";

// 静的書き出し (output: export) でファイルとして生成させる
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...services.map((s) => ({
      url: `${site.url}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    // 自社プロダクトのLP。契約獲得の入口なので事業ページと同じ優先度にする
    { url: `${site.url}/rakushift`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/aio-agent`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/company`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...news.map((n) => ({
      url: `${site.url}/news/${n.slug}`,
      lastModified: new Date(n.dateISO),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${site.url}/blog/${p.slug}`,
      lastModified: new Date(p.dateModified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
