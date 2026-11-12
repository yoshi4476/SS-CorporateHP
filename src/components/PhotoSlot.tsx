import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { PHOTO_SLOTS, type PhotoSlotName } from "@/lib/photoSlots";

// 写真の枠（lib/photoSlots.ts）。ビルドのときに public/images/slots/<name>.webp があれば出し、無ければ何も出さない。
// サーバーで描く部品の中でだけ使う（ファイルの有無をビルド時に見るため）。

export function slotSrc(name: PhotoSlotName) {
  return `/images/slots/${name}.webp`;
}

export function hasSlot(name: PhotoSlotName) {
  return existsSync(join(process.cwd(), "public", "images", "slots", `${name}.webp`));
}

export default function PhotoSlot({
  name,
  className = "",
  sizes = "100vw",
  caption = true,
}: {
  name: PhotoSlotName;
  className?: string;
  sizes?: string;
  caption?: boolean;
}) {
  if (!hasSlot(name)) return null;
  const def = PHOTO_SLOTS[name];
  return (
    <figure className={`relative overflow-hidden ${className}`} style={{ aspectRatio: def.ratio }}>
      <Image src={slotSrc(name)} alt={def.alt} fill loading="lazy" sizes={sizes} className="object-cover" />
      {caption && (
        <figcaption className="absolute bottom-2 right-3 rounded bg-ink/55 px-1.5 py-0.5 text-[11px] text-white/90">※ 写真はイメージです</figcaption>
      )}
    </figure>
  );
}
