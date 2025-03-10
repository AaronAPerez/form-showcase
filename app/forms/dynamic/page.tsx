import type { Metadata } from 'next';
import DynamicForm from '@/components/forms/DynamicForm';

export const metadata: Metadata = {
  title: 'Dynamic Form | Form Showcase',
  description: 'A dynamic form builder that allows creating custom forms with different field types',
};

/**
 * Dynamic Form page component
 */
export default function DynamicFormPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 pb-5 mb-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Dynamic Form Builder</h1>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            Build and configure custom forms with a variety of field types. This demonstrates
            creating dynamic form interfaces with React and TypeScript.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Implementation Features:</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Dynamic field generation with various input types</li>
            <li>Field configuration with custom options</li>
            <li>Client and server-side validation</li>
            <li>Form state management</li>
            <li>JSON-based form data storage</li>
          </ul>
        </div>

        <div className="bg-white overflow-hidden sm:rounded-lg">
          <DynamicForm />
        </div>
      </div>
    </div>
  );
}