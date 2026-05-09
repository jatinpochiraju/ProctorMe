import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomeLogin() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f6f9' }}>
      <div className="card" style={{ width: '400px', textAlign: 'center' }}>
        <h1 style={{ color: '#5d87ff', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: '#eef2ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>💡</div>
          ProctorMe
        </h1>
        <h2 style={{ marginBottom: '30px', color: '#2a3547' }}>Welcome to ProctorMe</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button className="btn" onClick={() => navigate('/login/student')} style={{ padding: '15px', fontSize: '16px' }}>
            Login as Student
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/login/admin')} style={{ padding: '15px', fontSize: '16px' }}>
            Login as Teacher/Admin
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeLogin;
