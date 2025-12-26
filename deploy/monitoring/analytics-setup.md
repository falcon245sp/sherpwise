# Analytics Setup Guide

## Google Analytics 4 (GA4)

### Installation

```bash
npm install @next/third-parties
```

### Configuration

#### 1. Update `app/layout.tsx`:

```typescript
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </body>
    </html>
  );
}
```

#### 2. Environment Variables:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### 3. Custom Event Tracking:

Create `src/lib/analytics.ts`:

```typescript
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
};
```

#### 4. Usage Example:

```typescript
import { trackEvent } from '@/lib/analytics';

// Track document upload
trackEvent('document_upload', {
  file_type: 'pdf',
  file_size: file.size,
});

// Track expression classification
trackEvent('classify_expression', {
  expression_length: expression.length,
  result_count: results.length,
});
```

## Posthog (Alternative)

### Installation

```bash
npm install posthog-js
```

### Configuration

Create `src/lib/posthog.ts`:

```typescript
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

export default posthog;
```

### Usage:

```typescript
import posthog from '@/lib/posthog';

posthog.capture('user_signed_up', {
  distinct_id: user.id,
  properties: {
    email: user.email,
    role: user.role,
  },
});
```

## Privacy Compliance

### Cookie Consent Banner

Create `src/components/CookieConsent.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    setShow(!consent);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <p className="text-sm">
          We use cookies to improve your experience. By using our site, you agree to our cookie policy.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={declineCookies}>
            Decline
          </Button>
          <Button onClick={acceptCookies}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### Privacy Policy

Add to your app:
- Privacy Policy page (`/privacy`)
- Terms of Service page (`/terms`)
- Cookie Policy page (`/cookies`)

## Recommended Metrics to Track

1. **User Engagement**:
   - Sign-ups
   - Login frequency
   - Session duration
   - Pages per session

2. **Feature Usage**:
   - Document uploads
   - Expression classifications
   - Standards searches
   - Export downloads

3. **Performance**:
   - Page load times
   - API response times
   - Error rates
   - User drop-off points

4. **Business Metrics**:
   - Active users (daily/weekly/monthly)
   - Feature adoption rates
   - User retention
   - Conversion funnels

## Cost Estimates

**Google Analytics 4**: Free
**Posthog**:
- Free tier: 1M events/month
- Startup tier: $0.00031 per event (after free tier)
- Estimated: $50-$200/month depending on usage
