import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { CtaBand } from "@/components/ui";
import { news } from "@/lib/news";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  // 旧www側にも同名ページがあり、Googleがそちらを正規版に選んでいた。
  // 旧wwwは造園・害虫駆除の事業サイトなので、扱う事業の違いを明示して分ける。
  title: "お知らせ｜経理BPO・AI集客支援",
  description:
    "セブンセンシズ株式会社（大阪市東成区）のお知らせ・プレスリリース。経理BPO・AI集客支援・AI導入補助金の各事業に関する制度の新設、サービス開始、社内制度の取り組みを掲載しています。",
  path: "/news",
});

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

      {/* 一覧だけでは中身が薄く、読み終えた人の行き先も無かった。解説記事と事業の入口を置く */}
      <section className="border-t border-line bg-mist py-16 md:py-20" aria-labelledby="news-more-heading">
        <div className="mx-auto max-w-7xl px-5">
          <p className="eyebrow">More</p>
          <h2 id="news-more-heading" className="mt-3 text-xl font-black md:text-2xl">解説記事と、事業のご案内</h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-slate">
            お知らせでは、セブンセンシズ株式会社のサービスや取り組みの動きを掲載しています。経理の進め方やAI検索の対策など、実務の解説は下の2つのメディアで公開しています。
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { href: "/blog", label: "経理BPOブログ", body: "記帳・請求・給与・月次決算など、経理の進め方と外注の判断を解説しています。", ext: false },
              { href: site.labUrl, label: "AI集客ラボ", body: "SEO・AIO・LLMOの実践と、業種ごとの集客を解説している運営メディアです。", ext: true },
              { href: "/services", label: "事業内容", body: "集客・社内業務・補助金まで、ひとつのチームで引き受けている事業の一覧です。", ext: false },
            ].map((x) => (
              <a
                key={x.label}
                href={x.href}
                {...(x.ext ? { target: "_blank", rel: "noopener" } : {})}
                className="group rounded-2xl border border-line bg-raise p-6 shadow-card transition-colors hover:border-pulse/40"
              >
                <p className="font-bold group-hover:text-pulse">{x.label}{x.ext ? " ↗" : " →"}</p>
                <p className="mt-2 text-xs leading-7 text-slate">{x.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
