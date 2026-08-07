import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className={`form-input ${error ? 'error' : ''} ${className}`}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
