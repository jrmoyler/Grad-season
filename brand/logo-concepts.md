# Logo concepts

Brief: suggest "kept / treasured", stay original and simple, avoid graduation caps, and survive at 16px.

## 1. Locket keyhole — **chosen**

An oval locket on a small bail ring, with a keyhole cut through the body as negative space.

- **Why:** a locket is the original keepsake, the thing you wear because it holds someone. The keyhole adds "kept safe" and a hint of a story waiting to be opened. Two shapes, one cut-out, no gradients.
- **16px:** the oval and keyhole stay legible. The bail ring merges into a dot, which still reads as "pendant".
- **Ownable:** lockets in this category are usually heart-shaped and decorative. The upright oval with a keyhole aperture is plainer and more architectural.
- **Construction:** 64×64 grid, body is a 40×48 superellipse-like oval, keyhole is a 6px-radius circle over a tapered stem, ring is a 4.25px radius stroke. Even-odd fill so the keyhole is real negative space and shows the background in every variant.

## 2. Ribbon-bound book

A closed book seen front-on, a ribbon wrapping it vertically, tied in a knot at the top.

- Strong story link (storybook, comic). **Rejected:** at 16px the knot turns into a blob and it reads as a generic gift box. It also over-indexes on books when a third of the line is figurines.

## 3. Pressed-flower K

A monogram K whose leg is a pressed sprig, like a flower kept between pages.

- Most "heirloom" of the three. **Rejected:** illustrative detail dies below 32px. It also leans botanical and wedding, which is the wrong category signal for a kid's comic book.

## Lockup

The mark sits left of a "Keepsakes" wordmark set in Young Serif and converted to outlines (`brand/logo/*.svg`), so the files render the same without the font installed. Clear space is the width of the keyhole stem on every side. The minimum lockup height is 24px; below that, use the mark alone.

| File | Use |
|---|---|
| `keepsakes-lockup-light.svg` | Ribbon mark + ink wordmark on light backgrounds |
| `keepsakes-lockup-dark.svg` | Rose mark + linen wordmark on dark backgrounds |
| `keepsakes-lockup-mono-black.svg` / `-mono-white.svg` | Single-color print, embossing, foil |
| `keepsakes-mark-*.svg` | Standalone mark in the same four variants |
| `keepsakes-icon.svg` | App and favicon tile (linen mark on ribbon) |
| `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icons/*` | Generated from the icon SVG |
| `public/og-image.png` | 1200×630 social card |
