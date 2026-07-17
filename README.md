# Stateside Certified™ — Landing Page

The marketing landing page for **Stateside Certified™**, a venture of Roi Digital
Consulting LLC: AI infrastructure + agent certification that makes a Latin American
brokerage perform like a top US firm — delivered as a 90-day sprint.

## How it's built (content / structure / prerender)

All editable copy lives in **one file** — `content/site.js` — in two languages (`en` and `es`).
The page **structure** lives in `template.html`. A small Node script bakes them into static,
fully-rendered pages so search engines and social link-previews see real, language-correct
content (no JavaScript required to read the page).

- `content/site.js` — **all copy, both languages** (`window.CONTENT = { en: {...}, es: {...} }`). Edit here.
- `template.html` — structure with `data-c` / `data-cph` hooks. **Build source, not a served page.**
- `build.js` — bakes template + content → `index.html` (English) and `es/index.html` (Spanish).
- `index.html`, `es/index.html` — **GENERATED. Do not hand-edit.**
- `styles.css` — design system + responsive layout.
- `script.js` — sticky header, mobile nav, scroll-reveal, smooth in-page nav, contact-form stub.
- `images/` — photography.

Fonts (Fraunces + Inter) load from Google Fonts.

### To change any wording
1. Edit `content/site.js` (the `en` and/or `es` block).
2. Run the build:
   ```bash
   node build.js
   ```
3. Commit `content/site.js` **and** the regenerated `index.html` / `es/index.html`.

The EN/ES control is a link: English at `/`, Spanish at `/es/`.

> When the custom domain goes live, update `BASE_URL` at the top of `build.js`
> (it makes the OG / canonical / hreflang URLs absolute-correct).

## Run locally

```bash
node build.js                 # regenerate the pages
python3 -m http.server 8000   # then visit http://localhost:8000  (and /es/)
```

## Deploy

Static — GitHub Pages serves it straight from the branch (`.nojekyll` present). Push the
generated `index.html`, `es/index.html`, and assets; no CI build required.

## Sections

Hero · The Problem · The Offer (AGENTIC Framework™ + Certification) · 90-Day Sprint &
Pricing · Team · Expansion Corridor · Contact

## Notes / TODO

- The contact form is a front-end stub — wire it to a real handler (Formspree, Netlify
  Forms, or a backend) before launch.
- The Spanish copy is an AI translation — have a native speaker proof it before launch.
