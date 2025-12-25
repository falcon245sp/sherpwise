import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpressionInput } from '../expression-input';

describe('ExpressionInput', () => {
  it('renders with default label and placeholder', () => {
    render(<ExpressionInput />);
    
    expect(screen.getByLabelText('Mathematical Expression')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter a mathematical expression/i)).toBeInTheDocument();
  });

  it('renders with custom label and placeholder', () => {
    render(
      <ExpressionInput
        label="Custom Label"
        placeholder="Custom placeholder"
      />
    );
    
    expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<ExpressionInput onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'x^2');
    
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('x^2');
  });

  it('handles form submission', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ExpressionInput value="x^2 + 1" onSubmit={handleSubmit} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, '{Enter}');
    
    expect(handleSubmit).toHaveBeenCalledWith('x^2 + 1');
  });

  it('shows clear button when value is present', () => {
    render(<ExpressionInput value="test" showClear />);
    
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ExpressionInput value="test" onChange={handleChange} showClear />
    );
    
    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('displays error message', () => {
    render(<ExpressionInput error="Invalid expression" />);
    expect(screen.getByText('Invalid expression')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<ExpressionInput disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
