const axios = require('axios');

// Mock job data for when API key isn't set
const MOCK_JOBS = [
  {
    id: 'mock-1',
    title: 'Senior Frontend Developer',
    company: 'Google',
    location: 'Mountain View, CA (Remote)',
    salary: '$130,000 - $180,000/yr',
    type: 'Full-time',
    posted: '2 days ago',
    description: 'We are looking for a Senior Frontend Developer with expertise in React, TypeScript, and modern web technologies. You will design and implement scalable UI components, collaborate with cross-functional teams, and optimize application performance. Requirements: 5+ years of experience with React, TypeScript, HTML, CSS, JavaScript. Experience with Node.js, GraphQL, CI/CD pipelines. Strong problem-solving skills and attention to detail.',
    applyUrl: 'https://careers.google.com',
    logo: 'https://logo.clearbit.com/google.com',
    skills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'GraphQL', 'CSS'],
    source: 'Google Careers'
  },
  {
    id: 'mock-2',
    title: 'Full Stack Engineer',
    company: 'Microsoft',
    location: 'Seattle, WA (Hybrid)',
    salary: '$120,000 - $160,000/yr',
    type: 'Full-time',
    posted: '1 day ago',
    description: 'Join Microsoft\'s Azure team as a Full Stack Engineer. Build cloud-native applications using React, Node.js, and Azure services. Requirements: Strong proficiency in JavaScript, TypeScript, React, Node.js. Experience with Azure, Docker, Kubernetes. Knowledge of SQL and NoSQL databases. Agile/Scrum methodology experience.',
    applyUrl: 'https://careers.microsoft.com',
    logo: 'https://logo.clearbit.com/microsoft.com',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Azure', 'Docker', 'Kubernetes'],
    source: 'Microsoft Careers'
  },
  {
    id: 'mock-3',
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$150,000 - $200,000/yr',
    type: 'Full-time',
    posted: '3 days ago',
    description: 'Netflix is hiring a Data Scientist to join our personalization team. Use machine learning to improve content recommendations for 260M+ subscribers. Requirements: PhD or Master\'s in Computer Science, Statistics, or related field. 3+ years of experience with Python, TensorFlow, PyTorch, Pandas, SQL. Experience with A/B testing and statistical analysis.',
    applyUrl: 'https://jobs.netflix.com',
    logo: 'https://logo.clearbit.com/netflix.com',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Pandas'],
    source: 'Netflix Jobs'
  },
  {
    id: 'mock-4',
    title: 'Backend Engineer (Python)',
    company: 'Stripe',
    location: 'Remote',
    salary: '$140,000 - $190,000/yr',
    type: 'Full-time',
    posted: '5 days ago',
    description: 'Build the financial infrastructure of the internet at Stripe. You\'ll design and implement APIs processing millions of transactions. Requirements: Strong Python skills, 4+ years backend experience. Experience with distributed systems, PostgreSQL, Redis. Understanding of financial systems preferred. Knowledge of REST APIs and microservices.',
    applyUrl: 'https://stripe.com/jobs',
    logo: 'https://logo.clearbit.com/stripe.com',
    skills: ['Python', 'PostgreSQL', 'Redis', 'REST API', 'Distributed Systems'],
    source: 'Stripe Jobs'
  },
  {
    id: 'mock-5',
    title: 'DevOps / Platform Engineer',
    company: 'Spotify',
    location: 'New York, NY (Hybrid)',
    salary: '$110,000 - $155,000/yr',
    type: 'Full-time',
    posted: '1 week ago',
    description: 'Spotify is looking for a DevOps Engineer to help scale our infrastructure. You\'ll work with Kubernetes, Terraform, and GCP to enable 100M+ daily active users. Requirements: 3+ years DevOps/SRE experience. Proficiency in Kubernetes, Docker, Terraform, GCP or AWS. Strong scripting skills (Python, Bash). CI/CD pipeline experience (Jenkins, GitHub Actions).',
    applyUrl: 'https://www.lifeatspotify.com/jobs',
    logo: 'https://logo.clearbit.com/spotify.com',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'GCP', 'Python', 'Bash', 'CI/CD'],
    source: 'Spotify Jobs'
  },
  {
    id: 'mock-6',
    title: 'UX/UI Designer',
    company: 'Airbnb',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$100,000 - $145,000/yr',
    type: 'Full-time',
    posted: '4 days ago',
    description: 'Design world-class experiences for millions of hosts and guests at Airbnb. You\'ll lead end-to-end product design from research to launch. Requirements: 5+ years of UX/UI design experience. Proficiency in Figma, user research, prototyping. Strong portfolio showcasing mobile and web design. Ability to collaborate with product, engineering teams.',
    applyUrl: 'https://careers.airbnb.com',
    logo: 'https://logo.clearbit.com/airbnb.com',
    skills: ['Figma', 'UX Research', 'Prototyping', 'UI Design', 'Mobile Design'],
    source: 'Airbnb Careers'
  },
  {
    id: 'mock-7',
    title: 'Machine Learning Engineer',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    salary: '$200,000 - $300,000/yr',
    type: 'Full-time',
    posted: '2 days ago',
    description: 'OpenAI is hiring ML Engineers to work on frontier AI systems. You\'ll train and deploy large-scale language models. Requirements: Strong ML fundamentals, experience with PyTorch, Python. Experience with large-scale distributed training. Knowledge of transformer architectures. PhD preferred but not required.',
    applyUrl: 'https://openai.com/careers',
    logo: 'https://logo.clearbit.com/openai.com',
    skills: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Transformers'],
    source: 'OpenAI Careers'
  },
  {
    id: 'mock-8',
    title: 'Product Manager',
    company: 'Meta',
    location: 'Menlo Park, CA (Hybrid)',
    salary: '$160,000 - $230,000/yr',
    type: 'Full-time',
    posted: '6 days ago',
    description: 'Lead product strategy for Meta\'s social platforms. Define roadmaps, work with engineering and design, and drive metrics for billions of users. Requirements: 4+ years of PM experience. Strong analytical and communication skills. Experience with A/B testing, data analysis. Technical background preferred. MBA or equivalent experience.',
    applyUrl: 'https://www.metacareers.com',
    logo: 'https://logo.clearbit.com/meta.com',
    skills: ['Product Strategy', 'A/B Testing', 'Data Analysis', 'Roadmapping', 'Agile'],
    source: 'Meta Careers'
  }
];

/**
 * Search jobs via JSearch API (RapidAPI) or fall back to mock data
 */
async function searchJobs({ query = '', location = '', jobType = '', remote = false, page = 1 }) {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey || apiKey === 'your_rapidapi_key_here') {
    // Return filtered mock data
    return filterMockJobs({ query, location, jobType, remote, page });
  }

  try {
    const params = {
      query: query || 'software engineer',
      page: page.toString(),
      num_pages: '1',
      date_posted: 'week',
    };

    if (location) params.location = location;
    if (remote) params.remote_jobs_only = 'true';
    if (jobType) params.employment_types = jobType.toUpperCase();

    const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
      params,
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      timeout: 8000
    });

    const jobs = (response.data.data || []).map(job => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city
        ? `${job.job_city}, ${job.job_state || job.job_country}`
        : (job.job_is_remote ? 'Remote' : job.job_country),
      salary: formatSalary(job),
      type: formatJobType(job.job_employment_type),
      posted: formatPostedDate(job.job_posted_at_datetime_utc),
      description: (job.job_description || '').substring(0, 800),
      applyUrl: job.job_apply_link || job.job_google_link || '#',
      logo: job.employer_logo || `https://logo.clearbit.com/${(job.employer_website || '').replace(/https?:\/\//, '')}`,
      skills: extractSkillsFromDescription(job.job_description || ''),
      source: job.job_publisher || 'JSearch',
      highlights: job.job_highlights || {}
    }));

    return {
      jobs,
      total: response.data.parameters?.num_pages * 10 || jobs.length,
      page,
      source: 'live',
      query: params.query
    };
  } catch (err) {
    console.error('JSearch API error:', err.message);
    // Fallback to mock on API failure
    return filterMockJobs({ query, location, jobType, remote, page });
  }
}

function filterMockJobs({ query, location, jobType, remote, page }) {
  let results = [...MOCK_JOBS];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      j.skills.some(s => s.toLowerCase().includes(q))
    );
  }

  if (location) {
    const loc = location.toLowerCase();
    results = results.filter(j => j.location.toLowerCase().includes(loc));
  }

  if (remote) {
    results = results.filter(j => j.location.toLowerCase().includes('remote'));
  }

  return {
    jobs: results,
    total: results.length,
    page,
    source: 'mock',
    query: query || 'all jobs',
    note: 'Using demo data. Add your RapidAPI key to .env for live job listings.'
  };
}

function formatSalary(job) {
  if (job.job_min_salary && job.job_max_salary) {
    const currency = job.job_salary_currency || '$';
    const period = job.job_salary_period === 'YEAR' ? '/yr' : '/hr';
    return `${currency}${Math.round(job.job_min_salary / 1000)}k - ${currency}${Math.round(job.job_max_salary / 1000)}k${period}`;
  }
  return 'Salary not disclosed';
}

function formatJobType(type) {
  const map = {
    FULLTIME: 'Full-time',
    PARTTIME: 'Part-time',
    CONTRACTOR: 'Contract',
    INTERN: 'Internship'
  };
  return map[type] || type || 'Full-time';
}

function formatPostedDate(dateStr) {
  if (!dateStr) return 'Recently';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 14) return '1 week ago';
  return `${Math.floor(diff / 7)} weeks ago`;
}

function extractSkillsFromDescription(desc) {
  const TECH = [
    'JavaScript', 'Python', 'Java', 'TypeScript', 'React', 'Node.js',
    'Angular', 'Vue', 'HTML', 'CSS', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB',
    'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Linux',
    'REST', 'GraphQL', 'Express', 'Django', 'Flask', 'Spring', 'PHP', 'Ruby',
    'Swift', 'Kotlin', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas',
    'Figma', 'Jira', 'Agile', 'Scrum', 'CI/CD', 'Terraform', 'Ansible', 'Bash',
    'C++', 'C#', '.NET', 'Scala', 'Go', 'Rust', 'Spark'
  ];
  return TECH.filter(skill =>
    new RegExp(`\\b${skill.replace(/[+#.]/g, '\\$&')}\\b`, 'i').test(desc)
  ).slice(0, 8);
}

module.exports = { searchJobs };
