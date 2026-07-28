// Inertia scroll: the page scrolls natively (real scrollbar, real anchors,
// no scroll hijacking) while a fixed layer is interpolated toward
// window.scrollY with lerp. Transform-only -> zero layout shift.

import { lerp } from "./utils.js";

export class SmoothScroll {
  constructor(content, { ease = 0.09 } = {}) {
    this.content = content;
    this.ease = ease;
    this.current = window.scrollY;
    this.target = window.scrollY;

    document.documentElement.classList.add("has-smooth");
    this.setHeight();

    // keep body height in sync with the fixed layer's content
    this.ro = new ResizeObserver(() => this.setHeight());
    this.ro.observe(content);
  }

  setHeight() {
    document.body.style.height = `${this.content.scrollHeight}px`;
  }

  // called once per rAF from main.js
  update() {
    this.target = window.scrollY;
    this.current = lerp(this.current, this.target, this.ease);
    if (Math.abs(this.target - this.current) < 0.05) this.current = this.target;
    this.content.style.transform = `translate3d(0, ${-this.current}px, 0)`;
  }
}
