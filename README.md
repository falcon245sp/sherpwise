# Ontara Web Application

Web application for math standards alignment and curriculum analysis, built for districts and teachers.

## Features

- 📚 **Standards Browser**: Browse and search math standards from Common Core, state frameworks, and custom district standards
- 🔍 **Expression Classification**: Classify mathematical expressions and align them to standards
- 📄 **Document Upload**: Upload curriculum documents (PDF, DOCX, Google Docs) for automated analysis
- 👥 **Multi-tenant**: Support for districts, schools, and individual teachers
- 📊 **Analytics**: Track alignment coverage and curriculum gaps
- 🔐 **Authentication**: Secure login with Google OAuth and email/password

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Testing**: Vitest + Playwright
- **Backend**: Ontara Core SDK (@ontara/core-sdk)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Access to Ontara Core backend services

### Installation

```bash
# Clone the repository
git clone https://github.com/The-Ontara-Institute/ontara-web.git
cd ontara-web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your configuration
```

### Development

```bash
# Run development server
npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Run linter
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
ontara-web/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions and SDK client
│   ├── hooks/            # Custom React hooks
│   └── test/             # Test utilities
├── e2e/                  # Playwright E2E tests
├── public/               # Static assets
└── .github/workflows/    # CI/CD workflows
```

## Environment Variables

See `.env.example` for required environment variables.

Key variables:

- `NEXT_PUBLIC_ONTARA_API_URL`: Backend API URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk authentication key
- `CLERK_SECRET_KEY`: Clerk secret key

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

### Google Cloud Run

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/ontara-web
gcloud run deploy ontara-web --image gcr.io/PROJECT_ID/ontara-web
```

## Contributing

This is a private repository for The Ontara Institute. Please contact the maintainers for contribution guidelines.

## License

Apache License 2.0 - See LICENSE file for details

## Support

For issues and questions, contact: support@ontara.org

## Deployment

This application supports two deployment options:

### Vercel (Recommended)

Vercel provides the easiest deployment experience for Next.js applications:

```bash
npm install -g vercel
vercel deploy --prod
```

**Benefits:**
- Zero-config deployment
- Automatic HTTPS and CDN
- Preview deployments for PRs
- Excellent Next.js support

See [`deploy/DEPLOYMENT_RUNBOOK.md`](./deploy/DEPLOYMENT_RUNBOOK.md#vercel-deployment-recommended) for detailed instructions.

### Google Cloud Run (Alternative)

For teams already using GCP or requiring more infrastructure control:

```bash
export GCP_PROJECT_ID="your-project-id"
cd deploy/scripts
./deploy-cloud-run.sh
```

**Benefits:**
- Cost-effective at scale
- Full infrastructure control
- Integration with GCP services

See [`deploy/DEPLOYMENT_RUNBOOK.md`](./deploy/DEPLOYMENT_RUNBOOK.md#google-cloud-run-deployment-alternative) for detailed instructions.

### Deployment Documentation

- **[Deployment Runbook](./deploy/DEPLOYMENT_RUNBOOK.md)**: Comprehensive 649-line guide covering:
  - Pre-deployment checklist
  - Step-by-step deployment procedures
  - Environment configuration
  - Monitoring setup (Sentry, Google Analytics)
  - Rollback procedures
  - Troubleshooting guide
  - Cost estimates

- **[Deploy Scripts](./deploy/scripts/)**: Automated deployment scripts
  - `deploy-vercel.sh` - Deploy to Vercel
  - `deploy-cloud-run.sh` - Deploy to Cloud Run
  - `setup-secrets.sh` - Configure secrets
  - `rollback.sh` - Rollback deployments

- **[Monitoring Setup](./deploy/monitoring/)**: Error tracking and analytics guides

### Environment Variables

All required environment variables are documented in [`.env.example`](./.env.example).

**Critical Variables:**
- `NEXT_PUBLIC_ONTARA_API_URL` - Backend API URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `CLERK_SECRET_KEY` - Clerk secret
- `ONTARA_API_KEY` - Backend API key

### CI/CD

GitHub Actions workflows automatically:
- Run tests and type checking on all PRs
- Deploy to Vercel on push to `main`
- Generate code coverage reports

See [`.github/workflows/`](./.github/workflows/) for workflow definitions.

### Cost Estimates

**Vercel**: $20-$100/month (Pro plan recommended for production)
**Cloud Run**: $0-$50/month (Free tier available)
**Additional Services**: $30-$100/month (Clerk, Sentry, etc.)

**Total Estimated**: $50-$250/month

See [deployment runbook](./deploy/DEPLOYMENT_RUNBOOK.md#cost-estimates) for detailed breakdown.

