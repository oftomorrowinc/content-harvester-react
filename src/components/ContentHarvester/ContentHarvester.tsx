import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ContentTable } from '../ContentTable';
import { DropZone } from '../DropZone';
import { EmptyState } from '../EmptyState';
import { useContentHarvester } from './ContentHarvesterProvider';
import { useContentManager } from '../../hooks';
import { extractUrls } from '../../utils';

export interface ContentHarvesterProps {
  /** Additional CSS classes */
  className?: string;
  
  /** Custom header content */
  header?: React.ReactNode;
  
  /** Custom footer content */
  footer?: React.ReactNode;
  
  /** Whether to show the URL input */
  showUrlInput?: boolean;
  
  /** Whether to show the file upload button */
  showFileUpload?: boolean;
  
  /** Whether to show the process all button */
  showProcessAll?: boolean;
  
  /** Maximum height for the content table */
  maxHeight?: string;
  
  /** Whether to enable real-time updates */
  realTimeUpdates?: boolean;
  
  /** Custom empty state */
  emptyState?: React.ReactNode;
  
  /** Callback when content is added */
  onContentAdded?: (count: number) => void;
  
  /** Callback when content is deleted */
  onContentDeleted?: (id: string) => void;
  
  /** Callback when content is updated */
  onContentUpdated?: (id: string) => void;
}

/**
 * Main Content Harvester component
 */
export const ContentHarvester: React.FC<ContentHarvesterProps> = ({
  className,
  header,
  footer,
  showUrlInput = true,
  showFileUpload = true,
  showProcessAll = true,
  maxHeight = '400px',
  realTimeUpdates = true,
  emptyState,
  onContentAdded,
  onContentDeleted,
  onContentUpdated,
}) => {
  const { firebaseOps, config, firebaseReady, firebaseLoading, firebaseError } = useContentHarvester();
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize content manager
  const contentManager = useMemo(() => {
    if (!firebaseOps) return null;
    
    return useContentManager({
      firebaseOps,
      fileConfig: config.fileConfig,
      urlConfig: config.urlConfig,
      autoRefresh: realTimeUpdates,
      refreshInterval: 10000, // 10 seconds
    });
  }, [firebaseOps, config, realTimeUpdates]);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contentManager || !urlInput.trim()) return;
    
    const urls = extractUrls(urlInput, config.urlConfig);
    if (urls.length === 0) return;
    
    await contentManager.addUrls(urlInput);
    setUrlInput('');
    onContentAdded?.(urls.length);
  };

  const handleFilesDropped = async (files: File[]) => {
    if (!contentManager) return;
    
    await contentManager.addFiles(files);
    onContentAdded?.(files.length);
  };

  const handleUrlsPasted = async (text: string) => {
    if (!contentManager) return;
    
    const urls = extractUrls(text, config.urlConfig);
    if (urls.length === 0) return;
    
    await contentManager.addUrls(text);
    onContentAdded?.(urls.length);
  };

  const handleDeleteItem = async (item: any) => {
    if (!contentManager) return;
    
    await contentManager.deleteItem(item.id);
    onContentDeleted?.(item.id);
  };

  const handleToggleAnonymize = async (item: any, anonymize: boolean) => {
    if (!contentManager) return;
    
    await contentManager.toggleAnonymize(item.id, anonymize);
    onContentUpdated?.(item.id);
  };

  const handleProcessAll = async () => {
    if (!contentManager) return;
    
    setIsProcessing(true);
    try {
      await contentManager.processAll();
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading state
  if (firebaseLoading) {
    return (
      <div className={clsx('content-harvester', className)}>
        <div className="flex items-center justify-center py-12">
          <div className="spinner mr-3" />
          <span className="text-dark-text-secondary">Initializing Firebase...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (firebaseError) {
    return (
      <div className={clsx('content-harvester', className)}>
        <EmptyState
          variant="error"
          title="Firebase Error"
          description={firebaseError}
        />
      </div>
    );
  }

  // Not ready state
  if (!firebaseReady || !contentManager) {
    return (
      <div className={clsx('content-harvester', className)}>
        <EmptyState
          title="Not Ready"
          description="Content Harvester is not ready yet"
        />
      </div>
    );
  }

  const stats = contentManager.getStats();
  const hasContent = contentManager.items.length > 0;
  const hasPendingContent = stats.byStatus.pending > 0;

  return (
    <div className={clsx('content-harvester p-6', className)}>
      {/* Header */}
      {header || (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-dark-text-primary mb-1">
                Content Harvester
              </h2>
              <p className="text-dark-text-secondary">
                {stats.total > 0 ? (
                  `${stats.total} items • ${Object.values(stats.byStatus).reduce((a, b) => a + b, 0)} total`
                ) : (
                  'Collect content from URLs and files'
                )}
              </p>
            </div>
            
            {showUrlInput && (
              <form onSubmit={handleUrlSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste URLs here..."
                  className="form-input w-80"
                />
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="btn btn-primary px-4 py-2"
                >
                  Add URLs
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="space-y-6">
        {hasContent ? (
          <ContentTable
            items={contentManager.items}
            loading={contentManager.loading}
            onDelete={handleDeleteItem}
            onToggleAnonymize={handleToggleAnonymize}
            maxHeight={maxHeight}
            emptyState={{
              title: 'No content yet',
              description: 'Start by adding URLs or uploading files',
            }}
          />
        ) : (
          <DropZone
            onFilesDropped={handleFilesDropped}
            onUrlsPasted={handleUrlsPasted}
            fileConfig={config.fileConfig}
            showFileInput={showFileUpload}
            fileInputText="Choose Files"
            emptyState={emptyState}
            className="min-h-64"
          />
        )}

        {/* Actions */}
        {hasContent && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showFileUpload && (
                <DropZone
                  onFilesDropped={handleFilesDropped}
                  onUrlsPasted={showUrlInput ? handleUrlsPasted : undefined}
                  fileConfig={config.fileConfig}
                  showFileInput
                  fileInputText="Add More Files"
                  className="inline-block"
                />
              )}
              
              <button
                type="button"
                onClick={contentManager.refresh}
                disabled={contentManager.loading}
                className="btn btn-secondary px-4 py-2"
              >
                {contentManager.loading ? (
                  <>
                    <div className="spinner mr-2" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh'
                )}
              </button>
            </div>

            {showProcessAll && hasPendingContent && (
              <button
                type="button"
                onClick={handleProcessAll}
                disabled={isProcessing}
                className="btn btn-primary px-6 py-2"
              >
                {isProcessing ? (
                  <>
                    <div className="spinner mr-2" />
                    Processing...
                  </>
                ) : (
                  `Process ${stats.byStatus.pending} Item${stats.byStatus.pending > 1 ? 's' : ''}`
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {footer}
    </div>
  );
};