import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle, AlertTriangle, Target, Award, Code, BookOpen } from 'lucide-react';

const AnalyticsView = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/analytics');
        setAnalytics(res.data.data);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="main-content">
          <Navbar />
          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <div className="page-body">
              <LoadingSpinner text="Building visual placement analytics & score graphs..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const assessmentTrend = analytics?.assessmentTrend || [];
  const categoryScores = analytics?.categoryScores || [];
  const strengths = analytics?.strengths || [];
  const weaknesses = analytics?.weaknesses || [];

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.35rem' }}>Progress Analytics</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Comprehensive visual breakdown of your exam scores, category mastery, and targeted improvement areas.
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <StatCard icon={BookOpen} title="Overall Progress" value={`${analytics?.overallProgressPct || 0}%`} color="#6366f1" />
              <StatCard icon={Target} title="Practice Accuracy" value={`${analytics?.practiceAccuracy || 0}%`} color="#14b8a6" />
              <StatCard icon={Code} title="Coding Problems Solved" value={`${analytics?.codingSolvedCount || 0}`} color="#ec4899" />
              <StatCard icon={Award} title="Total XP Earned" value={`${analytics?.xp || 100} XP`} color="#f59e0b" />
            </div>

            {/* Charts Section: Line & Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Assessment Trend Line Chart */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp color="#818cf8" size={20} /> Assessment Performance History
                </h3>

                {assessmentTrend.length === 0 ? (
                  <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    No mock assessment history recorded yet.
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '260px' }}>
                    <ResponsiveContainer>
                      <LineChart data={assessmentTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="title" stroke="var(--text-muted)" fontSize={11} />
                        <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{ background: '#111827', border: '1px solid #6366f1', borderRadius: '8px', color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="percentage" stroke="#818cf8" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Category Mastery Bar Chart */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 color="#2dd4bf" size={20} /> Category Mastery Scores
                </h3>

                {categoryScores.length === 0 ? (
                  <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    No category attempt data available yet.
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '260px' }}>
                    <ResponsiveContainer>
                      <BarChart data={categoryScores}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="categoryName" stroke="var(--text-muted)" fontSize={12} />
                        <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{ background: '#111827', border: '1px solid #14b8a6', borderRadius: '8px', color: '#fff' }}
                        />
                        <Bar dataKey="score" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Placement Insights: Strengths vs Weaknesses */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {/* Strengths Card */}
              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#34d399', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={20} /> What Am I Good At? (Strong Topics)
                </h3>

                {strengths.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Complete topic assessments with score &ge; 70% to add items to your strong topics list.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {strengths.map((s, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{s.topic}</span>
                        <span className="badge badge-easy">{s.score}% Score</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Weaknesses Card */}
              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#f87171', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={20} /> What Do I Need To Improve?
                </h3>

                {weaknesses.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No critical weak topics flagged right now! Keep taking timed mock tests to stay challenged.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {weaknesses.map((w, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                        <span style={{ color: '#fff', fontWeight: 600 }}>{w.topic}</span>
                        <span className="badge badge-hard">{w.score}% Score</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
