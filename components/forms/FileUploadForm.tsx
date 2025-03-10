'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { fileUploadSchema, type FileUploadValues } from '@/lib/schemas/form-schemas';
import { formatFileSize } from '@/lib/utils';

// File upload form component with validation
export default function FileUploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Keep track of the file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      
      // Set the file in the form
      setValue('file', file, { shouldValidate: true });
    } else {
      setSelectedFile(null);
      setValue('file', null as unknown as File);
    }
  };
  
  // Handle file drag over
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  // Handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
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
  
  // Submit handler for the file upload form
  const onSubmit = async (data: FileUploadValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(0);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('file', data.file);
      
      // Create a custom fetch with upload progress
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      // Handle completion
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error'));
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
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };
  
  // File type validation error message
  const fileTypeError = errors.file?.message?.includes('JPEG, PNG, or PDF');
  
  // File size validation error message
  const fileSizeError = errors.file?.message?.includes('less than 5MB');
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">File Upload Form</h2>
        
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md" role="alert">
            <p className="font-medium">File uploaded successfully!</p>
            <p>Your file has been uploaded and saved.</p>
          </div>
        )}
        
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md" role="alert">
            <p className="font-medium">Error uploading file</p>
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
          
          <div className="space-y-2">
            <label 
              htmlFor="file" 
              className="block text-sm font-medium text-gray-700"
            >
              File Upload<span className="text-red-500 ml-1">*</span>
            </label>
            
            <div 
              className={`border-2 border-dashed rounded-md p-6 text-center ${
                errors.file ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-indigo-500'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                id="file"
                type="file"
                className="sr-only"
                accept=".jpg,.jpeg,.png,.pdf"
                {...register('file')}
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              
              <div className="space-y-2">
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    <Button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setValue('file', null as unknown as File);
                        
                        // Reset the file input
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      variant="outline"
                      size="sm"
                      className="mt-2"
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
                    <div className="text-sm text-gray-600">
                      <label
                        htmlFor="file"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                      </label>
                      <p className="pl-1 inline">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      JPEG, PNG or PDF up to 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {fileTypeError && (
              <FormError message="File must be JPEG, PNG, or PDF" />
            )}
            
            {fileSizeError && (
              <FormError message="File size must be less than 5MB" />
            )}
            
            {/* Other file-related errors */}
            {errors.file && !fileTypeError && !fileSizeError && (
              <FormError message={errors.file.message} />
            )}
          </div>
          
          {/* Upload progress bar (shown during upload) */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Uploading: {uploadProgress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
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
            >
              {isSubmitting ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}