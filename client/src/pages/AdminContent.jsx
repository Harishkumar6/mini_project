import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2, BookOpen, HelpCircle, Code, FileCheck, FolderTree, AlertTriangle } from 'lucide-react';

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState('TOPICS'); // 'TOPICS' | 'QUESTIONS' | 'CODING' | 'ASSESSMENTS'
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states for Topic
  const [topicForm, setTopicForm] = useState({
    title: '',
    category: '',
    description: '',
    difficulty: 'Medium',
    estimatedMinutes: 20,
  });

  // Form states for Question
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    category: '',
    topic: '',
    difficulty: 'Medium',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOptionIndex: 0,
    explanation: '',
  });

  const { addToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, topicRes] = await Promise.all([
        API.get('/categories'),
        API.get('/topics'),
      ]);
      setCategories(catRes.data.data || []);
      setTopics(topicRes.data.data || []);

      if (activeTab === 'TOPICS') {
        setItems(topicRes.data.data || []);
      } else if (activeTab === 'QUESTIONS') {
        const qRes = await API.get('/questions');
        setItems(qRes.data.data || []);
      } else if (activeTab === 'CODING') {
        const cRes = await API.get('/coding');
        setItems(cRes.data.data || []);
      } else if (activeTab === 'ASSESSMENTS') {
        const aRes = await API.get('/assessments');
        setItems(aRes.data.data || []);
      }
    } catch (err) {
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleCreateTopicSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await API.put(`/topics/${selectedItem._id}`, topicForm);
        addToast('Topic updated successfully!', 'success');
      } else {
        await API.post('/topics', topicForm);
        addToast('New topic created successfully!', 'success');
      }
      setShowAddModal(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save topic', 'error');
    }
  };

  const handleCreateQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        questionText: questionForm.questionText,
        category: questionForm.category || categories[0]?._id,
        topic: questionForm.topic || topics[0]?._id,
        difficulty: questionForm.difficulty,
        options: [questionForm.optionA, questionForm.optionB, questionForm.optionC, questionForm.optionD],
        correctOptionIndex: Number(questionForm.correctOptionIndex),
        explanation: questionForm.explanation,
      };

      if (selectedItem) {
        await API.put(`/questions/${selectedItem._id}`, payload);
        addToast('Question updated successfully!', 'success');
      } else {
        await API.post('/questions', payload);
        addToast('New practice question added!', 'success');
      }
      setShowAddModal(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save question', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      if (activeTab === 'TOPICS') {
        await API.delete(`/topics/${selectedItem._id}`);
      } else if (activeTab === 'QUESTIONS') {
        await API.delete(`/questions/${selectedItem._id}`);
      } else if (activeTab === 'CODING') {
        await API.delete(`/coding/${selectedItem._id}`);
      } else if (activeTab === 'ASSESSMENTS') {
        await API.delete(`/assessments/${selectedItem._id}`);
      }

      addToast('Item deleted successfully!', 'success');
      setShowDeleteModal(false);
      setSelectedItem(null);
      loadData();
    } catch (err) {
      addToast('Failed to delete item', 'error');
    }
  };

  const openAddModal = () => {
    setSelectedItem(null);
    if (activeTab === 'TOPICS') {
      setTopicForm({
        title: '',
        category: categories[0]?._id || '',
        description: '',
        difficulty: 'Medium',
        estimatedMinutes: 20,
      });
    } else if (activeTab === 'QUESTIONS') {
      setQuestionForm({
        questionText: '',
        category: categories[0]?._id || '',
        topic: topics[0]?._id || '',
        difficulty: 'Medium',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOptionIndex: 0,
        explanation: '',
      });
    }
    setShowAddModal(true);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />

          <div className="page-body">
            {/* Header & Add Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.85rem', color: '#fff', marginBottom: '0.35rem' }}>Content Management CRUD</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Create, update, and manage topics, questions, coding challenges, and mock exams.
                </p>
              </div>

              <button onClick={openAddModal} className="btn btn-primary">
                <Plus size={18} /> Add New {activeTab.slice(0, -1)}
              </button>
            </div>

            {/* Content Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <button
                onClick={() => setActiveTab('TOPICS')}
                className={`btn btn-sm ${activeTab === 'TOPICS' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <BookOpen size={16} /> Learning Topics
              </button>
              <button
                onClick={() => setActiveTab('QUESTIONS')}
                className={`btn btn-sm ${activeTab === 'QUESTIONS' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <HelpCircle size={16} /> Question Bank
              </button>
              <button
                onClick={() => setActiveTab('CODING')}
                className={`btn btn-sm ${activeTab === 'CODING' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Code size={16} /> Coding Problems
              </button>
              <button
                onClick={() => setActiveTab('ASSESSMENTS')}
                className={`btn btn-sm ${activeTab === 'ASSESSMENTS' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <FileCheck size={16} /> Mock Assessments
              </button>
            </div>

            {/* Content Table */}
            {loading ? (
              <LoadingSpinner text="Loading admin content records..." />
            ) : items.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No records found in this category. Click 'Add New' to create one.
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.75rem' }}>Title / Content</th>
                      <th style={{ padding: '0.75rem' }}>Category</th>
                      <th style={{ padding: '0.75rem' }}>Difficulty</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.85rem', color: '#fff', fontWeight: 600, maxWidth: '400px' }}>
                          {item.title || item.questionText}
                        </td>
                        <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>
                          {item.category?.name || 'General'}
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <span className={`badge ${item.difficulty === 'Easy' ? 'badge-easy' : item.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
                            {item.difficulty || 'Medium'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                if (activeTab === 'TOPICS') {
                                  setTopicForm({
                                    title: item.title,
                                    category: item.category?._id || item.category,
                                    description: item.description,
                                    difficulty: item.difficulty,
                                    estimatedMinutes: item.estimatedMinutes,
                                  });
                                } else if (activeTab === 'QUESTIONS') {
                                  setQuestionForm({
                                    questionText: item.questionText,
                                    category: item.category?._id || item.category,
                                    topic: item.topic?._id || item.topic,
                                    difficulty: item.difficulty,
                                    optionA: item.options?.[0] || '',
                                    optionB: item.options?.[1] || '',
                                    optionC: item.options?.[2] || '',
                                    optionD: item.options?.[3] || '',
                                    correctOptionIndex: item.correctOptionIndex || 0,
                                    explanation: item.explanation || '',
                                  });
                                }
                                setShowAddModal(true);
                              }}
                              className="btn btn-secondary btn-sm"
                            >
                              <Edit size={14} /> Edit
                            </button>

                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setShowDeleteModal(true);
                              }}
                              className="btn btn-danger btn-sm"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
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

      {/* Add / Edit Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={`${selectedItem ? 'Edit' : 'Add New'} ${activeTab.slice(0, -1)}`}>
        {activeTab === 'TOPICS' && (
          <form onSubmit={handleCreateTopicSubmit}>
            <div className="form-group">
              <label>Topic Title</label>
              <input
                type="text"
                className="form-control"
                value={topicForm.title}
                onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={topicForm.category}
                onChange={(e) => setTopicForm({ ...topicForm, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={topicForm.description}
                onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Save Topic
            </button>
          </form>
        )}

        {activeTab === 'QUESTIONS' && (
          <form onSubmit={handleCreateQuestionSubmit}>
            <div className="form-group">
              <label>Question Text</label>
              <textarea
                className="form-control"
                rows={2}
                value={questionForm.questionText}
                onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={questionForm.category}
                  onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Topic</label>
                <select
                  className="form-control"
                  value={questionForm.topic}
                  onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                >
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Option A</label>
                <input
                  type="text"
                  className="form-control"
                  value={questionForm.optionA}
                  onChange={(e) => setQuestionForm({ ...questionForm, optionA: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Option B</label>
                <input
                  type="text"
                  className="form-control"
                  value={questionForm.optionB}
                  onChange={(e) => setQuestionForm({ ...questionForm, optionB: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Option C</label>
                <input
                  type="text"
                  className="form-control"
                  value={questionForm.optionC}
                  onChange={(e) => setQuestionForm({ ...questionForm, optionC: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Option D</label>
                <input
                  type="text"
                  className="form-control"
                  value={questionForm.optionD}
                  onChange={(e) => setQuestionForm({ ...questionForm, optionD: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Correct Option</label>
              <select
                className="form-control"
                value={questionForm.correctOptionIndex}
                onChange={(e) => setQuestionForm({ ...questionForm, correctOptionIndex: e.target.value })}
              >
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>

            <div className="form-group">
              <label>Detailed Explanation</label>
              <textarea
                className="form-control"
                rows={2}
                value={questionForm.explanation}
                onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Save Question
            </button>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Destructive Action">
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Are you sure you want to delete this record?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            This action will permanently delete <strong>{selectedItem?.title || selectedItem?.questionText}</strong> from the database.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} className="btn btn-danger">
              Delete Record
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminContent;
