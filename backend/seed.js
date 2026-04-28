/**
 * Seed script — run once to populate problems into MongoDB
 * Usage: node seed.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Problem = require('./models/Problem');

const PROBLEMS_DIR = path.join(__dirname, '../problems');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlinejudge');
    console.log('Connected to MongoDB');

    // Clear existing problems
    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    // Read all JSON files from problems directory
    const files = fs.readdirSync(PROBLEMS_DIR).filter(f => f.endsWith('.json'));
    const problems = files.map(f => JSON.parse(fs.readFileSync(path.join(PROBLEMS_DIR, f), 'utf-8')));

    await Problem.insertMany(problems);
    console.log(`Seeded ${problems.length} problems successfully:`);
    problems.forEach(p => console.log(`  - ${p.title} (${p.difficulty})`));

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
