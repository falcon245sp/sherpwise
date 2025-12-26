// Health check endpoint for monitoring
// Place in: src/app/api/health/route.ts

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    server: boolean;
    backend?: boolean;
    clerk?: boolean;
  };
  uptime: number;
}

const startTime = Date.now();

export async function GET() {
  const checks = {
    server: true,
    backend: undefined as boolean | undefined,
    clerk: undefined as boolean | undefined,
  };

  // Check backend connectivity
  if (process.env.NEXT_PUBLIC_ONTARA_API_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ONTARA_API_URL}/health`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      checks.backend = response.ok;
    } catch (error) {
      checks.backend = false;
    }
  }

  // Check Clerk status (optional)
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    checks.clerk = true; // If key exists, assume Clerk is configured
  }

  const unhealthyChecks = Object.values(checks).filter((v) => v === false).length;
  const status: HealthCheckResult['status'] =
    unhealthyChecks === 0
      ? 'healthy'
      : unhealthyChecks === 1
      ? 'degraded'
      : 'unhealthy';

  const result: HealthCheckResult = {
    status,
    timestamp: new Date().toISOString(),
    checks,
    uptime: Date.now() - startTime,
  };

  const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

  return NextResponse.json(result, { status: statusCode });
}
