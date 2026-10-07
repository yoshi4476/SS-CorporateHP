// MEO運用 累計支援店舗数の推移 (実績値)。
// トップの推移グラフ（GrowthChart・ブラウザで動く部品）と、数字の区画（NumberWall・サーバーで描く部品）の両方が読む。
// "use client" の部品の中に置くと、サーバーの部品からは値として読めないため、ここに分けている。
export const meoGrowth: { year: string; total: number }[] = [
  { year: "2019", total: 150 },
  { year: "2020", total: 420 },
  { year: "2021", total: 850 },
  { year: "2022", total: 1350 },
  { year: "2023", total: 1950 },
  { year: "2024", total: 2500 },
  { year: "2025", total: 2950 },
  { year: "2026", total: 3200 },
];
