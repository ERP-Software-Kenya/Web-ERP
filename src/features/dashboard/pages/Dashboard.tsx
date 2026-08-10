import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../onboarding/context/OnboardingContext';
import { LayoutDashboard, Users, ShoppingCart, Settings, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { clerk, isSignedIn } = useOnboarding();
  const navigate = useNavigate();
  
  // If user accesses dashboard directly without being signed in, they should probably be redirected
  // But we'll leave that to higher level auth guards normally. For now, just a basic view.

  const handleSignOut = async () => {
    if (clerk) {
      await clerk.signOut();
      navigate('/');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg, #f8fafc)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'var(--color-surface, #ffffff)', borderRight: '1px solid var(--color-border, #e2e8f0)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--color-primary, #2563eb)', borderBottom: '1px solid var(--color-border, #e2e8f0)' }}>
          Web-ERP
        </div>
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', background: 'var(--color-primary-light, #eff6ff)', color: 'var(--color-primary, #2563eb)', textDecoration: 'none', fontWeight: 500 }}>
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: 'var(--color-text-muted, #64748b)', textDecoration: 'none', fontWeight: 500 }}>
            <ShoppingCart size={20} /> Sales
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: 'var(--color-text-muted, #64748b)', textDecoration: 'none', fontWeight: 500 }}>
            <Users size={20} /> Customers
          </a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', color: 'var(--color-text-muted, #64748b)', textDecoration: 'none', fontWeight: 500 }}>
            <Settings size={20} /> Settings
          </a>
        </nav>
        
        <div style={{ padding: '24px 16px', borderTop: '1px solid var(--color-border, #e2e8f0)' }}>
          <button 
            onClick={handleSignOut}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', width: '100%', borderRadius: '8px', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 500, cursor: 'pointer' }}
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <header style={{ background: 'var(--color-surface, #ffffff)', padding: '24px 32px', borderBottom: '1px solid var(--color-border, #e2e8f0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0, color: 'var(--color-text, #0f172a)' }}>Welcome Back</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--color-text-muted, #64748b)' }}>{isSignedIn ? 'Logged In' : 'Guest'}</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary, #2563eb)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              U
            </div>
          </div>
        </header>

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Stat Card 1 */}
            <div style={{ background: 'var(--color-surface, #ffffff)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border, #e2e8f0)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ color: 'var(--color-text-muted, #64748b)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Total Revenue</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text, #0f172a)' }}>$0.00</div>
            </div>

            {/* Stat Card 2 */}
            <div style={{ background: 'var(--color-surface, #ffffff)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border, #e2e8f0)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ color: 'var(--color-text-muted, #64748b)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Active Customers</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text, #0f172a)' }}>0</div>
            </div>

            {/* Stat Card 3 */}
            <div style={{ background: 'var(--color-surface, #ffffff)', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border, #e2e8f0)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ color: 'var(--color-text-muted, #64748b)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Pending Orders</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text, #0f172a)' }}>0</div>
            </div>

          </div>
          
          <div style={{ marginTop: '32px', background: 'var(--color-surface, #ffffff)', borderRadius: '16px', border: '1px solid var(--color-border, #e2e8f0)', padding: '32px', textAlign: 'center', color: 'var(--color-text-muted, #64748b)' }}>
            This is a placeholder dashboard. You can begin building your full ERP application here!
          </div>
        </div>
      </main>
    </div>
  );
}
