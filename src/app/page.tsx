import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SplitText from "@/components/SplitText";
import HeroVideo, { HeroBand } from "@/components/HeroVideo";
import TopBusinesses from "@/components/TopBusinesses";
import PhotoSlot, { hasSlot } from "@/components/PhotoSlot";
import type { PhotoSlotName } from "@/lib/photoSlots";
import NumberWall from "@/components/NumberWall";
import GrowthChart from "@/components/GrowthChart";
import SelfCheckBand from "@/components/SelfCheckBand";
import DevPartnerBand from "@/components/DevPartnerBand";
import JsonLd from "@/components/JsonLd";
import { IndustryBars, GaugeDonut, RankTable } from "@/components/charts";
import { Reveal } from "@/components/motion";
import { SectionHead, FlowSteps, FaqList, CtaBand } from "@/components/ui";
import { news } from "@/lib/news";
import { cases } from "@/lib/cases";
import { faqSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  // og:url が無く、共有・監査でトップのURLが分からなかった（Ahrefs 2026-09-29: OGP不完全）。
  // openGraph は浅くマージされるので、layout.tsx の値を持ち越したうえで url だけ足す
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: site.name,
    url: site.url,
    images: [{ url: "/ogp.png", width: 1200, height: 630 }],
  },
};

const TOP_FAQ = [
  {
    q: "大阪以外の企業でも依頼できますか?",
    a: "可能です。打ち合わせはオンラインで完結できるため、全国の企業・店舗をご支援しています。",
  },
  {
    q: "相談は本当に無料ですか?",
    a: "初回相談・現状診断は無料です。診断の結果、当社のサービスが不要と判断した場合は正直にそうお伝えします。",
  },
  {
    q: "AIO対策とは何ですか?",
    a: "AIO(AI最適化)とは、ChatGPTやAI Overviewsなど生成AIの回答に自社の情報が引用・推薦されるよう最適化する、SEO・MEOに続く新しい検索対策です。当社は構造化データの実装から引用されるコンテンツ設計、AI検索での言及モニタリングまでを一貫して提供しています。",
  },
  {
    q: "どのサービスから始めればよいか分かりません。",
    a: "無料相談で現状を伺い、費用対効果の高い順に優先度をつけてご提案します。すべてを一度に始める必要はありません。",
  },
  {
    q: "費用はどのくらいかかりますか?",
    a: "サービスと規模により異なります。AI導入補助金など、負担を抑える制度の活用もあわせてご提案します。",
  },
];

const COMPARE_ROWS: { label: string; seo: string; meo: string; aio: string }[] = [
  { label: "対策する場所", seo: "検索結果ページ", meo: "Googleマップ", aio: "AIの回答文" },
  { label: "ユーザーの行動", seo: "検索して比較する", meo: "近くの店舗を探す", aio: "AIに直接質問する" },
  { label: "目指す状態", seo: "検索上位に表示", meo: "地図上位で来店獲得", aio: "AIに引用・推薦される" },
  { label: "評価の軸", seo: "被リンク・コンテンツ品質", meo: "口コミ・情報の充実度", aio: "一次情報・構造化・実在性" },
  { label: "当社の対応", seo: "HP制作・メディア運用", meo: "運用代行(2,000件以上)", aio: "AIO運用代行" },
];

// 支援している業種。以前は最初の画面の下の帯に22個並べていたが、見出しとボタンの邪魔をしていたので事業の区画の下へ移した
const INDUSTRIES = [
  "歯科医院", "クリニック", "整骨院・接骨院", "介護", "不動産", "工務店・注文住宅", "リフォーム", "建設",
  "士業", "コンサル", "BtoB・SaaS", "IT企業", "製造業", "卸売業", "物流", "飲食店", "美容室", "小売",
  "ホテル・旅館", "フィットネス", "教室・スクール", "EC", "その他の業種も全国対応",
];

// 事例の写真の枠（前回外した写真の場所）。業種ごとに1枠
const CASE_SLOT: Record<string, PhotoSlotName> = { 士業事務所: "case-shigyou", リフォーム業: "case-reform", 製造業: "case-seizou" };

// 相談への主のボタン。暗い面でも明るい面でも同じ色にする（ページごとに紺・黒・橙と色が違い、どれが主か分からなかった）
const PRIMARY = "rounded-full bg-gold-bright px-9 py-4 text-center text-sm font-bold text-ink shadow-lift transition-transform hover:-translate-y-0.5";

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

// 並びは1本の筋にしている: 誰の話か → 困りごとと効く事業 → 集客で起きている変化 → 当社のやり方と数字 →
// 実践データ → 事例 → 誰がやるか → 進め方 → 費用を抑える制度 → よくある質問 → 相談の手前の入口 → 相談
export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(TOP_FAQ)} />

      {/* 1. 誰の話か。最初の画面は見出し・主のボタン1つ・用件別のリンク・数字だけ。
          以前は右下に切り替わる案内板、下に業種22個の帯があり、押す所が散っていた */}
      <section data-drone-zone data-area="メインビジュアル" data-area-id="hero" className="relative flex flex-col overflow-hidden bg-ink text-white md:min-h-svh">
        <HeroVideo objectPosition="100% 20%" />
        {/* 読みやすさの覆い: 見出しのある左と、ヘッダーのある上だけを暗くし、右の人物は見せる（写真を敷くのはパソコンだけ） */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgb(8 14 26 / 0.9) 0%, rgb(8 14 26 / 0.78) 34%, rgb(8 14 26 / 0.3) 58%, rgb(8 14 26 / 0.05) 78%), linear-gradient(180deg, rgb(8 14 26 / 0.78) 0%, rgb(8 14 26 / 0.45) 9%, transparent 22%)",
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-5 pb-12 pt-24 md:pb-20 md:pt-28">
          <div className="w-full min-w-0 max-w-2xl">
            {/* 集客も社内業務も補助金も、全部「人を増やさずに回す」ための手段なので、そこを見出しに出す。
                スマホは「集客も経理も回す。」が最長で折り返せない。320px でも1行に収まる値を画面幅から逆算している */}
            <h1 className="text-[8vw] font-black leading-[1.24] tracking-tight [text-shadow:0_2px_30px_rgb(0_0_0/0.35)] sm:text-5xl md:text-[2.9rem] lg:text-[3.9rem] xl:text-[4.3rem]">
              <SplitText text="人を増やさずに、" />
              <br />
              <SplitText text="集客も経理も回す。" className="text-aqua" startIndex={8} />
            </h1>
            {/* トップに来る人の大半は社名の検索（GSC・2026年10月・日本: トップの表示1,089回のうち「セブンセンシズ」を含む語が1,083回）で、
                用件は人によって違う。一方で検索から来る人の用件は経理（ページ別の表示5,714回のうち記事が3,982回・約7割）。最初の一文で経理BPOを先に名指しし、
                他の用件は1行で分ける */}
            <p className="mt-6 max-w-lg text-[15px] leading-[1.9] text-white/85 md:mt-7 md:text-base">
              経理・記帳の代行（経理BPO）、AI検索・MEOでの集客、補助金の活用までを、ひとつのチームで引き受ける大阪の会社です。
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center md:mt-10">
              <Link href="/contact" className={PRIMARY}>
                無料相談を予約する
              </Link>
            </div>
            <p className="mt-5 text-[13px] leading-7 text-white/75">
              ご用件別:
              <Link href="/services/keiri-bpo" data-cta="top_hero_keiri-bpo" className="mx-1.5 inline-block font-bold text-white underline decoration-white/40 underline-offset-4 hover:text-aqua">
                経理・記帳を任せたい
              </Link>
              ／
              <Link href="/services/aio" data-cta="top_hero_aio" className="mx-1.5 inline-block font-bold text-white underline decoration-white/40 underline-offset-4 hover:text-aqua">
                集客（AI検索・MEO）
              </Link>
              ／
              <Link href="/services/ai-subsidy" data-cta="top_hero_ai-subsidy" className="mx-1.5 inline-block font-bold text-white underline decoration-white/40 underline-offset-4 hover:text-aqua">
                補助金
              </Link>
            </p>
            {/* スマホは写真を文字の背景にせず、ここに帯で出す（人物が画面の外に出ないように） */}
            <HeroBand />
            {/* 数字は最初から確定の値で出す。0から数え上げると、途中で撮られた画面や読み込みの遅い端末で 3,196 のような別の数字に見えた */}
            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-white/20 pt-5 md:mt-10">
              {[
                { n: "3,200", unit: "件", label: ["AIO・SEO・MEOの", "累計支援"] },
                // 以前は補助金の上限額（350万円）を置いていたが、制度の額で当社の実績ではない。経理BPOの実績に替えた（first_party_facts の keiri-bpo-10）
                { n: "48", unit: "社", label: ["経理・記帳の", "代行を担当"] },
                // 以前は「7事業」。事業の数を最初に出すと何でも屋に見えたので、経理代行の継続中の社数（同じ keiri-bpo-10 の 48社のうち31社）にした
                { n: "31", unit: "社", label: ["うち", "継続中の会社"] },
              ].map((s) => (
                <div key={s.n} className="flex flex-col">
                  {/* スマホの3列では語の途中で折れていた（「通算支/援」）。折れる位置を決めておく */}
                  <dt className="order-last mt-2 text-xs leading-5 text-white/75">
                    {s.label.map((l) => (
                      <span key={l} className="inline-block">{l}</span>
                    ))}
                  </dt>
                  <dd className="num text-2xl font-bold leading-none md:text-3xl">
                    {s.n}
                    <span className="ml-0.5 text-sm text-aqua">{s.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <p className="absolute bottom-3 left-8 z-10 hidden text-[11px] text-white/70 md:block">※ 写真はイメージです</p>
      </section>

      {/* 2. 何をする会社か。主役の2つ（経理BPO・集客）を大きく、そのほかは控えめに。
          以前は7つの事業を同じ大きさの丸ボタンで並べた図（BusinessMap・事業一覧のページでは使う）で、何でも屋に見えた */}
      <section id="services" data-area="事業" data-area-id="services" className="scroll-mt-24 border-b border-line bg-mist py-16 md:py-24" aria-labelledby="services-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            id="services-heading"
            title="主な仕事は、経理の代行と集客の2つです"
            lead="どちらも、人を増やさずに会社を回すための仕事です。AIの導入やシステム開発、HP制作、補助金の申請支援は、この2つを支える事業として==同じ窓口でお受けします==。"
          />
          <div className="mt-12">
            <TopBusinesses />
          </div>
          <Reveal delay={0.1}>
            <div className="mt-10 border-t border-line pt-6">
              <p className="text-xs font-bold text-slate">対応している業種</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {INDUSTRIES.map((m) => (
                  <li key={m} className="whitespace-nowrap text-[13px] leading-6 text-slate">{m}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl bg-ink p-8 text-white md:flex-row md:items-center md:p-10">
              <p className="text-2xl font-black leading-snug md:text-3xl">どれから始めるかは、無料相談で一緒に決めます。</p>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/contact" className={`inline-flex items-center justify-center gap-3 ${PRIMARY}`}>
                  相談してみる
                  <Arrow />
                </Link>
                <Link href="/services" className="tap gap-2 text-sm font-bold text-white underline decoration-white/40 underline-offset-4 hover:text-aqua">
                  事業内容の一覧を見る
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. いま集客で起きている変化（なぜ今か） */}
      <section id="aio" data-area="AI検索対策" data-area-id="aio" className="relative scroll-mt-24 overflow-hidden py-16 md:py-24" aria-labelledby="aio-heading">
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <SectionHead
              id="aio-heading"
              title="ユーザーは、Googleで調べる前にAIに聞き始めています"
              lead="ユーザーはGoogleで調べる前に、ChatGPTに聞き始めています。SEO・MEOに続く第三の検索対策「AIO(AI最適化)」に、==いま着手する企業が次の集客を制します==。"
            />
            {/* 以前は机で話す2人の写真だった。この節の主張（AIの答えの中に社名が出る）をそのまま描いた図に替えた */}
            <Reveal delay={0.1} className="hidden sm:block">
              <figure className="overflow-hidden rounded-3xl border border-line shadow-card">
                <Image
                  src="/images/aio-citation.png"
                  alt="自社サイトの情報を整えると、AI Overview・ChatGPT・Perplexity・Gemini の回答に引用元として社名が出ることを示す図"
                  width={1200}
                  height={660}
                  className="h-auto w-full"
                />
              </figure>
            </Reveal>
          </div>

          {/* スマホ: 4列の表は横に切れて読めなかったので、項目ごとに3つを縦に並べる */}
          <Reveal delay={0.1} className="mt-10 grid gap-3 md:hidden">
            {COMPARE_ROWS.map((row) => (
              <dl key={row.label} className="rounded-2xl border border-line bg-raise p-5 shadow-card">
                <dt className="text-xs font-bold text-slate">{row.label}</dt>
                <dd className="mt-3 grid gap-2 text-sm leading-6">
                  <p className="grid grid-cols-[3.2rem_1fr] gap-2 text-slate">
                    <span className="font-data font-bold">SEO</span>
                    {row.seo}
                  </p>
                  <p className="grid grid-cols-[3.2rem_1fr] gap-2 text-ink">
                    <span className="font-data font-bold">MEO</span>
                    {row.meo}
                  </p>
                  <p className="-mx-2 grid grid-cols-[3.2rem_1fr] gap-2 rounded-lg bg-pulse/5 px-2 py-1.5 font-bold text-ink">
                    <span className="font-data text-pulse">AIO</span>
                    {row.aio}
                  </p>
                </dd>
              </dl>
            ))}
          </Reveal>
          <Reveal delay={0.1} className="mt-12 hidden overflow-hidden rounded-2xl border border-line shadow-card md:block">
            <table className="w-full border-collapse bg-raise text-sm">
              <caption className="sr-only">SEO・MEO・AIOの比較表</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-40 p-5 text-left text-xs font-medium text-slate">
                    比較項目
                  </th>
                  <th scope="col" className="p-5 text-left">
                    <span className="font-data text-base font-bold text-slate">SEO</span>
                    <span className="mt-1 block text-xs font-normal text-slate">従来の検索対策</span>
                  </th>
                  <th scope="col" className="p-5 text-left">
                    <span className="font-data text-base font-bold text-ink">MEO</span>
                    <span className="mt-1 block text-xs font-normal text-slate">地図検索対策</span>
                  </th>
                  <th scope="col" className="bg-pulse/5 p-5 text-left">
                    <span className="font-data text-base font-bold text-pulse">AIO</span>
                    <span className="mt-1 block text-xs font-normal text-slate">AI検索対策 — いまここ</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0">
                    <th scope="row" className="p-5 text-left text-xs font-medium text-slate">
                      {row.label}
                    </th>
                    <td className="p-5 text-slate">{row.seo}</td>
                    <td className="p-5">{row.meo}</td>
                    <td className="bg-pulse/5 p-5 font-medium text-ink">{row.aio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          {/* 運営メディア（別サイト）への入口は、相談の手前で人が出ていかないよう文字のリンクにして最後に置く */}
          <Reveal delay={0.12} className="mt-8 flex flex-col items-start gap-x-8 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href="/services/aio" className="rounded-full border border-ink/25 px-8 py-3.5 text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse">
              AIO運用代行を見る
            </Link>
            <Link href="/services/meo" className="rounded-full border border-ink/25 px-8 py-3.5 text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse">
              MEO運用代行を見る
            </Link>
            <a href={site.labUrl} target="_blank" rel="noopener" className="tap text-sm font-bold text-slate underline-offset-4 hover:text-pulse hover:underline">
              AI集客ラボ (運営メディア) ↗
            </a>
          </Reveal>
        </div>
      </section>

      {/* 4. 当社のやり方（数字で設計し、数字で報告する）と、その数字。
          以前は同じ見出し「成果は、数字で語る。」が、文だけの区画と数字の区画の2か所にあった。1つにまとめた */}
      <section id="numbers" data-area="数字" data-area-id="numbers" className="relative scroll-mt-24 overflow-hidden bg-ink py-16 text-white md:py-28" aria-labelledby="numbers-heading">
        <div aria-hidden className="grid-field-dark absolute inset-0" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 85% 15%, rgb(28 63 124 / 0.4), transparent 60%), radial-gradient(ellipse 40% 50% at 8% 90%, rgb(116 199 214 / 0.12), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5">
          <Reveal>
            <p aria-hidden className="eyebrow !text-aqua" />
            {/* このページでいちばん言いたい1か所。見出しをほかの区画より大きくする */}
            <h2 id="numbers-heading" className="mt-3 text-4xl font-black leading-tight tracking-tight md:text-7xl">
              成果は、<span className="text-gold-bright">数字</span>で語る。
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.9] text-white/75 md:text-base">
              私たちは「頑張ります」とは言いません。支援実績・継続率・改善率——すべての仕事を
              <strong className="font-bold text-white">数字で設計し、数字で報告</strong>
              します。現場で積み上げた実践データを、誰でも再現できる仕組みへ。それがセブンセンシズの仕事です。
            </p>
          </Reveal>
          {/* 数字ごとに、中身が一目で分かる小さな図を添える（推移・割合・前後・内訳・削減の目安・対象） */}
          <NumberWall />
        </div>
      </section>

      {/* 5. 本当か（1）: 実践データ。本文とグラフで対象がずれていた（本文は「MEO運用」、グラフは「AIO・SEO・MEO 累計」）ので、
          グラフの元データ（lib/meo.ts）に合わせた */}
      <section id="data" data-area="実践データ" data-area-id="data" className="relative scroll-mt-24 bg-paper py-16 md:py-24" aria-labelledby="data-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            id="data-heading"
            title="累計3,200件の支援が生んだ、実践データ"
            lead="2019年から積み上げてきた、AIO・SEO・MEOの支援の現場データです。業種の内訳と順位の表は、そのうちMEOの運用（2,000件以上）から取ったものです。==この蓄積が、全事業の土台==です。"
          />
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Reveal className="rounded-2xl border border-line bg-raise p-5 shadow-card md:p-8">
              <GrowthChart />
            </Reveal>
            <div className="grid gap-6">
              <Reveal delay={0.1} className="rounded-2xl border border-line bg-raise p-5 shadow-card md:p-8">
                <IndustryBars />
              </Reveal>
            </div>
          </div>
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
            <Reveal delay={0.05} className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-raise p-5 shadow-card sm:gap-6 md:p-8">
              <GaugeDonut value={94} label="契約継続率" sub="運用サービス平均" />
              <GaugeDonut value={87} label="上位3位以内 到達率" sub="主要キーワード・90日" />
            </Reveal>
            <Reveal delay={0.12}>
              <RankTable />
            </Reveal>
          </div>
          <Reveal delay={0.15} className="mt-8 text-center">
            <Link href="/services/meo" className="tap gap-2 text-sm font-bold text-pulse underline-offset-4 hover:underline">
              MEO運用代行の詳細を見る
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 6. 本当か（2）: 導入事例。写真（イメージ）は外した。支援先の写真ではなく、机で話す2人の同じ構図が3枚続いていた。
          事例の主役は数字なので、数字をカードの頭に置く */}
      <section id="cases" data-area="導入事例" data-area-id="cases" className="scroll-mt-24 border-t border-line bg-mist py-16 md:py-24" aria-labelledby="cases-heading">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHead
            id="cases-heading"
            title="支援先で、数字はこう動きました"
            lead="規模も業種も違う3社。共通しているのは、==施策を数字で設計し、数字で報告した==ことです。"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {cases.map((cs, i) => (
              <Reveal key={cs.industry} delay={(i % 3) * 0.09}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-raise shadow-card">
                  {/* 写真の枠（ファイルを置くと出る。lib/photoSlots.ts） */}
                  {CASE_SLOT[cs.industry] && <PhotoSlot name={CASE_SLOT[cs.industry]} sizes="(min-width: 1024px) 400px, 100vw" />}
                  <div className="border-b border-line bg-ink p-7 text-white md:p-8">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold text-white">
                        {cs.industry}
                      </span>
                      <Link href={`/services/${cs.slug}`} className="inline-flex min-h-9 items-center text-xs font-bold text-aqua hover:underline">
                        {cs.service} →
                      </Link>
                    </div>
                    <p className="mt-6 leading-none">
                      <span className="num text-5xl font-bold md:text-6xl">{cs.metric.value}</span>
                      <span className="ml-1.5 text-lg font-bold text-gold-bright">{cs.metric.suffix}</span>
                      <span className="mt-3 block text-xs text-white/70">{cs.metric.label}</span>
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col p-7 md:p-8">
                    <h3 className="text-lg font-black leading-relaxed md:text-xl">{cs.headline}</h3>

                    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-mist/70 p-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate">導入前</p>
                        <p className="mt-1 text-sm font-medium leading-7 text-slate">{cs.before}</p>
                      </div>
                      <svg width="22" height="14" viewBox="0 0 34 20" aria-hidden className="shrink-0 text-pulse">
                        <path d="M2 10h24M20 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-pulse">導入後</p>
                        <p className="mt-1 text-sm font-bold leading-7 text-ink">{cs.after}</p>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-slate">{cs.body}</p>

                    {cs.voice && (
                      <figure className="mt-auto border-t border-line pt-5">
                        <blockquote className="text-sm leading-7 text-ink">
                          <span className="font-data mr-1.5 text-base font-bold text-pulse">&ldquo;</span>
                          {cs.voice}
                        </blockquote>
                        <figcaption className="mt-2.5 text-xs text-slate">— {cs.industry} ご担当者様</figcaption>
                      </figure>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="mt-10 text-center">
            <Link href="/contact" className={`inline-block ${PRIMARY}`}>
              自社の場合を、無料相談で聞く
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 7. 本当か（3）: 誰がやるのか。実写（登壇の写真）と代表の言葉 */}
      <section id="field" data-area="現場と代表" data-area-id="field" className="relative scroll-mt-24 overflow-hidden bg-ink py-20 text-white md:py-28" aria-labelledby="field-heading">
        <div aria-hidden className="grid-field-dark absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Reveal>
                <p aria-hidden className="eyebrow !text-aqua" />
                <h2 id="field-heading" className="mt-3 text-3xl font-bold md:text-5xl">
                  机上ではなく、現場から。
                </h2>
                <p className="mt-5 max-w-xl text-[15px] leading-[1.9] text-white/65 md:text-base">
                  全国でのセミナー登壇や店舗支援の現場——累計3,200件の支援と向き合ってきたのは、資料の中ではなく現場です。だから私たちの提案は、机上の空論になりません。
                </p>
              </Reveal>
              <Reveal delay={0.12}>
                <figure className="mt-8 border-l-2 border-aqua pl-6">
                  <blockquote className="text-base font-bold leading-9 md:text-lg">
                    「成功に必要なのは、プロの知見と、運を活かす提案。
                    <br />
                    その両方を届けるのが、セブンセンシズです。」
                  </blockquote>
                  <figcaption className="mt-3 text-xs text-white/50">
                    代表取締役 {site.ceo}
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={0.2}>
                <Link
                  href="/company"
                  className="tap mt-8 gap-2 text-sm font-bold text-aqua underline-offset-4 hover:underline"
                >
                  代表メッセージ・会社概要を見る
                  <Arrow />
                </Link>
              </Reveal>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Reveal className="col-span-2">
                <Image
                  src="/images/seminar-2.jpg"
                  alt="セブンセンシズ代表によるGoogleビジネスプロフィール活用セミナーの登壇風景"
                  width={700}
                  height={525}
                  className="aspect-[16/10] w-full rounded-2xl object-cover shadow-lift"
                />
              </Reveal>
              <Reveal delay={0.1}>
                <Image
                  src="/images/seminar-1.jpg"
                  alt="経営者向け勉強会で店舗集客を解説する様子"
                  width={700}
                  height={525}
                  className="aspect-square w-full rounded-2xl object-cover"
                />
              </Reveal>
              <Reveal delay={0.16}>
                <Image
                  src="/images/seminar-3.jpg"
                  alt="セミナーで質疑応答に応える代表"
                  width={700}
                  height={525}
                  className="aspect-square w-full rounded-2xl object-cover"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 自分の場合はどう進むか */}
      <section id="process" data-area="進め方" data-area-id="process" className="scroll-mt-24 py-16 md:py-24" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-5">
          {/* 写真の枠（ファイルを置くと見出しの右に出る。lib/photoSlots.ts） */}
          <div className={hasSlot("top-process") ? "grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]" : ""}>
            <SectionHead
              id="process-heading"
              title="いきなり契約からは、始めません"
              lead="どのサービスも、いきなり契約から始まることはありません。まず現状を診断し、==効果の見込みを数字で確認==してから進めます。ご相談から成果までは、4つのステップです。"
            />
            <PhotoSlot name="top-process" sizes="(min-width: 1024px) 560px, 100vw" className="rounded-3xl shadow-card" />
          </div>
          <div className="mt-12">
            <FlowSteps
              steps={[
                { title: "無料相談", body: "課題と現状をオンラインで伺います。所要30〜60分です。" },
                { title: "診断・ご提案", body: "現状分析をもとに、施策の優先度と費用対効果をご提示します。" },
                { title: "実装・構築", body: "契約後、専任チームが設計から実装までを進めます。" },
                { title: "運用・改善", body: "月次レポートで成果を可視化し、改善を積み重ねます。" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 9. 費用を抑える制度 */}
      <section id="subsidy" data-area="補助金" data-area-id="subsidy" className="scroll-mt-24 pb-16 md:pb-24" aria-labelledby="subsidy-heading">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            {/* 白の面が2つ続いて単調になるうえ、内容もお金の話なので、
                この帯だけ金の淡い面にして視線を止める */}
            <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-gold/25 bg-gold-tint p-8 shadow-card md:grid-cols-[1.6fr_1fr] md:p-12">
              <div>
                <p className="eyebrow">AI導入補助金</p>
                <h2 id="subsidy-heading" className="mt-3 text-2xl font-bold md:text-4xl">
                  受発注・会計ソフトなら、
                  <br className="sm:hidden" />
                  <mark className="marker">最大350万円の枠</mark>が使えます
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-[1.9] text-slate">
                  当社はAI導入補助金のベンダーとして、申請支援から導入・実績報告までを一貫対応。受発注ソフト・会計ソフトを対象とする枠なら補助上限は350万円です。「制度が複雑で諦めていた」企業こそご相談ください。8問・3分の無料診断で、活用できる制度がすぐ分かります。
                </p>
              </div>
              <div className="flex flex-col gap-4 md:items-end">
                {/* 写真の枠（ファイルを置くと出る。lib/photoSlots.ts） */}
                <PhotoSlot name="top-subsidy" sizes="(min-width: 768px) 24rem, 100vw" className="w-full rounded-2xl" />
                <Link
                  href="/services/ai-subsidy"
                  className="rounded-full border border-ink/25 bg-white px-9 py-4 text-center text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
                >
                  補助金支援の詳細を見る
                </Link>
                <a
                  href={site.lpUrl}
                  target="_blank"
                  rel="noopener"
                  className="text-center text-xs font-bold text-slate underline-offset-4 hover:text-pulse hover:underline"
                >
                  まず無料診断で確かめる（8問・3分） ↗
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10. 不安の解消 */}
      <section id="faq" data-area="よくある質問" data-area-id="faq" className="scroll-mt-24 border-t border-line bg-mist py-16 md:py-24" aria-labelledby="faq-heading">
        {/* ほかの区画と同じ幅・同じ左端。見出しを左、質問を右に並べる（中央寄せの細い列だけ浮いていた） */}
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead id="faq-heading" title="ご相談の前によく聞かれること" />
          </div>
          <div>
            <FaqList items={TOP_FAQ} />
          </div>
        </div>
      </section>

      {/* 11. 相談の手前の入口（その場で終わるセルフチェック） */}
      <SelfCheckBand />

      {/* お知らせ。筋の外なので、相談の案内の手前に小さく置く */}
      <section id="news" data-area="お知らせ" data-area-id="news" className="scroll-mt-24 py-14 md:py-16" aria-labelledby="news-heading">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHead id="news-heading" title="お知らせ" />
          <div className="mt-8 grid gap-3">
            {news.map((n, i) => (
              <Reveal key={n.slug} delay={i * 0.06}>
                <Link
                  href={`/news/${n.slug}`}
                  className="group flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-line bg-raise px-6 py-5 shadow-card transition-colors hover:border-pulse/40"
                >
                  <time dateTime={n.dateISO} className="num text-xs text-slate">
                    {n.date}
                  </time>
                  <span className="rounded-full bg-pulse/10 px-3 py-0.5 text-xs font-bold text-pulse">
                    {n.category}
                  </span>
                  <span className="flex-1 basis-full text-sm font-medium group-hover:text-pulse sm:basis-auto">
                    {n.title}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="mt-8 text-center">
            <Link href="/news" className="tap gap-2 text-sm font-bold text-pulse underline-offset-4 hover:underline">
              お知らせ一覧を見る
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 開発・事業づくりの相談は、当社の顧問 YW のサイト（CONFLUX PARTNERS）へ。
          別サイトへの入口なので、ページの中ほどから相談の案内の手前へ移した（入口は残す） */}
      <DevPartnerBand />

      {/* 12. 次の一手 */}
      <CtaBand />
    </>
  );
}
