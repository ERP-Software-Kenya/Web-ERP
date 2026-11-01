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

const CURRENCIES = [
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'UGX', name: 'Ugandan Shilling' },
  { code: 'TZS', name: 'Tanzanian Shilling' },
  { code: 'ETB', name: 'Ethiopian Birr' },
  { code: 'RWF', name: 'Rwandan Franc' },
  { code: 'GHS', name: 'Ghanaian Cedi' },
  { code: 'NGN', name: 'Nigerian Naira' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'Other', name: 'Other' },
];

const TIMEZONES = [
  'Africa/Nairobi',
  'Africa/Kampala',
  'Africa/Dar_es_Salaam',
  'Africa/Addis_Ababa',
  'Africa/Kigali',
  'Africa/Accra',
  'Africa/Lagos',
  'Africa/Johannesburg',
  'Asia/Kolkata',
  'Europe/London',
  'America/New_York',
  'UTC',
];

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const COUNTRY_DEFAULTS: Record<string, { currency: string; timezone: string; fiscalMonth: number }> = {
  'Kenya':          { currency: 'KES', timezone: 'Africa/Nairobi',       fiscalMonth: 7 },
  'Uganda':         { currency: 'UGX', timezone: 'Africa/Kampala',       fiscalMonth: 7 },
  'Tanzania':       { currency: 'TZS', timezone: 'Africa/Dar_es_Salaam', fiscalMonth: 7 },
  'Ethiopia':       { currency: 'ETB', timezone: 'Africa/Addis_Ababa',   fiscalMonth: 7 },
  'Rwanda':         { currency: 'RWF', timezone: 'Africa/Kigali',        fiscalMonth: 7 },
  'Ghana':          { currency: 'GHS', timezone: 'Africa/Accra',         fiscalMonth: 1 },
  'Nigeria':        { currency: 'NGN', timezone: 'Africa/Lagos',         fiscalMonth: 1 },
  'South Africa':   { currency: 'ZAR', timezone: 'Africa/Johannesburg',  fiscalMonth: 4 },
  'India':          { currency: 'INR', timezone: 'Asia/Kolkata',         fiscalMonth: 4 },
  'United Kingdom': { currency: 'GBP', timezone: 'Europe/London',        fiscalMonth: 4 },
  'United States':  { currency: 'USD', timezone: 'America/New_York',     fiscalMonth: 1 },
  'Other':          { currency: 'USD', timezone: 'UTC',                  fiscalMonth: 1 },
};

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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    setData({ country });
    setErrors(prev => ({ ...prev, country: '' }));

    const defaults = COUNTRY_DEFAULTS[country];
    if (defaults) {
      setData({
        baseCurrencyCode: defaults.currency,
        timeZone: defaults.timezone,
        fiscalYearStartMonth: defaults.fiscalMonth,
      });
    }
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
        onChange={handleCountryChange}
        error={errors.country}
      />

      <Input
        label="Tax ID (optional)"
        placeholder="VAT No. / GST No. / TIN (optional)"
        value={data.taxId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('taxId', e.target.value)}
      />

      <Select
        label="Base Currency"
        placeholder="Select currency"
        options={CURRENCIES.map(c => ({ value: c.code, label: `${c.code} — ${c.name}` }))}
        value={data.baseCurrencyCode}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData({ baseCurrencyCode: e.target.value })}
      />

      <Select
        label="Timezone"
        placeholder="Select timezone"
        options={TIMEZONES}
        value={data.timeZone}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData({ timeZone: e.target.value })}
      />

      <Select
        label="Fiscal Year Starts In"
        placeholder="Select month"
        options={MONTHS.map(m => ({ value: String(m.value), label: m.label }))}
        value={String(data.fiscalYearStartMonth)}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setData({ fiscalYearStartMonth: Number(e.target.value) })}
      />

      {data.country && (
        <p className="text-sm text-muted-foreground" style={{ marginTop: '-8px' }}>
          Currency, timezone, and fiscal year are auto-filled from your country — you can change these.
        </p>
      )}

      {data.orgName.trim() && (
        <div className="org-setup-preview-banner">
          <span>✨</span>
          <span>Your workspace <strong>"{data.orgName}"</strong> is being previewed on the right →</span>
        </div>
      )}
    </StepLayout>
  );
}
