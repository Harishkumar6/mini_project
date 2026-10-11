import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display in this view yet.',
  actionBtn = null,
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '520px',
        margin: '2rem auto',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <Icon size={32} color="#818cf8" />
      </div>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: actionBtn ? '1.5rem' : 0 }}>
        {description}
      </p>
      {actionBtn}
    </div>
  );
};

export default EmptyState;
