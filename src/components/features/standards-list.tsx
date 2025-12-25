import * as React from 'react';
import { Search, Filter } from 'lucide-react';
import { StandardCard, type Standard } from './standard-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorDisplay } from '@/components/ui/error-display';
import { cn } from '@/lib/utils';

export interface StandardsListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  standards: Standard[];
  onSelectStandard?: (standard: Standard) => void;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  searchable?: boolean;
  emptyMessage?: string;
}

const StandardsList = React.forwardRef<HTMLDivElement, StandardsListProps>(
  (
    {
      className,
      standards,
      onSelectStandard,
      isLoading = false,
      error,
      onRetry,
      searchable = true,
      emptyMessage = 'No standards found.',
      ...props
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredStandards = React.useMemo(() => {
      if (!searchQuery) return standards;

      const query = searchQuery.toLowerCase();
      return standards.filter(
        (standard) =>
          standard.name.toLowerCase().includes(query) ||
          standard.description.toLowerCase().includes(query) ||
          standard.subject?.toLowerCase().includes(query) ||
          standard.domain?.toLowerCase().includes(query) ||
          standard.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }, [standards, searchQuery]);

    if (isLoading) {
      return <LoadingState message="Loading standards..." size="md" />;
    }

    if (error) {
      return (
        <ErrorDisplay
          title="Failed to Load Standards"
          message={error}
          onRetry={onRetry}
        />
      );
    }

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {searchable && standards.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="standards-search" className="sr-only">
              Search standards
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="standards-search"
                type="text"
                placeholder="Search by name, description, subject, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {filteredStandards.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Filter className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No standards match your search.' : emptyMessage}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStandards.map((standard) => (
              <StandardCard
                key={standard.id}
                standard={standard}
                onSelect={onSelectStandard}
              />
            ))}
          </div>
        )}

        {searchable && filteredStandards.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {filteredStandards.length} of {standards.length} standards
          </p>
        )}
      </div>
    );
  }
);
StandardsList.displayName = 'StandardsList';

export { StandardsList };
