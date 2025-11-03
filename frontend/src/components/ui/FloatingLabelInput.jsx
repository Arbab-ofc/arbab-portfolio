import React, { useState } from 'react';

const FloatingLabelInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  maxLength,
  disabled = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.toString().length > 0;

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  return (
    <div className="relative">
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
            text-white placeholder-white/40 backdrop-blur-sm transition-all duration-300
            focus:border-sky-500/50 focus:bg-white/10 focus:ring-2 focus:ring-sky-500/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50' : ''}
            ${focused ? 'bg-white/10' : ''}
            ${className}
          `}
          style={{
          color: '#ffffff',
          WebkitTextFillColor: '#ffffff',
          caretColor: '#ffffff',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          WebkitAppearance: 'none',
          opacity: 1
        }}
          {...props}
        />

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`
            absolute left-4 transition-all duration-300 pointer-events-none
            text-white font-medium
            ${(focused || hasValue)
              ? '-top-2 left-3 text-xs bg-slate-900/80 px-1 rounded'
              : 'top-3 text-base text-white/60'
            }
            ${error ? 'text-red-400' : focused ? 'text-sky-400' : ''}
            ${required ? 'after:content-["*"] after:ml-1 after:text-sky-400' : ''}
          `}
        >
          {label}
        </label>

        {/* Error Icon */}
        {error && (
          <div className="absolute right-3 top-3.5">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Character Count */}
      {maxLength && (
        <div className="absolute right-3 bottom-3 text-xs text-white/40">
          {value?.length || 0}/{maxLength}
        </div>
      )}
    </div>
  );
};

export default FloatingLabelInput;