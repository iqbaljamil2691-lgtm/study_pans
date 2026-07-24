import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  AlertTriangle, 
  Target, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckSquare,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';

export default function StudyPlanView({ 
  plan, 
  onRegenerate, 
  onDeletePlan,
  isGenerating, 
  documents 
}) {
  const [completedItems, setCompletedItems] = useState({});
  const [copied, setCopied] = useState(false);
  const [isPlanMarkedDone, setIsPlanMarkedDone] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({ 1: true, 2: true, 3: true, 4: true });

  if (isGenerating) {
    return (
      <div className="p-12 text-center glass-card bg-white rounded-2xl border border-amber-900/30 flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-amber-800/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-amber-800 border-t-transparent animate-spin"></div>
          <Sparkles className="w-6 h-6 text-amber-800 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-stone-900 font-display">Generating AI Study Plan From Your Files</h3>
          <p className="text-xs text-stone-600 max-w-md mt-1">
            Parsing uploaded syllabus, slides, and note topics to construct week-by-week learning goals...
          </p>
        </div>
      </div>
    );
  }

  if (!plan || !plan.weeks) {
    return (
      <div className="p-12 text-center glass-card bg-white rounded-2xl border border-stone-300 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-stone-900">No Active Study Plan</h3>
        <p className="text-xs text-stone-600 max-w-sm mx-auto font-medium">
          Upload course materials to generate your customized AI study roadmap.
        </p>
        <button
          onClick={onRegenerate}
          className="px-4 py-2.5 rounded-xl woody-gradient text-white text-xs font-bold transition shadow-md shadow-amber-900/20"
        >
          Generate Study Plan Now
        </button>
      </div>
    );
  }

  const toggleItem = (key) => {
    setCompletedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleWeek = (weekNum) => {
    setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const handleMarkDoneToggle = () => {
    const nextState = !isPlanMarkedDone;
    setIsPlanMarkedDone(nextState);
    if (nextState) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(plan.title || 'StudyPulse AI - Study Plan', 14, 20);

    doc.setFontSize(11);
    doc.text(`Topic: ${plan.topic || 'General'}`, 14, 28);
    doc.text(`Total Estimated Time: ${plan.totalEstimatedHours || 20} Hours`, 14, 34);

    let y = 44;
    plan.weeks.forEach((w) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(13);
      doc.text(`Week ${w.weekNumber}: ${w.title}`, 14, y);
      y += 8;

      doc.setFontSize(10);
      w.learningObjectives.forEach((obj) => {
        doc.text(`• ${obj}`, 18, y);
        y += 6;
      });
      y += 4;
    });

    doc.save(`${(plan.title || 'study_plan').replace(/\s+/g, '_')}.pdf`);
  };

  // Copy Markdown
  const handleCopyMarkdown = () => {
    let markdown = `# ${plan.title}\n\n**Topic**: ${plan.topic}\n**Total Time**: ${plan.totalEstimatedHours} hours\n\n## Summary\n${plan.summary}\n\n`;

    if (plan.highYieldTips) {
      markdown += `### 🎯 High Yield Exam Tips\n`;
      plan.highYieldTips.forEach(tip => { markdown += `- ${tip}\n`; });
      markdown += `\n`;
    }

    plan.weeks.forEach(w => {
      markdown += `### Week ${w.weekNumber}: ${w.title}\n*Estimated Time: ${w.estimatedHours}h*\n\n${w.summary}\n\n**Objectives:**\n`;
      w.learningObjectives.forEach(obj => { markdown += `- ${obj}\n`; });
      if (w.examAlert) markdown += `\n⚠️ **Exam Alert**: ${w.examAlert}\n`;
      markdown += `\n`;
    });

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate Overall Progress
  let totalActionItems = 0;
  let completedCount = 0;
  plan.weeks.forEach(w => {
    (w.actionItems || w.learningObjectives || []).forEach((_, idx) => {
      totalActionItems++;
      if (completedItems[`w${w.weekNumber}_${idx}`]) completedCount++;
    });
  });
  const progressPercent = isPlanMarkedDone ? 100 : (totalActionItems > 0 ? Math.round((completedCount / totalActionItems) * 100) : 0);

  return (
    <div className="space-y-6">
      {/* Plan Header Card */}
      <div className="p-6 md:p-8 glass-card bg-white rounded-2xl border border-amber-900/20 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-amber-900 mb-2">
              <Sparkles className="w-5 h-5 text-amber-800" />
              <span className="text-xs font-bold uppercase tracking-wider font-display">AI Generated Study Roadmap</span>
              {isPlanMarkedDone && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-[10px] font-black uppercase flex items-center space-x-1 ml-2">
                  <Award className="w-3 h-3 text-emerald-800" />
                  <span>COMPLETED & DONE</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-stone-900 tracking-tight">
              {plan.title}
            </h2>
            <p className="text-xs md:text-sm text-stone-600 max-w-3xl mt-2 leading-relaxed font-medium">
              {plan.summary}
            </p>

            {/* Quick Meta Badges */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-950 border border-amber-200 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-900" />
                <span>{plan.totalEstimatedHours || 20} Total Study Hours</span>
              </span>
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-stone-100 text-stone-900 border border-stone-300 font-bold">
                <Target className="w-3.5 h-3.5 text-stone-700" />
                <span>{plan.weeks.length} Weeks Roadmap</span>
              </span>
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-stone-100 text-stone-900 border border-stone-300 font-bold">
                <BookOpen className="w-3.5 h-3.5 text-stone-700" />
                <span>{documents ? documents.length : 1} Uploaded Materials</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Mark Done & Delete & Export */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Mark Done / Completed Button */}
            <button
              onClick={handleMarkDoneToggle}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                isPlanMarkedDone
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
              title="Mark study plan completed"
            >
              <CheckSquare className="w-4 h-4 text-emerald-950" />
              <span>{isPlanMarkedDone ? 'Plan Marked Done ✓' : 'Mark as Done'}</span>
            </button>

            {/* Delete / Remove Plan Button */}
            <button
              onClick={onDeletePlan}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold transition shadow-xs"
              title="Delete this study plan"
            >
              <Trash2 className="w-4 h-4 text-rose-700" />
              <span>Delete Plan</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-100 border border-stone-300 hover:bg-stone-200 text-stone-800 text-xs font-bold transition shadow-xs"
              title="Copy plan in Markdown"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-stone-600" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-100 border border-stone-300 hover:bg-stone-200 text-stone-800 text-xs font-bold transition shadow-xs"
              title="Export as PDF"
            >
              <Download className="w-4 h-4 text-amber-900" />
              <span>PDF</span>
            </button>

            <button
              onClick={onRegenerate}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl woody-gradient text-white text-xs font-bold shadow-md shadow-amber-900/20 hover:opacity-95 transition"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-stone-800">Overall Study Plan Progress</span>
            <span className="font-bold text-amber-900">
              {isPlanMarkedDone ? '100% (Plan Marked Done 🎉)' : `${progressPercent}% (${completedCount}/${totalActionItems} tasks)`}
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden border border-stone-300">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isPlanMarkedDone ? 'bg-emerald-600' : 'woody-gradient'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* High-Yield Exam Tips Box */}
      {plan.highYieldTips && plan.highYieldTips.length > 0 && (
        <div className="p-5 glass-card bg-amber-50/90 rounded-2xl border border-amber-300">
          <div className="flex items-center space-x-2 text-amber-950 font-display font-extrabold text-sm mb-3">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-800" />
            <span>High-Yield Exam Focus Areas (Extracted From Your Files)</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plan.highYieldTips.map((tip, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-white border border-amber-200 text-xs text-stone-800 font-medium leading-relaxed shadow-xs">
                🎯 {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Multi-Week Timeline Accordion */}
      <div className="space-y-4">
        {plan.weeks.map((w) => {
          const isExpanded = expandedWeeks[w.weekNumber];
          const items = w.actionItems || w.learningObjectives || [];

          return (
            <div
              key={w.weekNumber}
              className="glass-card bg-white rounded-2xl border border-stone-200 overflow-hidden transition shadow-xs"
            >
              {/* Week Header Bar */}
              <div
                onClick={() => toggleWeek(w.weekNumber)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl woody-gradient text-white flex items-center justify-center font-display font-bold text-sm shrink-0 shadow-xs">
                    W{w.weekNumber}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 font-display">
                      {w.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-1 mt-0.5 font-medium">
                      {w.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-300 hidden sm:inline-block">
                    {w.estimatedHours} Hours
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-stone-600" /> : <ChevronDown className="w-5 h-5 text-stone-600" />}
                </div>
              </div>

              {/* Week Content Details */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-stone-200 space-y-5 bg-stone-50/50">
                  {/* Concept Tags */}
                  {w.keyConcepts && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-stone-600 mr-1">Core Concepts:</span>
                      {w.keyConcepts.map((concept, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-200 text-[11px] font-bold">
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Exam Alert Warning */}
                  {w.examAlert && (
                    <div className="p-3.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs flex items-start space-x-2.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-800" />
                      <div>
                        <strong className="font-bold">Exam Alert: </strong>
                        <span className="font-medium">{w.examAlert}</span>
                      </div>
                    </div>
                  )}

                  {/* Checklist Action Items */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                      Learning Objectives & Tasks
                    </h4>
                    <div className="space-y-2">
                      {items.map((item, idx) => {
                        const itemKey = `w${w.weekNumber}_${idx}`;
                        const isDone = isPlanMarkedDone || completedItems[itemKey];

                        return (
                          <div
                            key={idx}
                            onClick={() => toggleItem(itemKey)}
                            className={`p-3 rounded-xl border transition flex items-start space-x-3 cursor-pointer ${
                              isDone
                                ? 'bg-stone-100 border-stone-300 text-stone-400 line-through'
                                : 'bg-white border-stone-300 hover:border-amber-800/40 text-stone-900 font-medium'
                            }`}
                          >
                            <button className="mt-0.5 text-amber-800 shrink-0">
                              {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <Circle className="w-4 h-4 text-stone-400" />}
                            </button>
                            <span className="text-xs leading-relaxed">{item}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
