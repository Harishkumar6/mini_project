import React from 'react';
import { Compass, Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        background: '#090d16',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 2rem 2rem 2rem',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Compass color="#ffffff" size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Prep<span style={{ color: '#818cf8' }}>Pilot</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Your Personalized Path to Placement Success. An end-to-end MERN training platform with rule-based personalized learning roadmaps.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              Core Modules
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><a href="#features" style={{ color: 'var(--text-muted)' }}>Aptitude Training</a></li>
              <li><a href="#features" style={{ color: 'var(--text-muted)' }}>Logical Problem Solving</a></li>
              <li><a href="#features" style={{ color: 'var(--text-muted)' }}>Communication & Verbal</a></li>
              <li><a href="#features" style={{ color: 'var(--text-muted)' }}>Coding Practice</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              Platform Features
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><span style={{ color: 'var(--text-muted)' }}>Personalized Learning Roadmap</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Timed Mock Assessments</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Performance Analytics</span></li>
              <li><span style={{ color: 'var(--text-muted)' }}>Gamified XP & Badges</span></li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>© {new Date().getFullYear()} PrepPilot. College Final-Year Placement Project.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> using MongoDB, Express, React & Node.js
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
