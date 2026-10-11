import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import { Award, CheckCircle2, XCircle, Clock, Compass, ArrowRight, RotateCcw } from 'lucide-react';

const AssessmentResultView = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await API.get(`/assessments/result/${id}`);
        setResult(res.data.data);
      } catch (err) {
        console.error('Error loading result:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="app-container">
        <div className="main-content">
          <Navbar />
          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <div className="page-body">
              <LoadingSpinner text="Calculating detailed score metrics and roadmap updates..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="app-container">
        <div className="main-content">
          <Navbar />
          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <div className="page-body">
              <h2>Result record not found</h2>
              <Link to="/assessments" className="btn btn-secondary">
                Back to Assessments
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const assessment = result.assessment || {};
  const isPassed = result.passed;
  const timeMins = Math.floor((result.timeTakenSeconds || 0) / 60);
  const timeSecs = (result.timeTakenSeconds || 0) % 60;

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            {/* Top Score Banner */}
            <div
              className="glass-card"
              style={{
                padding: '2.5rem 2rem',
                marginBottom: '2rem',
                textAlign: 'center',
                background: isPassed
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(17, 24, 39, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(17, 24, 39, 0.95) 100%)',
                border: `1px solid ${isPassed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                }}
              >
                {isPassed ? <Award size={36} color="#34d399" /> : <XCircle size={36} color="#f87171" />}
              </div>

              <h1 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '0.25rem' }}>
                {isPassed ? 'Congratulations! You Passed!' : 'Assessment Completed'}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
                {assessment.title}
              </p>

              <div style={{ fontSize: '3rem', fontWeight: 900, color: isPassed ? '#34d399' : '#f87171', fontFamily: 'var(--font-heading)' }}>
                {result.percentage}%
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Score: {result.score} / {assessment.totalMarks || 100} Marks
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/roadmap" className="btn btn-primary btn-lg">
                  <Compass size={18} /> View Updated AI Roadmap <ArrowRight size={18} />
                </Link>
                <Link to={`/assessments/take/${assessment._id}`} className="btn btn-secondary btn-lg">
                  <RotateCcw size={18} /> Retake Assessment
                </Link>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <StatCard icon={CheckCircle2} title="Correct Answers" value={result.correctCount} color="#10b981" />
              <StatCard icon={XCircle} title="Incorrect Answers" value={result.incorrectCount} color="#ef4444" />
              <StatCard icon={Clock} title="Time Used" value={`${timeMins}m ${timeSecs}s`} color="#818cf8" />
              <StatCard icon={Award} title="Passing Threshold" value={`${assessment.passingPercentage || 60}%`} color="#f59e0b" />
            </div>

            {/* Topic Wise Performance Breakdown Table */}
            <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.25rem' }}>Topic-Wise Performance Breakdown</h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Topic Title</th>
                      <th style={{ padding: '0.75rem' }}>Questions</th>
                      <th style={{ padding: '0.75rem' }}>Correct</th>
                      <th style={{ padding: '0.75rem' }}>Score %</th>
                      <th style={{ padding: '0.75rem' }}>Mastery Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result.topicBreakdown || []).map((tb, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.85rem', color: '#fff', fontWeight: 600 }}>{tb.topicTitle}</td>
                        <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>{tb.total}</td>
                        <td style={{ padding: '0.85rem', color: '#34d399', fontWeight: 600 }}>{tb.correct}</td>
                        <td style={{ padding: '0.85rem', color: '#fff' }}>{tb.percentage}%</td>
                        <td style={{ padding: '0.85rem' }}>
                          <span className={`badge ${tb.percentage >= 70 ? 'badge-easy' : tb.percentage >= 50 ? 'badge-medium' : 'badge-hard'}`}>
                            {tb.percentage >= 70 ? 'Strong' : tb.percentage >= 50 ? 'Moderate' : 'Needs Practice'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResultView;
