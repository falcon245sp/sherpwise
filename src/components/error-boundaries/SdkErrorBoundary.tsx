'use client';

import React, { Component, ReactNode } from 'react';
import { OntaraError, OntaraAuthError, OntaraNetworkError, OntaraValidationError } from '@ontara/core-sdk';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SdkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SDK Error caught by boundary:', error, errorInfo);
    
    if (error instanceof OntaraAuthError) {
      console.error('Authentication error - redirecting to login may be needed');
    } else if (error instanceof OntaraNetworkError) {
      console.error('Network error - backend may be unavailable');
    } else if (error instanceof OntaraValidationError) {
      console.error('Validation error - check request parameters');
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const isAuthError = error instanceof OntaraAuthError;
  const isNetworkError = error instanceof OntaraNetworkError;
  const isValidationError = error instanceof OntaraValidationError;
  const isOntaraError = error instanceof OntaraError;

  let title = 'Unexpected Error';
  let message = 'An unexpected error occurred. Please try again.';

  if (isAuthError) {
    title = 'Authentication Error';
    message = 'Your session may have expired. Please sign in again.';
  } else if (isNetworkError) {
    title = 'Network Error';
    message = 'Unable to connect to the backend service. Please try again later.';
  } else if (isValidationError) {
    title = 'Validation Error';
    message = error.message;
  } else if (isOntaraError) {
    title = 'Service Error';
    message = error.message;
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-red-800">{title}</h3>
            <p className="mt-2 text-sm text-red-700">{message}</p>
            {!isOntaraError && (
              <details className="mt-4">
                <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                  Technical details
                </summary>
                <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap break-words">
                  {error.message}
                  {'\n'}
                  {error.stack}
                </pre>
              </details>
            )}
            <div className="mt-4 flex gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try again
              </button>
              {isAuthError && (
                <a
                  href="/sign-in"
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign in
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
