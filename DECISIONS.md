# DECISIONS

Judgment calls made during the content/structure refactor (the "scaffold").
Each line: the call + one-line reasoning.

## Architecture
1. **Buildless runtime content injection** (`content/site.js` data + `data-c` hooks in `index.html` + `content.js` renderer) chosen over a build step — preserves the zero-CI "deploy from a branch" Pages workflow we just got working; edit content → push → live, no pipeline to break.
2. **Content stored as one JS object** (`window.CONTENT` in `content/site.js`) rather than `/content/*.md` markdown — the copy is highly structured (button labels, prices, stat numbers, lists), and a JS global loads on both `file://` and `https://` with no fetch/CORS step and no in-browser markdown parser.
3. **Single content file, not per-page** — the site is currently one page; a single `site.js` is the simplest "one place to edit," and the nested-key shape scales cleanly if pages are added later.
4. **Title + meta description live in content** (filled by the renderer) to honor "all editable copy in one place." Tradeoff: non-JS crawlers see an empty `<title>`/description in static HTML. The static `og:` tags still cover social previews. (See REVIEW #4 — prerender available if organic SEO matters.)

## Implementation (from the refactor subagent)
5. **`content.js` runs immediately at end-of-body, not on `DOMContentLoaded`** — so the injected `#year` span exists before `script.js` runs next; the DOM is already fully parsed at that point.
6. **Pricing `price-amount` stores full innerHTML** including the nested `<span class="price-unit">…</span>` as one content value — keeps the class structure intact without adding an extra wrapper element, while the copy stays editable.
7. **Brand wordmark kept static** (`Stateside`, `Certified™`, `a Roi Digital Consulting venture` in the header, and the brand `aria-label`) — these are fixed brand-identity marks and a functional attribute, not marketing copy.
8. **Desktop + mobile nav share the same `nav.*` keys** — one edit updates both, by design.

## Content provenance
9. **All current copy is INTERIM** — carried over from this session's agreed edits (the B2B / "90-Day Sprint" pivot), because the `/specs` files referenced for the build (`agentic-sales-copy-changelog.md`, `brand.md`, `stateside-certified-onepager.md`) are **not present in the repo**. When the specs are provided, `content/site.js` is swapped wholesale — structure and styles stay put.

## Bilingual toggle (EN / ES)
10. **Content is now `{ en: {...}, es: {...} }`** in `content/site.js` — both languages live in the one editable file; the renderer injects the active language. Same edit-content-only workflow, now per language.
11. **Default language = the visitor's browser language** (`navigator.language`; starts with `es` → Spanish, otherwise English). The visitor's explicit EN/ES choice is then remembered via `localStorage`. English is always the fallback.
12. **Spanish is an AI translation** (neutral Latin American register) — structure/keys/inline-HTML/brand-names/prices/acronyms all preserved (acronym expansions translated, acronyms kept). Flagged for native-speaker proofing (see REVIEW).

## Prerender (build-time render)
13. **Switched from runtime injection to a build step** (`build.js`): bakes `template.html` + `content/site.js` into static `index.html` (EN) + `es/index.html` (ES) with copy already in the HTML. Removed the runtime renderer (`content.js`). Reason: search crawlers and social link-preview bots don't run JavaScript — baking content in makes SEO and per-language previews actually work, and removes the flash-of-empty before JS. Same edit-content-only workflow, plus one deterministic build I run.
14. **Language is a URL, not a JS state**: English at `/`, Spanish at `/es/`; the EN/ES control is a real link. Each page declares its own language authoritatively, so a shared `/es/` link always renders Spanish (no `localStorage`/browser override flipping it).
15. **Absolute URLs via one `BASE_URL` constant** for `og:image` / `canonical` / `hreflang` (crawlers require absolute); page assets stay relative (`../` on the ES page) so the site is portable. Update `BASE_URL` at custom-domain time.
16. **No auto-redirect** for Spanish browsers (English is the default landing) — avoids surprise redirects; the toggle is the explicit path. Easy to add later (logged in REVIEW).

## Contact form + later copy changes
17. **Contact form wired functional**: a `FORM_ENDPOINT` constant (set it to a Formspree URL for background AJAX submit) with a working `mailto:` fallback to an interim Gmail (assembled from parts in JS to deter scraping) so it captures leads today. Status messages are baked per-language via `window.FORM_MSGS` (emitted by `build.js` from `content/site.js`), keeping all copy in the one content file.
18. **Client-directed copy changes**: pricing card 3 → "Customized Plan after initial consult" (removed the $15,000 / "up to 10 agents"); the "Where This Goes" section was repurposed from the geographic-expansion map to the "every brokerage has two problems (training + lead management) → better ROI" message (removed the corridor node list); added a manifesto section ("You didn't build your firm to babysit it…") before the contact CTA; CTA buttons relabeled to "Learn about Agentic".

## De-certification rebrand + expanded offer
19. **Dropped "Certified/certification" entirely** (per client). Umbrella brand is now **"Stateside"** (header wordmark, title, footer); the offer is two productized layers — **Stateside Systems™** (tech) and **Stateside Training™** (human) — under **Roi Consulting**. "certification/certified/certify" → "training/trained/train" throughout, including one word in the client's own new offer intro for consistency. The "Stateside Certified™" mark-note was removed.
20. **Expanded OFFER section** with the client's narrative: Layer 1 gets a subtitle + multi-paragraph copy (rendered via `<div class="layer-copy">` so the body can hold several `<p>` from one content key), placed before the AGENTIC grid; Layer 2 likewise; plus two new closing blocks — `offer.automate` and `offer.roi` ("That's why it's Roi Consulting"). AGENTIC grid and training list kept.
21. **Contact heading** "Claim your territory." → "Let's talk." / "Hablemos." (client removed the old phrase; replacement authored — see REVIEW).
22. **Team photo crop** `object-position` `center top` → `center 30%` (can't preview the render here; flagged for visual confirm).
