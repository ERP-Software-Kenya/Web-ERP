import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Truck, Landmark, Users, Briefcase, BarChart3, Lock } from 'lucide-react';

const MODULES = [
  { id: 'inventory', name: 'Inventory & Warehouse', desc: 'Stock tracking, transfers, warehouse packing', icon: Package },
  { id: 'sales', name: 'Sales & POS', desc: 'Invoicing, POS, quotations, orders', icon: ShoppingCart },
  { id: 'fleet', name: 'Fleet Management', desc: 'Vehicles, GPS tracking, trips & dispatch', icon: Truck },
  { id: 'purchasing', name: 'Purchasing & Bills', desc: 'Purchase orders, suppliers, bills', icon: Briefcase },
  { id: 'accounting', name: 'Finance & Accounts', desc: 'Expenses, payments, creditors, debtors', icon: Landmark },
  { id: 'crm', name: 'CRM & Customers', desc: 'Customer profiles, credit approvals', icon: Users },
  { id: 'reports', name: 'Reports & Analytics', desc: 'KPI dashboards, audit logs, exports', icon: BarChart3 },
  { id: 'admin', name: 'Admin & Roles', desc: 'Users, roles, branch pricing, access control', icon: Lock },
];

export default function Step5Modules() {
  const { data, setData, goNext, goBack } = useOnboarding();
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (data.modules.length === 0) {
      setError('Please select at least one module to get started');
      return;
    }
    goNext();
  };

  const toggleModule = (id: string) => {
    let nextModules = [...data.modules];
    if (nextModules.includes(id)) {
      nextModules = nextModules.filter(m => m !== id);
    } else {
      nextModules.push(id);
    }
    setData({ modules: nextModules });
    if (nextModules.length > 0) setError('');
  };

  return (
    <StepLayout
      title="Select your modules"
      subtitle="Pick what your business needs. You can always add more later."
      onContinue={handleContinue}
      onBack={goBack}
    >
      <div className="custom-module-grid">
        {MODULES.map(m => {
          const isSelected = data.modules.includes(m.id);
          const Icon = m.icon;
          return (
            <motion.div
              key={m.id}
              onClick={() => toggleModule(m.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`custom-module-card ${isSelected ? 'selected' : ''}`}
            >
              <div className="custom-module-icon-wrap">
                <Icon size={18} color={isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
              </div>
              <div style={{ textAlign: 'left', marginTop: '8px' }}>
                <h3 className="custom-module-title">{m.name}</h3>
                <p className="custom-module-desc">{m.desc}</p>
              </div>
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      {error && <div className="form-error custom-form-error">{error}</div>}
    </StepLayout>
  );
}
