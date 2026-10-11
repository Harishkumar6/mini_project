import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Compass,
  ArrowRight,
  Brain,
  Calculator,
  MessageSquare,
  Code2,
  FileCheck,
  BarChart3,
  Award,
  Zap,
  CheckCircle,
  Users,
  BookOpen,
} from 'lucide-react';

const LandingPage = () => {
  const [stats, setStats] = useState({
    practiceQuestions: 150,
    codingProblems: 40,
    learningTopics: 25,
    students: 120,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/analytics/landing-stats');
        if (res.data.data) {
          setStats(res.data.data);
        }
      } catch (e) {
        console.log('Using default landing stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#090d16' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ padding: '5rem 2rem 4rem 2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Glow Effects */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div
            className="badge badge-primary"
            style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', fontSize: '0.825rem' }}
          >
            <Zap size={14} /> Next-Gen Placement Preparation Platform
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              maxWidth: '900px',
              margin: '0 auto 1.5rem auto',
            }}
          >
            Prepare Smarter. Practice Better.{' '}
            <span className="gradient-text">Get Placement Ready.</span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6,
            }}
          >
            PrepPilot is an all-in-one placement platform featuring topic-wise aptitude materials, logical problem solving, coding challenges, timed mock assessments, and an intelligent rule-based Personalized Learning Roadmap.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Learning Now <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              Explore Platform
            </a>
          </div>

          {/* Product Preview Mockup */}
          <div
            className="glass-card"
            style={{
              borderRadius: '20px',
              padding: '1rem',
              maxWidth: '1000px',
              margin: '0 auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.2)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <div
              style={{
                background: '#0d1322',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                textAlign: 'left',
              }}
            >
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  PERSONALIZED ROADMAP ENGINE
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Target Weak Area Identified</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  "Percentages score is 42%. Rule engine automatically prioritizes speed math & practice set."
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-hard">High Priority</span>
                  <span className="badge badge-primary">Practice Recommended</span>
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  REAL-TIME ASSESSMENT PERFORMANCE
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Aptitude Diagnostic Test</h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>85%</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Passed (15m Time Taken)</span>
                </div>
                <div className="badge badge-easy">Strong Quantitative Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Bar */}
      <section style={{ background: '#0d1322', borderVertical: '1px solid var(--border-color)', padding: '2.5rem 2rem' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
              {stats.practiceQuestions}+
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Practice Questions</div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#818cf8', fontFamily: 'var(--font-heading)' }}>
              {stats.codingProblems}+
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Coding Problems</div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#2dd4bf', fontFamily: 'var(--font-heading)' }}>
              {stats.learningTopics}+
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Learning Topics</div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
              {stats.students}+
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Active Students</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '6rem 2rem', background: '#090d16' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>
              Everything You Need for <span className="gradient-text">Placement Success</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
              Designed to take you from foundational concept learning to full interview readiness.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {[
              {
                icon: Calculator,
                title: 'Aptitude Preparation',
                desc: 'Topic-wise speed math, percentages, profit & loss, time-speed-distance with formulas and solved examples.',
                color: '#6366f1',
              },
              {
                icon: Brain,
                title: 'Problem Solving',
                desc: 'Logical reasoning puzzles, syllogisms, blood relations, direction sense, and data interpretation charts.',
                color: '#14b8a6',
              },
              {
                icon: MessageSquare,
                title: 'Communication Skills',
                desc: 'Verbal ability, grammar essentials, sentence correction, and reading comprehension exercises.',
                color: '#f59e0b',
              },
              {
                icon: Code2,
                title: 'Coding Practice',
                desc: 'Standard interview coding problems with instant test case verification and concept tagging.',
                color: '#ec4899',
              },
              {
                icon: FileCheck,
                title: 'Timed Assessments',
                desc: 'Full-length placement mock exams with real-time countdown timer, immediate scoring, and breakdown.',
                color: '#8b5cf6',
              },
              {
                icon: Compass,
                title: 'Personalized Roadmap',
                desc: 'Rule-based learning engine that analyzes test scores to generate tailored focus areas.',
                color: '#10b981',
              },
            ].map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: `${feat.color}18`,
                      border: `1px solid ${feat.color}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <IconComp size={26} color={feat.color} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#fff' }}>{feat.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How PrepPilot Works */}
      <section id="how-it-works" style={{ padding: '5rem 2rem', background: '#0d1322' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>How PrepPilot Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '3.5rem' }}>
            Follow our proven 4-stage learning cycle to guarantee placement readiness.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              { step: '01', title: 'LEARN', desc: 'Read topic overviews, key formulas, and solved examples.' },
              { step: '02', title: 'PRACTICE', desc: 'Solve topic questions with instant feedback & explanation.' },
              { step: '03', title: 'ASSESS', desc: 'Take timed mock assessments to test real exam stamina.' },
              { step: '04', title: 'IMPROVE', desc: 'Follow your Personalized Roadmap to master weak areas.' },
            ].map((st, i) => (
              <div
                key={i}
                className="glass-card"
                style={{ padding: '2rem 1.5rem', textAlign: 'center', position: 'relative' }}
              >
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: 'rgba(99, 102, 241, 0.25)',
                    fontFamily: 'var(--font-heading)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {st.step}
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.5rem' }}>{st.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: '#090d16' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(20,184,166,0.1) 100%)',
            border: '1px solid rgba(99,102,241,0.3)',
          }}
        >
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Start Your Placement Preparation Today</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Join students using PrepPilot to crack campus recruitment exams with confidence.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Student Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
