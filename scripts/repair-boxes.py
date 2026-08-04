# -*- coding: utf-8 -*-
"""閉じ忘れた <div> のせいで生Markdownのまま残った本文を、
管制塔と同じ変換 (scripts/md2html.py と同設定) にかけ直す。

管制塔が同じ記事を再配信すると元に戻るので、その都度これを流す。
"""
import glob
import io
import json
import os
import re

import markdown

DIR = r"c:\Users\user\Desktop\システム開発\SSコーポレートサイト\src\content\blog"
RAW = [
    (re.compile(r"^#{2,3} \S", re.M), "見出し"),
    (re.compile(r"\*\*[^*\n]+\*\*"), "強調"),
    (re.compile(r"^\|.+\|$", re.M), "表"),
    (re.compile(r"\[[^\]\n]+\]\(https?:"), "リンク"),
]


def unclosed_div(html):
    """閉じられていない <div class="…"> の開始位置を返す"""
    stack = []
    for m in re.finditer(r"<(/?)div[^>]*>", html):
        if m.group(1):
            if stack:
                stack.pop()
        else:
            stack.append(m.start())
    return stack[0] if stack else None


def convert(body):
    md = markdown.Markdown(
        extensions=["tables", "extra", "toc", "sane_lists"],
        extension_configs={"toc": {"toc_depth": "2-2"}},
    )
    out = md.convert(body)
    out = out.replace("<table>", '<div class="table-wrap"><table>').replace(
        "</table>", "</table></div>"
    )
    return re.sub(r"==([^=<>\n]+?)==", r"<mark>\1</mark>", out)


fixed = 0
for path in sorted(glob.glob(os.path.join(DIR, "*.json"))):
    data = json.load(io.open(path, encoding="utf-8"))
    html = data["html"]
    if not any(r.search(html) for r, _ in RAW):
        continue

    i = unclosed_div(html)
    if i is None:
        print(os.path.basename(path), "— 生Markdownはあるが未クローズのdivは無い。手動確認が必要")
        continue

    end = html.index("\n\n", i)
    html = html[:end] + "</div>" + html[end:]
    out = convert(html)

    left = [name for r, name in RAW if r.search(out)]
    print(
        os.path.basename(path),
        "-> h2:", len(re.findall(r"<h2", out)),
        "p:", len(re.findall(r"<p[ >]", out)),
        "残:", left or "なし",
    )
    data["html"] = out
    with io.open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    fixed += 1

print(f"{fixed} 本を修復")
