import React from 'react';
import { render, screen } from '@testing-library/react';
import { TypeBadge } from '../../src/components/TypeBadge';

describe('TypeBadge', () => {
  it('should render type text correctly', () => {
    render(<TypeBadge type="url" />);
    expect(screen.getByText('URL')).toBeInTheDocument();
    
    render(<TypeBadge type="file" />);
    expect(screen.getByText('File')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<TypeBadge type="url" />);
    const badge = container.firstChild as HTMLElement;
    
    expect(badge).toHaveClass('type-badge');
    expect(badge).toHaveClass('type-url');
  });

  it('should show icon when requested', () => {
    const { container } = render(<TypeBadge type="file" showIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should show different icons for different file types', () => {
    const { container: imageContainer } = render(
      <TypeBadge type="file" showIcon fileExtension=".jpg" />
    );
    const { container: videoContainer } = render(
      <TypeBadge type="file" showIcon fileExtension=".mp4" />
    );
    
    const imageSvg = imageContainer.querySelector('svg');
    const videoSvg = videoContainer.querySelector('svg');
    
    expect(imageSvg).toBeInTheDocument();
    expect(videoSvg).toBeInTheDocument();
    // SVGs should be different (different paths/attributes)
    expect(imageSvg?.innerHTML).not.toBe(videoSvg?.innerHTML);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <TypeBadge type="file" className="custom-class" />
    );
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('custom-class');
  });

  it('should have proper flex layout when showing icon', () => {
    const { container } = render(<TypeBadge type="url" showIcon />);
    const badge = container.firstChild as HTMLElement;
    expect(badge).toHaveClass('flex', 'items-center', 'gap-1');
  });

  it('should show URL icon for URL type', () => {
    const { container } = render(<TypeBadge type="url" showIcon />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should show appropriate file type icons', () => {
    const fileTypes = [
      { ext: '.pdf', expected: 'document' },
      { ext: '.jpg', expected: 'image' },
      { ext: '.mp4', expected: 'video' },
      { ext: '.mp3', expected: 'audio' },
      { ext: '.zip', expected: 'archive' },
    ];

    fileTypes.forEach(({ ext }) => {
      const { container } = render(
        <TypeBadge type="file" showIcon fileExtension={ext} />
      );
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});