import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import Input from '../../../components/ui/Input';

export default function Step1Account() {
  const { data, setData, goNext, goBack, clerk, isClerkLoaded } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingVerification, setPendingVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!data.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (!data.lastName.trim()) nextErrors.lastName = 'Last name is required';
    if (!data.email.trim() || !data.email.includes('@')) nextErrors.email = 'Valid email is required';
    if (data.password.length < 8) nextErrors.password = 'Password must be at least 8 characters';

    return nextErrors;
  };

  const handleAuthSuccess = async (sessionId: string | null) => {
    if (!clerk) {
      goNext();
      return;
    }

    if (sessionId) {
      await clerk.setActive({ session: sessionId });
    }

    if (clerk.session) {
      const token = await clerk.session.getToken();
      if (token) localStorage.setItem('auth_token', token);
    }

    goNext();
  };

  const handleCreateAccount = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (!clerk?.client) {
        goNext();
        return;
      }

      if (clerk.session) {
        await clerk.signOut();
      }

      const baseUsername = data.email.trim().split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '');
      const randomSuffix = Math.floor(Math.random() * 10000);
      const signUp = await clerk.client.signUp.create({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        emailAddress: data.email.trim(),
        username: `${baseUsername}${randomSuffix}`,
        password: data.password,
      });

      if (signUp.status === 'complete') {
        await handleAuthSuccess(signUp.createdSessionId);
      } else if (signUp.unverifiedFields.includes('email_address')) {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setPendingVerification(true);
      } else {
        setErrors({ submit: `Account creation incomplete. Status: ${signUp.status}` });
      }
    } catch (err: unknown) {
      const errorObj = err as any;
      const msg = errorObj?.errors?.[0]?.message || errorObj?.message || 'Account creation failed';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otpCode.trim()) {
      setErrors({ submit: 'Please enter the verification code' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (!clerk?.client) {
        goNext();
        return;
      }

      const completeSignUp = await clerk.client.signUp.attemptEmailAddressVerification({
        code: otpCode,
      });

      if (completeSignUp.status === 'complete') {
        await handleAuthSuccess(completeSignUp.createdSessionId);
      } else {
        setErrors({ submit: `Verification failed. Status: ${completeSignUp.status}` });
      }
    } catch (err: unknown) {
      const errorObj = err as any;
      const msg = errorObj?.errors?.[0]?.message || errorObj?.message || 'Verification failed';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (pendingVerification) {
      void handleVerify();
      return;
    }

    void handleCreateAccount();
  };

  const handleChange = (field: string, value: string) => {
    setData({ [field]: value });
    setErrors((prev) => ({ ...prev, [field]: '', submit: '' }));
  };

  if (!isClerkLoaded) {
    return (
      <div className="onboarding-loading">
        <div>Loading secure account setup...</div>
      </div>
    );
  }

  return (
    <StepLayout
      title={pendingVerification ? 'Verify your email' : 'Create your account'}
      subtitle={pendingVerification ? 'Enter the code sent to your email address.' : 'Start with the admin account that will own this ERP workspace.'}
      onContinue={handleContinue}
      continueLabel={pendingVerification ? 'Verify code' : 'Create account'}
      isLoading={loading}
      onBack={pendingVerification ? () => { setPendingVerification(false); setOtpCode(''); setErrors({}); } : goBack}
    >
      {!pendingVerification ? (
        <>
          <div className="account-name-grid">
            <Input
              label="First name"
              placeholder="Sarah"
              value={data.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('firstName', e.target.value)}
              error={errors.firstName}
            />
            <Input
              label="Last name"
              placeholder="Jenkins"
              value={data.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lastName', e.target.value)}
              error={errors.lastName}
            />
          </div>

          <Input
            label="Email address"
            type="email"
            placeholder="sarah@company.com"
            value={data.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={data.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
            error={errors.password}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleContinue()}
          />
        </>
      ) : (
        <>
          <p className="verification-copy">
            Enter the verification code sent to <strong>{data.email}</strong>.
          </p>

          <Input
            label="Verification code"
            type="text"
            placeholder="123456"
            value={otpCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setOtpCode(e.target.value);
              setErrors({});
            }}
            error={errors.submit}
            autoFocus
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleContinue()}
          />
        </>
      )}

      {errors.submit && !pendingVerification && (
        <div className="form-submit-error">
          {errors.submit}
        </div>
      )}
    </StepLayout>
  );
}
