import Link from "next/link";
import { coDeveloper, developer, developerOrg } from "@/lib/developer";

// 開発・事業づくりの相談の入口（2026-10-10 運用者の指示「CONFLUX へのアクセスを良く・目立つように」）。
// 関係は、当社の顧問として AIO 事業とシステム開発事業の責任者を務める YW のサイト（プレスキットと同じ書き方）。
// グループ会社・提携先とは書かない。関係を書いた相互リンクなので、リンクの評価を止める rel は付けない。
// 以前は紺の面に光のぼかしと方眼を敷いていた。トップの話の流れの中で浮かないよう、藍の枠で囲んだ1枚にする
const PRODUCTS = [
  { name: "ラクシフトAI", href: "/rakushift", co: true },
  { name: "経理システム（セルフ版）", href: "/services/keiri-bpo", co: false },
  { name: "AIO（SEO）対策エージェント", href: "/aio-agent", co: false },
];

const TOPICS = [
  { name: "AI エージェント開発", note: "決まった手順の業務を AI に任せる仕組み", path: "/services/ai-agent-development" },
  { name: "システム開発", note: "業務システム・Web アプリをオーダーメイドで", path: "/services/system-development" },
  { name: "Webサイトの検収チェック", note: "納品されたサイトの公開の設定を14項目で確認", path: "/site-check" },
];

export default function DevPartnerBand() {
  const site = developerOrg.url.replace(/\/$/, "");
  return (
    <section id="partner" className="scroll-mt-20 pb-[72px] md:pb-28" aria-labelledby="partner-heading">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="rounded-md border border-pulse">
          <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="text-sm font-bold text-pulse">開発・事業づくりの相談</p>
              <h2 id="partner-heading" className="mt-3 text-2xl font-bold leading-[1.4] md:text-[2rem]">
                システム開発と事業づくりは、
                <br className="hidden sm:block" />
                顧問の{developer.name}へ。
              </h2>
              <p className="mt-5 max-w-[38em] text-[15px] leading-[1.9] text-slate">
                当社の顧問として AIO 事業とシステム開発事業の責任者を務める {developer.name}（{developer.jobTitle}）が手がける{" "}
                {developerOrg.name} では、オーダーメイドの業務システムや AI エージェントの開発と、経営・AI・開発をまとめた事業の設計の相談を受け付けています。
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                <a href={developerOrg.url} target="_blank" rel="noopener" className="btn btn-secondary">
                  {developerOrg.name} を見る ↗
                </a>
                <a href={`${site}/works`} target="_blank" rel="noopener" className="link-u inline-flex min-h-11 items-center text-sm">
                  開発の実績を見る ↗
                </a>
              </div>
            </div>

            {/* 当社の3つの製品と、それをつくった開発者のつながり */}
            <figure className="lg:col-span-5">
              <figcaption className="text-[13px] font-bold text-slate">当社の製品をつくった開発者です</figcaption>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,0.85fr)] items-center gap-3">
                <ul className="border-t border-line">
                  {PRODUCTS.map((p) => (
                    <li key={p.href} className="border-b border-line">
                      <Link href={p.href} className="block py-3 text-sm font-bold text-ink transition-colors hover:text-pulse">
                        {p.name}
                        {p.co && <sup className="ml-0.5 text-pulse">*</sup>}
                      </Link>
                    </li>
                  ))}
                </ul>
                <svg width="28" height="120" viewBox="0 0 34 120" aria-hidden className="text-line-strong">
                  <path d="M2 20 C 20 20, 18 60, 32 60 M2 60 H32 M2 100 C 20 100, 18 60, 32 60" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <div className="border-l-2 border-pulse py-2 pl-4">
                  <p className="text-[13px] text-slate">開発</p>
                  <p className="mt-0.5 text-lg font-bold">{developer.name}</p>
                  <p className="text-[13px] leading-5 text-slate">{developerOrg.name}</p>
                </div>
              </div>
              <p className="mt-3 text-[13px] text-slate">* ラクシフトAI は{coDeveloper.name}との共同開発です。</p>
            </figure>
          </div>

          <ul className="grid border-t border-pulse/30 md:grid-cols-3">
            {TOPICS.map((t, i) => (
              <li key={t.path} className={i ? "border-t border-pulse/30 md:border-l md:border-t-0" : ""}>
                <a href={`${site}${t.path}`} target="_blank" rel="noopener" className="group block h-full p-6 transition-colors hover:bg-mist md:p-7">
                  <span className="block font-bold text-pulse underline decoration-1 underline-offset-[0.35em] group-hover:decoration-2">{t.name} ↗</span>
                  <span className="mt-1.5 block text-sm leading-6 text-slate">{t.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
