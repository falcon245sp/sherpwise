import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../loading-state';

describe('LoadingState', () => {
  it('renders with default message', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading...', { selector: 'p' })).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingState message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders spinner with different sizes', () => {
    const { rerender, container } = render(<LoadingState size="sm" />);
    expect(container.querySelector('.h-4')).toBeInTheDocument();

    rerender(<LoadingState size="lg" />);
    expect(container.querySelector('.h-12')).toBeInTheDocument();
  });

  it('has proper loading role', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
