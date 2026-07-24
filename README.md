# StudyPulse LMS — Document-Driven AI Learning & Exam Platform

> **Final Project Assessment — Ship Your AI App**  
> **Live Deployed LMS App**: https://[https://study-pans.vercel.app/](https://study-pans.vercel.app/)

> **Public GitHub Repository**: [https://github.com/iqbaljamil2691-lgtm/study_pans](https://github.com/iqbaljamil2691-lgtm/study_pans)

---

## 📌 Executive Summary & User Entry Flow

### Mandatory Initial Entry Flow
When any user opens **StudyPulse LMS**, the very first thing they see is a **Full-Screen Authentication Portal** (`LandingAuthScreen.jsx`).
- Users must **Sign In** or **Register** an account before accessing any dashboard or learning material.
- For instant evaluator testing, 1-Click Demo Buttons are provided:
  - 🎓 **Student Portal Login (`Alex Rivera`)** -> Immediately redirects to the **Student Learning Dashboard**. Students see zero admin links or tools anywhere on the website.
  - 🛡️ **Admin Control Login (`Dr. Sarah Vance`)** -> Immediately redirects to the **Executive Admin Dashboard** showing aggregate platform statistics, registered student list, and platform audit logs.

---

## 👥 Strict Role-Based Ecosystem

### 1. Student Portal Experience
- **Authentication Gateway**: Required on initial site visit.
- **Strict Isolation**: Students see ONLY student features (Course Materials, AI Study Plan, Diagnostic Exam Simulator, 3D Flashcards, AI Tutor, Focus Timer, Student Profile). No admin tabs, metrics, or technical database badges are visible.
- **Dynamic Personal Data**: Personal study statistics, study streak, personal course files, and quiz performance.

### 2. Admin Platform Control
- **Executive System Overview**: Monitor total registered students (142), total course files processed (385), AI study plans generated (210), and average quiz pass rates (84%).
- **Student User Directory**: Search student accounts, check active plan status, view role permissions (`student` vs `admin`), and inspect joined dates.

---

## 📸 Screenshots in Action

### 1. Mandatory Initial Authentication Portal
![Auth Landing Portal](screenshots/00_auth_landing_page.png)

### 2. Student LMS Dashboard & Course Material Hub
![Student Dashboard](screenshots/01_dashboard_upload.png)

### 3. Multi-Week AI Study Plan & Exam Roadmap
![AI Study Plan](screenshots/02_ai_study_plan.png)

### 4. Diagnostic Exam Simulator & AI Tutor Chat
![Quiz Simulator & AI Tutor](screenshots/03_quiz_and_tutor.png)

### 5. Admin Platform Control Dashboard
![Admin Dashboard](screenshots/04_admin_dashboard.png)

---

## 🗄️ Database Setup Instructions (Supabase)

A ready-to-use production SQL script is included in [supabase_schema.sql](file:///d:/New%20folder%20%284%29/supabase_schema.sql).

To apply the database schema to your Supabase project:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New Query**.
3. Copy and paste the contents of `supabase_schema.sql` into the editor.
4. Click **Run**.

---

## 🚀 How to Run Locally

```bash
# 1. Clone repository
git clone https://github.com/your-username/studypulse-ai.git
cd studypulse-ai

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

---

## 🌐 Deploying directly from GitHub to Vercel

1. **Commit and Push your project to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Complete LMS Platform release with Auth Portal"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/studypulse-ai.git
   git push -u origin main
   ```
   > [!IMPORTANT]
   > Make sure the repository visibility is set to **PUBLIC**.

2. **Deploy on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **Add New** -> **Project**.
   - Select your public GitHub repository `studypulse-ai`.
   - Preset: **Vite**.
   - Click **Deploy**. Vercel will automatically build and deploy your app to a live URL!
