import Link from "next/link";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="pt-16 md:pt-[72px]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm font-bold text-slate">
          <span className="num">404</span>　ページが見つかりません
        </p>
        <h1 className="mt-4 text-[2rem] font-bold leading-[1.3] md:text-5xl">
          お探しのページが
          <br />
          見つかりませんでした。
        </h1>
        <p className="mt-6 max-w-[40em] text-base leading-[1.9] text-slate">
          URLが変更されたか、削除された可能性があります。お探しの内容は以下のいずれかかもしれません。
          見つからない場合は、お気軽にお問い合わせください。
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link href="/" className="btn btn-primary">
            トップページへ戻る
          </Link>
          <Link href="/contact" className="link-u inline-flex min-h-11 items-center text-[15px]">
            お問い合わせ
          </Link>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-12">
          <nav aria-label="事業内容" className="border-t border-ink pt-5 md:col-span-7">
            <p className="text-sm font-bold">事業内容</p>
            <ul className="mt-3 grid sm:grid-cols-2 sm:gap-x-6">
              {services.map((s) => (
                <li key={s.slug} className="border-b border-line">
                  <Link href={`/services/${s.slug}`} className="flex min-h-12 items-center text-[15px] transition-colors hover:text-pulse">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-ink pt-5 md:col-span-5">
            <p className="text-sm font-bold">会社情報</p>
            <ul className="mt-3">
              {[
                ["/services", "事業内容一覧"],
                ["/company", "会社概要"],
                ["/blog", "経理BPOブログ"],
                ["/news", "お知らせ"],
                ["/privacy", "プライバシーポリシー"],
              ].map(([href, label]) => (
                <li key={href} className="border-b border-line">
                  <Link href={href} className="flex min-h-12 items-center text-[15px] transition-colors hover:text-pulse">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-7 text-slate">
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
