import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RefreshCw, Filter } from 'lucide-react';

const PracticeQuestions = () => {
  const [searchParams] = useSearchParams();
  const topicIdParam = searchParams.get('topicId');

  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(topicIdParam || 'ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // { isCorrect, correctOptionIndex, explanation }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    const loadTopicsAndQuestions = async () => {
      try {
        const [topicRes, questRes] = await Promise.all([
          API.get('/topics'),
          API.get(`/questions${topicIdParam ? `?topicId=${topicIdParam}` : ''}`),
        ]);

        setTopics(topicRes.data.data || []);
        setQuestions(questRes.data.data || []);
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTopicsAndQuestions();
  }, [topicIdParam]);

  const handleFilterChange = async (topicVal, diffVal) => {
    setSelectedTopic(topicVal);
    setSelectedDifficulty(diffVal);
    setCurrentIndex(0);
    setSelectedOption(null);
    setFeedback(null);
    setLoading(true);

    try {
      let queryParams = [];
      if (topicVal !== 'ALL') queryParams.push(`topicId=${topicVal}`);
      if (diffVal !== 'ALL') queryParams.push(`difficulty=${diffVal}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await API.get(`/questions${queryString}`);
      setQuestions(res.data.data || []);
    } catch (e) {
      console.error('Filter error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (idx) => {
    if (feedback) return; // Prevent changing choice after submission
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null) {
      addToast('Please select an option before submitting', 'error');
      return;
    }

    const currentQ = questions[currentIndex];

    try {
      setSubmitting(true);
      const res = await API.post('/questions/practice/submit', {
        questionId: currentQ._id,
        selectedOption,
      });

      setFeedback({
        isCorrect: res.data.isCorrect,
        correctOptionIndex: res.data.correctOptionIndex,
        explanation: res.data.explanation,
      });

      if (res.data.isCorrect) {
        addToast('Correct Answer! Great job!', 'success');
      } else {
        addToast('Incorrect. Review the detailed explanation below.', 'error');
      }

      if (res.data.unlockedAchievements && res.data.unlockedAchievements.length > 0) {
        res.data.unlockedAchievements.forEach((ach) => {
          addToast(`🏆 Achievement Unlocked: ${ach.title}! (+${ach.xpReward} XP)`, 'info');
        });
      }
    } catch (err) {
      addToast('Failed to submit practice answer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setFeedback(null);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            {/* Header & Filter Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              <div>
                <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.35rem' }}>Practice Questions</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Interactive practice module with immediate feedback & detailed solution breakdown.
                </p>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <select
                  className="form-control"
                  style={{ width: 'auto' }}
                  value={selectedTopic}
                  onChange={(e) => handleFilterChange(e.target.value, selectedDifficulty)}
                >
                  <option value="ALL">All Topics</option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                    </option>
                  ))}
                </select>

                <select
                  className="form-control"
                  style={{ width: 'auto' }}
                  value={selectedDifficulty}
                  onChange={(e) => handleFilterChange(selectedTopic, e.target.value)}
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner text="Loading practice question set..." />
            ) : questions.length === 0 ? (
              <EmptyState
                icon={HelpCircle}
                title="No practice questions found"
                description="Try changing the selected topic or difficulty filters."
              />
            ) : (
              <div>
                {/* Question Card */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', position: 'relative' }}>
                  {/* Question Meta Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span className="badge badge-primary">
                        Question {currentIndex + 1} of {questions.length}
                      </span>
                      <span className="badge badge-secondary">{currentQuestion.topic?.title || 'General'}</span>
                      <span
                        className={`badge ${
                          currentQuestion.difficulty === 'Easy'
                            ? 'badge-easy'
                            : currentQuestion.difficulty === 'Medium'
                            ? 'badge-medium'
                            : 'badge-hard'
                        }`}
                      >
                        {currentQuestion.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOption(null);
                        setFeedback(null);
                      }}
                      className="btn btn-secondary btn-sm"
                      title="Reset Choice"
                    >
                      <RefreshCw size={14} /> Reset
                    </button>
                  </div>

                  {/* Question Text */}
                  <h2 style={{ fontSize: '1.35rem', color: '#fff', lineHeight: 1.5, marginBottom: '2rem' }}>
                    {currentQuestion.questionText}
                  </h2>

                  {/* Options Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                    {currentQuestion.options.map((opt, idx) => {
                      let optionBg = 'rgba(255, 255, 255, 0.04)';
                      let optionBorder = 'var(--border-color)';
                      let textColor = '#fff';

                      if (feedback) {
                        if (idx === feedback.correctOptionIndex) {
                          optionBg = 'rgba(16, 185, 129, 0.15)';
                          optionBorder = '#10b981';
                          textColor = '#34d399';
                        } else if (selectedOption === idx && !feedback.isCorrect) {
                          optionBg = 'rgba(239, 68, 68, 0.15)';
                          optionBorder = '#ef4444';
                          textColor = '#f87171';
                        }
                      } else if (selectedOption === idx) {
                        optionBg = 'rgba(99, 102, 241, 0.18)';
                        optionBorder = '#818cf8';
                      }

                      return (
                        <div
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          style={{
                            padding: '1rem 1.25rem',
                            borderRadius: '10px',
                            background: optionBg,
                            border: `1.5px solid ${optionBorder}`,
                            cursor: feedback ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              color: textColor,
                              flexShrink: 0,
                            }}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span style={{ fontSize: '1rem', color: textColor, flex: 1 }}>{opt}</span>

                          {feedback && idx === feedback.correctOptionIndex && (
                            <CheckCircle2 size={22} color="#10b981" />
                          )}
                          {feedback && selectedOption === idx && !feedback.isCorrect && (
                            <XCircle size={22} color="#ef4444" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submission & Next Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {!feedback ? (
                      <button
                        onClick={handleSubmitAnswer}
                        className="btn btn-primary btn-lg"
                        disabled={selectedOption === null || submitting}
                      >
                        {submitting ? 'Verifying Answer...' : 'Submit Practice Answer'}
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="btn btn-primary btn-lg"
                        disabled={currentIndex >= questions.length - 1}
                      >
                        Next Question <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Explanation Banner */}
                {feedback && (
                  <div
                    className="glass-card"
                    style={{
                      padding: '1.75rem',
                      borderLeft: `4px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}`,
                      background: feedback.isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {feedback.isCorrect ? (
                        <CheckCircle2 color="#10b981" size={22} />
                      ) : (
                        <XCircle color="#ef4444" size={22} />
                      )}
                      <h3 style={{ color: feedback.isCorrect ? '#34d399' : '#f87171', fontSize: '1.15rem' }}>
                        {feedback.isCorrect ? 'Correct Answer!' : 'Incorrect Solution'}
                      </h3>
                    </div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                      Correct Option: {String.fromCharCode(65 + feedback.correctOptionIndex)} -{' '}
                      {currentQuestion.options[feedback.correctOptionIndex]}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                      {feedback.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestions;
