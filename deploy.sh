#!/bin/bash
# ============================================================
# GRAD SEASON — Vercel Deploy Script
# Run this once from your machine to go live.
#
# REQUIREMENTS:
# - Node.js installed
# - Vercel account (free tier works)
#
# USAGE:
#   chmod +x deploy.sh
#   ./deploy.sh
# ============================================================

set -e

echo ""
echo "🎓 Grad Season — Deploy to Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "📦 Installing Vercel CLI..."
  npm install -g vercel
fi

echo "✓ Vercel CLI ready"
echo ""

# Deploy
echo "🚀 Deploying to Vercel..."
echo "   (You'll be prompted to log in if not already authenticated)"
echo ""

vercel deploy --prod \
  --name grad-season \
  --yes

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Deployed!"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Copy your live URL from above"
echo "2. Open public/order.html and replace:"
echo "   YOUR_DEPLOYMENT_ID_HERE"
echo "   with your Google Apps Script Web App URL"
echo "3. Run ./deploy.sh again to push the update"
echo ""
echo "Your 3 live routes:"
echo "  /            → Landing page"  
echo "  /order       → Pre-order form"
echo "  /production  → Team reference (keep this private)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
