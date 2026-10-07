import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { themes } from "@/lib/themes";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "経理の記事をテーマから探す",
  description:
    "経理BPOブログの記事を、経理BPO・外注、記帳・仕訳、請求書・支払、月次決算、自動化、属人化、個人事業主の7テーマにまとめました。テーマごとに、まず読む1本と掘り下げる記事に分けているので、知りたいことから順に読めます。",
  path: "/blog/theme",
});

export default function ThemeIndex() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "経理BPOブログ", path: "/blog" },
            { name: "テーマから探す", path: "/blog/theme" },
          ]),
        ]}
      />
      <section className="border-b border-line py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <nav aria-label="パンくず" className="text-xs text-slate">
            <Link href="/blog" className="hover:text-pulse">経理BPOブログ</Link>
          </nav>
          <p className="eyebrow mt-6">経理BPOブログ</p>
          <h1 className="mt-4 text-3xl font-black md:text-5xl">テーマから探す</h1>
          <p className="mt-6 max-w-2xl text-sm leading-8 text-slate md:text-base">
            記事を困りごとの単位で束ねています。各テーマの最初に全体像をつかむ1本を置き、そこから個別の記事へ進める作りです。
          </p>
        </div>
      </section>
      <section className="py-14 md:py-20">
        <ul className="mx-auto grid max-w-7xl gap-6 px-5 sm:grid-cols-2 xl:grid-cols-3">
          {themes.map((t) => (
            <li key={t.slug}>
              <Link href={`/blog/theme/${t.slug}`} className="group block h-full overflow-hidden rounded-3xl border border-line bg-raise shadow-card transition-colors hover:border-pulse/40">
                <span className="relative block aspect-[16/9]">
                  <Image src={t.photo} alt={`${t.name}のイメージ`} fill sizes="(min-width: 1280px) 400px, 50vw" className="object-cover" />
                </span>
                <span className="block p-6">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-lg font-black group-hover:text-pulse">{t.name}</span>
                    <span className="num shrink-0 text-xs font-bold text-pulse">{t.count}本</span>
                  </span>
                  <span className="mt-3 block text-xs leading-7 text-slate">{t.lead}</span>
                  <span className="mt-4 block text-xs font-bold text-ink">まず読む: {t.pillarPost.title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
