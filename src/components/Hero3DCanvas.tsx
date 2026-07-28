"use client";

// ヒーロー3D: ANSWER ASSEMBLY — 散らばる情報が『答え』に組み上がる。
// 約3,750粒のパーティクルが混沌の雲から精密な立方体へ収束し、
// しばらく保った後にほどけて、また組み上がる——を繰り返す。
// キャッチコピー「あなたの会社を、AIの『答え』にする。」の視覚化。
// ポストプロセスなし・軽量 (パーティクル補間のみ)。

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const N = 3750; // 25×25×6面
const CHAOS_HOLD = 2.0;
const ASSEMBLE = 1.7;
const ORDER_HOLD = 3.2;
const DISSOLVE = 1.7;
const PERIOD = CHAOS_HOLD + ASSEMBLE + ORDER_HOLD + DISSOLVE;
const CUBE = 1.32; // 立方体の半径

const smoothstep = (x: number) => x * x * (3 - 2 * x);

function orderliness(t: number) {
  const m = t % PERIOD;
  if (m < CHAOS_HOLD) return 0;
  if (m < CHAOS_HOLD + ASSEMBLE) return smoothstep((m - CHAOS_HOLD) / ASSEMBLE);
  if (m < CHAOS_HOLD + ASSEMBLE + ORDER_HOLD) return 1;
  return 1 - smoothstep((m - CHAOS_HOLD - ASSEMBLE - ORDER_HOLD) / DISSOLVE);
}

function buildTargets() {
  const chaos = new Float32Array(N * 3);
  const cube = new Float32Array(N * 3);
  let seed = 11;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  for (let i = 0; i < N; i++) {
    // 混沌: 不均一な球状の雲
    const r = 1.4 + Math.pow(rand(), 0.6) * 2.4;
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(rand() * 2 - 1);
    chaos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    chaos[i * 3 + 1] = r * Math.cos(ph) * 0.85;
    chaos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);

    // 秩序: 立方体の表面格子 (25×25 × 6面)
    const face = i % 6;
    const idx = Math.floor(i / 6);
    const gx = (idx % 25) / 24;
    const gy = (Math.floor(idx / 25) % 25) / 24;
    const a = (gx - 0.5) * 2 * CUBE;
    const b = (gy - 0.5) * 2 * CUBE;
    const s = CUBE;
    let x = 0, y = 0, z = 0;
    if (face === 0) [x, y, z] = [a, b, s];
    else if (face === 1) [x, y, z] = [a, b, -s];
    else if (face === 2) [x, y, z] = [s, a, b];
    else if (face === 3) [x, y, z] = [-s, a, b];
    else if (face === 4) [x, y, z] = [a, s, b];
    else [x, y, z] = [a, -s, b];
    cube[i * 3] = x;
    cube[i * 3 + 1] = y;
    cube[i * 3 + 2] = z;
  }
  return { chaos, cube };
}

function Assembly() {
  const group = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const mainGeo = useRef<THREE.BufferGeometry>(null);
  const accentGeo = useRef<THREE.BufferGeometry>(null);
  const edgesMat = useRef<THREE.LineBasicMaterial>(null);

  const { chaos, cube, positions, accentIdx, accentPositions, edges } = useMemo(() => {
    const { chaos, cube } = buildTargets();
    const accentIdx: number[] = [];
    for (let i = 0; i < N; i += 31) accentIdx.push(i);
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(CUBE * 2, CUBE * 2, CUBE * 2));
    return {
      chaos,
      cube,
      positions: new Float32Array(N * 3),
      accentIdx,
      accentPositions: new Float32Array(accentIdx.length * 3),
      edges,
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const u = orderliness(t);
    const wob = (1.05 - u) * 0.05;

    for (let i = 0; i < N * 3; i += 3) {
      positions[i] = chaos[i] + (cube[i] - chaos[i]) * u + Math.sin(t * 1.3 + i) * wob;
      positions[i + 1] = chaos[i + 1] + (cube[i + 1] - chaos[i + 1]) * u + Math.cos(t * 1.1 + i) * wob;
      positions[i + 2] = chaos[i + 2] + (cube[i + 2] - chaos[i + 2]) * u + Math.sin(t * 0.9 + i * 2) * wob;
    }
    mainGeo.current?.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    for (let k = 0; k < accentIdx.length; k++) {
      const i = accentIdx[k] * 3;
      accentPositions[k * 3] = positions[i];
      accentPositions[k * 3 + 1] = positions[i + 1];
      accentPositions[k * 3 + 2] = positions[i + 2];
    }
    accentGeo.current?.setAttribute("position", new THREE.BufferAttribute(accentPositions, 3));

    // 完成した瞬間だけ稜線が浮かぶ
    if (edgesMat.current) edgesMat.current.opacity = Math.max(0, u - 0.72) * 2.6;

    if (spinner.current) {
      spinner.current.rotation.y = t * 0.22;
      spinner.current.rotation.x = 0.35 + Math.sin(t * 0.24) * 0.1;
    }
    if (group.current) {
      group.current.rotation.y = state.pointer.x * 0.22;
      group.current.rotation.x = -state.pointer.y * 0.15;
    }
  });

  return (
    <group ref={group}>
      <group ref={spinner}>
        <points>
          <bufferGeometry ref={mainGeo} />
          <pointsMaterial color="#2b4bff" size={0.032} sizeAttenuation transparent opacity={0.8} />
        </points>
        <points>
          <bufferGeometry ref={accentGeo} />
          <pointsMaterial color="#22d3ee" size={0.08} sizeAttenuation transparent opacity={0.95} />
        </points>
        {/* 『答え』の稜線 (組み上がった時のみ) */}
        <lineSegments geometry={edges}>
          <lineBasicMaterial ref={edgesMat} color="#22d3ee" transparent opacity={0} />
        </lineSegments>
      </group>

      {/* オービットリング */}
      <mesh rotation={[Math.PI / 2.4, 0, 0.35]}>
        <torusGeometry args={[2.7, 0.006, 8, 120]} />
        <meshBasicMaterial color="#6d8cff" transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 1.85, 0.4, -0.25]}>
        <torusGeometry args={[3.2, 0.004, 8, 120]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function Hero3DCanvas({
  offset = [2.2, 0.1, 0],
}: {
  offset?: [number, number, number];
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 6.4], fov: 46 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <group position={offset}>
        <Assembly />
      </group>
    </Canvas>
  );
}
