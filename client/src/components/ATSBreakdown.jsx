import React, { useState } from 'react';

function FactorItem({ factorKey, label, score, weight, icon, detail, isOpen, onToggle }) {
  const color = score >= 80 ? 'var(--green-600)' : score >= 55 ? 'var(--amber-500)' : 'var(--red-500)';

  return (
    <div className="factor-item">
      <div className="factor-row" onClick={onToggle}>
        <div className="factor-abbr">{icon}</div>
        <div className="factor-meta">
          <div className="factor-name">{label}</div>
          <div className="factor-wt">Weight: {weight}</div>
        </div>
        <div className="factor-right">
          <span className="factor-pct" style={{ color }}>{score}%</span>
          <div className="factor-track">
            <div className="factor-fill" style={{ width: `${score}%`, backgroundColor: color }} />
          </div>
          <span className={`factor-chevron ${isOpen ? 'open' : ''}`}>▼</span>
        </div>
      </div>

      {isOpen && (
        <div className="factor-body">
          <div className="factor-body-inner">
            {factorKey === 'keywordMatch' && (
              <div>
                <p className="body-text">
                  Your resume was analyzed against the job description using TF-IDF weighted keyword comparison.
                </p>
                {detail.matched.length > 0 && (
                  <>
                    <div className="body-label">Matched Keywords ({detail.matched.length})</div>
                    <div className="tag-row">
                      {detail.matched.map((t, i) => <span key={i} className="tag tag-ok">{t}</span>)}
                    </div>
                  </>
                )}
                {detail.missing.length > 0 ? (
                  <>
                    <div className="body-label">Missing from Resume ({detail.missing.length})</div>
                    <div className="tag-row">
                      {detail.missing.map((t, i) => <span key={i} className="tag tag-miss">{t}</span>)}
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--green-600)', fontWeight: 600, marginTop: 10 }}>
                    All major keywords are present in your resume.
                  </p>
                )}
              </div>
            )}

            {factorKey === 'sectionStructure' && (
              <div>
                <p className="body-text">
                  ATS parsers rely on standard section headings to extract work history and contact information.
                </p>
                <div className="body-label">Section Verification</div>
                <div className="section-check-grid">
                  {Object.entries(detail.sections || {}).map(([sec, present]) => (
                    <div key={sec} className="section-check">
                      <div className="section-check-dot" style={{ background: present ? 'var(--green-500)' : 'var(--red-500)' }} />
                      <span className="section-check-name">{sec.charAt(0).toUpperCase() + sec.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {factorKey === 'quantifiableAchievements' && (
              <div>
                <p className="body-text">
                  Recruiters and ATS prefer bullet points with measurable results such as percentages, revenue figures, and team sizes.
                </p>
                <div className="body-label">Result</div>
                <p className="body-text" style={{ fontWeight: 600, color: 'var(--text-base)' }}>
                  {detail.quantifiedLines} of {detail.totalLines} lines contain quantifiable metrics.
                </p>
                {detail.examples.length > 0 && (
                  <>
                    <div className="body-label">Detected Examples</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {detail.examples.map((ex, i) => (
                        <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', padding: '6px 10px', borderLeft: '2px solid var(--blue-500)', background: 'var(--bg-surface)', borderRadius: '0 4px 4px 0' }}>
                          "{ex}..."
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {factorKey === 'actionVerbs' && (
              <div>
                <p className="body-text">
                  Strong action verbs at the start of bullet points improve both ATS parsing and recruiter impression.
                </p>
                {detail.found.length > 0 ? (
                  <>
                    <div className="body-label">Action Verbs Found ({detail.found.length})</div>
                    <div className="tag-row">
                      {detail.found.map((v, i) => <span key={i} className="tag tag-neutral">{v}</span>)}
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--red-500)', marginTop: 8 }}>
                    No strong action verbs detected. Use verbs like Led, Built, Architected, Optimized.
                  </p>
                )}
              </div>
            )}

            {factorKey === 'skillsOverlap' && (
              <div>
                <p className="body-text">
                  Measures how many of the job's required technical and soft skills appear in your resume.
                </p>
                {detail.matching.length > 0 && (
                  <>
                    <div className="body-label">Matching Skills ({detail.matching.length})</div>
                    <div className="tag-row">
                      {detail.matching.map((s, i) => <span key={i} className="tag tag-ok">{s}</span>)}
                    </div>
                  </>
                )}
                {detail.missing.length > 0 && (
                  <>
                    <div className="body-label">Missing Skills ({detail.missing.length})</div>
                    <div className="tag-row">
                      {detail.missing.map((s, i) => <span key={i} className="tag tag-miss">{s}</span>)}
                    </div>
                  </>
                )}
              </div>
            )}

            {factorKey === 'educationMatch' && (
              <div>
                <div className="body-label">Education Verification</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--text-muted)', minWidth: 120 }}>Detected level:</span>
                    <strong>{detail.resumeLevel}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--text-muted)', minWidth: 120 }}>Required level:</span>
                    <strong>{detail.requiredLevel}</strong>
                  </div>
                </div>
              </div>
            )}

            {factorKey === 'atsReadability' && (
              <div>
                <p className="body-text">
                  Checks for layout elements (tables, columns, graphics) that commonly break ATS parsers.
                </p>
                {detail.issues.length > 0 ? (
                  <>
                    <div className="body-label">Issues Found ({detail.issues.length})</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {detail.issues.map((issue, i) => (
                        <li key={i} style={{ fontSize: '0.8rem', color: 'var(--red-600)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                          <span style={{ flexShrink: 0, marginTop: 1, fontWeight: 700 }}>!</span> {issue}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--green-600)', fontWeight: 600, marginTop: 8 }}>
                    Layout check passed. No parsing issues detected.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ATSBreakdown({ factors, suggestions }) {
  const [openFactor, setOpenFactor] = useState('keywordMatch');

  return (
    <div className="animate-in">
      <div className="factors-section">
        <div className="factors-heading">Scoring Factors Breakdown</div>
        {Object.entries(factors).map(([key, f]) => (
          <FactorItem
            key={key}
            factorKey={key}
            label={f.label}
            score={f.score}
            weight={f.weight}
            icon={f.icon}
            detail={f.detail}
            isOpen={openFactor === key}
            onToggle={() => setOpenFactor(openFactor === key ? null : key)}
          />
        ))}
      </div>

      <div className="suggestions-section">
        <div className="suggestions-heading">Action Plan</div>
        {suggestions.map((s, i) => (
          <div key={i} className={`suggestion-card ${s.priority}`}>
            <div className="suggestion-badge">{s.icon}</div>
            <div>
              <div className="suggestion-title">{s.title}</div>
              <div className="suggestion-detail">{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
