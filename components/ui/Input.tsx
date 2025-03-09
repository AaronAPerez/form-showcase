import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Input component with optional label and error message
 * 
 * @example
 * <Input 
 *   name="email" 
 *   label="Email Address" 
 *   placeholder="Enter your email" 
 *   error={errors.email?.message}
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, id, required, ...props }, ref) => {
    // Generate a unique ID if one isn't provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {error && (
          <div 
            className="text-sm text-red-500 mt-1" 
            id={`${inputId}-error`}
            aria-live="polite"
          >
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div 
            className="text-sm text-gray-500 mt-1"
            id={`${inputId}-helper`}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };