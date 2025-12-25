import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SdkErrorBoundary } from '../SdkErrorBoundary';
import { OntaraError, OntaraAuthError, OntaraNetworkError } from '@ontara/core-sdk';

vi.mock('@ontara/core-sdk', () => {
  return {
    OntaraError: class OntaraError extends Error {
      constructor(message: string, public code?: string, public statusCode?: number, public details?: Record<string, unknown>) {
        super(message);
        this.name = 'OntaraError';
      }
    },
    OntaraAuthError: class OntaraAuthError extends Error {
      constructor(message: string, public details?: Record<string, unknown>) {
        super(message);
        this.name = 'OntaraAuthError';
      }
    },
    OntaraNetworkError: class OntaraNetworkError extends Error {
      constructor(message: string, public details?: Record<string, unknown>) {
        super(message);
        this.name = 'OntaraNetworkError';
      }
    },
    OntaraValidationError: class OntaraValidationError extends Error {
      constructor(message: string, public details?: Record<string, unknown>) {
        super(message);
        this.name = 'OntaraValidationError';
      }
    },
  };
});

const ThrowError = ({ error }: { error: Error }) => {
  throw error;
};

describe('SdkErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <SdkErrorBoundary>
        <div>Test content</div>
      </SdkErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render default error UI for OntaraError', () => {
    const error = new OntaraError('Service unavailable', 'SERVICE_ERROR', 503);

    render(
      <SdkErrorBoundary>
        <ThrowError error={error} />
      </SdkErrorBoundary>
    );

    expect(screen.getByText('Service Error')).toBeInTheDocument();
    expect(screen.getByText('Service unavailable')).toBeInTheDocument();
  });

  it('should render authentication error UI for OntaraAuthError', () => {
    const error = new OntaraAuthError('Authentication failed');

    render(
      <SdkErrorBoundary>
        <ThrowError error={error} />
      </SdkErrorBoundary>
    );

    expect(screen.getByText('Authentication Error')).toBeInTheDocument();
    expect(screen.getByText(/Your session may have expired/)).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should render network error UI for OntaraNetworkError', () => {
    const error = new OntaraNetworkError('Network timeout');

    render(
      <SdkErrorBoundary>
        <ThrowError error={error} />
      </SdkErrorBoundary>
    );

    expect(screen.getByText('Network Error')).toBeInTheDocument();
    expect(screen.getByText(/Unable to connect to the backend service/)).toBeInTheDocument();
  });

  it('should render generic error UI for non-Ontara errors', () => {
    const error = new Error('Something went wrong');

    render(
      <SdkErrorBoundary>
        <ThrowError error={error} />
      </SdkErrorBoundary>
    );

    expect(screen.getByText('Unexpected Error')).toBeInTheDocument();
    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    const error = new OntaraError('Test error');
    const customFallback = (err: Error) => <div>Custom error: {err.message}</div>;

    render(
      <SdkErrorBoundary fallback={customFallback}>
        <ThrowError error={error} />
      </SdkErrorBoundary>
    );

    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument();
  });
});
