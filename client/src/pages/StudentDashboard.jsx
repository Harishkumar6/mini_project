import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Flame,
  Zap,
  BookOpen,
  FileCheck,
  Code,
  Compass,
  ArrowRight,
  Target,
  Award,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [analyticsRes, roadmapRes] = await Promise.all([
          API.get('/analytics'),
          API.get('/roadmap'),
        ]);

        setAnalytics(analyticsRes.data.data);
        setRoadmap(roadmapRes.data.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="main-content">
          <Navbar />
          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <div className="page-body">
              <LoadingSpinner text="Fetching your placement progress dashboard..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine dynamic recommendation from real user data / roadmap
  const topWeakArea = roadmap?.targetWeakAreas?.[0];
  const topRecommendation = roadmap?.recommendedTopics?.[0];

  const recommendedTopicTitle = topWeakArea
    ? topWeakArea.topicTitle
    : topRecommendation
    ? topRecommendation.topicTitle
    : 'Percentages';

  const recommendedCategory = topWeakArea
    ? topWeakArea.categoryTitle
    : topRecommendation
    ? topRecommendation.categoryTitle
    : 'Aptitude';

  const recommendationReason = topWeakArea
    ? topWeakArea.reason
    : topRecommendation
    ? topRecommendation.reason
    : 'Based on your overall study profile, starting with quantitative aptitude will accelerate your progress.';

  const recommendedTopicId = topWeakArea?.topic?._id || topRecommendation?.topic?._id || '';

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
                background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(17,24,39,0.9) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600 }}>STUDENT PLACEMENT HUB</span>
                  <span className="badge badge-primary">{roadmap?.stage || 'Fundamentals Building'}</span>
                </div>
                <h1 style={{ fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
                  Welcome back, {user?.name || 'Student'}! 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '650px' }}>
                  {user?.college} • {user?.department} ({user?.yearOfStudy})
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/roadmap" className="btn btn-primary">
                  <Compass size={18} /> View AI Roadmap
                </Link>
                <Link to="/assessments" className="btn btn-secondary">
                  <FileCheck size={18} /> Take Assessment
                </Link>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <StatCard
                icon={BookOpen}
                title="Completed Topics"
                value={`${analytics?.completedTopicsCount || 0} / ${analytics?.totalTopicsCount || 0}`}
                subtext={`${analytics?.overallProgressPct || 0}% Total Progress`}
                color="#6366f1"
              />
              <StatCard
                icon={Target}
                title="Practice Accuracy"
                value={`${analytics?.practiceAccuracy || 0}%`}
                subtext={`${analytics?.totalPracticeAttempts || 0} Total Solved`}
                color="#14b8a6"
              />
              <StatCard
                icon={Code}
                title="Coding Problems"
                value={`${analytics?.codingSolvedCount || 0} Solved`}
                subtext={`${analytics?.codingProgressPct || 0}% Problem Library`}
                color="#ec4899"
              />
              <StatCard
                icon={Flame}
                title="Learning Streak"
                value={`${analytics?.learningStreak || 1} Days`}
                subtext={`Earned ${analytics?.xp || 100} XP Points`}
                color="#f59e0b"
              />
            </div>

            {/* Recommended Activity ("Continue Learning") */}
            <div
              className="glass-card"
              style={{
                padding: '1.75rem',
                marginBottom: '2rem',
                borderLeft: '4px solid #6366f1',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Sparkles size={20} color="#818cf8" />
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Recommended For You</h3>
                </div>
                <span className="badge badge-primary">Dynamic Data Driven</span>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase' }}>
                    RECOMMENDED ACTIVITY • {recommendedCategory}
                  </div>
                  <h4 style={{ fontSize: '1.3rem', color: '#fff', margin: '0.25rem 0 0.5rem 0' }}>
                    {recommendedTopicTitle}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '750px', lineHeight: 1.5 }}>
                    <strong style={{ color: '#fbbf24' }}>Reason:</strong> {recommendationReason}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {recommendedTopicId ? (
                    <Link to={`/learn/${recommendedTopicId}`} className="btn btn-primary">
                      Start Learning <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link to="/learn" className="btn btn-primary">
                      Explore Topics <ArrowRight size={16} />
                    </Link>
                  )}
                  <Link to="/practice" className="btn btn-secondary">
                    Practice Questions
                  </Link>
                </div>
              </div>
            </div>

            {/* Two Column Layout: Roadmap Highlights & Analytics Quick View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {/* Weak Areas & Roadmap Summary */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Priority Focus Areas</h3>
                  <Link to="/roadmap" style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600 }}>
                    Full Roadmap →
                  </Link>
                </div>

                {roadmap?.targetWeakAreas && roadmap.targetWeakAreas.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {roadmap.targetWeakAreas.map((wa, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '1rem',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: '8px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{wa.topicTitle}</span>
                          <span className="badge badge-hard">{wa.priority} PRIORITY</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{wa.reason}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No weak areas flagged! Keep taking assessments to calculate updated focus areas.
                  </div>
                )}
              </div>

              {/* Progress Overview Bar Chart summary */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Overall Progress Breakdown</h3>
                  <Link to="/analytics" style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600 }}>
                    Full Analytics →
                  </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Topic Materials Completed</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>
                        {analytics?.completedTopicsCount} / {analytics?.totalTopicsCount}
                      </span>
                    </div>
                    <ProgressBar percentage={analytics?.overallProgressPct || 0} showLabel={false} color="#6366f1" />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Practice Question Accuracy</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{analytics?.practiceAccuracy || 0}%</span>
                    </div>
                    <ProgressBar percentage={analytics?.practiceAccuracy || 0} showLabel={false} color="#14b8a6" />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Coding Problems Solved</span>
                      <span style={{ color: '#fff', fontWeight: 600 }}>
                        {analytics?.codingSolvedCount} / {analytics?.totalCodingCount}
                      </span>
                    </div>
                    <ProgressBar percentage={analytics?.codingProgressPct || 0} showLabel={false} color="#ec4899" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
