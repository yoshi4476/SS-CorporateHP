import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import BlogList from "@/components/BlogList";
import { Reveal, CountUp } from "@/components/motion";
import { SectionHead } from "@/components/ui";
import { posts, displayDate } from "@/lib/blog";
import { keywords, facts, problems, glossary, steps } from "@/lib/bpo";
import { diagnostics } from "@/lib/aio";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "経理BPOブログ",
  description:
    "記帳・請求・支払・給与計算といった経理業務の外部化と自動化を、中小企業の実務目線で解説するメディアです。インボイスや電子帳簿保存法への対応、月次決算の早期化まで扱います。",
  alternates: { canonical: "/blog" },
};

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
    ...(p.eyecatch ? { eyecatch: p.eyecatch } : {}),
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
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 45% 55% at 85% 25%, rgb(28 63 124 / 0.07), transparent 62%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-14 md:pb-20 md:pt-20">
          <Reveal>
            <span aria-hidden className="mb-6 block h-1.5 w-20 rounded-full bg-gradient-to-r from-pulse to-aqua" />
            <p className="eyebrow">Accounting BPO Media</p>
            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-[1.3] md:text-5xl">
              経理は、止められない。
              <br />
              でも、抱え込む必要はない。
            </h1>
            <p className="mt-8 max-w-2xl text-sm leading-9 text-slate md:text-base">
              記帳・請求・支払・給与計算。人が採れないのに、締切だけは毎月来ます。
              <mark className="marker">外に出す範囲と、社内に残す線引き</mark>
              を、中小企業の実務目線でまとめているメディアです。
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                data-magnetic
                className="rounded-full bg-pulse px-9 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                無料相談を申し込む
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

        {/* キーワード帯 */}
        <div aria-hidden className="overflow-hidden border-y border-line bg-raise/80 py-3.5">
          <div className="flex">
            <div className="animate-marquee flex shrink-0 items-center">
              {[...keywords, ...keywords].map((k, i) => (
                <span key={i} className="flex shrink-0 items-center whitespace-nowrap">
                  <span className="text-[0.78rem] font-bold text-ink">{k}</span>
                  <span className="mx-7 h-3 w-px bg-line-strong" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 実績タイル */}
      <section className="border-b border-line py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-2 xl:grid-cols-3">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.07}>
              <div className="border-l-2 border-pulse pl-5">
                <p className="leading-none">
                  <span className="num text-3xl font-bold text-ink md:text-4xl">
                    {/^[\d,]+$/.test(f.value) ? (
                      <CountUp value={Number(f.value.replaceAll(",", ""))} />
                    ) : (
                      f.value
                    )}
                  </span>
                  {f.suffix && <span className="ml-1 text-base font-bold text-pulse">{f.suffix}</span>}
                </p>
                <p className="mt-3 text-xs leading-6 text-slate">{f.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 読者の状態 */}
      <section className="py-20 md:py-28" aria-labelledby="problem-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Problem"
            title="こんな状態になっていませんか"
            lead="経理は、動いているうちは問題として表に出ません。==止まってから気づく==のがこの領域です。"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {problems.map((p, i) => (
              <Reveal key={p} delay={(i % 2) * 0.07}>
                <div className="flex items-start gap-4 rounded-2xl border border-line bg-raise p-6 shadow-card">
                  <span aria-hidden className="num mt-0.5 shrink-0 text-xs font-bold text-pulse">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-7">{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 用語集 */}
      <section className="border-y border-line bg-mist py-20 md:py-28" aria-labelledby="glossary-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            en="Glossary"
            title="30秒でわかる、4つの用語"
            lead="このメディアで繰り返し出てくる言葉です。ここだけ押さえれば記事が読めます。"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {glossary.map((g, i) => (
              <Reveal key={g.term} delay={(i % 4) * 0.07}>
                <article className="h-full rounded-2xl border border-line bg-raise p-6 shadow-card">
                  <p className="text-lg font-bold text-pulse">{g.term}</p>
                  <p className="font-data mt-1 text-[0.6rem] uppercase tracking-[0.16em] text-slate">{g.en}</p>
                  <p className="mt-4 text-xs leading-7 text-slate">{g.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 記事 */}
      <section id="latest" className="scroll-mt-24 py-20 md:py-28" aria-labelledby="latest-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Latest" title="新着記事" />


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
                    {lead.eyecatch ? (
                      <Image
                        src={lead.eyecatch}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span aria-hidden className="grid-field absolute inset-0" />
                    )}
                  </span>
                  <span className="flex flex-col justify-center p-7 md:p-10">
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="rounded-full bg-pulse/10 px-3 py-1 text-[0.65rem] font-bold text-pulse">
                        {lead.categoryName}
                      </span>
                      <time dateTime={lead.date} className="num text-xs text-slate">
                        {displayDate(lead.date)}
                      </time>
                      <span className="num text-[0.65rem] text-slate">約{lead.readingMinutes}分</span>
                    </span>
                    <span className="mt-4 block text-xl font-black leading-relaxed group-hover:text-pulse md:text-3xl">
                      {lead.title}
                    </span>
                    <span className="mt-4 block text-sm leading-8 text-slate">{lead.description}</span>
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

      {/* このメディアについて + 活用ステップ */}
      <section className="relative overflow-hidden border-t border-line bg-ink py-20 text-white md:py-28" aria-labelledby="about-heading">
        <div aria-hidden className="grid-field-dark absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 80% 18%, rgb(28 63 124 / 0.55), transparent 62%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
            <Reveal>
              <p className="font-data text-[0.72rem] uppercase tracking-[0.32em] text-aqua">About</p>
              <h2 id="about-heading" className="mt-4 text-2xl font-black leading-snug md:text-4xl">
                このメディアについて
              </h2>
              <p className="mt-6 text-sm leading-9 text-white/70">
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
              <p className="font-data text-[0.72rem] uppercase tracking-[0.32em] text-aqua">How to Use</p>
              <h2 className="mt-4 text-2xl font-black leading-snug md:text-3xl">読んで終わりにしないための3段階</h2>
              <ol className="mt-8 grid gap-4">
                {steps.map((s, i) => (
                  <li
                    key={s.title}
                    className="flex items-start gap-5 rounded-2xl border border-white/15 bg-white/[0.06] p-6"
                  >
                    <span className="num shrink-0 pt-0.5 text-sm font-bold text-aqua">0{i + 1}</span>
                    <span>
                      <span className="block text-base font-bold text-white">{s.title}</span>
                      <span className="mt-2 block text-xs leading-7 text-white/65">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex flex-wrap gap-3">
                {diagnostics.map((d) => (
                  <a
                    key={d.name}
                    href={d.href}
                    target="_blank"
                    rel="noopener"
                    className="rounded-full border border-white/25 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:border-aqua hover:text-aqua"
                  >
                    {d.name} ↗
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 締めのCTA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <Reveal>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-4 text-2xl font-black leading-snug md:text-4xl">
              経理を、外に出すか。社内に残すか。
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate md:text-base">
              どこまで任せられて、どこからは残すべきか。現在の業務量と体制をうかがったうえで、
              線引きの案と現状分析レポートをお持ちします。
            </p>
            <Link
              href="/contact"
              data-magnetic
              className="mt-9 inline-block rounded-full bg-pulse px-10 py-4 text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
            >
              無料相談を申し込む (現状分析レポート付き)
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
