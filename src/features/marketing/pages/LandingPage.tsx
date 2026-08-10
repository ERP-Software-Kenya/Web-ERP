import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRight, Package, ShoppingCart, Truck, Building2, Users, Briefcase,
  Check, Star, Globe, Zap, Shield, Database, ChevronRight, Play,
  BarChart3, TrendingUp, Cpu, Lock,
} from 'lucide-react';
import { useOnboarding } from '../../onboarding/context/OnboardingContext';
import MarketingHeader from '../components/MarketingHeader';
import MarketingFooter from '../components/MarketingFooter';

/* ── Animated Counter ────────────────────────────────────────────── */
function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1800, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => {
    const unsub = springValue.on('change', (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [springValue]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Data ────────────────────────────────────────────────────────── */
const modules = [
  {
    icon: Package,
    name: 'Inventory Management',
    desc: 'Real-time multi-location stock tracking, automated movements, low-stock alerts, and seamless transfers between branches.',
    color: '#4f7af8',
    features: ['Multi-location tracking', 'Stock movements', 'Automated alerts', 'Transfer management'],
  },
  {
    icon: ShoppingCart,
    name: 'Sales & Invoicing',
    desc: 'Generate professional quotes and invoices, accept payments, and manage your entire sales pipeline from one unified view.',
    color: '#22c55e',
    features: ['Invoice generation', 'Payment processing', 'Sales pipeline', 'Credit management'],
  },
  {
    icon: Truck,
    name: 'Purchasing & POs',
    desc: 'Streamline procurement with automated purchase orders, supplier management, and full vendor cost tracking.',
    color: '#f59e0b',
    features: ['Purchase orders', 'Supplier database', 'Vendor management', 'Cost tracking'],
  },
  {
    icon: Building2,
    name: 'Financial Accounting',
    desc: 'Complete double-entry bookkeeping, real-time P&L, cash flow tracking, and exportable financial reports in Excel or PDF.',
    color: '#a855f7',
    features: ['Ledger management', 'P&L reports', 'Expense tracking', 'Export to Excel/PDF'],
  },
  {
    icon: Users,
    name: 'CRM',
    desc: 'Manage customer relationships, track interaction history, handle credit approvals, and nurture your client base effectively.',
    color: '#06b6d4',
    features: ['Customer profiles', 'Interaction history', 'Credit approvals', 'Sales tracking'],
  },
  {
    icon: Briefcase,
    name: 'HR & Payroll',
    desc: 'Manage your team, define roles and permissions, process payroll, and maintain complete employee records.',
    color: '#f43f5e',
    features: ['Employee records', 'Role management', 'Payroll processing', 'Access control'],
  },
];

const stats = [
  { value: 500, suffix: '+', label: 'Businesses Served' },
  { value: 12, suffix: '+', label: 'Countries' },
  { value: 37, suffix: '+', label: 'Core Modules' },
  { value: 99, suffix: '.9%', label: 'Uptime SLA' },
];

const testimonials = [
  {
    quote: 'Web-ERP transformed how we manage our 4 warehouse locations. Stock transfers that used to take hours now happen in minutes. Our team actually loves using it.',
    name: 'Amara Nwosu',
    role: 'Operations Director, Nwosu Distribution Ltd',
    location: 'Lagos, Nigeria',
    initials: 'AN',
  },
  {
    quote: 'The invoicing and CRM integration is outstanding. We\'ve cut our billing cycle from 3 days to same-day. Revenue visibility is unreal.',
    name: 'Kenji Muthoka',
    role: 'CEO, Muthoka Retail Group',
    location: 'Nairobi, Kenya',
    initials: 'KM',
  },
  {
    quote: 'Finally, an ERP that doesn\'t need a consultant to set up. The onboarding flow is intuitive and we were live in under an hour.',
    name: 'Priya Nakato',
    role: 'Finance Manager, Nakato Manufacturing',
    location: 'Kampala, Uganda',
    initials: 'PN',
  },
];

const steps = [
  {
    num: '01',
    title: 'Set Up Your Workspace',
    desc: 'Create your account, add your organization details, choose your industry, and select the modules you need — all in under 5 minutes.',
    icon: Cpu,
  },
  {
    num: '02',
    title: 'Import Your Data',
    desc: 'Bring in your existing inventory, customers, and suppliers via Excel import or connect via our REST API.',
    icon: Database,
  },
  {
    num: '03',
    title: 'Run Your Business',
    desc: 'Your team manages inventory, raises invoices, processes orders, and views real-time analytics from day one — on desktop or web.',
    icon: TrendingUp,
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    desc: 'Perfect for small businesses getting started',
    price: { monthly: 0, annual: 0 },
    badge: null as string | null,
    features: [
      { text: 'Up to 2 users', included: true },
      { text: 'Basic inventory & invoicing', included: true },
      { text: 'Customer management', included: true },
      { text: 'CRM & supplier management', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'Multi-location support', included: false },
    ],
    cta: 'Get Started Free',
    ctaStyle: 'outline' as const,
  },
  {
    name: 'Growth',
    desc: 'Ideal for growing teams and multi-channel operations',
    price: { monthly: 49, annual: 39 },
    badge: 'Most Popular',
    features: [
      { text: 'Up to 15 users', included: true },
      { text: 'Full inventory + stock transfers', included: true },
      { text: 'Unlimited invoicing', included: true },
      { text: 'CRM & supplier management', included: true },
      { text: 'Advanced reports & analytics', included: true },
      { text: 'Multi-location support', included: false },
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'primary' as const,
  },
  {
    name: 'Enterprise',
    desc: 'Unlimited scale with dedicated support',
    price: { monthly: 149, annual: 119 },
    badge: null as string | null,
    features: [
      { text: 'Unlimited users', included: true },
      { text: 'Everything in Growth', included: true },
      { text: 'Multi-location management', included: true },
      { text: 'Custom integrations & API access', included: true },
      { text: 'Role-based access control', included: true },
      { text: 'Dedicated account manager + 24/7 support', included: true },
    ],
    cta: 'Contact Sales',
    ctaStyle: 'solid' as const,
  },
];

const bentoFeatures = [
  {
    icon: Zap,
    color: '#f59e0b',
    title: 'Real-Time Everywhere',
    desc: 'Every inventory movement, sale, and transaction syncs instantly across all your locations and team members. No refresh needed.',
    wide: false,
  },
  {
    icon: Shield,
    color: '#22c55e',
    title: 'Enterprise-Grade Security',
    desc: 'Role-based access control, end-to-end encryption, comprehensive audit logs, and compliance built into every layer.',
    wide: false,
  },
  {
    icon: Globe,
    color: '#4f7af8',
    title: 'Built for African Commerce',
    desc: 'Supports local currencies (KES, UGX, NGN, GHS and more), local tax configurations, and multi-country operations out of the box. Your ERP should understand your market.',
    wide: true,
  },
  {
    icon: Database,
    color: '#a855f7',
    title: 'Unified Data Architecture',
    desc: 'One source of truth for all your business data — inventory, customers, suppliers, finances — all interconnected and always consistent.',
    wide: false,
  },
  {
    icon: BarChart3,
    color: '#f43f5e',
    title: 'Powerful Analytics',
    desc: 'Customizable dashboards, exportable reports in Excel/PDF, and real-time KPIs so you always know where your business stands.',
    wide: false,
  },
];

/* ── Animation Variants ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ── Component ───────────────────────────────────────────────────── */
export default function LandingPage() {
  const { goNext, isClerkLoaded, isSignedIn } = useOnboarding();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);

  const handleCTA = () => {
    if (isClerkLoaded && isSignedIn) navigate('/dashboard');
    else goNext();
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lp-shell">
      {/* Background */}
      <div className="lp-bg" aria-hidden="true">
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
        <div className="lp-blob lp-blob-3" />
        <div className="lp-grid" />
      </div>

      <MarketingHeader onScrollTo={scrollTo} />

      {/* ──────────────────── HERO ──────────────────── */}
      <section className="lp-hero" id="hero">
        <motion.div
          className="lp-hero-inner"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="lp-badge">
            <span className="lp-badge-dot" />
            v3.0 Early Access — Now Live
          </motion.div>

          <motion.h1 variants={fadeUp} className="lp-hero-h1">
            The Operating System<br />
            for <span className="lp-gradient-text">Modern Commerce</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="lp-hero-sub">
            Unify your inventory, sales, finances, and operations on one
            lightning-fast platform. Built for African businesses.
            Designed for limitless scale.
          </motion.p>

          <motion.div variants={fadeUp} className="lp-hero-ctas">
            <button className="lp-btn-primary" onClick={handleCTA}>
              {isClerkLoaded && isSignedIn ? 'Go to Dashboard' : 'Start Free — No Card Needed'}
              <ArrowRight size={18} />
            </button>
            <button className="lp-btn-ghost" onClick={() => scrollTo('modules')}>
              <Play size={14} />
              See What's Inside
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="lp-trust-row">
            <span className="lp-trust-item"><Check size={13} /> Free forever plan</span>
            <span className="lp-trust-dot" />
            <span className="lp-trust-item"><Check size={13} /> Setup in &lt;5 minutes</span>
            <span className="lp-trust-dot" />
            <span className="lp-trust-item"><Check size={13} /> No credit card required</span>
          </motion.div>
        </motion.div>

        {/* Hero Product Preview */}
        <motion.div
          className="lp-hero-preview"
          initial={{ opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="lp-preview-card">
            <div className="lp-preview-topbar">
              <div className="lp-preview-dots">
                <span /><span /><span />
              </div>
              <div className="lp-preview-url">app.web-erp.com/dashboard</div>
            </div>
            <div className="lp-preview-body">
              <div className="lp-preview-sidebar">
                {['Dashboard', 'Inventory', 'Sales', 'Finance', 'CRM', 'HR'].map((item, i) => (
                  <div key={item} className={`lp-preview-nav-item${i === 0 ? ' active' : ''}`}>
                    <span className="lp-preview-nav-dot" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="lp-preview-content">
                <div className="lp-preview-title">Dashboard</div>
                <div className="lp-preview-stats">
                  {[
                    { l: 'Revenue', v: 'KSh 2.4M', c: '+18%' },
                    { l: 'Orders', v: '1,284', c: '+12%' },
                    { l: 'Stock Items', v: '4,891', c: 'Live' },
                    { l: 'Active Users', v: '14', c: '' },
                  ].map((s) => (
                    <div key={s.l} className="lp-preview-stat">
                      <div className="lp-preview-stat-label">{s.l}</div>
                      <div className="lp-preview-stat-value">{s.v}</div>
                      {s.c && <div className="lp-preview-stat-change">{s.c}</div>}
                    </div>
                  ))}
                </div>
                <div className="lp-preview-chart">
                  {[40, 65, 45, 80, 60, 90, 75, 95, 70, 88, 72, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      className="lp-preview-bar"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.8 + i * 0.04, duration: 0.5, ease: 'easeOut' }}
                      style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ──────────────────── STATS ─────────────────── */}
      <section className="lp-stats-strip">
        <div className="lp-container">
          <div className="lp-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="lp-stat-item">
                <div className="lp-stat-value">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── MODULES ───────────────── */}
      <section className="lp-section" id="modules">
        <div className="lp-container">
          <motion.div
            className="lp-section-header"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Everything You Need</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">
              Six Modules. One Unified Platform.
            </motion.h2>
            <motion.p variants={fadeUp} className="lp-section-desc">
              Select only the modules your business needs today. Add more as you grow.
              Every module is fully integrated — no data silos, no duplicate entry.
            </motion.p>
          </motion.div>

          <motion.div
            className="lp-modules-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <motion.div key={mod.name} variants={fadeUp} className="lp-module-card">
                  <div className="lp-module-icon" style={{ background: `${mod.color}1a`, color: mod.color }}>
                    <Icon size={22} />
                  </div>
                  <h3 className="lp-module-name">{mod.name}</h3>
                  <p className="lp-module-desc">{mod.desc}</p>
                  <ul className="lp-module-features">
                    {mod.features.map((f) => (
                      <li key={f}>
                        <Check size={12} style={{ color: mod.color, flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────── WHY WEB-ERP ───────────── */}
      <section className="lp-section lp-section-alt" id="features">
        <div className="lp-container">
          <motion.div
            className="lp-section-header"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Why Web-ERP</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">
              Built Different. Built Better.
            </motion.h2>
          </motion.div>

          <div className="lp-features-bento">
            {bentoFeatures.map((feat, i) => {
              const FeatIcon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  className={`lp-bento-card${feat.wide ? ' wide' : ''}`}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="lp-bento-icon" style={{ background: `${feat.color}1a`, color: feat.color }}>
                    <FeatIcon size={20} />
                  </div>
                  <h3 className="lp-bento-title">{feat.title}</h3>
                  <p className="lp-bento-desc">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────── HOW IT WORKS ──────────── */}
      <section className="lp-section" id="how-it-works">
        <div className="lp-container">
          <motion.div
            className="lp-section-header"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Get Started</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">
              Up and Running in Minutes
            </motion.h2>
            <motion.p variants={fadeUp} className="lp-section-desc">
              No consultants. No lengthy implementations. No complexity.
              Just a clean, guided setup that gets your team operational fast.
            </motion.p>
          </motion.div>

          <div className="lp-steps">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  className="lp-step"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="lp-step-num">{step.num}</div>
                  <div className="lp-step-icon">
                    <StepIcon size={24} />
                  </div>
                  <h3 className="lp-step-title">{step.title}</h3>
                  <p className="lp-step-desc">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────── PRICING ───────────────── */}
      <section className="lp-section lp-section-alt" id="pricing">
        <div className="lp-container">
          <motion.div
            className="lp-section-header"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Pricing</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={fadeUp} className="lp-section-desc">
              Start free and scale as you grow. No hidden fees. Cancel anytime.
            </motion.p>
            <motion.div variants={fadeUp} className="lp-billing-toggle">
              <button
                className={`lp-toggle-btn${billing === 'monthly' ? ' active' : ''}`}
                onClick={() => setBilling('monthly')}
              >
                Monthly
              </button>
              <button
                className={`lp-toggle-btn${billing === 'annual' ? ' active' : ''}`}
                onClick={() => setBilling('annual')}
              >
                Annual
                <span className="lp-save-badge">Save 20%</span>
              </button>
            </motion.div>
          </motion.div>

          <div className="lp-pricing-grid">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className={`lp-pricing-card${plan.badge ? ' featured' : ''}`}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.badge && <div className="lp-pricing-badge">{plan.badge}</div>}
                <div className="lp-pricing-plan-header">
                  <div className="lp-pricing-name">{plan.name}</div>
                  <div className="lp-pricing-desc">{plan.desc}</div>
                </div>
                <div className="lp-pricing-price">
                  {plan.price.monthly === 0 ? (
                    <span className="lp-price-amount">Free</span>
                  ) : (
                    <>
                      <span className="lp-price-currency">$</span>
                      <span className="lp-price-amount">
                        {billing === 'monthly' ? plan.price.monthly : plan.price.annual}
                      </span>
                      <span className="lp-price-period">/mo</span>
                    </>
                  )}
                </div>
                {plan.price.monthly > 0 && billing === 'annual' && (
                  <div className="lp-price-billed">Billed annually</div>
                )}
                <ul className="lp-pricing-features">
                  {plan.features.map((f) => (
                    <li key={f.text} className={f.included ? 'included' : 'excluded'}>
                      <span className="lp-feat-check">{f.included ? '✓' : '✗'}</span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <button
                  className={`lp-pricing-cta lp-pricing-cta-${plan.ctaStyle}`}
                  onClick={handleCTA}
                >
                  {plan.cta}
                  <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── TESTIMONIALS ──────────── */}
      <section className="lp-section" id="testimonials">
        <div className="lp-container">
          <motion.div
            className="lp-section-header"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Customer Stories</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">
              Trusted Across the Continent
            </motion.h2>
          </motion.div>

          <div className="lp-testimonials">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className={`lp-testimonial-card${i === activeTestimonial ? ' active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
                whileHover={{ scale: 1.025, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="lp-testimonial-stars">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="lp-testimonial-quote">"{t.quote}"</p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="lp-testimonial-name">{t.name}</div>
                    <div className="lp-testimonial-role">{t.role}</div>
                    <div className="lp-testimonial-location">
                      <Globe size={11} />
                      {t.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lp-testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`lp-t-dot${i === activeTestimonial ? ' active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FINAL CTA ─────────────── */}
      <section className="lp-cta-section">
        <div className="lp-container">
          <motion.div
            className="lp-cta-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="lp-cta-badge">Start Today</div>
            <h2 className="lp-cta-h2">
              Ready to Modernize<br />Your Operations?
            </h2>
            <p className="lp-cta-desc">
              Join hundreds of businesses across Africa running smarter with Web-ERP.
              Start free — no credit card required.
            </p>
            <div className="lp-cta-btns">
              <button className="lp-btn-primary" onClick={handleCTA}>
                Initialize Your Workspace
                <ArrowRight size={18} />
              </button>
              <button className="lp-btn-ghost" onClick={() => scrollTo('pricing')}>
                View Pricing
              </button>
            </div>
            <div className="lp-cta-trust">
              <span><Check size={13} /> Free plan available</span>
              <span><Check size={13} /> Desktop + Web app</span>
              <span><Check size={13} /> Support included</span>
            </div>
          </motion.div>
        </div>
      </section>

      <MarketingFooter onScrollTo={scrollTo} />
    </div>
  );
}
