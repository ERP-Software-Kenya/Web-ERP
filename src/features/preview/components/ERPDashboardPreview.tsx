import React from 'react';
import {
  LayoutDashboard, Building2, Store, Package, Tag,
  Boxes, Truck, ShoppingCart, Receipt, FileText,
  CreditCard, Bell, Activity, Users, Settings,
  ChevronRight, ChevronDown, Sun, CheckCircle2, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/preview-override.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
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
      { id: 'stores', label: 'Stores', icon: Store },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'categories', label: 'Categories', icon: Tag },
    ]
  },
  {
    label: 'Operations',
    items: [
      { id: 'inventory', label: 'Inventory', icon: Boxes },
      { id: 'suppliers', label: 'Suppliers', icon: Truck },
      { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
      { id: 'orders', label: 'Orders', icon: ShoppingCart },
    ]
  },
  {
    label: 'Finance',
    items: [
      { id: 'bills', label: 'Bills', icon: Receipt },
      { id: 'invoices', label: 'Invoices', icon: FileText },
      { id: 'expenses', label: 'Expenses', icon: CreditCard },
      { id: 'reports', label: 'Reports', icon: FileText },
    ]
  },
  {
    label: 'System',
    items: [
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'activity-logs', label: 'Activity Logs', icon: Activity },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  }
];

const BAR_HEIGHTS = [35, 55, 40, 75, 60, 85, 50, 70, 90, 65];
const BAR2_HEIGHTS = [20, 35, 25, 45, 40, 55, 30, 50, 60, 40];

export default function ERPDashboardPreview({ orgName, activeModules = [], currentStep = 1, userName }: ERPDashboardPreviewProps) {
  const displayName = orgName.trim() || 'ERP System';
  const displayUserName = userName?.trim() || 'Demo User';
  const displayUserInitial = displayUserName.charAt(0).toUpperCase();

  // Dynamic Stats Generation based on active modules
  let stats = [
    { label: 'Total Revenue', value: 'KSh 248K', change: '+12.4%' },
    { label: 'Invoices Sent', value: '134', change: '+8.2%' },
    { label: 'Stock Items', value: '1,240', change: '+3.1%' },
    { label: 'Active Customers', value: '89', change: '+5.7%' },
  ];

  if (activeModules.includes('hr')) {
    stats[0] = { label: 'Total Employees', value: '42', change: '+2' };
    stats[1] = { label: 'Payroll Run', value: 'KSh 1.2M', change: 'On Time' };
  }
  if (activeModules.includes('inventory')) {
    stats[2] = { label: 'Stock Items', value: '3,450', change: '+12%' };
    stats[3] = { label: 'Low Stock Alerts', value: '14', change: '-2' };
  }
  if (activeModules.includes('crm')) {
    stats[3] = { label: 'Active Customers', value: '342', change: '+15.2%' };
    if (!activeModules.includes('hr')) {
       stats[1] = { label: 'New Leads', value: '45', change: '+8' };
    }
  }

  return (
    <div className="erp-preview-wrapper">
      {/* Sidebar mimicking ERP-Client Sidebar.tsx */}
      <aside className="erp-sidebar">
        <div className="erp-logo-area">
          <div className="erp-logo-icon">E</div>
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
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={18} />
                      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                      {isActive && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
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
        {/* Topbar mimicking ERP-Client Topbar.tsx */}
        <header className="erp-topbar">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            style={{ background: 'transparent', border: 'none', color: 'hsl(215, 20.2%, 65.1%)', display: 'flex', cursor: 'pointer' }}
          >
            <Sun size={20} />
          </motion.button>
          
          <motion.div 
            whileHover={{ opacity: 0.8 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '12px', borderLeft: '1px solid hsl(217.2, 32.6%, 17.5%)', cursor: 'pointer' }}
          >
            <div className="erp-user-badge">{displayUserInitial}</div>
            <div className="erp-user-info">
              <span className="erp-user-name">{displayUserName}</span>
              <span className="erp-user-role">admin</span>
            </div>
            <ChevronDown size={16} color="hsl(215, 20.2%, 65.1%)" style={{ marginLeft: 4 }} />
          </motion.div>
        </header>

        <motion.div 
          className="erp-body custom-scrollbar"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <div className="erp-topbar-title">Dashboard</div>
            <div className="erp-topbar-greeting">Welcome back, {displayUserName} 👋</div>
          </motion.div>

          {/* Setup Checklist (Interactive based on currentStep) */}
          <motion.div variants={itemVariants} style={{ background: 'var(--color-surface-2)', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '12px' }}>Onboarding Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <motion.div animate={{ opacity: currentStep >= 2 ? 1 : 0.5 }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {currentStep > 2 ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={16} className="text-green-500" /></motion.div> : <Circle size={16} color="var(--color-text-muted)" />}
                <span style={{ fontSize: '0.8125rem', color: currentStep > 2 ? 'var(--color-text)' : 'var(--color-text-muted)', textDecoration: currentStep > 2 ? 'line-through' : 'none', transition: 'all 0.3s ease' }}>Set Organization Details</span>
              </motion.div>
              <motion.div animate={{ opacity: currentStep >= 5 ? 1 : 0.5 }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {currentStep > 5 ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={16} className="text-green-500" /></motion.div> : <Circle size={16} color="var(--color-text-muted)" />}
                <span style={{ fontSize: '0.8125rem', color: currentStep > 5 ? 'var(--color-text)' : 'var(--color-text-muted)', textDecoration: currentStep > 5 ? 'line-through' : 'none', transition: 'all 0.3s ease' }}>Configure Modules</span>
              </motion.div>
              <motion.div animate={{ opacity: currentStep >= 6 ? 1 : 0.5 }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {currentStep > 6 ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={16} className="text-green-500" /></motion.div> : <Circle size={16} color="var(--color-text-muted)" />}
                <span style={{ fontSize: '0.8125rem', color: currentStep > 6 ? 'var(--color-text)' : 'var(--color-text-muted)', textDecoration: currentStep > 6 ? 'line-through' : 'none', transition: 'all 0.3s ease' }}>Select Pricing Plan</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="erp-stats-row">
            {stats.map((stat, idx) => (
              <motion.div 
                className="erp-stat-card" 
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.1)', cursor: 'pointer' }}
              >
                <div className="erp-stat-label">{stat.label}</div>
                <motion.div 
                  className="erp-stat-value"
                  key={stat.value} // re-animate on value change
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >{stat.value}</motion.div>
                <div className="erp-stat-change">↑ {stat.change}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts */}
          <motion.div variants={itemVariants} className="erp-charts-row">
            <motion.div className="erp-chart-card" whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div className="erp-chart-title">Revenue Overview</div>
              <div className="mini-bars">
                {BAR_HEIGHTS.map((h, i) => (
                  <React.Fragment key={i}>
                    <motion.div 
                      className={`mini-bar${i === 8 ? ' highlight' : ''}`} 
                      variants={barVariants}
                      custom={`${h}%`}
                      initial="hidden"
                      animate="show"
                    />
                    <motion.div 
                      className="mini-bar accent" 
                      variants={barVariants}
                      custom={`${BAR2_HEIGHTS[i]}%`}
                      initial="hidden"
                      animate="show"
                    />
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
            <motion.div className="erp-chart-card" whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div className="erp-chart-title">Recent Activity</div>
              <div className="recent-list">
                {[
                  { label: 'Invoice #1024', value: 'KSh 12,400' },
                  { label: 'PO #0033', value: 'KSh 4,800' },
                  { label: 'Expense', value: 'KSh 950' },
                  { label: 'New Customer', value: 'Nile Corp' },
                ].map((item, idx) => (
                  <motion.div 
                    className="recent-item" 
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 4, background: 'var(--color-surface-3)' }}
                    style={{ borderRadius: '6px', padding: '4px 8px', margin: '0 -8px', cursor: 'pointer' }}
                  >
                    <span className="recent-item-label">{item.label}</span>
                    <span className="recent-item-value">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Module pills */}
          <AnimatePresence mode="popLayout">
            {activeModules.length > 0 && (
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                style={{ marginTop: '24px' }}
              >
                <div style={{ fontSize: '0.6875rem', color: 'hsl(215, 20.2%, 65.1%)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Active Modules
                </div>
                <div className="module-highlight">
                  {ALL_MODULES.map((mod, idx) => {
                    const isActive = activeModules.some(m => mod.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(mod.toLowerCase()));
                    return (
                      <motion.div
                        key={mod}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-surface-3)',
                          color: isActive ? '#fff' : 'var(--color-text)',
                          borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)'
                        }}
                        transition={{ delay: idx * 0.05 }}
                        className={`module-pill${isActive ? ' active' : ''}`}
                      >
                        {mod}
                      </motion.div>
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
