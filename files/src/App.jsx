import React, { useState, useEffect } from 'react';
import LandingAuthScreen from './components/LandingAuthScreen';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileUploader from './components/FileUploader';
import StudyPlanView from './components/StudyPlanView';
import QuizModule from './components/QuizModule';
import FlashcardsModule from './components/FlashcardsModule';
import AITutorDrawer from './components/AITutorDrawer';
import PomodoroTimer from './components/PomodoroTimer';
import StudentProfile from './components/StudentProfile';
import AdminDashboard from './components/AdminDashboard';

import { SAMPLE_DOCUMENTS } from './data/sampleDocuments';
import { getDocuments, saveStudyPlan, getStudyPlans, deleteStudyPlan } from './lib/supabase';
import { getCurrentUser, logoutUser } from './lib/auth';
import { 
  generateStudyPlanFromDocs, 
  generateQuizFromDocs, 
  generateFlashcardsFromDocs 
} from './services/gemini';

export default function App() {
  // Restore User Session on Page Refresh
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Restore Active Tab on Page Refresh
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('studypulse_active_tab');
    if (savedTab) return savedTab;
    const user = getCurrentUser();
    return user?.role === 'admin' ? 'admin' : 'dashboard';
  });

  const [documents, setDocuments] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Save active tab whenever it changes
  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('studypulse_active_tab', activeTab);
    }
  }, [activeTab]);

  // Sync session check on mount & load ONLY user's actual stored documents
  useEffect(() => {
    async function loadData() {
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }

      const storedDocs = await getDocuments();
      if (storedDocs) {
        setDocuments(storedDocs);
      } else {
        setDocuments([]);
      }

      const storedPlans = await getStudyPlans();
      if (storedPlans && storedPlans.length > 0) {
        setStudyPlan(storedPlans[0]);
      } else {
        setStudyPlan(null);
      }
    }

    loadData();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    const initialTab = user.role === 'admin' ? 'admin' : 'dashboard';
    setActiveTab(initialTab);
    localStorage.setItem('studypulse_active_tab', initialTab);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    localStorage.removeItem('studypulse_active_tab');
    setActiveTab('dashboard');
  };

  const handleGeneratePlan = async (docsToUse) => {
    const targetDocs = docsToUse || documents;
    if (!targetDocs || targetDocs.length === 0) return;

    setIsGeneratingPlan(true);
    try {
      const newPlan = await generateStudyPlanFromDocs(targetDocs);
      setStudyPlan(newPlan);
      await saveStudyPlan(newPlan);

      const newQuiz = await generateQuizFromDocs(targetDocs);
      setQuizData(newQuiz);

      const newFlash = await generateFlashcardsFromDocs(targetDocs);
      setFlashcards(newFlash);
    } catch (err) {
      console.error('Plan generation failed:', err);
    }
    setIsGeneratingPlan(false);
  };

  const handleDeletePlan = async () => {
    await deleteStudyPlan();
    setStudyPlan(null);
    setQuizData([]);
    setFlashcards([]);
  };

  const handleSelectSampleDocs = () => {
    setDocuments(SAMPLE_DOCUMENTS);
    handleGeneratePlan(SAMPLE_DOCUMENTS);
    setActiveTab('dashboard');
  };

  // Mandatory Auth Screen ONLY if no active user session exists
  if (!currentUser) {
    return <LandingAuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Strict Role Check
  const isStudent = currentUser.role === 'student';
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-stone-800 flex flex-col font-sans selection:bg-amber-800 selection:text-white">
      {/* Responsive LMS Navigation Header */}
      <Navbar 
        currentUser={currentUser}
        onLogout={handleLogout}
        documentCount={documents.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Dedicated Responsive Role-Based Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          documentCount={documents.length}
          hasPlan={Boolean(studyPlan)}
          currentUser={currentUser}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content View Container */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* STUDENT ONLY VIEWS */}
          {isStudent && activeTab === 'dashboard' && (
            <Dashboard 
              documents={documents}
              studyPlan={studyPlan}
              setActiveTab={setActiveTab}
              onSelectSampleDocs={handleSelectSampleDocs}
              onGeneratePlan={() => {
                handleGeneratePlan();
                setActiveTab('studyplan');
              }}
            />
          )}

          {isStudent && activeTab === 'documents' && (
            <FileUploader 
              documents={documents}
              setDocuments={setDocuments}
              onGeneratePlan={() => {
                handleGeneratePlan();
                setActiveTab('studyplan');
              }}
              onSelectSampleDocs={handleSelectSampleDocs}
            />
          )}

          {isStudent && activeTab === 'studyplan' && (
            <StudyPlanView 
              plan={studyPlan}
              onRegenerate={() => handleGeneratePlan()}
              onDeletePlan={handleDeletePlan}
              isGenerating={isGeneratingPlan}
              documents={documents}
            />
          )}

          {isStudent && activeTab === 'quizzes' && (
            <QuizModule 
              quizData={quizData}
              setQuizData={setQuizData}
              documents={documents}
              setActiveTab={setActiveTab}
            />
          )}

          {isStudent && activeTab === 'flashcards' && (
            <FlashcardsModule 
              flashcards={flashcards}
              setFlashcards={setFlashcards}
              documents={documents}
              setActiveTab={setActiveTab}
            />
          )}

          {isStudent && activeTab === 'tutor' && (
            <AITutorDrawer 
              documents={documents}
            />
          )}

          {isStudent && activeTab === 'timer' && (
            <PomodoroTimer />
          )}

          {isStudent && activeTab === 'profile' && (
            <StudentProfile 
              user={currentUser}
              onLogout={handleLogout}
              documents={documents}
              studyPlan={studyPlan}
            />
          )}

          {/* ADMIN ONLY DEDICATED VIEWS */}
          {isAdmin && (activeTab === 'admin' || activeTab === 'admin_users' || activeTab === 'admin_logs') && (
            <AdminDashboard 
              documents={documents}
              studyPlan={studyPlan}
              activeSubTab={activeTab}
            />
          )}
        </main>
      </div>
    </div>
  );
}
