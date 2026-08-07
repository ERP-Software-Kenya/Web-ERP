import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle" style={{
      display: 'inline-flex',
      background: 'var(--color-surface-2)',
      border: '1px solid var(--color-border)',
      borderRadius: '8px',
      padding: '4px',
      gap: '4px'
    }}>
      <button 
        onClick={() => setTheme('light')}
        style={{
          background: theme === 'light' ? 'var(--color-surface)' : 'transparent',
          border: 'none',
          boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          color: theme === 'light' ? 'var(--color-primary)' : 'var(--color-text-muted)',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
        title="Light Mode"
      >
        <Sun size={14} />
      </button>
      <button 
        onClick={() => setTheme('system')}
        style={{
          background: theme === 'system' ? 'var(--color-surface)' : 'transparent',
          border: 'none',
          boxShadow: theme === 'system' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          color: theme === 'system' ? 'var(--color-primary)' : 'var(--color-text-muted)',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
        title="System Theme"
      >
        <Monitor size={14} />
      </button>
      <button 
        onClick={() => setTheme('dark')}
        style={{
          background: theme === 'dark' ? 'var(--color-surface)' : 'transparent',
          border: 'none',
          boxShadow: theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          color: theme === 'dark' ? 'var(--color-primary)' : 'var(--color-text-muted)',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
        title="Dark Mode"
      >
        <Moon size={14} />
      </button>
    </div>
  );
}
