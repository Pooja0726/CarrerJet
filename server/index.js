require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const atsRoutes = require('./routes/ats');
const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/ats', atsRoutes);
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Job Platform Server running on http://localhost:${PORT}`);
  console.log(`   ATS Engine: Ready`);
  console.log(`   Job Crawler: Ready`);
  console.log(`   RapidAPI Key: ${process.env.RAPIDAPI_KEY ? '✅ Set' : '⚠️  Not set (job search will use mock data)'}\n`);
});
