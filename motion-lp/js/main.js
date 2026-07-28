// Motif — entry point.
//
// Declarative API recap (put these on any element, then just load main.js):
//   data-anim-fade      fade + rise on viewport entry (opt: style="--d:.2s")
//   data-anim-split     split into chars, staggered reveal on entry
//   data-anim-progress  element receives --progress (0..1) each frame;
//                       children may use [data-progress-text] / [data-anim-words]
//   data-anim-sticky    transform-pinned inside its taller parent
//   data-magnetic       magnetic hover (fine pointers only)
//
// Reduced motion: no smooth scroll, no cursor, no progress loop —
// content is fully revealed and natively scrollable.

import { prefersReducedMotion, hasFinePointer } from "./utils.js";
import { SmoothScroll } from "./smoothScroll.js";
import { initSplit } from "./split.js";
import { initObserver, revealAll } from "./observer.js";
import { ProgressSystem } from "./progress.js";
import { Cursor } from "./cursor.js";
import { initShowcase } from "./showcase.js";

initSplit();

if (prefersReducedMotion()) {
  revealAll();
} else {
  initObserver();
  initShowcase();

  const fine = hasFinePointer();
  // On touch devices we keep native scrolling (no fixed layer):
  // momentum scrolling on mobile OSes is already inertial.
  const smooth = fine ? new SmoothScroll(document.querySelector("#smooth-content")) : null;
  const progress = new ProgressSystem();
  const cursor = fine ? new Cursor() : null;

  const loop = () => {
    smooth?.update();
    progress.update();
    cursor?.update();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
