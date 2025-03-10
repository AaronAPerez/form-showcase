'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { fileUploadSchema, type FileUploadValues } from '@/lib/schemas/form-schemas';
import { formatFileSize } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * Accessible File Upload Form Component
 * 
 * Features:
 * - Drag and drop file upload with keyboard accessibility
 * - ARIA live regions for status announcements
 * - Focus management for all interactions
 * - Progress tracking with ARIA attributes
 * - Comprehensive error handling
 */
export default function FileUploadForm() {
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // Status announcements for screen readers
  const [statusAnnouncement, setStatusAnnouncement] = useState<string | null>(null);
  
  // Keep track of refs for focus management
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const formStartRef = useRef<HTMLHeadingElement>(null);
  
  // Set up form with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FileUploadValues>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setStatusAnnouncement(`File selected: ${file.name}, size: ${formatFileSize(file.size)}`);
      
      // Set the file in the form
      setValue('file', file, { shouldValidate: true });
    } else {
      setSelectedFile(null);
      setValue('file', null as unknown as File);
      setStatusAnnouncement('No file selected');
    }
  };
  
  // Handle file drag over
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };
  
  // Handle drag leave
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
  };
  
  // Handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
    
    const files = event.dataTransfer.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setStatusAnnouncement(`File dropped: ${file.name}, size: ${formatFileSize(file.size)}`);
      
      // Set the file in the form
      setValue('file', file, { shouldValidate: true });
      
      // Update the file input
      if (fileInputRef.current) {
        // Create a DataTransfer object to set the files
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };
  
  // Handle keyboard interaction with dropzone
  const handleDropzoneKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Space or Enter to open file dialog
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  };
  
  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
    setValue('file', null as unknown as File, { shouldValidate: false });
    setStatusAnnouncement('File has been removed');
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Return focus to dropzone
    setTimeout(() => {
      dropzoneRef.current?.focus();
    }, 100);
  };
  
  // Submit handler for the file upload form
  const onSubmit = async (data: FileUploadValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(0);
    setStatusAnnouncement('Upload starting. Please wait...');
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('file', data.file);
      
      // Create a custom XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
          
          // Announce progress at 25%, 50%, 75%, and 100%
          if (progress === 25 || progress === 50 || progress === 75 || progress === 100) {
            setStatusAnnouncement(`Upload is ${progress}% complete`);
          }
        }
      });
      
      // Handle completion
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error('Upload failed with status: ' + xhr.status));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error occurred during upload'));
        });
        
        xhr.addEventListener('abort', () => {
          reject(new Error('Upload was aborted'));
        });
      });
      
      // Start the upload
      xhr.open('POST', '/api/forms/file-upload');
      xhr.send(formData);
      
      // Wait for completion
      await uploadPromise;
      
      // If successful, reset form and show success message
      reset();
      setSelectedFile(null);
      setSubmitSuccess(true);
      setStatusAnnouncement('File successfully uploaded. Form has been reset.');
      
      // Focus back to the beginning of the form
      setTimeout(() => {
        formStartRef.current?.focus();
      }, 100);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setStatusAnnouncement(`Upload failed: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };
  
  // Clear status announcements after they've been read
  useEffect(() => {
    if (statusAnnouncement) {
      const timer = setTimeout(() => {
        setStatusAnnouncement(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [statusAnnouncement]);
  
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Skip to main content link */}
      <a 
        href="#file-form-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-2 focus:bg-indigo-600 focus:text-white focus:rounded-md"
      >
        Skip to form content
      </a>
      
      {/* Status announcements for screen readers */}
      <div aria-live="assertive" className="sr-only" role="status">
        {statusAnnouncement}
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 
          className="text-xl font-semibold text-gray-800 mb-6"
          ref={formStartRef}
          tabIndex={-1}
          id="file-upload-heading"
        >
          File Upload Form
        </h2>
        
        {submitSuccess && (
          <div 
            className="mb-6 p-4 bg-green-50 text-green-700 rounded-md" 
            role="alert"
          >
            <p className="font-medium">File uploaded successfully!</p>
            <p>Your file has been uploaded and saved.</p>
          </div>
        )}
        
        {submitError && (
          <div 
            className="mb-6 p-4 bg-red-50 text-red-700 rounded-md" 
            role="alert"
          >
            <p className="font-medium">Error uploading file</p>
            <p>{submitError}</p>
          </div>
        )}
        
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6"
          id="file-form-content"
          aria-labelledby="file-upload-heading"
        >
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
          
          <div className="space-y-2">
            <label 
              htmlFor="file" 
              className="block text-sm font-medium text-gray-700"
              id="file-upload-label"
            >
              File Upload<span className="text-red-500 ml-1" aria-hidden="true">*</span>
              <span className="sr-only">(Required)</span>
            </label>
            
            <div 
              className={cn(
                "border-2 border-dashed rounded-md p-6 text-center transition-colors",
                isDraggingOver && "border-indigo-300 bg-indigo-50",
                errors.file ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-indigo-500",
                "focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:outline-none"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              ref={dropzoneRef}
              tabIndex={0}
              role="button"
              aria-controls="file"
              aria-describedby="file-upload-description file-upload-constraints"
              onKeyDown={handleDropzoneKeyDown}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                id="file"
                type="file"
                className="sr-only"
                accept=".jpg,.jpeg,.png,.pdf"
                {...register('file')}
                onChange={handleFileChange}
                ref={fileInputRef}
                aria-labelledby="file-upload-label"
                aria-describedby={
                  errors.file 
                    ? 'file-upload-error' 
                    : 'file-upload-description file-upload-constraints'
                }
                aria-invalid={!!errors.file}
              />
              
              <div className="space-y-2">
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering file dialog
                        clearFile();
                      }}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      aria-label={`Remove file ${selectedFile.name}`}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="text-sm text-gray-600" id="file-upload-description">
                      <span className="relative font-medium text-indigo-600 hover:text-indigo-500">
                        Upload a file
                      </span>
                      <span className="pl-1 inline">or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500" id="file-upload-constraints">
                      JPEG, PNG or PDF up to 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {/* File validation error messages */}
            {errors.file && (
              <div 
                className="text-sm text-red-600 mt-1"
                id="file-upload-error"
                role="alert"
              >
                {errors.file.message}
              </div>
            )}
            
            {/* Instructions for screen readers */}
            <div className="sr-only" id="file-upload-instructions">
              Press Enter or Space to open the file browser. You can also drag and drop a file onto this area.
              Acceptable file types are JPEG, PNG, or PDF with a maximum size of 5 megabytes.
            </div>
          </div>
          
          {/* Upload progress bar (shown during upload) */}
          {isSubmitting && uploadProgress > 0 && (
            <div 
              className="mt-4"
              role="region"
              aria-label="Upload progress"
            >
              <p className="text-sm font-medium text-gray-700 mb-1">
                Uploading: {uploadProgress}%
              </p>
              <div 
                className="w-full bg-gray-200 rounded-full h-2.5"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={uploadProgress}
                aria-label={`Upload progress: ${uploadProgress}%`}
              >
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              aria-label={isSubmitting ? "Uploading file" : "Upload file"}
            >
              {isSubmitting ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : 'Upload File'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}