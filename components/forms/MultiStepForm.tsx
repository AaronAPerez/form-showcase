'use client';

import { useState } from 'react';
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

// Multi-step form with validation between steps
export default function MultiStepForm() {
  // Track the current step (0-based index)
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
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
  const steps = [
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
  ];
  
  // Handle moving to the next step
  const handleNext = async () => {
    // Validate only the fields in the current step
    const isValid = await trigger(steps[step].fields as unknown as Array<keyof MultiStepFormValues>);
    
    if (isValid) {
      // Move to the next step
      setStep(prevStep => prevStep + 1);
    }
  };
  
  // Handle moving to the previous step
  const handlePrevious = () => {
    setStep(prevStep => prevStep - 1);
  };
  
  // Handle form submission
  const onSubmit = async (data: MultiStepFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
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
  
  // Render the step indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <nav aria-label="Progress">
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
                    />
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium">
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
        <div className="space-y-6">
          <Input
            label="First Name"
            {...register('firstName')}
            error={errors.firstName?.message}
            required
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
        <div className="space-y-6">
          <Input
            label="Address Line 1"
            {...register('addressLine1')}
            error={errors.addressLine1?.message}
            required
          />
          
          <Input
            label="Address Line 2"
            {...register('addressLine2')}
            error={errors.addressLine2?.message}
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
        <div className="space-y-6">
          <Input
            label="Phone Number"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            helperText="Optional"
          />
          
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Preferences
            </div>
            
            <div className="space-y-3">
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
            <h2 className="mt-3 text-lg font-medium text-gray-900">Submission successful!</h2>
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
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{steps[step].title}</h2>
        <p className="text-sm text-gray-500 mb-6">{steps[step].description}</p>
        
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md" role="alert">
            <p className="font-medium">Error submitting form</p>
            <p>{submitError}</p>
          </div>
        )}
        
        {/* Step indicator */}
        {renderStepIndicator()}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            >
              Previous
            </Button>
            
            {step < steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}