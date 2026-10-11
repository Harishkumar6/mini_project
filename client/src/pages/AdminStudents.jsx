import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Users, Search, Filter, ShieldCheck, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let queryParams = [];
      if (search) queryParams.push(`search=${search}`);
      if (department) queryParams.push(`department=${department}`);

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await API.get(`/admin/students${queryString}`);
      setStudents(res.data.data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [department]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleToggleStatus = async (studentId, currentStatus) => {
    try {
      const res = await API.put(`/admin/students/${studentId}/toggle-status`);
      addToast(res.data.message || 'Status updated!', 'success');
      setStudents((prev) =>
        prev.map((s) => (s._id === studentId ? { ...s, isActive: !currentStatus } : s))
      );
    } catch (err) {
      addToast('Failed to toggle student account status', 'error');
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.35rem' }}>Student Management</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Inspect registered student accounts, college details, test performance, and manage account statuses.
              </p>
            </div>

            {/* Filter controls */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Search by student name, email, or college..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>

            {/* Student Table */}
            {loading ? (
              <LoadingSpinner text="Fetching student records..." />
            ) : students.length === 0 ? (
              <EmptyState icon={Users} title="No students found" description="Try clearing search filters." />
            ) : (
              <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Student</th>
                      <th style={{ padding: '0.75rem' }}>College & Dept</th>
                      <th style={{ padding: '0.75rem' }}>Topics Done</th>
                      <th style={{ padding: '0.75rem' }}>Exams Taken</th>
                      <th style={{ padding: '0.75rem' }}>Avg Score</th>
                      <th style={{ padding: '0.75rem' }}>Account Status</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st) => (
                      <tr key={st._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.85rem' }}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{st.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{st.email}</div>
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <div style={{ color: '#fff', fontSize: '0.85rem' }}>{st.college}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {st.department} ({st.yearOfStudy})
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem', color: '#818cf8', fontWeight: 600 }}>{st.completedTopicsCount || 0}</td>
                        <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>{st.assessmentsTaken || 0}</td>
                        <td style={{ padding: '0.85rem', color: '#34d399', fontWeight: 700 }}>{st.avgScore || 0}%</td>
                        <td style={{ padding: '0.85rem' }}>
                          <span className={`badge ${st.isActive ? 'badge-easy' : 'badge-hard'}`}>
                            {st.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleToggleStatus(st._id, st.isActive)}
                            className={`btn btn-sm ${st.isActive ? 'btn-danger' : 'btn-success'}`}
                          >
                            {st.isActive ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
