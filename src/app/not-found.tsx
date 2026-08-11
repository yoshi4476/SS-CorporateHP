import Link from "next/link";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import WaveText from "@/components/WaveText";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-20">
      <div aria-hidden className="grid-field absolute inset-0" />
      <WaveText text="404" className="pointer-events-none absolute -top-4 right-0 select-none text-[22vw] leading-none tracking-tighter opacity-20" />
      <div className="relative mx-auto max-w-5xl px-5 py-20 md:py-28">
        <span aria-hidden className="block h-1.5 w-20 rounded-full bg-gradient-to-r from-pulse to-aqua" />
        <p className="eyebrow mt-6">404 — Page Not Found</p>
        <h1 className="mt-4 text-3xl font-black leading-snug md:text-5xl">
          お探しのページが
          <br />
          見つかりませんでした。
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-8 text-slate md:text-base">
          URLが変更されたか、削除された可能性があります。お探しの内容は以下のいずれかかもしれません。
          見つからない場合は、お気軽にお問い合わせください。
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
                  className="rounded-full bg-pulse px-9 py-4 text-center text-sm font-bold text-white shadow-glow transition-transform hover:-translate-y-0.5"
          >
            トップページへ戻る
          </Link>
          <Link
            href="/contact"
                  className="rounded-full border border-ink/20 px-9 py-4 text-center text-sm font-bold text-ink transition-colors hover:border-pulse hover:text-pulse"
          >
            お問い合わせ
          </Link>
        </div>

        <div className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">Services</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {services.map((s, i) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-line bg-raise px-4 py-3 text-sm font-medium shadow-card transition-colors hover:border-pulse/40 hover:text-pulse"
                  >
                    <span>
                      <span className="num mr-2 text-xs text-pulse">{String(i + 1).padStart(2, "0")}</span>
                      {s.name}
                    </span>
                    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden className="shrink-0 text-pulse transition-transform group-hover:translate-x-1">
                      <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Company</p>
            <ul className="mt-5 grid gap-2.5 text-sm">
              <li>
                <Link href="/services" className="text-slate transition-colors hover:text-pulse">
                  事業内容一覧
                </Link>
              </li>
              <li>
                <Link href="/company" className="text-slate transition-colors hover:text-pulse">
                  会社概要
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-slate transition-colors hover:text-pulse">
                  お知らせ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate transition-colors hover:text-pulse">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
            <p className="mt-8 border-t border-line pt-6 text-xs leading-7 text-slate">
              お急ぎの場合はお電話ください。
              <br />
              TEL:{" "}
              <a href={`tel:${site.tel.replaceAll("-", "")}`} className="num font-bold text-pulse hover:underline">
                {site.tel}
              </a>
              <br />
              受付時間: {site.hours}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
