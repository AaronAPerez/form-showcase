'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  personalInfoSchema, 
  addressInfoSchema, 
  additionalInfoSchema,
  multiStepFormSchema,
  type MultiStepFormValues,
} from '@/lib/schemas/form-schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Multi-step form with enhanced accessibility features
 * - ARIA live regions for step announcements
 * - Focus management between steps
 * - Keyboard navigation with Alt+Arrow shortcuts
 * - Clear status announcements
 */
export default function MultiStepForm() {
  // Track the current step (0-based index)
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Refs for focus management
  const formStartRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstStepRef = useRef<HTMLInputElement>(null);
const secondStepRef = useRef<HTMLInputElement>(null);
const thirdStepRef = useRef<HTMLInputElement>(null);
  
  // References for the first focusable element in each step
  const stepRefs = useMemo(() => [
    firstStepRef,
    secondStepRef,
    thirdStepRef
  ], []);
  
  // State for ARIA announcements
  const [stepChangeAnnouncement, setStepChangeAnnouncement] = useState<string | null>(null);
  const [statusAnnouncement, setStatusAnnouncement] = useState<string | null>(null);
  
  // Setup the form with react-hook-form
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm<MultiStepFormValues>({
    resolver: zodResolver(multiStepFormSchema),
    mode: 'onChange', // Validate on change
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phone: '',
      preferences: {
        receiveNewsletter: false,
        receiveUpdates: false,
        marketingConsent: false,
      },
    },
  });
  
  // Define steps with their titles and validation schemas
  const steps = useMemo(() => [
    { 
      title: 'Personal Information', 
      description: 'Enter your name and contact details',
      schema: personalInfoSchema,
      fields: ['firstName', 'lastName', 'email'] as const
    },
    { 
      title: 'Address', 
      description: 'Enter your mailing address',
      schema: addressInfoSchema,
      fields: ['addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country'] as const
    },
    { 
      title: 'Additional Information', 
      description: 'Add any other information and preferences',
      schema: additionalInfoSchema,
      fields: ['phone', 'preferences'] as const
    },
  ], []);
  
  // Handle moving to the next step with validation
  const handleNext = useCallback(async () => {
    // Validate only the fields in the current step
    const isValid = await trigger(steps[step].fields as unknown as Array<keyof MultiStepFormValues>);
    
    if (isValid) {
      // Move to the next step
      setStep(prevStep => prevStep + 1);
    } else {
      // Announce validation errors
      setStatusAnnouncement('There are validation errors. Please correct them before proceeding.');
      
      // Focus the first field with an error
      const firstErrorField = document.querySelector('[aria-invalid="true"]') as HTMLElement;
      firstErrorField?.focus();
    }
  }, [trigger, steps, step, setStatusAnnouncement]);
  
  // Handle moving to the previous step
  const handlePrevious = useCallback(() => {
    setStep(prevStep => prevStep - 1);
  }, []);
  
  // Handle form submission
  const onSubmit = async (data: MultiStepFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setStatusAnnouncement('Submitting form, please wait...');
    
    try {
      // Send form data to API
      const response = await fetch('/api/forms/multi-step', {
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
      setStep(0);
      setSubmitSuccess(true);
      setStatusAnnouncement('Form submitted successfully. Thank you for your submission.');
      
      // Return focus to the top of the form
      formStartRef.current?.focus();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setStatusAnnouncement('Error submitting form. ' + (error instanceof Error ? error.message : 'An unexpected error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Keyboard navigation for steps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only if focus is within the form
      if (!formRef.current?.contains(document.activeElement)) return;
      
      // Alt+Left: Previous step
      if (e.key === 'ArrowLeft' && e.altKey && step > 0) {
        e.preventDefault();
        handlePrevious();
      }
      // Alt+Right: Next step (if validation passes)
      else if (e.key === 'ArrowRight' && e.altKey && step < steps.length - 1) {
        e.preventDefault();
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, handleNext, steps.length]);
  
  // Focus management when step changes
  useEffect(() => {
    // Announce step change
    setStepChangeAnnouncement(`Step ${step + 1} of ${steps.length}: ${steps[step].title}`);
    
    // After render, focus the first field in the current step
    setTimeout(() => {
      stepRefs[step]?.current?.focus();
    }, 100);
  }, [step, stepRefs, steps]);
  
  // Clear step announcement after it's read
  useEffect(() => {
    if (stepChangeAnnouncement) {
      const timer = setTimeout(() => {
        setStepChangeAnnouncement(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [stepChangeAnnouncement]);
  
  // Render the step indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <nav aria-label="Progress" role="navigation">
          <ol className="flex items-center">
            {steps.map((stepItem, index) => (
              <li 
                key={stepItem.title} 
                className={cn(
                  "relative pr-8 sm:pr-20",
                  index === steps.length - 1 ? "flex-auto" : ""
                )}
              >
                <div className="flex items-center">
                  <div
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center rounded-full",
                      step === index
                        ? "bg-indigo-600 text-white"
                        : step > index
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    )}
                    aria-current={step === index ? "step" : undefined}
                  >
                    {step > index ? (
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index !== steps.length - 1 && (
                    <div
                      className={cn(
                        "absolute left-0 top-4 -ml-px mt-0.5 h-0.5 w-full",
                        step > index ? "bg-indigo-600" : "bg-gray-200"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="mt-2">
                  <span 
                    className="text-sm font-medium"
                    aria-hidden={step !== index}
                  >
                    {stepItem.title}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    );
  };
  
  // Render the appropriate form fields based on current step
  const renderForm = () => {
    if (step === 0) {
      // Personal Information Step
      return (
        <div className="space-y-6" role="group" aria-labelledby="step-1-heading">
          <h3 id="step-1-heading" className="sr-only">Personal Information</h3>
          
          <Input
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
            required
            ref={stepRefs[0]} // Reference for focus management
            autoFocus
          />
          
          <Input
            label="Last Name"
            {...register('lastName')}
            error={errors.lastName?.message}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
          />
        </div>
      );
    } else if (step === 1) {
      // Address Step
      return (
        <div className="space-y-6" role="group" aria-labelledby="step-2-heading">
          <h3 id="step-2-heading" className="sr-only">Address Information</h3>
          
          <Input
            label="Address Line 1"
            {...register('addressLine1')}
            error={errors.addressLine1?.message}
            required
            ref={stepRefs[1]} // Reference for focus management
            autoFocus
          />
          
          <Input
            label="Address Line 2"
            {...register('addressLine2')}
            error={errors.addressLine2?.message}
            helperText="Optional"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="City"
              {...register('city')}
              error={errors.city?.message}
              required
            />
            
            <Input
              label="State / Province"
              {...register('state')}
              error={errors.state?.message}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Postal Code"
              {...register('postalCode')}
              error={errors.postalCode?.message}
              required
            />
            
            <Input
              label="Country"
              {...register('country')}
              error={errors.country?.message}
              required
            />
          </div>
        </div>
      );
    } else if (step === 2) {
      // Additional Information Step
      return (
        <div className="space-y-6" role="group" aria-labelledby="step-3-heading">
          <h3 id="step-3-heading" className="sr-only">Additional Information</h3>
          
          <Input
            label="Phone Number"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            helperText="Optional"
            ref={stepRefs[2]} // Reference for focus management
            autoFocus
          />
          
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 mb-2" id="preferences-group">
              Preferences
            </div>
            
            <div className="space-y-3" role="group" aria-labelledby="preferences-group">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="receiveNewsletter"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    {...register('preferences.receiveNewsletter')}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="receiveNewsletter" className="text-gray-700">
                    Receive our newsletter
                  </label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="receiveUpdates"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    {...register('preferences.receiveUpdates')}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="receiveUpdates" className="text-gray-700">
                    Receive product updates
                  </label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketingConsent"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    {...register('preferences.marketingConsent')}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor="marketingConsent" className="text-gray-700">
                    I consent to receiving marketing communications
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  // ARIA live regions for announcements
  const accessibilityAnnouncements = (
    <>
      {/* Status announcements */}
      {statusAnnouncement && (
        <div 
          aria-live="assertive" 
          className="sr-only"
          role="status"
        >
          {statusAnnouncement}
        </div>
      )}
      
      {/* Step change announcements */}
      {stepChangeAnnouncement && (
        <div 
          aria-live="polite" 
          className="sr-only"
        >
          {stepChangeAnnouncement}
        </div>
      )}
      
      {/* Keyboard shortcut instructions - only visible on focus */}
      <div 
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:z-10 focus-visible:bg-white focus-visible:p-4 focus-visible:border focus-visible:border-gray-300 focus-visible:rounded-md focus-visible:shadow-md"
        tabIndex={0}
      >
        <p>Keyboard shortcuts: Alt+Left Arrow to go to previous step, Alt+Right Arrow to go to next step</p>
      </div>
    </>
  );
  
  // If submission was successful, show success message
  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 
              className="mt-3 text-lg font-medium text-gray-900"
              ref={formStartRef}
              tabIndex={-1}
            >
              Submission successful!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Thank you for completing the multi-step form. Your information has been saved.
            </p>
            <div className="mt-6">
              <Button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Start Over
              </Button>
            </div>
          </div>
        </div>
        
        {/* Status announcement for screen readers */}
        <div aria-live="polite" className="sr-only">
          Form submitted successfully. Thank you for your submission.
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Skip to main content link */}
      <a 
        href="#form-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-2 focus:bg-indigo-600 focus:text-white focus:rounded-md"
      >
        Skip to form content
      </a>
      
      {/* Accessibility announcements */}
      {accessibilityAnnouncements}
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 
          className="text-xl font-semibold text-gray-800 mb-2"
          ref={formStartRef}
          tabIndex={-1}
          id="form-heading"
        >
          {steps[step].title}
        </h2>
        <p 
          className="text-sm text-gray-500 mb-6"
          id="form-description"
        >
          {steps[step].description}
        </p>
        
        {submitError && (
          <div 
            className="mb-6 p-4 bg-red-50 text-red-700 rounded-md" 
            role="alert"
            aria-live="assertive"
          >
            <p className="font-medium">Error submitting form</p>
            <p>{submitError}</p>
          </div>
        )}
        
        {/* Step indicator */}
        {renderStepIndicator()}
        
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
          ref={formRef}
          aria-labelledby="form-heading"
          aria-describedby="form-description"
          id="form-content"
        >
          {/* Dynamic form fields based on current step */}
          {renderForm()}
          
          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={step === 0}
              variant="outline"
              className="border-gray-300 text-gray-700"
              aria-label={step === 0 ? "Previous step (disabled)" : "Previous step"}
            >
              Previous
            </Button>
            
            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                aria-label="Next step"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                aria-label={isSubmitting ? "Submitting form" : "Submit form"}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}