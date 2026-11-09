# Keepsakes

**Made to be kept.** Custom figurines, comic books, and storybooks where your graduate is the main character.

A Collective AI venture · Columbus, Ohio

Brand book: [`brand/BRAND.md`](brand/BRAND.md) · Prices: [`PRICING_LOCK.md`](PRICING_LOCK.md)

---

## Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `public/index.html` | Marketing landing page |
| `/order` | `public/order.html` | Pre-order intake form |
| `/production` | `public/production.html` | Internal production reference card |
| `/profile` | `public/profile.html` | Order tracking |
| `/order-success` | `public/order-success.html` | Stripe return page |

Shared design tokens and components live in `public/assets/keepsakes.css`. Header logo, head meta, and footer are shared partials: edit `scripts/brand_partials.py`, then run `npm run brand`.

---

## Go-Live Checklist

### 1. Wire the Google Apps Script

In `public/order.html`, find this line:
```
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec';
```
Replace `YOUR_DEPLOYMENT_ID_HERE` with your deployed Apps Script Web App URL.

### 2. Set up the Google Sheet

- Create a new Google Sheet for orders (the live one is the Sheet ID in `docs/grad-sheet-script.gs`)
- Copy the Sheet ID from the URL
- Deploy the `grad-sheet-script.gs` Apps Script (see that file for full instructions)

### 3. Set up the Storybook Gem

- Go to gemini.google.com → Gems → New Gem
- Name it "Grad Season Creator" (the existing Gem name; production docs reference it)
- Paste the system prompt from `grad-storybook-gem.py`

### 4. Deploy to Vercel

```bash
# Via Vercel CLI
npm i -g vercel
vercel --prod

# Or connect GitHub repo to Vercel dashboard
# Set root directory to: /
# Build command: (none — static site)
# Output directory: public
```

---

## File Reference

| File | Purpose |
|---|---|
| `public/index.html` | Landing page |
| `public/order.html` | Pre-order form → Google Sheets |
| `public/production.html` | Production team dashboard |
| `vercel.json` | Routing + security headers |
| `docs/grad-sheet-script.gs` | Google Apps Script (separate deploy). **Re-paste and redeploy after the rebrand to get Keepsakes-branded emails.** |
| `grad-agent-prompt.md` | Order agent instructions |
| `grad-storybook-gem.py` | Gemini Gem configuration |
| `grad-gemini-prompts.py` | All 6 production prompt templates |
| `grad-production-runner.html` | Browser tool — paste order, get prompt |

---

## Product Pricing

| Product | Price |
|---|---|
| Custom Figurine | $89 |
| Custom Comic Book | $34 |
| Custom Storybook | $44 |
| **Full Bundle** | **$167** |

---

## Status Flow

```
Received → In Progress → Printing → Shipped
```

Update Column Y in the Google Sheet. The agent fires the corresponding email automatically.
