import { DynamicFieldValues, DynamicFormValues } from "@/lib/schemas/form-schemas";
import { generateId } from "@/lib/utils";
import { useState } from "react";

export function useDynamicForm() {
    const [fields, setFields] = useState<DynamicFieldValues[]>([]);
    const [formName, setFormName] = useState('');
    const [fieldBeingEdited, setFieldBeingEdited] = useState<DynamicFieldValues | null>(null);
    
    const addField = (field: DynamicFieldValues) => {
      const newField = {
        ...field,
        id: field.id || generateId(),
      };
      
      if (fieldBeingEdited) {
        setFields(prev => 
          prev.map(f => f.id === fieldBeingEdited.id ? newField : f)
        );
        setFieldBeingEdited(null);
      } else {
        setFields(prev => [...prev, newField]);
      }
      
      return newField;
    };
    
    const editField = (field: DynamicFieldValues) => {
      setFieldBeingEdited(field);
      return field;
    };
    
    const removeField = (id: string) => {
      setFields(prev => prev.filter(field => field.id !== id));
      
      if (fieldBeingEdited && fieldBeingEdited.id === id) {
        setFieldBeingEdited(null);
      }
    };
    
    const generateFormData = (): DynamicFormValues => {
      return {
        formName,
        fields: fields.map(field => {
          if (['select', 'radio', 'checkbox'].includes(field.type) && !field.options) {
            return { ...field, options: [] };
          }
          return field;
        }),
      };
    };
    
    return {
      fields,
      formName,
      setFormName,
      fieldBeingEdited,
      addField,
      editField,
      removeField,
      generateFormData,
      clearFieldBeingEdited: () => setFieldBeingEdited(null),
    };
  }