const fs = require('fs');
const path = require('path');

/**
 * Extracts plain text from a PDF or DOCX file
 * @param {string} filePath - absolute path to the uploaded file
 * @param {string} mimetype - file's MIME type
 * @returns {Promise<string>} - extracted text
 */
async function parseResume(filePath, mimetype) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf' || mimetype === 'application/pdf') {
    return await parsePDF(filePath);
  } else if (
    ext === '.docx' ||
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return await parseDOCX(filePath);
  } else if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf8');
  } else {
    throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT.');
  }
}

async function parsePDF(filePath) {
  const pdfParse = require('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}

async function parseDOCX(filePath) {
  const mammoth = require('mammoth');
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

module.exports = { parseResume };
