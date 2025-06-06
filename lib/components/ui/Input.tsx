import React, { ChangeEvent, forwardRef, ReactNode } from 'react';

export interface InputProps {
  type?:
    | 'text'
    | 'number'
    | 'email'
    | 'password'
    | 'tel'
    | 'textarea'
    | 'date'
    | 'checkbox';
  label?: string | ReactNode;
  name: string;
  value?: string | number | boolean;
  onChange?: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  min?: number | string;
  max?: number | string;
  rows?: number;
  error?: string;
  checked?: boolean;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      type = 'text',
      label,
      name,
      value,
      onChange,
      placeholder = '',
      id,
      required = false,
      disabled = false,
      className = '',
      labelClassName = '',
      inputClassName = '',
      min,
      max,
      rows = 3,
      error,
      checked,
      rightElement,
      ...rest
    },
    ref
  ) => {
    const inputId = id || name;

    // Default classes that match the existing form styling
    const defaultInputClass =
      type !== 'checkbox'
        ? 'w-full p-2 border border-background-light rounded-lg focus:outline-none focus:border-foreground-light transition-all duration-300'
        : 'h-4 w-4 accent-foreground text-primary focus:ring-primary border-background rounded';

    const defaultLabelClass =
      type !== 'checkbox'
        ? 'block text-sm font-medium text-foreground-light mb-1'
        : 'ml-2 block text-sm text-foreground-light';

    const wrapperClass = type === 'checkbox' ? 'flex items-center' : '';

    // Build input JSX based on type
    const inputElement =
      type === 'textarea' ? (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          id={inputId}
          name={name}
          value={value as string | number}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`${defaultInputClass} ${
            error ? 'border-red-500' : ''
          } ${inputClassName}`}
          {...rest}
        />
      ) : (
        <input
          ref={ref as React.RefObject<HTMLInputElement>}
          type={type}
          id={inputId}
          name={name}
          value={type === 'checkbox' ? undefined : (value as string | number)}
          checked={type === 'checkbox' ? checked || false : undefined}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          className={`${defaultInputClass} ${
            error ? 'border-red-500' : ''
          } checked:accent-background-dark ${inputClassName}`}
          {...rest}
        />
      );

    return (
      <div className={`${wrapperClass} ${className}`}>
        {type === 'checkbox' ? (
          <>
            {inputElement}
            <label
              htmlFor={inputId}
              className={`${defaultLabelClass} ${labelClassName}`}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </>
        ) : (
          <>
            {label ? (
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor={inputId}
                  className={`${defaultLabelClass} ${labelClassName}`}>
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {rightElement}
              </div>
            ) : (
              required && <span className="text-red-500 ml-1">*</span>
            )}
            {inputElement}
          </>
        )}

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
