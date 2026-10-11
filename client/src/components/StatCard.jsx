import React from 'react';

const StatCard = ({ icon: Icon, title, value, subtext, color = '#6366f1' }) => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}18`,
          border: `1px solid ${color}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={24} color={color} />}
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: '2px 0' }}>
          {value}
        </div>
        {subtext && <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{subtext}</div>}
      </div>
    </div>
  );
};

export default StatCard;
