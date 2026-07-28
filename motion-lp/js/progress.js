// rAF-driven progress system.
//
// data-anim-progress : element gets a --progress custom property (0..1)
//   representing its journey through the viewport. Pure CSS then maps it
//   to transforms (scaleX bars, rotations, ...). Optional children:
//     [data-progress-text]  -> live percentage readout
//     [data-anim-words]     -> words toggled .is-on as progress advances
//
// data-anim-sticky : pinned inside its (taller) parent by translate3d,
//   emulating position: sticky inside the transformed scroll layer.
//   Layout is never touched -> no reflow, no layout shift.

import { clamp } from "./utils.js";

export class ProgressSystem {
  constructor(root = document) {
    this.items = [...root.querySelectorAll("[data-anim-progress]")].map((el) => ({
      el,
      text: el.querySelector("[data-progress-text]"),
      words: el.querySelectorAll("[data-anim-words] .word"),
      last: -1,
    }));
    this.stickies = [...root.querySelectorAll("[data-anim-sticky]")];
    this.vh = window.innerHeight;
    addEventListener("resize", () => (this.vh = window.innerHeight), { passive: true });
  }

  // called once per rAF from main.js. getBoundingClientRect() on
  // transform-moved elements is a cheap read (no reflow is triggered,
  // since only compositor properties change between frames).
  update() {
    for (const item of this.items) {
      const r = item.el.getBoundingClientRect();
      const total = this.vh + r.height;
      const p = clamp((this.vh - r.top) / total, 0, 1);
      if (Math.abs(p - item.last) < 0.001) continue;
      item.last = p;
      item.el.style.setProperty("--progress", p.toFixed(4));

      if (item.text) item.text.textContent = String(Math.round(p * 100)).padStart(3, "0");

      if (item.words.length) {
        // pinned sections: usable progress is the pinned span only
        const active = Math.floor(p * (item.words.length + 2));
        item.words.forEach((w, i) => w.classList.toggle("is-on", i < active));
      }
    }

    for (const el of this.stickies) {
      const parent = el.parentElement.getBoundingClientRect();
      const offset = clamp(-parent.top, 0, parent.height - this.vh);
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
  }
}
