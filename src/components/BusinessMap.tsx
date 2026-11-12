import Link from "next/link";
import { Reveal } from "@/components/motion";
import { services, areas } from "@/lib/services";

// 事業の全体像（トップと事業一覧）。集客・経理と社内業務・補助金の3つの領域に事業を分け、
// 困りごと（各事業の challenges の先頭）から効く事業へ線を引く。事業データから描くので、事業を足せば図も増える。
// 補助金は単独で使うものではなく、業務の仕組み（受発注・会計ソフトなど）の導入費用を下げるために使う
// （services.ts の ai-subsidy・system-development の本文）。その関係だけを矢印で示す。集客の事業には引かない。
//
// focus（トップ）: 主力の経理BPOと集客（AIO・MEO）が分かるように、経理の領域を先に置き、主力の事業だけ塗りのボタンにする。
// ほかの事業は枠線のボタンで残す（入口は消さない）。一度この図をやめて主力2つのカードにしたが、比べた採点で
// 「困りごとから行き先へ振り分ける図」のほうが迷う経営者を導けると、2人とも前の形を選んだ。

const MAIN = ["keiri-bpo", "aio", "meo"];

export default function BusinessMap({ focus = false }: { focus?: boolean }) {
  // 経理を先にすると補助金の隣が集客になり、補助金から経理へ向ける矢印の行き先がずれる。その並びでは間の矢印を描かない
  const pillars = focus ? [...areas].sort((a, b) => Number(b.group === "業務") - Number(a.group === "業務")) : areas;
  const arrowToKeiri = pillars[1]?.group === "業務";
  return (
    <figure aria-labelledby="business-map-caption" className="[word-break:auto-phrase]">
      {/* 頂点: ひとつのチーム。パソコンでは3つの領域へ枝分かれする線を引く */}
      <Reveal className="flex justify-center">
        <p className="rounded-full bg-ink px-6 py-2.5 text-center text-sm font-bold text-white shadow-lift">
          {services.length}つの事業を、ひとつのチームで
        </p>
      </Reveal>
      <div aria-hidden className="relative mx-auto hidden h-10 lg:block">
        <span className="absolute left-1/2 top-0 h-5 w-px bg-line-strong" />
        <span className="absolute left-[16.667%] right-[16.667%] top-5 h-px bg-line-strong" />
        {["16.667%", "50%", "83.333%"].map((x) => (
          <span key={x} className="absolute top-5 h-5 w-px bg-line-strong" style={{ left: x }} />
        ))}
      </div>

      <ul className="mt-5 grid gap-5 lg:mt-0 lg:grid-cols-3">
        {pillars.map((p, pi) => {
          const list = services.filter((s) => s.group === p.group);
          const hasMain = focus && list.some((s) => MAIN.includes(s.slug));
          return (
            <li key={p.group} className="min-w-0">
              <Reveal
                delay={pi * 0.08}
                className={`relative flex h-full flex-col rounded-3xl border bg-raise p-6 shadow-card md:p-7 ${hasMain ? "border-pulse/35" : "border-line"}`}
              >
                {hasMain && <p className="mb-3 w-fit rounded-full bg-pulse/10 px-3 py-1 text-xs font-bold text-pulse">主力の事業</p>}
                <h3 className="text-xl font-black leading-snug md:text-2xl">{p.name}</h3>
                <p className="mt-1 text-sm font-bold text-gold-deep">{p.purpose}</p>
                <p aria-hidden className="mt-5 flex items-center justify-between border-b border-line pb-2 text-xs font-bold text-slate">
                  <span>こんな困りごとに</span>
                  <span>効く事業</span>
                </p>
                <ul className="mt-1 grid">
                  {list.map((s) => {
                    const strong = !focus || MAIN.includes(s.slug);
                    return (
                      <li key={s.slug} className="border-b border-line py-4 last:border-b-0">
                        <p className={`text-sm leading-7 text-ink ${focus && strong ? "font-bold" : ""}`}>「{s.challenges[0]}」</p>
                        {/* 困りごとから事業へ、鉤形の線でつなぐ */}
                        <p className="mt-2 flex items-center justify-end gap-2">
                          <span aria-hidden className="h-4 w-6 rounded-bl-lg border-b border-l border-line-strong" />
                          <span className="sr-only">効く事業：</span>
                          <Link
                            href={`/services/${s.slug}`}
                            data-cta={focus ? `top_map_${s.slug}` : undefined}
                            className={
                              strong
                                ? "inline-flex items-center gap-1.5 rounded-full bg-pulse px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-pulse-deep"
                                : "inline-flex items-center gap-1.5 rounded-full border border-pulse/40 bg-white px-4 py-2 text-[13px] font-bold text-pulse transition-colors hover:border-pulse"
                            }
                          >
                            {s.name}
                            <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden>
                              <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                            </svg>
                          </Link>
                        </p>
                      </li>
                    );
                  })}
                </ul>
                {p.group === "資金" && (
                  <div className="mt-auto rounded-2xl border border-gold/30 bg-gold-tint p-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-gold-deep">
                      {arrowToKeiri && (
                        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden className="shrink-0 rotate-[-90deg] lg:rotate-0">
                          <path d="M16 6H3M7 1.5L2.5 6 7 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      経理・社内業務の導入にも使える
                    </p>
                    <p className="mt-2 text-sm leading-7 text-ink">
                      受発注ソフト・会計ソフトなど、業務の仕組みの導入はAI導入補助金の対象になる場合があります。制度の相談・助言・伴走支援も、同じチームで行います。
                    </p>
                  </div>
                )}
                {/* パソコンでは、補助金の枠から経理・社内業務の枠へ向かう矢印を、間の溝に描く */}
                {p.group === "資金" && arrowToKeiri && (
                  <svg aria-hidden width="26" height="14" viewBox="0 0 26 14" className="absolute -left-[23px] bottom-16 hidden text-gold lg:block">
                    <path d="M25 7H4M9 2L3 7l6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>
      <figcaption id="business-map-caption" className="mt-5 text-sm leading-7 text-slate">
        {focus
          ? `事業の全体像。主力は経理BPO・記帳代行と、集客のAIO運用代行・MEO運用代行です。よくある困りごとから効く事業へ線を引いています。補助金は、経理・社内業務の仕組みを導入する費用を抑えるために使います。`
          : `事業の全体像。集客・経理と社内業務・補助金の3つの領域に${services.length}つの事業があり、よくある困りごとから効く事業へ線を引いています。補助金は、経理・社内業務の仕組みを導入する費用を抑えるために使います。`}
      </figcaption>
    </figure>
  );
}
