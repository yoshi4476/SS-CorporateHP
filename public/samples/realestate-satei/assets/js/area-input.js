// 面積の入力欄を「㎡／坪」で切り替えられるようにする共通部品。
// <input data-area> に付けると、単位ボタンと換算表示を加える。値は AreaInput.sqm(input) で常に㎡で取り出す。
(() => {
  const TSUBO = 3.30578; // 1坪＝3.30578㎡（400/121）
  const fmt = (v, d = 1) => Number(v).toLocaleString('ja-JP', { maximumFractionDigits: d });

  const enhance = (input) => {
    if (input.dataset.areaReady) return;
    input.dataset.areaReady = '1';
    input.dataset.unit = 'sqm';
    const wrap = input.closest('.unit-input');
    const suffix = wrap.querySelector('span');
    const group = document.createElement('div');
    group.className = 'unit-toggle';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', `${input.labels?.[0]?.textContent.replace(/必須|任意/g, '').trim() ?? '面積'}の単位`);
    group.innerHTML = '<button type="button" data-u="sqm" aria-pressed="true">㎡</button><button type="button" data-u="tsubo" aria-pressed="false">坪</button>';
    wrap.after(group);
    const conv = document.createElement('p');
    conv.className = 'hint area-conv';
    conv.setAttribute('aria-live', 'polite');
    group.after(conv);

    const update = () => {
      const v = parseFloat(input.value);
      if (!(v > 0)) { conv.textContent = ''; return; }
      conv.textContent = input.dataset.unit === 'tsubo' ? `＝ 約${fmt(v * TSUBO)}㎡` : `＝ 約${fmt(v / TSUBO)}坪`;
    };
    group.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-u]');
      if (!b || b.dataset.u === input.dataset.unit) return;
      const v = parseFloat(input.value);
      // 入力済みの値は、単位を切り替えても同じ広さのまま換算する
      if (v > 0) input.value = b.dataset.u === 'tsubo' ? (v / TSUBO).toFixed(1) : (v * TSUBO).toFixed(1);
      input.dataset.unit = b.dataset.u;
      suffix.textContent = b.dataset.u === 'tsubo' ? '坪' : '㎡';
      group.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      update();
    });
    input.addEventListener('input', () => { delete input.dataset.estimated; update(); });
    input.addEventListener('area:set', update);
  };

  window.AreaInput = {
    TSUBO,
    enhance,
    // ㎡に直した値（未入力は 0）
    sqm: (input) => {
      const v = parseFloat(input.value);
      if (!(v > 0)) return 0;
      return Math.round((input.dataset.unit === 'tsubo' ? v * TSUBO : v) * 100) / 100;
    },
    // 目安の値（㎡）を入れる。いま選ばれている単位で表示する
    setSqm: (input, sqm, estimated = true) => {
      input.value = input.dataset.unit === 'tsubo' ? (sqm / TSUBO).toFixed(1) : String(Math.round(sqm));
      if (estimated) input.dataset.estimated = '1';
      input.dispatchEvent(new Event('area:set'));
    },
  };
  document.querySelectorAll('input[data-area]').forEach(enhance);
})();
