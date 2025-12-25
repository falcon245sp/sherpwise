import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StandardsList } from '../standards-list';
import type { Standard } from '../standard-card';

describe('StandardsList', () => {
  const mockStandards: Standard[] = [
    {
      id: 'std-1',
      name: 'CCSS.MATH.8.EE.A.1',
      description: 'Integer exponents',
      grade: '8',
      subject: 'Mathematics',
      tags: ['algebra', 'exponents'],
    },
    {
      id: 'std-2',
      name: 'CCSS.MATH.8.EE.A.2',
      description: 'Square and cube roots',
      grade: '8',
      subject: 'Mathematics',
      tags: ['algebra', 'roots'],
    },
    {
      id: 'std-3',
      name: 'CCSS.MATH.7.NS.A.1',
      description: 'Rational numbers',
      grade: '7',
      subject: 'Mathematics',
      tags: ['numbers'],
    },
  ];

  it('renders all standards', () => {
    render(<StandardsList standards={mockStandards} />);
    
    expect(screen.getByText('CCSS.MATH.8.EE.A.1')).toBeInTheDocument();
    expect(screen.getByText('CCSS.MATH.8.EE.A.2')).toBeInTheDocument();
    expect(screen.getByText('CCSS.MATH.7.NS.A.1')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<StandardsList standards={[]} isLoading />);
    expect(screen.getByText('Loading standards...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    render(
      <StandardsList
        standards={[]}
        error="Failed to load"
        onRetry={() => {}}
      />
    );
    
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('filters standards by search query', async () => {
    const user = userEvent.setup();
    render(<StandardsList standards={mockStandards} searchable />);
    
    const searchInput = screen.getByPlaceholderText(/search by name/i);
    await user.type(searchInput, 'exponents');
    
    expect(screen.getByText('CCSS.MATH.8.EE.A.1')).toBeInTheDocument();
    expect(screen.queryByText('CCSS.MATH.7.NS.A.1')).not.toBeInTheDocument();
  });

  it('searches by tags', async () => {
    const user = userEvent.setup();
    render(<StandardsList standards={mockStandards} searchable />);
    
    const searchInput = screen.getByPlaceholderText(/search by name/i);
    await user.type(searchInput, 'roots');
    
    expect(screen.getByText('CCSS.MATH.8.EE.A.2')).toBeInTheDocument();
    expect(screen.queryByText('CCSS.MATH.8.EE.A.1')).not.toBeInTheDocument();
  });

  it('displays count of filtered results', async () => {
    const user = userEvent.setup();
    render(<StandardsList standards={mockStandards} searchable />);
    
    expect(screen.getByText('Showing 3 of 3 standards')).toBeInTheDocument();
    
    const searchInput = screen.getByPlaceholderText(/search by name/i);
    await user.type(searchInput, 'algebra');
    
    expect(screen.getByText('Showing 2 of 3 standards')).toBeInTheDocument();
  });

  it('calls onSelectStandard when a standard is clicked', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <StandardsList
        standards={mockStandards}
        onSelectStandard={handleSelect}
      />
    );
    
    await user.click(screen.getByText('CCSS.MATH.8.EE.A.1'));
    expect(handleSelect).toHaveBeenCalledWith(mockStandards[0]);
  });

  it('displays empty message when no standards', () => {
    render(<StandardsList standards={[]} emptyMessage="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('hides search when searchable is false', () => {
    render(<StandardsList standards={mockStandards} searchable={false} />);
    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
  });
});
