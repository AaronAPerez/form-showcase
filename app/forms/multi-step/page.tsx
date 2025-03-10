import type { Metadata } from 'next';
import MultiStepForm from '@/components/forms/MultiStepForm';

export const metadata: Metadata = {
  title: 'Multi-Step Form | Form Showcase',
  description: 'A multi-step form with validation between steps, focus management, and screen reader announcements',
};

/**
 * Multi-Step Form page component
 * Renders the multi-step form with proper page metadata
 */
export default function MultiStepFormPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 pb-5 mb-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Multi-Step Form</h1>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            A multi-step form implementation with validation between steps, progress tracking, 
            and the ability to navigate back and forth between form sections. Features enhanced 
            keyboard navigation and screen reader support.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Implementation Features:</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Step-by-step form progression with validation</li>
            <li>Visual progress indicator showing current step</li>
            <li>Form state persistence between steps</li>
            <li>Back and forth navigation with data retention</li>
            <li>Keyboard shortcuts (Alt+Left/Right) for navigation</li>
            <li>Screen reader announcements for step changes</li>
            <li>Focus management for improved accessibility</li>
          </ul>
        </div>

        <div className="bg-white overflow-hidden sm:rounded-lg">
          <MultiStepForm />
        </div>
      </div>
    </div>
  );
}