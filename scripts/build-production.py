from __future__ import annotations

from pathlib import Path
import json

from portfolio_links import mark_outbound, professional_pages

ROOT = Path(__file__).resolve().parents[1]
FRAGMENTS = ROOT / "site-fragments"
OUTPUT = ROOT / "index.html"
CONTENT = json.loads((ROOT / "scripts/site-content.json").read_text(encoding="utf-8"))

parts = sorted(FRAGMENTS.glob("*.html"))
if not parts:
    raise SystemExit("No production HTML fragments found")

html = mark_outbound("".join(part.read_text(encoding="utf-8") for part in parts))

checks = {
    "doctype": html.startswith("<!doctype html>"),
    "closed document": html.rstrip().endswith("</html>"),
    "no iframe": "<iframe" not in html.lower(),
    "no dynamic code execution": "new Function" not in html,
    "eight visual flagship projects": html.count('class="case-card feature-case"') == 8,
    "full recognition rail": html.count('class="recognition-card"') == len(CONTENT["recognition"]),
    "research follows community": html.index('id="research"') > html.index('id="community"'),
    "no homepage press dump": "Do Gay Men and Straight Men Think Same?" not in html,
    "canonical URL": '<link rel="canonical" href="https://sergey-ulyanov.pro/">' in html,
    "structured data": 'type="application/ld+json"' in html,
    "analytics hooks": "data-track=" in html,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit("Production validation failed: " + ", ".join(failed))

OUTPUT.write_text(html, encoding="utf-8")
for page in professional_pages(ROOT):
    if page == OUTPUT:
        continue
    source = page.read_text(encoding="utf-8")
    updated = mark_outbound(source)
    if updated != source:
        page.write_text(updated, encoding="utf-8")
print(f"Built {OUTPUT.name} from {len(parts)} fragments ({len(html):,} characters)")
