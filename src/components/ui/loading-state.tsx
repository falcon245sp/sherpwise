import * as React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ className, message = 'Loading...', size = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center gap-4 p-8',
          className
        )}
        {...props}
      >
        <Spinner size={size} />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    );
  }
);
LoadingState.displayName = 'LoadingState';

export { LoadingState };
