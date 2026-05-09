import React, { useState } from 'react';

function CreateExam() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
      {showSuccess && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'white', borderTop: '4px solid #13deb9', padding: '15px 20px', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1000 }}>
          <span style={{ color: '#13deb9' }}>✔</span> Exam Created successfully
        </div>
      )}
      
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#2a3547' }}>Create Exam</h2>
        <form onSubmit={handleSubmit}>
          <label>Exam Name *</label>
          <input type="text" placeholder="e.g. Object-Oriented Programming System" required />
          
          <label>Total Number of Questions *</label>
          <input type="number" placeholder="e.g. 30" required />
          
          <label>Exam Duration (minutes) *</label>
          <input type="number" placeholder="e.g. 45" required />
          
          <label>Live Date and Time *</label>
          <input type="datetime-local" required />
          
          <label>Dead Date and Time *</label>
          <input type="datetime-local" required />
          
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>Create Exam</button>
        </form>
      </div>
    </div>
  );
}

export default CreateExam;
