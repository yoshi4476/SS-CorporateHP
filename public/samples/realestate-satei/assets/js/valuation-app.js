(() => {
  const form = document.getElementById('va-form');
  if (!form) return;
  const API = 'https://api.invalid';
  const $ = (s, el = document) => el.querySelector(s);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const yen = (v) => Math.round(v).toLocaleString('ja-JP');
  const man = (v) => {
    const m = Math.round(v / 10000);
    return m >= 10000 ? `${Math.floor(m / 10000)}億${m % 10000 ? (m % 10000).toLocaleString('ja-JP') : ''}` : m.toLocaleString('ja-JP');
  };
  const pct = (v) => `${Math.round(v * 100)}%`;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const wareki = (y) => (y >= 2019 ? `令和${y - 2018 === 1 ? '元' : y - 2018}年` : y >= 1989 ? `平成${y - 1988 === 1 ? '元' : y - 1988}年` : `昭和${y - 1925}年`);
  const tileUrl = (p) => `${API}/tiles/${p}/{z}/{x}/{y}.png`;
  // 入口で選んだ目的に合う査定プラン（なければ「いいとこ取り」）
  const urlPlan = new URLSearchParams(location.search).get('plan');
  const presetPlan = ['sokkin', 'challenge', 'iitoko', 'choto'].includes(urlPlan) ? urlPlan : 'iitoko';

  const state = { lat: null, lon: null, muni: null, town: null, title: null };
  const locMsg = $('#va-loc-msg');
  const errBox = $('#va-error');
  const result = $('#va-result');
  let map; let marker; let resultMap; let trendChart; let current = null;

  // ---- 建てた年 ----
  const thisYear = new Date().getFullYear();
  form.builtYear.insertAdjacentHTML('beforeend', '<option value="">選択してください</option>');
  for (let y = thisYear; y >= 1950; y--) form.builtYear.insertAdjacentHTML('beforeend', `<option value="${y}">${y}年（${wareki(y)}）</option>`);

  // ---- 種類で入力欄を切替 ----
  const syncType = () => {
    const t = form.type.value;
    form.querySelectorAll('[data-show]').forEach((el) => { el.hidden = !el.dataset.show.split(' ').includes(t); });
    const lbl = $('label[for="va-bldgArea"]');
    lbl.firstChild.textContent = t === 'mansion' ? lbl.dataset.labelMansion : lbl.dataset.labelHouse;
  };
  form.addEventListener('change', (e) => { if (e.target.name === 'type') syncType(); });

  // ---- 地図 ----
  const baseLayer = () => L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">国土地理院</a>' });
  const ensureMap = () => {
    if (map || !window.L) return;
    $('#va-map').classList.add('is-on');
    map = L.map('va-map', { scrollWheelZoom: false }).setView([34.93, 137.0], 13);
    baseLayer().addTo(map);
    marker = L.marker([34.93, 137.0], { draggable: true, keyboard: true, title: '物件の位置（ドラッグで調整）' }).addTo(map);
    marker.on('dragend', async () => {
      const { lat, lng } = marker.getLatLng();
      Object.assign(state, { lat, lon: lng });
      try {
        const r = await (await fetch(`${API}/reverse?lat=${lat}&lon=${lng}`)).json();
        Object.assign(state, { muni: r.muni, town: r.town });
        locMsg.textContent = `ピンの位置：${r.town || ''} 付近`;
      } catch { locMsg.textContent = 'ピンの位置を更新しました。'; }
    });
  };

  const locate = async () => {
    const addr = form.addr.value.trim();
    if (addr.length < 3) { locMsg.textContent = '住所を入れてください（例：安城市御幸本町）。'; form.addr.focus(); return false; }
    locMsg.textContent = '場所を探しています…';
    const q = /^(北海道|.{2,3}[都府県])/.test(addr) ? addr : `愛知県${addr}`;
    try {
      const res = await fetch(`${API}/geocode?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('not found');
      const g = await res.json();
      Object.assign(state, { lat: g.lat, lon: g.lon, muni: g.muni, town: g.town, title: g.title });
      ensureMap();
      if (map) { map.setView([g.lat, g.lon], 16); marker.setLatLng([g.lat, g.lon]); setTimeout(() => map.invalidateSize(), 50); }
      locMsg.textContent = `「${g.title}」が見つかりました。位置がずれていたら、ピンを動かしてください。`;
      return true;
    } catch {
      locMsg.textContent = '住所が見つかりませんでした。市区町村名から入れてください（例：安城市御幸本町）。';
      return false;
    }
  };
  $('#va-locate').addEventListener('click', locate);
  form.addr.addEventListener('change', () => { state.lat = null; });

  // ---- 郵便番号（zipcloud / JSONP） ----
  $('#va-zip').addEventListener('input', (e) => {
    const code = e.target.value.replace(/[^0-9]/g, '');
    if (code.length !== 7) return;
    const cb = `vazip_${Date.now()}`;
    const s = document.createElement('script');
    window[cb] = (r) => {
      delete window[cb]; s.remove();
      const a = r?.results?.[0];
      if (!a) { locMsg.textContent = '郵便番号から住所が見つかりませんでした。'; return; }
      form.addr.value = `${a.address1}${a.address2}${a.address3}`;
      state.lat = null;
      form.addr.focus();
      locMsg.textContent = '住所を入れました。番地まで足すと、より正確になります。';
    };
    s.src = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${code}&callback=${cb}`;
    s.onerror = () => { delete window[cb]; s.remove(); locMsg.textContent = '郵便番号から住所を調べられませんでした。住所を直接入れてください。'; };
    document.body.appendChild(s);
  });

  // ---- 面積が分からないとき：地域の標準（取引の中央値）・間取りの目安 ----
  form.addEventListener('click', async (e) => {
    const lay = e.target.closest('[data-layout]');
    if (lay) {
      AreaInput.setSqm(form.bldgArea, Number(lay.dataset.layout));
      form.bldgArea.focus();
      return;
    }
    const b = e.target.closest('[data-typical]');
    if (!b) return;
    const kind = b.dataset.typical;
    const msg = form.querySelector(`[data-typical-msg="${kind}"]`);
    if (!state.lat && !(await locate())) { msg.textContent = '先に物件の住所を入れて、場所を確認してください。'; return; }
    msg.textContent = '調べています…';
    try {
      const t = await (await fetch(`${API}/typical?muni=${state.muni}`)).json();
      const v = kind === 'land' ? t.land : t.floor;
      if (!v) throw new Error('none');
      AreaInput.setSqm(kind === 'land' ? form.landArea : form.bldgArea, v);
      msg.textContent = `${t.scope}の一戸建て取引（${t.n}件）の中央値 ${Math.round(v)}㎡（約${Math.round(v / AreaInput.TSUBO)}坪）を入れました。分かれば正確な値に直してください。`;
    } catch {
      msg.textContent = 'この地域の目安が見つかりませんでした。おおよその広さを入れてください。';
    }
  });

  // ---- 査定 ----
  const fail = (msg, el) => {
    errBox.textContent = msg; errBox.hidden = false;
    if (el) { el.setAttribute('aria-invalid', 'true'); el.focus(); }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.hidden = true;
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    const t = form.type.value;
    const landSqm = AreaInput.sqm(form.landArea);
    const bldgSqm = AreaInput.sqm(form.bldgArea);
    if (t !== 'mansion' && !(landSqm > 0)) return fail('土地の広さを入れてください（分からないときは、欄の下の「分からないときは」から目安を入れられます）。', form.landArea);
    if (t !== 'land' && !(bldgSqm > 0)) return fail(`${t === 'mansion' ? '専有面積' : '建物の延床面積'}を入れてください（分からないときは、欄の下の「分からないときは」から目安を入れられます）。`, form.bldgArea);
    if (t !== 'land' && !form.builtYear.value) return fail('建てた年を選んでください。', form.builtYear);
    if (!state.lat && !(await locate())) return fail('物件の場所を確認できませんでした。', form.addr);

    const btn = $('#va-submit');
    btn.disabled = true; btn.firstChild.textContent = '計算しています…';
    const p = new URLSearchParams({
      lat: state.lat, lon: state.lon, muni: state.muni ?? '', town: state.town ?? '', type: t,
      landArea: landSqm, bldgArea: bldgSqm, builtYear: form.builtYear.value, walk: form.walk.value,
      areaEstimated: (t !== 'mansion' && form.landArea.dataset.estimated) || (t !== 'land' && form.bldgArea.dataset.estimated) ? '1' : '0',
      structure: form.structure.value, condition: form.condition.value, reform: form.reform.value,
      shape: form.shape.value, dir: form.dir.value, roadW: form.roadW.value, corner: form.corner.checked ? '1' : '0',
    });
    try {
      const res = await fetch(`${API}/estimate?${p}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '計算できませんでした');
      const wakeari = [...form.querySelectorAll('[name="wakeari"]:checked')].map((c) => c.value);
      render(data, {
        type: t, wakeari, addr: state.title || form.addr.value, landArea: landSqm, bldgArea: bldgSqm,
        builtYear: +form.builtYear.value, structure: t === 'mansion' ? 'rc' : form.structure.value,
      });
    } catch (err) {
      fail(`${err.message}。お手数ですが、お電話（000-0000-0000）かフォームからご相談ください。`);
    } finally {
      btn.disabled = false; btn.firstChild.textContent = '査定価格を計算する';
    }
  });

  // ---- 結果の描画 ----
  const TYPE = { house: '一戸建て', mansion: 'マンション', land: '土地' };
  const STRUCT = { wood: '木造', lsteel: '軽量鉄骨造', steel: '鉄骨造', rc: '鉄筋コンクリート造', src: '鉄骨鉄筋コンクリート造' };
  const LEVEL = { district: '同じ地区', muni: '同じ市区町村' };

  const priceBlock = (d, input) => {
    if (!d.ok) {
      return `<section class="va-card va-price is-na"><p class="va-label">${esc(input.addr)}・${TYPE[input.type]}</p>
        <h2 class="va-h" style="margin-top:6px">Webでは価格を計算できませんでした</h2><p>${esc(d.message)}</p>
        <a class="btn btn--cta btn--block" href="${(state.muni ?? '').startsWith('23') ? '#va-book' : '../index.html?plan=choto#form'}">代表に無料で査定してもらう<span class="arrow" aria-hidden="true">→</span></a></section>`;
    }
    const pr = d.price;
    const acc = d.model.accuracy;
    const outside = !(state.muni ?? '').startsWith('23');
    const cta = outside
      ? `<p>愛知県外の物件は、地域をよく知る<span class="marker">信頼できる提携不動産会社を、代表の〇〇がご紹介します。</span></p>
        <a class="btn btn--cta btn--block btn--lg" data-carry href="../index.html?plan=choto#form">提携会社の紹介を依頼する（無料）<span class="arrow" aria-hidden="true">→</span></a>`
      : `<p><span class="marker">正確な価格は、代表の〇〇が物件を見て、根拠と一緒にお伝えします。</span></p>
        <a class="btn btn--cta btn--block btn--lg" href="#va-book">代表に根拠を聞く（日時を予約・無料）<span class="arrow" aria-hidden="true">→</span></a>
        <p class="note" style="margin:8px 0 0;text-align:center">くわしく書いて申し込みたい方は<a data-carry href="../index.html?plan=${input.wakeari.length ? 'sokkin' : presetPlan}#form">無料査定フォーム</a>へ</p>`;
    // 訳アリの物件は、機械的な計算では価格がずれるため金額を出さない（誤解を招く表示を避ける）
    const head = input.wakeari.length
      ? `<p class="va-label">${esc(input.addr)}・${TYPE[input.type]}</p>
        <h2 class="va-h" style="margin-top:6px">この物件は、代表が直接見て査定します</h2>
        <p>「${esc(input.wakeari.join('・'))}」のある物件は、計算だけでは正しい価格になりません。<span class="marker">他社で断られた物件でも、買取業者とのネットワークで売却の方法を探します。</span></p>
        <p class="note">参考として、下に周りの地価・取引・災害の想定を表示しています。</p>`
      : `<p class="va-label">${esc(input.addr)}・${TYPE[input.type]}の査定価格（目安）</p>
        <p class="va-big">${man(pr.low)}<small>万円</small> 〜 ${man(pr.high)}<small>万円</small></p>
        <div class="est-bar" aria-hidden="true"><i style="left:50%"></i></div>
        <div class="est-bar-legend" aria-hidden="true"><span>早く売る（買取など）</span><span>時間をかけて高く売る</span></div>
        <p class="note" style="margin-top:8px">価格帯は「似た物件の取引の半分が入る幅」です。${acc ? `この計算方法で過去の取引（${esc(d.model.accuracyScope)}）を予測したときの誤差は、中央値で${pct(acc.mdape)}でした（${acc.n}件で検証）。` : ''}</p>`;
    return `<section class="va-card va-price">
      ${head}
      <div class="va-cta">
        ${cta}
        <div class="va-cta-sub"><a class="btn btn--line" href="#" rel="noopener">LINEで相談</a><button type="button" class="btn btn--ghost" data-print>結果を印刷・PDF保存</button></div>
      </div>
    </section>`;
  };

  // ---- 結果を見た流れのまま、代表との面談の日時を予約する ----
  const SLOTS = ['午前（9〜12時）', '午後（12〜15時）', '夕方（15〜18時）', '18時以降（21時まで）'];
  const dayAfter = (n) => { const t = new Date(); t.setDate(t.getDate() + n); return t.toLocaleDateString('sv-SE'); };
  const slotSelect = (id, label, required) => `<label class="sr-only" for="${id}">${label}の時間帯</label><select id="${id}" name="${id}"${required ? ' required' : ''}><option value="">${required ? '時間帯を選ぶ' : '時間帯（任意）'}</option>${SLOTS.map((x) => `<option>${x}</option>`).join('')}</select>`;
  const bookBlock = (d, input) => `<section class="va-card va-book" id="va-book" aria-labelledby="va-book-title">
      <div class="va-book__head">
        <img src="../../assets/img/rep-face.webp?v=18dc2d92" alt="代表取締役 〇〇 〇〇" width="72" height="72" loading="lazy" decoding="async">
        <div><p class="va-book__eyebrow">無料・相談だけでもOK</p>
        <h2 class="va-h" id="va-book-title">${d.ok && !input.wakeari.length ? 'この価格の根拠を、代表の〇〇が直接ご説明します' : 'この物件の価格を、代表の〇〇が直接お調べします'}</h2></div>
      </div>
      <ul class="va-book__points">
        <li>建物の状態・日当たり・周りの環境を見て、<b>Webの目安との違い</b>をお伝えします</li>
        <li>仲介・買取など、<b>あなたに合う売り方と手元に残るお金</b>を一緒に確認します</li>
        <li>その場で契約をお願いすることはありません。<b>しつこい営業もしません</b></li>
      </ul>
      <form id="va-book-form" novalidate>
        <fieldset class="va-book__how"><legend>ご相談の方法</legend>
          <label><input type="radio" name="visitType" value="訪問査定（ご自宅）" checked> ご自宅で訪問査定</label>
          <label><input type="radio" name="visitType" value="店舗で相談"> 店舗で相談（高浜市）</label>
          <label><input type="radio" name="visitType" value="電話・オンライン"> 電話・オンライン</label>
        </fieldset>
        <div class="va-book__dates">
          <div><label for="vb-d1">第1希望日 <span class="req">必須</span></label><input type="date" id="vb-d1" name="d1" min="${dayAfter(1)}" required>${slotSelect('vb-t1', '第1希望', true)}</div>
          <div><label for="vb-d2">第2希望日（任意）</label><input type="date" id="vb-d2" name="d2" min="${dayAfter(1)}">${slotSelect('vb-t2', '第2希望', false)}</div>
        </div>
        <p class="note">水曜日は定休日です。ご希望があればご相談ください。日時は、代表から確認のご連絡をして確定します。</p>
        <div class="va-book__who">
          <div><label for="vb-name">お名前 <span class="req">必須</span></label><input id="vb-name" name="name" autocomplete="name" required></div>
          <div><label for="vb-tel">電話番号 <span class="req">必須</span></label><input id="vb-tel" name="tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="例）000-0000-0000" required></div>
        </div>
        <input type="text" name="website" tabindex="-1" autocomplete="off" class="hp-field" aria-hidden="true">
        <label class="va-book__agree"><input type="checkbox" name="agree" required> <span><a href="../../privacy/index.html" target="_blank" rel="noopener">個人情報の取り扱い</a>に同意します <span class="req">必須</span></span></label>
        <p class="error-msg" id="vb-error" role="alert" hidden></p>
        <button type="submit" class="btn btn--cta btn--block btn--lg">この日時で予約する<span class="arrow" aria-hidden="true">→</span></button>
        <p class="note" style="text-align:center;margin-top:8px">お急ぎの方は <a href="tel:000-0000-0000">000-0000-0000</a>（21時・土日祝も相談可）</p>
      </form>
    </section>`;

  const submitBook = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const err = $('#vb-error');
    const val = (n) => f.elements[n]?.value.trim() ?? '';
    const fail = (m, el) => { err.textContent = m; err.hidden = false; el?.focus(); };
    if (!val('d1') || !val('vb-t1')) return fail('第1希望の日と時間帯を選んでください', val('d1') ? f.elements['vb-t1'] : f.elements.d1);
    if (!val('name')) return fail('お名前を入れてください', f.elements.name);
    if (!/^0\d{9,10}$/.test(val('tel').replace(/[-ー－\s]/g, ''))) return fail('電話番号を確認してください', f.elements.tel);
    if (!f.elements.agree.checked) return fail('個人情報の取り扱いへの同意が必要です', f.elements.agree);
    err.hidden = true;
    const { d, input } = current;
    const pref = (input.addr.match(/^(東京都|北海道|(?:京都|大阪)府|.{2,3}県)/) || [])[1] || '';
    const when = (dd, t) => `${new Date(`${dd}T00:00`).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })} ${t}`;
    const visit1 = when(val('d1'), val('vb-t1'));
    const visit2 = val('d2') ? when(val('d2'), val('vb-t2') || '時間帯の指定なし') : '';
    const visitType = f.elements.visitType.value;
    const btn = f.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      const r = await fetch(`${API}/lead`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: input.wakeari.length ? 'sokkin' : presetPlan, ptype: TYPE[input.type], pref, street: input.addr,
          landArea: input.landArea ? String(input.landArea) : '', bldgArea: input.bldgArea ? String(input.bldgArea) : '',
          name: val('name'), tel: val('tel'), contact: '電話', time: visit1,
          visitType, visit1, visit2, website: val('website'), agree: true,
          msg: 'Web査定の結果画面から、面談の日時を予約', wakeari: input.wakeari,
          webEstimate: d.ok && !input.wakeari.length ? { low: d.price.low, high: d.price.high, mid: d.price.mid } : null,
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || '送信できませんでした');
      $('#va-book').innerHTML = `<div class="va-book__done" role="status" tabindex="-1">
        <h2 class="va-h">ご予約を受け付けました</h2>
        <p>第1希望：<b>${esc(visit1)}</b>${visit2 ? `<br>第2希望：<b>${esc(visit2)}</b>` : ''}<br>ご相談の方法：<b>${esc(visitType)}</b></p>
        <p>代表の〇〇から、日時を確定するお電話をします。この画面の査定結果も、あわせて代表に届いています。</p>
        <p class="note">お急ぎの方は <a href="tel:000-0000-0000">000-0000-0000</a> へどうぞ。</p></div>`;
      $('#va-book .va-book__done').focus();
    } catch (x) {
      fail(`${x.message}。お手数ですが、お電話（000-0000-0000）でもご予約いただけます。`);
      btn.disabled = false;
    }
  };

  const breakdownBlock = (d, input) => {
    if (!d.ok) return '';
    const rows = [];
    if (d.land) {
      const l = d.land;
      rows.push(`<tr><th scope="rowgroup" rowspan="${l.corner !== 1 ? 7 : 6}">土地</th><td>近くの公示・調査地点を標準的な土地に直して距離で重み付け<br><small>整形・東西道路・幅4〜6m・100〜200㎡に換算</small></td><td class="num">${yen(l.standardUnit)} 円/㎡</td></tr>
        <tr><td>この土地の条件（形・方角・道路の幅・広さ）<br><small>取引データから推定した係数</small></td><td class="num">×${l.subjectFactor}</td></tr>
        ${l.corner !== 1 ? `<tr><td>角地<br><small>国税庁 財産評価基本通達の側方路線影響加算率</small></td><td class="num">×${l.corner}</td></tr>` : ''}
        <tr><td>実勢価格への補正<br><small>${esc(l.marketRatioSource)}</small></td><td class="num">×${l.marketRatio}</td></tr>
        <tr><td>この土地の単価</td><td class="num">${yen(l.unit)} 円/㎡</td></tr>
        <tr><td>土地の広さ</td><td class="num">${l.area} ㎡</td></tr>
        <tr class="sum"><td>土地の価格</td><td class="num">${man(l.value)} 万円</td></tr>`);
    }
    if (d.building) {
      const b = d.building;
      rows.push(`<tr><th scope="rowgroup" rowspan="4">建物</th><td>新築した場合の単価（${STRUCT[b.structure]}）<br><small>国税庁「建物の標準的な建築価額表」令和5年</small></td><td class="num">${yen(b.unitCost)} 円/㎡</td></tr>
        <tr><td>築年数による残りの価値<br><small>${esc(b.basis)}：新築時${pct(b.r0)}、約${b.usefulLife}年で下限${pct(b.floor)}</small></td><td class="num">築${b.age}年 → ${pct(b.rate)}</td></tr>
        <tr><td>延床面積</td><td class="num">${input.bldgArea} ㎡</td></tr>
        <tr class="sum"><td>建物の価格</td><td class="num">${man(b.value)} 万円</td></tr>`);
    }
    if (d.hedonic) {
      const h = d.hedonic;
      if (h.kind === 'マンション') {
        rows.push(`<tr><th scope="rowgroup" rowspan="2">取引モデル</th><td>${LEVEL[h.level]}の中古マンション取引の水準（${h.n}件）から、築${h.age}年・専有面積・駅徒歩・改装の違いを補正</td><td class="num">${yen(h.unit)} 円/㎡</td></tr>
          <tr class="sum"><td>専有面積 × 単価</td><td class="num">${man(d.price.mid)} 万円</td></tr>`);
      } else {
        rows.push(`<tr><th scope="rowgroup" rowspan="3">合成</th><td>土地＋建物の積算価格</td><td class="num">${man(h.cost)} 万円</td></tr>
          <tr><td>${LEVEL[h.level]}の一戸建て取引の水準（${h.n}件）から、広さ・築年・構造・駅徒歩の違いを補正した価格</td><td class="num">${man(h.value)} 万円</td></tr>
          <tr class="sum"><td>合成（取引モデルの比重 ${pct(h.weight)}）</td><td class="num">${man(d.price.mid)} 万円</td></tr>`);
      }
    }
    return `<section class="va-card"><h2 class="va-h">計算の内訳</h2>
      <div class="box-point"><strong>ポイント</strong>土地は「近くの公的な地価」を実際の取引水準に合わせ、建物は「今建てた場合の費用から古くなった分を引く」考え方です。一戸建て・マンションは、実際の取引から作った統計モデルとも突き合わせています。</div>
      <div class="table-wrap"><table class="va-table"><tbody>${rows.join('')}</tbody></table></div>
      ${d.notes.map((n) => `<p class="note">※${esc(n)}</p>`).join('')}
      <p class="note">係数は国の取引価格・成約価格データ（全国約200万件）から、${esc(d.model.pref ?? '都道府県')}の取引で推定しています（モデル作成日 ${esc(d.model.generatedAt ?? '―')}）。${d.model.reviewed ? `係数は${esc(d.model.reviewed.by)}が確認済みです（${new Date(d.model.reviewed.at).toLocaleDateString('ja-JP')}）。` : ''}</p></section>`;
  };

  const recentBlock = (d) => {
    if (!d.recent?.length) return '';
    return `<section class="va-card"><h2 class="va-h">同じ地区の最近の取引</h2>
      <p>国に報告された、実際の取引価格・成約価格です（地区：${esc(d.district || '―')}）。</p>
      <div class="table-wrap"><table class="va-table"><thead><tr><th scope="col">時期</th><th scope="col">区分</th><th scope="col">価格</th><th scope="col">土地/専有</th><th scope="col">建物</th><th scope="col">築年</th><th scope="col">駅徒歩</th></tr></thead><tbody>
      ${d.recent.map((r) => `<tr><td>${esc(r.period)}</td><td>${esc(r.cat)}</td><td class="num">${man(r.price)}万円</td><td class="num">${r.area ?? '―'}㎡</td><td class="num">${r.floorArea ? `${r.floorArea}㎡` : '―'}</td><td>${r.builtYear ?? '―'}</td><td>${r.walk != null ? `${r.walk}分` : '―'}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="note">出典：国土交通省「不動産情報ライブラリ」不動産価格（取引価格・成約価格）情報。個人が特定されないよう、国が地区・面積を丸めて公表しています。</p>
      ${d.latestApi?.rows?.length ? `<p class="note">APIから取得した最新の取引（${esc(d.latestApi.label)}）：${d.latestApi.rows.length}件</p>` : ''}</section>`;
  };

  const pointsBlock = (d) => {
    if (!d.land) return '';
    return `<section class="va-card"><h2 class="va-h">根拠にした地点</h2>
      <p>物件に近い、住宅地の地価公示・地価調査の地点です。<span class="marker">近い地点ほど重みを大きく</span>しています。</p>
      <div id="va-rmap" class="va-map is-on" role="region" aria-label="物件と根拠地点の地図"></div>
      <div class="va-layers" role="group" aria-label="地図に重ねる情報">
        <label><input type="radio" name="va-ov" value="" checked> 重ねない</label>
        <label><input type="radio" name="va-ov" value="01_flood_l2_shinsuishin_data"> 洪水</label>
        <label><input type="radio" name="va-ov" value="03_hightide_l2_shinsuishin_data"> 高潮</label>
        <label><input type="radio" name="va-ov" value="04_tsunami_newlegend_data"> 津波</label>
        <label><input type="radio" name="va-ov" value="05_kyukeishakeikaikuiki"> 急傾斜地</label>
        <label><input type="radio" name="va-ov" value="05_dosekiryukeikaikuiki"> 土石流</label>
      </div>
      <div class="table-wrap"><table class="va-table"><thead><tr><th scope="col">地点</th><th scope="col">1㎡の価格</th><th scope="col">標準に換算</th><th scope="col">距離</th><th scope="col">重み</th><th scope="col">最寄り駅</th></tr></thead><tbody>
      ${d.land.points.map((p, i) => `<tr><td><b>${i + 1}.</b> ${esc(p.loc.replace(/^愛知県 /, ''))}<br><small>${esc(p.src)} ${p.year}年／前年比 ${p.chg > 0 ? '+' : ''}${p.chg}%／${p.acre ?? '―'}㎡・${esc(p.roadDir || '―')}道路${p.roadW ? ` ${p.roadW}m` : ''}</small></td><td class="num">${yen(p.price)}円</td><td class="num">${yen(p.standardPrice)}円</td><td class="num">${p.dist >= 1000 ? `${(p.dist / 1000).toFixed(1)}km` : `${p.dist}m`}</td><td class="num">${pct(p.weight)}</td><td>${esc(p.sta || '―')}${p.staD ? ` ${p.staD}m` : ''}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="note">出典：${d.sources.map(esc).join('／')}</p></section>`;
  };

  const trendBlock = (d) => (d.land ? `<section class="va-card"><h2 class="va-h">地価はどう動いている？</h2>
      <div class="box-point"><strong>ポイント</strong>一番近い地点と、市内の住宅地の中央値（地価公示）の推移です。</div>
      <div class="chart-box"><canvas id="va-trend" role="img" aria-label="地価の推移グラフ"></canvas></div>
      <p class="note">出典：国土交通省「地価公示」（国土数値情報）。市内の中央値は、その年に3地点以上ある場合のみ表示。</p></section>` : '');

  const zoningBlock = (d) => {
    const s = d.site;
    if (s?.zoning) {
      return `<section class="va-card"><h2 class="va-h">この土地のルールと学区</h2>
        <p>物件の位置で、都市計画と学区のデータを確認しました。</p>
        <dl class="va-dl"><dt>用途地域</dt><dd>${esc(s.zoning.name)}</dd><dt>建ぺい率</dt><dd>${esc(s.zoning.bcr ?? '―')}</dd><dt>容積率</dt><dd>${esc(s.zoning.far ?? '―')}</dd>
        <dt>防火の規制</dt><dd>${esc(s.fire ?? 'なし')}</dd><dt>小学校区</dt><dd>${esc(s.elementary ?? '―')}</dd><dt>中学校区</dt><dd>${esc(s.junior ?? '―')}</dd></dl>
        <p class="note">出典：${esc(s.source)}。学区は変更されることがあるため、最新の情報は市の教育委員会でご確認ください。</p></section>`;
    }
    const p = d.land?.points?.[0];
    if (!p) return '';
    return `<section class="va-card"><h2 class="va-h">周りの土地のルール（参考）</h2>
      <p>一番近い地点（${p.dist}m先）の情報です。<b>物件そのものの規制とは違う場合があります。</b></p>
      <dl class="va-dl"><dt>用途地域</dt><dd>${esc(p.zone || '―')}</dd><dt>建ぺい率</dt><dd>${p.bcr ?? '―'}%</dd><dt>容積率</dt><dd>${p.far ?? '―'}%</dd><dt>周りの様子</dt><dd>${esc(p.around || '―')}</dd></dl>
      <p class="note">用途地域（＝建てられる建物の種類を決めた地域の区分）・建ぺい率（＝敷地に対して建物を建てられる面積の割合）・容積率（＝敷地に対する延床面積の割合）</p></section>`;
  };

  const hazardBlock = () => `<section class="va-card"><h2 class="va-h">災害の想定</h2>
    <p>物件の位置で、国のデータを使って確認しました。</p>
    <ul class="va-hazard" id="va-hazard"><li class="is-loading">確認しています…</li></ul>
    <div class="box-tip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
    <p style="margin:0">売るときは、重要事項説明でハザードマップ上の位置を買主に説明する義務があります。<span class="marker">想定があっても売却はできます。</span>先に知っておくと、価格の相談がしやすくなります。</p></div>
    <p class="note">浸水：国土交通省「ハザードマップポータルサイト」の浸水想定区域図（国の凡例色で塗り分けた公式画像を、物件の位置で画素ごとに照合。1画素は約1〜2m）。土砂災害：国土数値情報「土砂災害警戒区域データ」の区域の形で判定。最新の指定状況は各市のハザードマップでもご確認ください。</p></section>`;

  const proceedsBlock = (d, input) => {
    if (!d.ok) return '';
    const years = ['<option value="">分からない（かなり前）</option>'];
    for (let y = thisYear; y >= 1950; y--) years.push(`<option value="${y}">${y}年（${wareki(y)}）</option>`);
    return `<section class="va-card" id="va-proceeds"><h2 class="va-h">売ったら、手元にいくら残る？</h2>
      <div class="box-point"><strong>ポイント</strong>売却価格から、仲介手数料・印紙税・譲渡所得税・ローンの残りを引いた金額の目安です。</div>
      <div class="field-row">
        <div class="field"><label for="pc-price">売却価格</label><div class="unit-input"><input type="number" id="pc-price" value="${Math.round(d.price.mid / 10000)}" inputmode="numeric"><span>万円</span></div></div>
        <div class="field"><label for="pc-loan">ローンの残り</label><div class="unit-input"><input type="number" id="pc-loan" value="0" inputmode="numeric"><span>万円</span></div></div>
      </div>
      <div class="field-row">
        <div class="field"><label for="pc-how">どうやって手に入れた？</label><select id="pc-how"><option value="buy">買った</option><option value="inherit">相続・贈与でもらった</option></select></div>
        <div class="field"><label for="pc-year" data-lbl-buy="買った年" data-lbl-inherit="亡くなった方が買った年">買った年</label><select id="pc-year">${years.join('')}</select></div>
      </div>
      <p class="hint" data-how="inherit" hidden>相続・贈与の場合は、亡くなった方（贈与した方）が買ったときの価格と年を引き継ぎます。</p>
      <div class="field-row">
        <div class="field"><label for="pc-purchase">買ったときの価格<span class="opt">不明なら空欄</span></label><div class="unit-input"><input type="number" id="pc-purchase" inputmode="numeric"><span>万円</span></div></div>
        ${input.type !== 'land' ? '<div class="field"><label for="pc-bprice">うち建物の価格<span class="opt">不明なら空欄</span></label><div class="unit-input"><input type="number" id="pc-bprice" inputmode="numeric"><span>万円</span></div></div>' : '<div></div>'}
      </div>
      <div class="field"><label for="pc-other">測量・解体などの費用<span class="opt">任意</span></label><div class="unit-input" style="max-width:260px"><input type="number" id="pc-other" value="0" inputmode="numeric"><span>万円</span></div></div>
      <div class="field"><label for="pc-special">使える特例</label>
        <select id="pc-special">
          <option value="">使わない・分からない</option>
          <option value="home">住んでいる（いた）家：3,000万円の特別控除</option>
          <option value="akiya">相続した実家（空き家）：3,000万円の特別控除</option>
          <option value="inheritAdd">相続税を払った：相続税を取得費に加える特例</option>
        </select></div>
      <div class="field" data-sp="akiya" hidden><label for="pc-heirs">その家を相続した人の数</label><select id="pc-heirs"><option value="1">1〜2人</option><option value="3">3人以上</option></select></div>
      <div data-sp="inheritAdd" hidden>
        <div class="field-row">
          <div class="field"><label for="pc-itax">払った相続税（あなたの分）</label><div class="unit-input"><input type="number" id="pc-itax" inputmode="numeric"><span>万円</span></div></div>
          <div class="field"><label for="pc-ival">この不動産の相続税評価額</label><div class="unit-input"><input type="number" id="pc-ival" inputmode="numeric"><span>万円</span></div></div>
        </div>
        <div class="field"><label for="pc-ibase">あなたの相続税の課税価格（債務控除前）</label><div class="unit-input" style="max-width:260px"><input type="number" id="pc-ibase" inputmode="numeric"><span>万円</span></div></div>
      </div>
      <div class="table-wrap" tabindex="0" role="region" aria-label="手取りの試算の表"><table class="va-table" id="pc-table"></table></div>
      <ul class="pc-warn" id="pc-warn"></ul>
      <div class="box-caution" style="margin-top:14px"><strong>ご注意：</strong>税金は、確定申告で使う計算方法に沿った概算です。ほかの所得との関係や特例の細かい条件は、税理士・税務署でご確認ください（提携の税理士をご紹介できます）。</div>
      <p class="note">仲介手数料は法律で決まっている上限額（税込）。印紙税は軽減措置（2027年3月31日まで）の額。建物は国税庁の方法で減価償却（居住用：耐用年数×1.5年の旧定額法、取得価額の95%まで）し、買ったときの建物価格が分からない場合は国税庁「建物の標準的な建築価額表」で求めています。</p></section>`;
  };

  const num10k = (id) => (+($(`#${id}`)?.value) || 0) * 10000;
  const renderProceeds = () => {
    const tbl = $('#pc-table');
    if (!tbl || !current) return;
    const how = $('#pc-how').value;
    const sp = $('#pc-special').value;
    const yl = $('label[for="pc-year"]');
    yl.textContent = how === 'inherit' ? yl.dataset.lblInherit : yl.dataset.lblBuy;
    document.querySelectorAll('[data-how]').forEach((el) => { el.hidden = el.dataset.how !== how; });
    document.querySelectorAll('[data-sp]').forEach((el) => { el.hidden = el.dataset.sp !== sp; });
    const i = current.input;
    const r = Proceeds.calc({
      price: num10k('pc-price'), loan: num10k('pc-loan'), purchase: num10k('pc-purchase'), buildingPurchase: num10k('pc-bprice'),
      acquiredYear: +$('#pc-year').value || null, otherCost: num10k('pc-other'), special: sp, heirs: +$('#pc-heirs').value,
      inheritTax: num10k('pc-itax'), inheritValue: num10k('pc-ival'), inheritBase: num10k('pc-ibase'),
      type: i.type, builtYear: i.builtYear, structure: i.structure, floorArea: i.bldgArea,
    });
    tbl.innerHTML = `<tbody>
      <tr><th scope="row">売却価格</th><td class="num">${yen(r.price)} 円</td></tr>
      <tr><th scope="row">仲介手数料（上限・税込）</th><td class="num">− ${yen(r.fee)} 円</td></tr>
      <tr><th scope="row">印紙税</th><td class="num">− ${yen(r.stampTax)} 円</td></tr>
      ${r.otherCost ? `<tr><th scope="row">測量・解体など</th><td class="num">− ${yen(r.otherCost)} 円</td></tr>` : ''}
      ${r.release ? `<tr><th scope="row">抵当権の抹消費用（目安）</th><td class="num">− ${yen(r.release)} 円</td></tr>` : ''}
      <tr><th scope="row">譲渡所得にかかる税金<br><small>取得費 ${yen(r.acquisition)}円（${esc(r.method)}${r.depreciation ? `・建物の減価償却 ${yen(r.depreciation)}円` : ''}）${r.inheritAdd ? `／相続税の加算 ${yen(r.inheritAdd)}円` : ''}<br>もうけ ${yen(r.gain)}円${r.deduction ? ` − ${esc(r.deductionLabel)} ${yen(r.deduction)}円` : ''} → ${esc(r.rateLabel)}</small></th><td class="num">− ${yen(r.incomeTax)} 円</td></tr>
      ${r.loan ? `<tr><th scope="row">ローンの返済</th><td class="num">− ${yen(r.loan)} 円</td></tr>` : ''}
      <tr class="sum"><th scope="row">手元に残る金額（目安）</th><td class="num">${yen(r.net)} 円</td></tr></tbody>`;
    $('#pc-warn').innerHTML = r.warnings.map((w) => `<li>${esc(w)}</li>`).join('');
  };

  const drawResultMap = (d) => {
    if (!window.L || !d.land) return;
    if (resultMap) resultMap.remove();
    resultMap = L.map('va-rmap', { scrollWheelZoom: false });
    baseLayer().addTo(resultMap);
    const subject = L.marker([state.lat, state.lon], { title: '査定する物件' }).addTo(resultMap).bindPopup('査定する物件');
    const bounds = [subject.getLatLng()];
    d.land.points.forEach((p, i) => {
      const m = L.circleMarker([p.lat, p.lon], { radius: 8 + p.weight * 14, color: '#a88d4f', weight: 2, fillColor: '#7d6530', fillOpacity: 0.8 })
        .addTo(resultMap).bindPopup(`<b>${i + 1}. ${esc(p.loc)}</b><br>${yen(p.price)}円/㎡（${p.src} ${p.year}年）<br>距離 ${p.dist}m・重み ${pct(p.weight)}`);
      m.bindTooltip(String(i + 1), { permanent: true, direction: 'center', className: 'va-pt-label' });
      bounds.push(m.getLatLng());
    });
    resultMap.fitBounds(L.latLngBounds(bounds).pad(0.2));
    let overlay;
    document.querySelectorAll('[name="va-ov"]').forEach((r) => r.addEventListener('change', () => {
      if (overlay) { resultMap.removeLayer(overlay); overlay = null; }
      if (r.value) overlay = L.tileLayer(tileUrl(r.value), { opacity: 0.6, maxNativeZoom: 17, attribution: 'ハザードマップポータルサイト' }).addTo(resultMap);
    }));
  };

  const drawTrend = (d) => {
    if (!window.Chart || !d.land) return;
    const near = d.land.points[0];
    const years = [...new Set([...Object.keys(near.hist), ...Object.keys(d.cityTrend || {})])].map(Number).filter((y) => y >= 2006).sort();
    if (trendChart) trendChart.destroy();
    Chart.defaults.font.family = '"Noto Sans JP", sans-serif';
    trendChart = new Chart($('#va-trend'), {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          { label: `一番近い地点（${near.loc.replace(/^愛知県 /, '').slice(0, 14)}）`, data: years.map((y) => near.hist[y] ?? null), borderColor: '#7d6530', backgroundColor: '#7d6530', tension: 0.25, pointRadius: 2, spanGaps: true },
          { label: '市内の住宅地（中央値）', data: years.map((y) => d.cityTrend?.[y]?.median ?? null), borderColor: '#c2410c', backgroundColor: '#c2410c', borderDash: [6, 4], tension: 0.25, pointRadius: 2, spanGaps: true },
        ],
      },
      options: {
        maintainAspectRatio: false, animation: { duration: reduced ? 0 : 900 },
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: (c) => `${c.dataset.label}：${c.parsed.y?.toLocaleString('ja-JP')}円/㎡` } } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: '#ece8df' }, ticks: { callback: (v) => `${(v / 10000).toLocaleString('ja-JP', { maximumFractionDigits: 1 })}万` } } },
      },
    });
  };

  const drawHazard = async () => {
    const ul = $('#va-hazard');
    if (!ul) return [];
    try {
      const list = await (await fetch(`${API}/hazard?lat=${state.lat}&lon=${state.lon}&muni=${state.muni ?? ''}`)).json();
      ul.innerHTML = list.map((h) => `<li class="lv-${h.level}"><span>${esc(h.name)}${h.detail ? `<small>${esc(h.detail)}</small>` : ''}${h.nearby ? `<small>${esc(h.nearby)}</small>` : ''}</span><b>${esc(h.label)}</b></li>`).join('');
      return list;
    } catch {
      ul.innerHTML = '<li class="lv-unknown"><span>災害の想定</span><b>取得できませんでした</b></li>';
      return [];
    }
  };

  const saveCarry = (d, input, hazards) => {
    try {
      sessionStorage.setItem('hp_est', JSON.stringify({
        addr: input.addr, type: input.type, landArea: input.landArea || null, bldgArea: input.bldgArea || null,
        builtYear: input.builtYear || null, wakeari: input.wakeari, muni: state.muni,
        price: d.ok && !input.wakeari.length ? { low: d.price.low, high: d.price.high } : null,
        hazards: hazards.filter((h) => h.level === 'warn' || h.level === 'danger').map((h) => `${h.name}：${h.label}`),
      }));
    } catch { /* 引き継げなくてもフォームは使える */ }
  };

  const render = async (d, input) => {
    current = { d, input };
    // 訳アリの物件は価格を出さないため、計算の内訳と手取り試算も出さない
    const priced = d.ok && !input.wakeari.length;
    const aichi = (state.muni ?? '').startsWith('23');
    result.innerHTML = priceBlock(d, input) + (aichi ? bookBlock(d, input) : '') + (priced ? breakdownBlock(d, input) : '') + recentBlock(d) + pointsBlock(d) + trendBlock(d) + zoningBlock(d) + hazardBlock() + (priced ? proceedsBlock(d, input) : '')
      + `<p class="note va-disclaimer">この査定は、宅地建物取引業者が公的データと取引データをもとに計算した価格の目安です。不動産鑑定士による不動産鑑定評価ではありません。実際の売却価格は、物件の状態・市場の動き・売り方によって変わります。作成日：${new Date().toLocaleDateString('ja-JP')}</p>`;
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    drawResultMap(d);
    drawTrend(d);
    const pc = $('#va-proceeds');
    if (pc) { pc.addEventListener('input', renderProceeds); pc.addEventListener('change', renderProceeds); renderProceeds(); }
    result.querySelector('[data-print]')?.addEventListener('click', () => print());
    $('#va-book-form')?.addEventListener('submit', submitBook);
    saveCarry(d, input, []);
    saveCarry(d, input, await drawHazard());
  };

  // ---- 査定サーバーにつながるか（つながらないときは、別の相談方法を先に案内する）----
  const ping = async () => {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 5000);
    try {
      const r = await fetch(`${API}/status`, { signal: ctl.signal });
      if (!r.ok) throw new Error(String(r.status));
    } catch {
      const note = document.createElement('div');
      note.className = 'box-caution';
      note.setAttribute('role', 'alert');
      note.innerHTML = '<strong>ただいまWeb査定を利用できません。</strong>お手数ですが、<a href="tel:000-0000-0000">000-0000-0000</a>（21時・土日祝も相談可）、<a href="#" rel="noopener">LINE（24時間受付）</a>、または<a href="../index.html">無料査定フォーム</a>からご依頼ください。代表が直接査定します。';
      form.prepend(note);
      $('#va-submit').disabled = true;
    } finally {
      clearTimeout(timer);
    }
  };
  ping();

  // ---- 入口ウィジェットからの引き継ぎ ----
  const params = new URLSearchParams(location.search);
  const presetType = form.querySelector(`[name="type"][value="${params.get('type')}"]`);
  if (presetType) presetType.checked = true;
  syncType();
  if (params.get('addr')) {
    form.addr.value = params.get('addr');
    window.addEventListener('load', () => { locate(); });
  }
})();
