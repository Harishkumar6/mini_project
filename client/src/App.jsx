import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import TopicList from './pages/TopicList';
import TopicDetail from './pages/TopicDetail';
import PracticeQuestions from './pages/PracticeQuestions';
import CodingPractice from './pages/CodingPractice';
import AssessmentList from './pages/AssessmentList';
import AssessmentTake from './pages/AssessmentTake';
import AssessmentResultView from './pages/AssessmentResultView';
import RoadmapView from './pages/RoadmapView';
import AnalyticsView from './pages/AnalyticsView';
import AchievementsView from './pages/AchievementsView';
import ProfileView from './pages/ProfileView';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminContent from './pages/AdminContent';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Protected Routes */}
      <Route element={<ProtectedRoute adminOnly={false} />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/learn" element={<TopicList />} />
        <Route path="/learn/:id" element={<TopicDetail />} />
        <Route path="/practice" element={<PracticeQuestions />} />
        <Route path="/coding" element={<CodingPractice />} />
        <Route path="/assessments" element={<AssessmentList />} />
        <Route path="/assessments/take/:id" element={<AssessmentTake />} />
        <Route path="/assessments/result/:id" element={<AssessmentResultView />} />
        <Route path="/roadmap" element={<RoadmapView />} />
        <Route path="/analytics" element={<AnalyticsView />} />
        <Route path="/achievements" element={<AchievementsView />} />
        <Route path="/profile" element={<ProfileView />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/categories" element={<AdminContent />} />
        <Route path="/admin/topics" element={<AdminContent />} />
        <Route path="/admin/materials" element={<AdminContent />} />
        <Route path="/admin/questions" element={<AdminContent />} />
        <Route path="/admin/coding" element={<AdminContent />} />
        <Route path="/admin/assessments" element={<AdminContent />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
