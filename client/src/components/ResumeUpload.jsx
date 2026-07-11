import React, { useState, useRef, useEffect } from 'react';

export default function ResumeUpload({ onAnalyze, isLoading, prefilledTitle, prefilledDesc }) {
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState(prefilledTitle || '');
  const [jobDescription, setJobDescription] = useState(prefilledDesc || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (prefilledTitle) setJobTitle(prefilledTitle);
    if (prefilledDesc) setJobDescription(prefilledDesc);
  }, [prefilledTitle, prefilledDesc]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragOver(false); setError(null);
    validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = (e) => { setError(null); validateAndSetFile(e.target.files[0]); };

  const validateAndSetFile = (f) => {
    if (!f) return;
    const ext = f.name.substring(f.name.lastIndexOf('.')).toLowerCase();
    if (!['.pdf', '.docx', '.txt'].includes(ext)) {
      setError('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
    setFile(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    onAnalyze({ file, jobTitle, jobDescription });
  };

  return (
    <div className="upload-section" id="upload-section">
      <div className="container">
        <div className="upload-header">
          <p className="section-eyebrow">Resume Scanner</p>
          <h2 className="section-title">Check Your ATS Match Score</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Upload your resume and paste a job description to get a precise ATS compatibility score with actionable recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="upload-grid">
          {/* Drop Zone */}
          <div
            className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.txt" />

            <div className="drop-icon-wrap">
              {file ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              )}
            </div>

            <div className="drop-title">
              {file ? 'Resume Ready' : 'Upload Your Resume'}
            </div>
            <div className="drop-hint">
              {file ? file.name : 'Drag & drop or click to browse'}
            </div>

            {!file && (
              <div className="format-badges">
                <span className="format-badge">PDF</span>
                <span className="format-badge">DOCX</span>
                <span className="format-badge">TXT</span>
                <span className="format-badge">Max 5 MB</span>
              </div>
            )}

            {file && (
              <div className="file-selected-bar">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                <button
                  type="button"
                  className="file-clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  title="Remove file"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* JD Panel */}
          <div className="jd-panel">
            <div>
              <label className="field-label" htmlFor="job-title-input">Target Job Title <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input
                id="job-title-input"
                type="text"
                className="field-input"
                placeholder="e.g. Senior Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="job-desc-input">
                Job Description
                <span style={{ color: 'var(--blue-600)', fontWeight: 600, marginLeft: 4 }}>Recommended</span>
              </label>
              <textarea
                id="job-desc-input"
                className="field-input field-textarea"
                placeholder="Paste the full job description here to get a precise keyword match score, skills gap analysis, and tailored suggestions..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {error && <div className="error-banner">{error}</div>}

            <button type="submit" className="submit-btn" disabled={!file || isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Analyzing Resume...
                </>
              ) : (
                'Run ATS Analysis'
              )}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
              Analysis is performed locally on our server. Your resume is never stored or shared.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
