import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { User, Mail, GraduationCap, Building, Calendar, Save, ShieldCheck } from 'lucide-react';

const ProfileView = () => {
  const { user, updateUserProfile } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    department: user?.department || '',
    yearOfStudy: user?.yearOfStudy || 'Final Year',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await API.put('/auth/profile', formData);
      updateUserProfile(res.data.data);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body" style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.35rem' }}>Student Profile</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Manage your student account details and academic background.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              {/* Top Profile Summary */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#fff',
                  }}
                >
                  {user?.name?.charAt(0) || 'S'}
                </div>

                <div>
                  <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>{user?.name}</h2>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '2px 0 6px 0' }}>{user?.email}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span className="badge badge-primary">{user?.role?.toUpperCase()}</span>
                    <span className="badge badge-secondary">{user?.streak || 1} Day Streak</span>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address (Read-Only)</label>
                  <input type="email" className="form-control" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                </div>

                <div className="form-group">
                  <label>College / University</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Year of Study</label>
                    <select
                      className="form-control"
                      value={formData.yearOfStudy}
                      onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '1rem' }} disabled={loading}>
                  <Save size={18} /> {loading ? 'Saving Profile...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
