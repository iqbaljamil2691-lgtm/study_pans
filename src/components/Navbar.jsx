import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  LogOut, 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  Clock, 
  ChevronDown,
  Users,
  Activity,
  Menu,
  X,
  Calendar,
  HelpCircle,
  Layers,
  MessageSquare
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  onLogout, 
  documentCount, 
  activeTab, 
  setActiveTab,
  onToggleMobileSidebar
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin';

  const handleMobileNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-card bg-white/90 border-b border-stone-200 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Sidebar Toggle + Brand Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-stone-100 border border-stone-300 text-stone-800 hover:bg-stone-200"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5 text-stone-800" />
        </button>

        {/* Brand & Logo */}
        <div 
          className="flex items-center space-x-2.5 cursor-pointer" 
          onClick={() => setActiveTab(isAdmin ? 'admin' : 'dashboard')}
        >
          <div className={`relative flex items-center justify-center w-9 h-9 rounded-xl shadow-md ${
            isAdmin 
              ? 'bg-slate-700 text-white' 
              : 'woody-gradient text-white shadow-amber-900/20'
          }`}>
            {isAdmin ? <ShieldCheck className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white animate-pulse" />}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-display font-bold text-lg tracking-tight text-stone-900">
                Study<span className={isAdmin ? 'gradient-silver' : 'gradient-text'}>Pulse</span>
              </h1>
              <span className={`px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase rounded-full ${
                isAdmin 
                  ? 'bg-slate-200 text-slate-800 border border-slate-300' 
                  : 'bg-amber-100 text-amber-900 border border-amber-200'
              }`}>
                {isAdmin ? 'Admin' : 'LMS'}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-medium hidden sm:block">
              {isAdmin ? 'Admin Console' : 'Student Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Center Nav Tabs */}
      <nav className="hidden md:flex items-center space-x-1 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
        {isAdmin ? (
          <>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'admin'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>System Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('admin_users')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'admin_users'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('admin_logs')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'admin_logs'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Activity Logs</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'dashboard'
                  ? 'woody-gradient text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition relative ${
                activeTab === 'documents'
                  ? 'woody-gradient text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Materials</span>
              {documentCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-200 text-amber-950">
                  {documentCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('timer')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'timer'
                  ? 'woody-gradient text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Focus Timer</span>
            </button>
          </>
        )}
      </nav>

      {/* Account User Profile Menu */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-stone-100 border border-stone-300 text-stone-800"
        >
          {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
        </button>

        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2.5 p-1.5 pr-2.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 shadow-sm transition"
            >
              <img
                src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.full_name || currentUser.email)}&background=${isAdmin ? '475569' : '78350f'}&color=fff`}
                alt={currentUser.full_name || currentUser.email}
                className="w-7 h-7 rounded-lg object-cover border border-stone-300"
              />
              <span className="text-xs font-bold text-stone-800 hidden sm:inline-block truncate max-w-[110px]">
                {currentUser.full_name || currentUser.email}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:block" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 glass-card bg-white rounded-2xl border border-stone-300 py-1.5 shadow-xl z-50 animate-fadeIn">
                <div className="px-3.5 py-2 border-b border-stone-200 text-xs">
                  <p className="font-bold text-stone-900 truncate">{currentUser.full_name || currentUser.email}</p>
                  <p className="text-[10px] font-medium text-stone-500">{currentUser.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                    isAdmin ? 'bg-slate-200 text-slate-900 border border-slate-300' : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}>
                    {isAdmin ? 'Platform Admin' : 'Student Account'}
                  </span>
                </div>

                {!isAdmin && (
                  <button
                    onClick={() => { setActiveTab('profile'); setDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-2 text-xs text-stone-800 hover:bg-stone-100 font-semibold flex items-center space-x-2"
                  >
                    <User className="w-3.5 h-3.5 text-amber-800" />
                    <span>Student Profile</span>
                  </button>
                )}

                <button
                  onClick={() => { onLogout(); setDropdownOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-xs text-rose-700 hover:bg-rose-50 font-semibold flex items-center space-x-2 border-t border-stone-200"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-700" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Header Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass-card bg-white border-b border-stone-300 p-4 md:hidden shadow-xl z-40 space-y-2">
          <div className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-stone-500">
            {isAdmin ? 'Admin Console Menu' : 'Student Quick Menu'}
          </div>

          {isAdmin ? (
            <>
              <button
                onClick={() => handleMobileNavClick('admin')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'admin' ? 'bg-slate-700 text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>System Analytics</span>
              </button>

              <button
                onClick={() => handleMobileNavClick('admin_users')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'admin_users' ? 'bg-slate-700 text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>User Directory</span>
              </button>

              <button
                onClick={() => handleMobileNavClick('admin_logs')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'admin_logs' ? 'bg-slate-700 text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Activity Logs</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleMobileNavClick('dashboard')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'dashboard' ? 'woody-gradient text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleMobileNavClick('documents')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'documents' ? 'woody-gradient text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <FileText className="w-4 h-4 text-amber-800" />
                <span>Upload Materials ({documentCount})</span>
              </button>

              <button
                onClick={() => handleMobileNavClick('studyplan')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'studyplan' ? 'woody-gradient text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <Calendar className="w-4 h-4 text-amber-800" />
                <span>AI Study Plan</span>
              </button>

              <button
                onClick={() => handleMobileNavClick('quizzes')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'quizzes' ? 'woody-gradient text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-800" />
                <span>Exam Simulator</span>
              </button>

              <button
                onClick={() => handleMobileNavClick('flashcards')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'flashcards' ? 'woody-gradient text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-800" />
                <span>3D Flashcards</span>
              </button>

              <button
                onClick={() => handleMobileNavClick('tutor')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'tutor' ? 'woody-gradient text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-amber-800" />
                <span>AI Study Tutor</span>
              </button>

              <button
                onClick={() => handleMobileNavClick('timer')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'timer' ? 'woody-gradient text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-800" />
                <span>Focus Timer</span>
              </button>

              <button
                onClick={() => handleMobileNavClick('profile')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  activeTab === 'profile' ? 'woody-gradient text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <User className="w-4 h-4 text-amber-800" />
                <span>Student Profile</span>
              </button>
            </>
          )}

          <div className="pt-2 border-t border-stone-200 flex justify-end">
            <button
              onClick={() => { onLogout(); setMobileMenuOpen(false); }}
              className="px-3.5 py-2 rounded-xl bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center space-x-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
