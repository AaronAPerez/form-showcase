'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { contactFormSchema, type ContactFormValues } from '@/lib/schemas/form-schemas';

// Basic contact form component
export default function BasicForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
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
  
  // Submit handler for the contact form
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
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Us</h2>
        
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md" role="alert">
            <p className="font-medium">Thank you for your message!</p>
            <p>We will get back to you as soon as possible.</p>
          </div>
        )}
        
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md" role="alert">
            <p className="font-medium">Error submitting form</p>
            <p>{submitError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Name"
            {...register('name')}
            error={errors.name?.message}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            required
          />
          
          <Input
            label="Subject"
            {...register('subject')}
            error={errors.subject?.message}
            required
          />
          
          <div className="space-y-2">
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-gray-700"
            >
              Message<span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full min-h-[100px] rounded-md border border-input p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            ></textarea>
            {errors.message && (
              <FormError message={errors.message.message} id="message-error" />
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isSubmitting ? 'Submitting...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}