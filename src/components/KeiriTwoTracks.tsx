import Link from "next/link";
import { SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";

/**
 * 経理BPOの2つの頼み方を選ばせる区画。
 *
 * 「うちでやるか、任せるか」で迷っている人に、片方だけ見せると
 * 決められない。同じ画面に並べて、どちらが自社に合うかを比べさせる。
 * 「基盤」という社内向けの言い方は使わない。買う人には伝わらない。
 */

const TRACKS = [
  {
    key: "bpo",
    en: "Full Outsourcing",
    tag: "まるごと任せる",
    name: "経理BPO（記帳代行）",
    lead: "経理の実務ごと、当社が引き受けます。",
    body: "書類を送っていただければ、記帳から請求・支払・給与・年末調整まで当社が処理します。" +
      "担当者が辞めても、繁忙期でも止まりません。制度が変わったときの対応も当社側で行います。",
    fit: ["経理の担当者が1人、または不在", "採用しても続かない・引き継げない",
          "月次が締まるのが遅く、数字が見えない", "インボイスや電子帳簿保存法への対応が不安"],
    doing: ["書類を送る", "月次の報告を確認する"],
    ours: ["記帳・仕訳", "請求発行と入金消込", "支払データ作成", "給与・賞与・年末調整",
           "経費精算のチェック", "月次決算の早期化"],
    cta: { label: "無料の現状分析を申し込む", href: "/contact?s=keiri-bpo" },
    note: "まず何をどこまで出すかを決めるところからご相談ください。",
    video: "keiri-bpo",
    videoNote: "任せた場合に何がどう変わるかを、10分でご説明します",
  },
  {
    key: "self",
    en: "Self-Service",
    tag: "自社で使う",
    name: "経理システム（セルフ版）",
    lead: "同じシステムを、自社の経理担当者が使えます。",
    body: "当社が経理BPOで実際に使っているシステムを、そのままお使いいただけます。" +
      "受け取った書類から仕訳の案が出て、担当者が確認して確定する流れです。" +
      "自社に経理の方がいて、作業を速くしたい場合はこちらが向いています。",
    fit: ["経理の担当者がいて、作業を速くしたい", "外に出すほどの量ではない",
          "取引の中身を社内で把握しておきたい", "まず自社で試してから外注を考えたい"],
    doing: ["システムで確認して確定する", "月次を締める"],
    ours: ["仕訳の案を自動で作成", "請求と入金の消込", "支払管理", "給与・賞与・年末調整",
           "電子帳簿保存法に沿った保存", "導入時の初期設定と操作説明"],
    cta: { label: "デモを見てみる", href: "/contact?s=keiri-self" },
    note: "実際の画面をお見せします。ご契約前提のご案内ではありません。",
    video: "keiri-self",
    videoNote: "実際の画面で、どう使うかを10分でご説明します",
  },
];

export default function KeiriTwoTracks() {
  return (
    <section className="border-y border-line bg-mist py-16 md:py-24" id="two-tracks">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHead
          en="Two Ways"
          title="任せるか、自社で使うか。2つから選べます"
          lead="経理の悩みは会社によって違います。==実務ごと引き受ける形==と、==同じシステムを自社で使う形==の2つをご用意しました。どちらが合うかは、下の「向いている会社」でご確認ください。"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {TRACKS.map((t, i) => (
            <Reveal key={t.key} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-card md:p-9">
                <p className="font-data text-[0.62rem] uppercase tracking-[0.24em] text-pulse">
                  {t.en}
                </p>
                <div className="mt-3 flex flex-wrap items-baseline gap-3">
                  <span className="rounded-full bg-pulse px-3 py-1 text-[0.7rem] font-bold text-white">
                    {t.tag}
                  </span>
                  <h3 className="text-xl font-black md:text-2xl">{t.name}</h3>
                </div>
                <p className="mt-4 text-base font-bold leading-8 text-ink">{t.lead}</p>
                <p className="mt-2 text-sm leading-8 text-slate">{t.body}</p>

                <p className="mt-7 text-sm font-bold">向いている会社</p>
                <ul className="mt-2 grid gap-2">
                  {t.fit.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-7 text-slate">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 grid gap-5 rounded-2xl bg-mist p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.72rem] font-bold text-gold-deep">御社がすること</p>
                    <ul className="mt-2 grid gap-1.5">
                      {t.doing.map((d) => (
                        <li key={d} className="text-[0.82rem] leading-6 text-ink">{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[0.72rem] font-bold text-pulse">含まれるもの</p>
                    <ul className="mt-2 grid gap-1.5">
                      {t.ours.map((o) => (
                        <li key={o} className="text-[0.82rem] leading-6 text-slate">{o}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-7">
                  <p className="mb-2 text-[0.72rem] font-bold text-pulse">
                    動画で見る（約10分）
                  </p>
                  <video
                    controls
                    preload="none"
                    poster={`https://ai.7senses.co.jp/videos/${t.video}-poster.jpg`}
                    className="w-full rounded-2xl border border-line"
                  >
                    <source src={`https://ai.7senses.co.jp/videos/${t.video}.mp4`} type="video/mp4" />
                    お使いのブラウザでは動画を再生できません。
                  </video>
                  <p className="mt-2 text-xs text-ink-soft">{t.videoNote}</p>
                </div>

                <div className="mt-auto pt-7">
                  <Link
                    href={t.cta.href}
                    className="inline-block rounded-full bg-pulse px-8 py-4 text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    {t.cta.label} →
                  </Link>
                  <p className="mt-3 text-xs text-ink-soft">{t.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 rounded-3xl border border-line bg-white p-7 md:p-8">
            <h3 className="text-base font-bold md:text-lg">どちらか決められないとき</h3>
            <p className="mt-3 text-sm leading-8 text-slate">
              <strong>まず現状分析だけをお受けください。</strong>
              いまの経理業務のどこに時間がかかっているかを整理し、
              外に出したほうがよい範囲と、社内に残したほうがよい範囲をご提案します。
              無料で、ご契約を前提としたご案内ではありません。
              その結果を見てから、任せるか自社で使うかをお決めいただけます。
            </p>
            <Link
              href="/contact?s=keiri-shindan"
              className="mt-5 inline-block rounded-full border border-pulse px-7 py-3.5 text-sm font-bold text-pulse transition-colors hover:bg-pulse hover:text-white"
            >
              無料の現状分析を申し込む →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
