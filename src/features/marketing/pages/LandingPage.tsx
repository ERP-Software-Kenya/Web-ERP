import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Package, ShoppingCart, Truck, Building2, Users, Briefcase,
  Check, Star, Globe, Shield, Database, ChevronRight, Play,
  BarChart3, TrendingUp, Cpu, Lock, MapPin, FileText,
  Radio, ClipboardList, Activity, Plus,
  Receipt, CreditCard, Navigation, Boxes, Tag, Bell,
} from 'lucide-react';
import { useOnboarding } from '../../onboarding/context/OnboardingContext';
import { useLatestRelease } from '../../shared/hooks/useLatestRelease';
import MarketingHeader from '../components/MarketingHeader';
import MarketingFooter from '../components/MarketingFooter';

/* ── Animated Counter ────────────────────────────────────────────── */
function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 1800, bounce: 0 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) motionValue.set(value); }, [inView, motionValue, value]);
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
    name: 'Inventory & Warehouse',
    desc: 'Real-time multi-location stock tracking, automated movements, warehouse packing workflows, and stock transfer management across all branches.',
    color: '#4f7af8',
    features: ['Multi-location stock tracking', 'Warehouse packing queues', 'Stock transfers & requests', 'Unpublished product control'],
  },
  {
    icon: ShoppingCart,
    name: 'Sales, POS & Quotations',
    desc: 'Full Point-of-Sale, professional quotation builder, invoice generation, sales returns, and credit approval workflows — all connected.',
    color: '#22c55e',
    features: ['Point of Sale (POS)', 'Quotation → Order → Invoice', 'Credit approvals & limits', 'Sales & item returns'],
  },
  {
    icon: Truck,
    name: 'Fleet Management',
    desc: 'Live GPS vehicle tracking, trip planning, driver management, dispatch center operations, maintenance scheduling, and fleet expense tracking.',
    color: '#f59e0b',
    features: ['Live GPS fleet map', 'Dispatch center & trips', 'Driver & vehicle management', 'Maintenance & fleet expenses'],
  },
  {
    icon: Building2,
    name: 'Multi-Location & Branches',
    desc: 'Manage multiple branches, warehouses and locations with branch-specific pricing, consolidated stock views, and organisation-level controls.',
    color: '#a855f7',
    features: ['Branch pricing control', 'Location & warehouse mgmt', 'Stock requests by branch', 'Org hierarchy management'],
  },
  {
    icon: Briefcase,
    name: 'Purchasing & Procurement',
    desc: 'End-to-end procurement: purchase orders, bills, supplier management, purchase returns, and a BlackStock system for special procurement flows.',
    color: '#06b6d4',
    features: ['Purchase orders & receipts', 'Supplier management', 'Bills & purchase returns', 'BlackStock procurement'],
  },
  {
    icon: CreditCard,
    name: 'Finance & Accounts',
    desc: 'Track all business finances: expenses, payment transactions, creditors and debtors ledgers, with exportable reports in Excel or PDF.',
    color: '#f43f5e',
    features: ['Creditors & debtors ledger', 'Expense tracking', 'Payment transactions', 'Export to Excel/PDF'],
  },
  {
    icon: BarChart3,
    name: 'Reports & Analytics',
    desc: 'Configurable report generation, activity audit logs, report generation history, and real-time KPI dashboards across every module.',
    color: '#10b981',
    features: ['Report generation engine', 'Activity & audit logs', 'Sales & inventory KPIs', 'Report generation history'],
  },
  {
    icon: Lock,
    name: 'Admin, Roles & Access',
    desc: 'Granular role-based access, page-level permission control, user management, tax configuration, and platform-wide settings.',
    color: '#6366f1',
    features: ['Role-based access control', 'Page-level permissions', 'Tax & platform config', 'Notification settings'],
  },
];

const FEATURE_TABS = [
  {
    id: 'inventory',
    label: 'Inventory',
    icon: Package,
    color: '#4f7af8',
    headline: 'Complete inventory intelligence across every location',
    desc: 'From raw stock intake to warehouse packing to branch transfers — every movement is logged, auditable, and real-time. Never lose track of a single unit.',
    highlights: [
      { icon: Boxes, text: 'Multi-location stock with real-time sync' },
      { icon: ArrowRight, text: 'Warehouse packing queues with picker workflows' },
      { icon: Navigation, text: 'Stock transfer requests between branches' },
      { icon: Tag, text: 'Unpublished product drafts before going live' },
      { icon: ClipboardList, text: 'Full product movement & log history' },
    ],
    preview: {
      title: 'Inventory Dashboard',
      stats: [
        { l: 'Total SKUs', v: '4,891', c: '+124 this week' },
        { l: 'Low Stock', v: '14', c: 'Alerts active' },
        { l: 'In Transit', v: '38', c: 'Transfers' },
        { l: 'Packing Queue', v: '12', c: 'Pending' },
      ],
    },
  },
  {
    id: 'sales',
    label: 'Sales & POS',
    icon: ShoppingCart,
    color: '#22c55e',
    headline: 'From quotation to payment — the complete sales cycle',
    desc: 'Build quotations, convert to orders, raise invoices, process payments at POS, and manage credit all from one unified interface. No data silos.',
    highlights: [
      { icon: ShoppingCart, text: 'Full-featured Point of Sale (POS)' },
      { icon: FileText, text: 'Professional quotation builder' },
      { icon: Receipt, text: 'Quotation → Order → Invoice flow' },
      { icon: Shield, text: 'Credit approval workflow with limits' },
      { icon: ArrowRight, text: 'Sales & item returns management' },
    ],
    preview: {
      title: 'Sales Overview',
      stats: [
        { l: 'Today Sales', v: 'KSh 284K', c: '+18%' },
        { l: 'Open Quotes', v: '47', c: 'Pending' },
        { l: 'POS Sessions', v: '3', c: 'Active' },
        { l: 'Credit Approvals', v: '8', c: 'Pending' },
      ],
    },
  },
  {
    id: 'fleet',
    label: 'Fleet',
    icon: Truck,
    color: '#f59e0b',
    headline: 'Live fleet intelligence — from GPS to dispatch',
    desc: 'Track every vehicle in real-time on a live map, plan and execute trips, manage your driver roster, run a full dispatch center, and monitor maintenance alerts.',
    highlights: [
      { icon: MapPin, text: 'Live GPS vehicle tracking map' },
      { icon: Navigation, text: 'Trip planning & dispatch center' },
      { icon: Users, text: 'Driver roster & assignment management' },
      { icon: Activity, text: 'Maintenance schedules & alerts' },
      { icon: CreditCard, text: 'Fleet expenses & cost tracking' },
    ],
    preview: {
      title: 'Fleet Live View',
      stats: [
        { l: 'Active Vehicles', v: '7/9', c: 'On road' },
        { l: 'Trips Today', v: '23', c: '+5 planned' },
        { l: 'Pending Maintenance', v: '2', c: 'Due soon' },
        { l: 'Fleet Cost MTD', v: 'KSh 42K', c: '-8% vs LM' },
      ],
    },
  },
  {
    id: 'purchasing',
    label: 'Purchasing',
    icon: Briefcase,
    color: '#06b6d4',
    headline: 'Complete procurement from PO to warehouse receipt',
    desc: 'Create purchase orders, receive goods into the warehouse, manage supplier relationships, track bills, and handle the full BlackStock procurement workflow.',
    highlights: [
      { icon: FileText, text: 'Purchase orders with approval flows' },
      { icon: Package, text: 'Goods receipt directly into stock' },
      { icon: Users, text: 'Supplier database & performance tracking' },
      { icon: Receipt, text: 'Bills management & purchase returns' },
      { icon: Database, text: 'BlackStock special procurement system' },
    ],
    preview: {
      title: 'Purchasing Overview',
      stats: [
        { l: 'Open POs', v: '18', c: 'Pending receipt' },
        { l: 'Pending Bills', v: 'KSh 1.2M', c: '12 bills' },
        { l: 'Suppliers', v: '84', c: 'Active' },
        { l: 'Returns', v: '3', c: 'In progress' },
      ],
    },
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    color: '#10b981',
    headline: 'Every metric, every log, every export — on demand',
    desc: 'Generate scheduled or on-demand reports across all modules. Full audit trail of every report generated, activity logs per user, and KPI dashboards.',
    highlights: [
      { icon: BarChart3, text: 'Cross-module report generation engine' },
      { icon: ClipboardList, text: 'Report generation history & logs' },
      { icon: Activity, text: 'User-level activity audit trail' },
      { icon: Database, text: 'Export to Excel, PDF, CSV' },
      { icon: Bell, text: 'Scheduled report delivery' },
    ],
    preview: {
      title: 'Analytics Dashboard',
      stats: [
        { l: 'Reports Run', v: '1,240', c: 'This month' },
        { l: 'Active Dashboards', v: '6', c: 'Shared' },
        { l: 'Audit Events', v: '28.4K', c: 'All time' },
        { l: 'Last Export', v: '2h ago', c: 'Sales PDF' },
      ],
    },
  },
];

const FAQ_ITEMS = [
  {
    q: 'Can I run Pramukh Digital on Windows without internet?',
    a: 'Yes. The desktop app works offline for core operations — POS, inventory, order management. Data syncs automatically when you reconnect. The web version requires an internet connection.',
  },
  {
    q: 'How does multi-branch pricing work?',
    a: 'You set a base price at the product level, then apply branch-specific overrides. Each branch sees and sells at its configured price. Stock requests flow between branches with full approval controls.',
  },
  {
    q: 'Does the fleet module include live GPS tracking?',
    a: 'Yes. The Fleet module includes a Live Fleet Map with real-time GPS positions for all vehicles, trip assignment, driver tracking, and dispatch center operations.',
  },
  {
    q: 'What is the BlackStock system?',
    a: 'BlackStock is a special procurement workflow for sourcing outside your standard supplier network — useful for one-off purchases, emergency restocks, or goods acquired through non-standard channels. It has its own PO flow, receipt tracking, and reporting.',
  },
  {
    q: 'Can I control what each user can see and do?',
    a: 'Yes. Pramukh Digital has role-based access control with page-level permissions. You define roles (admin, manager, sales rep, driver, etc.), assign pages and actions they can perform, then assign roles to users.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. The Starter plan is free forever with up to 2 users, basic inventory, and invoicing. No credit card needed. Upgrade anytime as your business grows.',
  },
  {
    q: 'Can I import my existing data?',
    a: 'Yes. Pramukh Digital supports Excel import for products, customers, suppliers, and opening stock. We also provide a REST API for custom integrations and automated data pipelines.',
  },
  {
    q: 'How does the onboarding work?',
    a: 'Create your account, set up your organisation, choose the modules you need, and pick a plan — all in under 5 minutes. Your workspace is live immediately. No consultant or implementation project needed.',
  },
];

const stats = [
  { value: 500, suffix: '+', label: 'Businesses Using It' },
  { value: 80, suffix: '+', label: 'Core Features' },
  { value: 8, suffix: '', label: 'Business Modules' },
  { value: 99, suffix: '.9%', label: 'Uptime SLA' },
];

const testimonials = [
  {
    quote: 'Pramukh Digital transformed how we manage our 4 warehouse locations. Stock transfers that used to take hours now happen in minutes — and the fleet tracking is a game changer.',
    name: 'Amara Nwosu',
    role: 'Operations Director, Nwosu Distribution Ltd',
    location: 'Lagos, Nigeria',
    initials: 'AN',
  },
  {
    quote: "The POS and quotation builder are outstanding. We've cut our billing cycle from 3 days to same-day. The credit approval workflow has eliminated disputes completely.",
    name: 'Kenji Muthoka',
    role: 'CEO, Muthoka Retail Group',
    location: 'Nairobi, Kenya',
    initials: 'KM',
  },
  {
    quote: "Finally, an ERP that doesn't need a consultant. We were live in under an hour. Branch pricing alone saved us hours every week — and our team actually loves using it.",
    name: 'Priya Nakato',
    role: 'Finance Manager, Nakato Manufacturing',
    location: 'Kampala, Uganda',
    initials: 'PN',
  },
];

const steps = [
  { num: '01', title: 'Set Up Your Workspace', desc: 'Create your account, add organisation details, choose your industry, and select the modules you need — all in under 5 minutes.', icon: Cpu },
  { num: '02', title: 'Import Your Data', desc: 'Bring in your existing inventory, customers, suppliers and opening stock via Excel import or connect via our REST API.', icon: Database },
  { num: '03', title: 'Run Your Business', desc: 'Your team manages stock, raises quotations, runs the POS, tracks fleet, and views live analytics from day one — on desktop or web.', icon: TrendingUp },
];

const pricingPlans = [
  {
    name: 'Starter',
    desc: 'Perfect for small businesses getting started',
    price: { monthly: 0, annual: 0 },
    badge: null as string | null,
    features: [
      { text: 'Up to 2 users', included: true },
      { text: 'Inventory & basic invoicing', included: true },
      { text: 'Customer management', included: true },
      { text: 'Fleet & branch management', included: false },
      { text: 'Advanced analytics & reports', included: false },
      { text: 'Multi-location support', included: false },
    ],
    cta: 'Get Started Free',
    ctaStyle: 'outline' as const,
  },
  {
    name: 'Growth',
    desc: 'For growing teams and multi-channel operations',
    price: { monthly: 49, annual: 39 },
    badge: 'Most Popular',
    features: [
      { text: 'Up to 15 users', included: true },
      { text: 'Full inventory + warehouse packing', included: true },
      { text: 'POS, quotations & invoicing', included: true },
      { text: 'Fleet management & GPS tracking', included: true },
      { text: 'Advanced reports & analytics', included: true },
      { text: 'Multi-location & branch pricing', included: false },
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
      { text: 'Multi-location & branch pricing', included: true },
      { text: 'BlackStock procurement system', included: true },
      { text: 'Custom integrations & API access', included: true },
      { text: 'Dedicated account manager + 24/7 support', included: true },
    ],
    cta: 'Contact Sales',
    ctaStyle: 'solid' as const,
  },
];

const bentoFeatures = [
  {
    icon: Radio,
    color: '#f59e0b',
    title: 'Real-Time Everywhere',
    desc: 'Every inventory movement, sale, fleet position, and transaction syncs instantly across all locations. No refresh. No delays. Always live.',
    wide: false,
  },
  {
    icon: Shield,
    color: '#22c55e',
    title: 'Enterprise-Grade Security',
    desc: 'Role-based access control with page-level granularity, comprehensive audit logs, and end-to-end encryption throughout.',
    wide: false,
  },
  {
    icon: MapPin,
    color: '#4f7af8',
    title: 'Built for Your Market',
    desc: 'Multi-currency support, local tax configurations, branch-level pricing, and region-specific workflows. Designed to understand your market — and help you grow beyond it.',
    wide: true,
  },
  {
    icon: Activity,
    color: '#a855f7',
    title: 'Full Audit Trail',
    desc: 'Every action logged. Activity logs, report generation history, user-level accountability — always know who did what and when.',
    wide: false,
  },
  {
    icon: FileText,
    color: '#f43f5e',
    title: 'Quotation to Cash',
    desc: 'Build quotations, convert to orders, raise invoices, collect payments — the complete sales cycle in one connected flow.',
    wide: false,
  },
];

/* ── Animation Variants ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ── FAQ Item ────────────────────────────────────────────────────── */
function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="lp-faq-item">
      <button className="lp-faq-question" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={18} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="lp-faq-answer">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Feature Tab Preview ─────────────────────────────────────────── */
function FeaturePreviewCard({ tab }: { tab: typeof FEATURE_TABS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      className="lp-feat-preview"
    >
      <div className="lp-feat-preview-topbar">
        <div className="lp-preview-dots"><span /><span /><span /></div>
        <div className="lp-feat-preview-title">{tab.preview.title}</div>
      </div>
      <div className="lp-feat-preview-stats">
        {tab.preview.stats.map(s => (
          <div key={s.l} className="lp-feat-preview-stat">
            <div className="lp-feat-preview-stat-label">{s.l}</div>
            <div className="lp-feat-preview-stat-value">{s.v}</div>
            <div className="lp-feat-preview-stat-sub">{s.c}</div>
          </div>
        ))}
      </div>
      <div className="lp-feat-preview-chart">
        {[45, 68, 52, 80, 62, 88, 72, 95, 78, 100, 82, 96].map((h, i) => (
          <motion.div
            key={i}
            className="lp-feat-preview-bar"
            style={{ '--bar-color': tab.color, height: `${h}%`, transformOrigin: 'bottom' } as React.CSSProperties}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: 'easeOut' }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Component ───────────────────────────────────────────────────── */
export default function LandingPage() {
  const { goNext, isClerkLoaded, isSignedIn } = useOnboarding();
  const navigate = useNavigate();
  const shellRef = useRef<HTMLDivElement>(null);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { version, loading: versionLoading } = useLatestRelease();
  const badgeText = versionLoading
    ? '● Loading...'
    : version && version !== 'Latest'
      ? `${version} — Now Available`
      : 'v1.1 — Now Available';

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 5500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const onScroll = () => setShowScrollTop(shell.scrollTop > 400);
    shell.addEventListener('scroll', onScroll, { passive: true });
    return () => shell.removeEventListener('scroll', onScroll);
  }, []);

  const handleCTA = () => {
    if (isClerkLoaded && isSignedIn) navigate('/dashboard');
    else goNext();
  };

  const handleContactSales = () => {
    window.location.href = 'mailto:sales@pramukhdigital.in?subject=Enterprise%20Plan%20Inquiry';
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    shellRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTab = FEATURE_TABS[activeFeatureTab];
  const ActiveTabIcon = activeTab.icon;

  return (
    <div className="lp-shell" ref={shellRef}>
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
        <motion.div className="lp-hero-inner" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="lp-badge">
            <span className="lp-badge-dot" />
            {badgeText}
          </motion.div>

          <motion.h1 variants={fadeUp} className="lp-hero-h1">
            One Platform for<br />
            <span className="lp-gradient-text">Every Part of Your Business</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="lp-hero-sub">
            Pramukh Digital unifies inventory, sales, fleet, finance, and operations
            on one lightning-fast platform. Real-time sync, multi-location ready,
            and built to scale with you.
          </motion.p>

          <motion.div variants={fadeUp} className="lp-hero-ctas">
            <button className="lp-btn-primary" onClick={handleCTA}>
              {isClerkLoaded && isSignedIn ? 'Go to Dashboard' : 'Start Free — No Card Needed'}
              <ArrowRight size={18} />
            </button>
            <button className="lp-btn-ghost" onClick={() => scrollTo('modules')}>
              <Play size={14} />
              Explore Modules
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
              <div className="lp-preview-dots"><span /><span /><span /></div>
              <div className="lp-preview-url">app.pramukhdigital.com/dashboard</div>
            </div>
            <div className="lp-preview-body">
              <div className="lp-preview-sidebar">
                {['Dashboard', 'Inventory', 'Sales & POS', 'Fleet', 'Finance', 'Reports'].map((item, i) => (
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
                    { l: 'Fleet Active', v: '7/9', c: 'Live' },
                    { l: 'Stock Items', v: '4,891', c: '' },
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
                <div className="lp-stat-value"><Counter value={s.value} suffix={s.suffix} /></div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── MODULES ───────────────── */}
      <section className="lp-section" id="modules">
        <div className="lp-container">
          <motion.div className="lp-section-header" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Everything You Need</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">Eight Modules. One Unified Platform.</motion.h2>
            <motion.p variants={fadeUp} className="lp-section-desc">
              Select only the modules your business needs today. Add more as you grow.
              Every module is fully integrated — no data silos, no duplicate entry.
            </motion.p>
          </motion.div>

          <motion.div className="lp-modules-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
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

      {/* ──────────────────── FEATURE SHOWCASE ──────── */}
      <section className="lp-section lp-section-alt" id="features">
        <div className="lp-container">
          <motion.div className="lp-section-header" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Deep Dive</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">Explore Every Module in Detail</motion.h2>
            <motion.p variants={fadeUp} className="lp-section-desc">
              Click any module below to see exactly what it does, what it tracks, and how it fits into your operation.
            </motion.p>
          </motion.div>

          {/* Tab Buttons */}
          <div className="lp-feature-tabs">
            {FEATURE_TABS.map((tab, i) => {
              const TabIcon = tab.icon;
              const isActive = activeFeatureTab === i;
              return (
                <button
                  key={tab.id}
                  className={`lp-feature-tab-btn${isActive ? ' active' : ''}`}
                  onClick={() => setActiveFeatureTab(i)}
                  style={isActive ? { '--tab-color': tab.color } as React.CSSProperties : undefined}
                >
                  <TabIcon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeatureTab}
              className="lp-feature-tab-content"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Left: description + highlights */}
              <div className="lp-feat-left">
                <div className="lp-feat-icon-wrap" style={{ background: `${activeTab.color}18`, color: activeTab.color }}>
                  <ActiveTabIcon size={28} />
                </div>
                <h3 className="lp-feat-headline">{activeTab.headline}</h3>
                <p className="lp-feat-desc">{activeTab.desc}</p>
                <ul className="lp-feat-highlights">
                  {activeTab.highlights.map((h, i) => {
                    const HIcon = h.icon;
                    return (
                      <motion.li
                        key={i}
                        className="lp-feat-highlight-item"
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <div className="lp-feat-highlight-dot" style={{ background: `${activeTab.color}22`, color: activeTab.color }}>
                          <HIcon size={14} />
                        </div>
                        <span>{h.text}</span>
                      </motion.li>
                    );
                  })}
                </ul>
                <button className="lp-btn-primary lp-feat-cta" onClick={handleCTA} style={{ marginTop: 28 }}>
                  Start with {activeTab.label}
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Right: preview card */}
              <div className="lp-feat-right">
                <AnimatePresence mode="wait">
                  <FeaturePreviewCard key={activeFeatureTab} tab={activeTab} />
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ──────────────────── WHY PRAMUKH DIGITAL ─── */}
      <section className="lp-section" id="why">
        <div className="lp-container">
          <motion.div className="lp-section-header" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Why Pramukh Digital</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">Built Different. Built Better.</motion.h2>
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
      <section className="lp-section lp-section-alt" id="how-it-works">
        <div className="lp-container">
          <motion.div className="lp-section-header" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Get Started</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">Up and Running in Minutes</motion.h2>
            <motion.p variants={fadeUp} className="lp-section-desc">
              No consultants. No lengthy implementations. No complexity.
              A clean, guided setup that gets your team operational fast.
            </motion.p>
          </motion.div>
          <div className="lp-steps">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div key={step.num} className="lp-step" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <div className="lp-step-num">{step.num}</div>
                  <div className="lp-step-icon"><StepIcon size={24} /></div>
                  <h3 className="lp-step-title">{step.title}</h3>
                  <p className="lp-step-desc">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────── PRICING ───────────────── */}
      <section className="lp-section" id="pricing">
        <div className="lp-container">
          <motion.div className="lp-section-header" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Pricing</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">Simple, Transparent Pricing</motion.h2>
            <motion.p variants={fadeUp} className="lp-section-desc">Start free and scale as you grow. No hidden fees. Cancel anytime.</motion.p>
            <motion.div variants={fadeUp} className="lp-billing-toggle">
              <button className={`lp-toggle-btn${billing === 'monthly' ? ' active' : ''}`} onClick={() => setBilling('monthly')}>Monthly</button>
              <button className={`lp-toggle-btn${billing === 'annual' ? ' active' : ''}`} onClick={() => setBilling('annual')}>
                Annual <span className="lp-save-badge">Save 20%</span>
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
                      <span className="lp-price-amount">{billing === 'monthly' ? plan.price.monthly : plan.price.annual}</span>
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
                  onClick={plan.ctaStyle === 'solid' ? handleContactSales : handleCTA}
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
      <section className="lp-section lp-section-alt" id="testimonials">
        <div className="lp-container">
          <motion.div className="lp-section-header" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} className="lp-section-eyebrow">Customer Stories</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">Trusted Across the Region</motion.h2>
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
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="lp-testimonial-quote">"{t.quote}"</p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="lp-testimonial-name">{t.name}</div>
                    <div className="lp-testimonial-role">{t.role}</div>
                    <div className="lp-testimonial-location"><Globe size={11} />{t.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="lp-testimonial-dots">
            {testimonials.map((_, i) => (
              <button key={i} className={`lp-t-dot${i === activeTestimonial ? ' active' : ''}`} onClick={() => setActiveTestimonial(i)} aria-label={`Testimonial ${i + 1}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── FAQ ───────────────────── */}
      <section className="lp-section" id="faq">
        <div className="lp-container">
          <motion.div className="lp-section-header" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={fadeUp} className="lp-section-eyebrow">FAQ</motion.p>
            <motion.h2 variants={fadeUp} className="lp-section-h2">Common Questions</motion.h2>
            <motion.p variants={fadeUp} className="lp-section-desc">
              Everything you need to know before getting started.{' '}
              <button className="lp-faq-contact-link" onClick={handleContactSales}>Can't find your answer? Contact us directly.</button>
            </motion.p>
          </motion.div>
          <motion.div className="lp-faq-grid" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {FAQ_ITEMS.map((item, i) => (
              <motion.div key={i} variants={fadeUp}>
                <FaqItem q={item.q} a={item.a} defaultOpen={i === 0} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ──────────────────── FINAL CTA ─────────────── */}
      <section className="lp-cta-section">
        <div className="lp-container">
          <motion.div className="lp-cta-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="lp-cta-badge">Start Today</div>
            <h2 className="lp-cta-h2">Ready to Modernize<br />Your Operations?</h2>
            <p className="lp-cta-desc">
              Join hundreds of businesses running smarter with Pramukh Digital.
              Start free — no credit card required.
            </p>
            <div className="lp-cta-btns">
              <button className="lp-btn-primary" onClick={handleCTA}>
                Initialize Your Workspace <ArrowRight size={18} />
              </button>
              <button className="lp-btn-ghost" onClick={() => scrollTo('pricing')}>View Pricing</button>
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

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-top-btn"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            aria-label="Scroll to top"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 14V4M9 4l-4 4M9 4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
