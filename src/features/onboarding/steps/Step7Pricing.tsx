import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import ThemeToggle from '../../theme/components/ThemeToggle';
import ProgressBar from '../components/ProgressBar';
import { onboardOrganization } from '../../auth/services/authApi';

interface Plan {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  desc: string;
  monthlyPrice: number;
  annualPrice: number;
  featured: boolean;
  features: { text: string; included: boolean }[];
  btnLabel: string;
  btnStyle: 'outline' | 'solid' | 'primary';
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    desc: 'For solo operators & small teams',
    monthlyPrice: 0,
    annualPrice: 0,
    featured: false,
    btnLabel: 'Get started free',
    btnStyle: 'outline',
    features: [
      { text: 'Up to 2 users', included: true },
      { text: 'Inventory management', included: true },
      { text: 'Basic invoicing (20/mo)', included: true },
      { text: 'Customer management', included: true },
      { text: 'Purchase orders', included: false },
      { text: 'Advanced reports', included: false },
      { text: 'Multi-location', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    desc: 'For growing businesses',
    monthlyPrice: 49,
    annualPrice: 39,
    featured: true,
    btnLabel: 'Start 14-day free trial',
    btnStyle: 'primary',
    features: [
      { text: 'Up to 15 users', included: true },
      { text: 'Full inventory + stock transfers', included: true },
      { text: 'Unlimited invoicing', included: true },
      { text: 'CRM & customers', included: true },
      { text: 'Purchase orders & suppliers', included: true },
      { text: 'Advanced reports & analytics', included: true },
      { text: 'Multi-location', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    desc: 'For large teams & enterprises',
    monthlyPrice: 149,
    annualPrice: 119,
    featured: false,
    btnLabel: 'Contact sales',
    btnStyle: 'solid',
    features: [
      { text: 'Unlimited users', included: true },
      { text: 'Everything in Growth', included: true },
      { text: 'Multi-location management', included: true },
      { text: 'Custom integrations & API', included: true },
      { text: 'Role-based access control', included: true },
      { text: 'Audit logs & compliance', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: '24/7 priority support', included: true },
    ],
  },
];

const TESTIMONIALS = [
  { quote: "The Growth plan pays for itself in the first week. We stopped losing stock to shrinkage and our invoice collection rate went from 70% to 94%.", name: "James Oduya", role: "MD, Oduya Holdings" },
  { quote: "Pramukh Digital's Enterprise plan gave us the multi-branch visibility we needed to scale from 2 to 8 locations in 18 months.", name: "Priya Sharma", role: "CFO, Sharma Retail Group" },
];

export default function Step7Pricing() {
  const { data, setData, goNext, goBack, clerk, refreshAuth } = useOnboarding();
  const [billing, setBilling] = useState<'monthly' | 'annual'>(data.billing);
  const [tIdx, setTIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (planId: 'starter' | 'growth' | 'enterprise') => {
    setData({ plan: planId, billing });

    setLoading(true);
    setError(null);
    try {
      if (!clerk?.session || !data.orgName.trim()) {
        throw new Error('An authenticated account and organization name are required.');
      }

      const memberships = await clerk.user?.getOrganizationMemberships();
      const reusableMembership = memberships?.data.find((membership) =>
        membership.organization.id === data.clerkOrgId ||
        membership.organization.name.trim().toLowerCase() === data.orgName.trim().toLowerCase(),
      );
      const clerkOrg = reusableMembership?.organization ?? await clerk.createOrganization({ name: data.orgName.trim() });
      setData({ clerkOrgId: clerkOrg.id });
      await clerk.setActive({ organization: clerkOrg.id });

      const result = await onboardOrganization(clerk, {
        name: data.orgName.trim(),
        slug: clerkOrg.slug || data.orgName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        clerkOrgId: clerkOrg.id,
        country: data.country,
      });
      if (result.role !== 'org_admin') throw new Error('Workspace was created without the required organization administrator role.');
      const me = await refreshAuth(clerk);
      if (!me?.isOnboarded || !me.organization?.id) throw new Error('Workspace verification failed. Please retry.');
    } catch (err: any) {
        console.error('Failed to create organization:', err);
        const errMsg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message || 'Failed to create workspace. Please try again.';
        setError(errMsg);
        setLoading(false);
        return;
    }
    setLoading(false);
    goNext();
  };

  return (
    <div className="pricing-page pricing-page-wrapper">
      <div className="pricing-top-bar">
        <button className="pricing-back pricing-back-btn" onClick={goBack} disabled={loading}>← Back</button>
        <ProgressBar />
        <ThemeToggle />
      </div>

      <div className="pricing-header pricing-header-container">
        <h1>Pick your plan.</h1>
        <p>Start free. Upgrade as you grow. Cancel anytime.</p>
      </div>

      {error && (
        <div className="pricing-error-banner">
          <strong>Error creating organization:</strong> {error}
        </div>
      )}

      {/* Toggle */}
      <div className="pricing-toggle pricing-toggle-container">
        <button
          className={`pricing-toggle-btn${billing === 'monthly' ? ' active' : ''}`}
          onClick={() => setBilling('monthly')}
          id="btn-billing-monthly"
        >
          Monthly
        </button>
        <button
          className={`pricing-toggle-btn${billing === 'annual' ? ' active' : ''}`}
          onClick={() => setBilling('annual')}
          id="btn-billing-annual"
        >
          Annual
          <span className="pricing-save-badge">
            Save 20%
          </span>
        </button>
      </div>

      {/* Cards */}
      <div className="pricing-cards">
        {PLANS.map(plan => {
          const price = billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
          return (
            <div key={plan.id} className={`pricing-card pricing-card-wrapper${plan.featured ? ' featured' : ''}`}>
              {plan.featured && <div className="pricing-badge">⭐ Most popular</div>}
              <div className="pricing-plan-name pricing-card-name">{plan.name}</div>
              <div className="pricing-plan-desc pricing-card-desc">{plan.desc}</div>
              <div className="pricing-price pricing-card-price">
                {price === 0 ? '$0' : `$${price}`}
                {price > 0 && <span className="pricing-card-price-mo"> /mo</span>}
              </div>
              <div className="pricing-billing pricing-card-billing">
                {price === 0
                  ? 'Free forever'
                  : billing === 'annual'
                    ? `Billed annually ($${price * 12}/yr)`
                    : 'Billed monthly'}
              </div>

              <ul className="pricing-features">
                {plan.features.map(f => (
                  <li key={f.text} className={`pricing-feature ${f.included ? 'pricing-feature-included' : 'pricing-feature-excluded'}`}>
                    <div className={`pricing-feature-icon${f.included ? '' : ' x'} ${f.included ? 'pricing-feature-icon-included' : 'pricing-feature-icon-excluded'}`}>
                      {f.included ? '✓' : '×'}
                    </div>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              <button
                id={`btn-plan-${plan.id}`}
                className={`btn-pricing ${plan.btnStyle}`}
                onClick={() => handleSelect(plan.id)}
                disabled={loading}
              >
                {loading ? 'Creating workspace...' : plan.btnLabel}
              </button>
            </div>
          );
        })}
      </div>

      {/* Testimonials carousel */}
      <div className="testimonial-section">
        <p className="testimonial-header">
          Loved by businesses that move fast
        </p>
        <div className="testimonial-box">
          <p className="testimonial-quote">
            "{TESTIMONIALS[tIdx].quote}"
          </p>
          <div className="testimonial-author">
            <div className="testimonial-avatar">
              {TESTIMONIALS[tIdx].name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="testimonial-name">{TESTIMONIALS[tIdx].name}</div>
              <div className="testimonial-role">{TESTIMONIALS[tIdx].role}</div>
            </div>
            <div className="testimonial-dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTIdx(i)}
                  className={`testimonial-dot ${i === tIdx ? 'active' : 'inactive'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
