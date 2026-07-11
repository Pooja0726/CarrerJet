const express = require('express');
const { searchJobs } = require('../services/jobCrawler');

const router = express.Router();

/**
 * GET /api/jobs/search
 * Query params: query, location, jobType, remote, page
 */
router.get('/search', async (req, res) => {
  try {
    const {
      query = '',
      location = '',
      jobType = '',
      remote = 'false',
      page = '1'
    } = req.query;

    const results = await searchJobs({
      query,
      location,
      jobType,
      remote: remote === 'true',
      page: parseInt(page, 10)
    });

    res.json({ success: true, ...results });
  } catch (err) {
    console.error('Job search error:', err.message);
    res.status(500).json({ error: 'Job search failed. Please try again.' });
  }
});

module.exports = router;
