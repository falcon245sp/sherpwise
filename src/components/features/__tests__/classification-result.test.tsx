import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClassificationResult, type ClassificationMatch } from '../classification-result';

describe('ClassificationResult', () => {
  const mockMatches: ClassificationMatch[] = [
    {
      standardId: 'std-1',
      standardName: 'CCSS.MATH.8.EE.A.1',
      confidence: 0.95,
      reasoning: 'Strong match based on exponent properties',
    },
    {
      standardId: 'std-2',
      standardName: 'CCSS.MATH.8.EE.A.2',
      confidence: 0.72,
      reasoning: 'Moderate match',
    },
  ];

  it('renders expression and matches', () => {
    render(
      <ClassificationResult
        expression="x^2 + 2x + 1"
        matches={mockMatches}
      />
    );
    
    expect(screen.getByText('Expression: x^2 + 2x + 1')).toBeInTheDocument();
    expect(screen.getByText('CCSS.MATH.8.EE.A.1')).toBeInTheDocument();
    expect(screen.getByText('CCSS.MATH.8.EE.A.2')).toBeInTheDocument();
  });

  it('displays confidence percentages', () => {
    render(
      <ClassificationResult
        expression="x^2"
        matches={mockMatches}
      />
    );
    
    expect(screen.getByText('95% match')).toBeInTheDocument();
    expect(screen.getByText('72% match')).toBeInTheDocument();
  });

  it('displays reasoning when provided', () => {
    render(
      <ClassificationResult
        expression="x^2"
        matches={mockMatches}
      />
    );
    
    expect(screen.getByText('Strong match based on exponent properties')).toBeInTheDocument();
    expect(screen.getByText('Moderate match')).toBeInTheDocument();
  });

  it('displays timestamp when provided', () => {
    const timestamp = new Date('2024-01-15T10:00:00Z');
    render(
      <ClassificationResult
        expression="x^2"
        matches={mockMatches}
        timestamp={timestamp}
      />
    );
    
    expect(screen.getByText(timestamp.toLocaleString())).toBeInTheDocument();
  });

  it('displays message when no matches found', () => {
    render(
      <ClassificationResult
        expression="x^2"
        matches={[]}
      />
    );
    
    expect(screen.getByText('No matching standards found.')).toBeInTheDocument();
  });

  it('displays standard IDs', () => {
    render(
      <ClassificationResult
        expression="x^2"
        matches={mockMatches}
      />
    );
    
    expect(screen.getByText('ID: std-1')).toBeInTheDocument();
    expect(screen.getByText('ID: std-2')).toBeInTheDocument();
  });
});
