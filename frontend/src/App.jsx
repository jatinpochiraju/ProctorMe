import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeLogin from './pages/HomeLogin';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Exam from './pages/Exam';
import Summary from './pages/Summary';
import Results from './pages/Results';
import AdminRouter from './pages/AdminRouter';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated, role } = useSelector(state => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!isAuthenticated ? <HomeLogin /> : <Navigate to={role === 'admin' ? '/admin/logs' : '/dashboard'} />} />
        <Route path="/login/student" element={!isAuthenticated ? <StudentLogin /> : <Navigate to="/dashboard" />} />
        <Route path="/login/admin" element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin/logs" />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={isAuthenticated && role === 'student' ? <Layout><Dashboard /></Layout> : <Navigate to="/" />} />
        <Route path="/results" element={isAuthenticated && role === 'student' ? <Layout><Results /></Layout> : <Navigate to="/" />} />
        <Route path="/exam/:examId" element={isAuthenticated && role === 'student' ? <Layout><Exam /></Layout> : <Navigate to="/" />} />
        <Route path="/summary/:resultId" element={isAuthenticated ? <Layout><Summary /></Layout> : <Navigate to="/" />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={isAuthenticated && role === 'admin' ? <Layout><AdminRouter /></Layout> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
