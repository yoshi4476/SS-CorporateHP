import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { CtaBand } from "@/components/ui";
import { posts, usedCategories, displayDate } from "@/lib/blog";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "店舗経営ブログ",
  description:
    "人材採用・スタッフ教育・オペレーション改善・店舗DXなど、店舗経営の実務課題に役立つ情報と導入事例を、3,200店舗以上の支援実績から発信します。",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const cats = usedCategories();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "トップ", path: "/" },
          { name: "店舗経営ブログ", path: "/blog" },
        ])}
      />
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 pb-10 pt-12 md:pt-20">
          <Reveal>
            <p className="eyebrow">Blog</p>
            <h1 className="mt-4 text-3xl font-black md:text-5xl">店舗経営ブログ</h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate md:text-base">
              人材・オペレーション・店舗DXなど、集客の外側にある経営課題を扱います。
              3,200店舗以上の支援で得た実務知見をもとに、明日から試せる形でまとめています。
            </p>
          </Reveal>
        </div>
      </section>

      {cats.length > 0 && (
        <section className="pb-2">
          <div className="mx-auto flex max-w-5xl flex-wrap gap-2 px-5">
            {cats.map((c) => (
              <span
                key={c.slug}
                className="rounded-full border border-line bg-white px-4 py-1 text-xs font-bold text-slate"
              >
                {c.name}
                <span className="num ml-2 text-pulse">{c.count}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="pb-20 pt-8 md:pb-28">
        <div className="mx-auto max-w-5xl px-5">
          {posts.length === 0 ? (
            <p className="rounded-2xl border border-line bg-white px-6 py-10 text-center text-sm text-slate">
              記事の準備中です。まもなく公開します。
            </p>
          ) : (
            <div className="grid gap-3">
              {posts.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="tilt group block rounded-2xl border border-line bg-white px-6 py-5 shadow-card transition-colors hover:border-pulse/40"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <time dateTime={p.date} className="num text-xs text-slate">
                        {displayDate(p.date)}
                      </time>
                      <span className="rounded-full bg-pulse/10 px-3 py-0.5 text-[0.65rem] font-bold text-pulse">
                        {p.categoryName}
                      </span>
                      <span className="num text-[0.65rem] text-slate">
                        約{p.readingMinutes}分で読めます
                      </span>
                    </div>
                    <h2 className="mt-2 text-base font-bold leading-relaxed group-hover:text-pulse md:text-lg">
                      {p.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-slate">
                      {p.description}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
