import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  BookOpen,
  CheckCircle,
  Clock,
  HelpCircle,
  FileCheck,
  ArrowLeft,
  Lightbulb,
  Award,
  Sparkles,
} from 'lucide-react';

const TopicDetail = () => {
  const { id } = useParams();
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await API.get(`/topics/${id}`);
        setTopicData(res.data.data);
      } catch (err) {
        console.error('Error loading topic detail:', err);
        addToast('Failed to load topic detail', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id]);

  const handleMarkCompleted = async () => {
    try {
      setCompleting(true);
      const res = await API.post(`/topics/${id}/complete`);
      addToast(res.data.message || 'Topic completed!', 'success');
      
      if (res.data.unlockedAchievements && res.data.unlockedAchievements.length > 0) {
        res.data.unlockedAchievements.forEach((ach) => {
          addToast(`🏆 Achievement Unlocked: ${ach.title}! (+${ach.xpReward} XP)`, 'info');
        });
      }

      setTopicData((prev) => ({ ...prev, isCompleted: true }));
    } catch (err) {
      addToast('Failed to mark topic as complete', 'error');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="main-content">
          <Navbar />
          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <div className="page-body">
              <LoadingSpinner text="Loading topic material and solved examples..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!topicData) {
    return (
      <div className="app-container">
        <div className="main-content">
          <Navbar />
          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <div className="page-body">
              <h2>Topic not found</h2>
              <Link to="/learn" className="btn btn-secondary">
                Back to Topics
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const material = topicData.material || {};

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            {/* Top Back Link */}
            <Link
              to="/learn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}
            >
              <ArrowLeft size={16} /> Back to Learning Modules
            </Link>

            {/* Header Title Card */}
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                marginBottom: '2rem',
                borderLeft: '4px solid #6366f1',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="badge badge-primary">{topicData.category?.name || 'General'}</span>
                    <span className="badge badge-medium">{topicData.difficulty}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {topicData.estimatedMinutes} Mins Read
                    </span>
                  </div>
                  <h1 style={{ fontSize: '2.2rem', color: '#fff', margin: '0.25rem 0' }}>{topicData.title}</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '800px' }}>{topicData.description}</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleMarkCompleted}
                    className={`btn ${topicData.isCompleted ? 'btn-success' : 'btn-primary'}`}
                    disabled={completing || topicData.isCompleted}
                  >
                    <CheckCircle size={18} />
                    {topicData.isCompleted ? 'Completed ✓' : completing ? 'Saving...' : 'Mark as Completed'}
                  </button>

                  <Link to={`/practice?topicId=${topicData._id}`} className="btn btn-secondary">
                    <HelpCircle size={18} /> Start Practice
                  </Link>

                  <Link to={`/assessments?categoryId=${topicData.category?._id}`} className="btn btn-secondary">
                    <FileCheck size={18} /> Take Assessment
                  </Link>
                </div>
              </div>
            </div>

            {/* Content Overview */}
            {material.overview && (
              <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.75rem' }}>Overview & Foundation</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>{material.overview}</p>
              </div>
            )}

            {/* Key Concepts Grid */}
            {material.keyConcepts && material.keyConcepts.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lightbulb color="#fbbf24" size={22} /> Key Concepts
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {material.keyConcepts.map((concept, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                      <h4 style={{ color: '#818cf8', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                        {idx + 1}. {concept.title}
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{concept.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulas & Reference Section */}
            {material.formulas && material.formulas.length > 0 && (
              <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
                <h3 style={{ color: '#2dd4bf', fontSize: '1.25rem', marginBottom: '1rem' }}>Important Formulas & Rules</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {material.formulas.map((f, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'rgba(20, 184, 166, 0.08)', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{f.title}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#5eead4', fontWeight: 700, margin: '0.35rem 0' }}>
                        {f.formula}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Solved Examples */}
            {material.solvedExamples && material.solvedExamples.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1.25rem' }}>Solved Examples</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {material.solvedExamples.map((ex, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <span className="badge badge-primary">Example #{idx + 1}</span>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '1.05rem', flex: 1 }}>{ex.question}</div>
                      </div>

                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '1rem 1.25rem',
                          borderRadius: '8px',
                          borderLeft: '3px solid #10b981',
                          marginTop: '0.75rem',
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#34d399', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Solution:</div>
                        <div style={{ color: '#fff', fontSize: '0.925rem', fontFamily: 'monospace', marginBottom: '0.5rem' }}>{ex.solution}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ex.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Banner */}
            {material.summary && (
              <div
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  marginBottom: '2rem',
                }}
              >
                <h4 style={{ color: '#818cf8', fontSize: '1.05rem', marginBottom: '0.5rem' }}>Pro Tip Summary</h4>
                <p style={{ color: 'var(--text-main)', fontSize: '0.925rem' }}>{material.summary}</p>
              </div>
            )}

            {/* Bottom Action Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 0',
                borderTop: '1px solid var(--border-color)',
              }}
            >
              <Link to="/learn" className="btn btn-secondary">
                ← Back to Topic List
              </Link>
              <Link to={`/practice?topicId=${topicData._id}`} className="btn btn-primary btn-lg">
                Practice Questions for {topicData.title} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
