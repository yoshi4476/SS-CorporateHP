import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { CtaBand, PageHead, SectionHead } from "@/components/ui";
import { news } from "@/lib/news";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  // 旧www側にも同名ページがあり、Googleがそちらを正規版に選んでいた。
  // 旧wwwは造園・害虫駆除の事業サイトなので、扱う事業の違いを明示して分ける。
  title: "お知らせ｜経理BPO・AI集客支援",
  description:
    "セブンセンシズ株式会社（大阪市東成区）のお知らせ・プレスリリースです。経理BPO・AI集客支援・AI導入補助金の各事業に関する制度の新設、サービス開始、社内制度の取り組みを、新しい順に掲載しています。",
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
      {/* 以前は見出しの下に「お知らせ一覧のイメージ」の図（帯と線だけの絵）を置いていた。中身の無い絵をやめ、一覧を先に出す */}
      <PageHead
        crumbs={[{ name: "トップ", href: "/" }, { name: "お知らせ" }]}
        title="お知らせ"
        lead="経理BPO・AI集客支援・AI導入補助金の各事業に関する制度の新設やサービス開始、社内制度の取り組みなど、セブンセンシズ株式会社（大阪市東成区・法人番号3120001227825）からのお知らせを掲載しています。"
      />

      <section className="py-14 md:py-20" aria-label="お知らせの一覧">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          {news.length === 0 ? (
            <p className="border-y border-line py-10 text-[15px] text-slate">いま掲載しているお知らせはありません。</p>
          ) : (
            <ul className="rule-close border-t border-ink">
              {news.map((n) => (
                <li key={n.slug} className="border-b border-line last:border-b-0">
                  <Link href={`/news/${n.slug}`} className="group grid gap-1 py-5 sm:grid-cols-[8rem_7rem_1fr] sm:items-baseline sm:gap-6">
                    <time dateTime={n.dateISO} className="num text-sm text-slate">
                      {n.date}
                    </time>
                    <span className="text-[13px] font-bold text-pulse">{n.category}</span>
                    <span className="text-base font-bold leading-7 group-hover:text-pulse group-hover:underline group-hover:underline-offset-4">{n.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 一覧だけでは中身が薄く、読み終えた人の行き先も無かった。解説記事と事業の入口を置く */}
      <section className="bg-mist py-20 md:py-28" aria-labelledby="news-more-heading">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead
            id="news-more-heading"
            title="解説記事と、事業のご案内"
            lead="お知らせでは、セブンセンシズ株式会社のサービスや取り組みの動きを掲載しています。経理の進め方やAI検索の対策など、実務の解説は下の2つのメディアで公開しています。"
          />
          <ul className="mt-8 grid gap-x-8 md:grid-cols-3">
            {[
              { href: "/blog", label: "経理BPOブログ", body: "記帳・請求・給与・月次決算など、経理の進め方と外注の判断を解説しています。", ext: false },
              { href: site.labUrl, label: "AI集客ラボ", body: "SEO・AIO・LLMOの実践と、業種ごとの集客を解説している運営メディアです。", ext: true },
              { href: "/services", label: "事業内容", body: "集客・社内業務・補助金まで、ひとつのチームで引き受けている事業の一覧です。", ext: false },
            ].map((x) => (
              <li key={x.label} className="border-t-2 border-ink">
                <a href={x.href} {...(x.ext ? { target: "_blank", rel: "noopener" } : {})} className="group block py-5">
                  <span className="font-bold text-pulse underline decoration-1 underline-offset-[0.35em] group-hover:decoration-2">
                    {x.label}
                    {x.ext ? " ↗" : ""}
                  </span>
                  <span className="mt-2 block text-sm leading-7 text-slate">{x.body}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
