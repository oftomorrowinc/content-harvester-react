// Main exports
export { ContentHarvester, ContentHarvesterProvider, useContentHarvester } from './components/ContentHarvester';
export type {
  ContentHarvesterProps,
  ContentHarvesterProviderProps,
  ContentHarvesterContextValue,
} from './components/ContentHarvester';

// Component exports
export {
  ContentTable,
  DropZone,
  EmptyState,
  StatusBadge,
  TypeBadge,
  ToggleSwitch,
  ToastProvider,
  useToast,
  SimpleToast,
} from './components';
export type {
  ContentTableProps,
  ContentTableColumn,
  DropZoneProps,
  EmptyStateProps,
  StatusBadgeProps,
  TypeBadgeProps,
  ToggleSwitchProps,
  ToastProviderProps,
  ToastContextValue,
  SimpleToastProps,
} from './components';

// Hook exports
export {
  useFirebase,
  useFirebaseOperations,
  useContentManager,
  useDragDrop,
} from './hooks';
export type {
  UseFirebaseOptions,
  UseFirebaseReturn,
  UseFirebaseOperationsOptions,
  UseFirebaseOperationsReturn,
  UseContentManagerOptions,
  UseContentManagerReturn,
  UseDragDropOptions,
  UseDragDropReturn,
} from './hooks';

// Utility exports
export {
  extractUrls,
  validateUrl,
  validateUrls,
  looksLikeUrl,
  extractDomain,
  isUrlReachable,
  getUrlMetadata,
  urlToFilename,
  isImageUrl,
  isVideoUrl,
  getContentTypeFromUrl,
  validateFile,
  validateFiles,
  getFileExtension,
  getFileTypeCategory,
  getFileTypeLabel,
  isImageFile,
  isVideoFile,
  isAudioFile,
  formatFileSize,
  getMimeTypeFromExtension,
  sanitizeFilename,
  generateUniqueFilename,
  formatDate,
  formatRelativeTime,
  formatStatus,
  getStatusColorClass,
  formatContentType,
  getContentTypeColorClass,
  truncateText,
  formatUrl,
  formatPercentage,
  formatNumber,
  capitalizeWords,
  camelToReadable,
  formatDuration,
  generateInitials,
  formatError,
  pluralize,
  formatCount,
} from './utils';

// Type exports
export type {
  ContentStatus,
  ContentType,
  ContentItem,
  CreateContentData,
  UpdateContentData,
  FileUploadResult,
  UrlValidationResult,
  FileValidationResult,
  ContentFilterOptions,
  ContentSortOptions,
  PaginationOptions,
  ContentQueryOptions,
  ContentQueryResult,
  BatchOperationResult,
  ContentStats,
  FileTypeConfig,
  UrlConfig,
  ContentHarvesterConfig,
  FirebaseConfig,
  FirebaseEmulatorConfig,
  CompleteFirebaseConfig,
  FirebaseServices,
  FirebaseInitOptions,
  FirebaseErrorCode,
  FirebaseError,
  DocumentPath,
  CollectionPath,
  StoragePath,
  FirebaseTimestamp,
  QueryConstraintType,
  WhereFilterOp,
  OrderByDirection,
  UploadProgress,
  UploadTask,
  StorageUploadOptions,
} from './types';

// Constants
export {
  DEFAULT_EMULATOR_CONFIG,
  DEFAULT_FILE_CONFIG,
  DEFAULT_URL_CONFIG,
} from './types';
