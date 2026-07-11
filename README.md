# CareerJet - Job Search & ATS Scoring Platform

CareerJet is a complete web application designed to help job seekers optimize their resumes and find their dream jobs. The platform features a local NLP-based Applicant Tracking System (ATS) scoring engine and a live job crawler that fetches real-time job listings.

## 🚀 Features

- **ATS Resume Scanner:** Upload your resume (PDF, DOCX, TXT) and compare it against a target job description.
- **7-Factor Scoring Engine:** Evaluates your resume on Keyword Match, Section Structure, Quantifiable Achievements, Action Verbs, Skills Overlap, Education Match, and ATS Readability.
- **Actionable Feedback:** Provides specific suggestions on missing keywords, skills gaps, and formatting issues.
- **Live Job Crawler:** Searches for real-time job listings with direct application links based on your targeted role.
- **ATS Match Integration:** Instantly check your ATS score against any job found on the live job board.
- **Privacy-First:** The ATS engine is built entirely using local NLP TF-IDF logic—your resume is never stored or sent to third-party AI APIs.

## 🛠️ Technology Stack

- **Frontend:** React (Vite), CSS3 (Custom Design System, No UI Libraries)
- **Backend:** Node.js, Express.js
- **Resume Parsing:** pdf-parse, mammoth
- **Job Data API:** JSearch API (via RapidAPI)
- **Natural Language Processing:** Custom TF-IDF engine, stopword filtering, and heuristic-based keyword extraction.

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pooja0726/CarrerJet.git
   cd CarrerJet
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add your RapidAPI Key:
   ```env
   RAPIDAPI_KEY=your_jsearch_rapidapi_key
   PORT=5000
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```
   Start the frontend server:
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open your browser and navigate to `http://localhost:5173`.

## 🧠 How the ATS Scoring Works

The backend utilizes a custom TF-IDF (Term Frequency - Inverse Document Frequency) algorithm. It extracts keywords from both the job description and the uploaded resume, removes common stop words, and compares the sets to calculate a weighted similarity score. It also uses Regex heuristic rules to identify quantifiable data (numbers/percentages), action verbs, and standard resume section headers (Experience, Education, etc.).

## 📝 License

This project is licensed under the MIT License.
