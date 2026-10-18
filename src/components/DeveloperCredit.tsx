import { coDeveloper, developer, developerOrg, products, type ProductKey } from "@/lib/developer";

/** 製品ページの下に置く開発者の表記。開発の経緯は開発元のプレスリリースへ */
export default function DeveloperCredit({ product, label }: { product: ProductKey; label?: string }) {
  const p = products[product];
  return (
    <section className="border-t border-line bg-mist py-8">
      <div className="mx-auto max-w-7xl px-5 text-sm leading-7 text-slate md:px-8">
        <p>
          {label ? `${label}の` : ""}開発：{developer.name}（{developerOrg.name}）
          {p.withCo && <>／共同開発：{coDeveloper.name}</>}
        </p>
        <p>
          <a href={p.press} target="_blank" rel="noopener" className="link-u">
            {p.name}の開発の経緯（プレスリリース）
          </a>
        </p>
      </div>
    </section>
  );
}
