import React, { useMemo } from 'react';
import clsx from 'clsx';
import type { ContentItem } from '../../types';
import {
  formatFileSize,
  formatUrl,
  truncateText,
  getFileExtension,
} from '../../utils';
import { StatusBadge } from '../StatusBadge';
import { TypeBadge } from '../TypeBadge';
import { ToggleSwitch } from '../ToggleSwitch';
import { EmptyState } from '../EmptyState';

export interface ContentTableColumn {
  /** Column key */
  key: string;

  /** Column header text */
  header: string;

  /** Column width (CSS value) */
  width?: string;

  /** Whether column is sortable */
  sortable?: boolean;

  /** Custom render function */
  render?: (item: ContentItem) => React.ReactNode;

  /** CSS classes for the column */
  className?: string;
}

export interface ContentTableProps {
  /** Array of content items to display */
  items: ContentItem[];

  /** Loading state */
  loading?: boolean;

  /** Custom columns configuration */
  columns?: ContentTableColumn[];

  /** Callback when item is deleted */
  onDelete?: (item: ContentItem) => void;

  /** Callback when anonymize is toggled */
  onToggleAnonymize?: (item: ContentItem, anonymize: boolean) => void;

  /** Callback when item is selected */
  onSelect?: (item: ContentItem) => void;

  /** Whether to show selection checkboxes */
  selectable?: boolean;

  /** Selected item IDs */
  selectedIds?: Set<string>;

  /** Sort configuration */
  sort?: {
    key: string;
    direction: 'asc' | 'desc';
  };

  /** Callback when sort changes */
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;

  /** Empty state configuration */
  emptyState?: {
    title?: string;
    description?: string;
    action?: React.ReactNode;
  };

  /** Additional CSS classes */
  className?: string;

  /** Maximum height for the table */
  maxHeight?: string;
}

/**
 * Content table component for displaying content items
 */
export const ContentTable: React.FC<ContentTableProps> = ({
  items,
  loading = false,
  columns,
  onDelete,
  onToggleAnonymize,
  onSelect,
  selectable = false,
  selectedIds = new Set(),
  sort,
  onSortChange,
  emptyState,
  className,
  maxHeight = '400px',
}) => {
  const defaultColumns: ContentTableColumn[] = useMemo(() => [
    {
      key: 'name',
      header: 'Name',
      width: '35%',
      sortable: true,
      render: (item) => (
        <div className="flex flex-col gap-1">
          <div className="font-medium text-dark-text-primary">
            {item.type === 'url' ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-accent-primary hover:text-dark-accent-hover transition-colors"
                title={item.url}
              >
                {formatUrl(item.name, 50)}
              </a>
            ) : (
              <span title={item.name}>
                {truncateText(item.name, 50)}
              </span>
            )}
          </div>
          {item.type === 'file' && item.mimeType && (
            <div className="text-xs text-dark-text-secondary">
              {item.mimeType}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      width: '10%',
      sortable: true,
      render: (item) => (
        <TypeBadge
          type={item.type}
          showIcon
          fileExtension={item.type === 'file' ? getFileExtension(item.name) : undefined}
        />
      ),
    },
    {
      key: 'size',
      header: 'Size',
      width: '10%',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-dark-text-secondary">
          {item.size ? formatFileSize(item.size) : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '15%',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} showIcon />,
    },
    {
      key: 'anonymize',
      header: 'Anonymous',
      width: '15%',
      render: (item) => (
        <ToggleSwitch
          checked={item.anonymize}
          onChange={(checked) => onToggleAnonymize?.(item, checked)}
          label={`Toggle anonymization for ${item.name}`}
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '15%',
      className: 'text-center',
      render: (item) => (
        <div className="flex items-center justify-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="action-btn action-btn-delete"
              title={`Delete ${item.name}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ], [onDelete, onToggleAnonymize]);

  const displayColumns = columns || defaultColumns;

  const handleSort = (key: string) => {
    if (!onSortChange) return;

    const currentDirection = sort?.key === key ? sort.direction : 'desc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    onSortChange(key, newDirection);
  };

  const handleSelectItem = (item: ContentItem) => {
    if (selectable && onSelect) {
      onSelect(item);
    }
  };

  const getSortIcon = (columnKey: string) => {
    if (sort?.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-dark-text-muted" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
        </svg>
      );
    }

    return sort.direction === 'asc' ? (
      <svg className="w-4 h-4 text-dark-accent-primary" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM5 16a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-dark-accent-primary" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM7 12a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zM9 16a1 1 0 011-1h0a1 1 0 110 2h0a1 1 0 01-1-1z" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className={clsx('content-harvester', className)}>
        <div className="flex items-center justify-center py-12">
          <div className="spinner mr-3" />
          <span className="text-dark-text-secondary">Loading content...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={clsx('content-harvester', className)}>
        <EmptyState
          title={emptyState?.title}
          description={emptyState?.description}
          action={emptyState?.action}
        />
      </div>
    );
  }

  return (
    <div className={clsx('content-harvester', className)}>
      <div className="content-table-wrapper" style={{ maxHeight }}>
        <table className="content-table">
          <thead className="content-table-header">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-dark-border-primary bg-dark-bg-tertiary"
                    checked={selectedIds.size > 0 && selectedIds.size === items.length}
                    onChange={() => {
                      // Toggle all items
                      items.forEach(item => onSelect?.(item));
                    }}
                  />
                </th>
              )}

              {displayColumns.map((column) => (
                <th
                  key={column.key}
                  className={clsx(column.className)}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="flex items-center gap-2 text-left font-semibold hover:text-dark-text-primary transition-colors"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    <span className="font-semibold">{column.header}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="content-table-body">
            {items.map((item) => (
              <tr
                key={item.id}
                className={clsx(
                  'content-table-row',
                  selectable && 'cursor-pointer',
                  selectedIds.has(item.id) && 'bg-dark-accent-primary bg-opacity-10',
                )}
                onClick={() => handleSelectItem(item)}
              >
                {selectable && (
                  <td className="content-table-cell">
                    <input
                      type="checkbox"
                      className="rounded border-dark-border-primary bg-dark-bg-tertiary"
                      checked={selectedIds.has(item.id)}
                      onChange={() => onSelect?.(item)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}

                {displayColumns.map((column) => (
                  <td
                    key={column.key}
                    className={clsx('content-table-cell', column.className)}
                  >
                    {column.render ? column.render(item) : (
                      <span className="text-dark-text-primary">
                        {String(item[column.key as keyof ContentItem] || '—')}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
