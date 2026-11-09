# PRICING_LOCK.md

Source of truth for every product, service, bundle, option, and price. Extracted from `main` at commit `86098dc`, before the Keepsakes rebrand. **Nothing in this file may change during the rebrand.** Copy around these items may be rewritten; the items themselves may not.

## Products

| Product | Price (USD) | Stripe `unit_amount` | Where enforced |
|---|---|---|---|
| Custom Figurine | **$89** | 8900 | `public/order.html` `PRICES.figurine`, `api/create-checkout-session.js` |
| Custom Comic Book | **$34** | 3400 | `public/order.html` `PRICES.comic`, `api/create-checkout-session.js` |
| Custom Storybook | **$44** | 4400 | `public/order.html` `PRICES.storybook`, `api/create-checkout-session.js` |

## Bundle

| Bundle | Price | Contents | Notes |
|---|---|---|---|
| Full Bundle | **$167** | Figurine ($89 value) + Comic Book ($34 value) + Storybook ($44 value) | Sum of the three; no discount. One intake form, shipped together. Labeled "Most Popular". Not a separate SKU: checkout charges three line items. |

Any combination of one, two, or three products may be ordered. Order total = sum of selected products.

## Options per product

**Figurine**
- Style: Claymation (`claymation`), Funko Pop (`funko`), Realistic (`realistic`)
- Outfit: Grad Fit / cap & gown (`grad`), My Photo (`photo`), Career Fit (`career`)
- Career list: Doctor, Lawyer, Engineer, Athlete, Teacher, Entrepreneur, Nurse, Pilot, Architect, Artist, Musician, Scientist, Chef, Police Officer, Firefighter, Military, Other
- Reference photo upload (Cloudinary, folder `grad-season/figurines`)
- Generated in Tripo3d.ai, 3D printed, shipped

**Comic Book**
- Style: Manga / Anime (`manga`), Superhero (`superhero`), Cartoon Strip (`cartoon`, 10-strip format)
- 12 fully illustrated pages, professionally printed and bound
- Reference photo upload (Cloudinary, folder `grad-season/comics`)

**Storybook**
- Style: Watercolor (`watercolor`), Graphic Novel (`graphic`), Classic Children's (`classic`)
- 10–12 illustrated pages, grade-appropriate reading level, dedication printed verbatim
- Printed through partner press
- Reference photo upload (Cloudinary, folder `grad-season/storybooks`)

## Service terms (as published before the rebrand)

- Grades served: Pre-K, Kindergarten, 1st–12th, College. Flagship occasions: 5th, 8th, 12th grade promotion and graduation.
- Pre-order cutoff: **April 24, 2026, midnight ET** (`2026-04-24T04:00:00Z`).
- Production: batches; 2–3 weeks for production and shipping after a batch closes.
- Status emails: Received → In Progress → Printing → Shipped.
- Payment: FAQ and confirmation email say "nothing due today, collected at fulfillment"; the order form's review step says payment runs through Stripe Checkout on submit. Both statements are preserved verbatim in meaning. See the PR's decision list.

## Verification

Run `npm test`. `tests/order.test.js` asserts 89 / 123 / 167 totals, the Apps Script payload keys, and the Cloudinary IDs. The rebrand PR includes a line-by-line diff of every price string before and after.
