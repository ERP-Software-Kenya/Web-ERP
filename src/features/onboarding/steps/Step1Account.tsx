import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clerk } from '@clerk/clerk-js';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import Input from '../../../components/ui/Input';
import GoogleIcon from '../../../components/icons/GoogleIcon';

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
            <GoogleIcon />
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
