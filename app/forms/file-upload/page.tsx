import type { Metadata } from 'next';
import FileUploadForm from '@/components/forms/FileUploadForm';

export const metadata: Metadata = {
  title: 'File Upload Form | Form Showcase',
  description: 'A file upload form with validation, drag and drop, and progress tracking, enhanced with accessibility features',
};

/**
 * File Upload Form page component
 * Renders the file upload form with proper page metadata
 */
export default function FileUploadFormPage() {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 pb-5 mb-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">File Upload Form</h1>
          <p className="mt-2 max-w-4xl text-sm text-gray-500">
            A form with file upload functionality, drag and drop support, and real-time progress tracking.
            Includes keyboard accessibility for the drag-and-drop interface and screen reader 
            announcements for upload progress.
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Implementation Features:</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>File upload with validation for file type and size</li>
            <li>Keyboard-accessible drag and drop file interface</li>
            <li>Upload progress tracking with ARIA announcements</li>
            <li>Server-side file handling and storage</li>
            <li>Focus management for upload interactions</li>
            <li>Clear status updates for screen reader users</li>
            <li>Comprehensive error handling with descriptive messages</li>
          </ul>
        </div>

        <div className="bg-white overflow-hidden sm:rounded-lg">
          <FileUploadForm />
        </div>
      </div>
    </div>
  );
}