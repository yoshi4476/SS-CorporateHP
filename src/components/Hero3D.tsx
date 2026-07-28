"use client";

import dynamic from "next/dynamic";

const Hero3DCanvas = dynamic(() => import("./Hero3DCanvas"), {
  ssr: false,
  loading: () => <div aria-hidden className="h-full w-full" />,
});

export default function Hero3D({
  className,
  offset,
}: {
  className?: string;
  offset?: [number, number, number];
}) {
  return (
    <div className={className} aria-hidden>
      <Hero3DCanvas offset={offset} />
    </div>
  );
}
