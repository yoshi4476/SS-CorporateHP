// Shared helpers.

export const lerp = (a, b, t) => a + (b - a) * t;

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Coarse pointers (touch devices) never get the custom cursor / magnetics.
export const hasFinePointer = () =>
  window.matchMedia("(pointer: fine)").matches;
