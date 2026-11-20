// 売却後の手取りシミュレーション（譲渡所得税の計算）
// 根拠：宅地建物取引業法の報酬告示（仲介手数料の上限）／印紙税の軽減措置（2027年3月31日まで）／
//       所得税法施行令85条（非業務用建物の償却：耐用年数×1.5の旧定額法、取得価額の95%まで）／
//       国税庁「建物の標準的な建築価額表」（建物の取得価額が分からない場合）／
//       租税特別措置法 31・32条（長期・短期）、31条の3（10年超所有の軽減税率）、35条（3,000万円特別控除・相続空き家）、
//       39条（相続財産を譲渡した場合の取得費加算）、所得税基本通達38-16（概算取得費5%）
(() => {
  const TAX = 1.1;
  // 建物の標準的な建築価額表（千円/㎡）：[木造, 鉄骨鉄筋コンクリート, 鉄筋コンクリート, 鉄骨]
  const STD = {
    1979: [82.5, 128.9, 114.3, 75.4], 1980: [92.5, 149.4, 129.7, 84.1], 1981: [98.3, 161.8, 138.7, 91.7], 1982: [101.3, 170.9, 143.0, 93.9], 1983: [102.2, 168.0, 143.8, 94.3],
    1984: [102.8, 161.2, 141.7, 95.3], 1985: [104.2, 172.2, 144.5, 96.9], 1986: [106.2, 181.9, 149.5, 102.6], 1987: [110.0, 191.8, 156.6, 108.4], 1988: [116.5, 203.6, 175.0, 117.3],
    1989: [123.1, 237.3, 193.3, 128.4], 1990: [131.7, 286.7, 222.9, 147.4], 1991: [137.6, 329.8, 246.8, 158.7], 1992: [143.5, 333.7, 245.6, 162.4], 1993: [150.9, 300.3, 227.5, 159.2],
    1994: [156.6, 262.9, 212.8, 148.4], 1995: [158.3, 228.8, 199.0, 143.2], 1996: [161.0, 229.7, 198.0, 143.6], 1997: [160.5, 223.0, 201.0, 141.0], 1998: [158.6, 225.6, 203.8, 138.7],
    1999: [159.3, 220.9, 197.9, 139.4], 2000: [159.0, 204.3, 182.6, 132.3], 2001: [157.2, 186.1, 177.8, 136.4], 2002: [153.6, 195.2, 180.5, 135.0], 2003: [152.7, 187.3, 179.5, 131.4],
    2004: [152.1, 190.1, 176.1, 130.6], 2005: [151.9, 185.7, 171.5, 132.8], 2006: [152.9, 170.5, 178.6, 133.7], 2007: [153.6, 182.5, 185.8, 135.6], 2008: [156.0, 229.1, 206.1, 158.3],
    2009: [156.6, 265.2, 219.0, 169.5], 2010: [156.5, 226.4, 205.9, 163.0], 2011: [156.8, 238.4, 197.0, 158.9], 2012: [157.6, 223.3, 193.9, 155.6], 2013: [159.9, 258.5, 203.8, 164.3],
    2014: [163.0, 276.2, 228.0, 176.4], 2015: [165.4, 262.2, 240.2, 197.3], 2016: [165.9, 308.3, 254.2, 204.1], 2017: [166.7, 350.4, 265.5, 214.6], 2018: [168.5, 304.2, 263.1, 214.1],
    2019: [170.1, 363.3, 285.6, 228.8], 2020: [172.0, 279.2, 276.9, 230.2], 2021: [172.2, 338.4, 288.2, 227.3], 2022: [176.2, 434.4, 277.5, 241.5], 2023: [204.1, 366.7, 314.3, 281.1],
  };
  const STD_COL = { wood: 0, src: 1, rc: 2, steel: 3, lsteel: 3 };
  // 非業務用建物の償却率（法定耐用年数×1.5年の旧定額法）
  const DEP_RATE = { wood: 0.031, lsteel: 0.036, steel: 0.020, rc: 0.015, src: 0.015 };
  const DEP_NOTE = { lsteel: '軽量鉄骨（骨格材3mm以下）の率。3mm超4mm以下は0.025' };

  const brokerage = (price) => {
    if (price <= 2000000) return price * 0.05 * TAX;
    if (price <= 4000000) return (price * 0.04 + 20000) * TAX;
    return (price * 0.03 + 60000) * TAX;
  };
  const stamp = (price) => {
    const table = [[10000, 0], [500000, 200], [1000000, 500], [5000000, 1000], [10000000, 5000], [50000000, 10000], [100000000, 30000], [500000000, 60000], [1000000000, 160000]];
    for (const [max, fee] of table) if (price <= max) return fee;
    return 320000;
  };

  // 建物の取得価額が分からないとき：標準的な建築価額 × 床面積
  const standardBuildingCost = (builtYear, structure, floorArea) => {
    const row = STD[Math.min(2023, builtYear)];
    return row ? row[STD_COL[structure] ?? 0] * 1000 * floorArea : null;
  };

  const calc = (o) => {
    const saleYear = o.saleYear ?? new Date().getFullYear();
    const warnings = [];
    const price = o.price;
    const fee = Math.floor(brokerage(price));
    const stampTax = stamp(price);
    const release = o.loan > 0 ? 2 * 1000 + 15000 : 0; // 抵当権抹消：登録免許税1,000円×2件＋司法書士報酬の目安
    const otherCost = o.otherCost || 0;               // 測量・解体など
    const transferCost = fee + stampTax + otherCost;

    // ---- 取得費 ----
    let acquisition = null; let buildingCost = null; let dep = 0; let method = '';
    if (o.purchase > 0) {
      const hasBuilding = o.type !== 'land' && o.floorArea > 0;
      buildingCost = hasBuilding ? (o.buildingPurchase > 0 ? o.buildingPurchase : standardBuildingCost(o.builtYear, o.structure, o.floorArea)) : 0;
      if (hasBuilding && buildingCost == null) {
        warnings.push('1978年以前の建物は、標準的な建築価額表（国税庁サイト）で建物の取得価額を確認してください。建物を0円として計算しています。');
        buildingCost = 0;
      }
      buildingCost = Math.min(buildingCost, o.purchase);
      const years = Math.max(0, saleYear - (o.acquiredYear || saleYear));
      const rate = DEP_RATE[o.structure] ?? DEP_RATE.wood;
      dep = Math.min(buildingCost * 0.95, buildingCost * 0.9 * rate * years);
      acquisition = o.purchase - dep + (o.purchaseCost || 0);
      method = o.buildingPurchase > 0 ? '買ったときの価格（建物の減価償却後）' : '買ったときの価格（建物は国税庁の標準的な建築価額で按分・減価償却後）';
      if (DEP_NOTE[o.structure]) warnings.push(DEP_NOTE[o.structure]);
    }
    const rough = price * 0.05;
    if (acquisition == null || acquisition < rough) {
      if (acquisition != null) warnings.push('実際の取得費より概算取得費（売却価格の5%）のほうが大きいため、概算取得費で計算しています。');
      acquisition = rough;
      method = '概算取得費（売却価格の5%）';
    }

    // ---- 相続税の取得費加算（租税特別措置法39条）----
    let inheritAdd = 0;
    if (o.special === 'inheritAdd') {
      if (o.inheritTax > 0 && o.inheritValue > 0 && o.inheritBase > 0) {
        inheritAdd = Math.floor(o.inheritTax * Math.min(1, o.inheritValue / o.inheritBase));
      } else warnings.push('取得費加算の計算には、相続税額・この不動産の相続税評価額・課税価格の合計が必要です。');
    }

    // ---- 所有期間（売った年の1月1日時点）----
    const held = o.acquiredYear ? saleYear - o.acquiredYear : null;
    const longTerm = held == null ? true : held >= 6;
    const over10 = held == null ? false : held >= 11;
    if (held == null) warnings.push('取得した年が分からないため、長期譲渡（5年超）として計算しています。');

    // ---- 特別控除 ----
    const gain = Math.max(0, price - acquisition - inheritAdd - transferCost);
    let deduction = 0; let deductionLabel = '';
    if (o.special === 'home') {
      deduction = Math.min(gain, 30000000); deductionLabel = '居住用財産の3,000万円特別控除';
    } else if (o.special === 'akiya') {
      const limit = o.heirs >= 3 ? 20000000 : 30000000;
      deduction = Math.min(gain, limit);
      deductionLabel = `相続した空き家の特別控除（上限${limit / 10000}万円）`;
      if (o.builtYear && o.builtYear > 1981) warnings.push('相続空き家の特例は、1981年5月31日以前に建てられた家が対象です。');
      if (price > 100000000) warnings.push('相続空き家の特例は、売却価格が1億円以下の場合に限られます。');
      warnings.push('相続空き家の特例は、耐震改修または取り壊し（売った翌年2月15日まで可）と、相続から3年目の年末までの売却が条件です。');
    }
    const taxable = Math.max(0, gain - deduction);

    let incomeTax; let rateLabel;
    if (!longTerm) { incomeTax = taxable * 0.3963; rateLabel = '短期譲渡 39.63%（所得税30.63%・住民税9%）'; }
    else if (o.special === 'home' && over10) {
      incomeTax = Math.min(taxable, 60000000) * 0.1421 + Math.max(0, taxable - 60000000) * 0.20315;
      rateLabel = '10年超所有の軽減税率 14.21%（6,000万円以下の部分）';
    } else { incomeTax = taxable * 0.20315; rateLabel = '長期譲渡 20.315%（所得税15.315%・住民税5%）'; }
    incomeTax = Math.floor(incomeTax);

    if (price <= 8000000) warnings.push('800万円以下の空き家などは、事前の合意により仲介手数料の上限が30万円（税別）になる場合があります。');
    if (price - acquisition - inheritAdd - transferCost < 0) warnings.push('売却損が出ています。自宅の買い換えなどでは、損失をほかの所得と相殺できる特例があります。');

    const net = price - fee - stampTax - otherCost - release - incomeTax - (o.loan || 0);
    return {
      price, fee, stampTax, otherCost, release, loan: o.loan || 0, acquisition: Math.floor(acquisition), method, buildingCost: buildingCost && Math.floor(buildingCost),
      depreciation: Math.floor(dep), inheritAdd, gain: Math.floor(gain), deduction, deductionLabel, taxable: Math.floor(taxable),
      held, longTerm, rateLabel, incomeTax, net: Math.floor(net), warnings,
    };
  };

  window.Proceeds = { calc, standardBuildingCost };
})();
