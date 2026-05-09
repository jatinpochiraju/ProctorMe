import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await axios.post('http://localhost:8000/auth/login', formData);
      if (res.data.role !== 'admin') {
        setError('Only teachers/admins can login here.');
        return;
      }
      dispatch(loginSuccess({ token: res.data.access_token, role: res.data.role }));
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: "'Inter', sans-serif" }}>
      {/* Left Side */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #1b1c3b 0%, #151e3f 50%, #201a3d 100%)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative circles */}
        <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: '600px', height: '600px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)' }}></div>
        
        {/* Graphic placeholder imitating the image */}
        <div style={{ marginBottom: '50px', position: 'relative', width: '200px', height: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#9d72d6', marginBottom: '10px' }}></div>
           <div style={{ width: '140px', height: '80px', border: '2px solid #5d87ff', borderRadius: '8px', position: 'relative', borderBottom: 'none' }}>
             <div style={{ position: 'absolute', bottom: '-4px', left: '-20px', width: '180px', height: '4px', background: '#364b73', borderRadius: '4px' }}></div>
             <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '45px', background: '#3b82f6', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', color: '#fff' }}>🔒</span>
             </div>
           </div>
           {/* Floating elements */}
           <div style={{ position: 'absolute', top: '20px', left: '-30px', color: '#5d87ff', fontSize: '20px' }}>📡</div>
           <div style={{ position: 'absolute', top: '30px', right: '-30px', width: '24px', height: '24px', background: '#13deb9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>✔</div>
        </div>

        <h1 style={{ color: 'white', fontSize: '28px', marginBottom: '12px', fontWeight: '600', zIndex: 1 }}>ProctorMe</h1>
        <p style={{ color: '#8e9ab5', fontSize: '15px', zIndex: 1 }}>Secure your exams with confidence</p>
      </div>

      {/* Right Side */}
      <div style={{ flex: 1, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
          <h2 style={{ color: '#2a3547', fontSize: '26px', marginBottom: '8px', fontWeight: '700' }}>Admin Portal</h2>
          <p style={{ color: '#5a6a85', fontSize: '14px', marginBottom: '40px' }}>Sign in to manage exams and view logs</p>
          
          {error && <p style={{ color: 'red', marginBottom: '20px', fontSize: '14px' }}>{error}</p>}
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#5a6a85', fontSize: '13px', fontWeight: '600' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '15px', top: '14px', color: '#8e9ab5', fontSize: '16px' }}>👤</span>
                <input 
                  type="text" 
                  placeholder="admin123"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '14px 14px 14px 45px', border: '1px solid #dfe5ef', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', background: '#fafbfc' }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#5a6a85', fontSize: '13px', fontWeight: '600' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '15px', top: '14px', color: '#8e9ab5', fontSize: '16px' }}>🔒</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '14px 45px', border: '1px solid #dfe5ef', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', background: '#fafbfc' }}
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '14px', color: '#8e9ab5', cursor: 'pointer', fontSize: '16px', userSelect: 'none' }}>
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5a6a85', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ margin: 0, width: '16px', height: '16px', accentColor: '#5d87ff', borderRadius: '4px' }} />
                Remember me
              </label>
            </div>

            <button type="submit" style={{ width: '100%', background: '#638aff', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '30px', boxShadow: '0 4px 14px rgba(99, 138, 255, 0.25)' }}>
              Sign In
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <span style={{ color: '#8e9ab5', fontSize: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>← Back to Role Selection</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
