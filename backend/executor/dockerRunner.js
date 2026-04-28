const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const LANGUAGE_CONFIG = {
  python: { image: 'python:3.11-slim',   filename: 'solution.py',   cmd: 'python solution.py' },
  cpp:    { image: 'gcc:latest',          filename: 'solution.cpp',  cmd: 'g++ solution.cpp -o sol && ./sol' },
  java:   { image: 'eclipse-temurin:17', filename: 'Solution.java', cmd: 'javac Solution.java && java Solution' }
};


/**
 * Run code in an isolated Docker container
 * @param {string} code - source code
 * @param {string} language - 'python' | 'cpp' | 'java'
 * @param {string} input - stdin input
 * @param {number} timeLimit - ms
 * @returns {{ verdict: string, output: string, runtime: number }}
 */
const runInDocker = (code, language, input, timeLimit = 2000) => {
  return new Promise((resolve) => {
    const config = LANGUAGE_CONFIG[language];
    const tmpDir = path.join('/tmp', uuidv4());
    fs.mkdirSync(tmpDir, { recursive: true });

    const codePath = path.join(tmpDir, config.filename);
    const inputPath = path.join(tmpDir, 'input.txt');
    fs.writeFileSync(codePath, code);
    fs.writeFileSync(inputPath, input);

    const dockerCmd = [
      'docker run --rm',
      `--memory=128m --cpus=0.5`,
      `--network none`,
      `-v ${tmpDir}:/code -w /code`,
      config.image,
      `sh -c "${config.cmd} < input.txt"`
    ].join(' ');

    const start = Date.now();
    const child = exec(dockerCmd, { timeout: timeLimit + 1000 }, (err, stdout, stderr) => {
      const runtime = Date.now() - start;
      fs.rmSync(tmpDir, { recursive: true, force: true });

      if (err) {
        if (runtime >= timeLimit) return resolve({ verdict: 'TLE', output: '', runtime });
        if (stderr) return resolve({ verdict: 'RE', output: stderr.trim(), runtime });
        return resolve({ verdict: 'CE', output: err.message, runtime });
      }
      resolve({ verdict: 'OK', output: stdout.trim(), runtime });
    });
  });
};

/**
 * Judge code against all test cases
 */
const judgeCode = async (code, language, testCases, timeLimit) => {
  let passed = 0;
  for (const tc of testCases) {
    const result = await runInDocker(code, language, tc.input, timeLimit);
    if (result.verdict !== 'OK') {
      return { verdict: result.verdict, passedCases: passed, totalCases: testCases.length, runtime: result.runtime };
    }
    if (result.output !== tc.output.trim()) {
      return { verdict: 'WA', passedCases: passed, totalCases: testCases.length, runtime: result.runtime };
    }
    passed++;
  }
  return { verdict: 'AC', passedCases: passed, totalCases: testCases.length };
};

module.exports = { judgeCode };
