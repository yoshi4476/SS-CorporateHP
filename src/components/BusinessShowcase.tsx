import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { services } from "@/lib/services";

// 事業の一覧。写真をカードの背景として全面に敷き、暗くかぶせて白文字を載せる。
// 先頭だけ全幅で大きく置き、残りは3枚ずつ2段。7事業でも最終行に穴が空かない。

const SPAN = ["lg:col-span-6", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];
const HEIGHT = ["h-[420px] md:h-[460px]", "h-[320px]", "h-[320px]", "h-[320px]", "h-[320px]", "h-[320px]", "h-[320px]"];

export default function BusinessShowcase() {
  return (
    <div className="grid gap-4 lg:grid-cols-6">
      {services.map((s, i) => {
        const featured = i === 0;
        return (
          <Reveal
            key={s.slug}
            delay={(i % 3) * 0.08}
            className={`${SPAN[i] ?? "lg:col-span-2"} min-w-0`}
          >
            <Link
              href={`/services/${s.slug}`}
              className={`group relative flex ${HEIGHT[i] ?? "h-[300px]"} w-full flex-col justify-end overflow-hidden rounded-2xl bg-ink`}
            >
              {/*
                写真がある事業は、写真を面として敷き暗くかぶせる。
                合う写真がない事業に不適合な画像を敷くと破綻するため、
                その場合は罫線と活字だけで組む。
              */}
              {s.cardImage ? (
                <>
                  <Image
                    src={s.cardImage.src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(to top, rgb(13 20 32 / 0.92) 0%, rgb(13 20 32 / 0.72) 38%, rgb(13 20 32 / 0.38) 70%, rgb(13 20 32 / 0.25) 100%)",
                    }}
                  />
                </>
              ) : (
                <>
                  <span aria-hidden className="grid-field-dark absolute inset-0 opacity-70" />
                  <span
                    aria-hidden
                    className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 70% at 78% 12%, rgb(28 63 124 / 0.55), transparent 62%)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="num absolute left-6 top-5 select-none text-[5rem] font-bold leading-none text-white/[0.07] md:left-8 md:top-6 md:text-[7rem]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </>
              )}

              {/* 右上の丸ボタン */}
              <span
                aria-hidden
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/35 text-white transition-all duration-500 group-hover:border-aqua group-hover:bg-aqua group-hover:text-ink md:right-6 md:top-6"
              >
                <svg width="16" height="16" viewBox="0 0 14 14" className="transition-transform duration-500 group-hover:-rotate-45">
                  <path d="M2 7h9M8 3.5L11.5 7 8 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </span>

              <div className="relative p-6 md:p-8">
                <p className="font-data text-[0.6rem] uppercase tracking-[0.28em] text-aqua">{s.en}</p>
                <h3
                  className={`mt-2 font-black leading-snug text-white ${
                    featured ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"
                  }`}
                >
                  {s.name}
                </h3>
                <p
                  className={`mt-3 max-w-xl leading-7 text-white/75 ${
                    featured ? "text-sm md:text-base" : "text-xs md:text-sm"
                  }`}
                >
                  {featured ? s.lead : s.short}
                </p>
                {s.price && (
                  <p className="mt-4 inline-block rounded-full border border-white/25 px-3 py-1 text-[0.62rem] font-bold text-white/80">
                    {s.price.split(" /")[0]}
                  </p>
                )}
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
