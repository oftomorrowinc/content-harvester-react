import React from 'react';
import clsx from 'clsx';

export interface EmptyStateProps {
  /** Title for the empty state */
  title?: string;
  
  /** Description text */
  description?: string;
  
  /** Icon to display */
  icon?: React.ReactNode;
  
  /** Action button */
  action?: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Variant for different empty state types */
  variant?: 'default' | 'drop-zone' | 'no-results' | 'error';
}

/**
 * Empty state component for when there's no content to display
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
  variant = 'default',
}) => {
  const getDefaultContent = (variant: string) => {
    switch (variant) {
      case 'drop-zone':
        return {
          title: 'Drop files here',
          description: 'Drag and drop files or paste URLs to get started',
          icon: (
            <svg className="w-16 h-16 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          ),
        };
      case 'no-results':
        return {
          title: 'No content found',
          description: 'Try adjusting your search or filters',
          icon: (
            <svg className="w-16 h-16 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
        };
      case 'error':
        return {
          title: 'Something went wrong',
          description: 'An error occurred while loading content',
          icon: (
            <svg className="w-16 h-16 text-dark-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
        };
      default:
        return {
          title: 'No content yet',
          description: 'Start by adding some URLs or uploading files',
          icon: (
            <svg className="w-16 h-16 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        };
    }
  };

  const defaultContent = getDefaultContent(variant);
  const displayTitle = title ?? defaultContent.title;
  const displayDescription = description ?? defaultContent.description;
  const displayIcon = icon ?? defaultContent.icon;

  return (
    <div className={clsx('empty-state', className)}>
      <div className="empty-state-icon">
        {displayIcon}
      </div>
      
      {displayTitle && (
        <h3 className="empty-state-title">
          {displayTitle}
        </h3>
      )}
      
      {displayDescription && (
        <p className="empty-state-description">
          {displayDescription}
        </p>
      )}
      
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};