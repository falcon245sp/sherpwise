import * as React from 'react';
import { CheckCircle2, Target } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface ClassificationMatch {
  standardId: string;
  standardName: string;
  confidence: number;
  reasoning?: string;
}

export interface ClassificationResultProps
  extends React.HTMLAttributes<HTMLDivElement> {
  expression: string;
  matches: ClassificationMatch[];
  timestamp?: Date;
}

const ClassificationResult = React.forwardRef<
  HTMLDivElement,
  ClassificationResultProps
>(({ className, expression, matches, timestamp, ...props }, ref) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <Card ref={ref} className={cn(className)} {...props}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle>Classification Results</CardTitle>
        </div>
        <CardDescription>Expression: {expression}</CardDescription>
        {timestamp && (
          <p className="text-xs text-muted-foreground">
            {timestamp.toLocaleString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No matching standards found.
          </p>
        ) : (
          matches.map((match, index) => (
            <div key={match.standardId}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium">{match.standardName}</h4>
                  </div>
                  <span
                    className={cn(
                      'rounded-md px-2 py-1 text-xs font-medium',
                      getConfidenceBadge(match.confidence)
                    )}
                  >
                    {(match.confidence * 100).toFixed(0)}% match
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  ID: {match.standardId}
                </p>
                {match.reasoning && (
                  <p className="text-sm text-muted-foreground">
                    {match.reasoning}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Confidence:
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-secondary">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        getConfidenceColor(match.confidence).replace(
                          'text-',
                          'bg-'
                        )
                      )}
                      style={{ width: `${match.confidence * 100}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      getConfidenceColor(match.confidence)
                    )}
                  >
                    {(match.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
});
ClassificationResult.displayName = 'ClassificationResult';

export { ClassificationResult };
