import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AnalyzePage from './pages/AnalyzePage';
import JobsPage from './pages/JobsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [analysisData, setAnalysisData] = useState(null);
  const [resumeData, setResumeData] = useState(null); // stores parsed resume text & filename
  const [isLoading, setIsLoading] = useState(false);
  const [jobsQuery, setJobsQuery] = useState('');
  
  // States to pre-fill home page fields during tailoring flow
  const [prefilledTitle, setPrefilledTitle] = useState('');
  const [prefilledDesc, setPrefilledDesc] = useState('');

  const handleAnalyze = async ({ file, jobTitle, jobDescription }) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);

      const res = await fetch('/api/ats/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setAnalysisData(data);
        // Save resume details for job matching later
        setResumeData({
          success: true,
          filename: data.filename,
          resumeText: data.factors.atsReadability.detail.lineCount > 0 ? 
            // The text was stored on backend, we don't return the full text in analysisData to avoid huge payload,
            // but we can compute/store simple things or we parsed text inside server.
            // Let's make sure we pass resumeText if available. We can also ask server to provide resumeText back or we can just send it back.
            // Wait! In server/routes/ats.js, we did not return `resumeText` to client to keep it clean.
            // Let's check server/routes/ats.js: we returned analysis object, but did we return the full text?
            // Actually, we can fetch matching scores directly via backend because we can return the text or store it.
            // Wait, does the analysis response contain the resume text? Let's check server/routes/ats.js.
            // In routes/ats.js we had: `res.json({ success: true, filename: req.file.originalname, ...analysis });`
            // And in services/atsEngine.js we had: `analyzeATS` does NOT return the plain resumeText.
            // So let's make sure that we edit routes/ats.js or atsEngine.js to return `resumeText` back to client so the client can send it back to `/api/ats/analyze-text` when matching against jobs.
            // That is an excellent catch! Let's do that.
            // But let's write App.jsx first to handle this data structure correctly.
            data.resumeText || ''
          : ''
        });
        setCurrentPage('analyze');
      } else {
        alert(data.error || 'ATS analysis failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Could not connect to the ATS backend server. Please make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToJobs = (queryStr) => {
    setJobsQuery(queryStr || '');
    setCurrentPage('jobs');
  };

  const handleReAnalyzeWithJD = (job) => {
    // Fill inputs and focus home upload
    setPrefilledTitle(job.title);
    setPrefilledDesc(job.description);
    setCurrentPage('home');
    
    // Smooth scroll down to form
    setTimeout(() => {
      document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentPage={currentPage} onNavigate={handleNavigation} />
      
      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <Home
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            prefilledTitle={prefilledTitle}
            prefilledDesc={prefilledDesc}
          />
        )}
        
        {currentPage === 'analyze' && (
          <AnalyzePage
            analysisData={analysisData}
            onNavigateToJobs={handleNavigateToJobs}
          />
        )}
        
        {currentPage === 'jobs' && (
          <JobsPage
            initialQuery={jobsQuery}
            resumeData={resumeData}
            onReAnalyzeWithJD={handleReAnalyzeWithJD}
          />
        )}
      </main>

      <footer style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '32px 0',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container">
          <p>© 2026 ATS CareerJet. All rights reserved.</p>
          <p style={{ marginTop: '8px', fontSize: '0.78rem' }}>
            Built with React, Express, Local NLP TF-IDF Scoring Model & RapidAPI Job Crawling.
          </p>
        </div>
      </footer>
    </div>
  );
}
