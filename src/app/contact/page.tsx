import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/motion";
import ContactForm from "@/components/ContactForm";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "お問い合わせ・無料相談",
  description:
    "セブンセンシズ株式会社への無料相談・お問い合わせはこちら。AI導入、MEO/AIO運用、システム開発、HP/LP制作などお気軽にご相談ください。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "トップ", path: "/" },
          { name: "お問い合わせ・無料相談", path: "/contact" },
        ])}
      />

      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div aria-hidden className="grid-field absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 md:pt-20">
          <Reveal>
            <p className="eyebrow">Contact</p>
            <h1 className="mt-4 text-3xl font-black md:text-5xl">無料相談・お問い合わせ</h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate md:text-base">
              「何から始めればいいか分からない」という段階のご相談も歓迎です。通常1営業日以内にご返信します。お急ぎの場合はお電話ください。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 pt-6 md:pb-28">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 lg:grid-cols-[1.5fr_1fr]">
          <Reveal delay={0.08} className="rounded-3xl border border-line bg-white p-7 shadow-card md:p-10">
            <ContactForm />
          </Reveal>

          <div className="grid gap-5">
            <Reveal delay={0.14}>
              <div className="rounded-2xl bg-ink p-7 text-white">
                <p className="eyebrow !text-aqua">Tel</p>
                <a
                  href={`tel:${site.tel.replaceAll("-", "")}`}
                  className="num mt-3 block text-3xl font-bold tracking-wide hover:text-aqua"
                >
                  {site.tel}
                </a>
                <p className="mt-3 text-xs leading-6 text-white/60">受付時間: {site.hours}</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="rounded-2xl border border-line bg-mist p-7">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-sm font-bold">ご相談の流れ</h2>
                  <Image
                    src="/images/online-meeting.png"
                    alt="オンライン打ち合わせのイラスト"
                    width={640}
                    height={640}
                    className="-mt-2 h-20 w-20 shrink-0"
                  />
                </div>
                <ol className="mt-2 grid gap-3 text-xs leading-6 text-slate">
                  <li className="flex gap-3">
                    <span className="num font-bold text-pulse">1.</span>
                    フォームまたはお電話でご連絡
                  </li>
                  <li className="flex gap-3">
                    <span className="num font-bold text-pulse">2.</span>
                    オンラインで現状ヒアリング(30〜60分・無料)
                  </li>
                  <li className="flex gap-3">
                    <span className="num font-bold text-pulse">3.</span>
                    診断結果と施策のご提案(契約前提ではありません)
                  </li>
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
