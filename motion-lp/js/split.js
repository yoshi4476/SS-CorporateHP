// data-anim-split: splits text into words (.w) and chars (.ch) while the
// original string is kept in aria-label, so screen readers read plain text.
// Words are kept whole (white-space: nowrap) so line wrapping is unchanged
// and letter-spacing / kerning context stays visually intact per word.

export function splitElement(el) {
  if (el.dataset.splitDone) return;
  const text = el.textContent;
  el.setAttribute("aria-label", text.trim());
  el.dataset.splitDone = "true";

  const frag = document.createDocumentFragment();
  let charIndex = 0;

  for (const word of text.split(/(\s+)/)) {
    if (!word) continue;
    if (/^\s+$/.test(word)) {
      frag.append(document.createTextNode(" "));
      continue;
    }
    const w = document.createElement("span");
    w.className = "w";
    w.setAttribute("aria-hidden", "true");
    for (const ch of word) {
      const c = document.createElement("span");
      c.className = "ch";
      c.style.setProperty("--i", charIndex++);
      c.textContent = ch;
      w.append(c);
    }
    frag.append(w);
  }

  el.replaceChildren(frag);
}

export function initSplit(root = document) {
  root.querySelectorAll("[data-anim-split]").forEach(splitElement);
}

// Re-plays the reveal of an already-split element (used by the showcase).
export function replay(el) {
  el.classList.remove("is-inview");
  void el.offsetWidth; // flush transition state once (intentional read)
  el.classList.add("is-inview");
}
