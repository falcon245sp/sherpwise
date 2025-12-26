# Sentry Error Tracking Setup

## Installation

```bash
npm install @sentry/nextjs
```

## Configuration

### 1. Create `sentry.client.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  
  // Performance monitoring
  integrations: [
    new Sentry.BrowserTracing({
      traceFetch: true,
      traceXHR: true,
    }),
  ],
  
  // Error filtering
  beforeSend(event, hint) {
    // Filter out certain errors if needed
    if (event.exception) {
      const error = hint.originalException;
      // Filter based on your criteria
    }
    return event;
  },
});
```

### 2. Create `sentry.server.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
});
```

### 3. Create `sentry.edge.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
});
```

### 4. Update `next.config.js`:

```javascript
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // Your existing config
};

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: 'ontara',
    project: 'ontara-web',
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
  }
);
```

### 5. Environment Variables:

Add to `.env.example` and `.env.local`:

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[project]
SENTRY_AUTH_TOKEN=your_auth_token
```

## GitHub Actions Integration

Add to deployment workflow:

```yaml
- name: Create Sentry Release
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: ontara
    SENTRY_PROJECT: ontara-web
  run: |
    npm install -g @sentry/cli
    sentry-cli releases new ${{ github.sha }}
    sentry-cli releases set-commits ${{ github.sha }} --auto
    sentry-cli releases finalize ${{ github.sha }}
```

## Testing

```bash
# Create a test error in your app
throw new Error('Test Sentry integration');
```

Check your Sentry dashboard for the error.

## Performance Monitoring

Sentry automatically tracks:
- Page load times
- API request durations
- Database query performance
- User interactions

## Custom Error Tracking

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'document-upload',
    },
    extra: {
      documentId: doc.id,
    },
  });
}
```

## User Context

```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});
```

## Cost Estimate

- Free tier: 5K errors/month
- Team tier: $26/month for 50K errors
- Production recommendation: Team tier or higher
