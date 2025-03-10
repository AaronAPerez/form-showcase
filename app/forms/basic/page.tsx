import type { Metadata } from 'next';
import BasicForm from '@/components/forms/BasicForm';

export const metadata: Metadata = {
  title: 'Basic Contact Form | Form Showcase',
  description: 'A simple contact form implementation with form validation',
};

// Basic Form page component
export default function BasicFormPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 pb-5 mb-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Basic Contact Form</h1>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            A straightforward contact form with validation using Zod and React Hook Form. 
            This form demonstrates basic form handling patterns with proper error messages and accessibility.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Implementation Features:</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Form validation with Zod schema</li>
            <li>Accessible form controls with proper labeling</li>
            <li>Error handling and success messages</li>
            <li>Server-side validation and database storage</li>
            <li>Responsive design for all screen sizes</li>
          </ul>
        </div>

        <div className="bg-white overflow-hidden sm:rounded-lg">
          <BasicForm />
        </div>
      </div>
    </div>
  );
}