# 🎓 Grad Season

**Personalized graduation keepsakes — custom figurines, comic books, and storybooks.**

Built and operated by Collective AI · Columbus, Ohio

---

## Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `public/index.html` | Marketing landing page |
| `/order` | `public/order.html` | Pre-order intake form |
| `/production` | `public/production.html` | Internal production reference card |

---

## Go-Live Checklist

### 1. Wire the Google Apps Script

In `public/order.html`, find this line:
```
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID_HERE/exec';
```
Replace `YOUR_DEPLOYMENT_ID_HERE` with your deployed Apps Script Web App URL.

### 2. Set up the Google Sheet

- Create a new Google Sheet named "Grad Season Orders"
- Copy the Sheet ID from the URL
- Deploy the `grad-sheet-script.gs` Apps Script (see that file for full instructions)

### 3. Set up the Storybook Gem

- Go to gemini.google.com → Gems → New Gem
- Name it "Grad Season Creator"
- Paste the system prompt from `grad-storybook-gem.py`

### 4. Deploy to Vercel

```bash
# Via Vercel CLI
npm i -g vercel
cd grad-season
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
| `grad-sheet-script.gs` | Google Apps Script (separate deploy) |
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
