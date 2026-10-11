import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Compass, Sparkles, RefreshCw, ArrowRight, AlertTriangle, CheckCircle, BookOpen, Target } from 'lucide-react';

const RoadmapView = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const { addToast } = useToast();

  const fetchRoadmap = async () => {
    try {
      const res = await API.get('/roadmap');
      setRoadmap(res.data.data);
    } catch (err) {
      console.error('Error loading roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      const res = await API.post('/roadmap/recalculate');
      setRoadmap(res.data.data);
      addToast('Personalized Roadmap recalculated based on latest performance!', 'success');
    } catch (err) {
      addToast('Failed to recalculate roadmap', 'error');
    } finally {
      setRecalculating(false);
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
              <LoadingSpinner text="Analyzing your test & practice data to generate personalized roadmap..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const weakAreas = roadmap?.targetWeakAreas || [];
  const recommendations = roadmap?.recommendedTopics || [];

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            {/* Title Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary">Dynamic Rule-Based Engine</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Last Updated: {new Date(roadmap?.lastCalculatedAt || Date.now()).toLocaleTimeString()}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.35rem' }}>Personalized Learning Roadmap</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Tailored placement pathway calculated dynamically from your real exam scores and practice history.
                </p>
              </div>

              <button onClick={handleRecalculate} className="btn btn-secondary" disabled={recalculating}>
                <RefreshCw size={16} className={recalculating ? 'spin' : ''} /> {recalculating ? 'Recalculating...' : 'Refresh Recommendation Engine'}
              </button>
            </div>

            {/* Visual Flow Banner */}
            <div
              className="glass-card"
              style={{
                padding: '1.5rem',
                marginBottom: '2.5rem',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(20, 184, 166, 0.08) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', marginBottom: '1rem' }}>
                THE PREPPILOT PLACEMENT CYCLE
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ color: '#fff' }}>CURRENT LEVEL</div>
                <ArrowRight size={18} color="#818cf8" />
                <div style={{ color: '#f87171' }}>WEAK AREAS</div>
                <ArrowRight size={18} color="#818cf8" />
                <div style={{ color: '#fbbf24' }}>RECOMMENDED TOPICS</div>
                <ArrowRight size={18} color="#818cf8" />
                <div style={{ color: '#38bdf8' }}>PRACTICE & ASSESS</div>
                <ArrowRight size={18} color="#818cf8" />
                <div style={{ color: '#34d399' }}>IMPROVEMENT</div>
              </div>
            </div>

            {/* Target Weak Areas Section (High Priority) */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <AlertTriangle color="#f87171" size={22} />
                <h2 style={{ fontSize: '1.35rem', color: '#fff', margin: 0 }}>High Priority Target Weak Areas</h2>
              </div>

              {weakAreas.length === 0 ? (
                <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  🎉 No severe weak areas identified yet! Take more timed assessments to generate targeted focus areas.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {weakAreas.map((wa, idx) => (
                    <div
                      key={idx}
                      className="glass-card"
                      style={{
                        padding: '1.5rem',
                        borderLeft: '4px solid #ef4444',
                        background: 'rgba(239, 68, 68, 0.05)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span className="badge badge-hard">{wa.priority} PRIORITY</span>
                        <span style={{ fontSize: '0.85rem', color: '#f87171', fontWeight: 700 }}>
                          Current Score: {wa.currentScore}%
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>{wa.topicTitle}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {wa.reason}
                      </p>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        {wa.topic?._id && (
                          <Link to={`/learn/${wa.topic._id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                            <BookOpen size={14} /> Practice Now
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Learning Roadmap Action Sequence */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Sparkles color="#818cf8" size={22} />
                <h2 style={{ fontSize: '1.35rem', color: '#fff', margin: 0 }}>Step-by-Step Learning Recommendations</h2>
              </div>

              {recommendations.length === 0 ? (
                <EmptyState title="No recommendations available" description="Complete baseline practice questions to generate roadmap sequence." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="glass-card"
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '280px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            color: '#818cf8',
                            fontSize: '1rem',
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{rec.topicTitle}</span>
                            <span className={`badge ${rec.priority === 'HIGH' ? 'badge-hard' : 'badge-medium'}`}>{rec.priority}</span>
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>{rec.reason}</p>
                          <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '0.25rem', fontWeight: 600 }}>
                            Recommended Action: {rec.recommendedAction}
                          </div>
                        </div>
                      </div>

                      <div>
                        {rec.topic?._id ? (
                          <Link to={`/learn/${rec.topic._id}`} className="btn btn-primary btn-sm">
                            Start Activity <ArrowRight size={14} />
                          </Link>
                        ) : (
                          <Link to="/learn" className="btn btn-secondary btn-sm">
                            Browse Topic
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
