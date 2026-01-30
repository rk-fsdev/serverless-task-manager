import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../UI/Input';

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Test Label" name="test" />);
    expect(screen.getByLabelText(/test label/i)).toBeInTheDocument();
  });

  it('renders input without label', () => {
    render(<Input name="test" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies required indicator', () => {
    render(<Input label="Required Field" name="test" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input name="test" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling when error exists', () => {
    render(<Input name="test" error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-error-300');
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input name="test" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies placeholder', () => {
    render(<Input name="test" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Input name="test" className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input name="test" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders different input types', () => {
    render(<Input name="test" type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });
});
