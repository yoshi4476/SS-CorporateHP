import Link from "next/link";
import { Reveal } from "@/components/motion";
import { diagnostics } from "@/lib/aio";
import InlineToolBox from "@/components/InlineToolBox";
import PhotoSlot from "@/components/PhotoSlot";

// 無料セルフチェックへの誘導。
// 「無料相談」はハードルが高いが、その場で終わる自己診断なら踏み出せる。
// 検索での表示の約8割は経理ブログの記事（GSC の page 次元で84%・2026-10）なので、経理のチェックを主役にする。
// 以前は経理の5問・URL診断・診断の道具4つ以上を同じ大きさの箱で並べ、どれを押せばいいか決まらなかった。
// AI集客ラボの診断（Web集客・AI検索）は「ほかの無料診断」として文字のリンクにまとめる（入口は残す）。

const URL_SCAN = "https://ai.7senses.co.jp/lp/?src=corp_top_selfcheck";

const OTHERS: { name: string; spec: string; href: string }[] = [
  { name: "URL診断（サイトの14項目を採点）", spec: "URL入力だけ", href: URL_SCAN },
  ...diagnostics.map((d) => ({ name: d.name, spec: d.spec, href: d.href })),
];

export default function SelfCheckBand() {
  return (
    <section id="selfcheck" data-area="セルフチェック" data-area-id="selfcheck" className="relative scroll-mt-24 overflow-hidden border-y border-line bg-ink" aria-labelledby="selfcheck-heading">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at 82% 15%, rgb(28 63 124 / 0.55), transparent 62%), radial-gradient(ellipse 45% 60% at 10% 92%, rgb(116 199 214 / 0.12), transparent 62%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <p className="eyebrow !text-aqua">無料セルフチェック</p>
            <h2 id="selfcheck-heading" className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
              相談の前に、
              <br />
              現在地を確かめる。
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.9] text-white/75 md:text-base">
              いきなり相談するのは気が重いものです。まずはご自身で、いまの状態を確認してください。
              <strong className="font-bold text-white">登録は不要で、その場で結果が出ます。</strong>
            </p>
            {/* 写真の枠（ファイルを置くとパソコンで出る。lib/photoSlots.ts） */}
            {/* 右の列（チェックと文字のリンク）と高さがそろうよう、写真は少し横長に切る */}
            <PhotoSlot name="top-selfcheck" sizes="560px" ratioClass="aspect-[16/10]" className="mt-10 hidden rounded-3xl ring-1 ring-white/10 lg:block" />
          </div>

          <div>
            <Reveal delay={0.04}>
              <InlineToolBox from="/" place="top" tone="dark" />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 border-t border-white/15 pt-7">
                <p className="text-sm font-bold text-white">ほかの無料診断</p>
                <p className="mt-1 text-[13px] leading-6 text-white/60">Web集客・AI検索の診断です（運営メディア「AI集客ラボ」で開きます）。</p>
                <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {OTHERS.map((d) => (
                    <li key={d.name} className="text-sm leading-6">
                      <a
                        href={d.href}
                        target="_blank"
                        rel="noopener"
                        className="font-bold text-white underline decoration-white/30 underline-offset-4 hover:text-aqua hover:decoration-aqua"
                      >
                        {d.name} ↗
                      </a>
                      <span className="mt-0.5 block text-xs text-white/55">{d.spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-8 text-sm leading-7 text-white/60">
                簡易的なチェックのため、正確な情報や詳しい内容をお知りになりたい方は
                <Link href="/contact" className="mx-1 font-bold text-aqua underline-offset-4 hover:underline">
                  無料相談
                </Link>
                をご利用ください。現状分析レポートをお渡しします。
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
