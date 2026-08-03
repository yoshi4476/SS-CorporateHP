import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { CtaBand } from "@/components/ui";
import { posts, usedCategories, displayDate } from "@/lib/blog";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "経理BPOブログ",
  description:
    "記帳・請求・支払・給与計算といった経理業務の外部化と自動化について、中小企業の実務目線で解説します。インボイスや電子帳簿保存法への対応、月次決算の早期化まで扱います。",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const cats = usedCategories();
  const [lead, ...rest] = posts;

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

      {/* メディアの看板 */}
      <section className="relative overflow-hidden border-b border-line pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-12 md:pb-16 md:pt-20">
          <Reveal>
            <p className="eyebrow">Accounting BPO Media</p>
            <h1 className="mt-4 text-3xl font-black md:text-5xl">経理BPOブログ</h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate md:text-base">
              記帳・請求・支払・給与計算——止められないのに、人が採れない。
              経理業務を<mark className="marker">外に出す判断と、社内に残す線引き</mark>
              を、中小企業の実務目線でまとめています。
            </p>
          </Reveal>

          {cats.length > 0 && (
            <Reveal delay={0.1}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {cats.map((c) => (
                  <li
                    key={c.slug}
                    className="rounded-full border border-line bg-raise px-4 py-1.5 text-xs font-bold text-ink"
                  >
                    {c.name}
                    <span className="num ml-2 text-pulse">{c.count}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="py-20">
          <p className="mx-auto max-w-3xl rounded-2xl border border-line bg-raise px-6 py-12 text-center text-sm text-slate">
            記事の準備中です。まもなく公開します。
          </p>
        </section>
      ) : (
        <>
          {/* 最新記事 */}
          <section className="py-14 md:py-20">
            <div className="mx-auto max-w-7xl px-5">
              <p className="eyebrow">Latest</p>
              <Reveal delay={0.06}>
                <Link
                  href={`/blog/${lead.slug}`}
                  className="group mt-6 grid overflow-hidden rounded-3xl border border-line bg-raise shadow-card transition-colors hover:border-pulse/40 lg:grid-cols-[1.1fr_1fr]"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-mist lg:aspect-auto lg:min-h-[340px]">
                    {lead.eyecatch ? (
                      <Image
                        src={lead.eyecatch}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        priority
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
            </div>
          </section>

          {/* 記事一覧 */}
          {rest.length > 0 && (
            <section className="border-t border-line bg-mist py-16 md:py-24">
              <div className="mx-auto max-w-7xl px-5">
                <p className="eyebrow">Articles</p>
                <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {rest.map((p, i) => (
                    <Reveal key={p.slug} delay={(i % 3) * 0.07}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raise shadow-card transition-colors hover:border-pulse/40"
                      >
                        <span className="relative block aspect-[16/9] overflow-hidden bg-mist">
                          {p.eyecatch ? (
                            <Image
                              src={p.eyecatch}
                              alt=""
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            />
                          ) : (
                            <span aria-hidden className="grid-field absolute inset-0" />
                          )}
                        </span>
                        <span className="flex flex-1 flex-col p-6">
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
                        </span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <CtaBand
        title="経理を、外に出すか。社内に残すか。"
        body="どこまで任せられて、どこからは残すべきか。現在の業務量と体制をうかがったうえで、線引きの案をお持ちします。"
      />
    </>
  );
}
