import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  FileCheck, 
  Trash2, 
  Eye, 
  Sparkles, 
  AlertCircle,
  FileType,
  BookOpen,
  X
} from 'lucide-react';
import { parseDocument } from '../lib/documentParser';
import { saveDocumentMetadata } from '../lib/supabase';

export default function FileUploader({ documents, setDocuments, onGeneratePlan, onSelectSampleDocs }) {
  const [isDragging, setIsDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleFileUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setParsing(true);
    setError('');

    const filesArray = Array.from(fileList);
    const newDocs = [];

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      try {
        const parsed = await parseDocument(file);
        const saved = await saveDocumentMetadata(parsed);
        newDocs.push(saved);
      } catch (err) {
        console.error('File parse error:', err);
        setError(`Failed to process ${file.name}: ${err.message}`);
      }
    }

    if (newDocs.length > 0) {
      setDocuments(prev => [...newDocs, ...prev]);
    }
    setParsing(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDeleteDoc = (id) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    localStorage.setItem('studypulse_documents', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setDocuments([]);
    localStorage.removeItem('studypulse_documents');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-card bg-white rounded-2xl border border-amber-900/20 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-amber-900 mb-1">
            <Sparkles className="w-5 h-5 text-amber-800" />
            <h2 className="text-xl font-display font-bold text-stone-900">
              Course Material Hub
            </h2>
          </div>
          <p className="text-xs text-stone-600 max-w-2xl font-medium">
            Upload your syllabus, lecture slides, past quizzes, or raw study notes in <span className="text-amber-900 font-bold">PDF, DOCX, PPTX, or TXT</span> format. Select and upload <strong className="text-stone-900">multiple files at once</strong>.
          </p>
        </div>

        <button
          onClick={onSelectSampleDocs}
          className="shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl woody-gradient text-white text-xs font-bold shadow-md shadow-amber-900/20 transition transform active:scale-95"
        >
          <BookOpen className="w-4 h-4 text-white" />
          <span className="text-white font-bold">Load Sample Files (1-Click)</span>
        </button>
      </div>

      {/* Multi-File Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative p-8 md:p-12 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
          isDragging
            ? 'border-amber-800 bg-amber-50 scale-[1.01]'
            : 'border-stone-300 hover:border-amber-800 bg-white/80 hover:bg-white'
        }`}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,.md"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 mb-4 shadow-xs">
          <Upload className="w-7 h-7 text-amber-800" />
        </div>

        <h3 className="text-sm font-bold text-stone-900 mb-1">
          {parsing ? 'Extracting Text & XML Slide Layers from Files...' : 'Drag & drop MULTIPLE course documents here'}
        </h3>
        <p className="text-xs text-stone-600 max-w-sm mb-4 font-medium">
          Select multiple files simultaneously (<span className="text-stone-900 font-bold">PDF, DOCX, PPTX slides, TXT</span>).
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {['.PDF Syllabus', '.DOCX Notes', '.PPTX Slides', '.TXT Quizzes'].map((ext, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-md bg-stone-100 text-[11px] font-bold text-stone-800 border border-stone-300">
              {ext}
            </span>
          ))}
        </div>

        {parsing && (
          <div className="mt-4 flex items-center space-x-2 text-amber-900 text-xs font-bold animate-pulse">
            <div className="w-3.5 h-3.5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
            <span>Parsing file contents and extracting course concepts...</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
          <span className="font-bold">{error}</span>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold font-display text-stone-900 flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            <span>Uploaded Materials ({documents.length})</span>
          </h3>

          <div className="flex items-center space-x-2">
            {documents.length > 0 && (
              <>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-300 text-stone-700 hover:text-rose-800 text-xs font-bold transition"
                >
                  Clear All
                </button>
                <button
                  onClick={onGeneratePlan}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl woody-gradient text-white text-xs font-bold shadow-md shadow-amber-900/20 transition"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white font-bold">Generate Study Plan</span>
                </button>
              </>
            )}
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 text-center glass-card bg-white rounded-2xl border border-stone-300 text-stone-600 text-xs font-medium">
            No course materials uploaded yet. Drag & drop multiple files above or click <span className="text-amber-900 font-bold cursor-pointer" onClick={onSelectSampleDocs}>"Load Sample Course Files"</span>.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="glass-card bg-white glass-card-hover p-4 rounded-xl border border-stone-300 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-900 shrink-0">
                        <FileType className="w-4 h-4 text-amber-900" />
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 truncate" title={doc.fileName}>
                        {doc.fileName}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="text-stone-400 hover:text-rose-700 p-1 transition"
                      title="Delete material"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-stone-500" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-stone-600 mb-3 font-semibold">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                      {doc.type}
                    </span>
                    <span>{doc.wordCount || 0} words</span>
                  </div>

                  <p className="text-[11px] text-stone-600 line-clamp-2 bg-stone-50 p-2 rounded-lg border border-stone-200 font-mono font-medium">
                    {doc.text ? doc.text.slice(0, 140) + '...' : 'Text content parsed successfully.'}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-[10px] text-stone-500 font-mono font-bold">
                    {doc.fileSize || 'Uploaded'}
                  </span>

                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="flex items-center space-x-1 text-xs text-amber-900 hover:text-amber-950 font-bold"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-800" />
                    <span className="font-bold">View Text</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Text Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white w-full max-w-3xl max-h-[85vh] rounded-2xl border border-stone-300 flex flex-col shadow-2xl">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-800" />
                <h3 className="text-sm font-bold text-stone-900 truncate max-w-md">{previewDoc.fileName}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg bg-stone-100 text-stone-600 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto font-mono text-xs text-stone-800 space-y-4 leading-relaxed whitespace-pre-wrap font-medium">
              {previewDoc.text || 'No text preview available.'}
            </div>

            <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 font-bold">
              <span>Total Words: {previewDoc.wordCount}</span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 rounded-lg woody-gradient text-white font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
