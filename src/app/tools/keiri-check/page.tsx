import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import KeiriCheck from "@/components/KeiriCheck";
import { getPost } from "@/lib/blog";
import { getTheme } from "@/lib/themes";
import { LAW_READ, NEXT_READS, type ReadLink, type ResultKey } from "@/lib/keiriCheck";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/meta";

const PATH = "/tools/keiri-check";

export const metadata: Metadata = pageMeta({
  title: "経理、外に出すべき？5問のセルフチェック",
  description:
    "経理を外に出すべきかを、5問の「はい・いいえ」で確かめるセルフチェックです。担当が1人に集まっていないか、手順が決まった作業がどれだけあるかなどから、外に出せる範囲の目安と次に読む記事を示します。無料・登録不要で、答えはどこにも送信しません。",
  path: PATH,
});

// 記事は管制塔が差し替え・統合する。消えた記事へリンクしないよう、ビルド時に実在を確かめる
function postLink(slug: string): ReadLink | undefined {
  const p = getPost(slug);
  return p ? { href: `/blog/${p.slug}`, title: p.title } : undefined;
}

function readsFor(key: ResultKey): ReadLink[] {
  const { posts, theme } = NEXT_READS[key];
  const out = posts.map(postLink).filter((l): l is ReadLink => Boolean(l));
  const t = getTheme(theme);
  if (t) out.push({ href: `/blog/theme/${t.slug}`, title: `${t.name}の記事をまとめて読む` });
  return out;
}

export default function KeiriCheckPage() {
  const reads: Record<ResultKey, ReadLink[]> = {
    wide: readsFor("wide"),
    part: readsFor("part"),
    inhouse: readsFor("inhouse"),
  };

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "トップ", path: "/" },
          { name: "経理のセルフチェック", path: PATH },
        ])}
      />

      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5 pb-8 pt-12 md:pt-20">
          <nav aria-label="パンくずリスト" className="text-xs text-slate">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="tap hover:text-pulse">
                  トップ
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink">
                経理のセルフチェック
              </li>
            </ol>
          </nav>
          <p className="eyebrow mt-8">無料セルフチェック</p>
          <h1 className="mt-4 text-3xl font-black leading-snug md:text-5xl md:leading-tight">
            経理、外に出すべき？
            <br />
            <span className="text-2xl md:text-4xl">5問でわかるセルフチェック</span>
          </h1>
          <p className="mt-6 text-sm leading-8 text-slate md:text-base">
            5つの問いに「はい」か「いいえ」で答えると、経理のうち外に出せる範囲の目安と、次に読む記事が出ます。
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["無料", "登録不要", "その場で結果", "答えは送信しません"].map((t) => (
              <span key={t} className="rounded-full bg-pulse/10 px-3 py-1 text-xs font-bold text-pulse">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 pt-4 md:pb-28">
        <div className="mx-auto max-w-3xl px-5">
          <KeiriCheck reads={reads} lawRead={postLink(LAW_READ)} />
          <p className="mt-10 text-xs leading-6 text-slate">
            答えはこの画面の中だけで使い、どこにも送信しません。個人情報の入力もありません。
          </p>
        </div>
      </section>
    </>
  );
}
