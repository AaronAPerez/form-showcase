import React from 'react';
import { cn } from '@/lib/utils';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

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
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};