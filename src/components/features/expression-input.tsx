import * as React from 'react';
import { Calculator, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ExpressionInputProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'onSubmit'
  > {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  showClear?: boolean;
}

const ExpressionInput = React.forwardRef<HTMLDivElement, ExpressionInputProps>(
  (
    {
      className,
      value = '',
      onChange,
      onSubmit,
      placeholder = 'Enter a mathematical expression (e.g., x^2 + 2x + 1)',
      label = 'Mathematical Expression',
      error,
      disabled = false,
      showClear = true,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange?.(newValue);
    };

    const handleClear = () => {
      setLocalValue('');
      onChange?.('');
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (localValue.trim()) {
        onSubmit?.(localValue);
      }
    };

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && <Label htmlFor="expression-input">{label}</Label>}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center gap-2">
            <Calculator className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="expression-input"
              type="text"
              value={localValue}
              onChange={handleChange}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'pl-10 pr-10',
                error && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {showClear && localValue && !disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
        </form>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);
ExpressionInput.displayName = 'ExpressionInput';

export { ExpressionInput };
