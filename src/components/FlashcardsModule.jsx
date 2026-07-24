import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Sparkles, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  FileUp,
  FileText
} from 'lucide-react';
import { generateFlashcardsFromDocs } from '../services/gemini';

export default function FlashcardsModule({ flashcards, setFlashcards, documents, setActiveTab }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastery, setMastery] = useState({});
  const [loading, setLoading] = useState(false);

  const hasUserDocs = documents && documents.length > 0;

  // Generate flashcards ONLY from user's uploaded materials
  useEffect(() => {
    async function initFlashcards() {
      if (hasUserDocs && (!flashcards || flashcards.length === 0)) {
        setLoading(true);
        try {
          const generated = await generateFlashcardsFromDocs(documents);
          if (generated && generated.length > 0) {
            setFlashcards(generated);
          }
        } catch (err) {
          console.error('Flashcards initialization error:', err);
        }
        setLoading(false);
      }
    }

    initFlashcards();
  }, [documents]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleSetConfidence = (cardId, level) => {
    setMastery(prev => ({ ...prev, [cardId]: level }));
    handleNext();
  };

  const handleGenerateNew = async () => {
    if (!hasUserDocs) return;
    setLoading(true);
    setIsFlipped(false);
    setCurrentIndex(0);
    try {
      const newDeck = await generateFlashcardsFromDocs(documents);
      setFlashcards(newDeck);
    } catch (err) {
      console.error('Flashcard error:', err);
    }
    setLoading(false);
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
            3D Flashcard decks are extracted <strong className="text-stone-900">100% strictly from your uploaded course materials</strong>. Please upload your syllabus, notes, or lecture slides first.
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

  // State 2: Currently Generating Flashcards from User Files
  if (loading) {
    return (
      <div className="p-12 text-center glass-card bg-white rounded-2xl border border-amber-900/30 flex flex-col items-center justify-center space-y-4 shadow-xl">
        <div className="w-12 h-12 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
        <h3 className="text-base font-bold text-stone-900 font-display">Generating Flashcards From Your Files...</h3>
        <p className="text-xs text-stone-600 font-medium">Extracting key terms, concepts, and definitions strictly from your uploaded files.</p>
      </div>
    );
  }

  // State 3: User Materials Exist but Flashcards Need Generation
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="p-12 text-center glass-card bg-white rounded-2xl border border-stone-300 space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto border border-amber-200">
          <Layers className="w-6 h-6 text-amber-800" />
        </div>
        <h3 className="text-base font-bold text-stone-900 font-display">Generate Flashcards From Uploaded Materials</h3>
        <p className="text-xs text-stone-600 max-w-sm mx-auto font-medium">
          Create digital 3D flashcards strictly from your {documents.length} uploaded material(s).
        </p>
        <button
          onClick={handleGenerateNew}
          className="px-5 py-2.5 rounded-xl woody-gradient text-white text-xs font-bold shadow-md shadow-amber-900/20 hover:opacity-95 transition"
        >
          Generate Deck From My Files
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex] || flashcards[0];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-stone-900 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-800" />
            <span>Interactive 3D Flashcards</span>
          </h2>
          <p className="text-xs text-stone-600 font-medium mt-0.5">
            Card {currentIndex + 1} of {flashcards.length} • Extracted strictly from your {documents.length} file(s)
          </p>
        </div>

        <button
          onClick={handleGenerateNew}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-100 border border-stone-300 hover:bg-stone-200 text-stone-900 text-xs font-bold shadow-xs"
        >
          <RotateCcw className="w-4 h-4 text-amber-800" />
          <span>Regenerate Deck From Files</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden border border-stone-300">
        <div
          className="h-full woody-gradient transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
        ></div>
      </div>

      {/* 3D Flip Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 cursor-pointer perspective-1000 select-none"
      >
        <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* FRONT SIDE */}
          <div className="absolute inset-0 glass-card bg-white p-8 rounded-3xl border border-stone-300 shadow-xl flex flex-col justify-between backface-hidden">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 font-bold border border-amber-200">
                {currentCard.category || 'Core Concept'}
              </span>
              <span className="text-[11px] text-stone-500 font-mono font-bold">CLICK TO FLIP 🔄</span>
            </div>

            <div className="text-center px-4 my-auto">
              <h3 className="text-xl md:text-2xl font-display font-bold text-stone-900 leading-relaxed">
                {currentCard.front}
              </h3>
            </div>

            <div className="text-center text-[11px] text-stone-500 font-bold">
              Front Side
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 glass-card bg-amber-50/90 p-8 rounded-3xl border border-amber-300 shadow-xl flex flex-col justify-between backface-hidden rotate-y-180">
            <div className="flex items-center justify-between text-xs text-amber-900">
              <span className="px-2.5 py-1 rounded-md bg-amber-200 text-amber-950 font-bold border border-amber-300">
                Answer & Explanation
              </span>
              <span className="text-[11px] text-stone-500 font-mono font-bold">CLICK TO FLIP 🔄</span>
            </div>

            <div className="text-center px-4 my-auto">
              <p className="text-base md:text-lg text-stone-900 leading-relaxed font-bold">
                {currentCard.back}
              </p>
            </div>

            <div className="text-center text-[11px] text-amber-900 font-bold">
              Back Side
            </div>
          </div>

        </div>
      </div>

      {/* Controls & Confidence Tagging */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="p-3 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 hover:bg-stone-200 font-bold transition shadow-xs"
        >
          <ChevronLeft className="w-5 h-5 text-stone-800" />
        </button>

        {/* Confidence Rating Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSetConfidence(currentCard.id, 'hard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              mastery[currentCard.id] === 'hard'
                ? 'bg-rose-100 text-rose-950 border-rose-300'
                : 'bg-white border-stone-300 text-stone-800 hover:bg-rose-50'
            }`}
          >
            🔴 Hard (Review)
          </button>

          <button
            onClick={() => handleSetConfidence(currentCard.id, 'medium')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              mastery[currentCard.id] === 'medium'
                ? 'bg-amber-100 text-amber-950 border-amber-300'
                : 'bg-white border-stone-300 text-stone-800 hover:bg-amber-50'
            }`}
          >
            🟡 Good
          </button>

          <button
            onClick={() => handleSetConfidence(currentCard.id, 'easy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              mastery[currentCard.id] === 'easy'
                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                : 'bg-white border-stone-300 text-stone-800 hover:bg-emerald-50'
            }`}
          >
            🟢 Mastered
          </button>
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-xl bg-stone-100 border border-stone-300 text-stone-900 hover:bg-stone-200 font-bold transition shadow-xs"
        >
          <ChevronRight className="w-5 h-5 text-stone-800" />
        </button>
      </div>
    </div>
  );
}
