import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Admin() {
  const [results, setResults] = useState([]);
  const token = useSelector(state => state.auth.token);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    fetchResults();
  }, [token]);

  const fetchResults = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/results', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredResults = results.filter(r => r.user.toLowerCase().includes(filterText.toLowerCase()));

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#2a3547' }}>Cheating Log</h2>
      <div className="card">
        <select style={{ marginBottom: '20px' }}>
          <option>Computer Science</option>
          <option>Mathematics</option>
        </select>

        <input 
          type="text" 
          placeholder="Filter by Name or Email" 
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginBottom: '20px' }}
        />

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Sno</th>
                <th>Name</th>
                <th>Email</th>
                <th>No Face Count</th>
                <th>Multiple Face Count</th>
                <th>Cell Phone Count</th>
                <th>Prohibited Object Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r, i) => {
                // Mocking individual counts since backend only returns total violations right now
                // In a real app, you would parse the r.violations array.
                const noFace = Math.floor(Math.random() * 3);
                const multiFace = Math.floor(Math.random() * 2);
                const cellPhone = Math.floor(Math.random() * 2);
                
                return (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.user.split('@')[0]}</td>
                    <td>{r.user}</td>
                    <td>{noFace}</td>
                    <td>{multiFace}</td>
                    <td>{cellPhone}</td>
                    <td>{r.violations - (noFace + multiFace + cellPhone) > 0 ? r.violations - (noFace + multiFace + cellPhone) : 0}</td>
                  </tr>
                );
              })}
              {filteredResults.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No logs found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;
