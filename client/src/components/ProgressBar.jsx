import React from 'react';

const ProgressBar = ({ percentage = 0, height = '8px', showLabel = true, color = 'var(--primary)' }) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Progress</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{clamped}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            background: color,
            borderRadius: '999px',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
