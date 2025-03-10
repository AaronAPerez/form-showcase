'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { 
  type DynamicFieldValues, 
  type DynamicFormValues
} from '@/lib/schemas/form-schemas';
import { generateId } from '@/lib/utils';
import { cn } from '@/lib/utils';

/**
 * Dynamic Form Builder Component
 * 
 * Allows users to create custom forms by adding and configuring various field types.
 * Includes robust accessibility features for all user interactions.
 */
export default function DynamicForm() {
  // State for our form fields
  const [fields, setFields] = useState<DynamicFieldValues[]>([]);
  const [formName, setFormName] = useState('');
  const [fieldBeingEdited, setFieldBeingEdited] = useState<DynamicFieldValues | null>(null);
  
  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // State for accessibility announcements
  const [statusAnnouncement, setStatusAnnouncement] = useState<string | null>(null);
  
  // Refs for focus management
  const formNameInputRef = useRef<HTMLInputElement>(null);
  const addFieldButtonRef = useRef<HTMLButtonElement>(null);
  const fieldListRef = useRef<HTMLDivElement>(null);
  const configPanelRef = useRef<HTMLDivElement>(null);
  
  // Setup form for adding/editing fields
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DynamicFieldValues>({
    defaultValues: {
      id: '',
      label: '',
      type: 'text',
      required: false,
      options: [],
    },
  });
  
  // Watch the field type to conditionally render option inputs
  const fieldType = watch('type');
  
  // Generate form data for submission
  const generateFormData = (): DynamicFormValues => {
    return {
      formName: formName,
      fields: fields.map(field => {
        // For fields that can have options, ensure the options property exists
        if (['select', 'radio', 'checkbox'].includes(field.type) && !field.options) {
          return { ...field, options: [] };
        }
        return field;
      }),
    };
  };
  
  // Add a new field to the form
  const addField = (data: DynamicFieldValues) => {
    const newField = {
      ...data,
      id: data.id || generateId(),
    };
    
    if (fieldBeingEdited) {
      // Update existing field
      setFields(prev => 
        prev.map(field => 
          field.id === fieldBeingEdited.id ? newField : field
        )
      );
      setFieldBeingEdited(null);
      setStatusAnnouncement(`Field "${newField.label}" has been updated.`);
    } else {
      // Add new field
      setFields(prev => [...prev, newField]);
      setStatusAnnouncement(`Field "${newField.label}" has been added.`);
    }
    
    // Reset form
    reset({
      id: '',
      label: '',
      type: 'text',
      required: false,
      options: [],
    });
    
    // Focus the add field button after adding/updating a field
    setTimeout(() => {
      addFieldButtonRef.current?.focus();
    }, 100);
  };
  
  // Edit an existing field
  const editField = (field: DynamicFieldValues) => {
    setFieldBeingEdited(field);
    setStatusAnnouncement(`Editing field "${field.label}". You can now modify its properties.`);
    
    // Set form values
    setValue('id', field.id);
    setValue('label', field.label);
    setValue('type', field.type);
    setValue('required', field.required);
    
    if (field.options) {
      setValue('options', field.options);
    }
    
    // Focus the config panel
    setTimeout(() => {
      configPanelRef.current?.focus();
    }, 100);
  };
  
  // Remove a field
  const removeField = (id: string, label: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
    setStatusAnnouncement(`Field "${label}" has been removed.`);
    
    // If the field being edited is being removed, clear the edit state
    if (fieldBeingEdited && fieldBeingEdited.id === id) {
      setFieldBeingEdited(null);
      reset({
        id: '',
        label: '',
        type: 'text',
        required: false,
        options: [],
      });
    }
    
    // Return focus to field list
    setTimeout(() => {
      fieldListRef.current?.focus();
    }, 100);
  };
  
  // Handle form options (for select, radio, checkbox)
  const handleOptionChange = (index: number, value: string) => {
    const currentOptions = watch('options') || [];
    const newOptions = [...currentOptions];
    
    if (!newOptions[index]) {
      newOptions[index] = { label: '', value: '' };
    }
    
    newOptions[index].label = value;
    newOptions[index].value = value.toLowerCase().replace(/\s+/g, '_');
    
    setValue('options', newOptions);
  };
  
  // Add an option
  const addOption = () => {
    const currentOptions = watch('options') || [];
    setValue('options', [...currentOptions, { label: '', value: '' }]);
    setStatusAnnouncement('New option added. Please enter a label for this option.');
  };
  
  // Remove an option
  const removeOption = (index: number) => {
    const currentOptions = watch('options') || [];
    setValue('options', currentOptions.filter((_, i) => i !== index));
    setStatusAnnouncement('Option removed.');
  };
  
  // Handle keyboard navigation for field list
  const handleFieldListKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    field: DynamicFieldValues,
    index: number
  ) => {
    // Handle keyboard navigation in the field list
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      const prevRow = document.querySelector(`#field-row-${index - 1}`) as HTMLElement;
      prevRow?.focus();
    } else if (e.key === 'ArrowDown' && index < fields.length - 1) {
      e.preventDefault();
      const nextRow = document.querySelector(`#field-row-${index + 1}`) as HTMLElement;
      nextRow?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      editField(field);
    }
  };
  
  // Submit the form configuration
  const handleFormSubmit = async () => {
    // Validate form name
    if (!formName.trim()) {
      setSubmitError('Please enter a form name');
      setStatusAnnouncement('Error: Please enter a form name.');
      formNameInputRef.current?.focus();
      return;
    }
    
    // Validate that we have at least one field
    if (fields.length === 0) {
      setSubmitError('Please add at least one field to your form');
      setStatusAnnouncement('Error: Please add at least one field to your form.');
      addFieldButtonRef.current?.focus();
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setStatusAnnouncement('Saving your form, please wait...');
    
    try {
      // Prepare form data
      const formData = generateFormData();
      
      // Submit to API
      const response = await fetch('/api/forms/dynamic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      // Show success message and reset form
      setSubmitSuccess(true);
      setStatusAnnouncement('Form configuration saved successfully.');
      setFields([]);
      setFormName('');
      
      // Focus the form name input
      setTimeout(() => {
        formNameInputRef.current?.focus();
      }, 100);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setStatusAnnouncement(`Error saving form: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Clear announcements after they've been read
  useEffect(() => {
    if (statusAnnouncement) {
      const timer = setTimeout(() => {
        setStatusAnnouncement(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [statusAnnouncement]);
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Skip to main content link */}
      <a 
        href="#form-builder-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-2 focus:bg-indigo-600 focus:text-white focus:rounded-md"
      >
        Skip to form builder
      </a>
      
      {/* ARIA live regions for announcements */}
      <div aria-live="assertive" className="sr-only" role="status">
        {statusAnnouncement}
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 
          className="text-xl font-semibold text-gray-800 mb-6"
          tabIndex={-1}
          id="form-builder-heading"
        >
          Dynamic Form Builder
        </h2>
        
        {submitSuccess && (
          <div 
            className="mb-6 p-4 bg-green-50 text-green-700 rounded-md" 
            role="alert"
            aria-live="polite"
          >
            <p className="font-medium">Form configuration saved successfully!</p>
            <p>Your dynamic form has been created and saved.</p>
          </div>
        )}
        
        {submitError && (
          <div 
            className="mb-6 p-4 bg-red-50 text-red-700 rounded-md" 
            role="alert"
            aria-live="assertive"
          >
            <p className="font-medium">Error saving form</p>
            <p>{submitError}</p>
          </div>
        )}
        
        <div className="mb-8" id="form-builder-content">
          <div className="mb-6">
            <label 
              htmlFor="formName" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Form Name<span className="text-red-500 ml-1" aria-hidden="true">*</span>
              <span className="sr-only">(Required)</span>
            </label>
            <input
              id="formName"
              type="text"
              className="w-full rounded-md border border-input p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter a name for your form"
              required
              aria-required="true"
              ref={formNameInputRef}
            />
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 
              className="text-lg font-medium text-gray-800 mb-4"
              id="field-configuration-heading"
              ref={configPanelRef}
              tabIndex={-1}
            >
              {fieldBeingEdited ? 'Edit Field' : 'Add a New Field'}
            </h3>
            
            <form 
              onSubmit={handleSubmit(addField)} 
              className="space-y-4"
              aria-labelledby="field-configuration-heading"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Field Label"
                  {...register('label', { required: 'Label is required' })}
                  error={errors.label?.message}
                  placeholder="e.g. Full Name"
                  required
                  aria-required="true"
                />
                
                <div className="space-y-2">
                  <label 
                    htmlFor="fieldType" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Field Type<span className="text-red-500 ml-1" aria-hidden="true">*</span>
                    <span className="sr-only">(Required)</span>
                  </label>
                  <select
                    id="fieldType"
                    className="w-full rounded-md border border-input p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register('type', { required: 'Type is required' })}
                    aria-required="true"
                    aria-describedby={errors.type ? "type-error" : undefined}
                    aria-invalid={!!errors.type}
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio</option>
                    <option value="select">Select</option>
                  </select>
                  {errors.type && (
                    <FormError message={errors.type.message} id="type-error" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="fieldRequired"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  {...register('required')}
                  aria-describedby="required-description"
                />
                <label 
                  htmlFor="fieldRequired" 
                  className="ml-2 text-sm text-gray-700"
                >
                  Required field
                </label>
                <p id="required-description" className="sr-only">
                  Check this box if users must complete this field
                </p>
              </div>
              
              {/* Options for select, radio, or checkbox fields */}
              {['select', 'radio'].includes(fieldType) && (
                <div className="mt-4" role="region" aria-labelledby="options-heading">
                  <label className="block text-sm font-medium text-gray-700 mb-2" id="options-heading">
                    Options<span className="text-red-500 ml-1" aria-hidden="true">*</span>
                    <span className="sr-only">(Required)</span>
                  </label>
                  
                  <div className="space-y-2">
                    <Controller
                      control={control}
                      name="options"
                      render={({ field }) => (
                        <>
                          {(field.value || []).length === 0 && (
                            <p className="text-sm text-gray-500 mb-2">
                              No options added yet. Use the button below to add options.
                            </p>
                          )}
                          
                          {(field.value || []).map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={option.label}
                                onChange={e => handleOptionChange(index, e.target.value)}
                                className="flex-1 rounded-md border border-input p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder={`Option ${index + 1}`}
                                aria-label={`Option ${index + 1}`}
                              />
                              <Button
                                type="button"
                                onClick={() => removeOption(index)}
                                size="sm"
                                variant="destructive"
                                aria-label={`Remove option ${option.label || index + 1}`}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            onClick={addOption}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            aria-label="Add new option"
                          >
                            Add Option
                          </Button>
                        </>
                      )}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setFieldBeingEdited(null);
                    reset({
                      id: '',
                      label: '',
                      type: 'text',
                      required: false,
                      options: [],
                    });
                    setStatusAnnouncement('Field editing cancelled.');
                    
                    // Return focus to add field button
                    setTimeout(() => {
                      addFieldButtonRef.current?.focus();
                    }, 100);
                  }}
                  variant="outline"
                  aria-label="Cancel field editing"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  ref={addFieldButtonRef}
                  aria-label={fieldBeingEdited ? `Update field ${fieldBeingEdited.label}` : "Add new field"}
                >
                  {fieldBeingEdited ? 'Update Field' : 'Add Field'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Field list */}
        <div className="mt-8">
          <h3 
            className="text-lg font-medium text-gray-800 mb-4"
            id="form-fields-heading"
          >
            Form Fields
          </h3>
          
          <div 
            ref={fieldListRef}
            tabIndex={fields.length === 0 ? -1 : 0}
            aria-labelledby="form-fields-heading"
            role="region"
            className={cn(
              "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              {"rounded-md": fields.length > 0}
            )}
          >
            {fields.length === 0 ? (
              <div 
                className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-md bg-gray-50"
                aria-live="polite"
              >
                No fields added yet. Use the form above to add fields to your form.
              </div>
            ) : (
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table 
                  className="min-w-full divide-y divide-gray-200"
                  aria-labelledby="form-fields-heading"
                >
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Label
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Required
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Options
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {fields.map((field, index) => (
                      <tr 
                        key={field.id}
                        id={`field-row-${index}`}
                        tabIndex={0}
                        onKeyDown={(e) => handleFieldListKeyDown(e, field, index)}
                        className="hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        aria-label={`Field ${index + 1}: ${field.label}, type: ${field.type}, ${field.required ? 'required' : 'optional'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {field.label}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {field.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {field.required ? (
                            <span className="inline-flex items-center">
                              Yes
                              <svg 
                                className="ml-1 h-4 w-4 text-green-500" 
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
                            </span>
                          ) : 'No'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {field.options && field.options.length > 0 ? (
                            <span>{field.options.map(o => o.label).join(', ')}</span>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              onClick={() => editField(field)}
                              variant="outline"
                              size="sm"
                              aria-label={`Edit field ${field.label}`}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              onClick={() => removeField(field.id, field.label)}
                              variant="destructive"
                              size="sm"
                              aria-label={`Delete field ${field.label}`}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="flex justify-end mt-6">
            <Button
              type="button"
              onClick={handleFormSubmit}
              disabled={isSubmitting || fields.length === 0 || !formName}
              className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={
                isSubmitting 
                  ? 'Saving form...' 
                  : fields.length === 0 
                  ? 'Save Form (add fields first)' 
                  : !formName 
                  ? 'Save Form (enter form name first)'
                  : 'Save Form'
              }
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Form'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}