import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [exams, setExams] = useState([]);
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/exam/available', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      // Mocking a larger list to look like the grid in image 4
      const mockList = [
        { id: 1, subject: 'JAVA', difficulty: 'Easy Level', qCount: 10, mins: 30 },
        { id: 2, subject: 'JAVA', difficulty: 'Medium Level', qCount: 10, mins: 30 },
        { id: 3, subject: 'JAVA', difficulty: 'Hard Level', qCount: 10, mins: 30 },
        { id: 4, subject: 'PYTHON', difficulty: 'Easy Level', qCount: 10, mins: 30 },
        { id: 5, subject: 'PYTHON', difficulty: 'Medium Level', qCount: 10, mins: 30 },
        { id: 6, subject: 'PYTHON', difficulty: 'Hard Level', qCount: 10, mins: 30 },
        { id: 7, subject: 'CPP', difficulty: 'Easy Level', qCount: 10, mins: 30 },
        { id: 8, subject: 'CPP', difficulty: 'Medium Level', qCount: 10, mins: 30 },
        { id: 9, subject: 'C', difficulty: 'Easy Level', qCount: 10, mins: 30 },
        { id: 10, subject: 'C', difficulty: 'Medium Level', qCount: 10, mins: 30 },
        { id: 11, subject: 'C', difficulty: 'Hard Level', qCount: 10, mins: 30 },
      ];
      // Use actual data if available, otherwise mock
      if(res.data && res.data.length > 0) {
         setExams(res.data.map(e => ({ id: e.id, subject: e.subject, difficulty: e.difficulty, qCount: e.questions.length, mins: 15 })));
      } else {
         setExams(mockList);
      }
    }).catch(console.error);
  }, [token]);

  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{ marginBottom: '20px', color: '#2a3547', fontSize: '20px' }}>All Active Exams</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {exams.map(ex => (
          <div key={ex.id} className="card" style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', borderRadius: '12px' }} onClick={() => navigate(`/exam/${ex.id}`)}>
            <div style={{ height: '140px', background: 'linear-gradient(45deg, #1e293b, #334155)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.8, background: '#2563eb', mixBlendMode: 'overlay' }}></div>
              <pre style={{ color: '#a3e635', fontSize: '10px', padding: '15px', margin: 0, fontFamily: 'monospace', opacity: 0.9 }}>
{`function digital_best_reviews() {
  global $post;
  // ... code logic here
  $cat_query1 = new WP_Query(
    // logic
  );
}`}
              </pre>
            </div>
            <div style={{ padding: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#2a3547', fontSize: '15px' }}>{ex.subject} - {ex.difficulty} ({ex.qCount} Questions)</h4>
              <p style={{ color: '#5a6a85', fontSize: '13px', margin: '0 0 20px 0' }}>MCQ</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8e9eab', fontSize: '13px', fontWeight: '500' }}>
                <span>{ex.qCount} ques</span>
                <span>{ex.mins}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
