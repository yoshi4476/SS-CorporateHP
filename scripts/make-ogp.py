# -*- coding: utf-8 -*-
"""OGP画像を現行のコピー・配色で作り直す。

旧OGPは電光ブルーの配色、旧キャッチ、「6事業」のまま取り残されていた。
SNSやLINEで最初に見えるのはこの1枚なので、サイト本体とずれていると
別の会社に見える。
"""
import pathlib
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = pathlib.Path(r"c:\Users\user\Desktop\システム開発\SSコーポレートサイト\public\ogp.png")
W, H, SS = 1200, 630, 2

PAPER = (251, 252, 253)
INK = (13, 20, 32)
SLATE = (90, 102, 120)
LINE = (226, 230, 236)
PULSE = (28, 63, 124)
GOLD = (168, 100, 26)
GOLD_BRIGHT = (232, 163, 61)
WHITE = (255, 255, 255)

JP_B = r"C:\Windows\Fonts\YuGothB.ttc"
JP_R = r"C:\Windows\Fonts\YuGothR.ttc"
MONO = r"C:\Windows\Fonts\consola.ttf"
f = lambda p, s: ImageFont.truetype(p, s * SS)

im = Image.new("RGB", (W * SS, H * SS), PAPER)
d = ImageDraw.Draw(im)
step = 40 * SS
for x in range(0, W * SS, step):
    d.line([(x, 0), (x, H * SS)], fill=(243, 246, 251), width=SS)
for y in range(0, H * SS, step):
    d.line([(0, y), (W * SS, y)], fill=(243, 246, 251), width=SS)
glow = Image.new("RGB", (W * SS, H * SS), PAPER)
g = ImageDraw.Draw(glow)
g.ellipse([int(W * .55) * SS, int(-H * .3) * SS, int(W * 1.3) * SS, int(H * .9) * SS], fill=(228, 234, 245))
g.ellipse([int(W * .62) * SS, int(H * .5) * SS, int(W * 1.2) * SS, int(H * 1.35) * SS], fill=(252, 244, 232))
im = Image.blend(im, glow.filter(ImageFilter.GaussianBlur(90 * SS)), .6)
d = ImageDraw.Draw(im)

X = 72
d.rectangle([X * SS, 62 * SS, (X + 74) * SS, 67 * SS], fill=GOLD)
d.text((X * SS, 92 * SS), "OSAKA / AI CONSULTING & DIGITAL MARKETING", font=f(MONO, 17), fill=PULSE)

d.text((X * SS, 142 * SS), "人を増やさずに、", font=f(JP_B, 64), fill=INK)
d.text((X * SS, 236 * SS), "集客も経理も回す。", font=f(JP_B, 64), fill=PULSE)

d.text((X * SS, 366 * SS), "MEO運用 通算3,200社 で積んだ現場データと、AIによる自動化。", font=f(JP_R, 21), fill=SLATE)
d.text((X * SS, 404 * SS), "集客から社内業務、その費用を下げる補助金までを、ひとつのチームで。", font=f(JP_R, 21), fill=SLATE)

# 実績。サイトのカードと同じ見え方に合わせる
stats = [("3,200", "社", "MEO通算支援"), ("90", "%+", "補助金 採択率"), ("7", "事業", "一気通貫で支援")]
bw, bh, gap = 148, 96, 14
bx = W - X - (bw * 3 + gap * 2)
for i, (v, u, lb) in enumerate(stats):
    x = bx + i * (bw + gap)
    d.rounded_rectangle([x * SS, 470 * SS, (x + bw) * SS, (470 + bh) * SS], radius=12 * SS,
                        fill=WHITE, outline=LINE, width=2 * SS)
    fv = f(MONO, 34)
    d.text(((x + 18) * SS, 494 * SS), v, font=fv, fill=INK)
    d.text(((x + 18 + d.textlength(v, font=fv) / SS + 4) * SS, 512 * SS), u, font=f(JP_B, 15), fill=GOLD)
    d.text(((x + 18) * SS, 538 * SS), lb, font=f(JP_R, 13), fill=SLATE)

d.text((X * SS, 492 * SS), "SEVEN", font=f(MONO, 30), fill=INK)
d.text(((X + 92) * SS, 492 * SS), "SENSES", font=f(MONO, 30), fill=PULSE)
d.text((X * SS, 534 * SS), "セブンセンシズ株式会社", font=f(JP_R, 15), fill=SLATE)

im.resize((W, H), Image.LANCZOS).save(OUT, optimize=True)
print(f"OGP再生成 {OUT.stat().st_size // 1024} KB")
