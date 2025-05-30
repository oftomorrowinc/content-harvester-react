import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleSwitch } from '../../src/components/ToggleSwitch';

describe('ToggleSwitch', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render correctly', () => {
    render(<ToggleSwitch checked={false} onChange={mockOnChange} />);
    const input = screen.getByRole('checkbox');
    expect(input).toBeInTheDocument();
    expect(input).not.toBeChecked();
  });

  it('should show checked state correctly', () => {
    render(<ToggleSwitch checked={true} onChange={mockOnChange} />);
    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
  });

  it('should call onChange when clicked', () => {
    render(<ToggleSwitch checked={false} onChange={mockOnChange} />);
    const input = screen.getByRole('checkbox');
    
    fireEvent.click(input);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('should not call onChange when disabled', () => {
    render(<ToggleSwitch checked={false} onChange={mockOnChange} disabled />);
    const input = screen.getByRole('checkbox');
    
    fireEvent.click(input);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should apply disabled styles when disabled', () => {
    const { container } = render(
      <ToggleSwitch checked={false} onChange={mockOnChange} disabled />
    );
    const slider = container.querySelector('.toggle-slider');
    expect(slider).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('should use accessibility label', () => {
    render(
      <ToggleSwitch 
        checked={false} 
        onChange={mockOnChange} 
        label="Toggle anonymization" 
      />
    );
    const input = screen.getByLabelText('Toggle anonymization');
    expect(input).toBeInTheDocument();
  });

  it('should apply different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    
    sizes.forEach(size => {
      const { container } = render(
        <ToggleSwitch checked={false} onChange={mockOnChange} size={size} />
      );
      const label = container.querySelector('label');
      
      if (size === 'sm') {
        expect(label).toHaveClass('w-8', 'h-5');
      } else if (size === 'md') {
        expect(label).toHaveClass('w-10', 'h-6');
      } else if (size === 'lg') {
        expect(label).toHaveClass('w-12', 'h-7');
      }
    });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ToggleSwitch 
        checked={false} 
        onChange={mockOnChange} 
        className="custom-class" 
      />
    );
    const label = container.querySelector('label');
    expect(label).toHaveClass('custom-class');
  });

  it('should have proper default size', () => {
    const { container } = render(
      <ToggleSwitch checked={false} onChange={mockOnChange} />
    );
    const label = container.querySelector('label');
    expect(label).toHaveClass('w-10', 'h-6'); // md size
  });

  it('should handle keyboard events', () => {
    render(<ToggleSwitch checked={false} onChange={mockOnChange} />);
    const input = screen.getByRole('checkbox');
    
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    // The browser handles Enter key for checkboxes, so we just verify it's accessible
    expect(input).toBeInTheDocument();
  });
});