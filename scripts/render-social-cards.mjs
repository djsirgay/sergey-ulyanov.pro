import { mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(root, "assets", "social");
await mkdir(outputDir, { recursive: true });

const assetUrl = (relativePath) => {
  const extension = path.extname(relativePath).slice(1).replace("jpg", "jpeg");
  return `data:image/${extension};base64,${readFileSync(path.join(root, relativePath)).toString("base64")}`;
};

const cards = [
  {
    slug: "hire",
    eyebrow: "HIRE SERGÉY",
    title: "Creative technology,\nmade useful.",
    description: "AI workflows · campaigns · commerce · technical production",
    accent: "#b8ff35",
    mark: "01 / HIRE",
    layout: "portrait",
    images: [assetUrl("assets/sergey-headshot.webp")],
  },
  {
    slug: "work",
    eyebrow: "SELECTED WORK",
    title: "Ideas into\nworking systems.",
    description: "Entertainment · applied AI · brands · culture",
    accent: "#5ceeff",
    mark: "02 / WORK",
    layout: "collage",
    images: [
      assetUrl("assets/portfolio/folio-01-scream.webp"),
      assetUrl("assets/portfolio/folio-06-calpoly.webp"),
      assetUrl("assets/portfolio/folio-05-volkswagen.webp"),
    ],
  },
  {
    slug: "research",
    eyebrow: "RESEARCH",
    title: "Who gets to teach AI\nwhat a culture means?",
    description: "Community-governed AI · Belarusian cultural continuity · public protocol",
    accent: "#dba4ff",
    mark: "03 / RESEARCH",
    layout: "research",
    images: [
      assetUrl("assets/portfolio/folio-14-burning-man.webp"),
      assetUrl("assets/belarus-ornament-signal.png"),
    ],
  },
  {
    slug: "press",
    eyebrow: "PRESS & PUBLIC VOICE",
    title: "Work that enters\nthe conversation.",
    description: "Creative work · culture · migration · LGBTQ+ visibility",
    accent: "#ff975f",
    mark: "04 / PRESS",
    layout: "press",
    images: [
      assetUrl("assets/press/zerkalo-sergey.jpg"),
      assetUrl("assets/press/aba-interview.jpg"),
      assetUrl("assets/press/nashaniva-2024.webp"),
    ],
  },
];

function media(card) {
  if (card.layout === "portrait") {
    return `<div class="portrait-wrap"><img class="portrait" src="${card.images[0]}" alt=""></div>`;
  }
  if (card.layout === "research") {
    return `<div class="research-media"><img class="research-photo" src="${card.images[0]}" alt=""><img class="ornament" src="${card.images[1]}" alt=""></div>`;
  }
  return `<div class="collage ${card.layout}">${card.images.map((src, index) => `<img class="tile tile-${index + 1}" src="${src}" alt="">`).join("")}</div>`;
}

function documentFor(card) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#080a08}
    body{font-family:Arial,Helvetica,sans-serif;color:#f5f7f4}
    .card{--accent:${card.accent};position:relative;width:1200px;height:630px;overflow:hidden;background:
      radial-gradient(circle at 84% 18%,color-mix(in srgb,var(--accent) 18%,transparent),transparent 38%),
      linear-gradient(145deg,#0f140f 0%,#050705 74%);border:1px solid color-mix(in srgb,var(--accent) 42%,#2b302b)}
    .card::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(90deg,#000,transparent 72%)}
    .copy{position:absolute;z-index:3;left:58px;top:54px;width:690px}
    .eyebrow,.mark,.url{font-family:"SFMono-Regular",Consolas,monospace;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
    .eyebrow{color:var(--accent);font-size:17px}.title{margin:26px 0 22px;font-weight:800;font-size:72px;line-height:.89;letter-spacing:-.064em;white-space:pre-line}
    .description{max-width:650px;color:#bfc8bf;font-size:21px;line-height:1.35}
    .footer{position:absolute;z-index:4;left:58px;right:58px;bottom:38px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,.15);padding-top:18px}
    .mark{color:var(--accent);font-size:13px}.url{padding:7px 9px;background:rgba(5,7,5,.88);color:#dce3dc;font-size:11px;letter-spacing:.07em;white-space:nowrap}
    .portrait-wrap{position:absolute;right:48px;bottom:0;width:430px;height:585px;border-left:1px solid color-mix(in srgb,var(--accent) 34%,transparent);background:radial-gradient(circle at 52% 48%,color-mix(in srgb,var(--accent) 18%,transparent),transparent 55%);overflow:hidden}
    .portrait{position:absolute;right:-24px;bottom:-22px;width:515px;height:515px;object-fit:cover;border-radius:50%;filter:saturate(.8) contrast(1.08)}
    .portrait-wrap::after{content:"AI / SYSTEMS / CULTURE";position:absolute;right:-108px;top:164px;transform:rotate(90deg);color:var(--accent);font:700 12px/1 Consolas,monospace;letter-spacing:.18em}
    .collage{position:absolute;right:36px;top:36px;width:410px;height:485px;display:grid;grid-template-columns:1.12fr .88fr;grid-template-rows:1fr 1fr;gap:10px;transform:rotate(1.2deg)}
    .collage::before{content:"";position:absolute;inset:-16px;border:1px solid color-mix(in srgb,var(--accent) 32%,transparent);z-index:-1}
    .tile{width:100%;height:100%;object-fit:cover;border:1px solid rgba(255,255,255,.16);background:#090b09;filter:saturate(.88) contrast(1.05)}
    .tile-1{grid-row:1/3}.press{grid-template-columns:1fr 1fr;transform:rotate(-1deg)}.press .tile-1{grid-row:auto;grid-column:1/3}.press .tile{object-position:center 34%}
    .research-media{position:absolute;right:34px;top:42px;width:470px;height:472px;border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);background:#050705;overflow:hidden;transform:rotate(.8deg)}
    .research-photo{width:100%;height:100%;object-fit:cover;opacity:.68;filter:saturate(.78) contrast(1.1)}
    .ornament{position:absolute;left:-70px;right:-70px;bottom:28px;width:610px;height:130px;object-fit:cover;mix-blend-mode:screen;filter:hue-rotate(190deg) saturate(.65) brightness(1.6);opacity:.92}
    .research-media::after{content:"36 PROMPTS · 8 DIMENSIONS";position:absolute;right:16px;top:16px;padding:9px 11px;border:1px solid color-mix(in srgb,var(--accent) 55%,transparent);background:rgba(5,7,5,.82);color:var(--accent);font:700 11px/1 Consolas,monospace;letter-spacing:.08em}
    .card:has(.collage) .copy,.card:has(.research-media) .copy{width:650px}.card:has(.collage) .title,.card:has(.research-media) .title{font-size:66px}
  </style></head><body><main class="card"><section class="copy"><div class="eyebrow">${card.eyebrow}</div><h1 class="title">${card.title}</h1><p class="description">${card.description}</p></section>${media(card)}<footer class="footer"><div class="mark">${card.mark}</div><div class="url">SERGEY-ULYANOV.PRO</div></footer></main></body></html>`;
}

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--allow-file-access-from-files"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

for (const card of cards) {
  await page.setContent(documentFor(card), { waitUntil: "load" });
  await page.locator("img").first().waitFor({ state: "visible" });
  await page.screenshot({ path: path.join(outputDir, `${card.slug}.png`), type: "png" });
}

await browser.close();
