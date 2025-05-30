import React from 'react';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../../src/components/StatusBadge';

describe('StatusBadge', () => {
  it('should render status text correctly', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('should render all status types', () => {
    const statuses = ['pending', 'processing', 'completed', 'error'] as const;
    
    statuses.forEach(status => {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(status.charAt(0).toUpperCase() + status.slice(1))).toBeInTheDocument();
      unmount();
    });
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<StatusBadge status="pending" />);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge).toHaveClass('status-badge');
    expect(badge).toHaveClass('status-pending');
  });

  it('should show icon when requested', () => {
    const { container } = render(<StatusBadge status="completed" showIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should not show icon by default', () => {
    const { container } = render(<StatusBadge status="completed" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <StatusBadge status="pending" className="custom-class" />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('custom-class');
  });

  it('should show spinning icon for processing status', () => {
    const { container } = render(<StatusBadge status="processing" showIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('animate-spin');
  });

  it('should have proper flex layout when showing icon', () => {
    const { container } = render(<StatusBadge status="pending" showIcon />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('flex', 'items-center', 'gap-1');
  });
});