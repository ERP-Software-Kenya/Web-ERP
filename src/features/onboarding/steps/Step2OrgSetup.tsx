import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const INDUSTRIES = [
  'Retail & Wholesale',
  'Hardware & Construction Supplies',
  'Supermarket & Groceries',
  'Pharmacy & Healthcare Supplies',
  'Electronics & Appliances',
  'Automotive & Spare Parts',
  'Food, Beverage & Hospitality',
  'Manufacturing & Processing',
  'Agriculture & Agro-vet',
  'Transportation & Logistics',
  'Other Commercial Trading',
];

const COUNTRIES = [
  'Kenya',
  'Uganda',
  'Tanzania',
  'Rwanda',
  'Ethiopia',
  'South Sudan',
  'DR Congo',
  'Other',
];

export default function Step2OrgSetup() {
  const { data, setData, goNext, goBack } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const e: Record<string, string> = {};
    if (!data.orgName.trim()) e.orgName = 'Organization / Business name is required';
    if (!data.industry) e.industry = 'Please select your industry';
    if (!data.country) e.country = 'Please select your country';
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    goNext();
  };

  const handleChange = (field: string, value: string) => {
    setData({ [field]: value });
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <StepLayout
      title="Set up your workspace"
      subtitle="Configure your company branch profile and operational region."
      onContinue={handleContinue}
      onBack={goBack}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
        <Input
          label="Organization or business name"
          placeholder="e.g. Nairobi Super Hardware Ltd"
          autoComplete="organization"
          value={data.orgName}
          onChange={(e) => handleChange('orgName', e.target.value)}
          error={errors.orgName}
        />

        <Select
          label="Primary industry"
          placeholder="Select your business industry"
          options={INDUSTRIES}
          value={data.industry}
          onChange={(e) => handleChange('industry', e.target.value)}
          error={errors.industry}
        />

        <Select
          label="Country of operations"
          placeholder="Select country"
          options={COUNTRIES}
          value={data.country || 'Kenya'}
          onChange={(e) => handleChange('country', e.target.value)}
          error={errors.country}
        />

        {data.orgName.trim() && (
          <div className="org-setup-preview-banner" style={{ marginTop: 14 }}>
            <span>🏢</span>
            <span>
              Configuring live preview for <strong>"{data.orgName}"</strong>
            </span>
          </div>
        )}
      </form>
    </StepLayout>
  );
}
