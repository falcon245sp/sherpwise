#!/bin/bash
set -euo pipefail

# Deploy Ontara Web to Vercel
# Usage: ./deploy-vercel.sh [production|preview]

ENVIRONMENT=${1:-production}

echo "🚀 Deploying Ontara Web to Vercel ($ENVIRONMENT)..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# Check required environment variables
if [ -z "${VERCEL_TOKEN:-}" ]; then
    echo "❌ Error: VERCEL_TOKEN not set"
    exit 1
fi

if [ -z "${VERCEL_ORG_ID:-}" ]; then
    echo "❌ Error: VERCEL_ORG_ID not set"
    exit 1
fi

if [ -z "${VERCEL_PROJECT_ID:-}" ]; then
    echo "❌ Error: VERCEL_PROJECT_ID not set"
    exit 1
fi

# Run tests before deployment
echo "🧪 Running tests..."
npm run lint
npm run type-check
npm run test

# Deploy
if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌍 Deploying to production..."
    vercel deploy --prod --token="$VERCEL_TOKEN"
else
    echo "🔍 Creating preview deployment..."
    vercel deploy --token="$VERCEL_TOKEN"
fi

echo "✅ Deployment complete!"
