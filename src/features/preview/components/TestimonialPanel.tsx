import React from 'react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

interface TestimonialPanelProps {
  testimonial: Testimonial;
  stats?: { icon: string; value: string; label: string }[];
}

export default function TestimonialPanel({ testimonial, stats }: TestimonialPanelProps) {
  return (
    <div className="testimonial-panel">
      {stats && (
        <div className="stats-row">
          {stats.map(s => (
            <div className="stat-bubble" key={s.label}>
              <div className="stat-bubble-icon">{s.icon}</div>
              <div className="stat-bubble-value">{s.value}</div>
              <div className="stat-bubble-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="testimonial-card">
        <p className="testimonial-quote">{testimonial.quote}</p>
        <div className="testimonial-author">
          <div className="testimonial-avatar">{testimonial.initials}</div>
          <div>
            <div className="testimonial-name">{testimonial.name}</div>
            <div className="testimonial-role">{testimonial.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
