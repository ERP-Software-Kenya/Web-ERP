import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    desc: 'Invoice, cash sale, credit sale, black stock sale, returns, and payment collection flows for every branch.',
    features: ['Cash and credit billing', 'Branch stock deduction', 'Customer ledger impact'],
  },
  {
    icon: Truck,
    name: 'Purchase Management',
    desc: 'Purchase entry, supplier control, receiving, allocation, and landed stock visibility from one place.',
    features: ['Supplier purchase records', 'Stock allocation', 'Branch-aware procurement'],
  },
  {
    icon: Boxes,
    name: 'Inventory Control',
    desc: 'Track white stock, black stock, conversion, valuation, low-stock items, and multi-location availability.',
    features: ['Live quantity movement', 'Black to white conversion', 'Stock valuation'],
  },
  {
    icon: BarChart3,
    name: 'Analytics',
    desc: 'Sales, purchase, inventory, branch, category, payment, and customer analytics filtered by time and branch.',
    features: ['Timeline filters', 'Branch filters', 'Operational dashboards'],
  },
  {
    icon: FileSpreadsheet,
    name: 'Reports',
    desc: 'Generate total sales, cash sales, credit sales, purchases, expenses, payments, and customer reports.',
    features: ['PDF exports', 'Record-level data', 'Audit-friendly outputs'],
  },
  {
    icon: ClipboardCheck,
    name: 'Approvals',
    desc: 'Control sensitive operational actions with role-based approval workflows and manager visibility.',
    features: ['Role-based review', 'Branch accountability', 'Operational control'],
  },
];

const outcomes = [
  { value: '1', label: 'source of truth for branch operations' },
  { value: '360', label: 'degree sales, purchase, and stock visibility' },
  { value: '0.1.9', label: 'latest desktop client release' },
  { value: '24/7', label: 'desktop access for active teams' },
];

const operations = [
  'Branch managers see analytics for their assigned branch only.',
  'Store teams sell and purchase against the stock they are allowed to access.',
  'Inventory valuation, movement, and reporting stay tied to the same transaction data.',
  'Desktop client updates are distributed through a public GitHub release channel.',
];

const pricingPlans = [
  {
    name: 'Starter',
    desc: 'For a single shop moving from spreadsheets.',
    price: 'Free',
    features: ['Core sales and product setup', 'Basic customer records', 'Single location workflow'],
  },
  {
    name: 'Growth',
    desc: 'For retailers and distributors with multiple users.',
    price: 'Custom',
    featured: true,
    features: ['Sales, purchase, inventory, and reports', 'Branch and store permissions', 'Desktop ERP client'],
  },
  {
    name: 'Enterprise',
    desc: 'For multi-branch teams needing operational governance.',
    price: 'Custom',
    features: ['Advanced approvals', 'Deployment support', 'Custom reporting and integrations'],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function ProductPreview() {
  return (
    <div className="lp-product-frame" aria-label="ERP product dashboard preview">
      <div className="lp-product-topbar">
        <div className="lp-window-dots"><span /><span /><span /></div>
        <div className="lp-product-url">Pramukh Digital ERP Client</div>
        <span className="lp-product-badge">Live branch view</span>
      </div>
      <div className="lp-product-body">
        <aside className="lp-product-sidebar">
          {[
            ['Dashboard', true],
            ['Sales', false],
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
              <p>Inventory Dashboard</p>
              <h3>Branch performance</h3>
            </div>
            <div className="lp-product-filter">Today - All branches</div>
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
              <span>Stock value by category</span>
              <small>Synced</small>
            </div>
            <div className="lp-bars">
              {[72, 48, 86, 61, 38].map((height, index) => (
                <motion.span
                  key={height}
                  style={{ height: `${height}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.45 + index * 0.08, duration: 0.45 }}
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
  const { goNext } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, [location.hash]);

  const handleCTA = () => {
    goNext();
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lp-shell">
      <MarketingHeader onScrollTo={scrollTo} />

      <section className="lp-hero lp-business-hero" id="hero">
        <motion.div
          className="lp-hero-inner"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="lp-badge">
            <ShieldCheck size={15} />
            Production-ready ERP for branch-led commerce
          </motion.div>
          <motion.h1 variants={fadeUp} className="lp-hero-h1">
            Pramukh Digital
          </motion.h1>
          <motion.p variants={fadeUp} className="lp-hero-sub">
            A professional desktop ERP for businesses that need reliable sales,
            purchase, inventory, reports, approvals, and branch analytics in one
            controlled operating system.
          </motion.p>
          <motion.div variants={fadeUp} className="lp-hero-ctas">
            <a className="lp-btn-primary" href={latestErpClientRelease.assets[0].url} download>
              <Download size={18} />
              Download latest client
            </a>
            <button className="lp-btn-ghost" onClick={handleCTA}>
              Start onboarding
              <ArrowRight size={18} />
            </button>
          </motion.div>
          <motion.div variants={fadeUp} className="lp-trust-row">
            <span className="lp-trust-item"><Check size={13} /> Branch-scoped operations</span>
            <span className="lp-trust-dot" />
            <span className="lp-trust-item"><Check size={13} /> Windows desktop client</span>
            <span className="lp-trust-dot" />
            <span className="lp-trust-item"><Check size={13} /> GitHub release delivery</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="lp-hero-preview"
          initial={{ opacity: 0, y: 42, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
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

      <section className="lp-section">
        <div className="lp-container lp-platform-grid">
          <div>
            <p className="lp-section-eyebrow">Platform</p>
            <h2 className="lp-section-h2">Built for the way branch businesses actually run.</h2>
            <p className="lp-section-desc">
              Pramukh Digital connects front-counter sales, supplier purchases,
              inventory movement, customer credit, manager approvals, and reports
              so teams work from the same operational record.
            </p>
          </div>
          <div className="lp-control-list">
            {[
              [Building2, 'Branch-first permissions', 'Give each manager visibility into only their assigned branch and stores.'],
              [PackageCheck, 'Stock that follows transactions', 'Purchases add stock, sales reduce stock, and conversions are traceable.'],
              [WalletCards, 'Payment visibility', 'Separate cash, credit, customer, supplier, and expense views for finance teams.'],
              [Lock, 'Authentication and access control', 'Clerk-based login and role permissions protect operational data.'],
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
            <p className="lp-section-eyebrow">Modules</p>
            <h2 className="lp-section-h2">Core ERP coverage from day one.</h2>
            <p className="lp-section-desc">
              Each module is designed around practical workflows that a retail,
              wholesale, or distribution business uses every day.
            </p>
          </div>

          <div className="lp-modules-grid">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <motion.article
                  key={mod.name}
                  className="lp-module-card"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                >
                  <div className="lp-module-icon">
                    <Icon size={22} />
                  </div>
                  <h3 className="lp-module-name">{mod.name}</h3>
                  <p className="lp-module-desc">{mod.desc}</p>
                  <ul className="lp-module-features">
                    {mod.features.map((feature) => (
                      <li key={feature}><Check size={12} /> {feature}</li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="lp-section" id="operations">
        <div className="lp-container lp-ops-layout">
          <div>
            <p className="lp-section-eyebrow">Operations</p>
            <h2 className="lp-section-h2">Control sales, purchase, and stock at branch level.</h2>
            <p className="lp-section-desc">
              The system is made for businesses where different branches should
              work independently, while ownership still needs consolidated
              reporting and controlled access.
            </p>
          </div>
          <div className="lp-ops-card">
            {operations.map((operation) => (
              <div className="lp-ops-row" key={operation}>
                <Store size={19} />
                <span>{operation}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section-alt" id="pricing">
        <div className="lp-container">
          <div className="lp-section-header">
            <p className="lp-section-eyebrow">Commercial plans</p>
            <h2 className="lp-section-h2">Start lean, scale into full branch control.</h2>
            <p className="lp-section-desc">
              Pricing can be aligned to users, branches, deployment support, and
              required reporting depth.
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
                <button className="lp-pricing-cta lp-pricing-cta-primary" onClick={handleCTA}>
                  Talk to sales
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
            <div className="lp-cta-badge">Desktop client v{latestErpClientRelease.version}</div>
            <h2 className="lp-cta-h2">Give your team the ERP client they can run today.</h2>
            <p className="lp-cta-desc">
              Download the latest Windows installer or open the downloads page
              for the release manifest and available versions.
            </p>
            <div className="lp-cta-btns">
              <a className="lp-btn-primary" href={latestErpClientRelease.assets[0].url} download>
                <Download size={18} />
                Download latest
              </a>
              <button className="lp-btn-ghost" onClick={() => navigate('/downloads')}>
                View all versions
              </button>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter onScrollTo={scrollTo} />
    </div>
  );
}
