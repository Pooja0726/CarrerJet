const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parseResume } = require('../services/resumeParser');
const { analyzeATS } = require('../services/atsEngine');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${unique}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
    }
  }
});

/**
 * POST /api/ats/analyze
 * Upload resume + optional job description → returns ATS score
 */
router.post('/analyze', upload.single('resume'), async (req, res) => {
  const filePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded.' });
    }

    const { jobDescription = '', jobTitle = '' } = req.body;

    // Parse resume text
    const resumeText = await parseResume(filePath, req.file.mimetype);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(422).json({
        error: 'Could not extract enough text from your resume. Please ensure it is not image-based.'
      });
    }

    // Run ATS analysis
    const analysis = analyzeATS(resumeText, jobDescription, jobTitle);

    // Clean up temp file
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({
      success: true,
      filename: req.file.originalname,
      resumeText,
      ...analysis
    });
  } catch (err) {
    // Cleanup on error
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (_) {}
    }
    console.error('ATS analyze error:', err.message);
    res.status(500).json({ error: err.message || 'Analysis failed. Please try again.' });
  }
});

/**
 * POST /api/ats/analyze-text
 * Analyze pasted resume text (no file upload)
 */
router.post('/analyze-text', express.json(), async (req, res) => {
  try {
    const { resumeText, jobDescription = '', jobTitle = '' } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Resume text is too short.' });
    }

    const analysis = analyzeATS(resumeText, jobDescription, jobTitle);
    res.json({ success: true, filename: 'Pasted Text', ...analysis });
  } catch (err) {
    console.error('ATS text analyze error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
