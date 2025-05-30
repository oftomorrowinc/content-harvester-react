import {
  validateFile,
  validateFiles,
  getFileExtension,
  getFileTypeCategory,
  getFileTypeLabel,
  isImageFile,
  isVideoFile,
  isAudioFile,
  getMimeTypeFromExtension,
  sanitizeFilename,
  generateUniqueFilename,
} from '../../src/utils/fileValidator';
import { formatFileSize } from '../../src/utils/formatters';
import { DEFAULT_FILE_CONFIG } from '../../src/types';

// Helper to create mock File objects
const createMockFile = (name: string, size: number = 1000, type: string = 'text/plain') => {
  const file = new File(['content'], name, { type });
  Object.defineProperty(file, 'size', { value: size, writable: false });
  return file;
};

describe('fileValidator', () => {
  describe('validateFile', () => {
    it('should validate correct files', () => {
      const file = createMockFile('test.pdf', 1000, 'application/pdf');
      const result = validateFile(file);
      
      expect(result.isValid).toBe(true);
      expect(result.file).toBe(file);
      expect(result.extension).toBe('.pdf');
      expect(result.error).toBeUndefined();
    });

    it('should reject files without extensions', () => {
      const file = createMockFile('noextension');
      const result = validateFile(file);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must have an extension');
    });

    it('should reject blocked file types', () => {
      const file = createMockFile('virus.exe');
      const result = validateFile(file);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should reject files that are too large', () => {
      const file = createMockFile('large.pdf', 100 * 1024 * 1024); // 100MB
      const result = validateFile(file);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    it('should reject empty files', () => {
      const file = createMockFile('empty.txt', 0);
      const result = validateFile(file);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    it('should respect custom file config', () => {
      const config = {
        allowedExtensions: ['.txt'],
        blockedExtensions: [],
        maxFileSize: 500,
      };
      
      const validFile = createMockFile('test.txt', 400);
      const invalidTypeFile = createMockFile('test.pdf', 400);
      const tooLargeFile = createMockFile('test.txt', 600);
      
      expect(validateFile(validFile, config).isValid).toBe(true);
      expect(validateFile(invalidTypeFile, config).isValid).toBe(false);
      expect(validateFile(tooLargeFile, config).isValid).toBe(false);
    });

    it('should handle invalid file objects', () => {
      const result = validateFile(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid file object');
    });
  });

  describe('validateFiles', () => {
    it('should validate multiple files', () => {
      const files = [
        createMockFile('valid.pdf'),
        createMockFile('invalid.exe'),
        createMockFile('also-valid.txt'),
      ];
      
      const results = validateFiles(files);
      expect(results).toHaveLength(3);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
      expect(results[2].isValid).toBe(true);
    });

    it('should check total size limit', () => {
      const config = {
        ...DEFAULT_FILE_CONFIG,
        maxTotalSize: 2000,
      };
      
      const files = [
        createMockFile('file1.txt', 1000),
        createMockFile('file2.txt', 1500), // Total: 2500 > 2000
      ];
      
      const results = validateFiles(files, config);
      expect(results.every(r => !r.isValid)).toBe(true);
      expect(results[0].error).toContain('Total file size');
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extensions', () => {
      expect(getFileExtension('test.pdf')).toBe('.pdf');
      expect(getFileExtension('image.JPEG')).toBe('.jpeg');
      expect(getFileExtension('file.tar.gz')).toBe('.gz');
      expect(getFileExtension('noextension')).toBe('');
      expect(getFileExtension('ends-with-dot.')).toBe('');
      expect(getFileExtension('')).toBe('');
      expect(getFileExtension(null as any)).toBe('');
    });
  });

  describe('getFileTypeCategory', () => {
    it('should categorize file types', () => {
      expect(getFileTypeCategory('.jpg')).toBe('image');
      expect(getFileTypeCategory('.mp4')).toBe('video');
      expect(getFileTypeCategory('.mp3')).toBe('audio');
      expect(getFileTypeCategory('.pdf')).toBe('document');
      expect(getFileTypeCategory('.zip')).toBe('archive');
      expect(getFileTypeCategory('.js')).toBe('code');
      expect(getFileTypeCategory('.xyz')).toBe('other');
    });

    it('should handle extensions with or without dots', () => {
      expect(getFileTypeCategory('jpg')).toBe('image');
      expect(getFileTypeCategory('.jpg')).toBe('image');
    });
  });

  describe('getFileTypeLabel', () => {
    it('should provide user-friendly labels', () => {
      expect(getFileTypeLabel('.pdf')).toBe('PDF Document');
      expect(getFileTypeLabel('.jpg')).toBe('JPEG Image');
      expect(getFileTypeLabel('.mp4')).toBe('MP4 Video');
      expect(getFileTypeLabel('.xyz')).toBe('XYZ');
    });
  });

  describe('file type checkers', () => {
    it('should identify image files', () => {
      const imageFile = createMockFile('image.jpg');
      expect(isImageFile(imageFile)).toBe(true);
      expect(isImageFile('.png')).toBe(true);
      expect(isImageFile('.pdf')).toBe(false);
    });

    it('should identify video files', () => {
      const videoFile = createMockFile('video.mp4');
      expect(isVideoFile(videoFile)).toBe(true);
      expect(isVideoFile('.avi')).toBe(true);
      expect(isVideoFile('.jpg')).toBe(false);
    });

    it('should identify audio files', () => {
      const audioFile = createMockFile('audio.mp3');
      expect(isAudioFile(audioFile)).toBe(true);
      expect(isAudioFile('.wav')).toBe(true);
      expect(isAudioFile('.mp4')).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(512)).toBe('512 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB');
    });

    it('should handle edge cases', () => {
      expect(formatFileSize(null as any)).toBe('0 B');
      expect(formatFileSize(undefined as any)).toBe('0 B');
    });
  });

  describe('getMimeTypeFromExtension', () => {
    it('should return correct MIME types', () => {
      expect(getMimeTypeFromExtension('.pdf')).toBe('application/pdf');
      expect(getMimeTypeFromExtension('.jpg')).toBe('image/jpeg');
      expect(getMimeTypeFromExtension('.mp4')).toBe('video/mp4');
      expect(getMimeTypeFromExtension('.txt')).toBe('text/plain');
      expect(getMimeTypeFromExtension('.xyz')).toBe('application/octet-stream');
    });

    it('should handle extensions with or without dots', () => {
      expect(getMimeTypeFromExtension('pdf')).toBe('application/pdf');
      expect(getMimeTypeFromExtension('.pdf')).toBe('application/pdf');
    });
  });

  describe('sanitizeFilename', () => {
    it('should remove unsafe characters', () => {
      expect(sanitizeFilename('test<>file.txt')).toBe('test__file.txt');
      expect(sanitizeFilename('file|with:bad/chars.pdf')).toBe('file_with_bad_chars.pdf');
      expect(sanitizeFilename('  .file  ')).toBe('file');
    });

    it('should handle edge cases', () => {
      expect(sanitizeFilename('')).toBe('unnamed_file');
      expect(sanitizeFilename('...')).toBe('unnamed_file');
      expect(sanitizeFilename(null as any)).toBe('unnamed_file');
    });
  });

  describe('generateUniqueFilename', () => {
    it('should return original name if not in existing list', () => {
      const filename = generateUniqueFilename('test.txt', ['other.txt']);
      expect(filename).toBe('test.txt');
    });

    it('should generate unique name if conflicts exist', () => {
      const filename = generateUniqueFilename('test.txt', ['test.txt', 'test_1.txt']);
      expect(filename).toBe('test_2.txt');
    });

    it('should handle files without extensions', () => {
      const filename = generateUniqueFilename('test', ['test']);
      expect(filename).toBe('test_1');
    });
  });
});