import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const INDUSTRIES = [
  'Agriculture & Farming', 'Construction', 'Education', 'Food & Beverage',
  'Healthcare', 'Hospitality', 'Manufacturing', 'Retail & Wholesale',
  'Technology', 'Transportation & Logistics', 'Other',
];

const COUNTRIES = [
  'Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda', 'Ghana',
  'Nigeria', 'South Africa', 'India', 'United Kingdom', 'United States', 'Other',
];

export default function Step2OrgSetup() {
  const { data, setData, goNext, goBack } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const e: Record<string, string> = {};
    if (!data.orgName.trim()) e.orgName = 'Organization name is required';
    if (!data.industry) e.industry = 'Please select your industry';
    if (!data.country) e.country = 'Please select your country';
    if (Object.keys(e).length) { setErrors(e); return; }
    goNext();
  };

  const handleChange = (field: string, value: string) => {
    setData({ [field]: value });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <StepLayout
      title="Set up your workspace"
      subtitle="Personalize your ERP with your organization details."
      onContinue={handleContinue}
      onBack={goBack}
    >
      <Input
        label="Organization name"
        placeholder="Nexus Innovations"
        value={data.orgName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('orgName', e.target.value)}
        error={errors.orgName}
        autoFocus
      />

      <Select
        label="Industry"
        placeholder="Select your industry"
        options={INDUSTRIES}
        value={data.industry}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('industry', e.target.value)}
        error={errors.industry}
      />

      <Select
        label="Country"
        placeholder="Select your country"
        options={COUNTRIES}
        value={data.country}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('country', e.target.value)}
        error={errors.country}
      />

      {data.orgName.trim() && (
        <div className="org-setup-preview-banner">
          <span>✨</span>
          <span>Your workspace <strong>"{data.orgName}"</strong> is being previewed on the right →</span>
        </div>
      )}
    </StepLayout>
  );
}
