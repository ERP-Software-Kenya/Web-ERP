import React from 'react';
import {
  LayoutDashboard, Building2, Store, Package, Tag,
  Boxes, Truck, ShoppingCart, Receipt, FileText,
  CreditCard, Bell, Activity, Users, Settings,
  ChevronRight, ChevronDown, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../theme/context/ThemeContext';
import '../styles/preview-override.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const barVariants = {
  hidden: { height: 0 },
  show: (height: string) => ({
    height,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  })
};

interface ERPDashboardPreviewProps {
  orgName: string;
  activeModules?: string[];
  currentStep?: number;
  userName?: string;
}

const ALL_MODULES = ['Inventory', 'Invoices', 'Customers', 'Suppliers', 'Purchase Orders', 'Expenses', 'Reports', 'Orders'];

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Master Data',
    items: [
      { id: 'organizations', label: 'Organizations', icon: Building2 },
      { id: 'stores', label: 'Stores & Branches', icon: Store },
      { id: 'products', label: 'Products & SKUs', icon: Package },
      { id: 'categories', label: 'Categories', icon: Tag },
    ]
  },
  {
    label: 'Operations',
    items: [
      { id: 'inventory', label: 'Inventory Control', icon: Boxes },
      { id: 'suppliers', label: 'Suppliers', icon: Truck },
      { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
      { id: 'orders', label: 'Sales & Invoices', icon: ShoppingCart },
    ]
  },
  {
    label: 'Finance & Reports',
    items: [
      { id: 'bills', label: 'Supplier Bills', icon: Receipt },
      { id: 'invoices', label: 'Customer Ledgers', icon: FileText },
      { id: 'expenses', label: 'Operating Expenses', icon: CreditCard },
      { id: 'reports', label: 'KRA & Audit Reports', icon: FileText },
    ]
  },
  {
    label: 'System Admin',
    items: [
      { id: 'notifications', label: 'Audit Alerts', icon: Bell },
      { id: 'activity-logs', label: 'Branch Logs', icon: Activity },
      { id: 'users', label: 'Role Permissions', icon: Users },
      { id: 'settings', label: 'System Settings', icon: Settings },
    ]
  }
];

const BAR_HEIGHTS = [35, 55, 40, 75, 60, 85, 50, 70, 90, 65];
const BAR2_HEIGHTS = [20, 35, 25, 45, 40, 55, 30, 50, 60, 40];

export default function ERPDashboardPreview({ orgName, activeModules = [], userName }: ERPDashboardPreviewProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const displayName = orgName.trim() || 'Pramukh Digital ERP';
  const displayUserName = userName?.trim() || 'Admin User';
  const displayUserInitial = displayUserName.charAt(0).toUpperCase();

  // Dynamic Kenyan Shilling stats based on active modules
  let stats = [
    { label: 'Total Revenue', value: 'KES 248.5K', change: '+12.4%' },
    { label: 'Invoices Issued', value: '134', change: '+8.2%' },
    { label: 'Stock Items', value: '1,248 SKUs', change: '+3.1%' },
    { label: 'Active Accounts', value: '89', change: '+5.7%' },
  ];

  if (activeModules.includes('purchasing')) {
    stats[1] = { label: 'Supplier POs', value: '28 Active', change: 'On Track' };
  }
  if (activeModules.includes('inventory')) {
    stats[2] = { label: 'Stock Valuation', value: 'KES 8.6M', change: '+4.2%' };
  }
  if (activeModules.includes('analytics')) {
    stats[0] = { label: 'Gross Margin', value: '31.8%', change: '+2.4%' };
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="erp-preview-wrapper">
      {/* Sidebar */}
      <aside className="erp-sidebar">
        <div className="erp-logo-area">
          <div className="erp-logo-icon">P</div>
          <span className="erp-org-name">{displayName}</span>
        </div>

        <motion.div 
          className="erp-sidebar-body custom-scrollbar"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {NAV_GROUPS.map((group) => (
            <motion.div key={group.label} className="erp-nav-section" variants={itemVariants}>
              <p className="erp-nav-label">{group.label}</p>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {group.items.map((item) => {
                  const isActive = item.id === 'dashboard';
                  const isHighlighted = activeModules.some(m =>
                    item.label.toLowerCase().includes(m.toLowerCase()) ||
                    m.toLowerCase().includes(item.label.toLowerCase()) ||
                    item.id.toLowerCase().includes(m.toLowerCase())
                  );
                  const Icon = item.icon;
                  
                  let className = "erp-nav-item";
                  if (isActive) className += " active";
                  else if (isHighlighted) className += " highlighted";

                  return (
                    <motion.div 
                      key={item.id} 
                      className={className}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={17} />
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                      {isActive && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          ))}
        </motion.div>
      </aside>

      {/* Main content */}
      <div className="erp-main">
        {/* Topbar */}
        <header className="erp-topbar">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            aria-label="Toggle theme preview"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              display: 'flex',
              cursor: 'pointer',
              padding: 6,
            }}
          >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingLeft: '12px',
              borderLeft: '1px solid var(--color-border)',
            }}
          >
            <div className="erp-user-badge">{displayUserInitial}</div>
            <div className="erp-user-info">
              <span className="erp-user-name">{displayUserName}</span>
              <span className="erp-user-role">Administrator</span>
            </div>
            <ChevronDown size={14} color="var(--color-text-muted)" style={{ marginLeft: 4 }} />
          </div>
        </header>

        <motion.div 
          className="erp-body custom-scrollbar"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <div className="erp-topbar-title">Branch Operations Overview</div>
            <div className="erp-topbar-greeting">Welcome back, {displayUserName} 👋 · Nairobi Central Branch</div>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="erp-stats-row">
            {stats.map((stat, idx) => (
              <motion.div 
                className="erp-stat-card" 
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
              >
                <div className="erp-stat-label">{stat.label}</div>
                <motion.div 
                  className="erp-stat-value"
                  key={stat.value}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {stat.value}
                </motion.div>
                <div className="erp-stat-change">↑ {stat.change} vs last week</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Row */}
          <motion.div variants={itemVariants} className="erp-charts-row">
            <motion.div className="erp-chart-card">
              <div className="erp-chart-title">Weekly Revenue (KES)</div>
              <div className="mini-bars" style={{ alignItems: 'flex-end', height: 110 }}>
                {BAR_HEIGHTS.map((h, i) => (
                  <React.Fragment key={i}>
                    <motion.div 
                      className={`mini-bar${i === 8 ? ' highlight' : ''}`} 
                      variants={barVariants}
                      custom={`${h}%`}
                      initial="hidden"
                      animate="show"
                      style={{ transformOrigin: 'bottom' }}
                    />
                    <motion.div 
                      className="mini-bar accent" 
                      variants={barVariants}
                      custom={`${BAR2_HEIGHTS[i]}%`}
                      initial="hidden"
                      animate="show"
                      style={{ transformOrigin: 'bottom' }}
                    />
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            <motion.div className="erp-chart-card">
              <div className="erp-chart-title">Recent Transactions</div>
              <div className="recent-list">
                {[
                  { label: 'Counter Invoice #1042', value: 'KES 18,400' },
                  { label: 'Supplier PO #0089', value: 'KES 45,200' },
                  { label: 'Store Transfer #12', value: '14 Units' },
                  { label: 'Customer Deposit', value: 'KES 12,000' },
                ].map((item, idx) => (
                  <motion.div 
                    className="recent-item" 
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    style={{ borderRadius: '6px', padding: '6px 8px' }}
                  >
                    <span className="recent-item-label" style={{ fontSize: '0.8125rem' }}>{item.label}</span>
                    <span className="recent-item-value" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Active Module Pills */}
          <AnimatePresence mode="popLayout">
            {activeModules.length > 0 && (
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                style={{ marginTop: '20px' }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Active Operational Modules
                </div>
                <div className="module-highlight" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALL_MODULES.map((mod) => {
                    const isActive = activeModules.some(m => mod.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(mod.toLowerCase()));
                    return (
                      <div
                        key={mod}
                        className={`module-pill${isActive ? ' active' : ''}`}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: isActive ? 'var(--color-primary)' : 'var(--color-surface-2)',
                          color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                          border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {mod}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
