import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { CtaBand } from "@/components/ui";
import { news } from "@/lib/news";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  // 旧www側にも同名ページがあり、Googleがそちらを正規版に選んでいた。
  // 旧wwwは造園・害虫駆除の事業サイトなので、扱う事業の違いを明示して分ける。
  title: "お知らせ・プレスリリース（経理BPO / AI集客支援）",
  description:
    "セブンセンシズ株式会社（大阪市東成区）のお知らせ・プレスリリース。経理BPO・AI集客支援・AI導入補助金の各事業に関する制度の新設、サービス開始、社内制度の取り組みを掲載しています。",
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
            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate md:text-base">
              経理BPO・AI集客支援・AI導入補助金の各事業に関する制度の新設やサービス開始、
              社内制度の取り組みなど、セブンセンシズ株式会社（大阪市東成区・法人番号3120001227825）
              からのお知らせを掲載しています。
            </p>
          </Reveal>
          <Reveal delay={0.12} className="mt-10">
            <Image
              src="/images/news-hero.png"
              alt="お知らせ一覧のイメージ"
              width={1200}
              height={660}
              className="h-auto w-full rounded-3xl border border-line shadow-card"
              priority
            />
          </Reveal>
        </div>
      </section>

      <section className="pb-20 pt-6 md:pb-28">
        <div className="mx-auto grid max-w-5xl gap-3 px-5">
          {news.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.06}>
              <Link
                href={`/news/${n.slug}`}
                className="group flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-line bg-white px-6 py-5 shadow-card transition-colors hover:border-pulse/40"
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
