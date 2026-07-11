import React, { useState } from 'react';

export default function JobSearch({ onSearch }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [remote, setRemote] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, location, jobType, remote });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="search-row">
        <div className="search-field-wrap">
          <input
            type="text"
            className="search-field"
            placeholder="Search job title, skills, company or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="search-submit">
          Search Jobs
        </button>
      </div>

      <div className="filter-row">
        <input
          type="text"
          className="filter-select"
          style={{ width: 180, cursor: 'text' }}
          placeholder="City, State or Remote"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          className="filter-select"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">Job Type (All)</option>
          <option value="fulltime">Full Time</option>
          <option value="parttime">Part Time</option>
          <option value="contractor">Contract</option>
          <option value="intern">Internship</option>
        </select>
        <button
          type="button"
          className={`filter-toggle ${remote ? 'active' : ''}`}
          onClick={() => setRemote(!remote)}
        >
          Remote Only
        </button>
      </div>
    </form>
  );
}
