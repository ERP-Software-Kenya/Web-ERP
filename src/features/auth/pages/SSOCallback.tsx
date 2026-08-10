import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../onboarding/context/OnboardingContext';
import { Clerk } from '@clerk/clerk-js';

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

export default function SSOCallback() {
  const { setClerk, setData } = useOnboarding();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    const handleCallback = async () => {
      try {
        const clerk = new Clerk(CLERK_KEY);
        await clerk.load();
        
        if (!mounted) return;
        setClerk(clerk);

        // Handle the OAuth callback
        await clerk.handleRedirectCallback();
        
        // Explicitly store the JWT token in localStorage
        if (clerk.session) {
          const token = await clerk.session.getToken();
          if (token) {
            localStorage.setItem('auth_token', token);
          }
        }

        if (clerk.user) {
          // Check if they already have an organization
          const memberships = await clerk.user.getOrganizationMemberships();
          const hasMembership = memberships && memberships.data && memberships.data.length > 0;
          
          if (hasMembership) {
            // They are a returning user with an organization
            navigate('/dashboard');
          } else {
            // Pre-fill user data
            setData({
              firstName: clerk.user.firstName || '',
              lastName: clerk.user.lastName || '',
              email: clerk.user.primaryEmailAddress?.emailAddress || '',
            });

            // They are a new user, or a returning user without an organization yet
            navigate('/onboarding/step-2');
          }
        }
      } catch (err: any) {
        console.error('SSO Callback error:', err);
        if (mounted) setError(err?.message || 'Authentication failed during callback');
      }
    };

    handleCallback();

    return () => { mounted = false; };
  }, []);

  if (error) {
    return (
      <div className="sso-callback-container">
        <div className="sso-callback-box">
          <div className="sso-callback-icon-error">⚠️</div>
          <h2 className="sso-callback-title">Authentication Error</h2>
          <p className="sso-callback-msg">{error}</p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/')}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sso-callback-container">
      <div className="sso-loading-title">Authenticating...</div>
      <div className="sso-loading-text">Please wait while we verify your credentials.</div>
    </div>
  );
}
