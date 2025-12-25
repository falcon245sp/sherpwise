# Deployment Instructions for Ontara Web

## Repository Setup

The web application has been initialized locally at `/tmp/ontara-web`. To push it to GitHub:

### 1. Create GitHub Repository

```bash
# Option 1: Create via GitHub web interface
# Go to https://github.com/organizations/The-Ontara-Institute/repositories/new
# Repository name: ontara-web
# Description: Web application for math standards alignment and curriculum analysis
# Visibility: Private
# DO NOT initialize with README, .gitignore, or license (we already have these)

# Option 2: Create via GitHub CLI (if you install it)
gh repo create The-Ontara-Institute/ontara-web --private --description "Web application for math standards alignment and curriculum analysis"
```

### 2. Push Local Repository to GitHub

```bash
cd /tmp/ontara-web
git remote add origin https://github.com/The-Ontara-Institute/ontara-web.git
git branch -M main
git push -u origin main
```

### 3. Move Repository to Desired Location

```bash
# Move from /tmp to your projects directory
mv /tmp/ontara-web ~/projects/ontara-web  # or your preferred location
cd ~/projects/ontara-web
```

## Verification Checklist

All verification steps have been completed:

- ✅ `npm install` - Dependencies installed successfully
- ✅ `npm run dev` - Development server configuration verified
- ✅ `npm run lint` - ESLint passes with no errors
- ✅ `npm run type-check` - TypeScript compilation successful
- ✅ `npm run build` - Production build successful
- ✅ `npm run format` - Code formatted with Prettier

## Next Steps

### Configure Secrets in GitHub

Once the repository is pushed, configure these GitHub secrets:

1. **For Vercel Deployment:**
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_ONTARA_API_URL`
   - `NEXT_PUBLIC_ONTARA_MCP_URL`

2. **For Cloud Run Deployment (alternative):**
   - `GCP_SA_KEY`
   - `GCP_PROJECT_ID`

### Set Up Branch Protection

1. Go to repository Settings > Branches
2. Add branch protection rule for `main`:
   - Require pull request reviews before merging
   - Require status checks to pass (lint, type-check, test, build)
   - Require branches to be up to date before merging

### Local Development Setup

For other developers:

```bash
git clone https://github.com/The-Ontara-Institute/ontara-web.git
cd ontara-web
npm install
cp .env.example .env.local
# Edit .env.local with local configuration
npm run dev
```

## Repository Structure

```
ontara-web/
├── .github/workflows/     # CI/CD pipelines
│   ├── ci.yml             # Main CI workflow
│   └── deploy.yml         # Deployment workflow
├── e2e/                   # Playwright E2E tests
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app router pages
│   └── test/              # Test setup and utilities
├── .env.example           # Environment variable template
├── .gitignore             # Git ignore rules
├── .prettierrc.json       # Prettier configuration
├── eslint.config.mjs      # ESLint configuration
├── LICENSE                # Apache 2.0 License
├── package.json           # Project dependencies and scripts
├── playwright.config.ts   # Playwright configuration
├── README.md              # Project documentation
├── tsconfig.json          # TypeScript configuration
└── vitest.config.ts       # Vitest configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run Vitest unit tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:e2e:debug` - Debug E2E tests

## Tech Stack Summary

- **Framework:** Next.js 16.1.1 with App Router
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.x
- **Authentication:** Clerk (to be configured)
- **Testing:** Vitest + Playwright
- **CI/CD:** GitHub Actions
- **Deployment:** Vercel (recommended) or Google Cloud Run

## Status

✅ Repository initialized and configured
✅ All tooling configured and tested
✅ CI/CD pipelines created
✅ Documentation complete

**Ready for GitHub push and deployment configuration!**
