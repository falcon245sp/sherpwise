# Ontara Web Roadmap

This document tracks planned features and user stories for future implementation.

## Phase 1: Foundation (Current)
- ✅ Authentication with Clerk (Google OAuth + Email/Password)
- ✅ Role-Based Access Control (5 user roles)
- ✅ Protected routes and middleware
- ✅ SDK integration
- ⏳ Core UI components (Next)
- ⏳ Document upload functionality
- ⏳ Standards browsing and classification

## Phase 2: Monetization & Billing

### User Story: Stripe Subscription Integration
**As a** product owner  
**I want to** integrate Stripe subscriptions with Clerk authentication  
**So that** users can be billed based on their subscription tier and access features accordingly

#### Acceptance Criteria:
- [ ] Stripe subscription status stored in Clerk `publicMetadata`
  - `stripeCustomerId`: Customer ID from Stripe
  - `subscriptionStatus`: `active`, `canceled`, `past_due`, `trialing`, etc.
  - `subscriptionTier`: `free`, `basic`, `premium`, `enterprise`
  - `subscriptionEndsAt`: Expiration date for current period
- [ ] Clerk JWT template configured to include Stripe data in session claims
- [ ] Stripe webhook handler created to sync subscription changes to Clerk
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- [ ] Subscription-based permission checks integrated with RBAC system
- [ ] Middleware enforces subscription requirements for premium features
- [ ] UI displays subscription status and upgrade prompts
- [ ] Billing portal integration for subscription management

#### Technical Implementation Notes:
```typescript
// Store in Clerk publicMetadata
{
  role: "teacher",
  districtId: "district-123",
  siteIds: ["site-456"],
  // Stripe subscription data
  stripeCustomerId: "cus_xxx",
  subscriptionStatus: "active",
  subscriptionTier: "premium",
  subscriptionEndsAt: "2024-12-31T23:59:59Z"
}

// Access via JWT claims
const { sessionClaims } = await auth();
const canAccessFeature = sessionClaims?.subscriptionTier === "premium";
```

#### Dependencies:
- Stripe account and API keys
- Webhook endpoint configuration
- Clerk JWT template setup

#### Estimated Effort: 3-5 days

---

## Phase 3: Advanced Features

### Planned User Stories:
- Document processing pipeline with real-time status updates
- Advanced analytics dashboard (subscription-gated)
- Collaborative standards mapping
- Export to district LMS integrations
- Mobile-responsive design improvements
- Multi-language support

---

## Technical Debt & Improvements

### Future Enhancements:
- [ ] Replace placeholder Clerk keys with environment-based test keys
- [ ] Implement production-ready error tracking (Sentry)
- [ ] Add comprehensive E2E test suite with Playwright
- [ ] Optimize bundle size and implement code splitting
- [ ] Add performance monitoring (Web Vitals)
- [ ] Implement rate limiting on API routes
- [ ] Add request/response caching strategies
- [ ] Create Storybook for component documentation

---

## Notes

### Subscription Tiers (Draft):
- **Free**: Limited document uploads (5/month), basic standards browsing
- **Basic** ($19/month): 50 documents/month, basic analytics
- **Premium** ($49/month): Unlimited documents, advanced analytics, priority support
- **Enterprise** (Custom): SSO, dedicated support, custom integrations

---

**Last Updated**: 2025-12-25  
**Maintained By**: Development Team
