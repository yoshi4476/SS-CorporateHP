/* 焼肉〇〇 — 季節の帳 */
(() => {
const init = () => {
  // load 済みなら即実行 (先読みページが後から開かれた場合も動くように)
  const onLoad = (fn) => (document.readyState === 'complete' ? fn() : window.addEventListener('load', fn));
  'use strict';

  const site = window.M_SITE || { lang: 'ja', season: 'autumn', alternates: {}, labels: {} };
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };
  root.classList.add('js-ready');

  /* ---------- header ---------- */
  const header = $('[data-header]');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-solid', y > 40);
    header.classList.toggle('is-hidden', y > 400 && y > lastY && !root.classList.contains('drawer-open'));
    lastY = y;
    const fr = $('[data-float-reserve]');
    if (fr) fr.style.opacity = y > innerHeight * 0.6 ? '1' : '0';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- drawer ---------- */
  const toggle = $('[data-menu-toggle]');
  const drawer = $('[data-drawer]');
  const setDrawer = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    drawer.hidden = !open;
    root.classList.toggle('drawer-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) $('a', drawer).focus();
  };
  toggle?.addEventListener('click', () => setDrawer(toggle.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) { setDrawer(false); toggle.focus(); } });

  /* ---------- opening (トップのみ・セッション1回) ---------- */
  const opening = $('[data-opening]');
  const runOpening = () => new Promise((resolve) => {
    let seen = false;
    try { seen = sessionStorage.getItem('m_opening') === '1'; } catch { /* noop */ }
    if (!opening || reduced || seen) { resolve(); return; }
    try { sessionStorage.setItem('m_opening', '1'); } catch { /* noop */ }
    opening.hidden = false;
    const end = () => { opening.classList.add('is-leaving'); setTimeout(() => opening.remove(), 800); resolve(); };
    $('[data-opening-skip]', opening).addEventListener('click', end, { once: true });
    setTimeout(end, 1900);
  });
  runOpening().then(() => document.dispatchEvent(new Event('m:opening-done')));

  /* ---------- ink text ---------- */
  // 文節ごとに折り返しを許し、語の途中で改行しないようにする (日本語・中国語)
  const phrases = (text) => {
    if (!window.Intl || !Intl.Segmenter || !/^(ja|zh)/.test(site.lang)) return text.split(/(\s+)/);
    const seg = new Intl.Segmenter(site.lang === 'ja' ? 'ja' : site.lang === 'zh-tw' ? 'zh-Hant' : 'zh-Hans', { granularity: 'word' });
    const out = [];
    for (const { segment, isWordLike } of seg.segment(text)) {
      const attach = out.length && (!isWordLike || /^[぀-ゟ]{1,2}$/.test(segment));
      if (attach && !/^\s+$/.test(segment)) out[out.length - 1] += segment; else out.push(segment);
    }
    return out;
  };
  $$('[data-ink]').forEach((el) => {
    el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          phrases(n.textContent).forEach((chunk) => {
            if (/^\s*$/.test(chunk)) { frag.append(chunk); return; }
            const ph = document.createElement('span');
            ph.className = 'ink-phrase';
            ph.setAttribute('aria-hidden', 'true');
            [...chunk].forEach((ch) => {
              const s = document.createElement('span');
              s.className = 'ink-char';
              s.style.setProperty('--c', i++);
              s.textContent = ch;
              ph.append(s);
            });
            frag.append(ph);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  });

  /* ---------- reveal on view ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add(e.target.matches('[data-ink]') ? 'is-inked' : 'is-open');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  $$('[data-ink], .reveal-shoji, [data-wheel]').forEach((el) => io.observe(el));

  /* ---------- count up ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || reduced) return;
      const el = e.target; const to = parseInt(el.dataset.count, 10); const t0 = performance.now();
      const step = (t) => { const p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => cio.observe(el));

  /* ---------- season: 地色・右端表示・舞うもの ---------- */
  const rail = $$('[data-rail]');
  const setSeason = (s) => {
    if (root.dataset.season === s && rail.some((a) => a.classList.contains('is-active'))) return;
    root.dataset.season = s;
    rail.forEach((a) => a.classList.toggle('is-active', a.dataset.rail === s));
    particles.set(s);
  };
  const seasonPage = $('[data-season-page]');

  /* ---------- particles ---------- */
  const particles = (() => {
    const canvas = $('[data-particles]');
    if (!canvas || reduced) return { set() {} };
    const ctx = canvas.getContext('2d');
    let w, h, dpr, items = [], kind = null, raf = 0;
    const colors = { spring: ['#f3c6cf', '#e8a3b2', '#fbe3e8'], summer: ['#e9f7a8', '#c9f08a'], autumn: ['#d9612e', '#b8431f', '#e39a3b', '#9e2f22'], winter: ['#ffffff', '#e6eef3'] };
    const resize = () => { dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const count = () => Math.round(Math.min(34, Math.max(12, (w * h) / 42000)));
    const spawn = (k, anywhere) => ({
      x: Math.random() * w, y: anywhere ? Math.random() * h : -20,
      r: k === 'summer' ? 1.6 + Math.random() * 1.6 : k === 'winter' ? 1 + Math.random() * 2.4 : k === 'autumn' ? 7 + Math.random() * 7 : 5 + Math.random() * 6,
      vx: (Math.random() - 0.5) * (k === 'summer' ? 0.35 : 0.6), vy: k === 'summer' ? (Math.random() - 0.5) * 0.3 : 0.35 + Math.random() * 0.7,
      a: Math.random() * Math.PI * 2, va: (Math.random() - 0.5) * 0.03, ph: Math.random() * 6.28,
      c: colors[k][Math.floor(Math.random() * colors[k].length)],
    });
    const drawPetal = (p) => { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(1, 0.55 + 0.35 * Math.sin(p.ph)); ctx.beginPath(); ctx.moveTo(0, -p.r); ctx.bezierCurveTo(p.r, -p.r, p.r, p.r * 0.6, 0, p.r); ctx.bezierCurveTo(-p.r, p.r * 0.6, -p.r, -p.r, 0, -p.r); ctx.fillStyle = p.c; ctx.globalAlpha = 0.75; ctx.fill(); ctx.restore(); };
    // 楓: 正規化した輪郭 (上が先端、下が葉柄)
    const maple = [[0,-1],[.13,-.58],[.38,-.78],[.3,-.38],[.86,-.5],[.6,-.16],[.96,.06],[.5,.12],[.56,.44],[.14,.28],[.04,.62],[-.04,.62],[-.14,.28],[-.56,.44],[-.5,.12],[-.96,.06],[-.6,-.16],[-.86,-.5],[-.3,-.38],[-.38,-.78],[-.13,-.58]];
    const drawLeaf = (p) => { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(p.r * (0.75 + 0.25 * Math.sin(p.ph)), p.r); ctx.beginPath(); maple.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = p.c; ctx.globalAlpha = 0.72; ctx.fill(); ctx.beginPath(); ctx.moveTo(0, .6); ctx.lineTo(0, 1.05); ctx.lineWidth = 0.08; ctx.strokeStyle = p.c; ctx.stroke(); ctx.restore(); };
    const drawGlow = (p) => { const g = 0.35 + 0.65 * Math.abs(Math.sin(p.ph)); ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fillStyle = p.c; ctx.globalAlpha = g * 0.12; ctx.fill(); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.globalAlpha = g; ctx.fill(); ctx.globalAlpha = 1; };
    const drawSnow = (p) => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.c; ctx.globalAlpha = 0.75; ctx.fill(); ctx.globalAlpha = 1; };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of items) {
        p.ph += 0.03; p.a += p.va;
        p.x += p.vx + (kind === 'summer' ? Math.sin(p.ph) * 0.25 : Math.sin(p.ph * 0.5) * 0.35);
        p.y += p.vy + (kind === 'summer' ? Math.cos(p.ph * 0.7) * 0.2 : 0);
        if (p.y > h + 20 || p.x < -30 || p.x > w + 30 || (kind === 'summer' && (p.y < -20))) Object.assign(p, spawn(kind, kind === 'summer'));
        ({ spring: drawPetal, summer: drawGlow, autumn: drawLeaf, winter: drawSnow })[kind](p);
      }
      raf = requestAnimationFrame(tick);
    };
    resize();
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden && kind) raf = requestAnimationFrame(tick); });
    return {
      set(k) {
        if (k === kind) return;
        kind = k;
        items = Array.from({ length: count() }, () => spawn(k, true));
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      },
    };
  })();

  if (seasonPage) setSeason(seasonPage.dataset.seasonPage);
  else setSeason(site.season);
  const chapters = $$('[data-chapter]');
  if (chapters.length) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setSeason(e.target.dataset.chapter); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    chapters.forEach((c) => sio.observe(c));
  }

  /* ---------- parallax ---------- */
  onLoad(() => {
    if (reduced) return;
    // スクロールはブラウザ標準のまま (横取りすると入れ子のスクロールやページ内リンクが効かなくなるため)
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      $$('.chapter__kanji, .season-hero__kanji').forEach((k) => {
        window.gsap.fromTo(k, { yPercent: -18 }, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: k.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      $$('.chapter__media img, .proof__media img').forEach((img) => {
        window.gsap.fromTo(img, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }
  });

  /* ---------- hero video (YouTube, 移行元の動画) ---------- */
  const heroVideo = $('[data-hero-video]');
  if (heroVideo && site.video && !reduced && !saveData && innerWidth > 860) {
    onLoad(() => setTimeout(() => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${site.video}?autoplay=1&mute=1&loop=1&playlist=${site.video}&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
      iframe.title = 'Yakiniku 〇〇';
      iframe.allow = 'autoplay; encrypted-media';
      iframe.tabIndex = -1;
      iframe.setAttribute('aria-hidden', 'true');
      // YouTube は再生開始直後と一時停止中にタイトル・操作ボタンを重ねて表示する。
      // 「再生中」の通知を受けてから、それらが消える数秒後に動画を見せ、停止中は写真に戻す。
      const send = (msg) => iframe.contentWindow && iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
      let revealTimer = 0;
      const reveal = () => { clearTimeout(revealTimer); revealTimer = setTimeout(() => heroVideo.classList.add('is-playing'), 3800); };
      const conceal = () => { clearTimeout(revealTimer); heroVideo.classList.remove('is-playing'); };
      addEventListener('message', (e) => {
        if (!/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
        let d; try { d = JSON.parse(e.data); } catch { return; }
        const state = d.event === 'onStateChange' ? d.info : d.info && d.info.playerState;
        if (state === 1) { if (!heroVideo.classList.contains('is-playing')) reveal(); }
        else if (state === 2 || state === 0 || state === -1) conceal();
      });
      iframe.addEventListener('load', () => {
        send({ event: 'listening', id: 1, channel: 'widget' });
        send({ event: 'command', func: 'addEventListener', args: ['onStateChange'] });
      });
      heroVideo.append(iframe);
      const btn = $('[data-video-toggle]');
      btn.hidden = false;
      btn.addEventListener('click', () => {
        const paused = btn.getAttribute('aria-pressed') === 'true';
        send({ event: 'command', func: paused ? 'playVideo' : 'pauseVideo', args: [] });
        if (!paused) conceal();
        btn.setAttribute('aria-pressed', String(!paused));
        $('.visually-hidden', btn).textContent = paused ? site.labels.pause : site.labels.play;
      });
    }, 1500));
  }

  /* ---------- sliders ---------- */
  onLoad(() => {
    if (!window.Swiper) return;
    $$('[data-slider]').forEach((el) => {
      const sw = new window.Swiper(el, {
        effect: 'fade', loop: true, speed: 1600, fadeEffect: { crossFade: true },
        autoplay: reduced ? false : { delay: 5200, disableOnInteraction: false },
        a11y: { enabled: true },
      });
      const btn = $('[data-slider-pause]', el);
      if (reduced && btn) btn.hidden = true;
      btn?.addEventListener('click', () => {
        const paused = btn.getAttribute('aria-pressed') === 'true';
        paused ? sw.autoplay.start() : sw.autoplay.stop();
        btn.setAttribute('aria-pressed', String(!paused));
        $('.visually-hidden', btn).textContent = paused ? site.labels.pause : site.labels.play;
      });
    });
  });

  /* ---------- 指差し注文モード ---------- */
  const staff = $('[data-staff-mode]');
  staff?.addEventListener('click', () => {
    const on = staff.getAttribute('aria-pressed') !== 'true';
    staff.setAttribute('aria-pressed', String(on));
    $('[data-menu-body]').classList.toggle('is-staff-mode', on);
  });

  /* ---------- 住所カード ---------- */
  const addrBtn = $('[data-address-card]');
  const addrDlg = $('[data-address-dialog]');
  addrBtn?.addEventListener('click', () => addrDlg.showModal());

  /* ---------- 参考為替 (日本語以外) ---------- */
  if (site.fx) {
    const cur = { en: 'USD', 'zh-cn': 'CNY', 'zh-tw': 'TWD', ko: 'KRW' }[site.lang];
    const locale = { en: 'en-US', 'zh-cn': 'zh-CN', 'zh-tw': 'zh-TW', ko: 'ko-KR' }[site.lang];
    const apply = (rate) => {
      const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency: cur, maximumFractionDigits: cur === 'KRW' || cur === 'TWD' ? 0 : 0 });
      $$('.price[data-yen]').forEach((p) => {
        if ($('.price__fx', p)) return;
        const s = document.createElement('span');
        s.className = 'price__fx';
        s.textContent = `≈ ${fmt.format(p.dataset.yen * rate)}`;
        p.append(s);
      });
    };
    const cached = JSON.parse(store.get('m_fx') || 'null');
    if (cached && cached.cur === cur && Date.now() - cached.t < 43200000) apply(cached.rate);
    else fetch('https://open.er-api.com/v6/latest/JPY').then((r) => r.json()).then((d) => {
      const rate = d && d.rates && d.rates[cur];
      if (!rate) return;
      store.set('m_fx', JSON.stringify({ cur, rate, t: Date.now() }));
      apply(rate);
    }).catch(() => {});
  }
};
// 裏で先読み (prerender) されている間は演出を始めず、実際に開かれてから始める
document.prerendering ? document.addEventListener('prerenderingchange', init, { once: true }) : init();
})();
