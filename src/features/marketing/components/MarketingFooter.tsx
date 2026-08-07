import React from 'react';
import { Twitter, Linkedin, Github, ArrowRight } from 'lucide-react';

export default function MarketingFooter() {
  return (
    <footer className="marketing-footer">
      <div className="marketing-footer-top">
        <div className="marketing-footer-brand">
          <div className="marketing-logo" style={{ marginBottom: 16 }}>
            <div className="marketing-logo-icon">W</div>
            <span>Web-ERP</span>
          </div>
          <p className="marketing-footer-desc">
            The unified operating system for modern commerce. Scale your inventory, sales, and operations on a single architecture.
          </p>
          <div className="marketing-newsletter">
            <p className="marketing-newsletter-label">Subscribe to our newsletter</p>
            <div className="marketing-newsletter-input-group">
              <input type="email" placeholder="Enter your email" className="marketing-newsletter-input" />
              <button className="marketing-newsletter-btn">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="marketing-footer-links-group">
          <h4 className="marketing-footer-heading">Product</h4>
          <a href="#" className="marketing-footer-link">Inventory Management</a>
          <a href="#" className="marketing-footer-link">Financials & Billing</a>
          <a href="#" className="marketing-footer-link">CRM & Sales</a>
          <a href="#" className="marketing-footer-link">HR & Payroll</a>
          <a href="#" className="marketing-footer-link">Pricing</a>
        </div>

        <div className="marketing-footer-links-group">
          <h4 className="marketing-footer-heading">Resources</h4>
          <a href="#" className="marketing-footer-link">Documentation</a>
          <a href="#" className="marketing-footer-link">API Reference</a>
          <a href="#" className="marketing-footer-link">Community Forum</a>
          <a href="#" className="marketing-footer-link">Blog</a>
          <a href="#" className="marketing-footer-link">Help Center</a>
        </div>

        <div className="marketing-footer-links-group">
          <h4 className="marketing-footer-heading">Company</h4>
          <a href="#" className="marketing-footer-link">About Us</a>
          <a href="#" className="marketing-footer-link">Careers</a>
          <a href="#" className="marketing-footer-link">Partners</a>
          <a href="#" className="marketing-footer-link">Contact Sales</a>
          <a href="#" className="marketing-footer-link">System Status</a>
        </div>
      </div>

      <div className="marketing-footer-bottom">
        <div className="marketing-footer-copyright">
          © {new Date().getFullYear()} Web-ERP Technologies Inc. All rights reserved.
        </div>

        <div className="marketing-footer-social">
          <a href="#" className="marketing-social-link"><Twitter size={18} /></a>
          <a href="#" className="marketing-social-link"><Linkedin size={18} /></a>
          <a href="#" className="marketing-social-link"><Github size={18} /></a>
        </div>

        <div className="marketing-footer-legal">
          <a href="#" className="marketing-footer-link small">Privacy Policy</a>
          <a href="#" className="marketing-footer-link small">Terms of Service</a>
          <a href="#" className="marketing-footer-link small">Security</a>
        </div>
      </div>
    </footer>
  );
}
