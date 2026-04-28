const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input:  { type: String, required: true },
  output: { type: String, required: true }
});

const problemSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  difficulty:  { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  description: { type: String, required: true },
  examples: [{
    input:  String,
    output: String,
    explanation: String
  }],
  testCases:   [testCaseSchema],  // hidden test cases
  tags:        [String],
  timeLimit:   { type: Number, default: 2000 }, // ms
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', problemSchema);
