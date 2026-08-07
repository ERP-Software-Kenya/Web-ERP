import React, { useState } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import StepLayout from '../components/StepLayout';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Truck, Landmark, Users, Briefcase } from 'lucide-react';

const MODULES = [
  { id: 'inventory', name: 'Inventory Management', desc: 'Track stock, variants, and locations', icon: Package },
  { id: 'sales', name: 'Sales & Invoicing', desc: 'Manage orders, quotes, and billing', icon: ShoppingCart },
  { id: 'purchasing', name: 'Purchasing & POs', desc: 'Supplier management and restocks', icon: Truck },
  { id: 'accounting', name: 'Financial Accounting', desc: 'Ledgers, P&L, and tax compliance', icon: Landmark },
  { id: 'crm', name: 'CRM', desc: 'Customer tracking and interactions', icon: Users },
  { id: 'hr', name: 'HR & Payroll', desc: 'Employee management and salaries', icon: Briefcase },
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
      title="Select initial modules"
      subtitle="You can always add or remove these later."
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
                <Icon size={18} color={isSelected ? '#fff' : 'var(--color-text-muted)'} />
              </div>
              <div style={{ textAlign: 'left', marginTop: '8px' }}>
                <h3 className="custom-module-title">
                  {m.name}
                </h3>
                <p className="custom-module-desc">
                  {m.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      {error && <div className="form-error custom-form-error">{error}</div>}
    </StepLayout>
  );
}
