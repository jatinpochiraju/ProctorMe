import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLogs from './Admin';
import CreateExam from './CreateExam';
import AddQuestions from './AddQuestions';
import Dashboard from './Dashboard'; // Import Dashboard

function AdminRouter() {
  return (
    <Routes>
      <Route path="logs" element={<AdminLogs />} />
      <Route path="create-exam" element={<CreateExam />} />
      <Route path="add-questions" element={<AddQuestions />} />
      <Route path="dashboard" element={<Dashboard />} />
      {/* Fallback to logs */}
      <Route path="*" element={<Navigate to="logs" />} />
    </Routes>
  );
}

export default AdminRouter;
