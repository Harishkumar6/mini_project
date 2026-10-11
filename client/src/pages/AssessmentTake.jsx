import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

const AssessmentTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [assessment, setAssessment] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await API.get(`/assessments/${id}`);
        const exam = res.data.data;
        setAssessment(exam);

        const totalSecs = (exam.timeLimitMinutes || 15) * 60;
        setSecondsRemaining(totalSecs);
      } catch (err) {
        console.error('Error loading assessment:', err);
        addToast('Failed to load exam paper', 'error');
        navigate('/assessments');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!assessment || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true); // Auto submit on timer end
          return 0;
        }
        return prev - 1;
      });
      setTimeTakenSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, secondsRemaining]);

  const handleOptionSelect = (qId, optionIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleFinalSubmit = async (isAutoSubmit = false) => {
    if (submitting) return;

    try {
      setSubmitting(true);

      const formattedAnswers = (assessment.questions || []).map((q) => ({
        questionId: q._id,
        selectedOption: userAnswers[q._id] !== undefined ? userAnswers[q._id] : null,
      }));

      const res = await API.post('/assessments/submit', {
        assessmentId: assessment._id,
        answers: formattedAnswers,
        timeTakenSeconds,
      });

      const resultDoc = res.data.data;

      if (isAutoSubmit) {
        addToast('⏰ Time expired! Your assessment has been automatically submitted.', 'info');
      } else {
        addToast('Assessment submitted successfully!', 'success');
      }

      if (res.data.unlockedAchievements && res.data.unlockedAchievements.length > 0) {
        res.data.unlockedAchievements.forEach((ach) => {
          addToast(`🏆 Achievement Unlocked: ${ach.title}! (+${ach.xpReward} XP)`, 'info');
        });
      }

      navigate(`/assessments/result/${resultDoc._id}`);
    } catch (err) {
      addToast('Failed to submit assessment', 'error');
    } finally {
      setSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#090d16' }}>
        <Navbar />
        <LoadingSpinner text="Preparing secure exam questions & countdown timer..." />
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentIndex];
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timerColor = secondsRemaining < 180 ? '#ef4444' : '#818cf8';

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', display: 'flex', flexDirection: 'column' }}>
      {/* Exam Header Bar */}
      <header
        style={{
          background: '#0d1322',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>{assessment.title}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Category: {assessment.category?.name || 'General'}
          </span>
        </div>

        {/* Live Timer Meter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.5rem 1.25rem',
            background: 'rgba(0, 0, 0, 0.4)',
            border: `1.5px solid ${timerColor}`,
            borderRadius: '999px',
          }}
        >
          <Clock size={20} color={timerColor} />
          <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: timerColor }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        <button onClick={() => setShowSubmitModal(true)} className="btn btn-primary btn-sm">
          Submit Assessment
        </button>
      </header>

      {/* Main Exam Body */}
      <div style={{ flex: 1, padding: '2rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          {/* Active Question Box */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="badge badge-primary">Question {currentIndex + 1} of {questions.length}</span>
                <span className="badge badge-secondary">{currentQ?.topic?.title || 'Topic'}</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: '#fff', lineHeight: 1.5, marginBottom: '2rem' }}>
                {currentQ?.questionText}
              </h3>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                {currentQ?.options?.map((opt, idx) => {
                  const isSelected = userAnswers[currentQ._id] === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleOptionSelect(currentQ._id, idx)}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: `1.5px solid ${isSelected ? '#818cf8' : 'var(--border-color)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: '#fff',
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span style={{ fontSize: '1rem', color: isSelected ? '#fff' : 'var(--text-muted)' }}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="btn btn-secondary"
                disabled={currentIndex === 0}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="btn btn-primary"
                disabled={currentIndex === questions.length - 1}
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Question Grid Navigator Sidebar */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1rem' }}>Question Navigator</h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {questions.map((q, idx) => {
                const isAnswered = userAnswers[q._id] !== undefined;
                const isCurrent = idx === currentIndex;

                let bg = 'rgba(255, 255, 255, 0.05)';
                let border = 'var(--border-color)';

                if (isCurrent) {
                  border = '#818cf8';
                  bg = 'rgba(99, 102, 241, 0.3)';
                } else if (isAnswered) {
                  bg = 'rgba(16, 185, 129, 0.2)';
                  border = 'rgba(16, 185, 129, 0.4)';
                }

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      height: '42px',
                      borderRadius: '8px',
                      background: bg,
                      border: `1.5px solid ${border}`,
                      color: isAnswered ? '#34d399' : '#fff',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
              <div>• Answered: <strong style={{ color: '#34d399' }}>{answeredCount}</strong></div>
              <div>• Unanswered: <strong style={{ color: '#f87171' }}>{questions.length - answeredCount}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={showSubmitModal} onClose={() => setShowSubmitModal(false)} title="Submit Placement Assessment">
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Are you sure you want to finish?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions. Once submitted, your scores and personalized roadmap recommendations will be generated.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => setShowSubmitModal(false)} className="btn btn-secondary">
              Continue Test
            </button>
            <button onClick={() => handleFinalSubmit(false)} className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Yes, Submit Test'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssessmentTake;
