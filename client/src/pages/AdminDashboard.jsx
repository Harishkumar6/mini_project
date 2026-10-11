import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, BookOpen, HelpCircle, Code, FileCheck, ShieldAlert, ArrowRight, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Error loading admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="main-content">
          <Navbar />
          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <div className="page-body">
              <LoadingSpinner text="Fetching platform administration overview..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            {/* Header Banner */}
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                marginBottom: '2rem',
                borderLeft: '4px solid #ef4444',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(17, 24, 39, 0.95) 100%)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ShieldAlert size={20} color="#f87171" />
                <span className="badge badge-hard">ADMINISTRATOR CONTROL CENTER</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.5rem' }}>System Management Dashboard</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Manage registered students, update topic learning materials, practice question bank, coding problems, and mock assessments.
              </p>
            </div>

            {/* Quick System Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <StatCard icon={Users} title="Total Registered Students" value={stats?.totalStudents || 0} color="#6366f1" />
              <StatCard icon={Activity} title="Active Learners (7 Days)" value={stats?.activeLearners || 0} color="#10b981" />
              <StatCard icon={BookOpen} title="Total Topics" value={stats?.totalTopics || 0} color="#38bdf8" />
              <StatCard icon={HelpCircle} title="Question Bank" value={stats?.totalQuestions || 0} color="#fbbf24" />
              <StatCard icon={Code} title="Coding Problems" value={stats?.totalCodingProblems || 0} color="#ec4899" />
              <StatCard icon={FileCheck} title="Published Mock Exams" value={stats?.totalAssessments || 0} color="#8b5cf6" />
            </div>

            {/* Admin Quick Action Cards */}
            <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem' }}>Administrative Management Modules</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Student Management</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  View student roster, check department filters, inspect test performance, and toggle account activation.
                </p>
                <Link to="/admin/students" className="btn btn-primary btn-sm">
                  Manage Students <ArrowRight size={14} />
                </Link>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Topic & Material CRUD</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Add or edit topics, write key concepts, formulas, and solved examples for student learning modules.
                </p>
                <Link to="/admin/topics" className="btn btn-primary btn-sm">
                  Manage Topics <ArrowRight size={14} />
                </Link>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Questions & Assessment Bank</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Create practice questions, configure option choices, set difficulty levels, and publish full-length mock exams.
                </p>
                <Link to="/admin/questions" className="btn btn-primary btn-sm">
                  Manage Question Bank <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
