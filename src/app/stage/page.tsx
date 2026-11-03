import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import { SectionHead, FaqList } from "@/components/ui";
import DeveloperCredit from "@/components/DeveloperCredit";
import { creatorLd } from "@/lib/developer";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

// 先行受付の段階（2026-11-03 運用者の決定）。提供を始める前なので、機能は「予定」、価格は「予定の価格」と書き、
// 申し込みではなく受付にする。価格と機能は開発元の設計書（STAGE_CMS の docs/PRICING.md・要件 v1）の値。
// 提供を始めたら、この段落・EARLY の文言・構造化データの availability を直す
const NAME = "STAGE";
const PATH = "/stage";
const CONTACT = "/contact?s=stage";

const FEATURES = [
  { title: "今のホームページを、そのまま取り込みます", body: "作り直しは要りません。当社が今のホームページを取り込み、デザインはそのままで更新できるようにします。" },
  { title: "直したい所を、画面の上で書き換えます", body: "ホームページの見た目のまま、直したい所を押して文字を入れるだけです。専門の言葉は使いません。" },
  { title: "許可された所だけが変えられ、デザインは崩れません", body: "変えられる所は当社が決めて開けます。お知らせや写真は変えられて、レイアウトは崩れない作りです。" },
  { title: "写真は、入れるだけで整います", body: "スマホで撮った写真もそのまま入れられます。大きさと形を枠に合わせて自動で整え、軽くして表示します。" },
  { title: "公開の前に確かめ、すぐ元に戻せます", body: "変える前と後を見比べてから公開します。公開した後も、変更の履歴からひと押しで元に戻せます。" },
  { title: "困ったときは、画面の中で解決できます", body: "そのホームページ専用の使い方の案内と、画面の中のヘルプを用意します。" },
];

// 税込を主に、税抜を添える（開発元の料金表 2-1 の値。本番の値は提供開始のときに確かめ直す）
const PLANS = [
  // 更新できる所・編集する人の数は、開発元の料金表 3章（機能とプランの対応表）の値
  { name: "Lite", month: "3,278円", monthEx: "2,980円", year: "32,780円", pages: "10ページまで", editors: "1人",
    scope: "お知らせの追加・編集、写真の差し替え" },
  { name: "Standard", month: "6,578円", monthEx: "5,980円", year: "65,780円", pages: "20ページまで", editors: "3人",
    scope: "Lite に加え、文章・営業時間・連絡先、メニューや料金表・スタッフ・よくある質問、写真の一覧、下書きと予約の公開", pick: true },
  { name: "Pro", month: "10,780円", monthEx: "9,800円", year: "107,800円", pages: "50ページまで", editors: "10人",
    scope: "Standard に加え、ブログ、ページの追加、並び替え、お問い合わせのフォーム" },
  { name: "Enterprise", month: "21,780円〜", monthEx: "19,800円〜", year: "217,800円〜", pages: "個別", editors: "無制限",
    scope: "Pro に加え、公開の前の承認の流れなど。内容は個別に決めます" },
];

const FAQ = [
  { q: "STAGE とは何ですか？", a: "今お使いのホームページを当社が取り込み、お客様は許可された箇所だけを、迷わず・壊さずに更新できるホームページ更新サービスです。" },
  { q: "今すぐ使えますか？", a: "いまは提供開始の前で、関心のある方の先行受付をしています。提供を始める時期と内容は、受付をいただいた方へ先にご連絡します。" },
  { q: "ホームページを作り直す必要はありますか？", a: "ありません。今のホームページを取り込み、デザインはそのままで更新できるようにします。取り込めるのは、ご自身が持ち主であることを確かめられたサイトだけです。" },
  { q: "料金はいくらですか？", a: "予定の価格は、月額 3,278円（税込）からです。自動で取り込めるホームページは初期費用 0円の予定です。価格は提供開始までに変わることがあります。" },
  { q: "開発したのは誰ですか？", a: "YW（CONFLUX PARTNERS）が開発し、セブンセンシズ株式会社が提供します。" },
];

const DESCRIPTION =
  "今のホームページを取り込み、許可された箇所だけを迷わず・壊さずに更新できる店舗・中小企業向けのホームページ更新サービスです。いまは提供開始の前の先行受付です。予定の価格は月額3,278円（税込）からです。";

export const metadata: Metadata = pageMeta({
  title: `${NAME}｜ホームページ更新サービス（先行受付）`,
  description: DESCRIPTION,
  path: PATH,
});

export default function StagePage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: NAME,
    serviceType: "ホームページ更新サービス（SaaS）",
    provider: { "@id": `${site.url}/#organization` },
    creator: creatorLd("stage"),
    areaServed: "JP",
    description: DESCRIPTION,
    url: `${site.url}${PATH}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "JPY",
      lowPrice: "3278",
      availability: "https://schema.org/PreOrder",
      description: "予定の価格（税込・月額）。提供開始の前の先行受付",
    },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <JsonLd
        data={[
          serviceLd,
          faqLd,
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "事業内容", path: "/services" },
            { name: NAME, path: PATH },
          ]),
        ]}
      />

      {/* 看板 */}
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 md:pb-20 md:pt-16">
          <Reveal>
            <nav aria-label="パンくずリスト" className="text-xs text-slate">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="tap hover:text-pulse">トップ</Link></li>
                <li aria-hidden>/</li>
                <li><Link href="/services" className="tap hover:text-pulse">事業内容</Link></li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-ink">{NAME}</li>
              </ol>
            </nav>
          </Reveal>
          <div className="mt-8 max-w-3xl">
            <Reveal>
              <p className="eyebrow">ホームページ更新サービス・先行受付</p>
              <h1 className="mt-4 text-[8vw] font-black leading-[1.24] tracking-tight sm:text-5xl md:text-[3.2rem]">
                ホームページの更新を、
                <br />
                <span className="text-pulse">迷わず・壊さずに。</span>
              </h1>
              <p className="mt-7 text-[15px] leading-[1.9] text-slate md:text-base md:leading-9">
                {NAME}
                は、今お使いのホームページを当社が取り込み、お客様は許可された箇所だけを、迷わず・壊さずに更新できるサービスです。目指しているのは、IT
                に詳しくないお店の方が、説明書を読まずに3分でお知らせを更新できることです。
              </p>
              <p className="mt-6 rounded-2xl border border-gold/25 bg-gold-tint px-6 py-4 text-sm font-bold leading-7 text-ink">
                いまは提供開始の前です。関心のある方の先行受付をしています。提供を始める時期と内容は、受付をいただいた方へ先にご連絡します。
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={CONTACT}
                  className="rounded-full bg-pulse px-10 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
                >
                  先行受付に申し込む（無料）
                </Link>
                <a
                  href="#price"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-8 py-4 text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
                >
                  予定の価格を見る
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* できること */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead title="STAGE でできること（予定）" lead="機能は、提供開始までに変わることがあります。" />
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <li className="h-full rounded-2xl border border-line bg-paper p-6">
                  <h3 className="text-base font-black leading-snug text-ink">{f.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate">{f.body}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 予定の価格 */}
      <section id="price" className="scroll-mt-24 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            title="予定の価格"
            lead="税込の価格です（かっこ内は税抜）。価格は、提供開始までに変わることがあります。"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl border p-6 ${p.pick ? "border-pulse bg-paper shadow-glow" : "border-line bg-paper"}`}
              >
                <p className="text-sm font-black text-ink">
                  {p.name}
                  {p.pick && <span className="ml-2 rounded-full bg-pulse px-2 py-0.5 text-[11px] text-white">おすすめ</span>}
                </p>
                <p className="mt-4">
                  <span className="num text-3xl font-black text-ink">{p.month}</span>
                  <span className="ml-1 text-xs text-slate">/月（税抜 {p.monthEx}）</span>
                </p>
                <p className="mt-2 text-xs text-slate">年払い {p.year}（2か月分お得）</p>
                <ul className="mt-5 grid gap-2 text-sm leading-6 text-slate">
                  <li>更新できる所: {p.scope}</li>
                  <li>ページ数: {p.pages}</li>
                  <li>編集する人: {p.editors}</li>
                </ul>
              </div>
            ))}
          </div>
          <ul className="mt-8 grid gap-2 text-sm leading-7 text-slate">
            <li>・初期費用: 自動で取り込めるホームページは 0円の予定です。自動で取り込みにくいホームページは、取り込みの代行をお見積りします。</li>
            <li>・最低の契約期間はない予定です（月払いのとき）。14日間の無料のお試しを予定しています。</li>
            <li>・オプション（Google ビジネスプロフィール・SNS・LINE との連携など）は、提供開始のときにご案内します。</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-line bg-mist py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5">
          <SectionHead title="よくある質問" />
          <div className="mt-10">
            <FaqList items={FAQ} />
          </div>
        </div>
      </section>

      {/* 受付 */}
      <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
        <div aria-hidden className="grid-field-dark absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <h2 className="text-2xl font-black leading-snug md:text-4xl">提供開始のご案内を、先にお送りします。</h2>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[1.9] text-paper/70 md:text-base">
              先行受付は無料です。今のホームページで使えるかのご相談もお受けします。
            </p>
            <div className="mt-10">
              <Link
                href={CONTACT}
                className="rounded-full bg-gold-bright px-12 py-4 text-base font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                先行受付に申し込む（無料）
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <DeveloperCredit product="stage" />
    </>
  );
}
