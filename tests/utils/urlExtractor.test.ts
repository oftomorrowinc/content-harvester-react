import {
  extractUrls,
  validateUrl,
  validateUrls,
  looksLikeUrl,
  extractDomain,
  isImageUrl,
  isVideoUrl,
  getContentTypeFromUrl,
} from '../../src/utils/urlExtractor';
import { DEFAULT_URL_CONFIG } from '../../src/types';

describe('urlExtractor', () => {
  describe('extractUrls', () => {
    it('should extract valid URLs from text', () => {
      const text = `
        Here are some URLs:
        https://example.com
        http://test.org/path
        Not a URL
        https://another-site.net/path?query=1
      `;
      
      const urls = extractUrls(text);
      expect(urls).toEqual([
        'https://example.com/',
        'http://test.org/path',
        'https://another-site.net/path?query=1',
      ]);
    });

    it('should handle empty or invalid input', () => {
      expect(extractUrls('')).toEqual([]);
      expect(extractUrls(null as any)).toEqual([]);
      expect(extractUrls(undefined as any)).toEqual([]);
    });

    it('should remove duplicates', () => {
      const text = `
        https://example.com
        https://example.com
        http://test.org
      `;
      
      const urls = extractUrls(text);
      expect(urls).toEqual([
        'https://example.com/',
        'http://test.org/',
      ]);
    });

    it('should respect custom URL config', () => {
      const config = {
        allowedProtocols: ['https:'],
        maxUrlLength: 20,
      };
      
      const text = `
        https://short.com
        http://blocked.com
        https://very-long-url-that-exceeds-limit.com
      `;
      
      const urls = extractUrls(text, config);
      expect(urls).toEqual(['https://short.com/']);
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      const result = validateUrl('https://example.com');
      expect(result.isValid).toBe(true);
      expect(result.url).toBe('https://example.com/');
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid URLs', () => {
      const result = validateUrl('not-a-url');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid URL format');
    });

    it('should reject URLs with disallowed protocols', () => {
      const result = validateUrl('ftp://example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Protocol ftp: is not allowed');
    });

    it('should respect blocked domains', () => {
      const config = {
        ...DEFAULT_URL_CONFIG,
        blockedDomains: ['blocked.com'],
      };
      
      const result = validateUrl('https://blocked.com', config);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Domain blocked.com is blocked');
    });

    it('should respect allowed domains', () => {
      const config = {
        ...DEFAULT_URL_CONFIG,
        allowedDomains: ['allowed.com'],
      };
      
      const validResult = validateUrl('https://allowed.com', config);
      expect(validResult.isValid).toBe(true);
      
      const invalidResult = validateUrl('https://other.com', config);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should check URL length', () => {
      const config = {
        ...DEFAULT_URL_CONFIG,
        maxUrlLength: 10,
      };
      
      const result = validateUrl('https://very-long-url.com', config);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum length');
    });

    it('should handle empty URLs', () => {
      expect(validateUrl('').isValid).toBe(false);
      expect(validateUrl('   ').isValid).toBe(false);
      expect(validateUrl(null as any).isValid).toBe(false);
    });
  });

  describe('validateUrls', () => {
    it('should validate multiple URLs', () => {
      const urls = [
        'https://valid.com',
        'invalid-url',
        'https://another-valid.com',
      ];
      
      const results = validateUrls(urls);
      expect(results).toHaveLength(3);
      expect(results[0].isValid).toBe(true);
      expect(results[1].isValid).toBe(false);
      expect(results[2].isValid).toBe(true);
    });
  });

  describe('looksLikeUrl', () => {
    it('should identify URL-like strings', () => {
      expect(looksLikeUrl('https://example.com')).toBe(true);
      expect(looksLikeUrl('http://test.org')).toBe(true);
      expect(looksLikeUrl('not a url')).toBe(false);
      expect(looksLikeUrl('')).toBe(false);
      expect(looksLikeUrl(null as any)).toBe(false);
    });
  });

  describe('extractDomain', () => {
    it('should extract domain from valid URLs', () => {
      expect(extractDomain('https://example.com/path')).toBe('example.com');
      expect(extractDomain('http://sub.domain.org:8080')).toBe('sub.domain.org');
    });

    it('should return null for invalid URLs', () => {
      expect(extractDomain('not-a-url')).toBe(null);
      expect(extractDomain('')).toBe(null);
    });
  });

  describe('isImageUrl', () => {
    it('should identify image URLs', () => {
      expect(isImageUrl('https://example.com/image.jpg')).toBe(true);
      expect(isImageUrl('https://example.com/image.png')).toBe(true);
      expect(isImageUrl('https://example.com/image.gif')).toBe(true);
      expect(isImageUrl('https://example.com/document.pdf')).toBe(false);
      expect(isImageUrl('invalid-url')).toBe(false);
    });
  });

  describe('isVideoUrl', () => {
    it('should identify video URLs', () => {
      expect(isVideoUrl('https://example.com/video.mp4')).toBe(true);
      expect(isVideoUrl('https://example.com/video.mov')).toBe(true);
      expect(isVideoUrl('https://example.com/video.avi')).toBe(true);
      expect(isVideoUrl('https://example.com/image.jpg')).toBe(false);
      expect(isVideoUrl('invalid-url')).toBe(false);
    });
  });

  describe('getContentTypeFromUrl', () => {
    it('should identify content types from URLs', () => {
      expect(getContentTypeFromUrl('https://example.com/image.jpg')).toBe('image');
      expect(getContentTypeFromUrl('https://example.com/video.mp4')).toBe('video');
      expect(getContentTypeFromUrl('https://example.com/document.pdf')).toBe('document');
      expect(getContentTypeFromUrl('https://example.com/unknown.xyz')).toBe('unknown');
      expect(getContentTypeFromUrl('invalid-url')).toBe('unknown');
    });
  });
});