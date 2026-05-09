import React from 'react';

function Results() {
  const tableData = [
    { name: 'JAVA - Easy Level (10 Questions)', score: '0.0%', date: '20/04/2026' },
    { name: 'JAVA - Medium Level (10 Questions)', score: '0.0%', date: '02/04/2026' },
    { name: 'JAVA - Medium Level (10 Questions)', score: '0.0%', date: '02/04/2026' },
    { name: 'JAVA - Medium Level (10 Questions)', score: '0.0%', date: '02/04/2026' },
    { name: 'JAVA - Easy Level (10 Questions)', score: '10.0%', date: '25/03/2026' },
    { name: 'JAVA - Easy Level (10 Questions)', score: '0.0%', date: '25/03/2026' },
    { name: 'JAVA - Easy Level (10 Questions)', score: '10.0%', date: '25/03/2026' },
  ];

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ color: '#2a3547', fontSize: '15px', fontWeight: '500' }}>Total Exams Taken</div>
          <div style={{ fontSize: '28px', fontWeight: '600', color: '#2a3547' }}>7</div>
        </div>
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ color: '#2a3547', fontSize: '15px', fontWeight: '500' }}>Average Score</div>
          <div style={{ fontSize: '28px', fontWeight: '600', color: '#2a3547' }}>2.9%</div>
        </div>
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ color: '#2a3547', fontSize: '15px', fontWeight: '500' }}>Total Submissions</div>
          <div style={{ fontSize: '28px', fontWeight: '600', color: '#2a3547' }}>0</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#2a3547', fontSize: '18px' }}>My Results</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '15px 10px', color: '#2a3547', fontWeight: '600', borderBottom: 'none', background: '#f4f6f9', borderRadius: '6px 0 0 6px' }}>Exam Name</th>
              <th style={{ padding: '15px 10px', color: '#2a3547', fontWeight: '600', borderBottom: 'none', background: '#f4f6f9' }}>MCQ Score</th>
              <th style={{ padding: '15px 10px', color: '#2a3547', fontWeight: '600', borderBottom: 'none', background: '#f4f6f9' }}>Coding Submissions</th>
              <th style={{ padding: '15px 10px', color: '#2a3547', fontWeight: '600', borderBottom: 'none', background: '#f4f6f9' }}>Total Score</th>
              <th style={{ padding: '15px 10px', color: '#2a3547', fontWeight: '600', borderBottom: 'none', background: '#f4f6f9', borderRadius: '0 6px 6px 0' }}>Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eef2ff' }}>
                <td style={{ padding: '20px 10px', color: '#5a6a85', fontSize: '14px' }}>{row.name}</td>
                <td style={{ padding: '20px 10px' }}>
                  <span style={{ background: '#ffae1f', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                    {row.score}
                  </span>
                </td>
                <td style={{ padding: '20px 10px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#13deb9', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    ✔
                  </div>
                </td>
                <td style={{ padding: '20px 10px', color: '#5a6a85', fontSize: '14px' }}>Total: {parseInt(row.score)}</td>
                <td style={{ padding: '20px 10px', color: '#5a6a85', fontSize: '14px' }}>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Results;
