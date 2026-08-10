import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '../../../components/ui/Input';

// 1. Define your schema using Zod
const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'user', 'manager'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
});

// Infer the TypeScript type from the schema
type UserFormData = z.infer<typeof userSchema>;

export default function ExampleForm() {
  // 2. Initialize react-hook-form with the zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'user',
    }
  });

  // 3. Handle submission
  const onSubmit = async (data: UserFormData) => {
    try {
      console.log('Valid Form Data Submitted:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      reset(); // clear form on success
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '24px', background: 'var(--color-surface)', borderRadius: '12px' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '1.25rem' }}>Create User (React Hook Form + Zod)</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input
            label="First Name"
            placeholder="Jane"
            {...register('firstName')} // Replace manual onChange/value binding!
            error={errors.firstName?.message}
          />
          
          <Input
            label="Last Name"
            placeholder="Doe"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>Role</label>
          <select 
            {...register('role')}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              border: `1px solid ${errors.role ? 'var(--color-error)' : 'var(--color-border)'}`,
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
            }}
          >
            <option value="user">Standard User</option>
            <option value="manager">Manager</option>
            <option value="admin">Administrator</option>
          </select>
          {errors.role && <span style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>{errors.role.message}</span>}
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isSubmitting}
          style={{ marginTop: '8px' }}
        >
          {isSubmitting ? 'Saving...' : 'Save User'}
        </button>

      </form>
    </div>
  );
}
