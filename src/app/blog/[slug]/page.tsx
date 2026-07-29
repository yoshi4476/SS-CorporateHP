import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { CtaBand } from "@/components/ui";
import { posts, getPost, relatedPosts, displayDate } from "@/lib/blog";
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

  const url = `${site.url}/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.dateModified,
    author: { "@id": `${site.url}/#organization` },
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

  return (
    <>
      <JsonLd
        data={[
          articleSchema,
          ...(faqSchema ? [faqSchema] : []),
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "店舗経営ブログ", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 pb-8 pt-10 md:pt-16">
          <Reveal>
            <nav aria-label="パンくずリスト" className="text-xs text-slate">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-pulse">トップ</Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/blog" className="hover:text-pulse">店舗経営ブログ</Link>
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
          </Reveal>
        </div>
      </section>

      <section className="pb-16 pt-2 md:pb-20">
        <article className="mx-auto max-w-4xl px-5">
          <Reveal delay={0.08}>
            <div
              className="article-body border-t border-line pt-10"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </Reveal>
        </article>
      </section>

      {related.length > 0 && (
        <section className="pb-20">
          <div className="mx-auto max-w-4xl px-5">
            <h2 className="text-lg font-bold">あわせて読みたい記事</h2>
            <div className="mt-5 grid gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group rounded-2xl border border-line bg-white px-6 py-4 transition-colors hover:border-pulse/40"
                >
                  <span className="rounded-full bg-pulse/10 px-3 py-0.5 text-[0.65rem] font-bold text-pulse">
                    {r.categoryName}
                  </span>
                  <span className="mt-2 block text-sm font-bold group-hover:text-pulse">
                    {r.title}
                  </span>
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
