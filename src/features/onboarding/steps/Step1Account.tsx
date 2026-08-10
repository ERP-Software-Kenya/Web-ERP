import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clerk } from '@clerk/clerk-js';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import Input from '../../../components/ui/Input';

export default function Step1Account() {
  const { data, setData, goNext, goBack, clerk, isClerkLoaded, isSignedIn } = useOnboarding();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const initialMode = new URLSearchParams(location.search).get('mode') === 'signin' ? 'signin' : 'signup';
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  
  // OTP Verification state
  const [pendingVerification, setPendingVerification] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    if (isClerkLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isClerkLoaded, isSignedIn, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'signup') {
      if (!data.firstName.trim()) e.firstName = 'First name is required';
      if (!data.lastName.trim()) e.lastName = 'Last name is required';
      if (data.password.length < 8) e.password = 'Password must be at least 8 characters';
    } else {
      if (!data.password.trim()) e.password = 'Password is required';
    }
    if (!data.email.trim() || !data.email.includes('@')) e.email = 'Valid email is required';
    return e;
  };

  const handleAuthSuccess = async (sessionId: string | null) => {
    if (!clerk) return;
    if (sessionId) {
      await clerk.setActive({ session: sessionId });
    }
    
    if (clerk.session) {
      const token = await clerk.session.getToken();
      if (token) localStorage.setItem('auth_token', token);
    }

    if (mode === 'signin') {
      try {
        const memberships = await clerk.user?.getOrganizationMemberships();
        if (memberships && memberships.data && memberships.data.length > 0) {
          navigate('/dashboard');
          return;
        }
      } catch (e) {
        console.error('Membership check failed after auth', e);
      }
    }
    
    goNext();
  };

  const handleContinue = async () => {
    if (pendingVerification) {
      handleVerify();
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});

    try {
      if (clerk && clerk.client) {
        if (mode === 'signup') {
          if (clerk.session) {
            await clerk.signOut();
          }
          
          const baseUsername = data.email.trim().split('@')[0];
          const randomSuffix = Math.floor(Math.random() * 10000);
          const username = `${baseUsername}${randomSuffix}`;

          const signUp = await clerk.client.signUp.create({
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            emailAddress: data.email.trim(),
            username: username,
            password: data.password,
          });

          if (signUp.status === 'complete') {
            await handleAuthSuccess(signUp.createdSessionId);
          } else if (signUp.unverifiedFields.includes('email_address')) {
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
          } else {
            setErrors({ submit: `Signup incomplete (Status: ${signUp.status}).` });
          }
        } else {
          if (clerk.session) {
            await clerk.signOut();
          }
          
          const signIn = await clerk.client.signIn.create({
            identifier: data.email.trim(),
            password: data.password,
          });

          if (signIn.status === 'complete') {
            await handleAuthSuccess(signIn.createdSessionId);
          } else if (signIn.status === 'needs_first_factor') {
            const emailFactor = signIn.supportedFirstFactors?.find(f => f.strategy === 'email_code');
            const emailAddressId = emailFactor && 'emailAddressId' in emailFactor ? (emailFactor as any).emailAddressId : undefined;
            await signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId });
            setPendingVerification(true);
          } else if (signIn.status === 'needs_second_factor') {
             // Basic fallback for 2FA
             setPendingVerification(true);
          } else {
             setErrors({ submit: `Sign in incomplete: ${signIn.status}` });
          }
        }
      } else {
        goNext();
      }
    } catch (err: unknown) {
      const errorObj = err as any;
      const msg = errorObj?.errors?.[0]?.message || errorObj?.message || 'Authentication failed';
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
      if (!clerk || !clerk.client) return;

      if (mode === 'signup') {
        const completeSignUp = await clerk.client.signUp.attemptEmailAddressVerification({
          code: otpCode,
        });
        
        if (completeSignUp.status === 'complete') {
          await handleAuthSuccess(completeSignUp.createdSessionId);
        } else {
          setErrors({ submit: `Verification failed. Status: ${completeSignUp.status}` });
        }
      } else {
        // SignIn OTP verification
        let completeSignIn;
        if (clerk.client.signIn.status === 'needs_first_factor') {
          completeSignIn = await clerk.client.signIn.attemptFirstFactor({
            strategy: 'email_code',
            code: otpCode,
          });
        } else if (clerk.client.signIn.status === 'needs_second_factor') {
           // We assume phone_code for 2FA as standard fallback if they reach here
           completeSignIn = await clerk.client.signIn.attemptSecondFactor({
             strategy: 'phone_code',
             code: otpCode,
           });
        }
        
        if (completeSignIn && completeSignIn.status === 'complete') {
          await handleAuthSuccess(completeSignIn.createdSessionId);
        } else {
          setErrors({ submit: `Verification failed. Status: ${completeSignIn?.status}` });
        }
      }
    } catch (err: unknown) {
      const errorObj = err as any;
      const msg = errorObj?.errors?.[0]?.message || errorObj?.message || 'Verification failed';
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setData({ [field]: value });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  if (!isClerkLoaded) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Loading secure environment...</div>
      </div>
    );
  }

  // If they are signed in, don't show the form (they are being redirected)
  if (isSignedIn) return null;

  return (
    <StepLayout
      title={pendingVerification ? 'Check your email' : (mode === 'signup' ? 'Create your account' : 'Sign in')}
      subtitle={pendingVerification ? 'We sent you a verification code.' : 'Your unified dashboard awaits.'}
      onContinue={handleContinue}
      continueLabel={pendingVerification ? 'Verify Code' : (mode === 'signup' ? 'Create Account' : 'Sign In & Continue')}
      isLoading={loading}
      onBack={pendingVerification ? () => { setPendingVerification(false); setOtpCode(''); setErrors({}); } : goBack}
    >
      {!pendingVerification ? (
        <>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '12px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: '24px',
              transition: 'all 0.2s',
            }}
            onClick={async () => {
              if (!clerk || !clerk.client) return;
              try {
                if (clerk.session) {
                  await clerk.signOut();
                }
                await clerk.client.signIn.authenticateWithRedirect({
                  strategy: 'oauth_google',
                  redirectUrl: window.location.origin + '/sso-callback',
                  redirectUrlComplete: window.location.origin + '?step=2',
                });
              } catch (err: unknown) {
                const errorObj = err as any;
                setErrors({ submit: errorObj?.message || 'Google sign-in failed' });
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M24 12.27c0-.85-.08-1.66-.22-2.45H12.24v4.62h6.61a5.64 5.64 0 01-2.44 3.7v3.08h3.94c2.31-2.12 3.65-5.25 3.65-8.95z"/>
              <path fill="#34A853" d="M12.24 24c3.3 0 6.08-1.09 8.11-2.95l-3.94-3.08c-1.1.74-2.51 1.18-4.17 1.18-3.2 0-5.91-2.16-6.88-5.07H1.28v3.17A11.99 11.99 0 0012.24 24z"/>
              <path fill="#FBBC05" d="M5.36 17.08a7.19 7.19 0 01-.38-2.3c0-.8.14-1.58.38-2.3V9.3H1.28A11.97 11.97 0 000 14.78c0 1.92.46 3.74 1.28 5.37l4.08-3.07z"/>
              <path fill="#4285F4" d="M12.24 4.75c1.8 0 3.41.62 4.67 1.83l3.5-3.5A11.95 11.95 0 0012.24 0 11.99 11.99 0 001.28 5.51l4.08 3.17c.97-2.91 3.68-5.07 6.88-5.07z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>OR</div>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
          </div>

          {mode === 'signup' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
          )}

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
            placeholder={mode === 'signup' ? 'Min. 8 characters' : 'Your password'}
            value={data.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('password', e.target.value)}
            error={errors.password}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleContinue()}
          />

          {errors.submit && (
            <div style={{ padding: '10px 14px', background: 'var(--color-error-bg, #fef2f2)', border: '1px solid var(--color-error-border, #fecaca)', borderRadius: 8, fontSize: '0.875rem', color: 'var(--color-error, #dc2626)', marginBottom: 16 }}>
              {errors.submit}
            </div>
          )}

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button 
              className="btn-secondary" 
              onClick={() => setMode(m => m === 'signup' ? 'signin' : 'signup')}
              style={{ width: '100%', background: 'transparent', border: 'none', boxShadow: 'none' }}
            >
              {mode === 'signup' ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 24, fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
            Enter the verification code sent to <strong>{data.email}</strong>.
          </div>
          
          <Input
            label="Verification Code"
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
          
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button 
              className="btn-secondary" 
              onClick={() => {
                setPendingVerification(false);
                setOtpCode('');
                setErrors({});
              }}
              style={{ width: '100%', background: 'transparent', border: 'none', boxShadow: 'none' }}
            >
              Back to {mode === 'signup' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </>
      )}
    </StepLayout>
  );
}
