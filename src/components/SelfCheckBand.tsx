import Link from "next/link";
import { diagnostics } from "@/lib/aio";
import AioScan from "@/components/AioScan";
import InlineToolBox from "@/components/InlineToolBox";
import { SectionHead } from "@/components/ui";

// 無料セルフチェックへの誘導（トップの「相談」の段の最初）。
// 「無料相談」はハードルが高いが、その場で終わる自己診断なら踏み出せる。
// 検索での表示の約8割は経理ブログの記事（GSC の page 次元で84%・2026-10）なので、経理のチェックを先頭に置く。
// AI集客ラボの診断（Web集客・AI検索）はその後ろにまとめる。
// 以前は紺の面に光のぼかし・夜のオフィスの生成写真・番号つきのカードを並べていた。罫で区切った行にする。

export default function SelfCheckBand() {
  return (
    <section id="selfcheck" className="scroll-mt-32 py-20 md:py-32 xl:py-36" aria-labelledby="selfcheck-heading">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHead
              id="selfcheck-heading"
              title="相談の前に、現在地を確かめる"
              lead="いきなり相談するのは気が重いものです。まずはご自身で、いまの状態を確認してください。**登録は不要、その場で結果が出ます。**"
            />
            <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[13px] font-bold text-slate">
              <span>登録不要</span>
              <span>その場で結果</span>
              <span>費用なし</span>
            </p>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-8 lg:pt-8">
          <h3 className="text-sm font-bold text-gold-deep">経理</h3>
          <InlineToolBox from="/" place="top" flush />

          <h3 className="mt-12 text-sm font-bold text-slate">Web集客・AI検索（運営メディア「AI集客ラボ」の診断）</h3>
          <div className="mt-3 border-t border-ink py-6">
            <p className="text-lg font-bold">
              URL診断（サイトの14項目を採点）
              <span className="ml-3 inline-block align-middle text-[13px] font-normal text-slate">URL入力だけ・14項目</span>
            </p>
            <p className="mb-5 mt-2 text-[15px] leading-7 text-slate">AIと検索にサイトが読まれているかを100点満点で採点し、直す順番まで出します。</p>
            <AioScan src="corp_top_selfcheck" />
          </div>
          <ul className="border-b border-line">
            {diagnostics.map((d) => (
              <li key={d.name} className="border-t border-line">
                <a href={d.href} target="_blank" rel="noopener" className="group block py-5">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[17px] font-bold text-pulse underline decoration-1 underline-offset-[0.35em] group-hover:decoration-2">
                      {d.name} ↗
                    </span>
                    <span className="text-[13px] text-slate">{d.spec}</span>
                  </span>
                  <span className="mt-1.5 block max-w-[40em] text-[15px] leading-7 text-slate">{d.body}</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm leading-7 text-slate">
            簡易的なチェックのため、正確な情報や詳しい内容をお知りになりたい方は
            <Link href="/contact" className="link-u mx-1">
              無料相談
            </Link>
            をご利用ください。現状分析レポートをお渡しします。
          </p>
        </div>
      </div>
    </section>
  );
}
