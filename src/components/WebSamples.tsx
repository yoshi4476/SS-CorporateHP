import Image from "next/image";
import { Reveal } from "@/components/motion";
import { SectionHead } from "@/components/ui";
import { developerOrg } from "@/lib/developer";
import { webSamples } from "@/lib/webSamples";

/** HP/LP制作のページの「制作見本」。写真を押すと、見本のサイトが新しいタブで開く */
export default function WebSamples() {
  return (
    <section id="samples" className="scroll-mt-24 border-t border-line bg-mist py-20 md:py-24" aria-labelledby="samples-heading" data-area="制作見本" data-area-id="samples">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHead
          id="samples-heading"
          title="サイトの制作見本"
          lead={`当社の顧問、${developerOrg.name} が制作したサイトの見本を、例としてご紹介します。社名と連絡先は伏せ、実際に動く見本を公開しています。`}
        />
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {webSamples.map((s, i) => (
            <li key={s.id}>
              <Reveal delay={(i % 3) * 0.08}>
                <a href={s.url} target="_blank" rel="noopener" className="group grid gap-3 rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                  <span className="block overflow-hidden rounded-2xl border border-line bg-white shadow-card">
                    <Image
                      src={`/images/works/${s.id}-1200.webp`}
                      alt={`${s.name}（制作見本）のトップページ`}
                      width={1200}
                      height={750}
                      loading="lazy"
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  </span>
                  <span className="mt-1 text-[13px] text-slate">{s.who}（社名は非公開）</span>
                  <span className="text-lg font-bold leading-snug group-hover:underline group-hover:underline-offset-4">{s.name}</span>
                  <span className="text-sm leading-7 text-slate">{s.text}</span>
                  <span className="text-sm font-bold text-pulse">見本のサイトを見る（新しいタブ）</span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm leading-7 text-slate">
          ※ 制作：{developerOrg.name}（当社の顧問）。社名・人名・電話・住所・ロゴは伏せ、名前の分かる人物の写真はぼかしています。見本のため、問い合わせや予約のフォームは送信できません。
        </p>
      </div>
    </section>
  );
}
