# -*- coding: utf-8 -*-
"""サイト用のビジュアルを生成する。

写真素材の権利問題を避けるため、掲載する図版はすべて自前で生成している。
配色はサイトのトークン (globals.css の PRISM) に合わせてあるので、
ページに置いたときに浮かない。

使い方:
    python scripts/make-visuals.py            # 全部作り直す
    python scripts/make-visuals.py aio        # 1枚だけ作り直す
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).resolve().parent.parent / "public" / "images"
W, H = 1200, 660
SS = 2  # 描画は2倍で行い、最後に縮小してエッジを滑らかにする

# globals.css の @theme と同じ値。サイトの配色を紺へ寄せた際に
# ここが電光ブルーのまま取り残されていたので揃えた。
PAPER = (251, 252, 253)
INK = (13, 20, 32)
SLATE = (90, 102, 120)
FAINT = (100, 112, 130)
LINE = (226, 230, 236)
PULSE = (28, 63, 124)
AQUA = (116, 199, 214)
GLOW = (125, 144, 173)
# 紺と対になるアクセント。成果・お金にあたるものだけに使う
GOLD = (168, 100, 26)
GOLD_BRIGHT = (232, 163, 61)
GOLD_TINT = (253, 246, 236)
WHITE = (255, 255, 255)

JP_B = r"C:\Windows\Fonts\YuGothB.ttc"
JP_R = r"C:\Windows\Fonts\YuGothR.ttc"
MONO = r"C:\Windows\Fonts\consola.ttf"


def font(path, size):
    return ImageFont.truetype(path, size * SS)


def canvas():
    """紙色の背景に、細いグリッドと淡い光を敷く"""
    im = Image.new("RGB", (W * SS, H * SS), PAPER)
    d = ImageDraw.Draw(im)
    step = 40 * SS
    for x in range(0, W * SS, step):
        d.line([(x, 0), (x, H * SS)], fill=(243, 246, 251), width=SS)
    for y in range(0, H * SS, step):
        d.line([(0, y), (W * SS, y)], fill=(243, 246, 251), width=SS)

    glow = Image.new("RGB", (W * SS, H * SS), PAPER)
    g = ImageDraw.Draw(glow)
    g.ellipse([int(W * 0.52) * SS, int(-H * 0.25) * SS, int(W * 1.25) * SS, int(H * 0.85) * SS], fill=(228, 234, 245))
    g.ellipse([int(W * 0.62) * SS, int(H * 0.45) * SS, int(W * 1.15) * SS, int(H * 1.3) * SS], fill=(252, 244, 232))
    glow = glow.filter(ImageFilter.GaussianBlur(90 * SS))
    return Image.blend(im, glow, 0.55), None


def finish(im, eyebrow, title, sub, name):
    d = ImageDraw.Draw(im)
    d.text((64 * SS, 56 * SS), eyebrow, font=font(MONO, 15), fill=PULSE)
    d.text((64 * SS, 84 * SS), title, font=font(JP_B, 34), fill=INK)
    if sub:
        d.text((64 * SS, 132 * SS), sub, font=font(JP_R, 16), fill=SLATE)
    d.line([(64 * SS, (H - 56) * SS), (140 * SS, (H - 56) * SS)], fill=GOLD, width=3 * SS)
    im = im.resize((W, H), Image.LANCZOS)
    im.save(OUT / name, optimize=True)
    print(f"  {name}  {(OUT / name).stat().st_size // 1024} KB")


def rrect(d, box, r, **kw):
    d.rounded_rectangle(box, radius=r * SS, **kw)


def card(d, x, y, w, h, label=None, accent=False, small=None):
    fill = PULSE if accent else WHITE
    rrect(d, [x * SS, y * SS, (x + w) * SS, (y + h) * SS], 14,
          fill=fill, outline=PULSE if accent else LINE, width=2 * SS)
    if label:
        d.text(((x + 18) * SS, (y + 16) * SS), label, font=font(JP_B, 17),
               fill=WHITE if accent else INK)
    if small:
        d.text(((x + 18) * SS, (y + 44) * SS), small, font=font(JP_R, 13),
               fill=(255, 255, 255, 200) if accent else SLATE)


def arrow(d, x1, y1, x2, y2, color=PULSE, w=3):
    ang = math.atan2(y2 - y1, x2 - x1)
    L, A = 12, 0.4
    # 線は矢じりの根元で止める (先端が二重に太らないように)
    ex, ey = x2 - L * 0.7 * math.cos(ang), y2 - L * 0.7 * math.sin(ang)
    d.line([(x1 * SS, y1 * SS), (ex * SS, ey * SS)], fill=color, width=w * SS)
    d.polygon(
        [
            (x2 * SS, y2 * SS),
            ((x2 - L * math.cos(ang - A)) * SS, (y2 - L * math.sin(ang - A)) * SS),
            ((x2 - L * math.cos(ang + A)) * SS, (y2 - L * math.sin(ang + A)) * SS),
        ],
        fill=color,
    )


# ---------------------------------------------------------------- 各ビジュアル

def v_services():
    """事業一覧: 中心から各事業へ広がる俯瞰図"""
    im, _ = canvas()
    d = ImageDraw.Draw(im)
    cx, cy, r = 858, 358, 188
    labels = ["AI", "DEV", "補助金", "AIO", "MEO", "広告", "HP/LP"]
    pts = []
    for i, lb in enumerate(labels):
        a = math.radians(-90 + i * 360 / len(labels))
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a), lb))
    for x, y, _ in pts:
        d.line([(cx * SS, cy * SS), (x * SS, y * SS)], fill=GLOW, width=2 * SS)
    d.ellipse([(cx - r - 46) * SS, (cy - r - 46) * SS, (cx + r + 46) * SS, (cy + r + 46) * SS],
              outline=LINE, width=2 * SS)
    for x, y, lb in pts:
        d.ellipse([(x - 44) * SS, (y - 44) * SS, (x + 44) * SS, (y + 44) * SS],
                  fill=WHITE, outline=LINE, width=2 * SS)
        f = font(JP_B, 16)
        tw = d.textlength(lb, font=f)
        d.text((x * SS - tw / 2, (y - 10) * SS), lb, font=f, fill=INK)
    d.ellipse([(cx - 76) * SS, (cy - 76) * SS, (cx + 76) * SS, (cy + 76) * SS], fill=PULSE)
    f = font(MONO, 40)
    tw = d.textlength("7", font=f)
    d.text((cx * SS - tw / 2, (cy - 34) * SS), "7", font=f, fill=WHITE)
    f2 = font(MONO, 12)
    tw2 = d.textlength("SENSES", font=f2)
    d.text((cx * SS - tw2 / 2, (cy + 14) * SS), "SENSES", font=f2, fill=(210, 222, 255))
    finish(im, "SERVICES", "ひとつのチームで、一気通貫", "戦略・実装・集客・資金を分断せずに設計する", "services-overview.png")


def v_consulting():
    """AIコンサル: 業務を工程に分解し、効く工程だけAIへ"""
    im, _ = canvas()
    d = ImageDraw.Draw(im)
    y = 236
    steps = [("受付", None), ("下書き", "AIが担当"), ("確認", None), ("提出", None)]
    x = 64
    for i, (lb, note) in enumerate(steps):
        acc = note is not None
        card(d, x, y, 190, 108, lb, accent=acc, small=note or "人が担当")
        if i < len(steps) - 1:
            arrow(d, x + 190 + 10, y + 54, x + 190 + 48, y + 54, color=FAINT, w=2)
        x += 190 + 58
    d.text((64 * SS, (y + 178) * SS), "工程に分けてから、効く場所だけを置き換える",
           font=font(JP_B, 20), fill=INK)
    d.text((64 * SS, (y + 216) * SS), "ツールを先に決めると、現場で使われないまま終わる",
           font=font(JP_R, 15), fill=SLATE)
    finish(im, "AI CONSULTING", "社内の仕事を減らす", "業務の棚卸しから、定着まで", "consulting-flow.png")


def v_dev():
    """システム開発: 分断されたツールを一箇所へ"""
    im, _ = canvas()
    d = ImageDraw.Draw(im)
    left = [("Excel", 250), ("スプレッドシート", 336), ("紙・FAX", 422), ("メール", 508)]
    for lb, y in left:
        card(d, 64, y - 34, 250, 68, lb, small="バラバラに管理")
        arrow(d, 326, y, 520, 380, color=(198, 210, 232), w=2)
    rrect(d, [560 * SS, 250 * SS, 1136 * SS, 512 * SS], 20, fill=PULSE)
    d.text((600 * SS, 288 * SS), "ひとつの仕組みへ", font=font(JP_B, 26), fill=WHITE)
    d.text((600 * SS, 336 * SS), "入力は一度だけ / 数字がずれない", font=font(JP_R, 15), fill=(206, 219, 255))
    for i, lb in enumerate(["受発注", "在庫", "原価", "顧客"]):
        bx = 600 + (i % 2) * 254
        by = 384 + (i // 2) * 58
        rrect(d, [bx * SS, by * SS, (bx + 232) * SS, (by + 46) * SS], 10, fill=WHITE)
        d.text(((bx + 18) * SS, (by + 13) * SS), lb, font=font(JP_B, 16), fill=PULSE)
    finish(im, "SYSTEM DEVELOPMENT", "分断をなくす", "既製ツールで足りないところだけを作る", "dev-integration.png")


def v_subsidy():
    """補助金: 自己負担が減る内訳"""
    im, _ = canvas()
    d = ImageDraw.Draw(im)
    base_x, base_y, bw = 64, 246, 1072
    d.text((base_x * SS, (base_y - 46) * SS), "導入費用の内訳", font=font(JP_B, 20), fill=INK)
    rrect(d, [base_x * SS, base_y * SS, (base_x + bw) * SS, (base_y + 92) * SS], 12,
          fill=WHITE, outline=LINE, width=2 * SS)
    grant_w = int(bw * 350 / 550)
    rrect(d, [base_x * SS, base_y * SS, (base_x + grant_w) * SS, (base_y + 92) * SS], 12, fill=PULSE)
    d.text(((base_x + 26) * SS, (base_y + 20) * SS), "補助される分", font=font(JP_B, 19), fill=WHITE)
    # 数字と単位が混ざる文字列は等幅フォントに日本語がないため、日本語フォントで描く
    d.text(((base_x + 26) * SS, (base_y + 52) * SS), "最大 350万円", font=font(JP_B, 17), fill=(206, 219, 255))
    d.text(((base_x + grant_w + 26) * SS, (base_y + 20) * SS), "自己負担", font=font(JP_B, 19), fill=INK)
    d.text(((base_x + grant_w + 26) * SS, (base_y + 52) * SS), "200万円", font=font(JP_B, 17), fill=SLATE)
    y2 = base_y + 176
    for i, (lb, note) in enumerate([("相談", "無料"), ("申請可否の確認", "無料"), ("申請支援", "採択後"), ("導入・報告", "一貫対応")]):
        x = 64 + i * 272
        card(d, x, y2, 244, 96, lb, accent=(i < 2), small=note)
        if i < 3:
            arrow(d, x + 248, y2 + 48, x + 268, y2 + 48, color=FAINT, w=2)
    finish(im, "AI SUBSIDY", "自己負担を下げてから導入する", "相談と申請可否の確認まで無料", "subsidy-breakdown.png")


def v_aio():
    """AIO: AIの回答に引用される構造"""
    im, _ = canvas()
    d = ImageDraw.Draw(im)
    top = 232
    rrect(d, [64 * SS, top * SS, 424 * SS, (top + 250) * SS], 16,
          fill=WHITE, outline=LINE, width=2 * SS)
    d.text((96 * SS, (top + 26) * SS), "自社サイト", font=font(JP_B, 20), fill=INK)
    for i, lb in enumerate(["結論を冒頭で断言する", "一次情報を持つ", "運営者を明示する", "構造化データ / llms.txt"]):
        y = top + 76 + i * 40
        d.ellipse([96 * SS, (y + 5) * SS, 106 * SS, (y + 15) * SS], fill=AQUA)
        d.text((120 * SS, y * SS), lb, font=font(JP_R, 15), fill=SLATE)
    arrow(d, 440, top + 125, 536, top + 125, color=PULSE, w=3)
    rrect(d, [556 * SS, top * SS, 1136 * SS, (top + 250) * SS], 16, fill=INK)
    d.text((592 * SS, (top + 26) * SS), "AIの回答", font=font(JP_B, 20), fill=WHITE)
    for i, lb in enumerate(["AI Overview", "ChatGPT", "Perplexity", "Gemini"]):
        bx = 592 + (i % 2) * 264
        by = top + 76 + (i // 2) * 60
        rrect(d, [bx * SS, by * SS, (bx + 244) * SS, (by + 46) * SS], 10,
              fill=(24, 34, 58), outline=(52, 70, 110), width=2 * SS)
        d.text(((bx + 18) * SS, (by + 14) * SS), lb, font=font(MONO, 15), fill=AQUA)
    d.text((592 * SS, (top + 206) * SS), "引用元として社名が出る状態をつくる",
           font=font(JP_R, 14), fill=(150, 170, 210))
    finish(im, "AIO / LLMO", "AIの答えの中に、社名を置く", "検索順位ではなく、引用されるかで決まる", "aio-citation.png")


def v_news():
    """お知らせ: 落ち着いた抽象ビジュアル"""
    im, _ = canvas()
    d = ImageDraw.Draw(im)
    for i in range(5):
        y = 232 + i * 76
        w = 900 - i * 96
        rrect(d, [64 * SS, y * SS, (64 + w) * SS, (y + 54) * SS], 12,
              fill=WHITE, outline=LINE, width=2 * SS)
        d.rectangle([64 * SS, y * SS, 71 * SS, (y + 54) * SS],
                    fill=PULSE if i == 0 else (206, 218, 240))
        d.text((100 * SS, (y + 17) * SS), "2026.0" + str(7 - i), font=font(MONO, 15),
               fill=PULSE if i == 0 else FAINT)
    finish(im, "NEWS", "会社からのお知らせ", "制度・登壇・取り組みの更新", "news-hero.png")


def v_ads_hero():
    """広告運用: 3媒体 → 受け皿のLP → 問い合わせ。手を入れる範囲の違いを見せる"""
    im, _ = canvas()
    d = ImageDraw.Draw(im)

    media = [("Google広告", "検索・P-MAX・YouTube"), ("Meta広告", "Facebook・Instagram"), ("LINE広告", None)]
    ys = [236, 324, 412]
    for (lb, note), y in zip(media, ys):
        card(d, 64, y, 252, 76, lb, small=note or "友だち追加・リーチ")
        # 3本とも矢じりを付けると合流点で潰れるので、線で合流させて矢は1本だけにする
        d.line([(322 * SS, (y + 38) * SS), (412 * SS, 362 * SS)], fill=FAINT, width=2 * SS)
    d.ellipse([407 * SS, 357 * SS, 417 * SS, 367 * SS], fill=FAINT)
    arrow(d, 417, 362, 450, 362, color=FAINT, w=2)

    # 受け皿。ここを触れるかどうかが分かれ目なので、面で塗って主役にする
    rrect(d, [456 * SS, 290 * SS, 756 * SS, 434 * SS], 18, fill=PULSE)
    d.text((488 * SS, 322 * SS), "LP (受け皿)", font=font(JP_B, 24), fill=WHITE)
    d.text((488 * SS, 366 * SS), "構成・文言・フォームまで", font=font(JP_R, 15), fill=(198, 212, 236))
    d.text((488 * SS, 392 * SS), "自社で直す", font=font(JP_R, 15), fill=(198, 212, 236))

    arrow(d, 762, 362, 842, 362, color=GOLD, w=3)

    rrect(d, [858 * SS, 302 * SS, 1136 * SS, 422 * SS], 18, fill=GOLD_TINT, outline=GOLD, width=2 * SS)
    d.text((890 * SS, 332 * SS), "問い合わせ", font=font(JP_B, 24), fill=GOLD)
    d.text((890 * SS, 376 * SS), "件数と、1件あたりの単価を数える", font=font(JP_R, 13), fill=SLATE)

    d.text((64 * SS, 524 * SS), "広告のアカウントだけを触る場合、手が届くのは左の3つまで。",
           font=font(JP_B, 18), fill=INK)
    d.text((64 * SS, 556 * SS), "クリックの先で落ちているなら、直すのは広告ではなく受け皿の側になる。",
           font=font(JP_R, 15), fill=SLATE)

    finish(im, "PAID ADVERTISING", "広告と、その受け皿をまとめて直す",
           "Google・Meta・LINE の運用代行", "ads-hero.png")


def v_ads_funnel():
    """広告運用: 段ごとに数が減る構造と、落ちどころ"""
    im, _ = canvas()
    d = ImageDraw.Draw(im)

    rows = [("表示", 1072, PULSE), ("クリック", 742, PULSE), ("LP到達", 690, PULSE), ("問い合わせ", 180, GOLD)]
    y = 206
    for lb, w, col in rows:
        rrect(d, [64 * SS, y * SS, (64 + w) * SS, (y + 56) * SS], 10, fill=col)
        d.text((88 * SS, (y + 16) * SS), lb, font=font(JP_B, 18), fill=WHITE)
        y += 72

    # 3段目と4段目の差が、最も大きく落ちるところ
    bx1, bx2, by = 64 + 180 + 14, 64 + 690, 450
    d.line([(bx1 * SS, by * SS), (bx2 * SS, by * SS)], fill=GOLD, width=2 * SS)
    for bx in (bx1, bx2):
        d.line([(bx * SS, (by - 7) * SS), (bx * SS, (by + 7) * SS)], fill=GOLD, width=2 * SS)
    d.text((bx1 * SS, (by + 16) * SS), "クリックしたのに、問い合わせに至らなかった分",
           font=font(JP_B, 16), fill=GOLD)

    d.text((64 * SS, 528 * SS), "入札やキーワードを触る前に、どの段でこぼれているかを数える。",
           font=font(JP_B, 18), fill=INK)
    d.text((64 * SS, 560 * SS), "落ちているのが受け皿なら、いくら広告を調整しても件数は増えない。",
           font=font(JP_R, 15), fill=SLATE)

    finish(im, "WHERE IT LEAKS", "どこで落ちているかを、先に決める",
           "段を分けて数えると、直す場所が決まる", "ads-funnel.png")


TASKS = {
    "services": v_services,
    "consulting": v_consulting,
    "dev": v_dev,
    "subsidy": v_subsidy,
    "aio": v_aio,
    "news": v_news,
    "ads": v_ads_hero,
    "ads-funnel": v_ads_funnel,
}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    keys = sys.argv[1:] or list(TASKS)
    print("生成:")
    for k in keys:
        TASKS[k]()
