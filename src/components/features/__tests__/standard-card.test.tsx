import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StandardCard, type Standard } from '../standard-card';

describe('StandardCard', () => {
  const mockStandard: Standard = {
    id: 'std-1',
    name: 'CCSS.MATH.CONTENT.8.EE.A.1',
    description: 'Know and apply the properties of integer exponents',
    grade: '8',
    subject: 'Mathematics',
    domain: 'Expressions and Equations',
    cluster: 'Work with radicals and integer exponents',
    tags: ['algebra', 'exponents'],
  };

  it('renders standard information', () => {
    render(<StandardCard standard={mockStandard} />);
    
    expect(screen.getByText(mockStandard.name)).toBeInTheDocument();
    expect(screen.getByText(mockStandard.description)).toBeInTheDocument();
    expect(screen.getByText('Grade 8')).toBeInTheDocument();
  });

  it('renders subject, domain, and cluster', () => {
    render(<StandardCard standard={mockStandard} />);
    
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('Expressions and Equations')).toBeInTheDocument();
    expect(screen.getByText('Work with radicals and integer exponents')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<StandardCard standard={mockStandard} />);
    
    expect(screen.getByText('algebra')).toBeInTheDocument();
    expect(screen.getByText('exponents')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();
    render(<StandardCard standard={mockStandard} onSelect={handleSelect} />);
    
    await user.click(screen.getByText(mockStandard.name));
    expect(handleSelect).toHaveBeenCalledWith(mockStandard);
  });

  it('renders without optional fields', () => {
    const minimalStandard: Standard = {
      id: 'std-2',
      name: 'Simple Standard',
      description: 'A minimal standard',
    };
    
    render(<StandardCard standard={minimalStandard} />);
    expect(screen.getByText('Simple Standard')).toBeInTheDocument();
  });
});
