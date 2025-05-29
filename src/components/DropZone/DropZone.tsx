import React, { useCallback, useState, DragEvent, useRef } from 'react';
import clsx from 'clsx';
import type { FileValidationResult, FileTypeConfig } from '../../types';
import { validateFiles } from '../../utils';
import { EmptyState } from '../EmptyState';
import { useToast } from '../ToastProvider';

export interface DropZoneProps {
  /** Callback when files are dropped and validated */
  onFilesDropped: (files: File[]) => void;
  
  /** Callback when URLs are pasted */
  onUrlsPasted?: (urls: string) => void;
  
  /** File type configuration */
  fileConfig?: FileTypeConfig;
  
  /** Whether drag and drop is enabled */
  enabled?: boolean;
  
  /** Whether to accept multiple files */
  multiple?: boolean;
  
  /** Custom empty state content */
  emptyState?: React.ReactNode;
  
  /** Children to render inside the drop zone */
  children?: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Whether to show file input button */
  showFileInput?: boolean;
  
  /** Text for file input button */
  fileInputText?: string;
}

/**
 * Drop zone component for handling file drops and URL pastes
 */
export const DropZone: React.FC<DropZoneProps> = ({
  onFilesDropped,
  onUrlsPasted,
  fileConfig,
  enabled = true,
  multiple = true,
  emptyState,
  children,
  className,
  showFileInput = false,
  fileInputText = 'Choose files',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error, success } = useToast();

  const validateAndProcessFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length === 0) return;
    
    if (!multiple && fileArray.length > 1) {
      error('Please select only one file');
      return;
    }

    const validationResults = validateFiles(fileArray, fileConfig);
    const validFiles = validationResults
      .filter(result => result.isValid)
      .map(result => result.file);
    
    const invalidResults = validationResults.filter(result => !result.isValid);
    
    if (invalidResults.length > 0) {
      const errorMessages = invalidResults.map(result => 
        `${result.file.name}: ${result.error}`
      );
      
      // Show first few errors to avoid overwhelming the user
      const displayErrors = errorMessages.slice(0, 3);
      const hasMore = errorMessages.length > 3;
      
      const errorMessage = displayErrors.join(', ') + 
        (hasMore ? ` and ${errorMessages.length - 3} more` : '');
      
      error(errorMessage);
    }
    
    if (validFiles.length > 0) {
      onFilesDropped(validFiles);
      success(`Successfully added ${validFiles.length} file${validFiles.length > 1 ? 's' : ''}`);
    }
  }, [fileConfig, multiple, onFilesDropped, error, success]);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enabled) return;
    
    setDragCounter(prev => prev + 1);
    
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, [enabled]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enabled) return;
    
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, [enabled]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enabled) return;
    
    // Set dropEffect to indicate what will happen when dropped
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, [enabled]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enabled) return;
    
    setIsDragOver(false);
    setDragCounter(0);
    
    const { files } = e.dataTransfer || {};
    
    if (files && files.length > 0) {
      validateAndProcessFiles(files);
    }
  }, [enabled, validateAndProcessFiles]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (!enabled || !onUrlsPasted) return;
    
    const pastedText = e.clipboardData.getData('text');
    
    if (pastedText.trim()) {
      onUrlsPasted(pastedText);
    }
  }, [enabled, onUrlsPasted]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    
    if (files && files.length > 0) {
      validateAndProcessFiles(files);
    }
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [validateAndProcessFiles]);

  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const defaultEmptyState = (
    <EmptyState
      variant="drop-zone"
      action={showFileInput && (
        <button
          type="button"
          onClick={handleFileInputClick}
          className="btn btn-primary px-4 py-2"
        >
          {fileInputText}
        </button>
      )}
    />
  );

  return (
    <div
      className={clsx(
        'drop-zone',
        isDragOver && 'dragover',
        !enabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={enabled ? 0 : -1}
      role="button"
      aria-label={enabled ? 'Drop zone for files and URLs' : 'Drop zone disabled'}
    >
      {showFileInput && (
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileInputChange}
          className="sr-only"
          accept={fileConfig?.allowedExtensions?.join(',')}
        />
      )}
      
      {isDragOver && enabled && (
        <div className="drop-zone-overlay">
          <div className="drop-zone-content">
            <div className="drop-zone-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            <div className="drop-zone-text">
              Release to upload
            </div>
            <div className="drop-zone-subtext">
              {multiple ? 'Multiple files supported' : 'Single file only'}
            </div>
          </div>
        </div>
      )}
      
      {children || (emptyState ?? defaultEmptyState)}
    </div>
  );
};