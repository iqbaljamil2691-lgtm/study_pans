import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  BookOpen, 
  ArrowRight,
  FileUp,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuizFromDocs } from '../services/gemini';

export default function QuizModule({ quizData, setQuizData, documents, setActiveTab }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasUserDocs = documents && documents.length > 0;

  // Generate quiz ONLY from user's uploaded materials
  useEffect(() => {
    async function initQuiz() {
      if (hasUserDocs && (!quizData || quizData.length === 0)) {
        setLoading(true);
        try {
          const generated = await generateQuizFromDocs(documents);
          if (generated && generated.length > 0) {
            setQuizData(generated);
          }
        } catch (err) {
          console.error('Quiz initialization error:', err);
        }
        setLoading(false);
      }
    }

    initQuiz();
  }, [documents]);

  const handleSelect = (questionId, optionIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleGenerateNewQuiz = async () => {
    if (!hasUserDocs) return;
    setLoading(true);
    setSubmitted(false);
    setSelectedAnswers({});
    try {
      const newQuiz = await generateQuizFromDocs(documents);
      setQuizData(newQuiz);
    } catch (err) {
      console.error('Quiz generation error:', err);
    }
    setLoading(false);
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    let correctCount = 0;
    quizData.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) correctCount++;
    });

    if (quizData.length > 0 && (correctCount / quizData.length) >= 0.75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const calculateScore = () => {
    if (!quizData || quizData.length === 0) return 0;
    let correct = 0;
    quizData.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) correct++;
    });
    return Math.round((correct / quizData.length) * 100);
  };

  // State 1: No User Materials Uploaded Yet
  if (!hasUserDocs) {
    return (
      <div className="p-10 text-center glass-card bg-white rounded-3xl border border-stone-300 space-y-5 max-w-2xl mx-auto shadow-xl my-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center mx-auto">
          <FileUp className="w-7 h-7 text-amber-800" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-stone-900 font-display">No Course Materials Uploaded</h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto mt-1.5 leading-relaxed font-medium">
            The Exam Simulator generates diagnostic questions derived <strong className="text-stone-900">100% strictly from your uploaded files</strong>. Please upload your syllabus, notes, or lecture slides first.
          </p>
        </div>
        
        {setActiveTab && (
          <button
            onClick={() => setActiveTab('documents')}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl woody-gradient text-white text-xs font-bold shadow-md shadow-amber-900/20 hover:opacity-95 transition"
          >
            <FileText className="w-4 h-4 text-white" />
            <span className="text-white font-bold">Upload Course Materials Now</span>
          </button>
        )}
      </div>
    );
  }

  // State 2: Currently Generating Questions from User Files
  if (loading) {
    return (
      <div className="p-12 text-center glass-card bg-white rounded-2xl border border-amber-900/30 flex flex-col items-center justify-center space-y-4 shadow-xl">
        <div className="w-12 h-12 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
        <h3 className="text-base font-bold text-stone-900 font-display">Parsing Your Uploaded Files...</h3>
        <p className="text-xs text-stone-600 font-medium">Extracting facts, key definitions, and exam questions strictly from your uploaded files.</p>
      </div>
    );
  }

  // State 3: User Materials Exist but Quiz Needs Generation
  if (!quizData || quizData.length === 0) {
    return (
      <div className="p-12 text-center glass-card bg-white rounded-2xl border border-stone-300 space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto border border-amber-200">
          <HelpCircle className="w-6 h-6 text-amber-800" />
        </div>
        <h3 className="text-base font-bold text-stone-900 font-display">Generate Quiz From Uploaded Materials</h3>
        <p className="text-xs text-stone-600 max-w-sm mx-auto font-medium">
          Generate an interactive diagnostic quiz strictly from your {documents.length} uploaded material(s).
        </p>
        <button
          onClick={handleGenerateNewQuiz}
          className="px-5 py-2.5 rounded-xl woody-gradient text-white text-xs font-bold shadow-md shadow-amber-900/20 hover:opacity-95 transition"
        >
          Generate Quiz From My Files
        </button>
      </div>
    );
  }

  const scorePercent = calculateScore();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 glass-card bg-white rounded-2xl border border-amber-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-amber-900 mb-1">
            <Sparkles className="w-5 h-5 text-amber-800" />
            <h2 className="text-xl font-display font-bold text-stone-900">
              AI Exam Simulator & Diagnostic Quiz
            </h2>
          </div>
          <p className="text-xs text-stone-600 max-w-xl font-medium">
            Questions compiled strictly from your {documents.length} uploaded material(s) (**{documents.map(d => d.fileName).join(', ')}**).
          </p>
        </div>

        <button
          onClick={handleGenerateNewQuiz}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl woody-gradient text-white text-xs font-bold shadow-md shadow-amber-900/20 hover:opacity-95 transition shrink-0"
        >
          <RotateCcw className="w-4 h-4 text-white" />
          <span className="text-white font-bold">New Quiz From My Files</span>
        </button>
      </div>

      {/* Score Summary Box */}
      {submitted && (
        <div className={`p-6 glass-card rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
          scorePercent >= 75 ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-xl shrink-0 ${
              scorePercent >= 75 ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-amber-100 text-amber-950 border border-amber-300'
            }`}>
              {scorePercent}%
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-display">
                {scorePercent >= 75 ? '🎉 Outstanding Master Performance!' : '📚 Good Attempt - Review Explanations Below'}
              </h3>
              <p className="text-xs text-stone-700 font-medium mt-0.5">
                You scored <strong className="text-stone-900">{quizData.filter(q => selectedAnswers[q.id] === q.correctIndex).length} out of {quizData.length}</strong> correctly.
              </p>
            </div>
          </div>

          <button
            onClick={() => { setSubmitted(false); setSelectedAnswers({}); }}
            className="px-4 py-2 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 text-xs font-bold hover:bg-stone-200 shadow-xs"
          >
            Retake Quiz
          </button>
        </div>
      )}

      {/* Quiz Questions List */}
      <div className="space-y-4">
        {quizData.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];

          return (
            <div key={q.id || qIndex} className="glass-card bg-white p-6 rounded-2xl border border-stone-300 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm md:text-base font-bold text-stone-900 leading-relaxed flex items-start space-x-2">
                  <span className="text-amber-900 font-mono font-bold shrink-0">Q{qIndex + 1}.</span>
                  <span>{q.question}</span>
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === q.correctIndex;

                  let btnStyle = 'bg-stone-50 border-stone-300 text-stone-800 hover:border-amber-800/50 font-medium';
                  if (submitted) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                    } else if (isThisSelected && !isCorrect) {
                      btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                    }
                  } else if (isThisSelected) {
                    btnStyle = 'woody-gradient text-white font-bold shadow-md';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`p-3.5 rounded-xl border text-xs text-left transition flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isThisSelected && !submitted ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>

                      {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                      {submitted && isThisSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* AI Explanation Drawer */}
              {submitted && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center space-x-1.5 text-amber-900 font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                    <span>AI Explanation & Rationale:</span>
                  </div>
                  <p className="text-stone-800 leading-relaxed font-sans font-medium">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Quiz Button */}
      {!submitted && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(selectedAnswers).length < quizData.length}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition ${
              Object.keys(selectedAnswers).length === quizData.length
                ? 'woody-gradient text-white shadow-amber-900/30 hover:opacity-95'
                : 'bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300'
            }`}
          >
            <span className={Object.keys(selectedAnswers).length === quizData.length ? 'text-white font-bold' : 'text-stone-500 font-bold'}>
              Submit Exam Answers
            </span>
            <ArrowRight className={`w-4 h-4 ${Object.keys(selectedAnswers).length === quizData.length ? 'text-white' : 'text-stone-500'}`} />
          </button>
        </div>
      )}
    </div>
  );
}
