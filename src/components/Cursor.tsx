"use client";

// カスタムカーソル: 立体3Dドローン。
// 機体を5枚のレイヤー (脚/アーム/機体上部/モーター/プロペラ) に分割し、
// preserve-3d + translateZ で実際の奥行きを持たせる。
// マウス速度からピッチ/ロールを算出して傾き、レイヤー間の視差で立体に見える。
// クリック中はプロペラが停止して沈む。タッチ端末・reduced-motion では非表示。

import { useEffect } from "react";

const MAGNET = 0.32;
// ドローンが正確な位置を隠してしまうため、実際のカーソル位置には
// 小さな照準を出し、ドローンは左上に離れた位置を遅れて追尾させる。
const DRONE_OFF_X = -40;
const DRONE_OFF_Y = -36;
const DRONE_EASE = 0.085;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const SVG_OPEN = `<svg viewBox="0 0 72 72" aria-hidden="true">`;

const DEFS = `
  <defs>
    <radialGradient id="dHull" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#3b5583" />
      <stop offset="45%" stop-color="#16213a" />
      <stop offset="100%" stop-color="#060b16" />
    </radialGradient>
    <radialGradient id="dCanopy" cx="38%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#b8e9ff" />
      <stop offset="42%" stop-color="#2b6bff" />
      <stop offset="100%" stop-color="#14264d" />
    </radialGradient>
    <radialGradient id="dMotor" cx="36%" cy="30%" r="78%">
      <stop offset="0%" stop-color="#f2f7ff" />
      <stop offset="45%" stop-color="#8fa2bd" />
      <stop offset="100%" stop-color="#25334c" />
    </radialGradient>
    <radialGradient id="dDisc" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgb(125 144 173 / 0.04)" />
      <stop offset="76%" stop-color="rgb(125 144 173 / 0.12)" />
      <stop offset="92%" stop-color="rgb(116 199 214 / 0.35)" />
      <stop offset="100%" stop-color="rgb(125 144 173 / 0.05)" />
    </radialGradient>
    <linearGradient id="dArm" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#41527a" />
      <stop offset="55%" stop-color="#1a2743" />
      <stop offset="100%" stop-color="#0a1222" />
    </linearGradient>
  </defs>`;

// レイヤー1: 着陸脚 (最下層)
const L_LEGS = `${SVG_OPEN}
  <g stroke="#0a0f1c" stroke-width="2.6" stroke-linecap="round" opacity="0.9">
    <line x1="27" y1="44" x2="25" y2="50" /><line x1="45" y1="44" x2="47" y2="50" />
    <line x1="22" y1="50.5" x2="30" y2="50.5" /><line x1="42" y1="50.5" x2="50" y2="50.5" />
  </g>
</svg>`;

// レイヤー2: アーム + 機体ベース
const L_HULL = `${SVG_OPEN}${DEFS}
  <g fill="url(#dArm)">
    <path d="M32.5 33.5 L17.4 18.6 a3 3 0 1 1 3.2 -3.2 L34 30.5 Z" />
    <path d="M39.5 33.5 L54.6 18.6 a3 3 0 1 0 -3.2 -3.2 L38 30.5 Z" />
    <path d="M32.5 38.5 L17.4 53.4 a3 3 0 1 0 3.2 3.2 L34 41.5 Z" />
    <path d="M39.5 38.5 L54.6 53.4 a3 3 0 1 1 -3.2 3.2 L38 41.5 Z" />
  </g>
  <ellipse cx="36" cy="38" rx="13.5" ry="10" fill="#060b16" />
</svg>`;

// レイヤー3: 機体上部 + キャノピー + カメラ
const L_TOP = `${SVG_OPEN}${DEFS}
  <ellipse cx="36" cy="36" rx="12.8" ry="9.4" fill="url(#dHull)" />
  <path d="M25.5 33 Q36 26.5 46.5 33" fill="none" stroke="#74c7d6" stroke-width="1" stroke-linecap="round" opacity="0.75" />
  <path d="M26.5 40.5 Q36 45.5 45.5 40.5" fill="none" stroke="#7d90ad" stroke-width="0.8" stroke-linecap="round" opacity="0.4" />
  <ellipse cx="33.6" cy="31.8" rx="6.2" ry="3.7" fill="url(#dCanopy)" />
  <ellipse cx="31.6" cy="30.6" rx="2.3" ry="1.1" fill="#ffffff" opacity="0.8" />
  <circle cx="36" cy="43.4" r="3" fill="#0a0f1c" />
  <circle cx="36" cy="43.4" r="1.8" fill="#14264d" />
  <circle cx="36" cy="43.4" r="0.95" fill="#74c7d6" />
  <circle cx="35.5" cy="42.9" r="0.35" fill="#eafcff" />
  <rect x="35.4" y="26.6" width="1.2" height="2.8" rx="0.6" fill="#41527a" />
  <circle cx="36" cy="26.2" r="0.9" fill="#ff5d5d" opacity="0.95" />
</svg>`;

// レイヤー4: モーターポッド + LED
const L_PODS = `${SVG_OPEN}${DEFS}
  <g>
    <circle cx="16" cy="16" r="5" fill="url(#dMotor)" /><circle cx="16" cy="16" r="5" fill="none" stroke="#0a1222" stroke-width="0.8" /><circle cx="16" cy="16" r="1.6" fill="#0a1222" />
    <circle cx="56" cy="16" r="5" fill="url(#dMotor)" /><circle cx="56" cy="16" r="5" fill="none" stroke="#0a1222" stroke-width="0.8" /><circle cx="56" cy="16" r="1.6" fill="#0a1222" />
    <circle cx="16" cy="56" r="5" fill="url(#dMotor)" /><circle cx="16" cy="56" r="5" fill="none" stroke="#0a1222" stroke-width="0.8" /><circle cx="16" cy="56" r="1.6" fill="#0a1222" />
    <circle cx="56" cy="56" r="5" fill="url(#dMotor)" /><circle cx="56" cy="56" r="5" fill="none" stroke="#0a1222" stroke-width="0.8" /><circle cx="56" cy="56" r="1.6" fill="#0a1222" />
  </g>
  <circle cx="16" cy="16" r="1.1" fill="#74c7d6" /><circle cx="56" cy="16" r="1.1" fill="#74c7d6" />
  <circle cx="16" cy="56" r="1.1" fill="#7d90ad" /><circle cx="56" cy="56" r="1.1" fill="#7d90ad" />
</svg>`;

// レイヤー5: プロペラ (最上層・回転)
function propGroup(cx: number, cy: number) {
  return `
  <g class="prop" style="--cx:${cx}px;--cy:${cy}px">
    <circle cx="${cx}" cy="${cy}" r="12.5" fill="url(#dDisc)" />
    <path d="M${cx - 12.5} ${cy} A12.5 12.5 0 0 1 ${cx} ${cy - 12.5}" fill="none" stroke="#74c7d6" stroke-width="0.9" opacity="0.5" />
    <g opacity="0.6">
      <rect x="${cx - 11.8}" y="${cy - 1.25}" width="23.6" height="2.5" rx="1.25" fill="#aac2e8" />
      <rect x="${cx - 1.25}" y="${cy - 11.8}" width="2.5" height="23.6" rx="1.25" fill="#aac2e8" />
    </g>
    <g opacity="0.28" transform="rotate(45 ${cx} ${cy})">
      <rect x="${cx - 11.8}" y="${cy - 1.25}" width="23.6" height="2.5" rx="1.25" fill="#d5e4fb" />
      <rect x="${cx - 1.25}" y="${cy - 11.8}" width="2.5" height="23.6" rx="1.25" fill="#d5e4fb" />
    </g>
  </g>`;
}

const L_PROPS = `${SVG_OPEN}${DEFS}
  ${propGroup(16, 16)}${propGroup(56, 16)}${propGroup(16, 56)}${propGroup(56, 56)}
</svg>`;

const DRONE_HTML = `
  <div class="drone-shadow"></div>
  <div class="drone-rig">
    <div class="drone-bob">
      <div class="dlayer d-legs">${L_LEGS}</div>
      <div class="dlayer d-hull">${L_HULL}</div>
      <div class="dlayer d-top">${L_TOP}</div>
      <div class="dlayer d-pods">${L_PODS}</div>
      <div class="dlayer d-props">${L_PROPS}</div>
    </div>
  </div>`;

export default function Cursor() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const drone = document.createElement("div");
    drone.className = "cursor-drone";
    drone.innerHTML = DRONE_HTML;

    // 実際のクリック位置を示す照準 (ドローンとは別に、遅れなく追従する)
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.innerHTML = `<span class="cdot"></span><span class="cring"></span>`;

    document.body.append(drone, dot);
    document.documentElement.classList.add("has-cursor");
    const rig = drone.querySelector<HTMLElement>(".drone-rig")!;

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    const pos = { x, y };
    let roll = 0;
    let pitch = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;

      const t = e.target as HTMLElement | null;
      const interactive = t?.closest?.("a, button, [data-cursor-grow]");
      drone.classList.toggle("is-hover", !!interactive);
      dot.classList.toggle("is-hover", !!interactive);

    };
    addEventListener("mousemove", onMove, { passive: true });

    // 実際のクリックは100ms前後で終わるため、押した瞬間の演出が見えないまま
    // 戻ってしまう。最低でもこの時間は着地状態を保つ。
    const MIN_CLICK_MS = 190;
    let downAt = 0;
    let releaseTimer = 0;

    const onDown = () => {
      clearTimeout(releaseTimer);
      downAt = performance.now();
      drone.classList.add("is-click");
      dot.classList.add("is-click");
    };
    const onUp = () => {
      clearTimeout(releaseTimer);
      const held = performance.now() - downAt;
      releaseTimer = window.setTimeout(() => {
        drone.classList.remove("is-click");
        dot.classList.remove("is-click");
      }, Math.max(0, MIN_CLICK_MS - held));
    };
    // pointerdown はマウス以外の入力でも発火し、mousedown より先に届く
    addEventListener("pointerdown", onDown, { passive: true });
    addEventListener("pointerup", onUp, { passive: true });
    addEventListener("pointercancel", onUp, { passive: true });
    addEventListener("blur", onUp);

    let raf = 0;
    const loop = () => {
      // 照準は遅れなく実際のカーソル位置へ
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // ドローンは離れた位置を追いかける
      const tx = x + DRONE_OFF_X;
      const ty = y + DRONE_OFF_Y;
      const vx = tx - pos.x;
      const vy = ty - pos.y;
      pos.x = lerp(pos.x, tx, DRONE_EASE);
      pos.y = lerp(pos.y, ty, DRONE_EASE);
      // 姿勢: ベース48°の見下ろし + 進行方向へのピッチ/ロール
      roll = lerp(roll, clamp(vx * 0.5, -34, 34), 0.1);
      pitch = lerp(pitch, clamp(vy * 0.5, -28, 28), 0.1);
      drone.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      rig.style.transform = `rotateX(${(48 - pitch).toFixed(2)}deg) rotateY(${roll.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(releaseTimer);
      removeEventListener("mousemove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
      removeEventListener("blur", onUp);
      drone.remove();
      dot.remove();
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return null;
}
