import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { CtaBand } from "@/components/ui";
import { news, getNews } from "@/lib/news";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNews(slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.body[0],
    alternates: { canonical: `/news/${item.slug}` },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getNews(slug);
  if (!item) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    datePublished: item.dateISO,
    dateModified: item.dateISO,
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: `${site.url}/news/${item.slug}`,
  };

  return (
    <>
      <JsonLd
        data={[
          articleSchema,
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "お知らせ", path: "/news" },
            { name: item.title, path: `/news/${item.slug}` },
          ]),
        ]}
      />
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 pb-10 pt-10 md:pt-16">
          <Reveal>
            <nav aria-label="パンくずリスト" className="text-xs text-slate">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="tap hover:text-pulse">トップ</Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/news" className="tap hover:text-pulse">お知らせ</Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink">{item.title}</li>
              </ol>
            </nav>
            <div className="mt-10 flex items-center gap-4">
              <time dateTime={item.dateISO} className="num text-sm text-slate">
                {item.date}
              </time>
              <span className="rounded-full bg-pulse/10 px-3 py-0.5 text-xs font-bold text-pulse">
                {item.category}
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-black leading-normal md:text-4xl md:leading-snug">
              {item.title}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 pt-4 md:pb-24">
        <article className="mx-auto max-w-4xl px-5">
          <Reveal delay={0.08}>
            <div className="grid gap-6 border-t border-line pt-10">
              {item.body.map((p, i) => (
                <p key={i} className="text-sm leading-9 text-slate md:text-base">
                  {p}
                </p>
              ))}
            </div>
            <Link
              href="/news"
              className="mt-12 inline-flex items-center gap-2 text-sm font-bold text-pulse underline-offset-4 hover:underline"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="rotate-180">
                <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              お知らせ一覧に戻る
            </Link>
          </Reveal>
        </article>
      </section>

      <CtaBand />
    </>
  );
}
