import { useState, useCallback, useRef, DragEvent } from 'react';
import type { FileTypeConfig } from '../types';
import { validateFiles } from '../utils';

export interface UseDragDropOptions {
  /** Callback when files are dropped */
  onFilesDropped: (files: File[]) => void;
  
  /** Callback when URLs are pasted */
  onUrlsPasted?: (text: string) => void;
  
  /** File type configuration */
  fileConfig?: FileTypeConfig;
  
  /** Whether drag and drop is enabled */
  enabled?: boolean;
  
  /** Whether to accept multiple files */
  multiple?: boolean;
  
  /** Callback when drag state changes */
  onDragStateChange?: (isDragging: boolean) => void;
  
  /** Callback when validation errors occur */
  onValidationError?: (errors: string[]) => void;
}

export interface UseDragDropReturn {
  /** Whether files are currently being dragged over */
  isDragOver: boolean;
  
  /** Drag event handlers */
  dragHandlers: {
    onDragEnter: (e: DragEvent) => void;
    onDragLeave: (e: DragEvent) => void;
    onDragOver: (e: DragEvent) => void;
    onDrop: (e: DragEvent) => void;
  };
  
  /** Paste event handler */
  onPaste: (e: React.ClipboardEvent) => void;
  
  /** File input handlers */
  fileInputHandlers: {
    ref: React.RefObject<HTMLInputElement>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: () => void;
  };
  
  /** Reset drag state */
  resetDragState: () => void;
}

/**
 * Hook for handling drag and drop operations
 */
export const useDragDrop = ({
  onFilesDropped,
  onUrlsPasted,
  fileConfig,
  enabled = true,
  multiple = true,
  onDragStateChange,
  onValidationError,
}: UseDragDropOptions): UseDragDropReturn => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length === 0) return;
    
    if (!multiple && fileArray.length > 1) {
      onValidationError?.(['Please select only one file']);
      return;
    }

    if (fileConfig) {
      const validationResults = validateFiles(fileArray, fileConfig);
      const validFiles = validationResults
        .filter(result => result.isValid)
        .map(result => result.file);
      
      const invalidResults = validationResults.filter(result => !result.isValid);
      
      if (invalidResults.length > 0) {
        const errorMessages = invalidResults.map(result => 
          `${result.file.name}: ${result.error}`
        );
        onValidationError?.(errorMessages);
      }
      
      if (validFiles.length > 0) {
        onFilesDropped(validFiles);
      }
    } else {
      onFilesDropped(fileArray);
    }
  }, [fileConfig, multiple, onFilesDropped, onValidationError]);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enabled) return;
    
    setDragCounter(prev => {
      const newCounter = prev + 1;
      if (newCounter === 1) {
        setIsDragOver(true);
        onDragStateChange?.(true);
      }
      return newCounter;
    });
  }, [enabled, onDragStateChange]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!enabled) return;
    
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
        onDragStateChange?.(false);
      }
      return newCounter;
    });
  }, [enabled, onDragStateChange]);

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
    onDragStateChange?.(false);
    
    const { files } = e.dataTransfer || {};
    
    if (files && files.length > 0) {
      validateAndProcessFiles(files);
    }
  }, [enabled, validateAndProcessFiles, onDragStateChange]);

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

  const resetDragState = useCallback(() => {
    setIsDragOver(false);
    setDragCounter(0);
    onDragStateChange?.(false);
  }, [onDragStateChange]);

  return {
    isDragOver,
    dragHandlers: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
    onPaste: handlePaste,
    fileInputHandlers: {
      ref: fileInputRef,
      onChange: handleFileInputChange,
      onClick: handleFileInputClick,
    },
    resetDragState,
  };
};