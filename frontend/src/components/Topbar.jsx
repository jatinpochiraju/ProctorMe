import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

function Topbar() {
  const { role } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="topbar">
      <div style={{ fontSize: '20px', color: '#5a6a85' }}>
        <i className="ti ti-bell"></i> {/* Placeholder for bell icon */}
        🔔
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: '#5a6a85', fontSize: '14px' }}>
          Hello, {role === 'admin' ? 'Teacher' : 'Student'}
        </span>
        <div style={{ width: '35px', height: '35px', background: '#eef2ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => dispatch(logout())}>
          🧑‍🏫
        </div>
      </div>
    </div>
  );
}

export default Topbar;
