import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import BusinessMap from "@/components/BusinessMap";
import { CtaBand, SectionHead, PageHead, StorySection, BtnArrow } from "@/components/ui";
import { services } from "@/lib/services";
import { pageMeta } from "@/lib/meta";
import { rakushift } from "@/lib/rakushift";
import { pipeline } from "@/lib/autopipeline";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

// 自社プロダクト。受託の7事業とは性質が違うので別枠で並べる
const PRODUCTS = [
  {
    href: "/rakushift",
    en: "Rakushift AI — SaaS",
    name: rakushift.name,
    catch: rakushift.catch,
    body: "シフト作成を数理最適化AIと生成AIの二段構えで自動化するクラウドサービス。労働基準法を守った配置を数秒で組み上げます。飲食店・小売店・医療介護施設で利用されています。",
    price: "月額3,380円〜",
  },
  {
    href: "/aio-agent",
    en: `AIO / SEO Agent — ${pipeline.deliverable}`,
    name: pipeline.name,
    catch: pipeline.catch,
    body: "メディアの器と、記事を書いて出し続けるAIエージェントをセットで納品します。キーワード選定から執筆・品質審査・公開・インデックス登録・順位集計まで自動で動きます。",
    price: "個別お見積り",
  },
  // 経理BPOで実際に使っているシステム。任せる形と、自社で使う形の
  // 2つから選べる。金額は要件で変わるため、用途を出す
  {
    href: "/services/keiri-bpo",
    en: "Accounting System — セルフ版",
    name: "経理システム（セルフ版）",
    catch: "記帳から給与・年末調整まで、1か所で完結する経理システム",
    body: "経理BPOをお引き受けするために使っている業務システムです（開発：YW／CONFLUX PARTNERS）。受け取った書類から仕訳の案を作り、担当者が確認して確定するまでを1か所にまとめています。給与・賞与・年末調整、請求と入金の消込まで同じ場所で扱えます。",
    price: "経理BPOに付帯",
  },
];

export const metadata: Metadata = pageMeta({
  // 「事業内容」は誰も検索しない語。検索される事業名を先頭に置く
  // （28日で6.4位・表示34・クリック0。順位相応なら1〜2クリック）
  title: `AI集客・システム開発・補助金支援の${services.length}事業`,
  description:
    `セブンセンシズ株式会社の事業内容一覧。AIコンサルティング、システム開発、AI導入補助金支援、AIO運用代行(オウンドメディア×LP)、MEO運用代行(通算3,200店舗)、HP/LP制作の${services.length}事業を一気通貫で提供します。`,
  path: "/services",
});

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "セブンセンシズ株式会社の事業内容",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.name,
    url: `${site.url}/services/${s.slug}`,
  })),
};

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          itemListSchema,
          breadcrumbSchema([
            { name: "トップ", path: "/" },
            { name: "事業内容", path: "/services" },
          ]),
        ]}
      />

      {/* ページの頭。以前はオフィスのイメージ写真を全幅に敷いていた。事業の名前を先に読ませる */}
      <PageHead
        crumbs={[{ name: "トップ", href: "/" }, { name: "事業内容" }]}
        title="事業内容"
        lead={
          <>
            戦略 (AIコンサルティング)・実装 (システム開発・HP/LP制作)・集客 (MEO・AIO×オウンドメディア)・資金 (AI導入補助金)・経理 (経理BPO)。
            <strong className="font-bold text-ink">{services.length}つの事業をひとつのチームで一気通貫</strong>
            に提供するから、窓口はひとつ、責任もひとつ。バラバラに外注したときに起きる「導線の分断」がありません。
          </>
        }
        aside={
          <nav aria-label="事業の一覧">
            <p className="text-[13px] font-bold text-slate">事業の一覧</p>
            <ul className="mt-2 border-t border-ink">
              {services.map((sv) => (
                <li key={sv.slug} className="border-b border-line">
                  <a href={`#${sv.slug}`} className="flex min-h-11 items-center justify-between gap-3 text-[15px] font-bold transition-colors hover:text-pulse">
                    {sv.name}
                    <span className="text-[13px] font-normal text-slate">{sv.group}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      {/* 困りごとから選ぶ（トップと同じ全体像の図）。一覧の前に、どれが自社に効くかの見当をつけてもらう */}
      <StorySection
        id="map"
        title="困りごとから選ぶ"
        lead={`集客・経理と社内業務・補助金の3つの領域に、${services.length}つの事業があります。よくある困りごとから、効く事業へつなぎました。`}
      >
        <BusinessMap />
      </StorySection>

      {/* 事業ごとの要点。写真のカードを左右交互に並べていたのをやめ、帳簿の行のように罫で区切る */}
      <section className="bg-mist py-20 md:py-32" aria-labelledby="list-heading">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead id="list-heading" title={`${services.length}つの事業`} lead="「MEOだけ」「補助金だけ」のご依頼も歓迎です。ただ、戦略・実装・集客・資金をひとつのチームで設計すると、施策同士が噛み合い、成果の出る速度が変わります。" />
          <div className="mt-10 rule-close">
            {services.map((s) => (
              <article id={s.slug} key={s.slug} className="grid scroll-mt-28 gap-6 border-t border-line-strong py-9 first:border-ink lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4">
                  <p className="text-[13px] font-bold text-gold-deep">{s.group}</p>
                  <h2 className="mt-2 text-2xl font-bold leading-snug md:text-[1.75rem]">
                    <Link href={`/services/${s.slug}`} className="transition-colors hover:text-pulse">
                      {s.name}
                    </Link>
                  </h2>
                  {s.metrics?.[0] ? (
                    <p className="mt-5 leading-none">
                      <span className="num text-4xl font-bold">{s.metrics[0].value}</span>
                      <span className="ml-1 text-sm font-bold">{s.metrics[0].suffix}</span>
                      <span className="mt-2 block text-[13px] text-slate">{s.metrics[0].label}</span>
                    </p>
                  ) : s.price ? (
                    <p className="mt-5 text-sm leading-7 text-slate">
                      <span className="font-bold text-ink">料金目安</span>　{s.price.split(" /")[0]}
                    </p>
                  ) : null}
                </div>
                <div className="lg:col-span-8">
                  <p className="text-lg font-bold leading-[1.7]">{s.lead}</p>
                  <p className="mt-2 text-[15px] leading-[1.9] text-slate">{s.short}</p>
                  <ul className="mt-5 grid gap-x-6 border-t border-line sm:grid-cols-3">
                    {s.points.slice(0, 3).map((pt) => (
                      <li key={pt.title} className="border-b border-line py-3 text-sm font-bold leading-6">
                        {pt.title}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/services/${s.slug}`} className="btn btn-secondary mt-6">
                    {s.name}を詳しく見る
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7">
            <Link href="/contact" className="btn btn-primary">
              無料相談で入り口を決める
              <BtnArrow />
            </Link>
            <a href={site.lpUrl} target="_blank" rel="noopener" className="link-u inline-flex min-h-11 items-center text-sm">
              AI導入補助金 特設サイト ↗
            </a>
          </div>
        </div>
      </section>

      {/* 自社プロダクト。受託と違い、そのまま契約できるものをここで並べる */}
      <StorySection
        id="products"
        title="自社の現場で、毎日使っているもの"
        lead="受託だけでなく、当社が提供し、自社の現場で毎日動かしているプロダクトがあります（開発：YW／CONFLUX PARTNERS）。実物を見てからご判断ください。"
      >
        <ul className="rule-close">
          {PRODUCTS.map((p, i) => (
            <li key={p.href} className={`border-t py-7 ${i ? "border-line-strong" : "border-ink"}`}>
              <Link href={p.href} className="group block">
                <h3 className="text-xl font-bold leading-snug text-pulse underline decoration-1 underline-offset-[0.35em] group-hover:decoration-2 md:text-2xl">
                  {p.name}
                </h3>
                <p className="mt-3 text-[15px] font-bold leading-7">{p.catch}</p>
                <p className="mt-2 max-w-[42em] text-[15px] leading-[1.9] text-slate">{p.body}</p>
                <p className="mt-3 text-sm">
                  <span className="font-bold text-slate">料金</span>　<span className="font-bold">{p.price}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </StorySection>

      <CtaBand
        title="どの事業から始めるか、一緒に決めましょう。"
        body="現状を伺い、費用対効果の高い順に優先度をつけてご提案します。すべてを一度に始める必要はありません。"
      />
    </>
  );
}
