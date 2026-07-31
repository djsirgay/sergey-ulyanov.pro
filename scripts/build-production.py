from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FRAGMENTS = ROOT / "site-fragments"
OUTPUT = ROOT / "index.html"

parts = sorted(FRAGMENTS.glob("*.html"))
if not parts:
    raise SystemExit("No production HTML fragments found")

html = "".join(part.read_text(encoding="utf-8") for part in parts)

checks = {
    "doctype": html.startswith("<!doctype html>"),
    "closed document": html.rstrip().endswith("</html>"),
    "no iframe": "<iframe" not in html.lower(),
    "no dynamic code execution": "new Function" not in html,
    "six projects": html.count('class="case"') == 6,
    "twelve proof cards": html.count('<article class="proof-card') == 12,
    "canonical URL": '<link rel="canonical" href="https://sergey-ulyanov.pro/">' in html,
    "structured data": 'type="application/ld+json"' in html,
    "analytics hooks": "data-track=" in html,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit("Production validation failed: " + ", ".join(failed))

OUTPUT.write_text(html, encoding="utf-8")
print(f"Built {OUTPUT.name} from {len(parts)} fragments ({len(html):,} characters)")
