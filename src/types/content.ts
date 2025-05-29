/**
 * Content item status enum
 */
export type ContentStatus = 'pending' | 'processing' | 'completed' | 'error';

/**
 * Content item type enum
 */
export type ContentType = 'url' | 'file';

/**
 * Core content item interface
 */
export interface ContentItem {
  /** Unique identifier for the content item */
  id: string;
  
  /** Type of content (URL or file) */
  type: ContentType;
  
  /** Display name (URL or filename) */
  name: string;
  
  /** URL for the content (original URL or download URL for files) */
  url?: string;
  
  /** File size in bytes (for files only) */
  size?: number;
  
  /** MIME type (for files only) */
  mimeType?: string;
  
  /** Current processing status */
  status: ContentStatus;
  
  /** Whether content should be processed anonymously */
  anonymize: boolean;
  
  /** Firebase Storage reference path (for files only) */
  storageRef?: string;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
  
  /** Error message if status is 'error' */
  error?: string;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Content item creation data (partial content item for creating new items)
 */
export interface CreateContentData {
  type: ContentType;
  name: string;
  url?: string;
  size?: number;
  mimeType?: string;
  anonymize?: boolean;
  storageRef?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Content item update data (partial content item for updates)
 */
export interface UpdateContentData {
  name?: string;
  url?: string;
  status?: ContentStatus;
  anonymize?: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * File upload result interface
 */
export interface FileUploadResult {
  /** Firebase Storage reference path */
  storageRef: string;
  
  /** Download URL for the file */
  url: string;
  
  /** Original filename */
  name: string;
  
  /** File size in bytes */
  size: number;
  
  /** MIME type */
  mimeType: string;
}

/**
 * URL validation result interface
 */
export interface UrlValidationResult {
  /** The validated URL */
  url: string;
  
  /** Whether the URL is valid */
  isValid: boolean;
  
  /** Error message if invalid */
  error?: string;
}

/**
 * File validation result interface
 */
export interface FileValidationResult {
  /** The file being validated */
  file: File;
  
  /** Whether the file is valid */
  isValid: boolean;
  
  /** Error message if invalid */
  error?: string;
  
  /** File extension */
  extension: string;
}

/**
 * Content filter options
 */
export interface ContentFilterOptions {
  /** Filter by content type */
  type?: ContentType;
  
  /** Filter by status */
  status?: ContentStatus;
  
  /** Search term for name/URL */
  search?: string;
  
  /** Date range filter */
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Content sort options
 */
export interface ContentSortOptions {
  /** Field to sort by */
  field: keyof ContentItem;
  
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  /** Number of items per page */
  limit: number;
  
  /** Starting point for pagination */
  startAfter?: string;
}

/**
 * Content query options
 */
export interface ContentQueryOptions {
  /** Filter options */
  filter?: ContentFilterOptions;
  
  /** Sort options */
  sort?: ContentSortOptions;
  
  /** Pagination options */
  pagination?: PaginationOptions;
}

/**
 * Content query result
 */
export interface ContentQueryResult {
  /** Array of content items */
  items: ContentItem[];
  
  /** Total count (if available) */
  totalCount?: number;
  
  /** Whether there are more items */
  hasMore: boolean;
  
  /** Last document ID for pagination */
  lastDocId?: string;
}

/**
 * Batch operation result
 */
export interface BatchOperationResult {
  /** Number of successful operations */
  successCount: number;
  
  /** Number of failed operations */
  errorCount: number;
  
  /** Array of error messages */
  errors: string[];
}

/**
 * Content stats interface
 */
export interface ContentStats {
  /** Total number of items */
  total: number;
  
  /** Count by type */
  byType: Record<ContentType, number>;
  
  /** Count by status */
  byStatus: Record<ContentStatus, number>;
  
  /** Total file size (in bytes) */
  totalFileSize: number;
}

/**
 * File type configuration
 */
export interface FileTypeConfig {
  /** Allowed file extensions (with dot, e.g., '.pdf') */
  allowedExtensions: string[];
  
  /** Blocked file extensions (with dot, e.g., '.exe') */
  blockedExtensions: string[];
  
  /** Maximum file size in bytes */
  maxFileSize: number;
  
  /** Maximum total size for all files in bytes */
  maxTotalSize?: number;
}

/**
 * URL configuration
 */
export interface UrlConfig {
  /** Allowed URL protocols */
  allowedProtocols: string[];
  
  /** Blocked domains */
  blockedDomains?: string[];
  
  /** Allowed domains (if specified, only these domains are allowed) */
  allowedDomains?: string[];
  
  /** Maximum URL length */
  maxUrlLength?: number;
}

/**
 * Content harvester configuration
 */
export interface ContentHarvesterConfig {
  /** Firestore collection name */
  collection: string;
  
  /** Firebase Storage bucket path */
  storagePath?: string;
  
  /** File type configuration */
  fileConfig?: FileTypeConfig;
  
  /** URL configuration */
  urlConfig?: UrlConfig;
  
  /** Whether to enable real-time updates */
  realTimeUpdates?: boolean;
  
  /** Maximum number of items to display */
  maxDisplayItems?: number;
}