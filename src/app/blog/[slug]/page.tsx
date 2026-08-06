import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { CtaBand } from "@/components/ui";
import { diagnostics } from "@/lib/aio";
import {
  posts,
  getPost,
  relatedPosts,
  adjacentPosts,
  displayDate,
  withToc,
} from "@/lib/blog";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import "./article.css";

type Props = { params: Promise<{ slug: string }> };

// 記事は全てビルド時に静的生成する（実行時にファイルを読まないため Workers 上でも安全）
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.dateModified,
      ...(post.eyecatch ? { images: [{ url: post.eyecatch }] } : {}),
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { html, headings } = withToc(post.html);
  const url = `${site.url}/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.dateModified,
    // 記事の著者は法人ではなく実在の個人にする。組織名だけでは
    // 検索エンジンにもAIにも「誰の経験・専門性か」が伝わらない
    author: {
      "@type": "Person",
      name: site.ceo,
      jobTitle: "セブンセンシズ株式会社 代表取締役",
      url: "https://ai.7senses.co.jp/author/haraguchi/",
      worksFor: { "@id": `${site.url}/#organization` },
    },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: url,
    ...(post.eyecatch ? { image: `${site.url}${post.eyecatch}` } : {}),
  };
  // FAQはAI検索での引用を狙うため本文と完全に一致させる（エンジン側で保証している）
  const faqSchema =
    post.faq && post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const related = relatedPosts(post.slug);
  const { prev, next } = adjacentPosts(post.slug);
  const audit = diagnostics.find((d) => d.name === "サイト無料採点") ?? diagnostics[0];

  return (
    <>
      <JsonLd
        data={[
          articleSchema,
          ...(faqSchema ? [faqSchema] : []),
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "経理BPOブログ", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 pb-8 pt-10 md:pt-16">
          <Reveal>
            <nav aria-label="パンくずリスト" className="text-xs text-slate">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="tap hover:text-pulse">トップ</Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/blog" className="tap hover:text-pulse">経理BPOブログ</Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink">{post.title}</li>
              </ol>
            </nav>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <time dateTime={post.date} className="num text-sm text-slate">
                {displayDate(post.date)}
              </time>
              <span className="rounded-full bg-pulse/10 px-3 py-0.5 text-xs font-bold text-pulse">
                {post.categoryName}
              </span>
              <span className="num text-xs text-slate">約{post.readingMinutes}分</span>
              {post.dateModified !== post.date && (
                <span className="num text-xs text-slate">
                  最終更新 {displayDate(post.dateModified)}
                </span>
              )}
            </div>
            <h1 className="mt-4 text-2xl font-black leading-normal md:text-4xl md:leading-snug">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-loose text-slate md:text-base">
              {post.description}
            </p>
          </Reveal>

          {post.eyecatch && (
            <Reveal delay={0.08}>
              <figure className="mt-8 overflow-hidden rounded-3xl border border-line bg-mist md:mt-10">
                <Image
                  src={post.eyecatch}
                  alt={post.title}
                  width={1200}
                  height={630}
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="h-auto w-full"
                />
              </figure>
            </Reveal>
          )}
        </div>
      </section>

      <section className="pb-16 pt-2 md:pb-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 lg:grid-cols-[1fr_16rem] lg:gap-12">
          <article className="min-w-0">
            {headings.length >= 3 && (
              <Reveal>
                <nav
                  aria-label="目次"
                  className="rounded-3xl border border-line bg-raise p-6 lg:hidden"
                >
                  <p className="text-xs font-bold tracking-widest text-faint">目次</p>
                  <ol className="mt-4 space-y-2.5">
                    {headings.map((h) => (
                      <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
                        <a
                          href={`#${h.id}`}
                          className="tap text-sm leading-relaxed text-ink-soft hover:text-pulse"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </Reveal>
            )}

            {/* 本文はスクロール連動アニメで包まない。
                目次アンカーで途中に着地したときに本文が消えるのを避けるため */}
            <div
              className="article-body mt-10 border-t border-line pt-10 lg:mt-0"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            <Reveal>
              <aside className="mt-14 overflow-hidden rounded-3xl bg-ink px-7 py-8 text-paper md:px-10">
                <p className="text-xs font-bold tracking-widest text-aqua">無料セルフチェック</p>
                <h2 className="mt-3 text-lg font-black leading-snug md:text-xl">
                  この記事のテーマで、自社の現在地を測る
                </h2>
                <p className="mt-3 text-sm leading-loose text-paper/70">
                  {audit.body}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={audit.href}
                    target="_blank"
                    rel="noopener"
                    className="tap inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-bold text-ink transition-opacity hover:opacity-80"
                  >
                    {audit.name}を受ける
                    <span className="num text-xs text-slate">{audit.spec}</span>
                  </a>
                  <Link
                    href="/contact"
                    className="tap inline-flex items-center rounded-full border border-paper/30 px-6 py-3 text-sm font-bold text-paper transition-colors hover:border-paper"
                  >
                    無料相談を申し込む
                  </Link>
                </div>
              </aside>
            </Reveal>

            {(prev || next) && (
              <nav
                aria-label="前後の記事"
                className="mt-10 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
              >
                {prev ? (
                  <Link
                    href={`/blog/${prev.slug}`}
                    className="group rounded-2xl border border-line bg-raise px-6 py-4 transition-colors hover:border-pulse/40"
                  >
                    <span className="text-xs text-faint">← 前の記事</span>
                    <span className="mt-1.5 block text-sm font-bold leading-relaxed group-hover:text-pulse">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {next && (
                  <Link
                    href={`/blog/${next.slug}`}
                    className="group rounded-2xl border border-line bg-raise px-6 py-4 text-right transition-colors hover:border-pulse/40"
                  >
                    <span className="text-xs text-faint">次の記事 →</span>
                    <span className="mt-1.5 block text-sm font-bold leading-relaxed group-hover:text-pulse">
                      {next.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {headings.length >= 3 && (
                <nav aria-label="目次" className="rounded-3xl border border-line bg-raise p-6">
                  <p className="text-xs font-bold tracking-widest text-faint">目次</p>
                  <ol className="mt-4 space-y-2.5">
                    {headings.map((h) => (
                      <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
                        <a
                          href={`#${h.id}`}
                          className="block text-[0.8rem] leading-relaxed text-ink-soft hover:text-pulse"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <div className="rounded-3xl border border-line bg-mist p-6">
                <p className="text-xs font-bold tracking-widest text-faint">監修</p>
                <p className="mt-3 text-sm font-bold leading-relaxed">セブンセンシズ株式会社</p>
                <p className="mt-2 text-[0.8rem] leading-relaxed text-slate">
                  経理BPO・AI導入支援・Web集客を手がけています。記事の内容について詳しく知りたい方はご相談ください。
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-pulse underline-offset-4 hover:underline"
                >
                  無料相談を申し込む
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path
                      d="M2 7h9M8 3.5L11.5 7 8 10.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-mist py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-5">
            <h2 className="text-lg font-black md:text-xl">あわせて読みたい</h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group overflow-hidden rounded-3xl border border-line bg-raise transition-colors hover:border-pulse/40"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-mist">
                    {r.eyecatch ? (
                      <Image
                        src={r.eyecatch}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-xs font-bold tracking-widest text-faint">
                        SEVEN SENSES
                      </span>
                    )}
                  </div>
                  <div className="px-6 py-5">
                    <span className="rounded-full bg-pulse/10 px-3 py-0.5 text-[0.65rem] font-bold text-pulse">
                      {r.categoryName}
                    </span>
                    <span className="mt-2.5 block text-sm font-bold leading-relaxed group-hover:text-pulse">
                      {r.title}
                    </span>
                    <time dateTime={r.date} className="num mt-3 block text-xs text-faint">
                      {displayDate(r.date)}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/blog"
              className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-pulse underline-offset-4 hover:underline"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="rotate-180">
                <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              ブログ一覧に戻る
            </Link>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
