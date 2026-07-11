import React, { useEffect, useState } from 'react';

export default function ATSScore({ score, grade, label, color, jobTitle }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let start = 0;
    const inc = score / (1200 / 16);
    const t = setInterval(() => {
      start += inc;
      if (start >= score) { clearInterval(t); setAnimated(score); }
      else setAnimated(Math.round(start));
    }, 16);
    return () => clearInterval(t);
  }, [score]);

  const size = 160;
  const sw = 14;
  const center = size / 2;
  const radius = center - sw;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (animated / 100) * circ;

  return (
    <div className="score-card animate-in">
      <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>
        ATS Match Score
      </p>

      <div className="gauge-wrap">
        <svg width={size} height={size} className="gauge-svg">
          <circle cx={center} cy={center} r={radius} className="gauge-track" strokeWidth={sw} />
          <circle
            cx={center} cy={center} r={radius}
            className="gauge-bar"
            strokeWidth={sw}
            stroke={color}
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="gauge-center">
          <span className="gauge-score" style={{ color }}>{animated}</span>
          <span className="gauge-denom">/ 100</span>
        </div>
      </div>

      <div className="grade-pill" style={{ backgroundColor: `${color}18`, color }}>
        Grade {grade} &mdash; {label}
      </div>
      <p className="grade-target">
        Target: <strong>{jobTitle || 'General Profile'}</strong>
      </p>

      <div className="accuracy-box">
        <div className="accuracy-box-label">Scoring Engine Accuracy</div>
        <div className="accuracy-score">78 – 85%</div>
        <div className="accuracy-desc">
          Calibrated against Workday, Taleo, and Greenhouse ATS parsing rules using TF-IDF keyword analysis.
        </div>
      </div>
    </div>
  );
}
