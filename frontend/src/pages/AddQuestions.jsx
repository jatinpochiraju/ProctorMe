import React, { useState } from 'react';

function AddQuestions() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
      {showSuccess && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: 'white', borderTop: '4px solid #13deb9', padding: '15px 20px', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 1000 }}>
          <span style={{ color: '#13deb9' }}>✔</span> Question Added Successfully
        </div>
      )}
      
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#2a3547' }}>Add New Question</h2>
        <form onSubmit={handleSubmit}>
          <label>Select Exam *</label>
          <select required>
            <option value="">-- Select Exam --</option>
            <option value="1">Computer Science</option>
            <option value="2">Mathematics</option>
          </select>
          
          <label>Question Text *</label>
          <textarea rows="4" style={{ width: '100%', padding: '10px 14px', margin: '8px 0 16px 0', border: '1px solid #dfe5ef', borderRadius: '6px', boxSizing: 'border-box' }} placeholder="Enter the question here..." required />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label>Option A *</label>
              <input type="text" required />
            </div>
            <div>
              <label>Option B *</label>
              <input type="text" required />
            </div>
            <div>
              <label>Option C *</label>
              <input type="text" required />
            </div>
            <div>
              <label>Option D *</label>
              <input type="text" required />
            </div>
          </div>
          
          <label>Correct Option *</label>
          <select required>
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>
          
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '20px' }}>Save Question</button>
        </form>
      </div>
    </div>
  );
}

export default AddQuestions;
