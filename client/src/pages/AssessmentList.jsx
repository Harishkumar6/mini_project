import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { FileCheck, Clock, Award, Play, CheckCircle } from 'lucide-react';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await API.get('/assessments');
        setAssessments(res.data.data || []);
      } catch (err) {
        console.error('Error loading assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.35rem' }}>Mock Assessments</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Simulated placement examinations with real-time countdown timer and instant performance analytics.
              </p>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading placement mock tests..." />
            ) : assessments.length === 0 ? (
              <EmptyState icon={FileCheck} title="No mock assessments published" description="Check back soon for new placement mock examinations." />
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {assessments.map((a) => (
                  <div
                    key={a._id}
                    className="glass-card"
                    style={{
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <span className="badge badge-primary">{a.category?.name || 'Placement Mock'}</span>
                        <span className={`badge ${a.difficulty === 'Easy' ? 'badge-easy' : a.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
                          {a.difficulty}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>{a.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                        {a.description}
                      </p>

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={15} color="#818cf8" /> {a.timeLimitMinutes} Mins
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Award size={15} color="#2dd4bf" /> {a.totalMarks} Marks ({a.questionCount} Questions)
                        </div>
                      </div>

                      {/* Last Result Summary Pill if taken */}
                      {a.lastResult && (
                        <div
                          style={{
                            padding: '0.75rem',
                            background: a.lastResult.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            border: `1px solid ${a.lastResult.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            borderRadius: '8px',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Previous Attempt:</span>
                          <span style={{ fontWeight: 700, color: a.lastResult.passed ? '#34d399' : '#f87171' }}>
                            {a.lastResult.percentage}% ({a.lastResult.passed ? 'PASSED ✓' : 'FAILED ✗'})
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                      <Link to={`/assessments/take/${a._id}`} className="btn btn-primary" style={{ flex: 1 }}>
                        <Play size={16} /> {a.lastResult ? 'Retake Exam' : 'Start Assessment'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentList;
