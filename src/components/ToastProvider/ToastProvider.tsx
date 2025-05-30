import React, { createContext, useContext, useCallback, useState } from 'react';
import { Toaster, toast as hotToast, ToastOptions } from 'react-hot-toast';
import clsx from 'clsx';

export interface ToastContextValue {
  /** Show a toast message */
  toast: (message: string, options?: ToastOptions) => void;

  /** Show a success toast */
  success: (message: string, options?: ToastOptions) => void;

  /** Show an error toast */
  error: (message: string, options?: ToastOptions) => void;

  /** Show a warning toast */
  warning: (message: string, options?: ToastOptions) => void;

  /** Show an info toast */
  info: (message: string, options?: ToastOptions) => void;

  /** Dismiss all toasts */
  dismiss: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;

  /** Toast position */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

  /** Maximum number of toasts to show */
  maxToasts?: number;

  /** Default duration for toasts */
  duration?: number;
}

/**
 * Toast provider component using react-hot-toast
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts: _maxToasts = 5,
  duration = 4000,
}) => {
  const [toastConfig] = useState({
    duration,
    position,
    style: {
      background: 'var(--dark-bg-elevated)',
      color: 'var(--dark-text-primary)',
      border: '1px solid var(--dark-border-primary)',
      borderRadius: '8px',
      fontSize: '14px',
      maxWidth: '400px',
    },
    success: {
      style: {
        background: 'var(--dark-bg-elevated)',
        color: 'var(--dark-text-primary)',
        border: '1px solid var(--dark-status-success)',
        borderLeft: '4px solid var(--dark-status-success)',
      },
      iconTheme: {
        primary: 'var(--dark-status-success)',
        secondary: 'var(--dark-bg-elevated)',
      },
    },
    error: {
      style: {
        background: 'var(--dark-bg-elevated)',
        color: 'var(--dark-text-primary)',
        border: '1px solid var(--dark-status-error)',
        borderLeft: '4px solid var(--dark-status-error)',
      },
      iconTheme: {
        primary: 'var(--dark-status-error)',
        secondary: 'var(--dark-bg-elevated)',
      },
    },
  });

  const toast = useCallback((message: string, options?: ToastOptions) => {
    return hotToast(message, {
      ...toastConfig,
      ...options,
    });
  }, [toastConfig]);

  const success = useCallback((message: string, options?: ToastOptions) => {
    return hotToast.success(message, {
      ...toastConfig.success,
      ...options,
    });
  }, [toastConfig]);

  const error = useCallback((message: string, options?: ToastOptions) => {
    return hotToast.error(message, {
      ...toastConfig.error,
      ...options,
    });
  }, [toastConfig]);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    return hotToast(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        border: '1px solid var(--dark-status-warning)',
        borderLeft: '4px solid var(--dark-status-warning)',
      },
      icon: '⚠️',
      ...options,
    });
  }, [toastConfig]);

  const info = useCallback((message: string, options?: ToastOptions) => {
    return hotToast(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        border: '1px solid var(--dark-status-info)',
        borderLeft: '4px solid var(--dark-status-info)',
      },
      icon: 'ℹ️',
      ...options,
    });
  }, [toastConfig]);

  const dismiss = useCallback(() => {
    hotToast.dismiss();
  }, []);

  const contextValue: ToastContextValue = {
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toaster
        position={position}
        toastOptions={{
          duration,
          style: toastConfig.style,
        }}
        containerStyle={{
          zIndex: 9999,
        }}
        gutter={8}
        reverseOrder={false}
      />
    </ToastContext.Provider>
  );
};

/**
 * Hook to use toast functionality
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

/**
 * Simple toast component for custom implementations
 */
export interface SimpleToastProps {
  /** Toast message */
  message: string;

  /** Toast type */
  type?: 'success' | 'error' | 'warning' | 'info';

  /** Whether to show close button */
  showClose?: boolean;

  /** Close callback */
  onClose?: () => void;

  /** Additional CSS classes */
  className?: string;
}

export const SimpleToast: React.FC<SimpleToastProps> = ({
  message,
  type = 'info',
  showClose = true,
  onClose,
  className,
}) => {
  const typeClasses = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'toast-warning',
    info: '',
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={clsx('toast', typeClasses[type], className)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getIcon(type)}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-dark-text-primary">
            {message}
          </p>
        </div>

        {showClose && onClose && (
          <button
            type="button"
            className="flex-shrink-0 p-1 text-dark-text-secondary hover:text-dark-text-primary transition-colors"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
