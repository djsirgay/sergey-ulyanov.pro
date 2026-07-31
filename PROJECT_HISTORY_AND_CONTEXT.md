# Sergey-Ulyanov.pro — Master Project Context

**Recovered:** July 31, 2026  
**Purpose:** preserve the working history and approved source of truth so future edits continue from the production version rather than rebuilding or reverting the site.

## 1. Core goal

Create a personal site for **Sergéy Ulyanov — Creative Marketing & AI Workflow Strategist** that:

- immediately communicates positioning and business value;
- shows major brands, proof, and impact without forcing visitors through a résumé-first experience;
- keeps résumé and portfolio actions easy to reach on desktop and mobile;
- presents Sergéy as a strategist who can also prototype, build, and operationalize systems;
- uses a distinctive black / acid-green premium-tech identity;
- works as a real production website, not only a PDF redirect or local mockup.

## 2. Source materials

- One-page July 2026 résumé / CV.
- 17-page July 2026 portfolio.
- GitHub repository: `djsirgay/sergey-ulyanov.pro`.
- Custom domain: `sergey-ulyanov.pro`.
- GitHub Pages URL: `djsirgay.github.io/sergey-ulyanov.pro/`.
- Correct contact email: `ulyanoow@gmail.com`.
- LinkedIn: `linkedin.com/in/charaunic`.
- Phone: `+1 (310) 713-7738`.

## 3. First complete redesign — July 28, 2026

The first new version was a standalone multi-file static site created from the résumé and portfolio. It included:

- Hero and document CTAs.
- Proof metrics: 90% less manual work, 100M+ streams, 200K registrations, 10+ years.
- Six cases:
  1. Cal Poly × AWS
  2. Paramount × Complex / Scream 7
  3. Universal Music Group / Interscope / ElasticStage
  4. McDonald’s
  5. Coca-Cola / Fanta
  6. Burning Man / Belarus in Exile
- `Challenge → Move → Outcome` modal treatment.
- Method: `Signal → Strategy → System → Scale`.
- Brand cloud.
- Contact section.
- Mobile sticky résumé / portfolio actions.
- Horizontal case scrolling.

The original local package was saved as `Sergey_Ulyanov_Personal_Site_July_2026.zip`.

**Important:** this ZIP is an archive of the first redesign, not the latest approved production source.

## 4. Approved expanded version — July 29, 2026

The site was substantially expanded and refined. The approved direction added:

- Stronger hero positioning as **Creative Marketing & AI Workflow Strategist**.
- Value proposition around campaigns, digital products, and AI-assisted workflows that increase revenue, reduce cost, and save team time.
- Status for full-time roles and selected consulting engagements.
- Large portrait card.
- Richer case cards with scenes and impact metrics.
- Recognition / awards rail.
- Press / media archive.
- Animated brand/logo marquees.
- Editorial premium-tech styling.
- More robust mobile project behavior.

## 5. Publication history

The redesign was published through GitHub Pages and the custom domain. Key commits include:

- `4bf7a175` — Publish July 2026 portfolio redesign.
- `f22be606` — Trigger GitHub Pages rebuild and serve site as static HTML.
- `99b175e2` — Trigger GitHub Pages redeploy after custom-domain update.
- `80c91255` — Publish final July site refinement.

The old 2025 site remains in repository history and must not be treated as the current design.

## 6. Approved refinement history

- `d3f4eaf3` — Restore approved design and apply only requested final changes.
- `e1087c32` — Refine photo, logo marquees, and mobile project scrolling.
- `9e2c988e` — Refine portrait crop and simplify portfolio actions.
- `9d251152` — Fix Cal Poly × AWS lockup and make case cards open the portfolio.
- `74290e22` — Restore portrait reliably while preserving approved changes.
- `f5a0d2df` — Fix duplicate portrait and restore mobile vertical scrolling.
- `6828b907` — Replace mobile project rail with a contained swipe pager and lock horizontal drift.
- `4e845014`, `06ac0d12`, `74126b48`, `1edfc873` — Add high-resolution headshot data in four chunks.
- `b7311ae0` — Fix mobile project scrolling, high-resolution portrait, and PDF actions.
- `983c71e5` — Replace mismatched high-resolution headshot chunk.
- `f9505798` — Fix résumé, portfolio, and email actions on mobile and desktop.
- `281281cc` — Correct email to `ulyanoow@gmail.com`.

## 7. Portrait HUD request and completion

The last creative request before the chat history disappeared was to add light technology/orbit graphics over the existing portrait without replacing the photo:

- thin circular/orbit lines;
- dashed rings;
- small outlined nodes/bubbles;
- airy HUD/editorial geometry;
- compatible with the black/acid-green AI-tech style;
- implemented in code over the high-resolution portrait.

An incorrect intermediate attempt generated a separate image. That image was not the approved solution.

The correct code-based solution was completed:

- `732d5e9f` — Add animated tech overlay to live portrait.
- `36fad005` — Widen mobile portrait card and improve label contrast.

Therefore the HUD task is **completed**, not pending.

## 8. Current approved technical state

### Correct branch and commit

- Branch: `preview-2026`
- Latest approved design commit before this documentation: `36fad0050764da70e9b262e15b8e543d07379df2`
- Runtime version marker: `20260729-13`

The previous branch `preview-july-2026` contains the immediately preceding snapshot and should be treated as older.

### Current architecture

The production implementation uses a wrapper architecture:

- root `index.html` loads an iframe;
- base design is loaded from `/base-site/index.html`;
- approved refinement logic is sourced from `/refinement-preview/index.html`;
- root wrapper patches the approved design at runtime;
- the high-resolution portrait is rebuilt from four base64 text chunks with a normal WebP fallback;
- résumé and portfolio open through Google Drive;
- the mobile project rail is converted into a contained swipe pager;
- brand marquees and press ordering are patched at runtime;
- the portrait HUD is inserted as inline SVG/CSS over the existing photo;
- reduced-motion behavior disables major animation.

### Current portrait overlay

The live code adds `.portrait-hud` with inline SVG containing:

- dashed, soft, and micro rings;
- curved arcs;
- outlined and solid nodes;
- small connector lines;
- slow rotation (`42s linear infinite`);
- lower opacity on mobile;
- a `prefers-reduced-motion` fallback.

## 9. Source-of-truth hierarchy

Use this order for all future edits:

1. GitHub branch `preview-2026` at or after commit `36fad005` — current approved production source.
2. July 2026 résumé and portfolio — factual and visual source material.
3. This document — project decisions and chronology.
4. `preview-july-2026` — previous production snapshot.
5. Initial local ZIP — archival first redesign only.
6. Old 2025 source — legacy only.

## 10. Rules for future changes

- Do not rebuild the site from the first local ZIP.
- Do not overwrite the current portrait or replace it with a generated image unless explicitly requested.
- Preserve the high-resolution headshot mechanism until the architecture is deliberately simplified.
- Preserve Google Drive résumé and portfolio actions unless replacements are explicitly approved.
- Preserve contained mobile swipe behavior and locked horizontal page drift.
- Preserve the current email: `ulyanoow@gmail.com`.
- Preserve the approved content architecture, brand marquees, press archive, and recognition rail.
- Make narrowly scoped commits from the latest approved source.
- Test desktop and mobile after each change.
- Record material changes in `CHANGELOG.md`.

## 11. Recovery status

Recovered and confirmed:

- original project goal;
- source résumé and portfolio;
- first redesign structure;
- expanded approved production design;
- deployment history;
- major post-publication fixes;
- correct continuation branch and design commit;
- runtime wrapper architecture;
- completed portrait HUD implementation;
- current continuation point.

The correct continuation point is **`preview-2026`**, not the initial ZIP or the old site.