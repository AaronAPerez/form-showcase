'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { 
  type DynamicFieldValues, 
  type DynamicFormValues
} from '@/lib/schemas/form-schemas';
import { generateId } from '@/lib/utils';

// A form that allows users to dynamically add and configure fields.
export default function DynamicForm() {
  // State for our form fields
  const [fields, setFields] = useState<DynamicFieldValues[]>([]);
  const [formName, setFormName] = useState('');
  const [fieldBeingEdited, setFieldBeingEdited] = useState<DynamicFieldValues | null>(null);
  
  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
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
    } else {
      // Add new field
      setFields(prev => [...prev, newField]);
    }
    
    // Reset form
    reset({
      id: '',
      label: '',
      type: 'text',
      required: false,
      options: [],
    });
  };
  
  // Edit an existing field
  const editField = (field: DynamicFieldValues) => {
    setFieldBeingEdited(field);
    
    // Set form values
    setValue('id', field.id);
    setValue('label', field.label);
    setValue('type', field.type);
    setValue('required', field.required);
    
    if (field.options) {
      setValue('options', field.options);
    }
  };
  
  // Remove a field
  const removeField = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
    
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
  };
  
  // Remove an option
  const removeOption = (index: number) => {
    const currentOptions = watch('options') || [];
    setValue('options', currentOptions.filter((_, i) => i !== index));
  };
  
  // Submit the form configuration
  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
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
      setFields([]);
      setFormName('');
      
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Dynamic Form Builder</h2>
        
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md" role="alert">
            <p className="font-medium">Form configuration saved successfully!</p>
            <p>Your dynamic form has been created and saved.</p>
          </div>
        )}
        
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md" role="alert">
            <p className="font-medium">Error saving form</p>
            <p>{submitError}</p>
          </div>
        )}
        
        <div className="mb-8">
          <div className="mb-6">
            <label 
              htmlFor="formName" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Form Name<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              id="formName"
              type="text"
              className="w-full rounded-md border border-input p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter a name for your form"
              required
            />
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {fieldBeingEdited ? 'Edit Field' : 'Add a New Field'}
            </h3>
            
            <form onSubmit={handleSubmit(addField)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Field Label"
                  {...register('label', { required: 'Label is required' })}
                  error={errors.label?.message}
                  placeholder="e.g. Full Name"
                  required
                />
                
                <div className="space-y-2">
                  <label 
                    htmlFor="fieldType" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Field Type<span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    id="fieldType"
                    className="w-full rounded-md border border-input p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register('type', { required: 'Type is required' })}
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio</option>
                    <option value="select">Select</option>
                  </select>
                  {errors.type && (
                    <FormError message={errors.type.message} />
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="fieldRequired"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  {...register('required')}
                />
                <label 
                  htmlFor="fieldRequired" 
                  className="ml-2 text-sm text-gray-700"
                >
                  Required field
                </label>
              </div>
              
              {/* Options for select, radio, or checkbox fields */}
              {['select', 'radio'].includes(fieldType) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options<span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  <div className="space-y-2">
                    <Controller
                      control={control}
                      name="options"
                      render={({ field }) => (
                        <>
                          {(field.value || []).map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={option.label}
                                onChange={e => handleOptionChange(index, e.target.value)}
                                className="flex-1 rounded-md border border-input p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder={`Option ${index + 1}`}
                              />
                              <Button
                                type="button"
                                onClick={() => removeOption(index)}
                                size="sm"
                                variant="destructive"
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
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {fieldBeingEdited ? 'Update Field' : 'Add Field'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Field list */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Form Fields</h3>
          
          {fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-md bg-gray-50">
              No fields added yet. Use the form above to add fields to your form.
            </div>
          ) : (
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
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
                  {fields.map((field) => (
                    <tr key={field.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {field.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.required ? 'Yes' : 'No'}
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
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            onClick={() => removeField(field.id)}
                            variant="destructive"
                            size="sm"
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
          
          <div className="flex justify-end mt-6">
            <Button
              type="button"
              onClick={handleFormSubmit}
              disabled={isSubmitting || fields.length === 0 || !formName}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isSubmitting ? 'Saving...' : 'Save Form'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}