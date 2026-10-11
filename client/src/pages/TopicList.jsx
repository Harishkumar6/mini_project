import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { BookOpen, CheckCircle, Clock, Search, Filter, ArrowRight } from 'lucide-react';

const TopicList = () => {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, topicRes] = await Promise.all([
          API.get('/categories'),
          API.get('/topics'),
        ]);

        setCategories(catRes.data.data || []);
        setTopics(topicRes.data.data || []);
      } catch (err) {
        console.error('Error fetching learning topics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTopics = topics.filter((t) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (t.category && t.category._id === selectedCategory) ||
      (t.category && t.category.slug === selectedCategory.toLowerCase());

    const matchesDifficulty = selectedDifficulty === 'ALL' || t.difficulty === selectedDifficulty;

    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.5rem' }}>Learning Modules</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Master placement topics step-by-step across Aptitude, Logical Problem Solving, and Communication.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`btn btn-sm ${selectedCategory === cat._id ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search & Difficulty Filter Controls */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
              }}
            >
              <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Search topic by name or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} color="var(--text-muted)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Difficulty:</span>
                <select
                  className="form-control"
                  style={{ width: 'auto', padding: '0.5rem 1rem' }}
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="ALL">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Topic List Cards */}
            {loading ? (
              <LoadingSpinner text="Fetching topic library..." />
            ) : filteredTopics.length === 0 ? (
              <EmptyState title="No topics found" description="Try clearing search filters to see all available placement topics." />
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {filteredTopics.map((topic) => {
                  const isCompleted = topic.isCompleted;
                  return (
                    <div
                      key={topic._id}
                      className="glass-card"
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: isCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                          <span className="badge badge-primary">{topic.category?.name || 'General'}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              className={`badge ${
                                topic.difficulty === 'Easy'
                                  ? 'badge-easy'
                                  : topic.difficulty === 'Medium'
                                  ? 'badge-medium'
                                  : 'badge-hard'
                              }`}
                            >
                              {topic.difficulty}
                            </span>
                            {isCompleted && <CheckCircle size={18} color="#10b981" title="Topic Completed" />}
                          </div>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>{topic.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                          {topic.description}
                        </p>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <Clock size={14} /> {topic.estimatedMinutes || 20} mins read
                        </div>

                        <Link to={`/learn/${topic._id}`} className="btn btn-primary btn-sm">
                          {isCompleted ? 'Review Material' : 'Start Topic'} <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicList;
