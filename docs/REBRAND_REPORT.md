# Keepsakes rebrand: build report

**Tier:** L (full rebrand). **Target:** static site on Vercel (`public/`). **Brand lock:** none. Keepsakes is a standalone venture; Collective AI appears only as a footer credit with its official mark.

## Direction

- **Chosen: "The keepsake shelf".** A linen-paper page with the three products hung from a single ribbon like tagged museum objects (No. 01–03). The type is a bookish serif (Young Serif) over a plain sans (Figtree), with oxblood ribbon for the one action per screen.
- **Runner-up: "Open storybook"**, a two-page spread layout. It lost because it favors the storybook over the figurine, and spreads collapse badly on phones.
- **Third: "Night sky graduation"** (the old site's grammar of starfields, gold shimmer and a pulsing CTA). Rejected as the category cliché the brief asked to avoid.

## Constraint cards

- No graduation caps, stars, confetti, gold-gradient text or pulsing buttons.
- No fake urgency: removed the rolling 21-day "batch closes" timer (it reset on every visit) and the hard-coded "47 pre-orders" counter.
- One accent per view. Ribbon is for CTAs and the mark only; brass is decoration only.
- No emoji in UI.
- Real copy only. Every claim traces back to the old site or `PRICING_LOCK.md`.

## Checks run

| Check | Result |
|---|---|
| `npm test` | 8/8 pass (the 1 test that was already failing is fixed, and 3 new lock tests added) |
| Price / option / payload diff vs `86098dc` | Identical (see PR) |
| Lighthouse (home, order, profile; local) | 100 / 100 / 100 / 100 in all four categories. Before: home 92/100/96/100, order 89/93/96/90 |
| axe-core WCAG 2 A/AA + best-practice, light and dark, order step 2 with all panels open | 0 violations |
| Anti-slop scanner | 0 findings |
| Contrast | All text pairings AA in light and dark (`brand/BRAND.md`) |
| Browser order flow (Playwright, 390px) | Pass: validation message, upload callback, review, $123 total, Apps Script payload, success state |
| Live Cloudinary unsigned upload, preset `grad_season_uploads` → `grad-season/figurines` | Pass |
| Live Apps Script POST → Sheet row → confirmation email | Pass, but with the **old** email design because the deployed script predates this branch (see PR) |
| Rebranded email template | Rendered from `docs/grad-sheet-script.gs` with a stub `MailApp`; HTML-escaping verified |

## Design critique (self-review) and fixes

1. Fixed: the closed countdown still showed "--" because `display:flex` overrode `[hidden]`. Added a global `[hidden]{display:none!important}`.
2. Fixed: hero tag names and prices ran together, and tag widths were uneven.
3. Fixed: price-card buttons wrapped. Labels are shorter, with the product name kept for screen readers.
4. Fixed: the order review capitalized emails. It now capitalizes only the style rows.
5. Fixed: mobile Back/Confirm buttons wrapped.
6. **Open: there's no product photography.** The hero carries the brand with icons and tags, which is honest but abstract. The biggest single upgrade would be real photos of a finished figurine, comic and storybook on linen.
7. **Open: the testimonials** are kept word for word from the old site. Confirm they are real customers before launch.

## Deliberately skipped

- Re-rendering `ad-video/out/grad-season-ad.mp4`. The Remotion source text is updated, but the old palette and grad-cap visuals remain in the video and the MP4 isn't used on the site.
- Rebuilding the internal tools (`/production`, `/runner`). They got the name change and `noindex` only.
