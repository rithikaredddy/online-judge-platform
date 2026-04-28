import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VERDICT_BADGE = {
  AC:  { label: 'Accepted',            cls: 'v-ac' },
  WA:  { label: 'Wrong Answer',        cls: 'v-wa' },
  TLE: { label: 'Time Limit Exceeded', cls: 'v-tle' },
  RE:  { label: 'Runtime Error',       cls: 'v-re' },
  CE:  { label: 'Compile Error',       cls: 'v-ce' },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/submissions/me`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(r => r.json())
      .then(data => { setSubmissions(data); setLoading(false); });
  }, [user.token]);

  const solved = submissions.filter(s => s.verdict === 'AC').length;

  return (
    <div className="dashboard-container">
      <div className="dash-header">
        <h2>Welcome, {user.username} 👋</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Problems Solved</p>
          <p className="stat-value">{user.solvedCount || solved}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Submissions</p>
          <p className="stat-value">{submissions.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Acceptance Rate</p>
          <p className="stat-value">
            {submissions.length ? Math.round((solved / submissions.length) * 100) : 0}%
          </p>
        </div>
      </div>

      <h3 className="section-title">Recent Submissions</h3>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="loading-text">No submissions yet. Start solving!</p>
      ) : (
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Problem</th>
              <th>Language</th>
              <th>Verdict</th>
              <th>Runtime</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(s => {
              const v = VERDICT_BADGE[s.verdict] || { label: s.verdict, cls: '' };
              return (
                <tr key={s._id}>
                  <td className="sub-prob">{s.problem?.title || 'Unknown'}</td>
                  <td className="sub-lang">{s.language}</td>
                  <td><span className={`verdict-pill ${v.cls}`}>{v.label}</span></td>
                  <td>{s.runtime ? `${s.runtime}ms` : '-'}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
