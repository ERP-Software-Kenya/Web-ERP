import React, { forwardRef, SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[] | string[];
  error?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
    const errorId = `${selectId}-error`;

    return (
      <div className="form-group">
        <label className="form-label" htmlFor={selectId}>
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`form-input ${error ? 'error' : ''} ${className}`}
          style={{ cursor: 'pointer' }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        {error && (
          <div id={errorId} className="form-error" role="alert" aria-live="polite">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
