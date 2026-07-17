# REVIEW — items that need your eyes

Only the things requiring a human decision or input. Everything else is done and verified.

1. **The specs aren't in the repo.** All current site copy is *interim* — it's the copy we agreed in this session, not the final `/specs` files (`agentic-sales-copy-changelog.md`, `brand.md`, `stateside-certified-onepager.md`), which don't exist in the repo. Push or send those three files and I'll replace `content/site.js` with the real content (structure/styles unchanged).

2. **Contact form works now — on an interim destination.** On submit it opens the visitor's email app pre-filled to `kmullaney67@gmail.com` (assembled in JS to deter scraping), so it captures leads today. For *background* submission (no email-app popup) and to keep your personal address private, create a free **Formspree** account (~2 min) and send me the endpoint — I paste it into one constant (`FORM_ENDPOINT` in `script.js`) and it upgrades automatically. Also switch the lead destination to `hello@agenticsales.com` once that inbox exists.

3. **Generated pages + `BASE_URL` at domain time.** `index.html` and `es/index.html` are now **build output** from `build.js` (`template.html` + `content/site.js`) — don't hand-edit them; edit `content/site.js` and I rebuild. When the custom domain (e.g. agenticsales.com) goes live, update the single `BASE_URL` line at the top of `build.js` so the social/SEO URLs (`og:image`, `canonical`, `hreflang`) point at the real domain instead of the github.io address.

4. **Copy/branding judgment calls to confirm.** A few things I decided (all editable in `content/site.js`):
   - **Brand standardized to "Stateside"** (umbrella), with the two productized layers **Stateside Systems™** / **Stateside Training™** under **Roi Consulting**. (This supersedes the earlier "Stateside Agent Training" name.) Confirm the umbrella name.
   - In your new offer copy *"then certify the people who run it"* → I changed "certify" to **"train"** for consistency with the no-certification directive.
   - CTA **buttons** now read **"Learn about Agentic"** (ES: "Conozca Agentic") — including the form's submit button. Tell me if you'd rather the submit button say something action-specific (e.g. "Send").
   - Contact-section heading is now **"Let's talk."** (ES: "Hablemos.") since you removed "Claim your territory."
   - Showcase cite "Every corridor · the same standard" — still my wording; confirm or replace.
   - **Miles's photo crop**: I can't see the live render from here, so I set it to show more of the face (`object-position: center 30%`). Once it's live, tell me "up" or "down" and I'll dial it in.

5. **Spanish translation needs a native-speaker proof before launch.** It's AI-generated Latin American Spanish — structure is verified, but wording should be reviewed for tone/market fit. Specific word choices to confirm: "Guardrailed" → *"Con Límites Claros"*; "Playbooks" → *"guiones de respuesta"*; "corridor" → *"corredor"*; "Founding Rate" → *"Tarifa Fundadora"*; "2 deals" → *"2 cierres"*. Edit any of these in `content/site.js` under the `es:` block.

6. **Spanish-browser auto-redirect is OFF (by choice).** Everyone lands on English at `/` and switches with the toggle. If you'd rather Spanish-language browsers land on `/es/` automatically, say so and I'll add it.

---
_Resolved: Miles Vidor's headshot (`images/milesheadshot.png`) is live; social/SEO is now language-correct (English at `/`, Spanish at `/es/`) via build-time prerender — link previews and search engines see real per-language content._
