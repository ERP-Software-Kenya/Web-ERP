import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import ThemeToggle from '../../theme/components/ThemeToggle';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

interface Plan {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  desc: string;
  monthlyPrice: number;
  annualPrice: number;
  featured: boolean;
  features: { text: string; included: boolean }[];
  btnLabel: string;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    desc: 'For single shop counters & solo traders',
    monthlyPrice: 0,
    annualPrice: 0,
    featured: false,
    btnLabel: 'Get started free',
    features: [
      { text: 'Up to 2 users', included: true },
      { text: 'Single branch inventory & POS', included: true },
      { text: 'Cash & customer invoicing', included: true },
      { text: 'Basic sales reporting', included: true },
      { text: 'Multi-branch allocations', included: false },
      { text: 'Supplier purchase orders', included: false },
      { text: 'Manager approval workflows', included: false },
      { text: 'Priority Kenyan phone support', included: false },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    desc: 'For active retailers, distributors & wholesalers',
    monthlyPrice: 4999,
    annualPrice: 3999,
    featured: true,
    btnLabel: 'Start 14-day free trial',
    features: [
      { text: 'Up to 15 users across stores', included: true },
      { text: 'Multi-branch stock deduction & transfer', included: true },
      { text: 'Credit sales & customer ledgers', included: true },
      { text: 'Supplier purchase orders & receiving', included: true },
      { text: 'Landed cost & inventory valuation', included: true },
      { text: 'Branch-level analytics & exports', included: true },
      { text: 'Manager approvals (discounts/credit)', included: false },
      { text: 'Dedicated onboarding engineer', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    desc: 'For multi-location retail chains & commercial groups',
    monthlyPrice: 14999,
    annualPrice: 11999,
    featured: false,
    btnLabel: 'Choose Enterprise',
    features: [
      { text: 'Unlimited users & store locations', included: true },
      { text: 'Full multi-branch governance', included: true },
      { text: 'Advanced manager approval workflows', included: true },
      { text: 'Automated white/black stock conversion', included: true },
      { text: 'Custom PDF statement templates', included: true },
      { text: 'KRA eTIMS integration assistance', included: true },
      { text: 'Dedicated account manager in Nairobi', included: true },
      { text: '24/7 priority SLA support', included: true },
    ],
  },
];

const TESTIMONIALS = [
  {
    quote: "Pramukh Digital ERP gave us real-time visibility across our 4 branches in Nairobi and Mombasa. Shrinkage dropped by 80% in the first quarter.",
    name: "Kennedy Kamau",
    role: "Managing Director, Apex Commercial Hardware Ltd",
  },
  {
    quote: "The desktop client is fast and handles counter queues smoothly. Our cashiers and branch storekeepers adapted within a single afternoon.",
    name: "Amina Hassan",
    role: "Operations Head, Valley Distribution Stores",
  },
];

export default function Step7Pricing() {
  const { data, setData, goNext, goBack, clerk } = useOnboarding();
  const [billing, setBilling] = useState<'monthly' | 'annual'>(data.billing || 'monthly');
  const [tIdx, setTIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `KES ${price.toLocaleString()}`;
  };

  const handleSelect = async (planId: 'starter' | 'growth' | 'enterprise') => {
    setData({ plan: planId, billing });

    if (clerk && data.orgName) {
      setLoading(true);
      setError(null);
      try {
        const clerkOrg = await clerk.createOrganization({ name: data.orgName });
        if (clerk.setActive) {
          await clerk.setActive({ organization: clerkOrg.id });
        }

        const token = await clerk.session?.getToken();
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://core-apis-m03n.onrender.com';

        // Non-blocking sync with backend
        fetch(`${apiUrl}/api/v1/auth/organizations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: data.orgName.trim(),
            slug: clerkOrg.slug || data.orgName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'workspace',
            clerkOrgId: clerkOrg.id,
            plan: planId,
            billing,
          }),
        }).catch((err) => console.warn('Background sync queued:', err));
      } catch (err: any) {
        console.warn('Organization setup warning:', err);
        // Do not block onboarding on non-fatal clerk errors if organization was created
        const errMsg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message;
        if (errMsg && !errMsg.includes('already exists')) {
          setError(errMsg);
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    }

    goNext();
  };

  return (
    <div className="pricing-page pricing-page-wrapper" style={{ minHeight: '100vh', padding: '32px 20px', background: 'var(--color-bg)' }}>
      {/* Top Bar */}
      <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={goBack}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontSize: '0.9375rem',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to sales channels</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Step 7 of 7 · Subscription Plan
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Header */}
      <div style={{ maxWidth: 800, margin: '0 auto 36px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 8, letterSpacing: '-0.02em' }}>
          Select the right plan for your business.
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--color-text-muted)' }}>
          Transparent Kenyan pricing. Cancel or upgrade anytime from your admin desktop console.
        </p>

        {/* Billing toggle */}
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--color-surface-2)',
            padding: 4,
            borderRadius: 999,
            marginTop: 20,
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              border: 'none',
              background: billing === 'monthly' ? 'var(--color-primary)' : 'transparent',
              color: billing === 'monthly' ? '#ffffff' : 'var(--color-text-muted)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              border: 'none',
              background: billing === 'annual' ? 'var(--color-primary)' : 'transparent',
              color: billing === 'annual' ? '#ffffff' : 'var(--color-text-muted)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
            }}
          >
            <span>Annual</span>
            <span
              style={{
                fontSize: '0.72rem',
                background: 'rgba(34, 197, 94, 0.2)',
                color: 'var(--color-success)',
                padding: '2px 8px',
                borderRadius: 999,
                fontWeight: 700,
              }}
            >
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            maxWidth: 1100,
            margin: '0 auto 24px',
            padding: '12px 16px',
            borderRadius: 8,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--color-error)',
            fontSize: '0.875rem',
          }}
        >
          <strong>Notice:</strong> {error}
        </div>
      )}

      {/* Cards Grid */}
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          alignItems: 'stretch',
        }}
      >
        {PLANS.map((plan) => {
          const price = billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
          const isFeatured = plan.featured;

          return (
            <div
              key={plan.id}
              style={{
                background: isFeatured ? 'var(--color-surface-2)' : 'var(--color-surface)',
                border: `2px solid ${isFeatured ? 'var(--color-primary)' : 'var(--color-border)'}`,
                boxShadow: isFeatured ? '0 12px 32px var(--color-primary-glow)' : 'var(--shadow-card)',
                borderRadius: 16,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              {isFeatured && (
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--color-primary)',
                    color: '#ffffff',
                    padding: '4px 14px',
                    borderRadius: 999,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Sparkles size={13} />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>
                {plan.name}
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>
                {plan.desc}
              </div>

              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--color-text)' }}>
                  {formatPrice(price)}
                </span>
                {price > 0 && (
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    {' '}/ month
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 24 }}>
                {price === 0
                  ? 'No credit card required'
                  : billing === 'annual'
                  ? `Billed annually (${formatPrice(price * 12)} / year)`
                  : 'Billed monthly, cancel anytime'}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {plan.features.map((f) => (
                  <li
                    key={f.text}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontSize: '0.84rem',
                      color: f.included ? 'var(--color-text)' : 'var(--color-text-muted)',
                      opacity: f.included ? 1 : 0.5,
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: f.included ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                        color: f.included ? 'var(--color-success)' : 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {f.included ? <Check size={12} strokeWidth={3} /> : '×'}
                    </div>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                id={`btn-plan-${plan.id}`}
                className={isFeatured ? 'btn-primary' : 'btn-secondary'}
                onClick={() => handleSelect(plan.id)}
                disabled={loading}
                style={
                  !isFeatured
                    ? {
                        border: '1.5px solid var(--color-border)',
                        background: 'transparent',
                        color: 'var(--color-text)',
                        padding: '12px 20px',
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }
                    : { padding: '12px 20px' }
                }
              >
                {loading ? 'Configuring workspace...' : plan.btnLabel}
              </button>
            </div>
          );
        })}
      </div>

      {/* Testimonial */}
      <div style={{ maxWidth: 800, margin: '48px auto 0', padding: 24, borderRadius: 16, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
        <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--color-text)', marginBottom: 12, lineHeight: 1.6 }}>
          "{TESTIMONIALS[tIdx].quote}"
        </p>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>
          {TESTIMONIALS[tIdx].name}
        </div>
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          {TESTIMONIALS[tIdx].role}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setTIdx(i)}
              aria-label={`Testimonial ${i + 1}`}
              style={{
                width: 24,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: i === tIdx ? 'var(--color-primary)' : 'var(--color-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
