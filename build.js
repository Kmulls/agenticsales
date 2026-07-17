#!/usr/bin/env node
/* build.js — prerender the bilingual site.
 *
 * Reads:  template.html (structure with data-c / data-cph hooks) + content/site.js
 * Writes: index.html      (English, baked)
 *         es/index.html   (Spanish, baked)
 *
 * Each output has the copy baked directly into the HTML (no JS needed to read it),
 * plus per-language <title>, meta description, Open Graph tags, and hreflang — so
 * search engines and social link-preview bots see real, language-correct content.
 *
 * DO NOT hand-edit index.html or es/index.html — they are generated.
 * To change copy: edit content/site.js, then run:  node build.js
 */
"use strict";
const fs = require("fs");

/* Absolute base URL of the live site. Used for OG/canonical/hreflang (these MUST be
 * absolute for crawlers). Update this one line when the custom domain goes live. */
const BASE_URL = "https://agenticsales.com";

global.window = {};
require("./content/site.js");
const CONTENT = global.window.CONTENT;
const template = fs.readFileSync("template.html", "utf8");

const get = (o, p) => p.split(".").reduce((x, k) => (x == null ? x : x[k]), o);
const escAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");

function build(lang) {
  const C = CONTENT[lang];
  let html = template;

  // 1) Bake every data-c element's inner HTML (and drop the data-c attribute).
  html = html.replace(
    /<([a-zA-Z0-9]+)\b([^>]*?)\sdata-c="([^"]+)"([^>]*)><\/\1>/g,
    (m, tag, before, key, after) => {
      const v = get(C, key);
      if (v == null) { console.warn("build: missing key", key, "(" + lang + ")"); return m; }
      if (tag.toLowerCase() === "title") return "<title>" + v + "</title>";
      return "<" + tag + before + after + ">" + v + "</" + tag + ">";
    }
  );

  // 2) Bake input placeholders.
  html = html.replace(/data-cph="([^"]+)"/g, (m, key) => {
    const v = get(C, key);
    return v == null ? m : 'placeholder="' + escAttr(v) + '"';
  });

  // 3) <html lang>
  html = html.replace(/<html lang="[^"]*">/, '<html lang="' + lang + '">');

  // 4) meta description
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/,
    '<meta name="description" content="' + escAttr(get(C, "meta.description")) + '" />');

  // 5) Open Graph (per language; image absolute)
  const setProp = (prop, val) => {
    const re = new RegExp('(<meta property="' + prop + '" content=")[^"]*("\\s*/>)');
    html = html.replace(re, "$1" + escAttr(val) + "$2");
  };
  setProp("og:title", get(C, "meta.title"));
  setProp("og:description", get(C, "meta.description"));
  setProp("og:locale", lang === "es" ? "es_LA" : "en_US");
  setProp("og:locale:alternate", lang === "es" ? "en_US" : "es_LA");
  setProp("og:image", BASE_URL + "/images/courtyard-home.jpeg");

  // 6) Language toggle: buttons -> links (current language = non-link span)
  html = html.replace(
    /<button type="button" class="lang-btn" data-lang-btn="(en|es)">([^<]*)<\/button>/g,
    (m, l, label) => {
      if (l === lang) return '<span class="lang-btn" aria-current="true">' + label + "</span>";
      const href = lang === "en" ? "es/" : "../";
      return '<a class="lang-btn" href="' + href + '">' + label + "</a>";
    }
  );

  // 7) Drop the old runtime-render scripts (content is baked now).
  html = html.replace(/\n[ \t]*<script src="content\/site\.js"><\/script>/g, "");
  html = html.replace(/\n[ \t]*<script src="content\.js"><\/script>/g, "");

  // 8) Inject canonical + hreflang + og:url (absolute) before </head>.
  const selfPath = lang === "es" ? "/es/" : "/";
  const head =
    '  <meta property="og:url" content="' + BASE_URL + selfPath + '" />\n' +
    '  <link rel="canonical" href="' + BASE_URL + selfPath + '" />\n' +
    '  <link rel="alternate" hreflang="en" href="' + BASE_URL + '/" />\n' +
    '  <link rel="alternate" hreflang="es" href="' + BASE_URL + '/es/" />\n' +
    '  <link rel="alternate" hreflang="x-default" href="' + BASE_URL + '/" />\n';
  html = html.replace("</head>", head + "</head>");

  // 8b) Bake per-language contact-form status messages for script.js to read.
  if (C.form && C.form.status) {
    const msgs = JSON.stringify(C.form.status).replace(/</g, "\\u003c");
    html = html.replace('<script src="script.js"></script>',
      '<script>window.FORM_MSGS=' + msgs + ';</script>\n  <script src="script.js"></script>');
  }

  // 9) Spanish page lives one directory deep: point relative assets up a level.
  if (lang === "es") {
    html = html.replace(/(src|href)="(images\/|styles\.css|script\.js)/g, '$1="../$2');
    html = html.replace(/data-fallbacks="([^"]*)"/g,
      (m, v) => 'data-fallbacks="' + v.replace(/(^|,)images\//g, "$1../images/") + '"');
  }

  return html;
}

fs.writeFileSync("index.html", build("en"));
fs.mkdirSync("es", { recursive: true });
fs.writeFileSync("es/index.html", build("es"));
console.log("Built: index.html (en) + es/index.html (es)");
