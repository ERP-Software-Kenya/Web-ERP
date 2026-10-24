import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import Input from '../../../components/ui/Input';
import GoogleIcon from '../../../components/icons/GoogleIcon';

export default function Step1Account() {
  const { data, setData, goNext, goBack, clerk, isClerkLoaded } = useOnboarding();
  const [localPassword, setLocalPassword] = useState(data.password || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pendingVerification, setPendingVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'var(--color-error)' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'var(--color-warning)' };
    if (score === 3) return { score: 3, label: 'Good', color: '#3b82f6' };
    return { score: 4, label: 'Strong', color: 'var(--color-success)' };
  };

  const strength = calculatePasswordStrength(localPassword);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!data.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (!data.lastName.trim()) nextErrors.lastName = 'Last name is required';
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      nextErrors.email = 'Valid business email is required';
    }
    if (localPassword.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters';
    }

    return nextErrors;
  };

  const handleGoogleAuth = async () => {
    if (!clerk?.client) {
      goNext();
      return;
    }
    try {
      setLoading(true);
      setErrors({});
      await clerk.client.signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/sso-callback`,
      });
    } catch (err: unknown) {
      const errorObj = err as any;
      const msg = errorObj?.errors?.[0]?.message || errorObj?.message || 'Google sign-in could not be initiated.';
      setErrors({ submit: msg });
      setLoading(false);
    }
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
        password: localPassword,
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
      const msg = errorObj?.errors?.[0]?.message || errorObj?.message || 'Account creation failed. Please verify your details.';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrors({ submit: 'Please enter the 6-digit verification code' });
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
        code: otpCode.trim(),
      });

      if (completeSignUp.status === 'complete') {
        await handleAuthSuccess(completeSignUp.createdSessionId);
      } else {
        setErrors({ submit: `Verification failed. Status: ${completeSignUp.status}` });
      }
    } catch (err: unknown) {
      const errorObj = err as any;
      const msg = errorObj?.errors?.[0]?.message || errorObj?.message || 'Verification failed. Please check the code.';
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
      <div className="onboarding-loading" role="status" aria-live="polite">
        <div>Initializing secure setup...</div>
      </div>
    );
  }

  return (
    <StepLayout
      title={pendingVerification ? 'Verify your email' : 'Create your admin account'}
      subtitle={pendingVerification ? `Enter the 6-digit code sent to ${data.email}.` : 'This admin account will manage your Pramukh Digital ERP workspace.'}
      onContinue={handleContinue}
      continueLabel={pendingVerification ? 'Verify code' : 'Create account'}
      isLoading={loading}
      onBack={pendingVerification ? () => { setPendingVerification(false); setOtpCode(''); setErrors({}); } : goBack}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} style={{ display: 'flex', flexDirection: 'column' }}>
        {!pendingVerification ? (
          <>
            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{ marginBottom: 16 }}
            >
              <GoogleIcon size={18} />
              <span>Continue with Google</span>
            </button>

            <div className="divider-or">
              <span>or register with email</span>
            </div>

            <div className="account-name-grid" style={{ marginTop: 12 }}>
              <Input
                label="First name"
                placeholder="Sarah"
                autoComplete="given-name"
                value={data.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
              />
              <Input
                label="Last name"
                placeholder="Jenkins"
                autoComplete="family-name"
                value={data.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
              />
            </div>

            <Input
              label="Work email address"
              type="email"
              autoComplete="email"
              placeholder="sarah@company.com"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              showPasswordToggle
              value={localPassword}
              onChange={(e) => {
                setLocalPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: '', submit: '' }));
              }}
              error={errors.password}
            />

            {localPassword && (
              <div style={{ marginTop: -10, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Strength:</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: strength.color }}>{strength.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, height: 4 }}>
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      style={{
                        flex: 1,
                        borderRadius: 2,
                        background: step <= strength.score ? strength.color : 'var(--color-border)',
                        transition: 'background 0.2s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="verification-copy">
              We just sent a 6-digit confirmation code to <strong>{data.email}</strong>.
            </p>

            <Input
              label="Verification code"
              type="text"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              value={otpCode}
              onChange={(e) => {
                setOtpCode(e.target.value);
                setErrors({});
              }}
              error={errors.submit}
            />
          </>
        )}

        {errors.submit && !pendingVerification && (
          <div className="form-submit-error" role="alert" aria-live="assertive">
            {errors.submit}
          </div>
        )}
      </form>
    </StepLayout>
  );
}
