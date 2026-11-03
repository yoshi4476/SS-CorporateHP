"""配信する直前に、ページと CSS の中の写真の場所へ版の印（?v=中身の指紋8桁）を付ける。

python3 scripts/asset_version.py site

写真は同じ名前のまま中身を差し替える。写真は端末に長く控えられる（AI集客ラボ30日・補助金1年）ので、
場所が同じだと一度見た人には古い写真が出続けた（2026-11-02 に約420枚を差し替えて反映されなかった）。
中身の指紋を場所に付ければ、中身が変わったときだけ取り直させられる。リポジトリのページは変えず、配信の直前に付ける。
何度かけても同じ結果になる（付いている印は付け直す）。
"""
import hashlib
import json
import re
import sys
from pathlib import Path

EXT = ("webp", "jpg", "jpeg", "png", "avif")
# 引用符・括弧・カンマ・空白の後ろから始まる、写真の拡張子で終わる場所（外のサイトの URL は対象にしない）
# Next.js の書き出しは、ページの中のデータに \"/images/a.webp\" の形でも持つので、後ろの \ も区切りとして扱う
URL = re.compile(r"(?<=[\"'(,\s])(?!https?:|//|data:)([\w./%-]+\.(?:" + "|".join(EXT) + r"))(\?v=[0-9a-f]{8})?(?=[\"')\s,\\])")
# ページ・CSS と、Next.js がページ移動のときに読むデータ（.txt）
SUFFIXES = (".html", ".css", ".txt")
# Next.js がページに埋め込む画面のデータ（RSC）。行は「ID:中身\n」か、長さを先に書く「ID:T<16進のバイト数>,本文」
FLIGHT = re.compile(r'<script>self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)</script>')
SIZED = re.compile(rb"([0-9a-f]*):([TAOoUSsLlGgMmV])([0-9a-f]+),")


def version_flight(data, sub):
    """長さを先に書く行の本文に印を足したら、長さも書き直す。
    直さないとブラウザが行の切れ目を見失い、記事のページが「This page couldn't load」で落ちた
    （2026-11-03: 本文に写真を持つ記事のページがすべて。React の「Connection closed.」）"""
    b, out, i = data.encode("utf-8"), [], 0
    while i < len(b):
        m = SIZED.match(b, i)
        if m:
            start = m.end()
            end = start + int(m.group(3), 16)
            if end > len(b):
                raise ValueError(f"画面のデータの行の長さが本文より長い（{m.group(1).decode()} 行）")
            body = sub(b[start:end].decode("utf-8")).encode("utf-8") if m.group(2) == b"T" else b[start:end]
            out.append(m.group(1) + b":" + m.group(2) + format(len(body), "x").encode() + b"," + body)
            i = end
            continue
        j = b.find(b"\n", i)
        j = len(b) if j < 0 else j + 1
        out.append(sub(b[i:j].decode("utf-8")).encode("utf-8"))
        i = j
    return b"".join(out).decode("utf-8")


def _js_string(s):
    # Next.js と同じく、script の中で HTML として読まれる文字を逃がす
    s = json.dumps(s, ensure_ascii=False)
    for a, r in (("&", "\\u0026"), ("<", "\\u003c"), (">", "\\u003e"), (" ", "\\u2028"), (" ", "\\u2029")):
        s = s.replace(a, r)
    return s


def fingerprint(path, memo):
    if path not in memo:
        memo[path] = hashlib.sha1(path.read_bytes()).hexdigest()[:8]
    return memo[path]


def version_text(text, page, root, memo):
    def sub(m):
        rel = m.group(1)
        f = (root / rel.lstrip("/")) if rel.startswith("/") else (page.parent / rel)
        try:
            f = f.resolve()
            f.relative_to(root)
        except (OSError, ValueError):
            return m.group(0)
        if not f.is_file():
            return m.group(0)
        return f"{rel}?v={fingerprint(f, memo)}"

    def plain(s):
        return URL.sub(sub, s)

    if page.suffix == ".txt":
        return version_flight(text, plain)
    if page.suffix != ".html":
        return plain(text)
    # 画面のデータは分けて直す（行の切れ目は push の区切りと関係がないので、つないでから1つの push に戻す）
    pushes = list(FLIGHT.finditer(text))
    if not pushes:
        return plain(text)
    if len(pushes) != text.count("self.__next_f.push([1,"):
        raise ValueError(f"画面のデータを読み切れない: {page}")
    flight = version_flight("".join(json.loads(m.group(1)) for m in pushes), plain)
    parts, at = [], 0
    for k, m in enumerate(pushes):
        parts.append(plain(text[at:m.start()]))
        if k == 0:
            parts.append(f"<script>self.__next_f.push([1,{_js_string(flight)}])</script>")
        at = m.end()
    parts.append(plain(text[at:]))
    return "".join(parts)


def run(root):
    root = Path(root).resolve()
    memo, changed = {}, 0
    for page in root.rglob("*"):
        if page.suffix not in SUFFIXES or not page.is_file():
            continue
        text = page.read_text(encoding="utf-8", errors="surrogateescape")
        new = version_text(text, page, root, memo)
        if new != text:
            page.write_text(new, encoding="utf-8", errors="surrogateescape", newline="")
            changed += 1
    print(f"ASSET_VERSION ページ {changed} 本に写真の版の印を付けました（写真 {len(memo)} 枚）")
    return 0


if __name__ == "__main__":
    sys.exit(run(sys.argv[1] if len(sys.argv) > 1 else "site"))
