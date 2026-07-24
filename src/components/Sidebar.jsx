import React from 'react';
import { 
  LayoutDashboard, 
  FileUp, 
  Calendar, 
  HelpCircle, 
  Layers, 
  MessageSquare, 
  Clock, 
  User, 
  ShieldCheck, 
  Users, 
  Activity, 
  Award,
  X
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  documentCount, 
  hasPlan, 
  currentUser,
  isMobileOpen,
  onCloseMobile
}) {
  const isAdmin = currentUser?.role === 'admin';

  // Admin Navigation
  const adminNavItems = [
    { id: 'admin', label: 'System Analytics', icon: ShieldCheck, badge: 'Overview' },
    { id: 'admin_users', label: 'User Directory', icon: Users, badge: null },
    { id: 'admin_logs', label: 'Activity Logs', icon: Activity, badge: null },
  ];

  // Student Navigation
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'documents', label: 'Upload Materials', icon: FileUp, badge: documentCount > 0 ? documentCount : null },
    { id: 'studyplan', label: 'AI Study Plan', icon: Calendar, badge: hasPlan ? 'Ready' : null },
    { id: 'quizzes', label: 'Exam Simulator', icon: HelpCircle, badge: 'AI Quiz' },
    { id: 'flashcards', label: 'Flashcard Decks', icon: Layers, badge: null },
    { id: 'tutor', label: 'AI Study Tutor', icon: MessageSquare, badge: 'Ask AI' },
    { id: 'timer', label: 'Focus Timer', icon: Clock, badge: null },
    { id: 'profile', label: 'Student Profile', icon: User, badge: null },
  ];

  const currentNavItems = isAdmin ? adminNavItems : studentNavItems;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 bg-white/70">
      <div className="space-y-6">
        {/* Mobile Header Close Button */}
        <div className="flex items-center justify-between lg:hidden pb-2 border-b border-stone-200">
          <span className="font-display font-bold text-sm text-stone-900">
            {isAdmin ? 'Admin Console' : 'Student Navigation'}
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg bg-stone-100 text-stone-600 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-stone-500 uppercase tracking-wider hidden lg:block">
            {isAdmin ? 'Admin Console' : 'Student Portal'}
          </div>

          <nav className="space-y-1">
            {currentNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${
                    isActive
                      ? isAdmin
                        ? 'bg-slate-700 text-white shadow-sm font-bold'
                        : 'woody-gradient text-white shadow-md shadow-amber-900/20 font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition ${
                      isActive ? 'text-white' : isAdmin ? 'text-stone-500 group-hover:text-slate-700' : 'text-stone-500 group-hover:text-amber-800'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : isAdmin 
                          ? 'bg-slate-200 text-slate-800 border border-slate-300' 
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Feature Card */}
      <div className={`rounded-2xl p-4 relative overflow-hidden border mt-6 ${
        isAdmin 
          ? 'bg-slate-100/90 border-slate-300' 
          : 'bg-amber-50/80 border-amber-200'
      }`}>
        {isAdmin ? (
          <div>
            <div className="flex items-center space-x-2 text-slate-800 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold font-display uppercase tracking-wider">Admin Control</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Full platform administration rights. Managing student accounts & system analytics.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-2 text-amber-900 mb-1.5">
              <Award className="w-4 h-4 text-amber-800" />
              <span className="text-xs font-bold font-display uppercase tracking-wider">Exam Prep Mode</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
              Upload syllabi, slides, or past quizzes to auto-generate exam roadmaps.
            </p>
            <button
              onClick={() => handleTabClick('documents')}
              className="w-full py-2 px-3 rounded-lg woody-gradient text-white text-xs font-semibold shadow-sm flex items-center justify-center space-x-1.5 transition"
            >
              <span>Upload New File</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 glass-card bg-white/70 border-r border-stone-200 hidden lg:flex shrink-0 min-h-[calc(100vh-65px)]">
        {SidebarContent}
      </aside>

      {/* Mobile Slide-Over Sidebar Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
          ></div>

          <div className="relative w-72 max-w-[80vw] glass-card bg-[#f7f5f0] border-r border-stone-300 h-full shadow-2xl z-10 animate-slideRight overflow-y-auto">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
