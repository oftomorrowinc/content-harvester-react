import type { ContentStatus, ContentType } from '../types';

/**
 * Format a date for display
 * @param date - Date to format
 * @param format - Format type
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' | 'time' = 'short'): string {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();

  switch (format) {
    case 'relative':
      return formatRelativeTime(diff);

    case 'time':
      return dateObj.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });

    case 'long':
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    case 'short':
    default:
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
}

/**
 * Format relative time (e.g., "2 minutes ago")
 * @param diffMs - Time difference in milliseconds
 * @returns Relative time string
 */
export function formatRelativeTime(diffMs: number): string {
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return seconds <= 5 ? 'just now' : `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (days < 7) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (weeks < 4) {
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (months < 12) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
}

/**
 * Format file size in human-readable format
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes < 0) return 'Invalid size';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  // Don't show decimals for bytes
  const displayDecimals = i === 0 ? 0 : dm;
  return `${size.toFixed(displayDecimals)} ${sizes[i]}`;
}

/**
 * Format content status for display
 * @param status - Content status
 * @returns Formatted status string
 */
export function formatStatus(status: ContentStatus): string {
  const statusMap: Record<ContentStatus, string> = {
    pending: 'Pending',
    added: 'Added',
    processing: 'Processing',
    completed: 'Completed',
    error: 'Error',
  };

  return statusMap[status] || status;
}

/**
 * Get status color class for styling
 * @param status - Content status
 * @returns CSS class name for status color
 */
export function getStatusColorClass(status: ContentStatus): string {
  const colorMap: Record<ContentStatus, string> = {
    pending: 'status-pending',
    added: 'status-added',
    processing: 'status-processing',
    completed: 'status-completed',
    error: 'status-error',
  };

  return colorMap[status] || 'status-pending';
}

/**
 * Format content type for display
 * @param type - Content type
 * @returns Formatted type string
 */
export function formatContentType(type: ContentType): string {
  const typeMap: Record<ContentType, string> = {
    url: 'URL',
    file: 'File',
  };

  return typeMap[type] || type;
}

/**
 * Get content type color class for styling
 * @param type - Content type
 * @returns CSS class name for type color
 */
export function getContentTypeColorClass(type: ContentType): string {
  const colorMap: Record<ContentType, string> = {
    url: 'type-url',
    file: 'type-file',
  };

  return colorMap[type] || 'type-file';
}

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param ellipsis - Ellipsis string to append
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Format URL for display (truncate long URLs)
 * @param url - URL to format
 * @param maxLength - Maximum length
 * @returns Formatted URL
 */
export function formatUrl(url: string, maxLength: number = 50): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;

    if (url.length <= maxLength) {
      return url;
    }

    // Try to show domain + truncated path
    const domainPart = `${urlObj.protocol}//${domain}`;
    const remainingLength = maxLength - domainPart.length - 3; // 3 for "..."

    if (remainingLength > 0 && path.length > 0) {
      const truncatedPath = path.length > remainingLength
        ? '...' + path.slice(-remainingLength)
        : path;
      return domainPart + truncatedPath;
    }

    return truncateText(url, maxLength);
  } catch {
    return truncateText(url, maxLength);
  }
}

/**
 * Format percentage
 * @param value - Value to format as percentage (0-1 or 0-100)
 * @param isDecimal - Whether value is decimal (0-1) or percentage (0-100)
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, isDecimal: boolean = true, decimals: number = 1): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }

  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format number with thousands separators
 * @param num - Number to format
 * @param locale - Locale for formatting
 * @returns Formatted number string
 */
export function formatNumber(num: number, locale?: string): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }

  return num.toLocaleString(locale);
}

/**
 * Capitalize first letter of each word
 * @param text - Text to capitalize
 * @returns Capitalized text
 */
export function capitalizeWords(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text.replace(/\b\w/g, letter => letter.toUpperCase());
}

/**
 * Convert camelCase or PascalCase to readable text
 * @param text - Text to convert
 * @returns Readable text
 */
export function camelToReadable(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Format duration in milliseconds to human-readable format
 * @param ms - Duration in milliseconds
 * @returns Human-readable duration
 */
export function formatDuration(ms: number): string {
  if (typeof ms !== 'number' || ms < 0) {
    return '0ms';
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else if (seconds > 0) {
    return `${seconds}s`;
  } else {
    return `${ms}ms`;
  }
}

/**
 * Generate initials from a name or text
 * @param text - Text to generate initials from
 * @param maxLength - Maximum number of initials
 * @returns Initials string
 */
export function generateInitials(text: string, maxLength: number = 2): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const words = text.trim().split(/\s+/);
  const initials = words
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('');

  return initials;
}

/**
 * Format error message for display
 * @param error - Error object or string
 * @returns User-friendly error message
 */
export function formatError(error: unknown): string {
  if (!error) {
    return 'An unknown error occurred';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message || 'An error occurred';
  }

  if (typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }

  return 'An unknown error occurred';
}

/**
 * Pluralize a word based on count
 * @param count - Number to check
 * @param singular - Singular form of the word
 * @param plural - Plural form of the word (optional, defaults to singular + 's')
 * @returns Pluralized word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return singular;
  }

  return plural || `${singular}s`;
}

/**
 * Format count with word (e.g., "1 item", "5 items")
 * @param count - Number to format
 * @param singular - Singular form of the word
 * @param plural - Plural form of the word
 * @returns Formatted count with word
 */
export function formatCount(count: number, singular: string, plural?: string): string {
  return `${formatNumber(count)} ${pluralize(count, singular, plural)}`;
}
