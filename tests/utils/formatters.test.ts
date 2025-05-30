import {
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
} from '../../src/utils/formatters';

describe('formatters', () => {
  describe('formatDate', () => {
    const testDate = new Date('2023-12-01T10:30:00Z');

    it('should format dates in different formats', () => {
      expect(formatDate(testDate, 'short')).toMatch(/Dec.*2023/);
      expect(formatDate(testDate, 'long')).toMatch(/December.*2023.*10:30/);
      expect(formatDate(testDate, 'time')).toMatch(/10:30/);
    });

    it('should handle invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Invalid date');
      expect(formatDate(new Date('invalid'))).toBe('Invalid date');
    });

    it('should format relative time', () => {
      const now = new Date();
      const result = formatDate(now, 'relative');
      expect(result).toContain('now');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format different time intervals', () => {
      expect(formatRelativeTime(1000)).toBe('just now'); // 1 second
      expect(formatRelativeTime(30 * 1000)).toBe('30 seconds ago');
      expect(formatRelativeTime(60 * 1000)).toBe('1 minute ago');
      expect(formatRelativeTime(2 * 60 * 1000)).toBe('2 minutes ago');
      expect(formatRelativeTime(60 * 60 * 1000)).toBe('1 hour ago');
      expect(formatRelativeTime(24 * 60 * 60 * 1000)).toBe('1 day ago');
      expect(formatRelativeTime(7 * 24 * 60 * 60 * 1000)).toBe('1 week ago');
    });
  });

  describe('formatStatus', () => {
    it('should format all status types', () => {
      expect(formatStatus('pending')).toBe('Pending');
      expect(formatStatus('processing')).toBe('Processing');
      expect(formatStatus('completed')).toBe('Completed');
      expect(formatStatus('error')).toBe('Error');
    });
  });

  describe('getStatusColorClass', () => {
    it('should return correct CSS classes for statuses', () => {
      expect(getStatusColorClass('pending')).toBe('status-pending');
      expect(getStatusColorClass('processing')).toBe('status-processing');
      expect(getStatusColorClass('completed')).toBe('status-completed');
      expect(getStatusColorClass('error')).toBe('status-error');
    });
  });

  describe('formatContentType', () => {
    it('should format content types', () => {
      expect(formatContentType('url')).toBe('URL');
      expect(formatContentType('file')).toBe('File');
    });
  });

  describe('getContentTypeColorClass', () => {
    it('should return correct CSS classes for content types', () => {
      expect(getContentTypeColorClass('url')).toBe('type-url');
      expect(getContentTypeColorClass('file')).toBe('type-file');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is...');
      expect(truncateText('Short', 10)).toBe('Short');
      expect(truncateText('', 10)).toBe('');
      expect(truncateText(null as any, 10)).toBe('');
    });

    it('should use custom ellipsis', () => {
      expect(truncateText('Long text here', 8, '---')).toBe('Long---');
    });
  });

  describe('formatUrl', () => {
    it('should format long URLs', () => {
      const longUrl = 'https://very-long-domain-name.com/very/long/path/with/many/segments';
      const formatted = formatUrl(longUrl, 30);
      expect(formatted.length).toBeLessThanOrEqual(30);
      expect(formatted).toContain('https://very-long-domain-name.com');
    });

    it('should return short URLs unchanged', () => {
      const shortUrl = 'https://short.com';
      expect(formatUrl(shortUrl, 50)).toBe(shortUrl);
    });

    it('should handle invalid URLs', () => {
      expect(formatUrl('invalid-url', 20)).toBe('invalid-url');
      expect(formatUrl('', 20)).toBe('');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(0.5)).toBe('50.0%');
      expect(formatPercentage(50, false)).toBe('50.0%');
      expect(formatPercentage(0.123, true, 2)).toBe('12.30%');
      expect(formatPercentage(NaN)).toBe('0%');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with thousands separators', () => {
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(NaN)).toBe('0');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize first letter of each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('test-case here')).toBe('Test-Case Here');
      expect(capitalizeWords('')).toBe('');
      expect(capitalizeWords(null as any)).toBe('');
    });
  });

  describe('camelToReadable', () => {
    it('should convert camelCase to readable text', () => {
      expect(camelToReadable('camelCaseText')).toBe('Camel Case Text');
      expect(camelToReadable('PascalCaseText')).toBe('Pascal Case Text');
      expect(camelToReadable('singleword')).toBe('Singleword');
      expect(camelToReadable('')).toBe('');
    });
  });

  describe('formatDuration', () => {
    it('should format durations correctly', () => {
      expect(formatDuration(500)).toBe('500ms');
      expect(formatDuration(1500)).toBe('1s');
      expect(formatDuration(65000)).toBe('1m 5s');
      expect(formatDuration(3665000)).toBe('1h 1m');
      expect(formatDuration(90061000)).toBe('1d 1h');
      expect(formatDuration(-100)).toBe('0ms');
    });
  });

  describe('generateInitials', () => {
    it('should generate initials from names', () => {
      expect(generateInitials('John Doe')).toBe('JD');
      expect(generateInitials('John Michael Doe')).toBe('JM');
      expect(generateInitials('John Michael Doe', 3)).toBe('JMD');
      expect(generateInitials('SingleName')).toBe('S');
      expect(generateInitials('')).toBe('');
      expect(generateInitials(null as any)).toBe('');
    });
  });

  describe('formatError', () => {
    it('should format different error types', () => {
      expect(formatError('String error')).toBe('String error');
      expect(formatError(new Error('Error object'))).toBe('Error object');
      expect(formatError({ message: 'Object with message' })).toBe('Object with message');
      expect(formatError(null)).toBe('An unknown error occurred');
      expect(formatError(undefined)).toBe('An unknown error occurred');
    });
  });

  describe('pluralize', () => {
    it('should pluralize words correctly', () => {
      expect(pluralize(1, 'item')).toBe('item');
      expect(pluralize(2, 'item')).toBe('items');
      expect(pluralize(0, 'item')).toBe('items');
      expect(pluralize(2, 'child', 'children')).toBe('children');
    });
  });

  describe('formatCount', () => {
    it('should format counts with words', () => {
      expect(formatCount(1, 'item')).toBe('1 item');
      expect(formatCount(5, 'item')).toBe('5 items');
      expect(formatCount(1000, 'file')).toBe('1,000 files');
      expect(formatCount(2, 'child', 'children')).toBe('2 children');
    });
  });
});