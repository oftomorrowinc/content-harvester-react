import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useDragDrop } from '../../src/hooks/useDragDrop';

// Helper to create mock File objects
const createMockFile = (name: string, size: number = 1000, type: string = 'text/plain') => {
  return new File(['content'], name, { size, type });
};

// Helper to create mock FileList
const createMockFileList = (files: File[]) => {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] || null,
    [Symbol.iterator]: function* () {
      for (let i = 0; i < files.length; i++) {
        yield files[i];
      }
    },
  } as FileList;
  
  files.forEach((file, index) => {
    Object.defineProperty(fileList, index, { value: file });
  });
  
  return fileList;
};

describe('useDragDrop', () => {
  const mockOnFilesDropped = jest.fn();
  const mockOnUrlsPasted = jest.fn();
  const mockOnDragStateChange = jest.fn();
  const mockOnValidationError = jest.fn();

  beforeEach(() => {
    mockOnFilesDropped.mockClear();
    mockOnUrlsPasted.mockClear();
    mockOnDragStateChange.mockClear();
    mockOnValidationError.mockClear();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
      })
    );

    expect(result.current.isDragOver).toBe(false);
    expect(result.current.dragHandlers).toBeDefined();
    expect(result.current.onPaste).toBeDefined();
    expect(result.current.fileInputHandlers).toBeDefined();
    expect(result.current.resetDragState).toBeDefined();
  });

  it('should handle drag enter correctly', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
        onDragStateChange: mockOnDragStateChange,
      })
    );

    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as any;

    act(() => {
      result.current.dragHandlers.onDragEnter(mockEvent);
    });

    expect(result.current.isDragOver).toBe(true);
    expect(mockOnDragStateChange).toHaveBeenCalledWith(true);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should handle drag leave correctly', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
        onDragStateChange: mockOnDragStateChange,
      })
    );

    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as any;

    // First enter drag state
    act(() => {
      result.current.dragHandlers.onDragEnter(mockEvent);
    });

    expect(result.current.isDragOver).toBe(true);

    // Then leave drag state
    act(() => {
      result.current.dragHandlers.onDragLeave(mockEvent);
    });

    expect(result.current.isDragOver).toBe(false);
    expect(mockOnDragStateChange).toHaveBeenCalledWith(false);
  });

  it('should handle drag over correctly', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
      })
    );

    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: { dropEffect: '' },
    } as any;

    act(() => {
      result.current.dragHandlers.onDragOver(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockEvent.dataTransfer.dropEffect).toBe('copy');
  });

  it('should handle file drop correctly', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
        onDragStateChange: mockOnDragStateChange,
      })
    );

    const files = [createMockFile('test.txt')];
    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: { files: createMockFileList(files) },
    } as any;

    // Enter drag state first
    act(() => {
      result.current.dragHandlers.onDragEnter(mockEvent);
    });

    // Then drop
    act(() => {
      result.current.dragHandlers.onDrop(mockEvent);
    });

    expect(result.current.isDragOver).toBe(false);
    expect(mockOnFilesDropped).toHaveBeenCalledWith(files);
    expect(mockOnDragStateChange).toHaveBeenCalledWith(false);
  });

  it('should handle paste correctly', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
        onUrlsPasted: mockOnUrlsPasted,
      })
    );

    const mockEvent = {
      clipboardData: {
        getData: jest.fn().mockReturnValue('https://example.com'),
      },
    } as any;

    act(() => {
      result.current.onPaste(mockEvent);
    });

    expect(mockOnUrlsPasted).toHaveBeenCalledWith('https://example.com');
  });

  it('should not handle paste when onUrlsPasted is not provided', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
      })
    );

    const mockEvent = {
      clipboardData: {
        getData: jest.fn().mockReturnValue('https://example.com'),
      },
    } as any;

    act(() => {
      result.current.onPaste(mockEvent);
    });

    // Should not throw or cause issues
    expect(mockEvent.clipboardData.getData).not.toHaveBeenCalled();
  });

  it('should validate files when fileConfig is provided', () => {
    const fileConfig = {
      allowedExtensions: ['.txt'],
      blockedExtensions: ['.exe'],
      maxFileSize: 1000,
    };

    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
        onValidationError: mockOnValidationError,
        fileConfig,
      })
    );

    const validFiles = [createMockFile('test.txt', 500)];
    const invalidFiles = [createMockFile('virus.exe', 500)];

    // Test valid files
    const validEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: { files: createMockFileList(validFiles) },
    } as any;

    act(() => {
      result.current.dragHandlers.onDrop(validEvent);
    });

    expect(mockOnFilesDropped).toHaveBeenCalledWith(validFiles);

    // Clear mocks
    mockOnFilesDropped.mockClear();
    mockOnValidationError.mockClear();

    // Test invalid files
    const invalidEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: { files: createMockFileList(invalidFiles) },
    } as any;

    act(() => {
      result.current.dragHandlers.onDrop(invalidEvent);
    });

    expect(mockOnFilesDropped).not.toHaveBeenCalled();
    expect(mockOnValidationError).toHaveBeenCalled();
  });

  it('should enforce single file when multiple=false', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
        onValidationError: mockOnValidationError,
        multiple: false,
      })
    );

    const files = [
      createMockFile('file1.txt'),
      createMockFile('file2.txt'),
    ];

    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer: { files: createMockFileList(files) },
    } as any;

    act(() => {
      result.current.dragHandlers.onDrop(mockEvent);
    });

    expect(mockOnFilesDropped).not.toHaveBeenCalled();
    expect(mockOnValidationError).toHaveBeenCalledWith(['Please select only one file']);
  });

  it('should not handle events when disabled', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
        onDragStateChange: mockOnDragStateChange,
        enabled: false,
      })
    );

    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as any;

    act(() => {
      result.current.dragHandlers.onDragEnter(mockEvent);
    });

    expect(result.current.isDragOver).toBe(false);
    expect(mockOnDragStateChange).not.toHaveBeenCalled();
  });

  it('should reset drag state correctly', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
        onDragStateChange: mockOnDragStateChange,
      })
    );

    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    } as any;

    // Enter drag state
    act(() => {
      result.current.dragHandlers.onDragEnter(mockEvent);
    });

    expect(result.current.isDragOver).toBe(true);

    // Reset drag state
    act(() => {
      result.current.resetDragState();
    });

    expect(result.current.isDragOver).toBe(false);
    expect(mockOnDragStateChange).toHaveBeenCalledWith(false);
  });

  it('should handle file input change', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
      })
    );

    const files = [createMockFile('test.txt')];
    const mockEvent = {
      target: { files: createMockFileList(files), value: 'test.txt' },
    } as any;

    // Mock the file input ref
    const mockFileInputRef = { current: { value: '' } };
    result.current.fileInputHandlers.ref = mockFileInputRef as any;

    act(() => {
      result.current.fileInputHandlers.onChange(mockEvent);
    });

    expect(mockOnFilesDropped).toHaveBeenCalledWith(files);
    expect(mockFileInputRef.current.value).toBe('');
  });

  it('should handle file input click', () => {
    const { result } = renderHook(() =>
      useDragDrop({
        onFilesDropped: mockOnFilesDropped,
      })
    );

    const mockClick = jest.fn();
    const mockFileInputRef = { current: { click: mockClick } };
    result.current.fileInputHandlers.ref = mockFileInputRef as any;

    act(() => {
      result.current.fileInputHandlers.onClick();
    });

    expect(mockClick).toHaveBeenCalled();
  });
});