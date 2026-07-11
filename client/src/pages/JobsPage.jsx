import React, { useState, useEffect } from 'react';
import JobSearch from '../components/JobSearch';
import JobCard from '../components/JobCard';

export default function JobsPage({ initialQuery = '', resumeData, onReAnalyzeWithJD }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery || 'software engineer');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [remote, setRemote] = useState(false);
  const [page] = useState(1);
  const [dataSource, setDataSource] = useState('mock');
  const [notice, setNotice] = useState(null);
  const [matchingJob, setMatchingJob] = useState(null);
  const [matchScore, setMatchScore] = useState(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const q = params.query !== undefined ? params.query : query;
      const loc = params.location !== undefined ? params.location : location;
      const type = params.jobType !== undefined ? params.jobType : jobType;
      const rem = params.remote !== undefined ? params.remote : remote;
      const p = params.page !== undefined ? params.page : page;
      const url = `/api/jobs/search?query=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}&jobType=${type}&remote=${rem}&page=${p}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
        setDataSource(data.source || 'mock');
        setNotice(data.note || null);
      } else {
        setError(data.error || 'Failed to load jobs.');
      }
    } catch (err) {
      setError('Could not connect to the job crawler. Please ensure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSearch = (params) => {
    setQuery(params.query);
    setLocation(params.location);
    setJobType(params.jobType);
    setRemote(params.remote);
    fetchJobs({ ...params, page: 1 });
  };

  const handleCheckMatch = async (job) => {
    if (!resumeData?.success) {
      alert('Please upload your resume on the ATS Scanner page first.');
      return;
    }
    setMatchingJob(job);
    setMatchingLoading(true);
    setMatchScore(null);
    try {
      const res = await fetch('/api/ats/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeData.resumeText || '',
          jobDescription: job.description,
          jobTitle: job.title
        })
      });
      const data = await res.json();
      if (data.success) setMatchScore(data);
      else alert(data.error || 'Matching failed.');
    } catch {
      alert('Could not connect to ATS matching service.');
    } finally {
      setMatchingLoading(false);
    }
  };

  return (
    <div className="container jobs-page animate-in">
      <div className="jobs-header">
        <p className="section-eyebrow">Live Job Board</p>
        <h1 className="jobs-title">Find & Match Jobs</h1>
        <p className="jobs-sub">Search live job listings and instantly check how well your resume matches any role.</p>
      </div>

      <JobSearch onSearch={handleSearch} />

      <div className="results-meta">
        <div className="results-count">
          Showing <strong>{jobs.length}</strong> results for "<strong>{query || 'software engineer'}</strong>"
        </div>
      </div>

      {loading ? (
        <div className="spinner-wrap">
          <div className="spinner" />
          <span className="spinner-label">Crawling top matching jobs...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">No jobs found</div>
          <p className="empty-desc">Try broader search terms or remove location filters.</p>
        </div>
      ) : (
        <div className="jobs-list">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onCheckMatch={handleCheckMatch}
              hasResume={!!(resumeData?.success)}
            />
          ))}
        </div>
      )}

      {/* ATS Match Modal */}
      {matchingJob && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setMatchingJob(null); setMatchScore(null); } }}>
          <div className="modal-box">
            <button className="modal-close" onClick={() => { setMatchingJob(null); setMatchScore(null); }}>
              ×
            </button>

            <div className="modal-title">ATS Match Analysis</div>
            <p className="modal-sub">
              Resume vs. <strong>{matchingJob.title}</strong> at <strong>{matchingJob.company}</strong>
            </p>

            {matchingLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="spinner" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Analyzing resume against job description...</p>
              </div>
            ) : matchScore ? (
              <>
                <div className="score-bar-row">
                  <div className="score-circle" style={{ borderColor: matchScore.gradeColor, color: matchScore.gradeColor }}>
                    {matchScore.score}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: matchScore.gradeColor }}>
                      {matchScore.gradeLabel} — Grade {matchScore.grade}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ATS compatibility score</div>
                  </div>
                </div>

                <div className="modal-section">
                  <div className="modal-section-label">Missing Keywords</div>
                  {matchScore.factors.keywordMatch.detail.missing.length > 0 ? (
                    <>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                        Add these to your resume to improve your score:
                      </p>
                      <div className="tag-row">
                        {matchScore.factors.keywordMatch.detail.missing.slice(0, 12).map((t, i) => (
                          <span key={i} className="tag tag-miss">{t}</span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: '0.82rem', color: 'var(--green-600)', fontWeight: 600 }}>
                      All major keywords are present in your resume.
                    </p>
                  )}
                </div>

                <div className="modal-section">
                  <div className="modal-section-label">Skills Gap</div>
                  {matchScore.factors.skillsOverlap.detail.missing.length > 0 ? (
                    <>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                        Skills in the job listing not found in your resume:
                      </p>
                      <div className="tag-row">
                        {matchScore.factors.skillsOverlap.detail.missing.slice(0, 8).map((s, i) => (
                          <span key={i} className="tag tag-miss">{s}</span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: '0.82rem', color: 'var(--green-600)', fontWeight: 600 }}>
                      You have all required skills for this role.
                    </p>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    onClick={() => { setMatchingJob(null); setMatchScore(null); onReAnalyzeWithJD(matchingJob); }}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Tailor Resume for This Job
                  </button>
                  <a
                    href={matchingJob.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    Apply Now
                  </a>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
