import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { SectionHead } from "@/components/ui";
import { posts, getPost, usedCategories, postsByCategory, displayDate } from "@/lib/blog";
import { keywords, glossary, steps, startHere } from "@/lib/bpo";
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
  const [lead, ...rest] = posts;
  // 新着は先頭の3本だけ。残りはカテゴリ別で辿らせる
  const recent = rest.slice(0, 3);
  // 順路は記事が実在するものだけ。管制塔が取り下げても壊れない
  const path = startHere
    .map((s) => ({ ...s, post: getPost(s.slug) }))
    .filter((s): s is typeof s & { post: NonNullable<typeof s.post> } => Boolean(s.post));
  const byCategory = cats.map((c) => ({ ...c, items: postsByCategory(c.slug) }));

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

      {/* 記事 */}
      <section id="latest" className="scroll-mt-24 py-20 md:py-28" aria-labelledby="latest-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead en="Latest" title="新着記事" />

          {cats.length > 0 && (
            <Reveal delay={0.08}>
              {/* 件数つきのカテゴリ。押すと下のカテゴリ別一覧へ飛ぶ */}
              <ul className="mt-8 flex flex-wrap gap-2">
                {cats.map((c) => (
                  <li key={c.slug}>
                    <a
                      href={`#cat-${c.slug}`}
                      className="tap inline-flex items-center rounded-full border border-line bg-raise px-4 py-1.5 text-xs font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
                    >
                      {c.name}
                      <span className="num ml-2 text-pulse">{c.count}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {posts.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-line bg-raise px-6 py-12 text-center text-sm text-slate">
              記事の準備中です。まもなく公開します。
            </p>
          ) : (
            <>
              {/* アイキャッチには記事タイトルが描かれているため、一覧では出さない。
                  隣にタイトルを置くと同じ文字が二度並んで読みにくくなる。
                  画像は記事ページとOGPで使われる */}
              <Reveal delay={0.1}>
                <Link
                  href={`/blog/${lead.slug}`}
                  className="group mt-8 block overflow-hidden rounded-3xl border border-line bg-raise p-8 shadow-card transition-colors hover:border-pulse/40 md:p-12"
                >
                  <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="rounded-full bg-pulse px-3 py-1 text-[0.65rem] font-bold text-white">
                      最新
                    </span>
                    <span className="text-[0.7rem] font-bold text-pulse">{lead.categoryName}</span>
                    <time dateTime={lead.date} className="num text-xs text-slate">
                      {displayDate(lead.date)}
                    </time>
                    <span className="num text-[0.68rem] text-faint">約{lead.readingMinutes}分</span>
                  </span>
                  <span className="mt-5 block max-w-4xl text-2xl font-black leading-[1.5] group-hover:text-pulse md:text-4xl md:leading-[1.45]">
                    {lead.title}
                  </span>
                  <span className="mt-5 block max-w-3xl text-sm leading-8 text-slate md:text-base md:leading-9">
                    {lead.description}
                  </span>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-pulse">
                    続きを読む
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="transition-transform group-hover:translate-x-1">
                      <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                </Link>
              </Reveal>

              {/* 直近の数本だけ横並びで見せる。全件は下のカテゴリ別で辿れる */}
              {recent.length > 0 && (
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {recent.map((p, i) => (
                    <Reveal key={p.slug} delay={i * 0.07}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-line bg-raise p-6 shadow-card transition-colors hover:border-pulse/40"
                      >
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="rounded-full bg-pulse/10 px-2.5 py-0.5 text-[0.62rem] font-bold text-pulse">
                            {p.categoryName}
                          </span>
                          <time dateTime={p.date} className="num text-[0.68rem] text-slate">
                            {displayDate(p.date)}
                          </time>
                        </span>
                        <span className="mt-3 block flex-1 text-base font-bold leading-relaxed group-hover:text-pulse">
                          {p.title}
                        </span>
                        <span className="mt-3 block text-xs leading-7 text-slate">
                          約{p.readingMinutes}分で読めます
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* はじめての方の順路。記事が増えるほど「どれから読むか」が要る */}
      {path.length > 0 && (
        <section className="border-y border-line bg-mist py-20 md:py-28" aria-labelledby="start-heading">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead
              en="Start here"
              title="はじめての方は、この順番で"
              lead="検討の順番どおりに並べています。上から読めば、自社に必要かどうかと、いくらかかるかまで見当がつきます。"
            />
            <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {path.map((p, i) => (
                <Reveal key={p.post.slug} delay={i * 0.07}>
                  <li className="h-full">
                    <Link
                      href={`/blog/${p.post.slug}`}
                      className="group flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-card transition-colors hover:border-pulse/40"
                    >
                      <span className="flex items-center gap-3">
                        <span aria-hidden className="num grid h-7 w-7 shrink-0 place-items-center rounded-full bg-pulse text-[0.7rem] font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="font-data text-[0.62rem] uppercase tracking-[0.18em] text-pulse">
                          {p.step}
                        </span>
                      </span>
                      <span className="mt-4 block text-base font-bold leading-relaxed group-hover:text-pulse">
                        {p.post.title}
                      </span>
                      <span className="mt-3 block flex-1 text-sm leading-7 text-slate">{p.why}</span>
                      <span className="num mt-5 block text-xs text-faint">約{p.post.readingMinutes}分</span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* カテゴリ別の全記事。16本を超えると新着順のカードだけでは探せない */}
      {byCategory.length > 0 && (
        <section className="py-20 md:py-28" aria-labelledby="archive-heading">
          <div className="mx-auto max-w-7xl px-5">
            <SectionHead en="Archive" title="テーマから探す" />
            <div className="mt-12 grid gap-14">
              {byCategory.map((c) => (
                <div key={c.slug} id={`cat-${c.slug}`} className="scroll-mt-24">
                  <Reveal>
                    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-3">
                      <h3 className="text-lg font-black md:text-xl">{c.name}</h3>
                      <p className="num text-xs text-slate">{c.items.length}本</p>
                    </div>
                  </Reveal>
                  <ul className="grid">
                    {c.items.map((p, i) => (
                      <Reveal key={p.slug} delay={Math.min(i, 5) * 0.04}>
                        <li className="border-b border-line">
                          <Link
                            href={`/blog/${p.slug}`}
                            className="group flex flex-wrap items-baseline gap-x-5 gap-y-1 py-4 md:flex-nowrap"
                          >
                            <time dateTime={p.date} className="num w-24 shrink-0 text-xs text-faint">
                              {displayDate(p.date)}
                            </time>
                            <span className="min-w-0 flex-1 text-sm font-bold leading-7 text-ink transition-colors group-hover:text-pulse md:text-base">
                              {p.title}
                            </span>
                            <span className="num shrink-0 text-xs text-faint">約{p.readingMinutes}分</span>
                            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="hidden shrink-0 text-pulse transition-transform group-hover:translate-x-1 md:block">
                              <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                            </svg>
                          </Link>
                        </li>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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