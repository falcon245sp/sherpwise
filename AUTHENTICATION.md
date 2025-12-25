# Authentication Setup

This document describes the authentication system implemented in Ontara Web using Clerk.

## Overview

The application uses [Clerk](https://clerk.com/) for authentication and authorization, providing:

- **Google OAuth** - Sign in with Google accounts
- **Email/Password** - Traditional username/password authentication
- **Role-Based Access Control (RBAC)** - Five hierarchical user roles
- **Multi-tenant Support** - District and site-level isolation

## User Roles

The system supports five hierarchical roles:

1. **District Admin** (`district_admin`)
   - Full access to all district resources
   - Can manage sites, teachers, and students
   - Access to all analytics and reports

2. **Site Admin** (`site_admin`)
   - Manages specific school site(s)
   - Can manage teachers and students in their site(s)
   - Access to site-level analytics

3. **Subject Lead** (`subject_lead`)
   - Subject matter expert across multiple sites
   - Can access subject-specific content and analytics
   - Limited administrative capabilities

4. **Teacher** (`teacher`)
   - Default role for new users
   - Access to their own classes and students
   - Can upload documents and view standards

5. **Student/Parent** (`student_parent`)
   - Read-only access to student progress
   - Cannot upload documents or manage content

## Setup Instructions

### 1. Create a Clerk Account

1. Visit [clerk.com](https://clerk.com/) and sign up
2. Create a new application
3. Enable authentication providers:
   - **Google OAuth**: Go to "OAuth providers" and enable Google
   - **Email/Password**: Enabled by default

### 2. Get API Keys

1. Navigate to "API Keys" in your Clerk dashboard
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 4. Configure User Metadata

To set user roles and district/site assignments, you need to configure user metadata in Clerk:

1. Go to your Clerk Dashboard
2. Select your application
3. Go to "Users" and select a user
4. Under "Public metadata", add:

```json
{
  "role": "teacher",
  "districtId": "district-123",
  "siteIds": ["site-456"],
  "subject": "mathematics"
}
```

## Application Structure

### Authentication Components

- **`src/middleware.ts`** - Route protection middleware
- **`src/app/sign-in/[[...sign-in]]/page.tsx`** - Sign-in page
- **`src/app/sign-up/[[...sign-up]]/page.tsx`** - Sign-up page
- **`src/app/dashboard/page.tsx`** - Protected dashboard (requires auth)
- **`src/app/profile/page.tsx`** - User profile management

### Auth Utilities

- **`src/lib/auth/types.ts`** - TypeScript types for roles and metadata
- **`src/lib/auth/permissions.ts`** - Permission checking functions
- **`src/lib/auth/utils.ts`** - Server-side auth utilities
- **`src/lib/auth/hooks.ts`** - Client-side React hooks

## Usage Examples

### Server-Side (Route Handlers, Server Components)

```typescript
import { getOntaraUser, requireRole } from "@/lib/auth";
import { UserRole } from "@/lib/auth/types";

// Get current user
export async function GET() {
  const user = await getOntaraUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ user });
}

// Require specific role
export async function POST() {
  const user = await requireRole([UserRole.DistrictAdmin, UserRole.SiteAdmin]);
  // Only admins can reach this point
  return Response.json({ success: true });
}
```

### Client-Side (React Components)

```typescript
"use client";

import { useOntaraUser, useHasRole } from "@/lib/auth";
import { UserRole } from "@/lib/auth/types";

export function MyComponent() {
  const { user, isLoaded } = useOntaraUser();
  const isAdmin = useHasRole([UserRole.DistrictAdmin, UserRole.SiteAdmin]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <p>Role: {user.role}</p>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### Permission Checks

```typescript
import { canUploadDocuments, hasAccessToSite } from "@/lib/auth/permissions";
import { UserRole } from "@/lib/auth/types";

// Check if user can upload documents
if (canUploadDocuments(user.role)) {
  // Show upload UI
}

// Check if user has access to a specific site
if (hasAccessToSite(user.role, user.siteIds, targetSiteId)) {
  // Show site data
}
```

## Protected Routes

The middleware (`src/middleware.ts`) automatically protects all routes except:

- `/` - Home page (public)
- `/sign-in/*` - Sign-in pages
- `/sign-up/*` - Sign-up pages
- `/api/health/*` - Health check endpoints

All other routes require authentication and will redirect to `/sign-in` if not authenticated.

## Testing

Run the authentication test suite:

```bash
npm run test -- src/lib/auth/__tests__
```

Tests cover:
- Permission checking (19 tests)
- Client-side hooks (7 tests)
- Total: 26 tests

## Security Considerations

1. **API Keys**: Never commit real Clerk keys to version control
2. **Secret Key**: The `CLERK_SECRET_KEY` should only be used server-side
3. **Metadata**: User roles are stored in public metadata (visible to user)
4. **Validation**: Always validate permissions server-side, never trust client-side checks alone

## Production Build

**IMPORTANT**: Production builds require valid Clerk API keys. The build process will fail with placeholder keys. 

To build for production:

1. Set up a Clerk account (see setup instructions above)
2. Add real API keys to `.env.local` or deployment environment
3. Run `npm run build`

## Troubleshooting

### Build fails with "Missing publishableKey"

**Solution**: Add valid Clerk keys to your `.env.local` file. Placeholder keys will not work.

### User role is always "teacher"

**Solution**: Set the `publicMetadata` for the user in Clerk Dashboard (see step 4 in setup instructions).

### Authentication works locally but not in production

**Solution**: Ensure environment variables are configured in your deployment platform (Vercel, Cloud Run, etc.)

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Clerk + Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
