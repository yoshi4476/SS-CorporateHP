// Web査定の入口ウィジェット（トップ・査定・エリアで共通）
// 目的・住所（または郵便番号）・種類を受け取り、本格査定ページ（satei/web/）へ引き渡す。
// data-purpose="1" のときは「売る目的」を先に選ばせ、合う査定プランを自動で選ぶ。
(() => {
  const icon = {
    house: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    mansion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>',
    land: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 18l5-9 4 6 3-4 6 7z"/><path d="M3 21h18"/></svg>',
  };
  // 目的 → 査定プランと、フォームで最初に選んでおく売却理由
  const PURPOSES = [
    { key: 'price', label: 'いくらで売れるか知りたい', plan: 'choto', reason: '相場を知りたいだけ' },
    { key: 'fast', label: 'できるだけ早く売りたい', plan: 'sokkin', reason: '' },
    { key: 'inherit', label: '相続・空き家の相談', plan: 'choto', reason: '相続した・相続する予定' },
    { key: 'move', label: '住み替え・転勤で売りたい', plan: 'iitoko', reason: '住み替え・転勤' },
  ];

  const template = (id, preset, withPurpose) => `
  <form class="estimator__body" novalidate>
    ${withPurpose ? `<fieldset class="field" style="border:0;padding:0;margin:0 0 14px">
      <legend class="label" style="font-weight:700;font-size:15px;margin-bottom:6px">いちばん近いお考えは？</legend>
      <div class="purpose">
        ${PURPOSES.map((p, i) => `<input type="radio" name="purpose" id="${id}-p${i}" value="${p.key}" ${i === 0 ? 'checked' : ''}><label for="${id}-p${i}">${p.label}</label>`).join('')}
      </div>
    </fieldset>` : ''}
    <div class="field">
      <label for="${id}-addr">物件の住所<span class="req">必須</span></label>
      <input type="text" id="${id}-addr" name="addr" autocomplete="street-address" placeholder="例）安城市御幸本町" value="${preset}">
      <p class="hint">町名までで大丈夫です。<button type="button" class="linklike" data-zip-open>郵便番号から入れる</button></p>
      <div class="zip-row" data-zip hidden>
        <label for="${id}-zip" class="sr-only">郵便番号</label>
        <input type="text" id="${id}-zip" inputmode="numeric" autocomplete="postal-code" maxlength="8" placeholder="郵便番号（例：4441333）">
        <p class="hint" data-zip-msg aria-live="polite"></p>
      </div>
    </div>
    <fieldset class="field" style="border:0;padding:0;margin:0 0 16px">
      <legend class="label" style="font-weight:700;font-size:15px;margin-bottom:6px">物件の種類<span class="req">必須</span></legend>
      <div class="seg">
        <input type="radio" name="type" id="${id}-t1" value="house" checked><label for="${id}-t1">${icon.house}一戸建て</label>
        <input type="radio" name="type" id="${id}-t2" value="mansion"><label for="${id}-t2">${icon.mansion}マンション</label>
        <input type="radio" name="type" id="${id}-t3" value="land"><label for="${id}-t3">${icon.land}土地</label>
      </div>
    </fieldset>
    <p class="error-msg" data-error role="alert" hidden></p>
    <button type="submit" class="btn btn--cta btn--block btn--lg">無料で査定をはじめる<span class="arrow" aria-hidden="true">→</span></button>
    <ul class="est-basis">
      <li>国の<b>地価公示・地価調査</b>と<b>実際の取引価格 約200万件</b>（全国）</li>
      <li>国税庁の<b>建築費統計</b>で建物を計算</li>
      <li><b>浸水・土砂災害</b>の想定と<b>売った後の手取り</b>もわかる</li>
    </ul>
    <p class="hint center" style="margin:6px 0 0">お名前・電話番号は不要です。営業電話はかかってきません。</p>
  </form>`;

  document.querySelectorAll('[data-estimator]').forEach((root) => {
    const id = root.id || 'est';
    const appUrl = root.dataset.appUrl || 'satei/web/index.html';
    root.insertAdjacentHTML('beforeend', template(id, root.dataset.preset || '', root.dataset.purpose === '1'));
    const form = root.querySelector('form');
    const err = form.querySelector('[data-error]');

    // 郵便番号から住所（zipcloud / JSONP）
    const zipBox = form.querySelector('[data-zip]');
    const zipMsg = form.querySelector('[data-zip-msg]');
    form.querySelector('[data-zip-open]').addEventListener('click', () => { zipBox.hidden = false; zipBox.querySelector('input').focus(); });
    zipBox.querySelector('input').addEventListener('input', (e) => {
      const code = e.target.value.replace(/[^0-9]/g, '');
      if (code.length !== 7) return;
      const cb = `estzip_${Date.now()}`;
      const s = document.createElement('script');
      window[cb] = (r) => {
        delete window[cb]; s.remove();
        const a = r?.results?.[0];
        if (!a) { zipMsg.textContent = '住所が見つかりませんでした。住所を直接入れてください。'; return; }
        form.addr.value = `${a.address1}${a.address2}${a.address3}`;
        zipMsg.textContent = `「${form.addr.value}」を入れました。`;
      };
      s.src = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}&callback=${cb}`;
      s.onerror = () => { delete window[cb]; s.remove(); zipMsg.textContent = '住所を調べられませんでした。住所を直接入れてください。'; };
      document.body.appendChild(s);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const addr = form.addr.value.trim();
      if (addr.length < 3) {
        err.textContent = '物件の住所を入れてください（例：安城市御幸本町）。';
        err.hidden = false;
        form.addr.setAttribute('aria-invalid', 'true');
        form.addr.focus();
        return;
      }
      const p = PURPOSES.find((x) => x.key === form.purpose?.value);
      if (p) {
        try { sessionStorage.setItem('hp_purpose', JSON.stringify(p)); } catch { /* 引き継げなくても査定はできる */ }
      }
      location.href = `${appUrl}?addr=${encodeURIComponent(addr)}&type=${form.type.value}${p ? `&plan=${p.plan}` : ''}`;
    });
  });
})();
