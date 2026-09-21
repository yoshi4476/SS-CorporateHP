import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services";
import { news } from "@/lib/news";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        <div>
          <Image
            src="/images/logo-jp.png"
            alt="セブンセンシズ株式会社"
            width={220}
            height={110}
            className="logo-invert h-auto w-44"
          />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
            〒{site.postal} {site.address}
          </p>
          <p className="mt-4 text-sm text-white/60">
            TEL:{" "}
            <a href={`tel:${site.tel.replaceAll("-", "")}`} className="tap num text-white underline-offset-4 hover:underline">
              {site.tel}
            </a>
            <br />
            受付時間: {site.hours}
            <br />
            Email:{" "}
            <a href={`mailto:${site.contactEmail}`} className="tap text-white underline-offset-4 hover:underline">
              {site.contactEmail}
            </a>
          </p>
        </div>

        <nav aria-label="事業内容">
          <p className="eyebrow mb-4 !text-aqua">Services</p>
          <ul className="grid gap-0 text-sm text-white/75 md:gap-2.5">
            <li>
              <Link href="/services" className="tap font-bold transition-colors hover:text-white">
                事業内容一覧
              </Link>
            </li>
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="tap transition-colors hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
          {/* 自社プロダクト。受託の事業と混ぜず、線で区切って並べる */}
          <p className="eyebrow mb-4 mt-8 !text-aqua">Products</p>
          <ul className="grid gap-0 text-sm text-white/75 md:gap-2.5">
            <li>
              <Link href="/rakushift" className="tap transition-colors hover:text-white">
                ラクシフトAI
              </Link>
            </li>
            <li>
              <Link href="/aio-agent" className="tap transition-colors hover:text-white">
                AIO（SEO）対策エージェント
              </Link>
            </li>
            <li>
              <Link href="/services/keiri-bpo" className="tap transition-colors hover:text-white">
                経理システム（セルフ版）
              </Link>
            </li>
            <li>
              <Link href="/services/ad-operations" className="tap transition-colors hover:text-white">
                広告運用の管理システム
              </Link>
            </li>
          </ul>
        </nav>

        <div className="grid content-start gap-8">
          <nav aria-label="会社情報">
            <p className="eyebrow mb-4 !text-aqua">Company</p>
            <ul className="grid gap-0 text-sm text-white/75 md:gap-2.5">
              <li>
                <Link href="/company" className="tap transition-colors hover:text-white">
                  会社概要
                </Link>
              </li>
              <li>
                <Link href="/news" className="tap transition-colors hover:text-white">
                  お知らせ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="tap transition-colors hover:text-white">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <a href={site.lpUrl} target="_blank" rel="noopener" className="tap transition-colors hover:text-white">
                  AI導入補助金 特設サイト ↗
                </a>
              </li>
              <li>
                <a href={site.labUrl} target="_blank" rel="noopener" className="tap transition-colors hover:text-white">
                  AI集客ラボ (運営メディア) ↗
                </a>
              </li>
              <li>
                <Link href="/privacy" className="tap transition-colors hover:text-white">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="最新のお知らせ">
            <p className="eyebrow mb-4 !text-aqua">News</p>
            <ul className="grid gap-1 text-xs text-white/60 md:gap-2.5">
              {news.slice(0, 2).map((n) => (
                <li key={n.slug}>
                  <Link href={`/news/${n.slug}`} className="tap transition-colors hover:text-white">
                    <span className="num mr-2 text-white/60">{n.date}</span>
                    {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href="/contact"
            className="inline-block w-fit rounded-full border border-gold-bright/60 px-6 py-3 text-sm font-bold text-gold-bright transition-colors hover:bg-gold-bright hover:text-ink"
          >
            無料相談を予約する
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} {site.nameEn} All rights reserved.
          </p>
          {/* 外部プロフィール。構造化データの sameAs だけでは読者には見えないため、
              フッターから実際にたどれるようにする */}
          <ul className="flex list-none gap-2" aria-label="外部プロフィール">
            <li>
              <a
                href="https://www.linkedin.com/in/yu-haraguchi"
                target="_blank"
                rel="noopener me"
                aria-label="LinkedIn（原口 優）"
                className="tap inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-transparent hover:bg-[#0a66c2] hover:text-white"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
            </li>
            <li>
              <a
                href="https://note.com/yu_haraguchi"
                target="_blank"
                rel="noopener me"
                aria-label="note（原口 優）"
                className="tap inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-[.66rem] font-bold tracking-wide text-white/80 transition-colors hover:border-transparent hover:bg-[#41c9b4] hover:text-white"
              >
                note
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
