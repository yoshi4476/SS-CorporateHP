import Link from "next/link";
import { services, areas as PILLARS } from "@/lib/services";

// 事業の全体像（トップと事業一覧）。集客・経理と社内業務・補助金の3つの領域に事業を分け、
// 困りごと（各事業の challenges の先頭2つ）から効く事業へつなぐ。事業データから描くので、事業を足せば図も増える。
// 補助金は単独で使うものではなく、業務の仕組み（受発注・会計ソフトなど）の導入費用を下げるために使う
// （services.ts の ai-subsidy・system-development の本文）。その関係を補助金の行に書く。
// 以前は角丸のカード3枚を枝分かれの線でつないでいたが、帳簿の行のように罫で区切って並べる（DESIGN.md 6）。

export default function BusinessMap() {
  return (
    <figure aria-labelledby="business-map-caption" className="[word-break:auto-phrase]">
      <div className="border-b border-line">
        {PILLARS.map((p) => {
          const list = services.filter((s) => s.group === p.group);
          return (
            <section key={p.group} aria-label={p.name} className="grid gap-3 border-t border-ink py-6 md:grid-cols-[10rem_1fr] md:gap-6">
              <div>
                <h3 className="text-lg font-bold leading-snug">{p.name}</h3>
                <p className="mt-1 text-[13px] font-bold text-gold-deep">{p.purpose}</p>
              </div>
              <ul>
                {list.map((s) => (
                  <li key={s.slug} className="grid gap-2 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                    <div className="text-[15px] leading-[1.75] text-ink">
                      {s.challenges.slice(0, 2).map((c) => (
                        <p key={c}>「{c}」</p>
                      ))}
                    </div>
                    <p className="text-sm sm:text-right">
                      <span className="sr-only">効く事業：</span>
                      <Link href={`/services/${s.slug}`} className="link-u inline-flex min-h-11 items-center sm:min-h-0">
                        {s.name}
                      </Link>
                    </p>
                  </li>
                ))}
                {p.group === "資金" && (
                  <li className="mt-4 border-l-2 border-gold-bright pl-4 text-sm leading-7 text-slate">
                    <span className="font-bold text-ink">経理・社内業務の導入にも使える。</span>
                    受発注ソフト・会計ソフトなど、業務の仕組みの導入はAI導入補助金の対象になる場合があります。制度の相談・助言・伴走支援も、同じチームで行います。
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
      <figcaption id="business-map-caption" className="mt-4 text-[13px] leading-6 text-slate">
        事業の全体像。集客・経理と社内業務・補助金の3つの領域に{services.length}つの事業があり、よくある困りごとから効く事業へつないでいます。補助金は、経理・社内業務の仕組みを導入する費用を抑えるために使います。
      </figcaption>
    </figure>
  );
}
