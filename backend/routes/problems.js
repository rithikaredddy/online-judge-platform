const express = require('express');
const Problem = require('../models/Problem');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/problems — get all problems (no test cases exposed)
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find().select('-testCases');
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/problems/:id — get single problem (no test cases exposed)
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select('-testCases');
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/problems — admin only (add problem)
router.post('/', protect, async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
