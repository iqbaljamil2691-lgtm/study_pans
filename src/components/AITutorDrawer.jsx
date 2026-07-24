import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Trash2
} from 'lucide-react';
import { askAiTutor } from '../services/gemini';

export default function AITutorDrawer({ documents }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your **StudyPulse AI Tutor**. I've indexed your uploaded materials. Ask me to explain difficult concepts, generate custom practice problems, or summarize key topics!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    "Summarize core definitions from my uploaded files",
    "What are the top 3 high-yield exam pitfalls?",
    "Explain key methods in simple terms with an analogy",
    "Give me 2 practice problems based on my materials"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const answer = await askAiTutor(query, documents);
      setMessages(prev => [...prev, { sender: 'ai', text: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: `Sorry, I encountered an error answering that query. Please try again.` }]);
    }
    setLoading(false);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        sender: 'ai',
        text: `Chat history cleared. How can I assist with your course documents today?`
      }
    ]);
  };

  return (
    <div className="glass-card bg-white rounded-2xl border border-stone-300 flex flex-col h-[75vh] shadow-xl overflow-hidden">
      {/* Tutor Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl woody-gradient text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5 animate-pulse text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display">StudyPulse AI Tutor</h3>
            <p className="text-[11px] text-stone-600 flex items-center space-x-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Contextually grounded in {documents ? documents.length : 1} course file(s)</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 rounded-lg bg-stone-100 text-stone-600 hover:text-rose-700 hover:bg-rose-50 transition"
          title="Clear Chat History"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-stone-100/80 border-b border-stone-200 flex items-center space-x-2 overflow-x-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 shrink-0">Quick Prompts:</span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-200 border border-stone-300 text-[11px] text-amber-950 font-bold whitespace-nowrap shrink-0 transition shadow-xs"
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans bg-[#fdfcf9]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold ${
              msg.sender === 'user'
                ? 'woody-gradient text-white'
                : 'bg-stone-200 text-stone-800 border border-stone-300'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-amber-900" />}
            </div>

            <div className={`p-4 rounded-2xl max-w-[80%] text-xs leading-relaxed font-medium shadow-xs ${
              msg.sender === 'user'
                ? 'woody-gradient text-white rounded-tr-none'
                : 'bg-white border border-stone-300 text-stone-900 rounded-tl-none whitespace-pre-wrap'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-amber-900 text-xs font-bold p-2">
            <Bot className="w-4 h-4 animate-bounce text-amber-800" />
            <span className="animate-pulse">Thinking & searching document context...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-stone-200 bg-white">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Tutor anything about your slides, syllabus, or past quizzes..."
            className="flex-1 bg-stone-50 border border-stone-300 focus:border-amber-800 rounded-xl px-4 py-2.5 text-xs text-stone-900 outline-none transition placeholder-stone-400 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl woody-gradient text-white disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-amber-900/20"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
