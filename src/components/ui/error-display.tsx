import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';

export interface ErrorDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorDisplay = React.forwardRef<HTMLDivElement, ErrorDisplayProps>(
  (
    {
      className,
      title = 'Error',
      message,
      onRetry,
      retryLabel = 'Try Again',
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={cn('border-destructive', className)}
        {...props}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{message}</p>
        </CardContent>
        {onRetry && (
          <CardFooter>
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
              {retryLabel}
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  }
);
ErrorDisplay.displayName = 'ErrorDisplay';

export { ErrorDisplay };
