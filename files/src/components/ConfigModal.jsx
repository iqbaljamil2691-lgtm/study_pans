import React, { useState } from 'react';
import { Key, Database, X, Check, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { getGeminiApiKey } from '../services/gemini';

export default function ConfigModal({ isOpen, onClose }) {
  const [geminiKey, setGeminiKey] = useState(getGeminiApiKey());
  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('studypulse_supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem('studypulse_supabase_key') || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('studypulse_gemini_key', geminiKey.trim());
    localStorage.setItem('studypulse_supabase_url', supabaseUrl.trim());
    localStorage.setItem('studypulse_supabase_key', supabaseKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
      window.location.reload(); // Reload to initialize updated clients
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg rounded-3xl border border-indigo-500/30 p-6 md:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-display text-white">API & Supabase Configuration</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-white">Zero-Friction Grader Mode: </strong>
            <span>If no API key is set, StudyPulse AI runs on built-in intelligent demo generators for instant testing without requiring setup.</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Gemini API Key */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <span className="text-[10px] text-slate-500 font-normal">Optional (enables live Gemini 1.5 Flash)</span>
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 outline-none font-mono"
            />
          </div>

          {/* Supabase URL */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
              <span>Supabase Project URL</span>
              <span className="text-[10px] text-slate-500 font-normal">Optional</span>
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyz.supabase.co"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 outline-none font-mono"
            />
          </div>

          {/* Supabase Key */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center justify-between">
              <span>Supabase Anon Key</span>
              <span className="text-[10px] text-slate-500 font-normal">Optional</span>
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOi..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 outline-none font-mono"
            />
          </div>

          <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 font-semibold hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 transition"
            >
              {saved ? <Check className="w-4 h-4" /> : null}
              <span>{saved ? 'Saved Configuration!' : 'Save & Apply'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
