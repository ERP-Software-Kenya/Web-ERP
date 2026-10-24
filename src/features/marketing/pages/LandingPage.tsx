import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  Check,
  ClipboardCheck,
  Download,
  FileSpreadsheet,
  Layers3,
  Lock,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  Users,
  WalletCards,
} from 'lucide-react';
import { useOnboarding } from '../../onboarding/context/OnboardingContext';
import MarketingHeader from '../components/MarketingHeader';
import MarketingFooter from '../components/MarketingFooter';
import { latestErpClientRelease } from '../../downloads/data/releases';

const modules = [
  {
    icon: ShoppingCart,
    name: 'Sales and POS',
    desc: 'Cash billing, credit sales, customer ledgers, barcode scanning, returns, and payment collection flows for every branch.',
    features: ['High-speed counter billing', 'Direct branch stock deduction', 'Customer credit limits'],
  },
  {
    icon: Truck,
    name: 'Purchase Management',
    desc: 'Purchase order entry, supplier control, receiving, landed costs, and store allocations from one centralized console.',
    features: ['Supplier invoices & payments', 'Landed cost calculations', 'Branch-aware procurement'],
  },
  {
    icon: Boxes,
    name: 'Inventory Control',
    desc: 'Track multi-location quantities, batch numbers, valuation, stock transfers, and automated low-stock warnings.',
    features: ['Real-time stock movement', 'Multi-store transfers', 'Live valuation'],
  },
  {
    icon: BarChart3,
    name: 'Analytics',
    desc: 'Daily sales, purchase volumes, profit margins, branch comparisons, and payment methods filtered by date and store.',
    features: ['Branch comparisons', 'Gross margin analysis', 'Real-time cash flow'],
  },
  {
    icon: FileSpreadsheet,
    name: 'Reports & Audit',
    desc: 'Generate complete sales ledgers, cash books, expense summaries, KRA-ready audit trails, and customer account statements.',
    features: ['PDF & Excel exports', 'Transaction-level audit trail', 'Tax-friendly statements'],
  },
  {
    icon: ClipboardCheck,
    name: 'Approvals & Governance',
    desc: 'Control sensitive operations with role-based approval workflows for cashier discounts, credit sales, and stock adjustments.',
    features: ['Manager authorization', 'Cashier accountability', 'Operational audit logs'],
  },
];

const outcomes = [
  { value: '1', label: 'source of truth for branch operations' },
  { value: '360°', label: 'sales, purchase, and stock visibility' },
  { value: 'v1.1.0', label: 'latest verified desktop release' },
  { value: 'Offline', label: 'resilience for counter cashiers' },
];

const pricingPlans = [
  {
    name: 'Starter',
    desc: 'For single shop counters moving from spreadsheets.',
    price: 'Free',
    features: ['1 branch & 2 users', 'Core sales invoicing & counter POS', 'Basic customer records & statements', 'Offline counter resilience'],
  },
  {
    name: 'Growth',
    desc: 'For growing retail stores, distributors & wholesalers.',
    price: 'KES 4,999 /mo',
    featured: true,
    features: [
      'Up to 15 users across stores',
      'Multi-branch stock deduction & transfer',
      'Supplier purchase orders & receiving',
      'Credit sales & customer ledgers',
      'Branch-level analytics & exports',
    ],
  },
  {
    name: 'Enterprise',
    desc: 'For multi-location retail chains & commercial groups.',
    price: 'KES 14,999 /mo',
    features: [
      'Unlimited users & store locations',
      'Advanced manager approval workflows',
      'Automated white/black stock conversion',
      'KRA eTIMS assistance & 24/7 SLA',
      'Dedicated Nairobi account manager',
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function ProductPreview() {
  return (
    <div className="lp-product-frame" aria-label="Pramukh Digital ERP product dashboard preview">
      <div className="lp-product-topbar">
        <div className="lp-window-dots"><span /><span /><span /></div>
        <div className="lp-product-url">Pramukh Digital ERP Client · Windows x64</div>
        <span className="lp-product-badge">Live branch view</span>
      </div>
      <div className="lp-product-body">
        <aside className="lp-product-sidebar">
          {[
            ['Dashboard', true],
            ['Sales & POS', false],
            ['Purchase', false],
            ['Inventory', false],
            ['Reports', false],
          ].map(([label, active]) => (
            <div key={label as string} className={`lp-product-nav${active ? ' active' : ''}`}>
              <span />
              {label}
            </div>
          ))}
        </aside>
        <div className="lp-product-content">
          <div className="lp-product-heading">
            <div>
              <p>Branch Operations Dashboard</p>
              <h3>Nairobi Central Branch</h3>
            </div>
            <div className="lp-product-filter">Today · All Stores</div>
          </div>
          <div className="lp-product-metrics">
            {[
              ['Total SKUs', '1,248'],
              ['Stock value', 'KES 8.6M'],
              ['Sales today', 'KES 418K'],
              ['Credit sales', 'KES 92K'],
            ].map(([label, value]) => (
              <div key={label} className="lp-product-metric">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="lp-product-panel">
            <div className="lp-panel-head">
              <span>Stock Value by Category (KES)</span>
              <small>Cloud Synced</small>
            </div>
            <div className="lp-bars" style={{ alignItems: 'flex-end', height: 100 }}>
              {[72, 48, 86, 61, 38].map((height, index) => (
                <motion.span
                  key={height}
                  style={{ height: `${height}%`, transformOrigin: 'bottom' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.4 + index * 0.08, duration: 0.5 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, [location.hash]);

  const handleStartSetup = () => {
    navigate('/onboarding/step-1');
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lp-shell">
      <MarketingHeader onScrollTo={scrollTo} />

      <main id="main-content">
        <section className="lp-hero lp-business-hero" id="hero">
          <motion.div
            className="lp-hero-inner"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="lp-badge">
              <ShieldCheck size={15} />
              Desktop-first ERP built for Kenyan commerce
            </motion.div>
            <motion.h1 variants={fadeUp} className="lp-hero-h1">
              The Desktop ERP for Multi-Branch Commerce
            </motion.h1>
            <motion.p variants={fadeUp} className="lp-hero-sub">
              Pramukh Digital connects front-counter POS, supplier purchasing,
              inventory transfers, customer credit, manager approvals, and branch
              analytics into one dependable desktop operating system.
            </motion.p>
            <motion.div variants={fadeUp} className="lp-hero-ctas">
              <button className="lp-btn-primary" onClick={handleStartSetup} id="btn-hero-start">
                Start Free Workspace Setup
                <ArrowRight size={18} />
              </button>
              <Link to="/downloads" className="lp-btn-ghost">
                <Download size={18} />
                Download Windows Client
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="lp-trust-row">
              <span className="lp-trust-item"><Check size={13} /> Branch-scoped permissions</span>
              <span className="lp-trust-dot" />
              <span className="lp-trust-item"><Check size={13} /> Windows 10/11 64-bit client</span>
              <span className="lp-trust-dot" />
              <span className="lp-trust-item"><Check size={13} /> Offline-first counter speed</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="lp-hero-preview"
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            <ProductPreview />
          </motion.div>
        </section>

        <section className="lp-stats-strip" id="platform">
          <div className="lp-container">
            <div className="lp-stats-grid">
              {outcomes.map((item) => (
                <div key={item.label} className="lp-stat-item">
                  <div className="lp-stat-value">{item.value}</div>
                  <div className="lp-stat-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section" id="operations">
          <div className="lp-container lp-platform-grid">
            <div>
              <p className="lp-section-eyebrow">Operational Governance</p>
              <h2 className="lp-section-h2">Built for how commercial businesses actually run.</h2>
              <p className="lp-section-desc">
                Pramukh Digital connects sales counters, warehouse restocks,
                customer credit terms, manager approvals, and tax reports so your team works from the exact same operational truth.
              </p>
            </div>
            <div className="lp-control-list">
              {[
                [Building2, 'Branch-First Permissions', 'Give each branch manager visibility into only their assigned location and stores.'],
                [PackageCheck, 'Stock Tied Directly to Transactions', 'Purchases add stock, sales reduce stock, and inter-branch transfers are fully audited.'],
                [WalletCards, 'Customer & Supplier Ledgers', 'Track cash sales, credit terms, deposits, and outstanding receivables in Kenyan Shillings.'],
                [Lock, 'Secure Cloud Organization', 'Role permissions, audit activity logs, and encrypted cloud synchronization protect your data.'],
              ].map(([Icon, title, desc]) => {
                const TypedIcon = Icon as typeof Building2;
                return (
                  <div className="lp-control-item" key={title as string}>
                    <TypedIcon size={21} />
                    <div>
                      <h3>{title as string}</h3>
                      <p>{desc as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="lp-section lp-section-alt" id="modules">
          <div className="lp-container">
            <div className="lp-section-header">
              <p className="lp-section-eyebrow">Enterprise Workflows</p>
              <h2 className="lp-section-h2">Every operational workflow your stores need.</h2>
            </div>
            <div className="lp-module-grid">
              {modules.map((m) => {
                const Icon = m.icon;
                return (
                  <div className="lp-module-card" key={m.name}>
                    <div className="lp-module-icon"><Icon size={22} /></div>
                    <h3>{m.name}</h3>
                    <p>{m.desc}</p>
                    <ul className="lp-module-features">
                      {m.features.map((feat) => (
                        <li key={feat}><Check size={14} />{feat}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="lp-section" id="pricing">
          <div className="lp-container">
            <div className="lp-section-header">
              <p className="lp-section-eyebrow">Transparent Pricing</p>
              <h2 className="lp-section-h2">Predictable pricing in Kenyan Shillings.</h2>
              <p className="lp-section-desc">
                Start free with single-counter basics. Upgrade as your branches and product lines expand.
              </p>
            </div>
            <div className="lp-pricing-grid">
              {pricingPlans.map((plan) => (
                <div key={plan.name} className={`lp-pricing-card${plan.featured ? ' featured' : ''}`}>
                  {plan.featured && <div className="lp-pricing-badge">Recommended</div>}
                  <div className="lp-pricing-plan-header">
                    <div className="lp-pricing-name">{plan.name}</div>
                    <div className="lp-pricing-desc">{plan.desc}</div>
                  </div>
                  <div className="lp-pricing-price">
                    <span className="lp-price-amount">{plan.price}</span>
                  </div>
                  <ul className="lp-pricing-features">
                    {plan.features.map((feature) => (
                      <li key={feature} className="included">
                        <span className="lp-feat-check">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="lp-pricing-cta lp-pricing-cta-primary"
                    onClick={() => {
                      if (plan.name === 'Enterprise') {
                        window.location.href = 'mailto:sales@pramukhdigital.com?subject=Enterprise%20ERP%20Inquiry';
                      } else {
                        handleStartSetup();
                      }
                    }}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Enterprise Sales' : 'Start Free Setup'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-cta-section">
          <div className="lp-container">
            <div className="lp-cta-card">
              <div className="lp-cta-badge">Desktop Client v{latestErpClientRelease.version}</div>
              <h2 className="lp-cta-h2">Ready to run your branch operations on Pramukh Digital?</h2>
              <p className="lp-cta-desc">
                Create your cloud workspace in minutes, then download the Windows client for fast counter billing and stock control.
              </p>
              <div className="lp-cta-btns">
                <button className="lp-btn-primary" onClick={handleStartSetup}>
                  Start Free Setup
                  <ArrowRight size={18} />
                </button>
                <Link to="/downloads" className="lp-btn-ghost">
                  <Download size={18} />
                  Downloads & Release Notes
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter onScrollTo={scrollTo} />
    </div>
  );
}
