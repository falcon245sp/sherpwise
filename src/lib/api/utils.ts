import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { OntaraError, OntaraAuthError, OntaraNetworkError, OntaraValidationError } from '@ontara/core-sdk';

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}

export function handleApiError(error: unknown): NextResponse<ApiError> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation Error',
        message: 'Invalid request parameters',
        details: error.issues,
      },
      { status: 400 }
    );
  }

  if (error instanceof OntaraValidationError) {
    return NextResponse.json(
      {
        error: 'Validation Error',
        message: error.message,
      },
      { status: 400 }
    );
  }

  if (error instanceof OntaraAuthError) {
    return NextResponse.json(
      {
        error: 'Authentication Error',
        message: error.message,
      },
      { status: 401 }
    );
  }

  if (error instanceof OntaraNetworkError) {
    return NextResponse.json(
      {
        error: 'Network Error',
        message: 'Failed to communicate with backend service',
      },
      { status: 503 }
    );
  }

  if (error instanceof OntaraError) {
    return NextResponse.json(
      {
        error: 'Backend Error',
        message: error.message,
      },
      { status: 500 }
    );
  }

  console.error('Unexpected API error:', error);
  return NextResponse.json(
    {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}

export function createSuccessResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}
