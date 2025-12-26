# Deployment Infrastructure

This directory contains all deployment configuration, scripts, and documentation for the Ontara Web application.

## Directory Structure

```
deploy/
├── cloud-run/              # Google Cloud Run configuration
│   └── service.yaml        # Cloud Run service definition
├── scripts/                # Deployment automation scripts
│   ├── deploy-vercel.sh    # Deploy to Vercel (recommended)
│   ├── deploy-cloud-run.sh # Deploy to Google Cloud Run
│   ├── setup-secrets.sh    # Configure secrets in Cloud Secret Manager
│   └── rollback.sh         # Rollback deployment script
├── monitoring/             # Monitoring and observability setup
│   ├── sentry-setup.md     # Error tracking with Sentry
│   ├── analytics-setup.md  # Analytics with GA4/PostHog
│   └── health-check.ts     # Health check endpoint template
├── DEPLOYMENT_RUNBOOK.md   # Comprehensive deployment guide (649 lines)
└── README.md               # This file
```

## Quick Start

### Deploy to Vercel (Recommended)

```bash
cd deploy/scripts
export VERCEL_TOKEN="your_token"
export VERCEL_ORG_ID="your_org_id"
export VERCEL_PROJECT_ID="your_project_id"
./deploy-vercel.sh production
```

### Deploy to Google Cloud Run (Alternative)

```bash
cd deploy/scripts
export GCP_PROJECT_ID="your-project-id"
./deploy-cloud-run.sh
```

## Documentation

- **[DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md)**: Complete deployment guide with step-by-step instructions for both Vercel and Cloud Run
- **[Sentry Setup](./monitoring/sentry-setup.md)**: Error tracking configuration
- **[Analytics Setup](./monitoring/analytics-setup.md)**: Google Analytics and PostHog configuration

## Deployment Options

### 1. Vercel (Recommended)

**Pros:**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Excellent Next.js support
- Preview deployments for every PR
- Automatic rollbacks

**Cons:**
- Proprietary platform
- Higher cost at scale

**Best for:**
- Quick deployment
- Teams without DevOps expertise
- Projects needing fast iteration

### 2. Google Cloud Run

**Pros:**
- Full control over infrastructure
- Cost-effective for high traffic
- Integrates with GCP ecosystem
- Custom domain support
- Autoscaling to zero

**Cons:**
- Requires GCP knowledge
- More manual configuration
- Longer initial setup

**Best for:**
- Organizations already using GCP
- Cost-sensitive deployments
- Custom infrastructure requirements

## Pre-Deployment Checklist

Before deploying:

- [ ] All tests passing (`npm run test`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Backend services deployed and accessible
- [ ] Authentication provider (Clerk) configured
- [ ] Monitoring setup (Sentry, GA4)

## Environment Variables Required

### Essential
- `NEXT_PUBLIC_ONTARA_API_URL` - Backend API URL
- `NEXT_PUBLIC_ONTARA_MCP_URL` - MCP Server URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `ONTARA_API_KEY` - Backend API key

### Optional
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking
- `SENTRY_AUTH_TOKEN` - Sentry releases
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics
- `AWS_S3_BUCKET` - File upload storage
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `AWS_SECRET_ACCESS_KEY` - AWS credentials

See [`.env.example`](../.env.example) for complete list.

## Deployment Workflows

### Automated (GitHub Actions)

The `.github/workflows/deploy.yml` workflow automatically deploys to Vercel when code is pushed to `main`.

**Required GitHub Secrets:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- All environment variables listed above

### Manual

Use the deployment scripts in `scripts/` directory for manual deployments.

## Rollback Procedures

### Vercel
```bash
./scripts/rollback.sh vercel [deployment-url]
```

### Cloud Run
```bash
./scripts/rollback.sh cloud-run [revision-name]
```

See [DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md#rollback-procedures) for detailed rollback procedures.

## Monitoring

### Health Check

Every deployment includes a health check endpoint at `/api/health`.

Test it:
```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T12:00:00.000Z",
  "checks": {
    "server": true,
    "backend": true,
    "clerk": true
  },
  "uptime": 123456
}
```

### Error Tracking

Set up Sentry for error tracking. See [monitoring/sentry-setup.md](./monitoring/sentry-setup.md).

### Analytics

Configure Google Analytics or PostHog. See [monitoring/analytics-setup.md](./monitoring/analytics-setup.md).

## Cost Estimates

### Vercel Pro
- **Base**: $20/month per user
- **Bandwidth**: 1 TB included
- **Estimated Total**: $20-$100/month

### Google Cloud Run
- **Compute**: ~$1-$50/month (depending on traffic)
- **Free Tier**: 2M requests/month
- **Estimated Total**: $0-$50/month

### Additional Services
- **Clerk**: $0-$25/month (5K MAU free)
- **Sentry**: $0-$26/month (5K errors free)
- **Google Analytics**: Free

**Total Estimated**: $50-$250/month

See [DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md#cost-estimates) for detailed cost breakdown.

## Support

For deployment issues:
- **Technical**: support@ontara.org
- **DevOps**: devops@ontara.org
- **Security**: security@ontara.org

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Clerk Documentation](https://clerk.com/docs)
