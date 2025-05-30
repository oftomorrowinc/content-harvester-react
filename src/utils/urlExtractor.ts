import type { UrlValidationResult, UrlConfig } from '../types';
import { DEFAULT_URL_CONFIG } from '../types';

/**
 * Extract URLs from text content
 * @param text - Text content to extract URLs from
 * @param config - URL configuration options
 * @returns Array of extracted URLs
 */
export function extractUrls(text: string, config: UrlConfig = DEFAULT_URL_CONFIG): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Split text into lines and trim whitespace
  const lines = text.split(/\r?\n/).map(line => line.trim());

  // Filter lines that start with allowed protocols
  const urlLines = lines.filter(line => {
    return config.allowedProtocols.some(protocol =>
      line.toLowerCase().startsWith(protocol),
    );
  });

  // Validate and filter URLs
  const validUrls: string[] = [];

  for (const urlLine of urlLines) {
    // Extract the first URL-like string from the line
    const urlMatch = urlLine.match(/^(https?:\/\/[^\s]+)/i);
    if (urlMatch) {
      const url = urlMatch[1];
      const validation = validateUrl(url, config);
      if (validation.isValid) {
        validUrls.push(validation.url);
      }
    }
  }

  // Remove duplicates
  return [...new Set(validUrls)];
}

/**
 * Validate a single URL
 * @param url - URL to validate
 * @param config - URL configuration options
 * @returns Validation result
 */
export function validateUrl(url: string, config: UrlConfig = DEFAULT_URL_CONFIG): UrlValidationResult {
  if (!url || typeof url !== 'string') {
    return {
      url,
      isValid: false,
      error: 'URL is required and must be a string',
    };
  }

  const trimmedUrl = url.trim();

  // Check if URL is empty after trimming
  if (!trimmedUrl) {
    return {
      url: trimmedUrl,
      isValid: false,
      error: 'URL cannot be empty',
    };
  }

  // Check URL length
  if (config.maxUrlLength && trimmedUrl.length > config.maxUrlLength) {
    return {
      url: trimmedUrl,
      isValid: false,
      error: `URL exceeds maximum length of ${config.maxUrlLength} characters`,
    };
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmedUrl);
  } catch (error) {
    return {
      url: trimmedUrl,
      isValid: false,
      error: 'Invalid URL format',
    };
  }

  // Check if protocol is allowed
  if (!config.allowedProtocols.includes(parsedUrl.protocol)) {
    return {
      url: trimmedUrl,
      isValid: false,
      error: `Protocol ${parsedUrl.protocol} is not allowed. Allowed protocols: ${config.allowedProtocols.join(', ')}`,
    };
  }

  // Check blocked domains
  if (config.blockedDomains && config.blockedDomains.length > 0) {
    const hostname = parsedUrl.hostname.toLowerCase();
    const isBlocked = config.blockedDomains.some(blockedDomain => {
      const normalizedBlocked = blockedDomain.toLowerCase();
      return hostname === normalizedBlocked || hostname.endsWith(`.${normalizedBlocked}`);
    });

    if (isBlocked) {
      return {
        url: trimmedUrl,
        isValid: false,
        error: `Domain ${parsedUrl.hostname} is blocked`,
      };
    }
  }

  // Check allowed domains (if specified)
  if (config.allowedDomains && config.allowedDomains.length > 0) {
    const hostname = parsedUrl.hostname.toLowerCase();
    const isAllowed = config.allowedDomains.some(allowedDomain => {
      const normalizedAllowed = allowedDomain.toLowerCase();
      return hostname === normalizedAllowed || hostname.endsWith(`.${normalizedAllowed}`);
    });

    if (!isAllowed) {
      return {
        url: trimmedUrl,
        isValid: false,
        error: `Domain ${parsedUrl.hostname} is not in the allowed domains list`,
      };
    }
  }

  // Normalize the URL (remove trailing slash, normalize case)
  const normalizedUrl = normalizeUrl(parsedUrl);

  return {
    url: normalizedUrl,
    isValid: true,
  };
}

/**
 * Normalize a URL for consistency
 * @param url - URL object to normalize
 * @returns Normalized URL string
 */
function normalizeUrl(url: URL): string {
  // Convert hostname to lowercase
  url.hostname = url.hostname.toLowerCase();

  // Remove default port numbers
  if ((url.protocol === 'http:' && url.port === '80') ||
      (url.protocol === 'https:' && url.port === '443')) {
    url.port = '';
  }

  // Remove trailing slash from pathname if it's just '/'
  if (url.pathname === '/') {
    url.pathname = '';
  }

  return url.toString();
}

/**
 * Check if a string appears to be a URL (quick check without full validation)
 * @param text - Text to check
 * @returns True if text looks like a URL
 */
export function looksLikeUrl(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const trimmed = text.trim();
  return /^https?:\/\//i.test(trimmed);
}

/**
 * Extract domain from a URL
 * @param url - URL string
 * @returns Domain name or null if invalid
 */
export function extractDomain(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch {
    return null;
  }
}

/**
 * Check if URL is reachable (basic check)
 * Note: This would typically use fetch() but we'll keep it simple for now
 * @param url - URL to check
 * @returns Promise resolving to true if reachable
 */
export async function isUrlReachable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
    });
    return response.ok || response.type === 'opaque';
  } catch {
    return false;
  }
}

/**
 * Batch validate multiple URLs
 * @param urls - Array of URLs to validate
 * @param config - URL configuration options
 * @returns Array of validation results
 */
export function validateUrls(urls: string[], config: UrlConfig = DEFAULT_URL_CONFIG): UrlValidationResult[] {
  return urls.map(url => validateUrl(url, config));
}

/**
 * Get URL metadata (title, description, etc.)
 * Note: This would typically involve scraping, but we'll keep it simple
 * @param url - URL to get metadata for
 * @returns Promise resolving to metadata object
 */
export async function getUrlMetadata(url: string): Promise<{
  title?: string;
  description?: string;
  image?: string;
  domain: string;
}> {
  const domain = extractDomain(url);

  // In a real implementation, this would fetch the page and parse meta tags
  // For now, we'll return basic metadata
  return {
    domain: domain || 'unknown',
    title: `Content from ${domain}`,
    description: `Content harvested from ${url}`,
  };
}

/**
 * Create a safe filename from a URL
 * @param url - URL to create filename from
 * @returns Safe filename string
 */
export function urlToFilename(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    const path = parsedUrl.pathname.replace(/\//g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    return `${domain}${path}_${timestamp}.url`;
  } catch {
    return `invalid_url_${Date.now()}.url`;
  }
}

/**
 * Check if URL is an image
 * @param url - URL to check
 * @returns True if URL appears to be an image
 */
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];

  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();
    return imageExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Check if URL is a video
 * @param url - URL to check
 * @returns True if URL appears to be a video
 */
export function isVideoUrl(url: string): boolean {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'];

  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();
    return videoExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

/**
 * Get content type hint from URL
 * @param url - URL to analyze
 * @returns Content type hint
 */
export function getContentTypeFromUrl(url: string): 'image' | 'video' | 'document' | 'unknown' {
  if (isImageUrl(url)) return 'image';
  if (isVideoUrl(url)) return 'video';

  const documentExtensions = ['.pdf', '.doc', '.docx', '.txt', '.md'];

  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();
    if (documentExtensions.some(ext => pathname.endsWith(ext))) {
      return 'document';
    }
  } catch {
    return 'unknown';
  }

  return 'unknown';
}
