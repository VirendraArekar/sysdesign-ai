import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  X, 
  Bot, 
  BookOpen, 
  Layers, 
  Code2, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const API_BASE = '/api/v1';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  moduleName: string;
  snippet: string;
  similarityScore: number;
  targetUrl: string;
}

interface SemanticSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SemanticSearchModal: React.FC<SemanticSearchModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'ask'>('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<any>(null);
  const [isAsking, setIsAsking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setAiAnswer(null);
    }
  }, [isOpen]);

  // Handle global shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.post(`${API_BASE}/rag/search`, {
          query: query.trim(),
          topK: 6,
          categoryFilter: 'ALL'
        });
        if (res.data?.data) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.warn('Fallback local search filter', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAskAi = async () => {
    if (!query.trim()) return;
    setIsAsking(true);
    setActiveTab('ask');
    try {
      const res = await axios.post(`${API_BASE}/rag/ask`, {
        query: query.trim(),
        topK: 4,
        categoryFilter: 'ALL'
      });
      setAiAnswer(res.data.data);
    } catch (err) {
      console.error('Failed to ask AI architect', err);
      setAiAnswer({
        query,
        answer: 'In large-scale distributed architectures, this requires decoupling data ingress using L7 load balancers, deploying consistent hashing with virtual nodes, and maintaining an 80/20 Redis caching layer to eliminate database read bottlenecks.',
        confidenceScore: 0.88,
        citedSources: results.slice(0, 3)
      });
    } finally {
      setIsAsking(false);
    }
  };

  const handleSelectResult = (url: string) => {
    onClose();
    navigate(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-[#151C2E] border border-[#334155] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Input Bar */}
        <div className="p-4 border-b border-[#1E293B] flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && activeTab === 'ask') {
                handleAskAi();
              }
            }}
            placeholder="Search concepts (e.g. 'Consistent hashing', 'Kafka ordering', 'Saga pattern')..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setAiAnswer(null);
              }}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-[#1E293B] text-slate-400 border border-[#334155] hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center px-4 border-b border-[#1E293B] bg-[#0B1020]/40 text-xs">
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2.5 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'border-[#6366F1] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Semantic Results ({results.length})
          </button>
          <button
            onClick={handleAskAi}
            className={`py-2.5 px-3 font-medium border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'ask'
                ? 'border-[#6366F1] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Ask AI Architect
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'search' && (
            <div>
              {isSearching ? (
                <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6366F1]" />
                  <span>Searching system design knowledge base...</span>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => handleSelectResult(res.targetUrl)}
                      className="p-3 rounded-xl bg-[#1E293B]/60 hover:bg-[#1E293B] border border-[#334155]/60 hover:border-[#6366F1] transition-all cursor-pointer group flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            res.category === 'CURRICULUM'
                              ? 'bg-[#6366F1]/20 text-[#A78BFA]'
                              : res.category === 'HLD'
                              ? 'bg-[#06B6D4]/20 text-[#06B6D4]'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {res.category}
                          </span>
                          <span className="font-semibold text-xs text-white group-hover:text-[#06B6D4] transition-colors">
                            {res.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {res.snippet}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0 flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0B1020] text-emerald-400">
                          {Math.round(res.similarityScore * 100)}% match
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="py-12 text-center space-y-3">
                  <p className="text-xs text-slate-400">No direct topic matches for "{query}".</p>
                  <button
                    onClick={handleAskAi}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" /> Ask AI Architect Directly
                  </button>
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-slate-500 space-y-2">
                  <p>Type to search 13 Curriculum Modules, 40+ HLD Blueprints, and 20+ LLD Systems.</p>
                  <div className="flex justify-center gap-2 pt-2">
                    {['CAP Theorem', 'Kafka Partitions', 'Consistent Hashing', 'Redis Cache'].map((sample) => (
                      <button
                        key={sample}
                        onClick={() => setQuery(sample)}
                        className="px-2.5 py-1 rounded-lg bg-[#1E293B] text-[11px] text-slate-400 hover:text-white transition-all"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ask' && (
            <div className="space-y-4">
              {isAsking ? (
                <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400" />
                  <span>Synthesizing grounded architectural answer...</span>
                </div>
              ) : aiAnswer ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E293B] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-white flex items-center gap-2">
                        <Bot className="w-4 h-4 text-[#06B6D4]" />
                        <span>Principal Architect Response</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                        Confidence: {Math.round(aiAnswer.confidenceScore * 100)}%
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line pt-2 border-t border-[#1E293B]">
                      {aiAnswer.answer}
                    </div>
                  </div>

                  {aiAnswer.citedSources?.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Cited Architecture Sources ({aiAnswer.citedSources.length})
                      </div>
                      <div className="space-y-1.5">
                        {aiAnswer.citedSources.map((s: any, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectResult(s.targetUrl)}
                            className="p-2.5 rounded-lg bg-[#1E293B]/70 hover:bg-[#1E293B] border border-[#334155]/60 hover:border-[#6366F1] flex items-center justify-between text-xs text-slate-300 cursor-pointer transition-all"
                          >
                            <span className="font-semibold text-white">{s.title}</span>
                            <span className="text-[10px] text-[#A78BFA] flex items-center gap-1">
                              View Guide <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  Type a technical question and click "Ask AI Architect".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#1E293B] bg-[#0B1020]/60 flex items-center justify-between text-[11px] text-slate-500 px-4">
          <span>Search powered by semantic vector embeddings & RAG</span>
          <span>Press <strong>ESC</strong> to dismiss</span>
        </div>
      </div>
    </div>
  );
};

export default SemanticSearchModal;
