import { coDeveloper, developer, developerOrg, products, type ProductKey } from "@/lib/developer";

/** 製品ページの下に置く開発者の表記。開発の経緯は開発元のプレスリリースへ */
export default function DeveloperCredit({ product, label }: { product: ProductKey; label?: string }) {
  const p = products[product];
  return (
    <section className="border-t border-line bg-mist py-10">
      <div className="mx-auto max-w-5xl px-6 text-sm leading-7 text-slate">
        <p>
          {label ? `${label}の` : ""}開発：{developer.name}（{developerOrg.name}）
          {p.withCo && <>／共同開発：{coDeveloper.name}</>}
        </p>
        <p>
          <a href={p.press} target="_blank" rel="noopener" className="font-bold text-ink underline underline-offset-4">
            {p.name}の開発の経緯（プレスリリース）
          </a>
        </p>
      </div>
    </section>
  );
}
