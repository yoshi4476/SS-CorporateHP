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
              <Link href="/media-pipeline" className="tap transition-colors hover:text-white">
                SEOオウンドメディア全自動パイプライン
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
            className="inline-block w-fit rounded-full border border-aqua/60 px-6 py-3 text-sm font-bold text-aqua transition-colors hover:bg-aqua hover:text-ink"
          >
            無料相談を予約する
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-white/60">
          © {new Date().getFullYear()} {site.nameEn} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
