import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Award, 
  Coffee,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PomodoroTimer() {
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'work') {
        setCompletedSessions(prev => prev + 1);
        setMode('break');
        setTimeLeft(5 * 60);
        confetti({ particleCount: 50, spread: 60 });
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.round(((totalTime - timeLeft) / totalTime) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Timer Container Card */}
      <div className="p-8 md:p-12 glass-card bg-white rounded-3xl border border-stone-300 text-center relative overflow-hidden shadow-xl">
        
        {/* Mode Switcher */}
        <div className="inline-flex p-1.5 rounded-2xl bg-stone-100 border border-stone-300 mb-8">
          <button
            onClick={() => switchMode('work')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
              mode === 'work'
                ? 'woody-gradient text-white shadow-md'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Brain className="w-4 h-4 text-white" />
            <span className="text-white font-bold">Deep Work (25m)</span>
          </button>

          <button
            onClick={() => switchMode('break')}
            className={`flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
              mode === 'break'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Coffee className="w-4 h-4 text-white" />
            <span className="text-white font-bold">Short Break (5m)</span>
          </button>
        </div>

        {/* Big Digital Clock Display */}
        <div className="relative my-4">
          <div className="text-6xl md:text-8xl font-mono font-extrabold text-stone-900 tracking-widest gradient-text">
            {formatTime(timeLeft)}
          </div>
          <p className="text-xs text-stone-600 font-bold uppercase tracking-widest mt-2">
            {mode === 'work' ? '🔥 Focus Sprint Active' : '☕ Relax & Recharge'}
          </p>
        </div>

        {/* Circular / Progress Line */}
        <div className="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden my-6 border border-stone-300">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              mode === 'work' ? 'woody-gradient' : 'bg-emerald-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-stone-100 border border-stone-300 text-stone-800 hover:bg-stone-200 transition font-bold"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5 text-stone-800" />
          </button>

          <button
            onClick={toggleTimer}
            className={`flex items-center space-x-2 px-8 py-4 rounded-2xl font-display font-extrabold text-sm shadow-xl transition transform active:scale-95 text-white ${
              isRunning
                ? 'bg-amber-800 hover:bg-amber-900 text-white'
                : 'woody-gradient text-white'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5 text-white fill-current" /> : <Play className="w-5 h-5 text-white fill-current ml-0.5" />}
            <span className="text-white font-extrabold">{isRunning ? 'PAUSE TIMER' : 'START FOCUS'}</span>
          </button>
        </div>
      </div>

      {/* Completed Sessions Stats Card */}
      <div className="p-5 glass-card bg-white rounded-2xl border border-stone-300 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 font-display">Daily Study Streak</h4>
            <p className="text-[11px] text-stone-600 font-medium">Completed Focus Pomodoro Sprints</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xl font-display font-black text-amber-900">
            {completedSessions} {completedSessions === 1 ? 'Sprint' : 'Sprints'}
          </span>
          <p className="text-[10px] text-stone-500 font-mono font-bold">
            {completedSessions * 25} total mins focused
          </p>
        </div>
      </div>
    </div>
  );
}
