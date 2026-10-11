import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Code,
  FileCheck,
  Compass,
  BarChart3,
  Award,
  User,
  Users,
  FolderTree,
  FileText,
  LogOut,
  Sparkles,
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Learn Topics', path: '/learn', icon: BookOpen },
    { label: 'Practice Questions', path: '/practice', icon: HelpCircle },
    { label: 'Coding Practice', path: '/coding', icon: Code },
    { label: 'Assessments', path: '/assessments', icon: FileCheck },
    { label: 'Learning Roadmap', path: '/roadmap', icon: Compass, badge: 'AI/Rule' },
    { label: 'Progress Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Achievements', path: '/achievements', icon: Award },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Students List', path: '/admin/students', icon: Users },
    { label: 'Categories CRUD', path: '/admin/categories', icon: FolderTree },
    { label: 'Topics CRUD', path: '/admin/topics', icon: BookOpen },
    { label: 'Materials CRUD', path: '/admin/materials', icon: FileText },
    { label: 'Questions CRUD', path: '/admin/questions', icon: HelpCircle },
    { label: 'Coding Problems', path: '/admin/coding', icon: Code },
    { label: 'Assessments CRUD', path: '/admin/assessments', icon: FileCheck },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside
      style={{
        width: '260px',
        background: '#0d1322',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        minHeight: 'calc(100vh - 65px)',
      }}
    >
      <div style={{ padding: '0 0.5rem 1rem 0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {isAdmin ? 'ADMINISTRATOR PANEL' : 'STUDENT NAVIGATION'}
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {links.map((link) => {
          const IconComponent = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(79,70,229,0.15) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                transition: 'all 0.15s ease',
              })}
            >
              <IconComponent size={18} color={link.path === window.location.pathname ? '#818cf8' : 'currentColor'} />
              <span style={{ flex: 1 }}>{link.label}</span>
              {link.badge && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(20, 184, 166, 0.2)',
                    color: '#2dd4bf',
                    fontWeight: 700,
                  }}
                >
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.85rem',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
