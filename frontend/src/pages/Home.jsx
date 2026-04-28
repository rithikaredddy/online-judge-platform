import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const DIFFICULTY_COLOR = { Easy: 'tag-easy', Medium: 'tag-medium', Hard: 'tag-hard' };

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch(`${API}/api/problems`)
      .then(r => r.json())
      .then(data => { setProblems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? problems : problems.filter(p => p.difficulty === filter);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Problems</h1>
        <div className="filter-tabs">
          {['All', 'Easy', 'Medium', 'Hard'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >{f}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading problems...</p>
      ) : (
        <table className="problems-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p._id}>
                <td className="prob-num">{i + 1}</td>
                <td><Link to={`/problem/${p._id}`} className="prob-link">{p.title}</Link></td>
                <td><span className={`diff-tag ${DIFFICULTY_COLOR[p.difficulty]}`}>{p.difficulty}</span></td>
                <td className="prob-tags">{p.tags?.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;
