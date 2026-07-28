import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { CtaBand } from "@/components/ui";
import { news } from "@/lib/news";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "セブンセンシズ株式会社からのお知らせ一覧。制度・事業に関する最新情報をお届けします。",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "トップ", path: "/" },
          { name: "お知らせ", path: "/news" },
        ])}
      />
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 pb-10 pt-12 md:pt-20">
          <Reveal>
            <p className="eyebrow">News</p>
            <h1 className="mt-4 text-3xl font-black md:text-5xl">お知らせ</h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 pt-6 md:pb-28">
        <div className="mx-auto grid max-w-5xl gap-3 px-5">
          {news.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.06}>
              <Link
                href={`/news/${n.slug}`}
                className="tilt group flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-line bg-white px-6 py-5 shadow-card transition-colors hover:border-pulse/40"
              >
                <time dateTime={n.dateISO} className="num text-xs text-slate">
                  {n.date}
                </time>
                <span className="rounded-full bg-pulse/10 px-3 py-0.5 text-[0.65rem] font-bold text-pulse">
                  {n.category}
                </span>
                <span className="flex-1 basis-full text-sm font-medium group-hover:text-pulse sm:basis-auto">
                  {n.title}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
