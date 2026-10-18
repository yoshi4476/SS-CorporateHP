import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ContactForm from "@/components/ContactForm";
import { PageHead } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "無料相談・お問い合わせ｜1営業日以内に返信",
  // company/page.tsx と同様、「セブンセンシズ株式会社」の指名検索の受け皿は
  // トップページに寄せるため、社名を書き出しに置かず用件を先に示す。
  description:
    "AI導入、経理BPO、MEO/AIO運用代行、システム開発、HP/LP制作、補助金の申請支援などの無料相談・お問い合わせはこちらから。大阪市東成区のセブンセンシズ株式会社が、1営業日以内にご返信します。",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "トップ", path: "/" },
          { name: "お問い合わせ・無料相談", path: "/contact" },
        ])}
      />

      <PageHead
        crumbs={[{ name: "トップ", href: "/" }, { name: "お問い合わせ・無料相談" }]}
        title="無料相談・お問い合わせ"
        lead="「何から始めればいいか分からない」という段階のご相談も歓迎です。通常1営業日以内にご返信します。お急ぎの場合はお電話ください。"
      />

      <section className="pb-20 pt-12 md:pb-32 md:pt-16">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 md:px-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="grid gap-10 lg:sticky lg:top-28 lg:col-span-5">
            <div className="border-t border-ink pt-5" data-cta-pos="contact-tel">
              <h2 className="text-sm font-bold text-slate">お電話でのご相談</h2>
              <a href={`tel:${site.tel.replaceAll("-", "")}`} className="num mt-2 block text-[2rem] font-bold tracking-wide text-ink hover:text-pulse">
                {site.tel}
              </a>
              <p className="mt-1 text-sm leading-7 text-slate">受付時間: {site.hours}</p>
            </div>
            <div className="border-t border-ink pt-5">
              <h2 className="text-sm font-bold text-slate">ご相談の流れ</h2>
              <ol className="mt-3 border-b border-line">
                {[
                  "フォームまたはお電話でご連絡",
                  "オンラインで現状ヒアリング(30〜60分・無料)",
                  "診断結果と施策のご提案(契約前提ではありません)",
                ].map((s, i) => (
                  <li key={s} className="grid grid-cols-[2rem_1fr] border-t border-line py-3 text-[15px] leading-7">
                    <span className="num font-bold text-pulse">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
