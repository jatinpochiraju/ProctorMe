import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  const { role } = useSelector(state => state.auth);
  
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div style={{ width: '32px', height: '32px', background: '#eef2ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
          💡
        </div>
        <span style={{ color: '#5d87ff' }}>ProctorMe</span>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '10px' }}>
        <div className="nav-section">Home</div>
        <NavLink to={role === 'admin' ? '/admin/dashboard' : '/dashboard'} className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          Dashboard
        </NavLink>

        {role === 'student' && (
          <>
            <div className="nav-section">Student</div>
            <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              Exams
            </NavLink>
            <NavLink to="/results" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              Result
            </NavLink>
          </>
        )}

        {role === 'admin' && (
          <>
            <div className="nav-section">Teacher</div>
            <NavLink to="/admin/create-exam" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              Create Exam
            </NavLink>
            <NavLink to="/admin/add-questions" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              Add Questions
            </NavLink>
            <NavLink to="/admin/logs" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
              Exam Logs
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
