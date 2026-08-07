import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { label: string; value: string }[] | string[];
  error?: string;
  placeholder?: string;
}

export default function Select({ label, options, error, placeholder, className = '', id, ...props }: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={selectId}>{label}</label>
      <select
        id={selectId}
        className={`form-input ${error ? 'error' : ''} ${className}`}
        style={{ cursor: 'pointer' }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val}>{lbl}</option>
          );
        })}
      </select>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
