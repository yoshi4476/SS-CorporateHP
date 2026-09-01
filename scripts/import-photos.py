# -*- coding: utf-8 -*-
"""写真素材/ の画像を、サイトで使う形に整えて public/images/ へ取り込む。

元データは1枚2MB前後あり、そのまま置くと表示が重くなる。
横1600pxに収め、JPEGへ変換して軽くする。
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "写真素材"
DST = ROOT / "public" / "images"
MAX_W = 1600
QUALITY = 82

# 元ファイル名 → 出力名。中身を確認したうえで用途に割り当てている。
MAP = {
    "Generated Image August 03, 2026 - 6_12PM.png": "biz-ai-consulting.jpg",
    "Generated Image August 03, 2026 - 6_25PM.png": "biz-system-development.jpg",
    "Generated Image August 03, 2026 - 6_12PM (1).png": "biz-ai-subsidy.jpg",
    "Generated Image August 03, 2026 - 6_13PM.png": "biz-aio.jpg",
    "Generated Image August 03, 2026 - 6_13PM (1).png": "biz-meo.jpg",
    "ChatGPT Image 2026年8月3日 20_00_27.png": "biz-web-production.jpg",
    "ChatGPT Image 2026年8月3日 19_52_17.png": "office-sign.jpg",
    "Generated Image August 03, 2026 - 6_27PM.png": "ceo-office.jpg",
    "Generated Image August 03, 2026 - 6_19PM.png": "strategy-board.jpg",
    "写真素材.jpg": "biz-ad-operations.jpg",
    # 経理BPOだけ合う素材がなく、生成したもの (nano_banana_pro / 2752x1536)
    "keiri-bpo-generated.png": "biz-keiri-bpo.jpg",
}

DST.mkdir(parents=True, exist_ok=True)
for src_name, out_name in MAP.items():
    p = SRC / src_name
    if not p.exists():
        print(f"  !! 見つからない: {src_name}")
        continue
    im = Image.open(p).convert("RGB")
    if im.width > MAX_W:
        im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
    out = DST / out_name
    im.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    print(f"  {out_name:30} {im.width}x{im.height}  {out.stat().st_size // 1024} KB")
