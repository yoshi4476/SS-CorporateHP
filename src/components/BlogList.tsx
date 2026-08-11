"use client";

// 記事一覧: カテゴリで絞り込み、少しずつ表示する。
//
// 記事は毎日増えるため、全件をそのまま並べると探せなくなる。
// 絞り込みと段階表示はブラウザ側で完結させ、静的書き出しのままにしている。

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion";

export type ListItem = {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  date: string;
  dateLabel: string;
  readingMinutes: number;
  eyecatch?: string;
};

const PAGE = 6;

export default function BlogList({ items }: { items: ListItem[] }) {
  const [active, setActive] = useState<string>("all");
  const [shown, setShown] = useState(PAGE);

  // 件数は渡された記事から数える。先頭の1本は上で別に見せているため、
  // ページ側のカテゴリ件数をそのまま使うと合計が合わなくなる
  const tabs = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const p of items) {
      const cur = map.get(p.category);
      if (cur) cur.count++;
      else map.set(p.category, { slug: p.category, name: p.categoryName, count: 1 });
    }
    return [{ slug: "all", name: "すべて", count: items.length }, ...map.values()];
  }, [items]);

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((p) => p.category === active)),
    [items, active],
  );
  const visible = filtered.slice(0, shown);
  const rest = filtered.length - visible.length;

  const pick = (slug: string) => {
    setActive(slug);
    setShown(PAGE); // カテゴリを変えたら先頭から見せ直す
  };

  return (
    <>
      <div role="tablist" aria-label="カテゴリ" className="mt-8 flex flex-wrap gap-2">
        {tabs.map((c) => {
          const on = active === c.slug;
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => pick(c.slug)}
              className={`tap rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
                on
                  ? "border-pulse bg-pulse text-white"
                  : "border-line bg-raise text-ink hover:border-pulse hover:text-pulse"
              }`}
            >
              {c.name}
              <span className={`num ml-2 ${on ? "text-white/70" : "text-pulse"}`}>{c.count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.06}>
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
                    {p.dateLabel}
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

      {filtered.length === 0 && (
        <p className="mt-8 rounded-2xl border border-line bg-raise px-6 py-12 text-center text-sm text-slate">
          このカテゴリの記事はまだありません。
        </p>
      )}

      {rest > 0 && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="tap inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-3.5 text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
          >
            さらに表示
            <span className="num text-xs text-slate">残り{rest}本</span>
          </button>
        </div>
      )}
    </>
  );
}
