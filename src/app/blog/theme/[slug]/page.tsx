import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { displayDate, thumbOf } from "@/lib/blog";
import { themes, getTheme, themeFaq } from "@/lib/themes";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return themes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getTheme((await params).slug);
  if (!t) return {};
  return pageMeta({
    title: `${t.name}の記事${t.count}本`,
    description: t.lead,
    path: `/blog/theme/${t.slug}`,
  });
}

export default async function ThemePage({ params }: Props) {
  const t = getTheme((await params).slug);
  if (!t) notFound();
  const p = t.pillarPost;
  const faq = themeFaq(t);
  const others = themes.filter((x) => x.slug !== t.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "経理BPOブログ", path: "/blog" },
            { name: "テーマから探す", path: "/blog/theme" },
            { name: t.name, path: `/blog/theme/${t.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${t.name}の記事`,
            description: t.lead,
            url: `${site.url}/blog/theme/${t.slug}`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: [p, ...t.rest].map((x, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${site.url}/blog/${x.slug}`,
                name: x.title,
              })),
            },
          },
          ...(faq.length >= 3 ? [faqSchema(faq)] : []),
        ]}
      />

      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <nav aria-label="パンくず" className="text-xs text-slate">
              <Link href="/blog" className="hover:text-pulse">経理BPOブログ</Link>
              <span className="mx-2">/</span>
              <Link href="/blog/theme" className="hover:text-pulse">テーマから探す</Link>
            </nav>
            <p className="eyebrow mt-6">Theme</p>
            <h1 className="mt-4 text-3xl font-black leading-[1.35] md:text-5xl">{t.name}</h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate md:text-base">{t.lead}</p>
            <p className="num mt-6 text-sm font-bold text-pulse">{t.count}本の記事</p>
          </div>
          <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
            <Image src={t.photo} alt={`${t.name}のイメージ`} fill priority sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
          </figure>
        </div>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="pillar-heading">
        <div className="mx-auto max-w-7xl px-5">
          <h2 id="pillar-heading" className="text-2xl font-black md:text-3xl">まず読む1本</h2>
          <p className="mt-3 text-sm text-slate">このテーマの全体像をつかめる記事です。ここから下の記事へ掘り下げてください。</p>
          <Link
            href={`/blog/${p.slug}`}
            className="group mt-8 grid overflow-hidden rounded-3xl border border-line bg-raise shadow-card transition-colors hover:border-pulse/40 lg:grid-cols-[1fr_1.1fr]"
          >
            <span className="relative block aspect-[16/10] overflow-hidden bg-mist lg:aspect-auto lg:min-h-[280px]">
              {thumbOf(p) && <Image src={thumbOf(p)!} alt={`${p.title}のアイキャッチ画像`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />}
            </span>
            <span className="flex flex-col justify-center p-7 md:p-10">
              <time dateTime={p.date} className="num text-xs text-slate">{displayDate(p.date)}</time>
              <span className="mt-3 block text-xl font-black leading-relaxed group-hover:text-pulse md:text-2xl">{p.title}</span>
              <span className="mt-4 block text-sm leading-8 text-slate">{p.description}</span>
            </span>
          </Link>
        </div>
      </section>

      <section className="border-t border-line bg-mist py-16 md:py-20" aria-labelledby="deep-heading">
        <div className="mx-auto max-w-7xl px-5">
          <h2 id="deep-heading" className="text-2xl font-black md:text-3xl">掘り下げる記事</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {t.rest.map((x) => (
              <li key={x.slug}>
                <Link href={`/blog/${x.slug}`} className="group flex h-full gap-4 rounded-2xl border border-line bg-raise p-4 shadow-card transition-colors hover:border-pulse/40">
                  {thumbOf(x) && (
                    <span className="relative block h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-mist">
                      <Image src={thumbOf(x)!} alt="" fill sizes="112px" className="object-cover" />
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm font-bold leading-6 group-hover:text-pulse">{x.title}</span>
                    <time dateTime={x.date} className="num mt-2 block text-[0.7rem] text-slate">{displayDate(x.date)}</time>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {faq.length >= 3 && (
        <section className="py-16 md:py-20" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-4xl px-5">
            <h2 id="faq-heading" className="text-2xl font-black md:text-3xl">このテーマでよくある質問</h2>
            <dl className="mt-8 grid gap-4">
              {faq.map((f) => (
                <div key={f.q} className="rounded-2xl border border-line bg-raise p-6">
                  <dt className="font-bold">{f.q}</dt>
                  <dd className="mt-3 text-sm leading-7 text-slate">
                    {f.a}
                    <Link href={`/blog/${f.slug}`} className="ml-2 text-pulse underline-offset-4 hover:underline">記事で詳しく</Link>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="border-t border-line py-14" aria-labelledby="other-heading">
        <div className="mx-auto max-w-7xl px-5">
          <h2 id="other-heading" className="text-lg font-black">ほかのテーマ</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/blog/theme/${o.slug}`} className="tap inline-block rounded-full border border-line-strong px-5 py-2 text-sm font-bold hover:border-pulse hover:text-pulse">
                  {o.name}（{o.count}）
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact?s=keiri-bpo" className="mt-10 inline-block rounded-full bg-pulse px-9 py-4 text-sm font-bold text-white shadow-glow">
            経理の外注を無料で相談する
          </Link>
        </div>
      </section>
    </>
  );
}
