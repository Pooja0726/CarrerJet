import React from 'react';
import ResumeUpload from '../components/ResumeUpload';

export default function Home({ onAnalyze, isLoading, prefilledTitle, prefilledDesc }) {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content animate-in">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Live ATS Scanner + Job Board
          </div>
          <h1>
            Land More Interviews with<br />
            <span className="gradient-text">ATS-Optimized Resumes</span>
          </h1>
          <p className="hero-desc">
            Upload your resume and get an instant ATS compatibility score. Discover exactly what keywords and skills are missing — then find and apply to matching jobs directly.
          </p>
          <div className="hero-actions">
            <a href="#upload-section" className="btn btn-primary">
              Scan My Resume
            </a>
            <button className="btn btn-ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              How It Works
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">78–85%</div>
              <div className="hero-stat-label">ATS Model Accuracy</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">7</div>
              <div className="hero-stat-label">Scoring Factors</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">500+</div>
              <div className="hero-stat-label">Live Job Listings</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">100%</div>
              <div className="hero-stat-label">Private & Local</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload */}
      <ResumeUpload
        onAnalyze={onAnalyze}
        isLoading={isLoading}
        prefilledTitle={prefilledTitle}
        prefilledDesc={prefilledDesc}
      />

      {/* Features */}
      <section id="features" className="features-section">
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <p className="section-eyebrow">Core Capabilities</p>
            <h2 className="section-title">Built for Serious Job Seekers</h2>
            <p className="section-desc">
              Our platform combines a local NLP scoring engine with a live job crawler to give you a complete edge in your search.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-num">01</div>
              <h3>TF-IDF Keyword Scoring</h3>
              <p>Term Frequency–Inverse Document Frequency analysis identifies which keywords matter most for your target role and checks your resume against them.</p>
            </div>
            <div className="feature-card">
              <div className="feature-num">02</div>
              <h3>Layout & Structure Check</h3>
              <p>Detects multi-column tables, graphics, and missing section headings that cause ATS parsers to misread or skip your content entirely.</p>
            </div>
            <div className="feature-card">
              <div className="feature-num">03</div>
              <h3>Achievement Quantifier</h3>
              <p>Checks that your bullet points include numbers, percentages, and measurable impact — the language ATS and recruiters look for.</p>
            </div>
            <div className="feature-card">
              <div className="feature-num">04</div>
              <h3>Live Job Crawler</h3>
              <p>Searches live job listings in real-time and provides direct apply links to company career pages — no aggregator middle-men.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-text">ATS CareerJet — Built with Local NLP + RapidAPI JSearch</div>
        <div className="footer-text" style={{ marginTop: 4 }}>Model accuracy: 78–85% alignment with Workday, Taleo, and Greenhouse ATS systems</div>
      </footer>
    </div>
  );
}
