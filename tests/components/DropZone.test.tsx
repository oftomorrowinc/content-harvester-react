import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DropZone } from '../../src/components/DropZone';
import { ToastProvider } from '../../src/components/ToastProvider';

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

// Wrapper with ToastProvider
const DropZoneWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('DropZone', () => {
  const mockOnFilesDropped = jest.fn();
  const mockOnUrlsPasted = jest.fn();

  beforeEach(() => {
    mockOnFilesDropped.mockClear();
    mockOnUrlsPasted.mockClear();
  });

  it('should render with default empty state', () => {
    render(
      <DropZoneWrapper>
        <DropZone onFilesDropped={mockOnFilesDropped} />
      </DropZoneWrapper>
    );
    expect(screen.getByText('Drop files here')).toBeInTheDocument();
  });

  it('should render custom empty state', () => {
    const customEmptyState = <div>Custom Empty State</div>;
    render(
      <DropZoneWrapper>
        <DropZone 
          onFilesDropped={mockOnFilesDropped} 
          emptyState={customEmptyState} 
        />
      </DropZoneWrapper>
    );
    expect(screen.getByText('Custom Empty State')).toBeInTheDocument();
  });

  it('should show file input button when enabled', () => {
    render(
      <DropZoneWrapper>
        <DropZone 
          onFilesDropped={mockOnFilesDropped} 
          showFileInput 
          fileInputText="Choose Files" 
        />
      </DropZoneWrapper>
    );
    expect(screen.getByText('Choose Files')).toBeInTheDocument();
  });

  it('should handle drag events correctly', () => {
    const { container } = render(
      <DropZoneWrapper>
        <DropZone onFilesDropped={mockOnFilesDropped} />
      </DropZoneWrapper>
    );
    const dropZone = container.querySelector('.drop-zone');

    // Simulate drag enter
    const dragEnterEvent = new Event('dragenter', { bubbles: true });
    Object.defineProperty(dragEnterEvent, 'dataTransfer', {
      value: { items: [{ kind: 'file' }] },
    });
    
    fireEvent(dropZone!, dragEnterEvent);
    expect(dropZone).toHaveClass('dragover');
  });

  it('should call onFilesDropped when files are dropped', async () => {
    const { container } = render(
      <DropZoneWrapper>
        <DropZone onFilesDropped={mockOnFilesDropped} />
      </DropZoneWrapper>
    );
    const dropZone = container.querySelector('.drop-zone');
    const files = [createMockFile('test.txt')];

    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: createMockFileList(files) },
    });

    fireEvent(dropZone!, dropEvent);
    
    await waitFor(() => {
      expect(mockOnFilesDropped).toHaveBeenCalledWith(files);
    });
  });

  it('should call onUrlsPasted when text is pasted', () => {
    const { container } = render(
      <DropZoneWrapper>
        <DropZone 
          onFilesDropped={mockOnFilesDropped} 
          onUrlsPasted={mockOnUrlsPasted} 
        />
      </DropZoneWrapper>
    );
    const dropZone = container.querySelector('.drop-zone');

    const pasteEvent = new Event('paste', { bubbles: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: { getData: () => 'https://example.com' },
    });

    fireEvent(dropZone!, pasteEvent);
    expect(mockOnUrlsPasted).toHaveBeenCalledWith('https://example.com');
  });

  it('should validate files and show errors for invalid files', async () => {
    const fileConfig = {
      allowedExtensions: ['.txt'],
      blockedExtensions: ['.exe'],
      maxFileSize: 1000,
    };

    render(
      <DropZoneWrapper>
        <DropZone 
          onFilesDropped={mockOnFilesDropped} 
          fileConfig={fileConfig}
        />
      </DropZoneWrapper>
    );

    const { container } = render(
      <DropZoneWrapper>
        <DropZone 
          onFilesDropped={mockOnFilesDropped} 
          fileConfig={fileConfig}
        />
      </DropZoneWrapper>
    );
    const dropZone = container.querySelector('.drop-zone');
    
    // Try to drop an invalid file
    const files = [createMockFile('virus.exe', 500, 'application/x-executable')];
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: createMockFileList(files) },
    });

    fireEvent(dropZone!, dropEvent);
    
    // Should not call onFilesDropped for invalid files
    expect(mockOnFilesDropped).not.toHaveBeenCalled();
  });

  it('should respect multiple file setting', async () => {
    const { container } = render(
      <DropZoneWrapper>
        <DropZone 
          onFilesDropped={mockOnFilesDropped} 
          multiple={false}
        />
      </DropZoneWrapper>
    );
    const dropZone = container.querySelector('.drop-zone');
    
    // Try to drop multiple files when multiple=false
    const files = [
      createMockFile('file1.txt'),
      createMockFile('file2.txt'),
    ];
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: createMockFileList(files) },
    });

    fireEvent(dropZone!, dropEvent);
    
    // Should not call onFilesDropped for multiple files when multiple=false
    expect(mockOnFilesDropped).not.toHaveBeenCalled();
  });

  it('should be disabled when enabled=false', () => {
    const { container } = render(
      <DropZoneWrapper>
        <DropZone 
          onFilesDropped={mockOnFilesDropped} 
          enabled={false}
        />
      </DropZoneWrapper>
    );
    const dropZone = container.querySelector('.drop-zone');
    
    expect(dropZone).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(dropZone).toHaveAttribute('tabIndex', '-1');
  });

  it('should handle file input change', async () => {
    render(
      <DropZoneWrapper>
        <DropZone 
          onFilesDropped={mockOnFilesDropped} 
          showFileInput 
        />
      </DropZoneWrapper>
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [createMockFile('test.txt')];

    Object.defineProperty(fileInput, 'files', {
      value: createMockFileList(files),
    });

    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(mockOnFilesDropped).toHaveBeenCalledWith(files);
    });
  });

  it('should clear file input after selection', async () => {
    render(
      <DropZoneWrapper>
        <DropZone 
          onFilesDropped={mockOnFilesDropped} 
          showFileInput 
        />
      </DropZoneWrapper>
    );

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [createMockFile('test.txt')];

    Object.defineProperty(fileInput, 'files', {
      value: createMockFileList(files),
    });

    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(fileInput.value).toBe('');
    });
  });

  it('should render children when provided', () => {
    render(
      <DropZoneWrapper>
        <DropZone onFilesDropped={mockOnFilesDropped}>
          <div>Custom Children Content</div>
        </DropZone>
      </DropZoneWrapper>
    );
    
    expect(screen.getByText('Custom Children Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <DropZoneWrapper>
        <DropZone 
          onFilesDropped={mockOnFilesDropped} 
          className="custom-class"
        />
      </DropZoneWrapper>
    );
    const dropZone = container.querySelector('.drop-zone');
    expect(dropZone).toHaveClass('custom-class');
  });
});