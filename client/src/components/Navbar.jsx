import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Compass,
  Flame,
  Zap,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  Target,
  Award,
  ShieldAlert,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <nav
      style={{
        background: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '0.85rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Compass color="#ffffff" size={24} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.03em',
              }}
            >
              Prep<span style={{ color: '#818cf8' }}>Pilot</span>
            </span>
            <div
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
                lineHeight: 1,
                marginTop: '-2px',
              }}
            >
              Placement Success Platform
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {!isAuthenticated ? (
            <>
              <a href="#features" style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>
                Features
              </a>
              <a href="#how-it-works" style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>
                How It Works
              </a>
              <Link to="/login" style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          ) : (
            <>
              {/* Badges for student */}
              {!isAdmin && user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginRight: '0.5rem' }}>
                  <div
                    className="badge"
                    style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                    title="Current Learning Streak"
                  >
                    <Flame size={14} />
                    <span>{user.streak || 1} Day Streak</span>
                  </div>
                  <div
                    className="badge"
                    style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}
                    title="XP Score"
                  >
                    <Zap size={14} />
                    <span>{user.xp || 100} XP</span>
                  </div>
                </div>
              )}

              {/* User Profile Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.35rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isAdmin ? '#ef4444' : '#6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#fff',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                    {user?.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {isAdmin ? 'ADMINISTRATOR' : 'STUDENT'}
                  </span>
                </div>
              </div>

              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Sign Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'none',
          }}
          className="mobile-toggle"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
