import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
  containerClassName?: string;
}

const InputComponent = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    helperText, 
    id, 
    required,
    labelClassName,
    inputClassName,
    errorClassName,
    helperTextClassName,
    containerClassName,
    ...props 
  }, ref) => {
    // Generate an ID unconditionally
    const generatedId = useId();
    // Then use it conditionally
    const inputId = id || `input-${generatedId}`;
    
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId}
            className={cn("block text-sm font-medium text-gray-700", labelClassName)}
          >
            <span className="flex items-center">
              {label}
              {required && (
                <>
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                  <span className="sr-only">(Required)</span>
                </>
              )}
            </span>
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
            inputClassName,
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error 
              ? `${inputId}-error` 
              : helperText 
                ? `${inputId}-helper` 
                : undefined
          }
          required={required}
          {...props}
        />
        
        {error && (
          <div 
            className={cn("text-sm text-red-500 mt-1 flex items-center gap-1", errorClassName)} 
            id={`${inputId}-error`}
            aria-live="polite"
            role="alert"
          >
            <svg 
              className="h-4 w-4" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <div 
            className={cn("text-sm text-gray-500 mt-1", helperTextClassName)}
            id={`${inputId}-helper`}
          >
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

// Set display name
InputComponent.displayName = 'Input';

// Export as Input
export const Input = InputComponent;