import React from 'react';

export default function JobCard({ job, onCheckMatch, hasResume }) {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="job-card animate-in">
      <div className="job-card-head">
        {job.logo ? (
          <>
            <img
              src={job.logo}
              alt={`${job.company}`}
              className="company-logo"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="company-initials" style={{ display: 'none' }}>{getInitials(job.company)}</div>
          </>
        ) : (
          <div className="company-initials">{getInitials(job.company)}</div>
        )}

        <div className="job-main">
          <div className="job-title">{job.title}</div>
          <div className="job-company">{job.company}</div>
          <div className="job-badges">
            {job.location && <span className="job-location">{job.location}</span>}
            {job.type && <span className="job-type-badge">{job.type}</span>}
            {job.salary && <span className="job-salary">{job.salary}</span>}
          </div>
        </div>

        <div className="job-side">
          <div className="job-posted">{job.posted}</div>
          <div className="job-source">via {job.source}</div>
        </div>
      </div>

      {job.description && (
        <p className="job-desc">{job.description}</p>
      )}

      {job.skills && job.skills.length > 0 && (
        <div className="job-skills">
          {job.skills.slice(0, 6).map((skill, i) => (
            <span key={i} className="skill-chip">{skill}</span>
          ))}
        </div>
      )}

      <div className="job-actions">
        {job.applyUrl && (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Apply Now
          </a>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onCheckMatch(job); }}
          className="match-btn"
        >
          {hasResume ? 'Check ATS Match' : 'Upload Resume & Match'}
        </button>
      </div>
    </div>
  );
}
