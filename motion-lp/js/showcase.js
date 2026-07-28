// Showcase-only behaviour: the split replay button and the cursor pad.

import { replay } from "./split.js";
import { lerp, hasFinePointer } from "./utils.js";

export function initShowcase() {
  // demo 2 — replay the char reveal on demand
  const line = document.querySelector("#split-demo-line");
  const btn = document.querySelector("#split-replay");
  if (line && btn) btn.addEventListener("click", () => replay(line));

  // demo 3 — a follower that trails the pointer inside the pad
  const pad = document.querySelector("#cursor-pad");
  const follower = pad?.querySelector(".pad-follower");
  if (!pad || !follower || !hasFinePointer()) return;

  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

  const tick = () => {
    cx = lerp(cx, tx, 0.12);
    cy = lerp(cy, ty, 0.12);
    follower.style.transform = `translate3d(${cx - 36}px, ${cy - 36}px, 0)`;
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.1 ? requestAnimationFrame(tick) : null;
  };

  pad.addEventListener("mousemove", (e) => {
    const r = pad.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    if (raf === null) raf = requestAnimationFrame(tick);
  }, { passive: true });
}
