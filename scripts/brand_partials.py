#!/usr/bin/env python3
"""Inject shared Keepsakes partials (head meta, inline logo, footer) into public pages.

Pages hold markers like <!--LOGO--> or an already-filled <!--LOGO-->...<!--/LOGO--> block,
so this script is safe to re-run after editing a partial.
Usage: python3 scripts/brand_partials.py
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
W, WORD = (ROOT / "brand/logo/wordmark-path.txt").read_text().split("\n", 1)

MARK = ('<circle cx="32" cy="7.5" r="4.25" fill="none" stroke="var(--ks-primary)" stroke-width="3"/>'
        '<path fill="var(--ks-primary)" fill-rule="evenodd" d="M32 13C20.4 13 12 23.6 12 37s8.4 24 20 24 20-10.6 20-24-8.4-24-20-24Z'
        'M32 27.5a6 6 0 0 0-3.1 11.1L27 49h10l-1.9-10.4A6 6 0 0 0 32 27.5Z"/>')

LOGO = (f'<svg viewBox="0 0 {W} 68" role="img" aria-label="Keepsakes"><g transform="translate(0 2)">{MARK}</g>'
        f'<path fill="currentColor" d="{WORD.strip()}"/></svg>')

HEAD = """<meta name="theme-color" content="#F7F1E6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#16110E" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/brand/keepsakes-icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/young-serif-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/figtree-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/keepsakes.css">
<meta property="og:site_name" content="Keepsakes">
<meta property="og:type" content="website">
<meta property="og:image" content="https://grad-season.vercel.app/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Keepsakes locket logo with the line: Made to be kept.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://grad-season.vercel.app/og-image.png">"""

# Official Collective AI primary symbol (brain medallion), cropped unaltered from the
# "Collective AI Inc — Brand Reference Sheet" in Collective Stock (cstk_ed87075f8dcddc61db0e,
# panel 03 "Primary Symbol" / panel 01). Do not redraw; replace with a source file when one exists.
CAI_MARK = '<img src="/brand/collective-ai-mark.png" width="28" height="28" alt="" decoding="async" loading="lazy">'

FOOTER = f"""<footer class="ks-footer">
  <div class="ks-wrap">
    <div class="ks-footer-grid">
      <div>
        <a class="ks-brand" href="/" aria-label="Keepsakes home">{LOGO}</a>
        <p>Custom figurines, comic books, and storybooks where your graduate is the main character. Made to be kept.</p>
      </div>
      <nav aria-label="Footer">
        <ul>
          <li><a href="/order">Pre-order</a></li>
          <li><a href="/profile">Track an order</a></li>
          <li><a href="/#faq">Questions</a></li>
          <li><a href="mailto:hybridlivinginc@gmail.com">hybridlivinginc@gmail.com</a></li>
        </ul>
      </nav>
    </div>
    <div class="ks-footer-base">
      <span>Columbus, Ohio · © <span data-ks-year>2026</span> Keepsakes</span>
      <span class="ks-credit">{CAI_MARK}A Collective AI venture.</span>
    </div>
  </div>
</footer>"""

PARTS = {"HEAD-COMMON": HEAD, "LOGO": LOGO, "FOOTER": FOOTER}

for page in sorted(PUBLIC.glob("*.html")):
    html = page.read_text()
    orig = html
    for key, val in PARTS.items():
        block = f"<!--{key}-->{val}<!--/{key}-->"
        if f"<!--/{key}-->" in html:
            html = re.sub(rf"<!--{key}-->.*?<!--/{key}-->", lambda m: block, html, flags=re.S)
        else:
            html = html.replace(f"<!--{key}-->", block)
    if html != orig:
        page.write_text(html)
        print("updated", page.name)
