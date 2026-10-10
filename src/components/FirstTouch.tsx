"use client";

// 初めて開いたページの参照元と場所を覚える（src/lib/firstTouch.ts）。サイト内の移動では document.referrer が
// 変わらないため、最初に描いたときに1回だけ覚える
import { useEffect } from "react";
import { recordFirstTouch } from "@/lib/firstTouch";

export default function FirstTouch() {
  useEffect(() => {
    recordFirstTouch();
  }, []);
  return null;
}
