import React from 'react';
import { cn } from '@/lib/utils';


interface FormErrorProps {
  message?: string;
  className?: string;
  id?: string;
}

/**
 * Form error message component with icon
 * 
 * @example
 * <FormError message="This field is required" />
 */
export const FormError = ({ message, className, id }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div 
      className={cn(
        "flex items-center gap-x-2 text-sm text-red-500 mt-1",
        className
      )}
      id={id}
      aria-live="polite"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
</svg> 
      <p>{message}</p>
    </div>
  );
};