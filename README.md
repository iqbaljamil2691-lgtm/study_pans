# StudyPulse LMS — Document-Driven AI Learning & Exam Platform

> **Final Project Submission — AI App Engineering**

---

## 🔗 Live Links & Repository

* **🚀 Live Deployed App**: [https://study-pans.vercel.app/](https://study-pans.vercel.app/)
* **📦 Public GitHub Repository**: [https://github.com/iqbaljamil2691-lgtm/study_pans](https://github.com/iqbaljamil2691-lgtm/study_pans)

---

## 📌 Problem Statement & Solution

### The Real Problem
Students today face immense cognitive overload when preparing for exams. Course materials are scattered across unstructured **PDF syllabi, DOCX lecture notes, multi-slide PPTX presentations, and raw TXT past quizzes**. Reading hundreds of pages passively leads to low retention, poor exam confidence, and ineffective cramming.

### The Solution: StudyPulse LMS
**StudyPulse LMS** is an end-to-end, document-driven learning and diagnostic exam platform designed for students, self-learners, and educators. Instead of generic AI responses, StudyPulse parses real text paragraphs, formulas, definitions, and slide nodes from student-uploaded files to generate:
1. **Week-by-Week Structured Study Roadmaps** with estimated topic study hours and high-yield exam alerts.
2. **Diagnostic Exam Simulators** with multiple-choice questions derived 100% strictly from uploaded materials.
3. **Interactive 3D Concept Flashcards** with flip animations and confidence tagging.
4. **Grounded AI Study Tutor** conversing naturally like a personal study partner.
5. **Dedicated Admin Console** for system analytics and platform user management.

---

## 🌟 Comprehensive Features List

### 🎓 Student Learning Portal
* **Multi-Format Batch Document Parser**: Drag-and-drop or select multiple `.pdf`, `.docx`, `.pptx` (XML slide layer reader), and `.txt` course files simultaneously.
* **Content-Aware AI Study Plan**: Week-by-week study roadmap with estimated study hours, core concepts, learning objectives, exam alerts, checklist progress tracking, **Mark as Done** celebration, and **PDF Export**.
* **Diagnostic Exam Simulator**: 4-option multiple-choice quizzes derived strictly from uploaded document facts, complete with score breakdown, confetti celebrations, and step-by-step AI answer explanations.
* **Interactive 3D Flashcards**: Flip-card digital flashcard deck with 3D CSS animations, category badges, and confidence tagging (🔴 Hard, 🟡 Good, 🟢 Mastered).
* **Conversational AI Study Tutor**: Human-like AI study companion (powered by Gemini) that answers questions conversationally with or without uploaded files.
* **Focus Pomodoro Timer**: 25-minute study sprints and 5-minute break timers with automated audio/confetti alerts and daily streak statistics.
* **Student Profile**: Real-time student statistics displaying active plan status, total parsed word count, and uploaded document counts.

### 🛡️ Dedicated Admin Executive Console
* **Strict Role Isolation**: Anyone logging in as Admin sees **ONLY** the Admin Executive Console.
* **Designated Admin Account**: `admin@gmail.com` with password `admin123`.
* **Platform Analytics**: Live count of registered student accounts, files processed, active AI study plans, and parsed word volume.
* **Registered User Directory**: Searchable directory listing all registered platform accounts with email, role, and registration date.
* **System Audit Trail Logs**: Timestamped audit logs for database security checks, user registrations, and document parsing events.

---

## 🤖 AI Features & System Prompts

StudyPulse LMS uses **Google Gemini 1.5 Flash** (`@google/genai`) to power four core content-aware engines. Below are the actual system instructions driving these features:

### 1. AI Study Plan System Prompt
```text
You are StudyPulse AI, an expert Educational Architect.
Your task is to analyze the student's uploaded course documents (syllabi, lecture slides, notes, past quizzes) and generate a 4 to 6 week study plan derived STRICTLY from the topics, concepts, and text in the uploaded files.

OUTPUT INSTRUCTIONS:
Respond strictly with a valid JSON object matching this schema. Do not include markdown code block backticks.
{
  "title": "Title of the Study Plan based on uploaded file",
  "topic": "Main Subject Area from Uploaded Files",
  "summary": "Detailed summary derived strictly from uploaded document content",
  "totalEstimatedHours": 24,
  "highYieldTips": ["Tip 1 from uploaded files", "Tip 2 from uploaded files", "Tip 3"],
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week 1: Topic Name from Uploaded File",
      "estimatedHours": 6,
      "summary": "Summary of week topics from file",
      "learningObjectives": ["Objective 1 from file content", "Objective 2"],
      "keyConcepts": ["Concept A from file", "Concept B"],
      "examAlert": "Important exam focus area from notes",
      "actionItems": ["Study uploaded material section 1", "Review key terms"]
    }
  ]
}
```

### 2. Diagnostic Exam Simulator System Prompt
```text
You are StudyPulse AI Exam Simulator.
Analyze the provided course text from the uploaded files and generate 4 high-quality quiz questions derived STRICTLY from the facts and concepts in the student's uploaded files.

OUTPUT INSTRUCTIONS:
Respond strictly with a valid JSON array of objects. Do not include markdown backticks.
[
  {
    "id": 1,
    "question": "Question derived directly from student's file content?",
    "options": ["Correct answer from file", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Detailed explanation citing the exact concept from the student's uploaded material."
  }
]
```

### 3. Interactive 3D Flashcards System Prompt
```text
You are StudyPulse AI. Extract 6 key term and concept flashcards directly from the student's uploaded file text.
Make sure the 'front' contains the exact term, question, or concept title from the uploaded file text, and 'back' contains the complete definition or explanation from the file text.

OUTPUT INSTRUCTIONS:
Respond strictly with a valid JSON array of objects:
[
  {
    "id": 1,
    "front": "Term or Concept Title directly from Document Text",
    "back": "Exact Definition or Explanation from Document Text",
    "category": "File Name or Subject Category"
  }
]
```

### 4. Conversational AI Study Tutor System Prompt
```text
You are StudyPulse AI Companion & Tutor, a warm, intelligent, empathetic AI study buddy (just like Gemini).
Talk to the student naturally and conversationally about ANYTHING they ask. You do NOT require course materials to chat.
If they say hi, ask casual questions, or ask for explanations, advice, math help, or study tips, answer directly and conversationally as an AI companion.
```

---

## 🛠️ Tech Stack, Tools & Services

* **Frontend**: React 19, Vite 8, Tailwind CSS, Lucide React Icons, Outfit & Inter Google Fonts.
* **AI Model & SDK**: Google Gemini 1.5 Flash (`@google/genai` & Direct REST Endpoint).
* **Backend Database & Storage**: Supabase (PostgreSQL, Supabase Auth, Row-Level Security, Database Triggers).
* **Document Parsing Engine**:
  * `.pdf`: `pdfjs-dist` (Text layer extraction)
  * `.docx`: `mammoth` (Raw text extraction)
  * `.pptx`: `jszip` (Slide XML text node extraction `<a:t>`)
  * `.txt`: Plaintext reader
* **PDF Export & Effects**: `jspdf` & `canvas-confetti`.
* **Deployment & Hosting**: Vercel.

---


## ⚡ How to Run the Project Locally

### Prerequisites
* Node.js v18+ installed on your computer.
* Git installed.

### Step 1: Clone the Repository
```bash
git clone https://github.com/iqbaljamil2691-lgtm/study_pans.git
cd study_pans
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=https://wwoxkpovwynwcchaoekj.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Step 5: Test Credentials
* **Admin Login**: `admin@gmail.com` with password `admin123`
* **Student Registration**: Click **Register** on the auth page to create a personal student profile.

---

## 📄 Database Schema Script

The repository includes `supabase_schema.sql` to initialize PostgreSQL tables:
* `profiles` (User role, full name, avatar)
* `documents` (Uploaded file metadata, parsed text, word count)
* `study_plans` (Generated multi-week roadmaps)
* `quiz_results` (Exam scores & completion history)
* RLS policies & automatic user trigger (`handle_new_user()`).

---

## 👨‍💻 License & Author
* Built for **Final AI Application Project Assessment**.
* Live Application: [https://study-pans.vercel.app/](https://study-pans.vercel.app/)
