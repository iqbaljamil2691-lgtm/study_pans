import React, { useState } from 'react';
import { 
  Sparkles, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import { loginUser, registerUser } from '../lib/auth';

export default function LandingAuthScreen({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    let result;
    if (isRegister) {
      result = await registerUser(email, password, fullName);
    } else {
      result = await loginUser(email, password);
    }

    setLoading(false);
    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-stone-800 flex flex-col justify-between font-sans selection:bg-amber-800 selection:text-white relative overflow-hidden">
      {/* Background Lighting Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-400/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 md:px-12 flex items-center justify-between border-b border-stone-200/80 glass-card bg-white/70">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl woody-gradient flex items-center justify-center shadow-md shadow-amber-900/20">
            <Sparkles className="w-5.5 h-5.5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl tracking-tight text-stone-900">
              Study<span className="gradient-text">Pulse</span> LMS
            </h1>
            <p className="text-[11px] text-stone-500 font-medium">
              Document-Driven Learning Portal
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-700 border border-emerald-600/20 text-xs font-semibold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Platform Active</span>
          </span>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 my-auto">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Description */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-900/10 border border-amber-900/20 text-amber-800 text-xs font-semibold">
              <GraduationCap className="w-4 h-4 text-amber-800" />
              <span>Student & Admin Learning Portal</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-black text-stone-900 tracking-tight leading-tight">
              Sign In to Your <span className="gradient-text">Learning Portal</span>
            </h2>

            <p className="text-xs md:text-sm text-stone-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Upload course syllabi, lecture slides, notes, or past quizzes in <strong className="text-stone-900">PDF, DOCX, PPTX, or TXT</strong> format. AI parses your course files to generate personalized study roadmaps and practice exams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-700 text-left">
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/80 border border-stone-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Multi-Week AI Study Plans</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/80 border border-stone-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Diagnostic Exam Simulator</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/80 border border-stone-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Interactive 3D Flashcards</span>
              </div>
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white/80 border border-stone-200 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Context-Grounded AI Tutor</span>
              </div>
            </div>
          </div>

          {/* Right Auth Card */}
          <div className="lg:col-span-5 glass-card p-6 md:p-8 rounded-3xl border border-stone-300 shadow-xl space-y-6 bg-white/90">
            
            {/* Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMessage(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  !isRegister ? 'woody-gradient text-white shadow' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMessage(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  isRegister ? 'woody-gradient text-white shadow' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Register
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {isRegister && (
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-white border border-stone-300 focus:border-amber-700 rounded-xl px-4 py-2.5 text-stone-900 outline-none shadow-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-stone-700 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full bg-white border border-stone-300 focus:border-amber-700 rounded-xl px-4 py-2.5 text-stone-900 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-stone-300 focus:border-amber-700 rounded-xl px-4 py-2.5 text-stone-900 outline-none shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl woody-gradient text-white font-bold shadow-md shadow-amber-900/20 hover:opacity-95 transition flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </main>

      <footer className="p-4 text-center text-xs text-stone-500 border-t border-stone-200">
        StudyPulse LMS Platform • Production Student & Admin Portal
      </footer>
    </div>
  );
}
