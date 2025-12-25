import * as React from 'react';
import { BookOpen, Tag } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface Standard {
  id: string;
  name: string;
  description: string;
  grade?: string;
  subject?: string;
  domain?: string;
  cluster?: string;
  tags?: string[];
}

export interface StandardCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  standard: Standard;
  onSelect?: (standard: Standard) => void;
}

const StandardCard = React.forwardRef<HTMLDivElement, StandardCardProps>(
  ({ className, standard, onSelect, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all hover:shadow-md',
          onSelect && 'cursor-pointer',
          className
        )}
        onClick={() => onSelect?.(standard)}
        {...props}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{standard.name}</CardTitle>
            </div>
            {standard.grade && (
              <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                Grade {standard.grade}
              </span>
            )}
          </div>
          <CardDescription>{standard.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(standard.subject || standard.domain || standard.cluster) && (
            <>
              <Separator />
              <div className="grid gap-2 text-sm">
                {standard.subject && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Subject:</span>
                    <span className="text-muted-foreground">
                      {standard.subject}
                    </span>
                  </div>
                )}
                {standard.domain && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Domain:</span>
                    <span className="text-muted-foreground">
                      {standard.domain}
                    </span>
                  </div>
                )}
                {standard.cluster && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Cluster:</span>
                    <span className="text-muted-foreground">
                      {standard.cluster}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
          {standard.tags && standard.tags.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {standard.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-secondary px-2 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
);
StandardCard.displayName = 'StandardCard';

export { StandardCard };
