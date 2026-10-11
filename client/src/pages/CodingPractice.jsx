import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Code2, Play, CheckCircle, XCircle, FileCode, Check, ArrowRight } from 'lucide-react';

const CodingPractice = () => {
  const [problems, setProblems] = useState([]);
  const [activeProblem, setActiveProblem] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchCodingProblems = async () => {
      try {
        const res = await API.get('/coding');
        const list = res.data.data || [];
        setProblems(list);
        if (list.length > 0) {
          selectProblem(list[0]);
        }
      } catch (err) {
        console.error('Error loading coding problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCodingProblems();
  }, []);

  const selectProblem = async (prob) => {
    setActiveProblem(prob);
    setTestResult(null);

    try {
      const res = await API.get(`/coding/${prob._id}`);
      const fullProb = res.data.data;
      setActiveProblem(fullProb);

      const starter = fullProb.starterCode?.javascript || `// Write your ${language} solution for ${fullProb.title}\nfunction solution() {\n  // your code here\n}`;
      setUserCode(starter);
    } catch (e) {
      console.error('Error details:', e);
    }
  };

  const handleRunCode = async () => {
    if (!activeProblem) return;

    if (!userCode || userCode.trim().length < 10) {
      addToast('Please write your solution code before running test cases.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      setTestResult(null);

      const res = await API.post('/coding/submit', {
        problemId: activeProblem._id,
        code: userCode,
        language,
      });

      setTestResult(res.data);

      if (res.data.status === 'Passed') {
        addToast(res.data.message || 'All test cases passed!', 'success');
      } else {
        addToast(res.data.message || 'Some test cases failed. Keep trying!', 'error');
      }

      if (res.data.unlockedAchievements && res.data.unlockedAchievements.length > 0) {
        res.data.unlockedAchievements.forEach((ach) => {
          addToast(`🏆 Achievement Unlocked: ${ach.title}! (+${ach.xpReward} XP)`, 'info');
        });
      }
    } catch (err) {
      addToast('Error submitting code solution', 'error');
    } finally {
      setSubmitting(false);
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
              <LoadingSpinner text="Loading placement coding environment..." />
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

          <div className="page-body" style={{ maxWidth: '1450px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.35rem' }}>Coding Practice</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Solve standard campus technical interview coding problems with instant test-case evaluation.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', minHeight: '650px' }}>
              {/* Problem Selector List */}
              <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  PROBLEM LIBRARY ({problems.length})
                </div>

                {problems.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => selectProblem(p)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      background: activeProblem?._id === p._id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: activeProblem?._id === p._id ? '1px solid #818cf8' : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.925rem' }}>{p.title}</div>
                      <span className={`badge ${p.difficulty === 'Easy' ? 'badge-easy' : p.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`} style={{ marginTop: '4px' }}>
                        {p.difficulty}
                      </span>
                    </div>

                    {p.isSolved && <CheckCircle size={18} color="#10b981" />}
                  </div>
                ))}
              </div>

              {/* Main Coding Workspace */}
              {activeProblem ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Problem Description Card */}
                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>{activeProblem.title}</h2>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span className="badge badge-primary">Concept: {activeProblem.expectedConcept}</span>
                        <span className={`badge ${activeProblem.difficulty === 'Easy' ? 'badge-easy' : activeProblem.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
                          {activeProblem.difficulty}
                        </span>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {activeProblem.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '6px' }}>
                        <strong style={{ color: '#818cf8' }}>Input Format:</strong>
                        <div style={{ color: 'var(--text-muted)' }}>{activeProblem.inputFormat}</div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '6px' }}>
                        <strong style={{ color: '#2dd4bf' }}>Output Format:</strong>
                        <div style={{ color: 'var(--text-muted)' }}>{activeProblem.outputFormat}</div>
                      </div>
                    </div>

                    {/* Sample Case */}
                    {activeProblem.sampleCases && activeProblem.sampleCases.length > 0 && (
                      <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, marginBottom: '0.35rem' }}>SAMPLE CASE</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#fff' }}>
                          Input: {activeProblem.sampleCases[0].input}
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#34d399' }}>
                          Output: {activeProblem.sampleCases[0].output}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Code Editor Box */}
                  <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileCode size={18} color="#818cf8" />
                        <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>Solution Editor</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <select
                          className="form-control"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          <option value="javascript">JavaScript (ES6)</option>
                          <option value="python">Python 3</option>
                        </select>

                        <button onClick={handleRunCode} className="btn btn-primary btn-sm" disabled={submitting}>
                          <Play size={14} /> {submitting ? 'Testing Code...' : 'Run & Submit Code'}
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      rows={12}
                      style={{
                        width: '100%',
                        background: '#0a0e17',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '1rem',
                        color: '#5eead4',
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        resize: 'vertical',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Test Result Execution Panel */}
                  {testResult && (
                    <div
                      className="glass-card"
                      style={{
                        padding: '1.25rem',
                        borderLeft: `4px solid ${testResult.status === 'Passed' ? '#10b981' : '#ef4444'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {testResult.status === 'Passed' ? (
                            <CheckCircle color="#10b981" size={20} />
                          ) : (
                            <XCircle color="#ef4444" size={20} />
                          )}
                          <h4 style={{ color: testResult.status === 'Passed' ? '#34d399' : '#f87171', margin: 0 }}>
                            {testResult.status === 'Passed' ? 'Passed All Test Cases!' : 'Test Verification Results'}
                          </h4>
                        </div>

                        <span className="badge badge-primary">
                          {testResult.passedTests} / {testResult.totalTests} Passed
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {testResult.testResults?.map((tr, i) => (
                          <div
                            key={i}
                            style={{
                              padding: '0.65rem 0.85rem',
                              borderRadius: '6px',
                              background: tr.passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '0.85rem',
                            }}
                          >
                            <div>
                              <strong style={{ color: '#fff' }}>Test Case #{tr.testCaseIndex}:</strong> Input: {tr.input}
                            </div>
                            <span style={{ color: tr.passed ? '#34d399' : '#f87171', fontWeight: 600 }}>
                              {tr.passed ? 'PASSED ✓' : 'FAILED ✗'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState title="Select a coding problem" description="Choose a problem from the left panel to open the code workspace." />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;
