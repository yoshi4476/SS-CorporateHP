// Visibility triggers: any element with data-anim-fade / data-anim-split
// gets .is-inview once, when ~15% enters the viewport.
// Works unchanged inside the transformed smooth-scroll layer, because
// IntersectionObserver reads post-transform geometry.

export function initObserver(root = document) {
  const targets = root.querySelectorAll("[data-anim-fade], [data-anim-split]");

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-inview");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
  );

  targets.forEach((el) => io.observe(el));
  return io;
}

// Reduced motion: reveal everything immediately, observe nothing.
export function revealAll(root = document) {
  root
    .querySelectorAll("[data-anim-fade], [data-anim-split]")
    .forEach((el) => el.classList.add("is-inview"));
}
