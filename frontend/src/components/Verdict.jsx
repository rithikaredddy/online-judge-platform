import './Verdict.css';

const VERDICT_CONFIG = {
  AC:  { label: '✅ Accepted',             className: 'verdict-ac' },
  WA:  { label: '❌ Wrong Answer',          className: 'verdict-wa' },
  TLE: { label: '⏱ Time Limit Exceeded',   className: 'verdict-tle' },
  RE:  { label: '💥 Runtime Error',         className: 'verdict-re' },
  CE:  { label: '🔧 Compilation Error',     className: 'verdict-ce' },
};

const Verdict = ({ result }) => {
  if (!result) return null;
  const config = VERDICT_CONFIG[result.verdict] || { label: result.verdict, className: '' };

  return (
    <div className={`verdict-box ${config.className}`}>
      <p className="verdict-label">{config.label}</p>
      <div className="verdict-meta">
        <span>Test Cases: {result.passedCases} / {result.totalCases}</span>
        {result.runtime && <span>Runtime: {result.runtime}ms</span>}
      </div>
    </div>
  );
};

export default Verdict;
