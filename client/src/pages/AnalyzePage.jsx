import React from 'react';
import ATSScore from '../components/ATSScore';
import ATSBreakdown from '../components/ATSBreakdown';

export default function AnalyzePage({ analysisData, onNavigateToJobs }) {
  if (!analysisData) {
    return (
      <div className="container page" style={{ textAlign: 'center', paddingTop: 100 }}>
        <h2 style={{ marginBottom: 12 }}>No analysis data found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Please go back and upload a resume to check your ATS score.
        </p>
      </div>
    );
  }

  const { score, grade, gradeLabel, gradeColor, filename, jobTitle, factors, suggestions, methodology } = analysisData;

  return (
    <div className="container page animate-in">
      {/* Header */}
      <div className="results-header">
        <div>
          <div className="results-breadcrumb">Analysis Complete</div>
          <h1 className="results-title">ATS Match Report</h1>
          <p className="results-sub">
            Resume: <strong>{filename}</strong> &nbsp;|&nbsp; Target: <strong>{jobTitle || 'General Profile'}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigateToJobs(jobTitle !== 'General' ? jobTitle : '')}
            className="btn btn-primary"
          >
            Find Matching Jobs
          </button>
        </div>
      </div>

      {/* Results Layout */}
      <div className="results-layout">
        <ATSScore
          score={score}
          grade={grade}
          label={gradeLabel}
          color={gradeColor}
          filename={filename}
          jobTitle={jobTitle}
        />

        <div>
          <ATSBreakdown factors={factors} suggestions={suggestions} />

          {/* Methodology */}
          <div className="methodology-box">
            <div className="methodology-header">
              <h3>How This Score Was Calculated</h3>
              <span className="accuracy-chip">{methodology.accuracy}</span>
            </div>
            <p className="methodology-desc">
              {methodology.description} Our algorithm is calibrated to replicate scoring logic used by enterprise ATS platforms (Workday, Taleo, Greenhouse).
            </p>

            <table className="weights-table">
              <thead>
                <tr>
                  <th>Factor</th>
                  <th>Weight</th>
                  <th>What It Checks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Keyword Match</td>
                  <td><span className="w-pill">35%</span></td>
                  <td>TF-IDF weighted keyword overlap between resume and job description.</td>
                </tr>
                <tr>
                  <td>Section Structure</td>
                  <td><span className="w-pill">20%</span></td>
                  <td>Presence of key headings: Experience, Skills, Education, Contact.</td>
                </tr>
                <tr>
                  <td>Quantifiable Achievements</td>
                  <td><span className="w-pill">15%</span></td>
                  <td>Bullet points with numbers, percentages, and measurable outcomes.</td>
                </tr>
                <tr>
                  <td>Action Verbs</td>
                  <td><span className="w-pill">10%</span></td>
                  <td>Strong power verbs starting work history bullets.</td>
                </tr>
                <tr>
                  <td>Skills Overlap</td>
                  <td><span className="w-pill">10%</span></td>
                  <td>Direct technology stack and methodology match.</td>
                </tr>
                <tr>
                  <td>Education Match</td>
                  <td><span className="w-pill">5%</span></td>
                  <td>Academic qualification level alignment.</td>
                </tr>
                <tr>
                  <td>ATS Readability</td>
                  <td><span className="w-pill">5%</span></td>
                  <td>No tables, graphics, or multi-column layouts that break parsers.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
