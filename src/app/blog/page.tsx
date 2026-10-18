import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import BlogList from "@/components/BlogList";
import ResearchBand from "@/components/ResearchBand";
import { Reveal } from "@/components/motion";
import { SectionHead } from "@/components/ui";

import { posts, displayDate, thumbOf } from "@/lib/blog";
import { themes } from "@/lib/themes";
import { keywords, facts, problems, glossary, steps, sheet } from "@/lib/bpo";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { readingLinks } from "@/lib/reading";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "経理BPOブログ｜外注の判断に使う実務メディア",
  description:
    "記帳・請求・支払・給与計算といった経理業務の外部化と自動化を、中小企業の実務目線で解説するメディアです。インボイスや電子帳簿保存法への対応、月次決算の早期化まで扱います。外注の費用相場や依頼先の選び方も載せています。",
  path: "/blog",
});

export default function BlogPage() {
  const [lead, ...rest] = posts;
  // クライアントに渡すのは表示に使う項目だけ。本文HTMLは巨大なので含めない
  const listItems = rest.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    categoryName: p.categoryName,
    date: p.date,
    dateLabel: displayDate(p.date),
    readingMinutes: p.readingMinutes,
    ...(thumbOf(p) ? { eyecatch: thumbOf(p) } : {}),
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "経理BPOブログ", path: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "経理BPOブログ",
            description:
              "経理業務の外部化と自動化を、中小企業の実務目線で解説するメディア",
            url: `${site.url}/blog`,
            publisher: { "@id": `${site.url}/#organization` },
            blogPost: posts.slice(0, 10).map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              datePublished: p.date,
              url: `${site.url}/blog/${p.slug}`,
            })),
          },
        ]}
      />

      {/* 看板 */}
      <section className="pt-16 md:pt-[72px]">
        <div className="mx-auto max-w-7xl px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-20">
          <Reveal>
            <p className="text-sm font-bold text-slate">経理BPOブログ</p>
            <h1 className="mt-5 max-w-3xl text-[2rem] font-bold leading-[1.3] tracking-[-0.005em] md:text-[3.5rem] md:leading-[1.22]">
              経理は、止められない。
              <br />
              でも、抱え込む必要はない。
            </h1>
            <p className="mt-8 max-w-[40em] text-base leading-[1.95] text-slate">
              記帳・請求・支払・給与計算。人が採れないのに、締切だけは毎月来ます。
              <mark className="marker">外に出す範囲と、社内に残す線引き</mark>
              を、中小企業の実務目線でまとめているメディアです。
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* 相談はまだ重い。持ち帰れるものを先に置く */}
              <a
                href={sheet.href}
                download
                className="btn btn-primary"
              >
                <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
                  <path d="M8 1.5v9M4.5 7.5L8 11l3.5-3.5M2 13.5h12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                棚卸しシートを無料で受け取る
              </a>
              <Link
                href="/services/keiri-bpo"
                className="btn btn-secondary"
              >
                経理BPOのサービスを見る
              </Link>
              <Link
                href="#latest"
                className="group inline-flex items-center justify-center gap-2 px-2 py-3 text-sm font-bold text-ink transition-colors hover:text-pulse"
              >
                まずは記事を読む
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="text-pulse transition-transform group-hover:translate-y-0.5">
                  <path d="M7 2v9M3.5 7.5L7 11l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* よく扱う言葉。以前は横に流れ続ける帯だった。止めて読める一覧にする */}
        <div className="border-y border-line bg-mist">
          <p className="mx-auto max-w-7xl px-5 py-4 text-[13px] leading-7 text-slate md:px-8">
            <span className="mr-3 font-bold text-ink">よく扱う言葉</span>
            {keywords.join("・")}
          </p>
        </div>
      </section>

      {/* 実績タイル */}
      <section className="border-b border-line py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-2 md:px-8 xl:grid-cols-3">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.07}>
              <div className="border-l-2 border-pulse pl-5">
                <p className="leading-none">
                  {/* 書いてあるとおりに出す（数え上げの部品に通すと「2026年」が「2,026」になっていた） */}
                  <span className="num text-3xl font-bold text-ink md:text-4xl">{f.value}</span>
                  {f.suffix && <span className="ml-1 text-base font-bold">{f.suffix}</span>}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate">{f.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 読者の状態 */}
      <section className="py-20 md:py-28" aria-labelledby="problem-heading">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead
            title="こんな状態になっていませんか"
            lead="経理は、動いているうちは問題として表に出ません。==止まってから気づく==のがこの領域です。"
          />
          <ul className="mt-10 grid border-b border-line md:grid-cols-2 md:gap-x-10">
            {problems.map((p) => (
              <li key={p} className="flex items-start gap-4 border-t border-line py-4">
                <span aria-hidden className="mt-[0.75em] h-px w-4 shrink-0 bg-ink" />
                <p className="text-[15px] font-bold leading-7">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 用語集 */}
      <section className="bg-mist py-20 md:py-28" aria-labelledby="glossary-heading">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead
            title="30秒でわかる、4つの用語"
            lead="このメディアで繰り返し出てくる言葉です。ここだけ押さえれば記事が読めます。"
          />
          <dl className="mt-10 grid gap-x-8 sm:grid-cols-2 xl:grid-cols-4">
            {glossary.map((g) => (
              <div key={g.term} className="border-t-2 border-ink py-5">
                <dt>
                  <span className="block text-lg font-bold">{g.term}</span>
                  <span className="font-data mt-0.5 block text-[13px] text-slate">{g.en}</span>
                </dt>
                <dd className="mt-3 text-[15px] leading-7 text-slate">{g.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 記事 */}
      <section id="latest" className="scroll-mt-24 py-20 md:py-28" aria-labelledby="latest-heading">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          {/* 新着順だけでは、同じ困りごとの記事を続けて読めない */}
          <SectionHead title="テーマから探す" />
          <ul className="mt-8 flex flex-wrap gap-3">
            {themes.map((t) => (
              <li key={t.slug}>
                <Link href={`/blog/theme/${t.slug}`} className="tap inline-block rounded-sm border border-line-strong bg-raise px-5 py-2.5 text-sm font-bold hover:border-pulse hover:text-pulse">
                  {t.name}<span className="num ml-1.5 text-xs text-slate">{t.count}</span>
                </Link>
              </li>
            ))}
          </ul>
          {/* 比較表・用語集・調査は記事から作ったまとめ。どこからもリンクが無く孤立していた */}
          <p className="mb-16 mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="font-bold text-slate">ほかの探し方</span>
            {readingLinks()
              .filter((r) => r.href !== "/blog/theme")
              .map((r) => (
                <Link key={r.href} href={r.href} className="tap font-bold text-pulse underline-offset-4 hover:underline">
                  {r.label}
                </Link>
              ))}
          </p>
          <SectionHead title="新着記事" />


          {posts.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-line bg-raise px-6 py-12 text-center text-sm text-slate">
              記事の準備中です。まもなく公開します。
            </p>
          ) : (
            <>
              <Reveal delay={0.1}>
                <Link
                  href={`/blog/${lead.slug}`}
                  className="group mt-8 grid overflow-hidden rounded-3xl border border-line bg-raise shadow-card transition-colors hover:border-pulse/40 lg:grid-cols-[1.1fr_1fr]"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-mist lg:aspect-auto lg:min-h-[320px]">
                    {thumbOf(lead) ? (
                      <Image
                        src={thumbOf(lead)!}
                        alt={`${lead.title}のアイキャッチ画像`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-cover transition-transform duration-700"
                      />
                    ) : (
                      <span aria-hidden className="grid-field absolute inset-0" />
                    )}
                  </span>
                  <span className="flex flex-col justify-center p-7 md:p-10">
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="rounded-sm bg-pulse/10 px-3 py-1 text-xs font-bold text-pulse">
                        {lead.categoryName}
                      </span>
                      <time dateTime={lead.date} className="num text-xs text-slate">
                        {displayDate(lead.date)}
                      </time>
                      <span className="num text-xs text-slate">約{lead.readingMinutes}分</span>
                    </span>
                    <span className="mt-4 block text-xl font-black leading-relaxed group-hover:text-pulse md:text-3xl">
                      {lead.title}
                    </span>
                    <span className="mt-4 block text-[15px] leading-[1.9] text-slate">{lead.description}</span>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-pulse">
                      続きを読む
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="transition-transform group-hover:translate-x-1">
                        <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    </span>
                  </span>
                </Link>
              </Reveal>

              <BlogList items={listItems} />
            </>
          )}
        </div>
      </section>

      {/* 調査の要点（記事から作った問いを、AIに聞いた結果）。一覧を見終えた人に、記事とは別の入口として出す */}
      <ResearchBand />

      {/* このメディアについて + 活用ステップ */}
      <section className="bg-ink py-20 text-white md:py-28" aria-labelledby="about-heading">
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
            <Reveal>
              <p aria-hidden className="eyebrow !text-aqua" />
              <h2 id="about-heading" className="mt-4 text-2xl font-black leading-snug md:text-4xl">
                このメディアについて
              </h2>
              <p className="mt-6 text-[15px] leading-[1.9] text-white/70">
                経理BPOブログは、{site.name}が運営しています。
                自社でバックオフィスの仕組み化を実践し、その過程で分かったことを書いています。
                机上の整理ではなく、実際に動かして残った手順だけを扱います。
              </p>
              <Link
                href="/company"
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-aqua underline-offset-4 hover:underline"
              >
                運営者情報を見る
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <p aria-hidden className="eyebrow !text-aqua" />
              <h2 className="mt-4 text-2xl font-black leading-snug md:text-3xl">読んで終わりにしないための3段階</h2>
              <ol className="mt-6 border-b border-white/20">
                {steps.map((s, i) => (
                  <li
                    key={s.title}
                    className="flex items-start gap-5 border-t border-white/20 py-5"
                  >
                    <span className="num shrink-0 pt-0.5 text-sm font-bold text-aqua">0{i + 1}</span>
                    <span>
                      <span className="block text-base font-bold text-white">{s.title}</span>
                      <span className="mt-2 block text-sm leading-7 text-white/65">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              {/* 02 で使う実物。ここに置いていた診断3つは
                  Webマーケの道具で、経理の読者には関係がなかった */}
              <a
                href={sheet.href}
                download
                className="mt-6 flex items-center gap-4 rounded-sm border border-gold-bright/60 p-5 transition-colors hover:bg-white/[0.06]"
              >
                <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-gold-bright text-ink">
                  <svg width="17" height="17" viewBox="0 0 16 16">
                    <path d="M8 1.5v9M4.5 7.5L8 11l3.5-3.5M2 13.5h12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-white">{sheet.name}</span>
                  <span className="num mt-1 block text-[13px] text-white/70">{sheet.spec} ・ {sheet.note}</span>
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 締めのCTA */}
      <section className="py-20 md:py-28" data-cta-pos="closing">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="border-t border-ink pt-8">
            <h2 className="text-[1.625rem] font-bold leading-snug md:text-[2.25rem]">
              経理を、外に出すか。社内に残すか。
            </h2>
            <p className="mt-6 max-w-[40em] text-base leading-[1.95] text-slate">
              どこまで任せられて、どこからは残すべきか。現在の業務量と体制をうかがったうえで、
              線引きの案と現状分析レポートをお持ちします。
              <mark className="marker">棚卸しシートを書いた状態でお持ちいただくと、初回で話が具体的に進みます</mark>
              。まだ書けていなくても構いません。
            </p>
            <Link
              href="/contact"
              data-entry-s="keiri-bpo"
              className="btn btn-primary mt-9"
            >
              無料相談を申し込む (現状分析レポート付き)
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
