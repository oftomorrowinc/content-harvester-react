import React from 'react';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../../src/components/EmptyState';

describe('EmptyState', () => {
  it('should render default content', () => {
    render(<EmptyState />);
    expect(screen.getByText('No content yet')).toBeInTheDocument();
    expect(screen.getByText('Start by adding some URLs or uploading files')).toBeInTheDocument();
  });

  it('should render custom title and description', () => {
    render(
      <EmptyState 
        title="Custom Title" 
        description="Custom description text" 
      />
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('should render different variants with appropriate content', () => {
    const variants = [
      { variant: 'drop-zone', expectedTitle: 'Drop files here' },
      { variant: 'no-results', expectedTitle: 'No content found' },
      { variant: 'error', expectedTitle: 'Something went wrong' },
    ] as const;

    variants.forEach(({ variant, expectedTitle }) => {
      const { unmount } = render(<EmptyState variant={variant} />);
      expect(screen.getByText(expectedTitle)).toBeInTheDocument();
      unmount();
    });
  });

  it('should render custom icon', () => {
    const customIcon = <div data-testid="custom-icon">Custom Icon</div>;
    render(<EmptyState icon={customIcon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should render action button', () => {
    const action = <button>Custom Action</button>;
    render(<EmptyState action={action} />);
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<EmptyState className="custom-class" />);
    const emptyState = container.firstChild as HTMLElement;
    expect(emptyState).toHaveClass('custom-class');
  });

  it('should have proper CSS classes', () => {
    const { container } = render(<EmptyState />);
    const emptyState = container.firstChild as HTMLElement;
    expect(emptyState).toHaveClass('empty-state');
  });

  it('should render icon with correct styling', () => {
    const { container } = render(<EmptyState />);
    const iconContainer = container.querySelector('.empty-state-icon');
    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer?.querySelector('svg')).toBeInTheDocument();
  });

  it('should show error variant with error styling', () => {
    const { container } = render(<EmptyState variant="error" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-dark-status-error');
  });

  it('should show different icons for different variants', () => {
    const variants = ['drop-zone', 'no-results', 'error', 'default'] as const;
    
    variants.forEach(variant => {
      const { container } = render(<EmptyState variant={variant} />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  it('should not render title when not provided and no variant default', () => {
    render(<EmptyState title="" />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('should not render description when not provided and no variant default', () => {
    render(<EmptyState description="" />);
    // Should not find any text that looks like a description
    expect(screen.queryByText(/Start by adding/)).not.toBeInTheDocument();
  });

  it('should render action in correct container', () => {
    const action = <button data-testid="action-button">Test Action</button>;
    const { container } = render(<EmptyState action={action} />);
    const actionContainer = container.querySelector('.mt-6');
    expect(actionContainer).toBeInTheDocument();
    expect(actionContainer).toContainElement(screen.getByTestId('action-button'));
  });
});