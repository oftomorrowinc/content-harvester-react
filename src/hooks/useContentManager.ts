import { useState, useCallback, useEffect } from 'react';
import type {
  ContentItem,
  CreateContentData,
  UpdateContentData,
  ContentQueryOptions,
  FileTypeConfig,
  UrlConfig,
} from '../types';
import { extractUrls, validateUrl, validateFiles } from '../utils';
import { UseFirebaseOperationsReturn } from './useFirebase';
import { useToast } from '../components/ToastProvider';

export interface UseContentManagerOptions {
  /** Firebase operations hook return */
  firebaseOps: UseFirebaseOperationsReturn | null;

  /** Whether Firebase is ready */
  firebaseReady?: boolean;

  /** File type configuration */
  fileConfig?: FileTypeConfig;

  /** URL configuration */
  urlConfig?: UrlConfig;

  /** Whether to auto-refresh content */
  autoRefresh?: boolean;

  /** Auto-refresh interval in milliseconds */
  refreshInterval?: number;

  /** Initial query options */
  initialQuery?: ContentQueryOptions;
}

export interface UseContentManagerReturn {
  /** Current content items */
  items: ContentItem[];

  /** Loading state */
  loading: boolean;

  /** Error state */
  error: string | null;

  /** Whether there are more items to load */
  hasMore: boolean;

  /** Add URLs from text */
  addUrls: (text: string) => Promise<void>;

  /** Add files */
  addFiles: (files: File[]) => Promise<void>;

  /** Update content item */
  updateItem: (id: string, data: UpdateContentData) => Promise<void>;

  /** Delete content item */
  deleteItem: (id: string) => Promise<void>;

  /** Toggle anonymization */
  toggleAnonymize: (id: string, anonymize: boolean) => Promise<void>;

  /** Refresh content list */
  refresh: () => Promise<void>;

  /** Load more content (pagination) */
  loadMore: () => Promise<void>;

  /** Update query options */
  updateQuery: (options: ContentQueryOptions) => Promise<void>;

  /** Clear all content */
  clear: () => void;

  /** Process all pending content */
  processAll: () => Promise<void>;

  /** Get content statistics */
  getStats: () => {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    totalFileSize: number;
  };
}

/**
 * Hook for managing content items with Firebase operations
 */
export const useContentManager = ({
  firebaseOps,
  firebaseReady = false,
  fileConfig,
  urlConfig,
  autoRefresh = false,
  refreshInterval = 30000,
  initialQuery,
}: UseContentManagerOptions): UseContentManagerReturn => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [queryOptions, setQueryOptions] = useState<ContentQueryOptions | undefined>(initialQuery);
  const { success, error: showError } = useToast();

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Initial load - wait for Firebase to be ready
  useEffect(() => {
    if (firebaseReady) {
      refresh();
    }
  }, [firebaseReady, queryOptions]);

  const refresh = useCallback(async () => {
    if (!firebaseReady || !firebaseOps) {
      // Don't show error if Firebase is just not ready yet
      if (!firebaseReady) {
        return;
      }
      setError('Firebase not initialized');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await firebaseOps.queryContent(queryOptions);
      setItems(result.items);
      setHasMore(result.hasMore);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
      setError(errorMessage);
      showError(`Failed to load content: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [firebaseReady, firebaseOps, queryOptions, showError]);

  const loadMore = useCallback(async () => {
    if (!firebaseOps) {
      setError('Firebase not initialized');
      return;
    }

    if (!hasMore || loading) return;

    try {
      setLoading(true);

      const lastItem = items[items.length - 1];
      const paginationOptions = {
        ...queryOptions,
        pagination: {
          ...queryOptions?.pagination,
          startAfter: lastItem?.id,
        },
      };

      const result = await firebaseOps.queryContent(paginationOptions);
      setItems(prev => [...prev, ...result.items]);
      setHasMore(result.hasMore);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more content';
      showError(`Failed to load more content: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [firebaseOps, queryOptions, items, hasMore, loading, showError]);

  const addUrls = useCallback(async (text: string) => {
    if (!firebaseOps) {
      setError('Firebase not initialized');
      return;
    }

    try {
      const urls = extractUrls(text, urlConfig);

      if (urls.length === 0) {
        // Check if the text looks like it might contain URLs but failed validation
        if (text.includes('http') || text.includes('www.')) {
          showError('No valid URLs found. Please check the format (must start with http:// or https://)');
        } else {
          showError('No URLs detected in the pasted text');
        }
        return;
      }

      // Check for duplicates against existing items
      const duplicateUrls: string[] = [];
      const newUrls: string[] = [];

      urls.forEach(url => {
        const validation = validateUrl(url, urlConfig);
        if (validation.isValid) {
          const existingItem = items.find(item =>
            item.type === 'url' && item.url === validation.url,
          );
          if (existingItem) {
            duplicateUrls.push(validation.url);
          } else {
            newUrls.push(validation.url);
          }
        }
      });

      // Show duplicate warning if any
      if (duplicateUrls.length > 0) {
        showError(`${duplicateUrls.length} URL${duplicateUrls.length > 1 ? 's' : ''} already exist${duplicateUrls.length === 1 ? 's' : ''} and ${duplicateUrls.length === 1 ? 'was' : 'were'} skipped`);
      }

      // Process only new URLs
      if (newUrls.length === 0) {
        if (duplicateUrls.length === 0) {
          showError('No valid URLs to add');
        }
        return;
      }

      const promises = newUrls.map(async (url) => {
        const validation = validateUrl(url, urlConfig);
        if (!validation.isValid) {
          throw new Error(`Invalid URL ${url}: ${validation.error}`);
        }

        const contentData: CreateContentData = {
          type: 'url',
          name: validation.url,
          url: validation.url,
        };

        return firebaseOps.createContent(contentData);
      });

      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected');

      if (failed.length > 0) {
        const errorMessages = failed.map(r =>
          r.status === 'rejected' ? r.reason.message : 'Unknown error',
        );
        showError(`Failed to add ${failed.length} URLs: ${errorMessages.join(', ')}`);
      }

      if (successful > 0) {
        success(`Successfully added ${successful} new URL${successful > 1 ? 's' : ''}`);
        await refresh();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add URLs';
      showError(`Failed to add URLs: ${errorMessage}`);
    }
  }, [firebaseOps, urlConfig, showError, success, refresh, items]);

  const addFiles = useCallback(async (files: File[]) => {
    if (!firebaseOps) {
      setError('Firebase not initialized');
      return;
    }

    try {
      const validationResults = validateFiles(files, fileConfig);
      const validFiles = validationResults
        .filter(result => result.isValid)
        .map(result => result.file);

      const invalidResults = validationResults.filter(result => !result.isValid);

      if (invalidResults.length > 0) {
        const errorMessages = invalidResults.map(result =>
          `${result.file.name}: ${result.error}`,
        );
        showError(`Invalid files: ${errorMessages.join(', ')}`);
      }

      if (validFiles.length === 0) {
        return;
      }

      // Check for duplicates by filename and size
      const duplicateFiles: File[] = [];
      const newFiles: File[] = [];

      validFiles.forEach(file => {
        const existingItem = items.find(item =>
          item.type === 'file' &&
          item.name === file.name &&
          item.size === file.size,
        );
        if (existingItem) {
          duplicateFiles.push(file);
        } else {
          newFiles.push(file);
        }
      });

      // Show duplicate warning if any
      if (duplicateFiles.length > 0) {
        const duplicateNames = duplicateFiles.map(f => f.name).join(', ');
        showError(`${duplicateFiles.length} file${duplicateFiles.length > 1 ? 's' : ''} already exist${duplicateFiles.length === 1 ? 's' : ''} and ${duplicateFiles.length === 1 ? 'was' : 'were'} skipped: ${duplicateNames}`);
      }

      // Process only new files
      if (newFiles.length === 0) {
        if (duplicateFiles.length === 0) {
          showError('No valid files to add');
        }
        return;
      }

      const promises = newFiles.map(async (file) => {
        // Upload file to storage
        const uploadResult = await firebaseOps.uploadFile(file);

        // Create content item
        const contentData: CreateContentData = {
          type: 'file',
          name: file.name,
          url: uploadResult.url,
          size: file.size,
          mimeType: file.type,
          storageRef: uploadResult.storageRef,
        };

        return firebaseOps.createContent(contentData);
      });

      const results = await Promise.allSettled(promises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected');

      if (failed.length > 0) {
        const errorMessages = failed.map(r =>
          r.status === 'rejected' ? r.reason.message : 'Unknown error',
        );
        showError(`Failed to upload ${failed.length} files: ${errorMessages.join(', ')}`);
      }

      if (successful > 0) {
        success(`Successfully uploaded ${successful} new file${successful > 1 ? 's' : ''}`);
        await refresh();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add files';
      showError(`Failed to add files: ${errorMessage}`);
    }
  }, [firebaseOps, fileConfig, showError, success, refresh, items]);

  const updateItem = useCallback(async (id: string, data: UpdateContentData) => {
    if (!firebaseOps) {
      setError('Firebase not initialized');
      return;
    }

    try {
      await firebaseOps.updateContent(id, data);

      // Update local state
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, ...data, updatedAt: new Date() } : item,
      ));

      success('Content updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update content';
      showError(`Failed to update content: ${errorMessage}`);
    }
  }, [firebaseOps, showError, success]);

  const deleteItem = useCallback(async (id: string) => {
    if (!firebaseOps) {
      setError('Firebase not initialized');
      return;
    }

    try {
      await firebaseOps.deleteContent(id);

      // Update local state
      setItems(prev => prev.filter(item => item.id !== id));

      success('Content deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete content';
      showError(`Failed to delete content: ${errorMessage}`);
    }
  }, [firebaseOps, showError, success]);

  const toggleAnonymize = useCallback(async (id: string, anonymize: boolean) => {
    await updateItem(id, { anonymize });
  }, [updateItem]);

  const updateQuery = useCallback(async (options: ContentQueryOptions) => {
    setQueryOptions(options);
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setError(null);
    setHasMore(false);
  }, []);

  const processAll = useCallback(async () => {
    try {
      const pendingItems = items.filter(item => item.status === 'pending');

      if (pendingItems.length === 0) {
        showError('No pending items to process');
        return;
      }

      // Update all pending items to processing status
      const promises = pendingItems.map(item =>
        updateItem(item.id, { status: 'processing' }),
      );

      await Promise.all(promises);

      success(`Started processing ${pendingItems.length} item${pendingItems.length > 1 ? 's' : ''}`);

      // In a real implementation, this would trigger cloud functions
      // For demo purposes, we'll simulate processing after a delay
      setTimeout(async () => {
        const processingPromises = pendingItems.map(item =>
          updateItem(item.id, { status: 'added' }),
        );

        await Promise.allSettled(processingPromises);
      }, 3000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process content';
      showError(`Failed to process content: ${errorMessage}`);
    }
  }, [items, updateItem, showError, success]);

  const getStats = useCallback(() => {
    const stats = {
      total: items.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      totalFileSize: 0,
    };

    items.forEach(item => {
      // Count by type
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;

      // Count by status
      stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;

      // Sum file sizes
      if (item.size) {
        stats.totalFileSize += item.size;
      }
    });

    return stats;
  }, [items]);

  return {
    items,
    loading,
    error,
    hasMore,
    addUrls,
    addFiles,
    updateItem,
    deleteItem,
    toggleAnonymize,
    refresh,
    loadMore,
    updateQuery,
    clear,
    processAll,
    getStats,
  };
};
