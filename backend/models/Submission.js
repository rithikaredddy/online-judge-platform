const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem:  { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  language: { type: String, enum: ['python', 'cpp', 'java'], required: true },
  code:     { type: String, required: true },
  verdict:  { type: String, enum: ['AC', 'WA', 'TLE', 'RE', 'CE', 'Pending'], default: 'Pending' },
  runtime:  { type: Number }, // ms
  passedCases: { type: Number, default: 0 },
  totalCases:  { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
