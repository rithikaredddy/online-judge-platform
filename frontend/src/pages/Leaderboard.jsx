import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Leaderboard.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const MEDALS = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/submissions/leaderboard`)
      .then(r => r.json())
      .then(data => { setBoard(data); setLoading(false); });
  }, []);

  return (
    <div className="lb-container">
      <h2 className="lb-title">Leaderboard 🏆</h2>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <table className="lb-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Problems Solved</th>
            </tr>
          </thead>
          <tbody>
            {board.map(row => (
              <tr key={row.rank} className={user?.username === row.username ? 'lb-me' : ''}>
                <td className="lb-rank">
                  {row.rank <= 3 ? MEDALS[row.rank - 1] : `#${row.rank}`}
                </td>
                <td className="lb-user">
                  {row.username}
                  {user?.username === row.username && <span className="lb-you"> (you)</span>}
                </td>
                <td className="lb-solved">{row.solved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
