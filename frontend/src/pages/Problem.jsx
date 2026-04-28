import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import Verdict from '../components/Verdict';
import './Problem.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Problem = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/problems/${id}`)
      .then(r => r.json())
      .then(data => { setProblem(data); setLoading(false); });
  }, [id]);

  const handleSubmit = async (code, language) => {
    setSubmitting(true);
    setVerdict(null);
    try {
      const res = await fetch(`${API}/api/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ problemId: id, language, code })
      });
      const data = await res.json();
      setVerdict(data);
    } catch {
      setVerdict({ verdict: 'RE', passedCases: 0, totalCases: 0 });
    }
    setSubmitting(false);
  };

  if (loading) return <p className="loading-text">Loading problem...</p>;
  if (!problem) return <p className="loading-text">Problem not found.</p>;

  return (
    <div className="problem-page">
      <div className="problem-left">
        <div className="problem-header">
          <h2>{problem.title}</h2>
          <span className={`diff-tag diff-${problem.difficulty?.toLowerCase()}`}>{problem.difficulty}</span>
        </div>
        <div className="problem-desc" dangerouslySetInnerHTML={{ __html: problem.description }} />

        {problem.examples?.map((ex, i) => (
          <div key={i} className="example-block">
            <p className="example-title">Example {i + 1}</p>
            <pre><strong>Input:</strong> {ex.input}</pre>
            <pre><strong>Output:</strong> {ex.output}</pre>
            {ex.explanation && <p className="example-exp"><strong>Explanation:</strong> {ex.explanation}</p>}
          </div>
        ))}

        <div className="constraints">
          <p><strong>Time Limit:</strong> {problem.timeLimit / 1000}s</p>
          <p><strong>Tags:</strong> {problem.tags?.join(', ')}</p>
        </div>
      </div>

      <div className="problem-right">
        <CodeEditor onSubmit={handleSubmit} loading={submitting} />
        <Verdict result={verdict} />
      </div>
    </div>
  );
};

export default Problem;
