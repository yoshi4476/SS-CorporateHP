import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * ページ個別のメタ情報を組み立てる。
 *
 * これまで openGraph を書いていたのは記事ページだけで、それ以外は
 * layout.tsx の既定値をそのまま継承していた。つまり事業ページをLINEやXで
 * 共有すると、どのページでも「セブンセンシズ株式会社|AIコンサルティング…」
 * と会社紹介の見出しで出ていた。共有された瞬間に用件が分からないので踏まれない。
 *
 * title は検索結果の表示幅 (日本語で約32字) に収める前提で書く。
 * 接尾辞の「|セブンセンシズ」は layout.tsx の template が付けるので、
 * ここに渡す title には含めない。
 */
export function pageMeta({
  title,
  description,
  path,
  image = "/ogp.png",
  type = "website",
}: {
  /** 接尾辞を除いた本題。24字までに収める */
  title: string;
  description: string;
  /** 先頭スラッシュ付きのパス */
  path: string;
  /** 省略時は共通のOGP画像 */
  image?: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title}｜${site.name}`,
      description,
      url: `${site.url}${path}`,
      type,
      // Next は openGraph を浅くマージする。ページ側で openGraph を書いた時点で
      // layout.tsx の images は引き継がれないため、ここで必ず入れる。
      images: [{ url: image }],
    },
  };
}
