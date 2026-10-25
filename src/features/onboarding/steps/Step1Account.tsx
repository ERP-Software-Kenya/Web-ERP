import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import Input from '../../../components/ui/Input';

export default function Step1Account() {
  const { data, setData, goNext, goBack, goTo, clerk, isClerkLoaded, refreshAuth, authError } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationKind, setVerificationKind] = useState<'signup' | 'signin'>('signup');
  const [otpCode, setOtpCode] = useState('');

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (mode === 'signup' && !data.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (mode === 'signup' && !data.lastName.trim()) nextErrors.lastName = 'Last name is required';
    if (!data.email.trim() || !data.email.includes('@')) nextErrors.email = 'Valid email is required';
    if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters';

    return nextErrors;
  };

  const handleAuthSuccess = async (sessionId: string | null) => {
    if (!clerk) {
      throw new Error('Secure account setup is unavailable. Please reload and try again.');
    }

    if (sessionId) {
      await clerk.setActive({ session: sessionId });
    }

    const me = await refreshAuth(clerk);
    if (me?.isOnboarded) goTo(8);
    else goNext();
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
        throw new Error('Clerk is not available. Please reload and try again.');
      }

      if (clerk.session) {
        await clerk.signOut();
      }

      if (mode === 'signin') {
        const signIn = await clerk.client.signIn.create({ identifier: data.email.trim(), password });
        if (signIn.status === 'complete') {
          await handleAuthSuccess(signIn.createdSessionId);
          return;
        }
        if (signIn.status === 'needs_second_factor' || signIn.status === 'needs_client_trust') {
          const emailFactor = signIn.supportedSecondFactors?.find((factor) => factor.strategy === 'email_code') as { strategy: 'email_code'; emailAddressId: string } | undefined;
          if (!emailFactor?.emailAddressId) throw new Error('No supported email verification method is available.');
          await signIn.prepareSecondFactor({ strategy: 'email_code', emailAddressId: emailFactor.emailAddressId });
          setVerificationKind('signin');
          setPendingVerification(true);
          return;
        }
        throw new Error(`Additional authentication is required (${signIn.status}).`);
      }

      const baseUsername = data.email.trim().split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '');
      const randomSuffix = Math.floor(Math.random() * 10000);
      const signUp = await clerk.client.signUp.create({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        emailAddress: data.email.trim(),
        username: `${baseUsername}${randomSuffix}`,
        password,
      });

      if (signUp.status === 'complete') {
        await handleAuthSuccess(signUp.createdSessionId);
      } else if (signUp.unverifiedFields.includes('email_address')) {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setVerificationKind('signup');
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
        throw new Error('Clerk is not available. Please reload and try again.');
      }

      const verification = verificationKind === 'signin'
        ? await clerk.client.signIn.attemptSecondFactor({ strategy: 'email_code', code: otpCode.trim() })
        : await clerk.client.signUp.attemptEmailAddressVerification({ code: otpCode.trim() });

      if (verification.status === 'complete') {
        await handleAuthSuccess(verification.createdSessionId);
      } else {
        setErrors({ submit: `Verification failed. Status: ${verification.status}` });
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
      title={pendingVerification ? 'Verify your email' : mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
      subtitle={pendingVerification ? 'Enter the code sent to your email address.' : mode === 'signin' ? 'Continue setting up your existing account.' : 'Start with the admin account that will own this ERP workspace.'}
      onContinue={handleContinue}
      continueLabel={pendingVerification ? 'Verify code' : mode === 'signin' ? 'Sign in' : 'Create account'}
      isLoading={loading}
      onBack={pendingVerification ? () => { setPendingVerification(false); setOtpCode(''); setErrors({}); } : goBack}
    >
      {!pendingVerification ? (
        <>
          {mode === 'signup' && <div className="account-name-grid">
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
          </div>}

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
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: '', submit: '' }));
            }}
            error={errors.password}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleContinue()}
          />
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setMode((current) => current === 'signup' ? 'signin' : 'signup');
              setErrors({});
            }}
          >
            {mode === 'signup' ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </button>
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
      {authError && !errors.submit && <div className="form-submit-error">{authError}</div>}
    </StepLayout>
  );
}
