(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.remove('no-js');
  if (reduced) document.documentElement.classList.add('reduced');

  // 横にスクロールする表は、キーボードでも動かせるようにする（Web査定の結果など、あとから出る表も対象）
  const markScrollable = () => {
    document.querySelectorAll('.table-wrap').forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 1) {
        if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
        if (!el.hasAttribute('role')) el.setAttribute('role', 'region');
        if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', `${el.querySelector('caption')?.textContent.trim() || '表'}（横にスクロールできます）`);
      }
    });
  };
  let markTimer;
  const scheduleMark = () => { clearTimeout(markTimer); markTimer = setTimeout(markScrollable, 150); };
  addEventListener('load', markScrollable);
  addEventListener('resize', scheduleMark);
  new MutationObserver(scheduleMark).observe(document.body, { childList: true, subtree: true });

  const menuBtn = document.querySelector('.menu-btn');
  const drawer = document.getElementById('drawer');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }

  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    if (reduced) { el.textContent = target.toLocaleString('ja-JP', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); return; }
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toLocaleString('ja-JP', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counters = document.querySelectorAll('[data-count]');
  const reveals = document.querySelectorAll('.reveal');
  const flowLine = document.querySelector('.flow__line i');

  // GSAP が読めない環境（オフライン等）でも表示が崩れないよう IntersectionObserver にフォールバック
  if (!reduced && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    reveals.forEach((el) => {
      gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    });
    if (flowLine) gsap.to(flowLine, { width: '100%', ease: 'none', scrollTrigger: { trigger: '.flow', start: 'top 75%', end: 'bottom 55%', scrub: true } });
    counters.forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countUp(el) }));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.dataset.count) countUp(el);
        else { el.style.transition = 'opacity .8s ease, transform .8s ease'; el.style.opacity = 1; el.style.transform = 'none'; }
        io.unobserve(el);
      });
    }, { threshold: .15 });
    reveals.forEach((el) => io.observe(el));
    counters.forEach((el) => io.observe(el));
    if (flowLine) flowLine.style.width = '100%';
  }
})();
