# Ontara Web - Deployment Runbook

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
3. [Google Cloud Run Deployment (Alternative)](#google-cloud-run-deployment-alternative)
4. [Environment Configuration](#environment-configuration)
5. [Monitoring Setup](#monitoring-setup)
6. [Rollback Procedures](#rollback-procedures)
7. [Troubleshooting](#troubleshooting)
8. [Cost Estimates](#cost-estimates)

---

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing: `npm run test`
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] Production build succeeds: `npm run build`

### Security

- [ ] All secrets rotated and stored in secure vault
- [ ] API keys configured with appropriate permissions
- [ ] CORS settings reviewed
- [ ] Security headers configured (see `vercel.json`)
- [ ] Dependencies audited: `npm audit`

### Backend Integration

- [ ] Backend services deployed and healthy
- [ ] MCP server accessible at `NEXT_PUBLIC_ONTARA_MCP_URL`
- [ ] API gateway accessible at `NEXT_PUBLIC_ONTARA_API_URL`
- [ ] API key configured: `ONTARA_API_KEY`

### Authentication

- [ ] Clerk project created at https://dashboard.clerk.com/
- [ ] Google OAuth provider configured in Clerk
- [ ] Email/password authentication enabled in Clerk
- [ ] Clerk keys obtained: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- [ ] Redirect URLs configured in Clerk dashboard

### Monitoring

- [ ] Error tracking setup (Sentry recommended)
- [ ] Analytics configured (Google Analytics or PostHog)
- [ ] Health check endpoint functional
- [ ] Alerting configured

---

## Vercel Deployment (Recommended)

### First-Time Setup

#### 1. Install Vercel CLI

```bash
npm install -g vercel@latest
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Link Project

```bash
cd ontara-web
vercel link
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your organization
- **Link to existing project**: No
- **Project name**: ontara-web

#### 4. Configure Environment Variables

In Vercel dashboard (https://vercel.com/your-org/ontara-web/settings/environment-variables):

**Production Environment:**
- `NEXT_PUBLIC_ONTARA_API_URL` - Backend API URL
- `NEXT_PUBLIC_ONTARA_MCP_URL` - MCP Server URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `ONTARA_API_KEY` - Backend API key
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN (optional)
- `SENTRY_AUTH_TOKEN` - Sentry auth token (optional)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID (optional)

#### 5. Configure GitHub Integration

1. Go to Vercel dashboard → Settings → Git
2. Connect your GitHub repository
3. Configure deployment settings:
   - **Production Branch**: `main`
   - **Preview Branches**: All branches
   - **Ignore Build Step**: Use existing GitHub Actions (optional)

#### 6. Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

Or use the deployment script:

```bash
cd deploy/scripts
export VERCEL_TOKEN="your_token"
export VERCEL_ORG_ID="your_org_id"
export VERCEL_PROJECT_ID="your_project_id"
./deploy-vercel.sh production
```

### Automatic Deployments via GitHub Actions

The `.github/workflows/deploy.yml` workflow automatically deploys to Vercel when code is pushed to `main`.

**Required GitHub Secrets:**
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Organization ID
- `VERCEL_PROJECT_ID` - Project ID
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_ONTARA_API_URL`
- `NEXT_PUBLIC_ONTARA_MCP_URL`

### Post-Deployment Verification

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Test health endpoint
curl https://ontara-web.vercel.app/api/health
```

---

## Google Cloud Run Deployment (Alternative)

### First-Time Setup

#### 1. Install Google Cloud SDK

```bash
# macOS
brew install google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash

# Windows
# Download from: https://cloud.google.com/sdk/docs/install
```

#### 2. Authenticate

```bash
gcloud auth login
gcloud auth configure-docker
```

#### 3. Set Project

```bash
export GCP_PROJECT_ID="your-project-id"
gcloud config set project $GCP_PROJECT_ID
```

#### 4. Enable APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  containerregistry.googleapis.com
```

#### 5. Create Service Account

```bash
gcloud iam service-accounts create ontara-web \
  --display-name="Ontara Web Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:ontara-web@${GCP_PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### 6. Configure Secrets

```bash
cd deploy/scripts
./setup-secrets.sh
```

Provide the following values when prompted:
- NEXT_PUBLIC_ONTARA_API_URL
- NEXT_PUBLIC_ONTARA_MCP_URL
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- ONTARA_API_KEY

#### 7. Deploy

```bash
./deploy-cloud-run.sh
```

This script will:
1. Build Docker image using Cloud Build
2. Push image to Container Registry
3. Deploy to Cloud Run
4. Configure secrets
5. Set up health checks

### Post-Deployment Verification

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe ontara-web \
  --region us-central1 \
  --format 'value(status.url)')

echo "Service URL: $SERVICE_URL"

# Test health endpoint
curl $SERVICE_URL/api/health

# View logs
gcloud logs tail --follow \
  --resource-type=cloud_run_revision \
  --service-name=ontara-web
```

### Configure Custom Domain (Optional)

```bash
# Map custom domain
gcloud run services update ontara-web \
  --region us-central1 \
  --add-cloudsql-instances $CLOUD_SQL_INSTANCE \
  --platform managed

# Add domain mapping
gcloud beta run domain-mappings create \
  --service ontara-web \
  --domain your-domain.com \
  --region us-central1
```

---

## Environment Configuration

### Production Environment Variables

```bash
# Backend Configuration
NEXT_PUBLIC_ONTARA_API_URL=https://api.ontara.org
NEXT_PUBLIC_ONTARA_MCP_URL=https://mcp.ontara.org

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# SDK Configuration
ONTARA_API_KEY=your-production-api-key
ONTARA_API_TIMEOUT=30000
ONTARA_API_RETRIES=3
ONTARA_API_RETRY_DELAY=1000

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE_MB=50
AWS_S3_BUCKET=ontara-documents-prod
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-west-2

# Monitoring (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_AUTH_TOKEN=your-sentry-auth-token
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Environment
NODE_ENV=production
```

### Staging Environment Variables

Same as production, but with staging endpoints and keys.

---

## Monitoring Setup

### Error Tracking (Sentry)

See: [`deploy/monitoring/sentry-setup.md`](./monitoring/sentry-setup.md)

**Quick Setup:**

1. Create Sentry project: https://sentry.io/
2. Install: `npm install @sentry/nextjs`
3. Configure Sentry files (see guide)
4. Add `NEXT_PUBLIC_SENTRY_DSN` to environment variables
5. Deploy and test error tracking

### Analytics (Google Analytics)

See: [`deploy/monitoring/analytics-setup.md`](./monitoring/analytics-setup.md)

**Quick Setup:**

1. Create GA4 property: https://analytics.google.com/
2. Install: `npm install @next/third-parties`
3. Add GA component to root layout
4. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to environment
5. Deploy and verify tracking

### Health Checks

Implement the health check endpoint:

```bash
cp deploy/monitoring/health-check.ts src/app/api/health/route.ts
```

Test endpoint:

```bash
curl https://your-domain.com/api/health
```

### Uptime Monitoring

Set up external monitoring with:
- **UptimeRobot** (free): https://uptimerobot.com/
- **Pingdom**: https://www.pingdom.com/
- **Datadog**: https://www.datadoghq.com/

Monitor:
- `/api/health` endpoint every 5 minutes
- Alert on 3+ consecutive failures
- Alert on response time > 5 seconds

---

## Rollback Procedures

### Vercel Rollback

#### Option 1: Via Dashboard

1. Go to Vercel dashboard → Deployments
2. Find the last known good deployment
3. Click "..." → "Promote to Production"

#### Option 2: Via CLI

```bash
# List recent deployments
vercel ls

# Promote a specific deployment
vercel promote [deployment-url]
```

#### Option 3: Via Script

```bash
cd deploy/scripts
./rollback.sh vercel [deployment-url]
```

### Cloud Run Rollback

#### Option 1: Via Console

1. Go to Cloud Run console
2. Select `ontara-web` service
3. Go to "Revisions" tab
4. Select previous revision
5. Click "Manage Traffic"
6. Set traffic to 100% for previous revision

#### Option 2: Via CLI

```bash
# List revisions
gcloud run revisions list \
  --service=ontara-web \
  --region=us-central1

# Rollback to specific revision
gcloud run services update-traffic ontara-web \
  --to-revisions=ontara-web-00001-abc=100 \
  --region=us-central1
```

#### Option 3: Via Script

```bash
cd deploy/scripts
./rollback.sh cloud-run [revision-name]
```

### Rollback Verification

After rollback:

```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Check error rates in Sentry
# Check analytics for traffic patterns
# Monitor logs for errors
```

---

## Troubleshooting

### Build Failures

**Issue**: Build fails with TypeScript errors

**Solution**:
```bash
npm run type-check
# Fix errors
npm run build
```

**Issue**: Build fails with dependency errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Runtime Errors

**Issue**: "Cannot connect to backend"

**Check**:
- Backend services are running
- `NEXT_PUBLIC_ONTARA_API_URL` is correct
- Network/firewall rules allow traffic
- CORS is configured on backend

**Issue**: "Clerk authentication failed"

**Check**:
- Clerk keys are correct
- Redirect URLs configured in Clerk dashboard
- Domain added to Clerk allowed domains

**Issue**: "API key invalid"

**Check**:
- `ONTARA_API_KEY` is set correctly
- API key is active in backend
- API key has correct permissions

### Performance Issues

**Issue**: Slow page loads

**Check**:
- Enable caching in `vercel.json`
- Use Next.js Image optimization
- Check backend response times
- Review bundle size: `npm run build -- --analyze`

**Issue**: High memory usage

**Solution** (Cloud Run):
```bash
gcloud run services update ontara-web \
  --memory 1Gi \
  --region us-central1
```

### Database Connection Issues

**Issue**: Cannot connect to Neo4j

**Check**:
- Neo4j Aura instance is running
- Connection string is correct
- Firewall allows connections from web app IP
- Credentials are valid

---

## Cost Estimates

### Vercel

**Hobby Plan**: $0/month
- 100 GB bandwidth
- Unlimited static sites
- 100 serverless function executions/day
- **Not suitable for production**

**Pro Plan**: $20/month per user
- 1 TB bandwidth
- Unlimited serverless functions
- 100 GB-hrs serverless function execution
- Custom domains
- Team collaboration
- **Recommended for production**

**Enterprise**: Custom pricing
- Dedicated support
- Advanced analytics
- SAML SSO
- Custom contracts

**Estimated Monthly Cost**: $20-$100/month depending on traffic

### Google Cloud Run

**Pricing** (as of 2024):
- **CPU**: $0.00002400/vCPU-second
- **Memory**: $0.00000250/GiB-second
- **Requests**: First 2M requests free, then $0.40/million
- **Free tier**: 2M requests, 360,000 GiB-seconds, 180,000 vCPU-seconds/month

**Example Calculation** (100K requests/month, avg 500ms response, 512MB RAM, 1 vCPU):
```
Requests: 100K < 2M → $0
CPU: (100,000 × 0.5s × 1 vCPU) × $0.000024 = $1.20
Memory: (100,000 × 0.5s × 0.5 GiB) × $0.0000025 = $0.06
Total: ~$1.26/month
```

**Estimated Monthly Cost**: $0-$50/month depending on traffic

### Additional Services

- **Clerk Authentication**: $0-$25/month (5K MAU free, then $0.02/MAU)
- **Sentry**: $0-$26/month (5K errors free, Team tier $26/month)
- **Google Analytics**: Free
- **Neo4j Aura**: $65-$500/month (separate backend cost)
- **AWS S3 Storage**: $0.023/GB/month + $0.005/1K requests

**Total Estimated Monthly Cost**: $50-$250/month

---

## Production Checklist

Before going live:

### Security
- [ ] All secrets stored securely (never in code)
- [ ] API keys rotated regularly
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all forms
- [ ] Dependencies audited and updated

### Performance
- [ ] Static assets cached
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Bundle size optimized
- [ ] CDN configured
- [ ] Database queries optimized
- [ ] API responses cached where appropriate

### Monitoring
- [ ] Error tracking active (Sentry)
- [ ] Analytics configured (GA4)
- [ ] Health checks operational
- [ ] Uptime monitoring configured
- [ ] Log aggregation setup
- [ ] Alerts configured for critical errors

### Documentation
- [ ] Deployment process documented
- [ ] Rollback procedures tested
- [ ] Environment variables documented
- [ ] Architecture diagrams updated
- [ ] API documentation current

### Backup & Recovery
- [ ] Database backups configured
- [ ] Disaster recovery plan documented
- [ ] Rollback procedures tested
- [ ] Data retention policy defined

### Legal & Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent banner implemented
- [ ] GDPR compliance reviewed (if applicable)
- [ ] Accessibility standards met (WCAG 2.1)

---

## Support Contacts

- **Technical Issues**: support@ontara.org
- **Deployment Help**: devops@ontara.org
- **Security Concerns**: security@ontara.org

---

## Changelog

### v1.0.0 (2025-01-XX)
- Initial production deployment
- Vercel deployment configured
- Cloud Run alternative documented
- Monitoring setup guides created
- Rollback procedures documented
