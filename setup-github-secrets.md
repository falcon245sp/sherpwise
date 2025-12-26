# GitHub Secrets Setup for Automated Deployment

The web application has been pushed to: **https://github.com/falcon245sp/sherpwise**

To enable automated deployment via GitHub Actions, add these secrets:

## Go to Repository Settings

1. Visit: https://github.com/falcon245sp/sherpwise/settings/secrets/actions
2. Click "New repository secret" for each secret below

## Required Secrets

### Vercel Deployment
```
Name: VERCEL_TOKEN
Value: o6aSB9zWmP3Vb4rpoDXFJdDG
```

### Vercel Project Configuration
Get these from your Vercel dashboard (https://vercel.com):

```
Name: VERCEL_ORG_ID
Value: [Get from Vercel dashboard → Settings → General]

Name: VERCEL_PROJECT_ID  
Value: [Get from Vercel project → Settings → General]
```

### Authentication (Clerk)
```
Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_test_bG92aW5nLWhvbmV5YmVlLTguY2xlcmsuYWNjb3VudHMuZGV2JA

Name: CLERK_SECRET_KEY
Value: sk_test_m4atvUD9ZctiIqwaDa4r9PbL8gr3CTo9QoBATIMuuI
```

### Backend URLs
```
Name: NEXT_PUBLIC_ONTARA_API_URL
Value: [Your backend API URL - e.g., https://api.ontara.org or http://localhost:8080 for dev]

Name: NEXT_PUBLIC_ONTARA_MCP_URL
Value: [Your MCP server URL - e.g., https://mcp.ontara.org or http://localhost:3001 for dev]
```

### Optional (for enhanced monitoring)
```
Name: SENTRY_AUTH_TOKEN
Value: [Get from https://sentry.io if using Sentry]

Name: NEXT_PUBLIC_GA_MEASUREMENT_ID
Value: [Get from Google Analytics if using GA4]
```

## Automated Deployment

Once secrets are configured, automatic deployment will trigger:
- ✅ On every push to `main` branch
- ✅ Manual trigger via Actions tab
- ✅ Pre-deployment tests (lint, type-check, test)
- ✅ Sentry release creation (if configured)

## Manual Deployment (Alternative)

You can also deploy manually using the local scripts:

```bash
cd /tmp/ontara-web
export VERCEL_TOKEN="o6aSB9zWmP3Vb4rpoDXFJdDG"
export VERCEL_ORG_ID="your_org_id"
export VERCEL_PROJECT_ID="your_project_id"
./deploy/scripts/deploy-vercel.sh production
```

## Verify Setup

After adding secrets, test the deployment:
1. Make a small change to README.md
2. Commit and push to main
3. Check GitHub Actions: https://github.com/falcon245sp/sherpwise/actions
4. Deployment should trigger automatically

## Support

For issues, see:
- Deployment Runbook: `/tmp/ontara-web/deploy/DEPLOYMENT_RUNBOOK.md`
- Deployment Summary: `/tmp/ontara-web/deploy/DEPLOYMENT_SUMMARY.md`

---

## Quick Setup (Provided Values)

### Vercel Team ID (Provided)
```
Name: VERCEL_ORG_ID
Value: team_HAfKsXEFopkldcLFDvncSDAI
```

### Still Need to Get:
- `VERCEL_PROJECT_ID` - Get from your Vercel project settings after linking the project
- `NEXT_PUBLIC_ONTARA_API_URL` - Your backend API URL
- `NEXT_PUBLIC_ONTARA_MCP_URL` - Your MCP server URL

### Quick Add via GitHub CLI (if authenticated):
```bash
gh secret set VERCEL_TOKEN --body 'o6aSB9zWmP3Vb4rpoDXFJdDG' --repo falcon245sp/sherpwise
gh secret set VERCEL_ORG_ID --body 'team_HAfKsXEFopkldcLFDvncSDAI' --repo falcon245sp/sherpwise
gh secret set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY --body 'pk_test_bG92aW5nLWhvbmV5YmVlLTguY2xlcmsuYWNjb3VudHMuZGV2JA' --repo falcon245sp/sherpwise
gh secret set CLERK_SECRET_KEY --body 'sk_test_m4atvUD9ZctiIqwaDa4r9PbL8gr3CTo9QoBATIMuuI' --repo falcon245sp/sherpwise
```
