import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  FileUp, 
  Calendar, 
  HelpCircle, 
  Layers, 
  Clock, 
  ArrowRight,
  FileText,
  Zap,
  Flame,
  FileType
} from 'lucide-react';

export default function Dashboard({ 
  documents, 
  studyPlan, 
  setActiveTab, 
  onSelectSampleDocs, 
  onGeneratePlan 
}) {
  const hasDocs = documents && documents.length > 0;
  const totalWords = documents.reduce((acc, d) => acc + (d.wordCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="p-8 md:p-10 glass-card bg-white rounded-3xl border border-amber-900/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-900/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-950 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-800" />
            <span>Document-Driven Student Portal</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-stone-900 tracking-tight leading-tight">
            Turn Course Files into <span className="gradient-text">Exam Roadmaps</span>
          </h1>

          <p className="text-xs md:text-sm text-stone-600 leading-relaxed max-w-2xl font-medium">
            Upload your syllabus <span className="text-amber-900 font-bold">PDFs, DOCX notes, PPTX slides, and TXT quiz files</span>. StudyPulse LMS parses your real course text to build personalized study roadmaps and diagnostic exams.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('documents')}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl woody-gradient text-white text-xs font-bold shadow-md shadow-amber-900/20 hover:opacity-95 transition transform active:scale-95"
            >
              <FileUp className="w-4 h-4 text-white" />
              <span className="text-white font-bold">Upload Course Materials</span>
            </button>

            {hasDocs ? (
              <button
                onClick={() => { onGeneratePlan(); setActiveTab('studyplan'); }}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 text-xs font-bold hover:bg-stone-200 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-800" />
                <span className="text-stone-900 font-bold">Generate Study Plan From Files</span>
              </button>
            ) : (
              <button
                onClick={onSelectSampleDocs}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 text-xs font-bold hover:bg-stone-200 transition"
              >
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span className="text-stone-900 font-bold">Load Sample Files</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Student Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card bg-white p-5 rounded-2xl border border-stone-300 flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
            <FileText className="w-6 h-6 text-amber-900" />
          </div>
          <div>
            <span className="text-2xl font-display font-black text-stone-900">{documents.length}</span>
            <p className="text-xs text-stone-600 font-bold">Uploaded Course Files</p>
          </div>
        </div>

        <div className="glass-card bg-white p-5 rounded-2xl border border-stone-300 flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-xl bg-stone-100 text-stone-800 border border-stone-300">
            <Calendar className="w-6 h-6 text-stone-800" />
          </div>
          <div>
            <span className="text-2xl font-display font-black text-stone-900">
              {studyPlan ? `${studyPlan.weeks ? studyPlan.weeks.length : 4} Weeks` : 'Ready'}
            </span>
            <p className="text-xs text-stone-600 font-bold">Active Study Roadmap</p>
          </div>
        </div>

        <div className="glass-card bg-white p-5 rounded-2xl border border-stone-300 flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
            <BookOpen className="w-6 h-6 text-amber-900" />
          </div>
          <div>
            <span className="text-2xl font-display font-black text-stone-900">{totalWords.toLocaleString()}</span>
            <p className="text-xs text-stone-600 font-bold">Parsed Words</p>
          </div>
        </div>

        <div className="glass-card bg-white p-5 rounded-2xl border border-stone-300 flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-xl bg-stone-100 text-stone-800 border border-stone-300">
            <Flame className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <span className="text-2xl font-display font-black text-stone-900">
              {studyPlan ? `${studyPlan.totalEstimatedHours || 20} hrs` : '20 hrs'}
            </span>
            <p className="text-xs text-stone-600 font-bold">Target Study Time</p>
          </div>
        </div>
      </div>

      {/* Course Materials Preview Section */}
      <div className="glass-card bg-white p-6 rounded-2xl border border-stone-300 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-stone-900 flex items-center space-x-2">
            <FileType className="w-4.5 h-4.5 text-amber-800" />
            <span>Active Subject Files ({documents.length})</span>
          </h3>

          <button
            onClick={() => setActiveTab('documents')}
            className="text-xs text-amber-900 hover:text-amber-950 font-bold flex items-center space-x-1"
          >
            <span className="font-bold">Manage Files</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-800" />
          </button>
        </div>

        {hasDocs ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {documents.slice(0, 3).map((doc) => (
              <div key={doc.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 truncate max-w-[180px]">{doc.fileName}</span>
                  <span className="px-2 py-0.5 rounded bg-stone-200 text-[10px] text-stone-800 font-bold">{doc.type}</span>
                </div>
                <p className="text-[11px] text-stone-600 line-clamp-2 font-mono font-medium">{doc.text?.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 font-medium">No course materials uploaded yet. Upload your files to start!</p>
        )}
      </div>

      {/* Feature Grid */}
      <div>
        <h3 className="text-base font-bold font-display text-stone-900 mb-4 flex items-center space-x-2">
          <Zap className="w-4.5 h-4.5 text-amber-800" />
          <span>Core Study Modules</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Module 1: AI Study Plan */}
          <div
            onClick={() => setActiveTab(studyPlan ? 'studyplan' : 'documents')}
            className="glass-card bg-white glass-card-hover p-6 rounded-2xl border border-stone-300 cursor-pointer flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4 border border-amber-200">
                <Calendar className="w-5 h-5 text-amber-800" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 font-display mb-1">
                Week-by-Week Study Plan
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Structured multi-week curriculum, estimated topic study hours, learning objectives, and high-yield exam alerts.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-amber-900 font-bold">
              <span>{studyPlan ? 'View Roadmap' : 'Generate Roadmap'}</span>
              <ArrowRight className="w-4 h-4 text-amber-800" />
            </div>
          </div>

          {/* Module 2: AI Exam Simulator */}
          <div
            onClick={() => setActiveTab('quizzes')}
            className="glass-card bg-white glass-card-hover p-6 rounded-2xl border border-stone-300 cursor-pointer flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-4 border border-emerald-200">
                <HelpCircle className="w-5 h-5 text-emerald-800" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 font-display mb-1">
                Diagnostic Exam Simulator
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                Questions generated directly from uploaded materials with step-by-step AI answer explanations.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-emerald-800 font-bold">
              <span>Start Quiz</span>
              <ArrowRight className="w-4 h-4 text-emerald-800" />
            </div>
          </div>

          {/* Module 3: Flashcard Deck */}
          <div
            onClick={() => setActiveTab('flashcards')}
            className="glass-card bg-white glass-card-hover p-6 rounded-2xl border border-stone-300 cursor-pointer flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center mb-4 border border-stone-300">
                <Layers className="w-5 h-5 text-stone-700" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 font-display mb-1">
                Interactive Flashcards
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                3D digital flashcards with flip animations, key definitions, and confidence mastery tagging.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-800 font-bold">
              <span>Practice Cards</span>
              <ArrowRight className="w-4 h-4 text-stone-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
