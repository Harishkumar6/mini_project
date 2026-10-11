import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Award, Lock, Sparkles, Zap, Crown, Target, Code2 } from 'lucide-react';

const AchievementsView = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await API.get('/achievements');
        setAchievements(res.data.data || []);
      } catch (err) {
        console.error('Error loading achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.35rem' }}>Placement Badges & Achievements</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Earn XP points and unlock placement milestone badges as you learn, practice, and excel in exams.
                </p>
              </div>

              <div className="badge badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                <Award size={18} /> Unlocked: {unlockedCount} / {achievements.length} Badges
              </div>
            </div>

            {loading ? (
              <LoadingSpinner text="Fetching your placement achievements..." />
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {achievements.map((ach) => (
                  <div
                    key={ach._id}
                    className="glass-card"
                    style={{
                      padding: '1.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      border: ach.isUnlocked ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                      background: ach.isUnlocked ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      opacity: ach.isUnlocked ? 1 : 0.7,
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '16px',
                        background: ach.isUnlocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${ach.isUnlocked ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {ach.isUnlocked ? (
                        <Award size={28} color="#34d399" />
                      ) : (
                        <Lock size={24} color="var(--text-muted)" />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: ach.isUnlocked ? '#fff' : 'var(--text-muted)' }}>{ach.title}</h3>
                        <span className="badge badge-primary">+{ach.xpReward} XP</span>
                      </div>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                        {ach.description}
                      </p>

                      <div style={{ fontSize: '0.78rem', color: ach.isUnlocked ? '#34d399' : 'var(--text-subtle)', fontWeight: 600 }}>
                        {ach.isUnlocked
                          ? `Unlocked on ${new Date(ach.unlockedAt).toLocaleDateString()}`
                          : `Status: Locked (Condition: ${ach.conditionType})`}
                      </div>
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

export default AchievementsView;
