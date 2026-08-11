import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { posts, getPost, usedCategories, postsByCategory, displayDate } from "@/lib/blog";
import { glossary, steps, startHere } from "@/lib/bpo";
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
  const cats = usedCategories();
  const [lead] = posts;
  const path = startHere
    .map((s) => ({ ...s, post: getPost(s.slug) }))
    .filter((s): s is typeof s & { post: NonNullable<typeof s.post> } => Boolean(s.post));
  const byCategory = cats.map((c) => ({ ...c, items: postsByCategory(c.slug) }));
  const updated = posts.length > 0 ? posts[0].date : "";

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
            description: "経理業務の外部化と自動化を、中小企業の実務目線で解説するメディア",
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

      {/* 題字。刊行物の柱のように、名前・扱う範囲・規模を1か所に集める */}
      <section className="relative overflow-hidden border-b border-line pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 pb-9 pt-12 md:pb-11 md:pt-16">
          <Reveal>
            <p className="eyebrow">Accounting BPO Media</p>
            <h1 className="mt-4 max-w-3xl text-[7.2vw] font-black leading-[1.32] sm:text-4xl md:text-[2.9rem]">
              経理は、止められない。
              <br />
              でも、抱え込む必要はない。
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate md:text-[0.95rem]">
              記帳・請求・支払・給与計算。
              <mark className="marker">外に出す範囲と、社内に残す線引き</mark>
              を、中小企業の実務目線でまとめています。
            </p>
          </Reveal>
        </div>

        {/* 奥付。全何本で、いつ更新されたか。メディアとしての規模がここで分かる */}
        <Reveal>
          <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 border-t border-line px-5 py-4">
            <p className="font-data text-[0.62rem] uppercase tracking-[0.2em] text-faint">
              全 <span className="num text-sm font-bold text-ink">{posts.length}</span> 本
            </p>
            {updated && (
              <p className="font-data text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                最終更新 <span className="num text-sm font-bold text-ink">{displayDate(updated)}</span>
              </p>
            )}
            <nav aria-label="カテゴリ" className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {cats.map((c) => (
                <a
                  key={c.slug}
                  href={`#cat-${c.slug}`}
                  className="tap border-b-2 border-transparent pb-0.5 text-xs font-bold text-slate transition-colors hover:border-pulse hover:text-pulse"
                >
                  {c.name}
                  <span className="num ml-1.5 text-[0.65rem] text-faint">{c.count}</span>
                </a>
              ))}
            </nav>
          </div>
        </Reveal>
      </section>

      {posts.length === 0 ? (
        <section className="py-24">
          <p className="mx-auto max-w-7xl px-5 text-center text-sm text-slate">
            記事の準備中です。まもなく公開します。
          </p>
        </section>
      ) : (
        <>
          {/* 最新の1本だけ、社説のように大きく置く */}
          <section className="py-14 md:py-20" aria-labelledby="lead-heading">
            <div className="mx-auto max-w-7xl px-5">
              <Reveal>
                <Link href={`/blog/${lead.slug}`} className="group block border-t-2 border-ink pt-7">
                  <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <span className="font-data text-[0.62rem] uppercase tracking-[0.24em] text-pulse">
                      Latest
                    </span>
                    <span className="text-[0.72rem] font-bold text-slate">{lead.categoryName}</span>
                    <time dateTime={lead.date} className="num text-xs text-faint">
                      {displayDate(lead.date)}
                    </time>
                    <span className="num text-[0.68rem] text-faint">約{lead.readingMinutes}分</span>
                  </span>
                  <h2
                    id="lead-heading"
                    className="mt-4 max-w-5xl text-2xl font-black leading-[1.45] transition-colors group-hover:text-pulse md:text-[2.6rem] md:leading-[1.4]"
                  >
                    {lead.title}
                  </h2>
                  <p className="mt-5 max-w-3xl text-sm leading-8 text-slate md:text-base md:leading-9">
                    {lead.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-pulse">
                    続きを読む
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="transition-transform group-hover:translate-x-1">
                      <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            </div>
          </section>

          {/* はじめての方の順路。横一列に繋いで、順番があることを形で示す */}
          {path.length > 0 && (
            <section className="border-y border-line bg-mist py-14 md:py-20" aria-labelledby="start-heading">
              <div className="mx-auto max-w-7xl px-5">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 id="start-heading" className="text-lg font-black md:text-xl">
                    はじめての方は、この順番で
                  </h2>
                  <p className="text-xs text-slate">読めば、自社に必要かと、いくらかかるかまで見当がつきます</p>
                </div>
                <ol className="relative mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
                  {path.map((p, i) => (
                    <Reveal key={p.post.slug} delay={i * 0.06}>
                      <li className="h-full bg-white">
                        <Link href={`/blog/${p.post.slug}`} className="group flex h-full flex-col p-6">
                          <span className="flex items-center gap-2.5">
                            <span aria-hidden className="num text-[0.66rem] font-bold text-pulse">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="font-data text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                              {p.step}
                            </span>
                          </span>
                          <span className="mt-3 block text-sm font-bold leading-7 transition-colors group-hover:text-pulse">
                            {p.post.title}
                          </span>
                          <span className="mt-2.5 block flex-1 text-xs leading-6 text-slate">{p.why}</span>
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {/* 全記事の索引。台帳のように通し番号と日付で並べ、16本を一望させる */}
          <section className="py-16 md:py-24" aria-labelledby="index-heading">
            <div className="mx-auto max-w-7xl px-5">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id="index-heading" className="text-lg font-black md:text-xl">
                  記事の索引
                </h2>
                <p className="num text-xs text-slate">全 {posts.length} 本</p>
              </div>

              <div className="mt-10 grid gap-12">
                {byCategory.map((c) => (
                  <div key={c.slug} id={`cat-${c.slug}`} className="scroll-mt-24">
                    <Reveal>
                      <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-2.5">
                        <h3 className="text-base font-black md:text-lg">{c.name}</h3>
                        <p className="num text-[0.7rem] text-faint">{c.items.length}</p>
                      </div>
                    </Reveal>
                    <ol>
                      {c.items.map((p, i) => (
                        <Reveal key={p.slug} delay={Math.min(i, 6) * 0.03}>
                          <li className="border-b border-line">
                            <Link
                              href={`/blog/${p.slug}`}
                              className="group grid grid-cols-[2.2rem_1fr] items-baseline gap-x-4 gap-y-1 py-4 transition-colors hover:bg-mist md:grid-cols-[2.6rem_6rem_1fr_4rem] md:px-2"
                            >
                              <span aria-hidden className="num text-[0.7rem] font-bold text-faint">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <time
                                dateTime={p.date}
                                className="num order-3 text-[0.7rem] text-faint md:order-none"
                              >
                                {displayDate(p.date)}
                              </time>
                              <span className="text-sm font-bold leading-7 text-ink transition-colors group-hover:text-pulse md:text-[0.95rem]">
                                {p.title}
                              </span>
                              <span className="num order-4 text-right text-[0.7rem] text-faint md:order-none">
                                約{p.readingMinutes}分
                              </span>
                            </Link>
                          </li>
                        </Reveal>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* 用語集。カードではなく定義リストにして、辞書らしく見せる */}
      <section className="border-y border-line bg-mist py-16 md:py-24" aria-labelledby="glossary-heading">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="glossary-heading" className="text-lg font-black md:text-xl">
              30秒でわかる、4つの用語
            </h2>
            <p className="text-xs text-slate">ここだけ押さえれば記事が読めます</p>
          </div>
          <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {glossary.map((g, i) => (
              <Reveal key={g.term} delay={(i % 2) * 0.06}>
                <div className="flex h-full gap-6 bg-white p-6 md:p-7">
                  <div className="w-32 shrink-0">
                    <dt className="text-sm font-bold text-pulse md:text-base">{g.term}</dt>
                    <p className="font-data mt-1 text-[0.58rem] uppercase tracking-[0.14em] text-faint">{g.en}</p>
                  </div>
                  <dd className="min-w-0 flex-1 text-xs leading-7 text-slate">{g.body}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* このメディアについて + 活用ステップ */}
      <section className="relative overflow-hidden bg-ink py-16 text-white md:py-24" aria-labelledby="about-heading">
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
              <p className="font-data text-[0.7rem] uppercase tracking-[0.3em] text-aqua">About</p>
              <h2 id="about-heading" className="mt-4 text-xl font-black leading-snug md:text-3xl">
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
              <p className="font-data text-[0.7rem] uppercase tracking-[0.3em] text-aqua">How to Use</p>
              <h2 className="mt-4 text-xl font-black leading-snug md:text-2xl">読んで終わりにしないための3段階</h2>
              <ol className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex items-start gap-5 bg-ink p-6">
                    <span className="num shrink-0 pt-0.5 text-sm font-bold text-aqua">0{i + 1}</span>
                    <span>
                      <span className="block text-sm font-bold text-white md:text-base">{s.title}</span>
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
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <Reveal>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-4 text-xl font-black leading-snug md:text-3xl">
              経理を、外に出すか。社内に残すか。
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate">
              どこまで任せられて、どこからは残すべきか。現在の業務量と体制をうかがったうえで、
              線引きの案と現状分析レポートをお持ちします。
            </p>
            <Link
              href="/contact"
              data-magnetic
              className="mt-8 inline-block rounded-full bg-pulse px-10 py-4 text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
            >
              無料相談を申し込む (現状分析レポート付き)
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
