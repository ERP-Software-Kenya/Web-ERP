import { useState, useCallback } from 'react';

type Validator<T> = (data: T) => Partial<Record<keyof T, string>>;

export function useForm<T>(initialData: T, validate: Validator<T>) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T, value: T[keyof T]) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    setErrors(prev => {
      const newErrs = { ...prev };
      delete newErrs[field];
      return newErrs;
    });
  }, []);

  const handleSubmit = useCallback(async (onSubmit: (validData: T) => void | Promise<void>) => {
    const newErrors = validate(data);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validate]);

  return {
    data,
    setData,
    errors,
    setErrors,
    handleChange,
    handleSubmit,
    isSubmitting
  };
}
