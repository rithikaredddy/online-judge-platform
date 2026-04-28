const express = require('express');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { judgeCode } = require('../executor/dockerRunner');
const router = express.Router();

// POST /api/submissions — submit code
router.post('/', protect, async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Create pending submission
    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      language,
      code,
      verdict: 'Pending'
    });

    // Judge the code
    const result = await judgeCode(code, language, problem.testCases, problem.timeLimit);

    // Update submission with verdict
    submission.verdict = result.verdict;
    submission.runtime = result.runtime;
    submission.passedCases = result.passedCases;
    submission.totalCases = result.totalCases;
    await submission.save();

    // If AC, mark problem as solved for user
    if (result.verdict === 'AC') {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { solvedProblems: problemId }
      });
    }

    res.json({
      submissionId: submission._id,
      verdict: result.verdict,
      passedCases: result.passedCases,
      totalCases: result.totalCases,
      runtime: result.runtime
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/submissions/me — current user's submissions
router.get('/me', protect, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .populate('problem', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/submissions/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('username solvedProblems')
      .sort({ 'solvedProblems': -1 })
      .limit(20);
    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      username: u.username,
      solved: u.solvedProblems.length
    }));
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
