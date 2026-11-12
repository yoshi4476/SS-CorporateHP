import Link from "next/link";
import { Reveal } from "@/components/motion";
import { services, getService } from "@/lib/services";
import PhotoSlot, { hasSlot } from "@/components/PhotoSlot";
import type { PhotoSlotName } from "@/lib/photoSlots";

// トップの事業の区画。以前は7つの事業を同じ大きさの丸ボタンで並べ（BusinessMap）、何でも屋に見えた。
// 主役の2つ（経理BPO・集客）を大きく見せ、残りは「そのほかの事業」として小さくまとめる（入口は消さない）。
// 載せる数字は、ページのほかの所にある実績（48社・3,200件・MEO 2,000件以上）だけ。

const MAIN_SLUGS = ["keiri-bpo", "aio", "meo"];

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden className="shrink-0">
      <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

const LINK = "inline-flex items-center gap-2 rounded-full border border-ink/25 bg-white px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse";

export default function TopBusinesses() {
  const keiri = getService("keiri-bpo");
  const others = services.filter((s) => !MAIN_SLUGS.includes(s.slug));
  return (
    <div className="[word-break:auto-phrase]">
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal className="h-full">
          <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-raise p-7 shadow-card md:p-10">
            {/* 写真の枠（ファイルを置くと出る。lib/photoSlots.ts） */}
            <PhotoSlot name="svc-keiri-bpo" sizes="(min-width: 1024px) 620px, 100vw" className="-mx-7 -mt-7 mb-7 md:-mx-10 md:-mt-10" />
            <p className="text-sm font-bold text-gold-deep">経理・記帳を任せたい</p>
            <h3 className="mt-3 text-2xl font-black leading-snug md:text-3xl">経理の実務を、手順ごと引き受けます</h3>
            <p className="mt-4 text-[15px] leading-[1.9] text-slate">{keiri?.short}</p>
            <ul className="mt-6 grid gap-2 border-t border-line pt-5 text-sm leading-7 text-ink sm:grid-cols-2">
              {["記帳・仕訳入力", "請求書の発行と入金消込", "支払データの作成", "給与計算まわりの実務"].map((m) => (
                <li key={m} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-7 text-ink">
              <span className="num text-2xl font-bold">48</span>
              <span className="ml-0.5 font-bold">社</span>
              <span className="ml-2 text-slate">の経理代行・記帳代行を担当（2023年4月〜2026年9月）</span>
            </p>
            <div className="mt-auto pt-7">
              <Link href="/services/keiri-bpo" data-cta="top_svc_keiri-bpo" className={LINK}>
                経理BPO・記帳代行を見る
                <Arrow />
              </Link>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.08} className="h-full">
          <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-raise p-7 shadow-card md:p-10">
            {(hasSlot("svc-aio") || hasSlot("svc-meo")) && (
              <div className="-mx-7 -mt-7 mb-7 grid grid-cols-2 gap-px md:-mx-10 md:-mt-10">
                <PhotoSlot name="svc-aio" sizes="(min-width: 1024px) 310px, 50vw" caption={false} />
                <PhotoSlot name="svc-meo" sizes="(min-width: 1024px) 310px, 50vw" />
              </div>
            )}
            <p className="text-sm font-bold text-pulse">問い合わせと来店を増やしたい</p>
            <h3 className="mt-3 text-2xl font-black leading-snug md:text-3xl">AIの答えとGoogleマップに、御社の名前を出します</h3>
            <p className="mt-4 text-[15px] leading-[1.9] text-slate">
              ChatGPT や Google の AI による概要に引用されるサイトに整える AIO運用代行と、Googleマップで上位に出す MEO運用代行を、同じチームで運用します。
            </p>
            <ul className="mt-6 grid gap-2 border-t border-line pt-5 text-sm leading-7 text-ink sm:grid-cols-2">
              {["AIに引用されるページの設計", "月次の改善と報告", "Googleマップの運用代行", "口コミの返信と投稿"].map((m) => (
                <li key={m} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-pulse" />
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-7 text-ink">
              <span className="num text-2xl font-bold">3,200</span>
              <span className="ml-0.5 font-bold">件</span>
              <span className="ml-2 text-slate">AIO・SEO・MEOの累計支援（うちMEO 2,000件以上）</span>
            </p>
            <div className="mt-auto flex flex-wrap gap-3 pt-7">
              <Link href="/services/aio" data-cta="top_svc_aio" className={LINK}>
                AIO運用代行を見る
                <Arrow />
              </Link>
              <Link href="/services/meo" data-cta="top_svc_meo" className={LINK}>
                MEO運用代行を見る
                <Arrow />
              </Link>
            </div>
          </article>
        </Reveal>
      </div>

      {/* 主役の2つを支える事業。入口は残し、文字のリンクで控えめに並べる */}
      <Reveal delay={0.12}>
        <div className="mt-8 rounded-3xl border border-line bg-white/60 p-6 md:p-8">
          <p className="text-sm font-bold text-ink">そのほかの事業</p>
          <p className="mt-1 text-sm leading-7 text-slate">上の2つと組み合わせてお受けしています。窓口は同じです。</p>
          <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <li key={s.slug}>
                <PhotoSlot name={`svc-${s.slug}` as PhotoSlotName} sizes="(min-width: 1024px) 280px, 50vw" caption={false} className="mb-3 rounded-xl" />
                <Link href={`/services/${s.slug}`} data-cta={`top_svc_${s.slug}`} className="inline-flex items-center gap-1.5 text-[15px] font-bold text-ink underline decoration-line-strong underline-offset-4 hover:text-pulse hover:decoration-pulse">
                  {s.name}
                  <Arrow />
                </Link>
                <p className="mt-1.5 text-[13px] leading-6 text-slate">「{s.challenges[0]}」</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
