import { z } from 'zod';

// Basic contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

// Multi-step form schemas
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

export const addressInfoSchema = z.object({
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const additionalInfoSchema = z.object({
  phone: z.string().optional(),
  preferences: z.object({
    receiveNewsletter: z.boolean().default(false),
    receiveUpdates: z.boolean().default(false),
    marketingConsent: z.boolean().default(false),
  }),
});

// Combined multi-step form schema
export const multiStepFormSchema = personalInfoSchema
  .merge(addressInfoSchema)
  .merge(additionalInfoSchema);

// Dynamic form schema
export const dynamicFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['text', 'email', 'number', 'checkbox', 'radio', 'select']),
  required: z.boolean().default(false),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null()
  ]).optional(),
});

export const dynamicFormSchema = z.object({
  formName: z.string(),
  fields: z.array(dynamicFieldSchema),
});

// File upload form schema
export const fileUploadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  file: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type),
      'File must be JPEG, PNG, or PDF'
    ),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type AddressInfoValues = z.infer<typeof addressInfoSchema>;
export type AdditionalInfoValues = z.infer<typeof additionalInfoSchema>;
export type MultiStepFormValues = z.infer<typeof multiStepFormSchema>;
export type DynamicFieldValues = z.infer<typeof dynamicFieldSchema>;
export type DynamicFormValues = z.infer<typeof dynamicFormSchema>;
export type FileUploadValues = z.infer<typeof fileUploadSchema>;