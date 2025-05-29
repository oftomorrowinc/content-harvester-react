import React from 'react';
import clsx from 'clsx';

export interface ToggleSwitchProps {
  /** Whether the toggle is checked */
  checked: boolean;
  
  /** Callback when toggle state changes */
  onChange: (checked: boolean) => void;
  
  /** Whether the toggle is disabled */
  disabled?: boolean;
  
  /** Label for accessibility */
  label?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Toggle switch component for boolean settings
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  className,
  size = 'md',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(event.target.checked);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-5',
    md: 'w-10 h-6',
    lg: 'w-12 h-7',
  };

  const sliderSizeClasses = {
    sm: 'h-3 w-3 left-1 bottom-1',
    md: 'h-4 w-4 left-1 bottom-1',
    lg: 'h-5 w-5 left-1 bottom-1',
  };

  const translateClasses = {
    sm: 'translate-x-3',
    md: 'translate-x-4',
    lg: 'translate-x-5',
  };

  return (
    <label className={clsx('toggle-switch', sizeClasses[size], className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        aria-label={label}
      />
      <span
        className={clsx(
          'toggle-slider',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={clsx(
            'toggle-slider:before',
            sliderSizeClasses[size],
            checked && translateClasses[size]
          )}
        />
      </span>
    </label>
  );
};