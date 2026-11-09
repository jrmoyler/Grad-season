# Keepsakes — brand book

## Positioning

**Keepsakes turns a milestone into something you can hold.** We make custom 3D-printed figurines, comic books, and storybooks where the child is the main character, built from their real memories rather than a template. The flagship occasions are 5th, 8th, and 12th grade promotion and graduation.

- **For:** parents and guardians who want a graduation gift that will still be on the shelf in twenty years.
- **Against:** the generic graduation aisle of caps, confetti, and "Congrats Grad!" mugs.
- **Proof:** every piece is built from the intake form and reviewed by a person before print. If a line could be about any kid, it's cut.
- **Feeling:** heirloom, warm, personal, proud.

Keepsakes is a Collective AI venture (Columbus, Ohio). It has its own identity, and the parent appears only as a footer credit.

## Tagline

Options considered:

1. **Made to be kept.** ← chosen
2. The milestone, made to hold.
3. Their story, kept for good.
4. Twenty years from now, still on the shelf.
5. Small chapter. Big keepsake.

**Why #1:** it's four words, it carries the name inside it, and it makes a promise about durability and meaning at once. #2 became the homepage headline, where it has room to breathe. #3 is warm but soft. #4 is a great line of body copy but too long for a lockup. #5 sounds like a slogan.

## Voice and tone

Warm, celebratory, confident. Never cheesy.

| We are | We are not |
|---|---|
| Specific: "her actual favorite memory" | Generic: "cherished memories" |
| Proud of the kid | Proud of ourselves |
| Plainspoken, like a good teacher | Salesy, like a mall kiosk |
| Celebratory with a straight face | Exclamation points, confetti emoji |

**Do**
- Lead with the child: "your graduate is the main character".
- Name the real thing: figurine, comic book, storybook. Use the prices and styles exactly as in `PRICING_LOCK.md`.
- Use short sentences for the emotional beats, longer ones for logistics.
- Say "keepsake" when you mean the object and "Keepsakes" when you mean us.
- Keep logistics honest: dates, batch timing, what's due today.

**Don't**
- Don't use cap-and-gown clichés ("The tassel was worth the hassle"), puns on "class", or "Congrats Grad!!".
- Don't use banned filler (see the JR voice standard): unlock, elevate, seamless, curated, vibrant, journey (as a noun about the brand), magic.
- Don't invent urgency: no fake counters, no countdown that resets, no "only 3 left".
- Don't use emoji in product UI or email subjects.
- Don't promise what production doesn't control (exact delivery dates).

## Color

Heirloom palette (see `palette-options.md` for the alternatives). Tokens live in `public/assets/keepsakes.css`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--ks-surface` | `#F7F1E6` linen | `#16110E` walnut | 60%: page background |
| `--ks-raised` | `#FFFCF6` | `#221A15` | Cards, inputs |
| `--ks-sunken` | `#EFE6D6` | `#1B1511` | Insets, chips |
| `--ks-ink` | `#241B16` | `#F3EADB` | 30%: text, dark panels |
| `--ks-muted` | `#66574B` | `#B6A796` | Secondary text |
| `--ks-primary` | `#7A2433` ribbon | `#E7A0A8` rose | 10%: CTAs, the mark |
| `--ks-on-primary` | `#FFF8EE` | `#2A0E14` | Text on primary |
| `--ks-secondary` | `#2E4A3F` archive green | `#9FC2B0` | Supporting panel (How it works) |
| `--ks-accent` | `#8C5A14` brass ink | `#E0B062` | Eyebrows, small accent text |
| `--ks-brass` | `#C8963E` | `#E0B062` | Decorative only (bullets, ribbon tag on ink) |
| `--ks-line-strong` | `#8E7D6C` | `#7E6D5E` | Form borders (non-text, ≥3:1) |
| `--ks-success` | `#2D6A3E` | `#7FD19A` | Confirmation |
| `--ks-error` | `#A3261F` | `#FF9C8F` | Errors |

### Contrast (WCAG 2.1)

AA needs 4.5:1 for body text and 3:1 for non-text UI. `line-strong` is used for borders only.

| Foreground | Background | Light | Dark |
|---|---|---|---|
| ink | surface | 15.02 | 15.71 |
| ink | raised | 16.49 | 14.35 |
| ink | sunken | 13.64 | 15.15 |
| muted | surface | 6.17 | 7.99 |
| muted | raised | 6.77 | 7.30 |
| muted | sunken | 5.60 | — |
| accent | surface | 5.21 | 9.42 |
| accent | raised | 5.72 | 8.61 |
| primary | surface | 8.78 | 8.92 |
| primary | raised | 9.64 | 8.15 |
| on-primary | primary | 9.36 | 8.53 |
| on-secondary | secondary | 9.19 | 8.65 |
| surface | ink (inverted panel) | 15.02 | 15.71 |
| ink | brass (ribbon tag) | 6.34 | — |
| success | raised | 6.32 | 9.37 |
| error | surface | 6.54 | 9.28 |
| error | raised | 7.18 | 8.48 |
| line-strong (border) | surface | 3.52 | 3.78 |
| line-strong (border) | raised | 3.87 | 3.45 |

Every text pairing passes AA. Brass `#C8963E` is never used as text on linen (2.4:1).

## Typography

| Role | Face | Source | Notes |
|---|---|---|---|
| Display | **Young Serif** 400 | Google Fonts, OFL, self-hosted `/fonts` | Soft, bookish, 1970s storybook warmth without being twee. Headlines, prices, wordmark. |
| Body / UI | **Figtree** 400–700 variable | Google Fonts, OFL, self-hosted `/fonts` | Friendly geometric sans with open apertures; reads well at 15px on phones. |

Fallbacks: Georgia for display, system-ui for body.

**Scale** (1.25 major third, fluid at display sizes):

| Token | Size | Use |
|---|---|---|
| `--ks-step--1` | 13px | Eyebrows, meta |
| `--ks-step-0` | 16px | Body |
| `--ks-step-1` | 20px | Lede, card titles (sans) |
| `--ks-step-2` | 25px | h3 |
| `--ks-step-3` | 28–31px | Countdown digits |
| `--ks-step-4` | 32–39px | Prices |
| `--ks-step-5` | 38–61px | h2 |
| `--ks-step-6` | 44–76px | h1 |

## Signature elements

- **Accession tags:** products hang from a single ribbon line like tagged museum objects ("No. 01"). Used in the hero and the OG image.
- **Brass diamond bullets:** small rotated squares in brass instead of checkmarks.
- **Roman numerals** for the four production steps.
- **The ribbon rule:** a 3px ribbon-colored line, used once per composition.

## Motion

Reveal on scroll (18px rise and fade, 700ms, `cubic-bezier(.2,.7,.2,1)`), tags swing a couple of degrees on hover, and buttons lift 2px. Everything is disabled under `prefers-reduced-motion`, and content is visible without JavaScript.

## Parent credit

Footer only: the Collective AI primary symbol (the brain medallion) at 28px and the line "A Collective AI venture." The mark is `public/brand/collective-ai-mark.png`, cropped unaltered from the official Brand Reference Sheet in Collective Stock (`cstk_ed87075f8dcddc61db0e`). No standalone file of the brain mark exists in the brand repos yet; swap in the source file when there is one. Keepsakes doesn't use the parent tagline, palette, or typeface.
