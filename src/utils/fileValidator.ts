import type { FileValidationResult, FileTypeConfig } from '../types';
import { DEFAULT_FILE_CONFIG } from '../types';
import { formatFileSize } from './formatters';

/**
 * Validate a single file
 * @param file - File to validate
 * @param config - File type configuration
 * @returns Validation result
 */
export function validateFile(file: File, config: FileTypeConfig = DEFAULT_FILE_CONFIG): FileValidationResult {
  if (!file || !(file instanceof File)) {
    return {
      file,
      isValid: false,
      error: 'Invalid file object',
      extension: '',
    };
  }

  const extension = getFileExtension(file.name);

  // Check if file has an extension
  if (!extension) {
    return {
      file,
      isValid: false,
      error: 'File must have an extension',
      extension: '',
    };
  }

  // Check if extension is blocked
  if (config.blockedExtensions.includes(extension)) {
    return {
      file,
      isValid: false,
      error: `File type ${extension} is not allowed`,
      extension,
    };
  }

  // Check if extension is allowed (if allowedExtensions is specified)
  if (config.allowedExtensions.length > 0 && !config.allowedExtensions.includes(extension)) {
    return {
      file,
      isValid: false,
      error: `File type ${extension} is not in the allowed list`,
      extension,
    };
  }

  // Check file size
  if (file.size > config.maxFileSize) {
    return {
      file,
      isValid: false,
      error: `File size ${formatFileSize(file.size)} exceeds maximum allowed size of ${formatFileSize(config.maxFileSize)}`,
      extension,
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      file,
      isValid: false,
      error: 'File cannot be empty',
      extension,
    };
  }

  return {
    file,
    isValid: true,
    extension,
  };
}

/**
 * Validate multiple files
 * @param files - Array of files to validate
 * @param config - File type configuration
 * @returns Array of validation results
 */
export function validateFiles(files: File[], config: FileTypeConfig = DEFAULT_FILE_CONFIG): FileValidationResult[] {
  const results = files.map(file => validateFile(file, config));

  // Check total size if specified
  if (config.maxTotalSize !== undefined) {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > config.maxTotalSize) {
      // Mark all files as invalid if total size exceeds limit
      return results.map(result => ({
        ...result,
        isValid: false,
        error: `Total file size ${formatFileSize(totalSize)} exceeds maximum allowed total size of ${formatFileSize(config.maxTotalSize!)}`,
      }));
    }
  }

  return results;
}

/**
 * Get file extension from filename (with dot)
 * @param filename - Filename to extract extension from
 * @returns File extension with dot (e.g., '.pdf') or empty string
 */
export function getFileExtension(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return '';
  }

  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }

  return filename.slice(lastDotIndex).toLowerCase();
}

/**
 * Get file type category from extension
 * @param extension - File extension (with or without dot)
 * @returns File type category
 */
export function getFileTypeCategory(extension: string): 'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'other' {
  const normalizedExt = extension.startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`;

  const imageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.tiff', '.tif'];
  const videoTypes = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.m4v', '.3gp'];
  const audioTypes = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.wma'];
  const documentTypes = ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf', '.odt', '.pages', '.tex'];
  const archiveTypes = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'];
  const codeTypes = ['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.json', '.xml', '.yaml', '.yml'];

  if (imageTypes.includes(normalizedExt)) return 'image';
  if (videoTypes.includes(normalizedExt)) return 'video';
  if (audioTypes.includes(normalizedExt)) return 'audio';
  if (documentTypes.includes(normalizedExt)) return 'document';
  if (archiveTypes.includes(normalizedExt)) return 'archive';
  if (codeTypes.includes(normalizedExt)) return 'code';

  return 'other';
}

/**
 * Get user-friendly file type label
 * @param extension - File extension
 * @returns User-friendly label
 */
export function getFileTypeLabel(extension: string): string {
  const normalizedExt = extension.startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`;

  const labels: Record<string, string> = {
    // Images
    '.jpg': 'JPEG Image',
    '.jpeg': 'JPEG Image',
    '.png': 'PNG Image',
    '.gif': 'GIF Image',
    '.webp': 'WebP Image',
    '.svg': 'SVG Image',
    '.bmp': 'Bitmap Image',
    '.ico': 'Icon',
    '.tiff': 'TIFF Image',
    '.tif': 'TIFF Image',

    // Videos
    '.mp4': 'MP4 Video',
    '.mov': 'QuickTime Video',
    '.avi': 'AVI Video',
    '.mkv': 'Matroska Video',
    '.webm': 'WebM Video',
    '.flv': 'Flash Video',
    '.wmv': 'Windows Media Video',
    '.m4v': 'iTunes Video',
    '.3gp': '3GP Video',

    // Audio
    '.mp3': 'MP3 Audio',
    '.wav': 'WAV Audio',
    '.m4a': 'M4A Audio',
    '.aac': 'AAC Audio',
    '.ogg': 'OGG Audio',
    '.flac': 'FLAC Audio',
    '.wma': 'Windows Media Audio',

    // Documents
    '.pdf': 'PDF Document',
    '.doc': 'Word Document',
    '.docx': 'Word Document',
    '.txt': 'Text File',
    '.md': 'Markdown',
    '.rtf': 'Rich Text',
    '.odt': 'OpenDocument Text',
    '.pages': 'Pages Document',
    '.tex': 'LaTeX Document',

    // Archives
    '.zip': 'ZIP Archive',
    '.rar': 'RAR Archive',
    '.7z': '7-Zip Archive',
    '.tar': 'TAR Archive',
    '.gz': 'Gzip Archive',
    '.bz2': 'Bzip2 Archive',
    '.xz': 'XZ Archive',

    // Code
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.jsx': 'React JSX',
    '.tsx': 'React TSX',
    '.html': 'HTML',
    '.css': 'CSS',
    '.json': 'JSON',
    '.xml': 'XML',
    '.yaml': 'YAML',
    '.yml': 'YAML',

    // Office
    '.xlsx': 'Excel Spreadsheet',
    '.xls': 'Excel Spreadsheet',
    '.ppt': 'PowerPoint',
    '.pptx': 'PowerPoint',
    '.csv': 'CSV File',
  };

  return labels[normalizedExt] || normalizedExt.toUpperCase().slice(1);
}

/**
 * Check if file type is an image
 * @param file - File or extension to check
 * @returns True if file is an image
 */
export function isImageFile(file: File | string): boolean {
  const extension = typeof file === 'string' ? file : getFileExtension(file.name);
  return getFileTypeCategory(extension) === 'image';
}

/**
 * Check if file type is a video
 * @param file - File or extension to check
 * @returns True if file is a video
 */
export function isVideoFile(file: File | string): boolean {
  const extension = typeof file === 'string' ? file : getFileExtension(file.name);
  return getFileTypeCategory(extension) === 'video';
}

/**
 * Check if file type is an audio file
 * @param file - File or extension to check
 * @returns True if file is audio
 */
export function isAudioFile(file: File | string): boolean {
  const extension = typeof file === 'string' ? file : getFileExtension(file.name);
  return getFileTypeCategory(extension) === 'audio';
}


/**
 * Get MIME type from file extension
 * @param extension - File extension
 * @returns MIME type string
 */
export function getMimeTypeFromExtension(extension: string): string {
  const normalizedExt = extension.startsWith('.') ? extension.toLowerCase() : `.${extension.toLowerCase()}`;

  const mimeTypes: Record<string, string> = {
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',

    // Videos
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.webm': 'video/webm',
    '.flv': 'video/x-flv',
    '.wmv': 'video/x-ms-wmv',
    '.m4v': 'video/x-m4v',
    '.3gp': 'video/3gpp',

    // Audio
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.m4a': 'audio/m4a',
    '.aac': 'audio/aac',
    '.ogg': 'audio/ogg',
    '.flac': 'audio/flac',
    '.wma': 'audio/x-ms-wma',

    // Documents
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.rtf': 'application/rtf',
    '.odt': 'application/vnd.oasis.opendocument.text',
    '.pages': 'application/vnd.apple.pages',
    '.tex': 'application/x-latex',

    // Archives
    '.zip': 'application/zip',
    '.rar': 'application/vnd.rar',
    '.7z': 'application/x-7z-compressed',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',
    '.bz2': 'application/x-bzip2',
    '.xz': 'application/x-xz',

    // Code
    '.js': 'text/javascript',
    '.ts': 'text/typescript',
    '.jsx': 'text/jsx',
    '.tsx': 'text/tsx',
    '.html': 'text/html',
    '.css': 'text/css',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.yaml': 'application/x-yaml',
    '.yml': 'application/x-yaml',

    // Office
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.csv': 'text/csv',
  };

  return mimeTypes[normalizedExt] || 'application/octet-stream';
}

/**
 * Create a safe filename from any string
 * @param filename - Original filename
 * @returns Safe filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'unnamed_file';
  }

  // Remove path separators and other unsafe characters
  const unsafe = /[<>:"/\\|?*\u0000-\u001f]/g;
  const sanitized = filename.replace(unsafe, '_');

  // Trim periods and spaces from start and end
  const trimmed = sanitized.replace(/^[.\s]+|[.\s]+$/g, '');

  // Ensure filename is not empty after sanitization
  return trimmed || 'unnamed_file';
}

/**
 * Generate a unique filename to avoid conflicts
 * @param filename - Original filename
 * @param existingNames - Array of existing filenames to avoid
 * @returns Unique filename
 */
export function generateUniqueFilename(filename: string, existingNames: string[] = []): string {
  const sanitized = sanitizeFilename(filename);

  if (!existingNames.includes(sanitized)) {
    return sanitized;
  }

  const extension = getFileExtension(sanitized);
  const nameWithoutExt = extension ? sanitized.slice(0, -extension.length) : sanitized;

  let counter = 1;
  let uniqueName: string;

  do {
    uniqueName = `${nameWithoutExt}_${counter}${extension}`;
    counter++;
  } while (existingNames.includes(uniqueName));

  return uniqueName;
}
