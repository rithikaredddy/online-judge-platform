import Editor from '@monaco-editor/react';
import { useState } from 'react';
import './CodeEditor.css';

const TEMPLATES = {
  python: `# Write your solution here\ndef solution():\n    pass\n\nsolution()`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
  java: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`
};

const CodeEditor = ({ onSubmit, loading }) => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(TEMPLATES['python']);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(TEMPLATES[e.target.value]);
  };

  return (
    <div className="editor-wrapper">
      <div className="editor-toolbar">
        <select value={language} onChange={handleLanguageChange} className="lang-select">
          <option value="python">Python 3</option>
          <option value="cpp">C++ 17</option>
          <option value="java">Java 17</option>
        </select>
        <button
          onClick={() => onSubmit(code, language)}
          disabled={loading}
          className="btn-submit"
        >
          {loading ? 'Judging...' : 'Submit ▶'}
        </button>
      </div>
      <Editor
        height="400px"
        language={language === 'cpp' ? 'cpp' : language}
        value={code}
        onChange={(val) => setCode(val)}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </div>
  );
};

export default CodeEditor;
