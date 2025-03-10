'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { contactFormSchema, type ContactFormValues } from '@/lib/schemas/form-schemas';

/**
 * Basic contact form component with enhanced accessibility
 * - ARIA live regions for status messages
 * - Clear validation feedback
 * - Proper focus management
 * - Keyboard navigation support
 */
export default function BasicForm() {
  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Ref for focus management
  const formStartRef = useRef<HTMLHeadingElement>(null);
  
  // Set up form with React Hook Form and Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Send form data to API
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      // If successful, reset form and show success message
      reset();
      setSubmitSuccess(true);
      
      // Return focus to the top of the form
      setTimeout(() => {
        formStartRef.current?.focus();
      }, 100);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Status announcements for screen readers */}
      <div aria-live="assertive" className="sr-only">
        {submitSuccess && "Form submitted successfully. Thank you for your message!"}
        {submitError && `Error submitting form: ${submitError}`}
        {isSubmitting && "Submitting form, please wait..."}
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-xl rounded-xl p-8">
        <h2 
          className="text-2xl font-semibold text-gray-800 mb-6"
          ref={formStartRef}
          tabIndex={-1}
          id="form-heading"
        >
          Contact Us
        </h2>
        
        {/* Success message */}
        {submitSuccess && (
          <div 
            className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg animate-in fade-in" 
            role="alert"
          >
            <div className="flex">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Thank you for your message!</p>
                <p>We will get back to you as soon as possible.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {submitError && (
          <div 
            className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg animate-in fade-in" 
            role="alert"
          >
            <div className="flex">
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">There was an error submitting your form</p>
                <p>{submitError}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Form content */}
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
          aria-labelledby="form-heading"
          noValidate
        >
          {/* Name field with floating label */}
          <Input
            label="Name"
            {...register('name')}
            error={errors.name?.message}
            required
            aria-required="true"
            aria-invalid={!!errors.name}
          />
          
          {/* Email field */}
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
            aria-required="true"
            aria-invalid={!!errors.email}
          />
          
          {/* Subject field */}
          <Input
            label="Subject"
            {...register('subject')}
            error={errors.subject?.message}
            required
            aria-required="true"
            aria-invalid={!!errors.subject}
          />
          
          {/* Message textarea */}
          <div className="space-y-2">
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-gray-700"
            >
              Message<span className="text-red-500 ml-1" aria-hidden="true">*</span>
              <span className="sr-only">(Required)</span>
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full min-h-[100px] rounded-md border border-input p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              required
            ></textarea>
            {errors.message && (
              <FormError message={errors.message.message} id="message-error" />
            )}
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}