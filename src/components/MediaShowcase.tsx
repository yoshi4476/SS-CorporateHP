import Link from "next/link";
import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";

/**
 * 紹介動画・資料説明動画・サービス資料をひとまとめにした区画。
 * 動画2本を横並びのカードにし、資料は全幅の帯でめくれるようにする。
 * 縦に大きな動画を3つ積むと画面を何枚分も占領して読み飛ばされるため、
 * 「まず2本を見比べて選ぶ → 資料で確かめる → 相談」の順に圧縮した。
 * 動画・画像はAI集客ラボ側で配信している（CSPで許可済み）。
 * 料金スライドは資料に含まれない（画像の書き出し段階で除外済み）。
 */
export default function MediaShowcase() {
  return (
    <section className="border-y border-line bg-mist py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHead
          en="Movie & Document"
          title="動画と資料で、仕組みを先にご確認ください"
          lead="実際の画面で、記事ができて公開されるまでをご覧いただけます。==人が決めることと、機械に任せることの分担==まで説明しています。ご相談の前に、この場で中身を確かめられます。"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-5 shadow-card md:p-6">
              <p className="font-data text-[0.65rem] uppercase tracking-[0.26em] text-pulse">Movie 01</p>
              <h3 className="mt-2 text-lg font-black leading-snug">10分で分かる、AIで集客する仕組み</h3>
              <p className="mb-4 mt-1 text-xs leading-6 text-ink-soft">
                なぜ今AI検索なのか、市場の変化から。実際の制作画面つき
              </p>
              <video
                controls
                preload="none"
                poster="https://ai.7senses.co.jp/videos/aio-pr-poster.jpg"
                className="mt-auto w-full rounded-2xl border border-line"
              >
                <source src="https://ai.7senses.co.jp/videos/aio-pr.mp4" type="video/mp4" />
                お使いのブラウザでは動画を再生できません。
              </video>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-5 shadow-card md:p-6">
              <p className="font-data text-[0.65rem] uppercase tracking-[0.26em] text-pulse">Movie 02</p>
              <h3 className="mt-2 text-lg font-black leading-snug">サービス資料を6分でご説明</h3>
              <p className="mb-4 mt-1 text-xs leading-6 text-ink-soft">
                下の資料をスライドに沿って解説。お急ぎの方はこちらから
              </p>
              <video
                controls
                preload="none"
                poster="https://ai.7senses.co.jp/videos/doc-guide-poster.jpg"
                className="mt-auto w-full rounded-2xl border border-line"
              >
                <source src="https://ai.7senses.co.jp/videos/doc-guide.mp4" type="video/mp4" />
                お使いのブラウザでは動画を再生できません。
              </video>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <div className="mt-6 rounded-3xl border border-line bg-white p-5 shadow-card md:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="font-data text-[0.65rem] uppercase tracking-[0.26em] text-pulse">Document</p>
                <h3 className="mt-2 text-lg font-black leading-snug">サービス資料（全15枚）</h3>
              </div>
              <p className="text-xs text-ink-soft">横にスクロールしてページをめくれます →</p>
            </div>
            <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
              {Array.from({ length: 15 }, (_, i) => {
                const n = String(i + 1).padStart(2, "0");
                return (
                  <img
                    key={n}
                    src={`https://ai.7senses.co.jp/images/proposal/p${n}.jpg`}
                    alt={`サービス資料 ${i + 1}ページ目`}
                    width={1600}
                    height={1131}
                    loading={i < 2 ? "eager" : "lazy"}
                    className="w-[78%] max-w-[520px] shrink-0 snap-center rounded-xl border border-line"
                  />
                );
              })}
            </div>
          </div>
        </Reveal>
        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-block rounded-full bg-pulse px-9 py-4 text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            この内容で相談してみる →
          </Link>
          <p className="mt-3 text-xs text-ink-soft">
            料金は御社の状況に合わせてお見積りします。営業のお電話はいたしません。
          </p>
        </div>
      </div>
    </section>
  );
}
