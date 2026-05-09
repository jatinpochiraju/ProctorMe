import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Summary() {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/exam/results/${resultId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setResult(res.data)).catch(() => navigate('/'));
  }, [resultId, token, navigate]);

  const downloadTxt = async () => {
    const res = await axios.get(`http://localhost:8000/admin/report/txt/${resultId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report_${resultId}.txt`);
    document.body.appendChild(link);
    link.click();
  };

  if (!result) return <div>Loading summary...</div>;

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '40px auto' }}>
      <div className="header">
        <h2>Exam Summary</h2>
        <button className="btn" onClick={() => navigate('/')}>Home</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div>
          <p><strong>Subject:</strong> {result.exam_subject}</p>
          <p><strong>Difficulty:</strong> {result.difficulty}</p>
          <p><strong>Score:</strong> {result.score} / {result.questions.length}</p>
        </div>
        <div>
          <p><strong>Time Taken:</strong> {result.timeTakenSeconds} seconds</p>
          <p><strong>Violations:</strong> {result.violationCount}</p>
          <p><strong>Status:</strong> {result.violationCount > 10 ? <span style={{color:'red', fontWeight:'bold', background:'#ffeaea', padding:'2px 8px', borderRadius:'4px'}}>Malpractice</span> : <span style={{color:'green', fontWeight:'bold', background:'#eaffea', padding:'2px 8px', borderRadius:'4px'}}>Clear</span>}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn" onClick={downloadTxt} style={{ background: '#5d87ff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>Download TXT Report</button>
      </div>

      <h3 style={{ marginTop: '30px' }}>Question Breakdown</h3>
      {result.questions.map((q, idx) => {
        const userAnswer = result.answers[q.id];
        const isCorrect = userAnswer === q.correct_option;
        return (
          <div key={q.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '4px', marginBottom: '15px', borderLeft: isCorrect ? '5px solid green' : '5px solid red' }}>
            <p><strong>Q{idx + 1}. {q.text}</strong></p>
            <p>Your Answer: {userAnswer !== undefined ? q.options[userAnswer] : 'Not Answered'}</p>
            <p>Correct Answer: {q.options[q.correct_option]}</p>
          </div>
        )
      })}
    </div>
  );
}

export default Summary;
