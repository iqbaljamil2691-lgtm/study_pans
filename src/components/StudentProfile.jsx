import React from 'react';
import { 
  BookOpen, 
  Award, 
  Clock, 
  FileText, 
  LogOut, 
  Flame,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

export default function StudentProfile({ user, onLogout, documents = [], studyPlan }) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Student Profile Card Header */}
      <div className="p-8 glass-card bg-white rounded-3xl border border-amber-900/20 shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <img
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&background=78350f&color=fff`}
              alt={user.full_name || user.email}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-800 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </span>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="text-2xl font-display font-bold text-stone-900">{user.full_name || user.email}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-200 text-[10px] font-extrabold uppercase tracking-wider">
                Student Portal
              </span>
            </div>
            <p className="text-xs text-stone-600 font-mono font-medium">{user.email}</p>
            <div className="flex items-center justify-center sm:justify-start space-x-1 text-xs text-emerald-800 font-bold pt-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Verified Active Student Profile</span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-rose-50 border border-stone-300 hover:border-rose-300 text-stone-800 hover:text-rose-800 text-xs font-bold transition"
        >
          <LogOut className="w-4 h-4 text-rose-700" />
          <span className="font-bold text-stone-900">Sign Out</span>
        </button>
      </div>

      {/* Real Student Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card bg-white p-5 rounded-2xl border border-stone-300 flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
            <FileText className="w-6 h-6 text-amber-900" />
          </div>
          <div>
            <span className="text-2xl font-display font-black text-stone-900">{documents.length}</span>
            <p className="text-xs text-stone-600 font-bold">Course Materials Uploaded</p>
          </div>
        </div>

        <div className="glass-card bg-white p-5 rounded-2xl border border-stone-300 flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-xl bg-stone-100 text-stone-800 border border-stone-300">
            <Clock className="w-6 h-6 text-stone-800" />
          </div>
          <div>
            <span className="text-2xl font-display font-black text-stone-900">
              {studyPlan ? `${studyPlan.totalEstimatedHours || 20} hrs` : '0 hrs'}
            </span>
            <p className="text-xs text-stone-600 font-bold">Target Study Time</p>
          </div>
        </div>

        <div className="glass-card bg-white p-5 rounded-2xl border border-stone-300 flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
            <Flame className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <span className="text-2xl font-display font-black text-stone-900">
              {studyPlan ? 'Active' : 'Standby'}
            </span>
            <p className="text-xs text-stone-600 font-bold">Plan Status</p>
          </div>
        </div>

        <div className="glass-card bg-white p-5 rounded-2xl border border-stone-300 flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200">
            <Award className="w-6 h-6 text-emerald-800" />
          </div>
          <div>
            <span className="text-2xl font-display font-black text-stone-900">Ready</span>
            <p className="text-xs text-stone-600 font-bold">Exam Simulator</p>
          </div>
        </div>
      </div>

      {/* Real Saved Materials & Study Plan */}
      <div className="glass-card bg-white p-6 rounded-2xl border border-stone-300 space-y-4 shadow-xs">
        <h3 className="text-base font-bold font-display text-stone-900 flex items-center space-x-2">
          <BookOpen className="w-4.5 h-4.5 text-amber-800" />
          <span>Active Learning Materials & Plan</span>
        </h3>

        {studyPlan ? (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-300 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900">{studyPlan.title}</h4>
              <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-200 text-[11px] font-bold">
                {studyPlan.weeks ? studyPlan.weeks.length : 4} Weeks Roadmap
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium">{studyPlan.summary}</p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 font-medium">
            No study plan generated yet. Upload course materials to create your first personalized roadmap.
          </div>
        )}
      </div>
    </div>
  );
}
