// 演出は後付け。JSが動かなくても本文はすべて表示される。
// スクロールの検知は IntersectionObserver だけ（スクロールイベントを常時監視しない）。
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dl = (window.dataLayer = window.dataLayer || []);
  const hasIO = 'IntersectionObserver' in window;
  // 画面に出す短い文言（ページの言語で切り替える）
  const I18N = {
    ja: { menu: 'メニュー', close: '閉じる', stop: '写真の動きを止める', play: '写真の動きを再開する', req: 'この項目を入力してください。', mail: 'メールアドレスの形式で入力してください（例：info@example.com）。' },
    en: { menu: 'Menu', close: 'Close', stop: 'Pause photo motion', play: 'Resume photo motion', req: 'Please fill in this field.', mail: 'Please enter a valid email address (e.g. info@example.com).' },
    hi: { menu: 'मेनू', close: 'बंद करें', stop: 'फ़ोटो की गति रोकें', play: 'फ़ोटो की गति फिर शुरू करें', req: 'कृपया यह जानकारी भरें।', mail: 'कृपया सही ईमेल पता लिखें (जैसे info@example.com)।' },
  };
  const L = I18N[root.lang] || I18N.ja;

  // ---- Signature：線の図（サービス概要の流れ）が画面に入ったら描く
  const lines = document.querySelectorAll('.flow, .connect, .ribbon');
  if (reduce || !hasIO) {
    lines.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -25% 0px' });
    lines.forEach((el) => io.observe(el));
  }

  // ---- スクロールで現れる：カードや行を、同じ並びの中で少しずつずらして表示する
  const RV = '.imp-msg, .imp-stats > li, .dx-types > li, .dx-flow > li, .dx-alt > li, .lp-head, .lp-about h2, .lp-rows > li > figure, .lp-bridge, .lp-rows > li, .lp-cards > li, .bubbles > li, .lp-steps > li, .lp-tiles > a, .lp-next, .facts > li, .unis, .pick, .can-list > li, .svc-intro, .svc-row, .col-grid > li, .start-card, .cv2-card, .news-rows > li, .news-list > li';
  if (!reduce && hasIO) {
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll(RV).forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) return; // 最初の画面にあるものは動かさない
      const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.setProperty('--d', String(Math.min(sib, 5)));
      el.classList.add('rv');
      rio.observe(el);
    });
  }

  // ---- 下層ページの流れ：読み進み具合のバーと、いま何章目か
  const chs = [...document.querySelectorAll('.lp-ch')];
  if (chs.length) {
    const bar = document.createElement('div');
    bar.className = 'lp-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.append(bar);
    const now = document.querySelector('.lp-now');
    const cur = now && now.querySelector('.lp-now-cur b');
    const curT = now && now.querySelector('.lp-now-t');
    const links = now ? [...now.querySelectorAll('ol a')] : [];
    let ticking = false;
    const update = () => {
      ticking = false;
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty('--p', h > 0 ? (scrollY / h).toFixed(4) : 0);
      if (!now) return;
      let idx = 0;
      chs.forEach((c, i) => { if (c.getBoundingClientRect().top < innerHeight * 0.4) idx = i; });
      const first = chs[0].getBoundingClientRect().top < innerHeight * 0.6;
      const end = document.querySelector('.end-block');
      const atEnd = end && end.getBoundingClientRect().top < innerHeight * 0.8;
      now.classList.toggle('is-on', first && !atEnd);
      cur.textContent = chs[idx].dataset.ch;
      curT.textContent = chs[idx].dataset.chTitle;
      links.forEach((a, i) => a.setAttribute('aria-current', String(i === idx)));
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update, { passive: true });
    update();
  }
  if (!reduce && hasIO) {
    const about = document.querySelector('.lp-ch.lp-about .container');
    if (about && about.getBoundingClientRect().top > innerHeight) {
      about.classList.add('rv-num');
      new IntersectionObserver(([e], o) => { if (e.isIntersecting) { about.classList.add('in'); o.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' }).observe(about);
    }
  }

  // ---- 数字のカウントアップ（data-count を持つ数字だけ。1.2秒）
  const counts = document.querySelectorAll('[data-count]');
  if (!reduce && hasIO && counts.length) {
    const fmt = new Intl.NumberFormat('ja-JP');
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        const el = e.target, to = Number(el.dataset.count), t0 = performance.now();
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / 1200);
          el.textContent = fmt.format(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counts.forEach((el) => cio.observe(el));
  }

  // ---- 3つのサービス：スクロールに合わせて写真と線の進み具合を切り替える（スクロールは乗っ取らない）
  const story = document.querySelector('.story');
  if (story && hasIO) {
    const frames = story.querySelectorAll('.story-frame');
    const steps = story.querySelectorAll('.story-step');
    const counter = story.querySelector('.story-count b');
    const setStep = (n) => {
      frames.forEach((f) => f.classList.toggle('is-active', f.dataset.step === n));
      steps.forEach((s) => s.classList.toggle('is-active', s.dataset.step === n));
      story.style.setProperty('--story', (Number(n) - 1) / (steps.length - 1));
      if (counter) counter.textContent = n;
    };
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setStep(e.target.dataset.step); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((s) => sio.observe(s));
  }

  // ---- トップ：写真の上では透明なヘッダー。少しスクロールしたら白に
  const hero = document.querySelector('.hx');
  const sentinel = document.querySelector('.hx-sentinel');
  if (sentinel && hasIO) {
    new IntersectionObserver(([e]) => {
      document.body.classList.toggle('is-scrolled', !e.isIntersecting);
    }).observe(sentinel);
  }

  // ---- 追従する診断ボタン：最初の画面を過ぎたら出し、最後の CTA・フッターでは隠す
  const floatCta = document.querySelector('.float-cta');
  const skipFloat = /^\/(diagnosis|contact|download)\//.test(location.pathname);
  if (floatCta && hasIO && !skipFloat) {
    const firstView = hero || document.querySelector('.page-hero, .dx-stage');
    const endZones = document.querySelectorAll('.cta-final, .end-block, .site-footer');
    let pastFirst = false;
    const inEnd = new Set();
    const update = () => floatCta.classList.toggle('is-shown', pastFirst && inEnd.size === 0);
    if (firstView) {
      new IntersectionObserver(([e]) => { pastFirst = !e.isIntersecting; update(); }).observe(firstView);
    }
    const endIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) inEnd.add(e.target); else inEnd.delete(e.target); });
      update();
    });
    endZones.forEach((z) => endIO.observe(z));
  }

  // ---- ページの切り替え（クリックで線が横切ってから移動）
  if (!reduce) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      e.preventDefault();
      try { sessionStorage.setItem('i2j-nav', '1'); } catch (err) {}
      root.classList.remove('pt-first', 'pt-enter');
      const EN = [['/service/', 'Service'], ['/talent/', 'Talent'], ['/solutions/', 'Solutions'], ['/flow/', 'Flow'], ['/faq/', 'FAQ'],
        ['/column/', 'Column'], ['/news/', 'News'], ['/company/', 'Company'], ['/price/', 'Price'], ['/cases/', 'Cases'],
        ['/download', 'Document'], ['/contact', 'Contact'], ['/diagnosis/', 'Diagnosis'], ['/recruit/', 'Recruit'], ['/privacy/', 'Privacy']];
      const base = url.pathname.replace(/^\/(en|hi)(?=\/)/, '');
      const label = (a.querySelector('.t, b, h3')?.textContent || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 36);
      const en = (EN.find(([k]) => base.startsWith(k)) || [, base === '/' ? 'Home' : 'Next'])[1];
      const HI = { Service: 'सेवा', Talent: 'प्रतिभा', Solutions: 'समाधान', Flow: 'प्रक्रिया', FAQ: 'सामान्य प्रश्न', Column: 'कॉलम', News: 'समाचार',
        Company: 'कंपनी', Price: 'शुल्क', Cases: 'उदाहरण', Document: 'दस्तावेज़', Contact: 'संपर्क', Diagnosis: 'आकलन', Recruit: 'भर्ती',
        Privacy: 'गोपनीयता', Home: 'होम', Next: 'अगला' };
      const enLabel = root.lang === 'hi' ? (HI[en] || en) : en;
      const nav = document.querySelector('.pt-nav');
      if (nav && label) {
        nav.querySelector('.pt-nav-t span').textContent = base === '/' ? '〇〇〇〇' : label;
        nav.querySelector('.pt-nav-en').textContent = enLabel;
      }
      root.classList.add('pt-leave');
      setTimeout(() => { location.href = url.href; }, 980);
    });
    // 戻るボタンでキャッシュから戻ったときに覆いを外す
    addEventListener('pageshow', (e) => { if (e.persisted) root.classList.remove('pt-leave', 'pt-enter', 'pt-first'); });
  }

  // ---- 小さい画面のメニュー
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('global-nav');
  if (menuBtn && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? L.close : L.menu;
    };
    menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('focusout', (e) => { if (nav.classList.contains('is-open') && !nav.contains(e.relatedTarget) && e.relatedTarget !== menuBtn) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); menuBtn.focus(); } });
  }

  // ---- 自動で動く写真（ヒーロー・写真の帯）の一時停止
  document.querySelectorAll('.motion-toggle').forEach((b) => {
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', String(on));
      b.textContent = on ? L.play : L.stop;
      b.closest('section').classList.toggle('is-paused', on);
    });
  });

  // ---- フォーム：日本語のエラー表示。送信先が決まるまでは、入力内容を送らずに完了ページへ移る
  document.querySelectorAll('form[data-demo]').forEach((form) => {
    const msgOf = (el) => el.validity.valueMissing ? L.req
      : el.validity.typeMismatch && el.type === 'email' ? L.mail
      : el.validationMessage;
    const mark = (el, msg) => {
      const id = `${el.name}-err`;
      let err = document.getElementById(id);
      if (!msg) { el.removeAttribute('aria-invalid'); if (err) err.remove(); return; }
      if (!err) { err = document.createElement('span'); err.className = 'field-err'; err.id = id; el.after(err); }
      err.textContent = msg;
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', id);
    };
    form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid')) mark(e.target, e.target.checkValidity() ? '' : msgOf(e.target)); });
    form.addEventListener('submit', (e) => {
      const bad = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
      [...form.elements].forEach((el) => el.willValidate && mark(el, el.checkValidity() ? '' : msgOf(el)));
      e.preventDefault();
      if (bad.length) { bad[0].focus(); return; }
      location.href = form.action;
    });
  });

  // ---- 言語の切り替え：外を押す・Esc で閉じる。1つ開いたら他は閉じる
  const langs = [...document.querySelectorAll('.lang-switch')];
  langs.forEach((d) => d.addEventListener('toggle', () => { if (d.open) langs.forEach((o) => { if (o !== d) o.open = false; }); }));
  document.addEventListener('click', (e) => { langs.forEach((d) => { if (d.open && !d.contains(e.target)) d.open = false; }); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    langs.forEach((d) => { if (d.open) { d.open = false; d.querySelector('summary').focus(); } });
  });

  // ---- GA4/GTM 用のイベント送信
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-cta]');
    if (a) dl.push({ event: 'cta_click', cta_name: a.dataset.cta, cta_location: a.closest('section')?.id || 'header' });
  });
})();
