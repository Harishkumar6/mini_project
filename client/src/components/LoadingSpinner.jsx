import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '1rem',
        color: 'var(--text-muted)',
      }}
    >
      <Loader2 size={36} color="#818cf8" style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{text}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
