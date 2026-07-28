// Custom cursor: a dot (fast lerp) + a ring (slow lerp) trail the real
// pointer. Elements with [data-magnetic] pull themselves and the ring
// toward the pointer while hovered. Interactive elements grow the ring.
// Never initialized on coarse pointers or with reduced motion (main.js).

import { lerp } from "./utils.js";

const MAGNET_STRENGTH = 0.32;

export class Cursor {
  constructor() {
    this.dot = document.createElement("div");
    this.dot.className = "cursor-dot";
    this.ring = document.createElement("div");
    this.ring.className = "cursor-ring";
    document.body.append(this.dot, this.ring);
    document.documentElement.classList.add("has-cursor");

    this.x = innerWidth / 2;
    this.y = innerHeight / 2;
    this.dotPos = { x: this.x, y: this.y };
    this.ringPos = { x: this.x, y: this.y };
    this.magnet = null; // active magnetic target

    addEventListener("mousemove", (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
    }, { passive: true });

    // ring grows over anything interactive
    document.querySelectorAll("a, button, [data-cursor-grow]").forEach((el) => {
      el.addEventListener("mouseenter", () => this.ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => this.ring.classList.remove("is-hover"));
    });

    // magnetic elements: translate toward the pointer while hovered
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate3d(${dx * MAGNET_STRENGTH}px, ${dy * MAGNET_STRENGTH}px, 0)`;
        this.magnet = el;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform .5s cubic-bezier(.22,1,.36,1)";
        el.style.transform = "translate3d(0,0,0)";
        setTimeout(() => (el.style.transition = ""), 500);
        this.magnet = null;
      });
    });
  }

  // called once per rAF from main.js
  update() {
    // ring snaps to the center of an active magnetic target
    let tx = this.x;
    let ty = this.y;
    if (this.magnet) {
      const r = this.magnet.getBoundingClientRect();
      tx = r.left + r.width / 2;
      ty = r.top + r.height / 2;
    }
    this.dotPos.x = lerp(this.dotPos.x, this.x, 0.4);
    this.dotPos.y = lerp(this.dotPos.y, this.y, 0.4);
    this.ringPos.x = lerp(this.ringPos.x, tx, 0.14);
    this.ringPos.y = lerp(this.ringPos.y, ty, 0.14);
    this.dot.style.transform = `translate3d(${this.dotPos.x}px, ${this.dotPos.y}px, 0)`;
    this.ring.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0)`;
  }
}
