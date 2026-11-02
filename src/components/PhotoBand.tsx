import Image from "next/image";

// 文字の多いページで、大きな区画の切れ目に入れる横幅いっぱいの写真の帯。
// 写真は「裏方で支える」の連作（生成したイメージ写真で、支援先の写真ではない）
export default function PhotoBand({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="relative h-52 overflow-hidden md:h-[360px]" aria-label={alt}>
      <Image src={src} alt={alt} fill loading="lazy" sizes="100vw" className="object-cover" />
      <figcaption className="absolute bottom-3 right-4 text-xs text-white/80">※ 写真はイメージです</figcaption>
    </figure>
  );
}
