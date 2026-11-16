import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { ApiResponse } from '../../types';
import { 
  HelpCircle, 
  Search, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface QuestionItem {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  companyTags: string[];
  verifiedPublic: boolean;
  questionText: string;
  modelAnswer: string;
  keyPoints: string;
}

export const QuestionBankPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const companies = [
    'ALL',
    'Google',
    'Amazon',
    'Meta',
    'Netflix',
    'Uber',
    'Microsoft',
    'Flipkart',
    'PhonePe',
    'Razorpay',
    'Atlassian'
  ];

  const categories = ['ALL', 'Distributed Systems', 'Databases', 'Networking', 'Kafka', 'Caching', 'Security'];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const params: Record<string, string> = {};
        if (selectedCompany !== 'ALL') params.company = selectedCompany;
        if (selectedCategory !== 'ALL') params.category = selectedCategory;

        const res = await apiClient.get<any, ApiResponse<QuestionItem[]>>('/practice/questions', { params });
        if (res.success && res.data) {
          setQuestions(res.data);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [selectedCompany, selectedCategory]);

  const parseArray = (str: string): string[] => {
    try { return JSON.parse(str || '[]'); } catch { return []; }
  };

  const filtered = questions.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.questionText.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs font-medium text-indigo-600 dark:text-[#A78BFA] mb-2">
            <Building2 className="w-3.5 h-3.5 text-cyan-600 dark:text-[#06B6D4]" /> Top Tier Company Tracks
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Question Bank & Company Tracks</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Real interview questions from Google, Amazon, Meta, Netflix, and Uber with model answers.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] w-64 shadow-xs"
          />
        </div>
      </div>

      {/* Company Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
        {companies.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCompany(c)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCompany === c
                ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/20'
                : 'bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-xs'
            }`}
          >
            {c === 'ALL' ? '🏢 All Companies' : c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q) => {
            const isExpanded = expandedId === q.id;
            const keyPoints = parseArray(q.keyPoints);

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl overflow-hidden transition-all hover:border-slate-300 dark:hover:border-[#334155] shadow-xs"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1E293B] text-indigo-700 dark:text-[#A78BFA] font-medium border border-slate-200 dark:border-[#334155]">
                        {q.category}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        q.difficulty === 'STAFF' ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30' :
                        q.difficulty === 'SENIOR' ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {q.difficulty}
                      </span>
                      {q.verifiedPublic && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified Public Interview
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white hover:text-[#A78BFA] transition-colors">
                      {q.title}
                    </h3>

                    {q.companyTags && q.companyTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {q.companyTags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#0B1020] text-cyan-400 border border-[#1E293B] font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#1E293B] bg-[#0B1020]/50 space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Detailed Question
                      </h4>
                      <p className="text-sm text-slate-200 leading-relaxed">{q.questionText}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-[#06B6D4] uppercase tracking-wider mb-1">
                        Staff-Level Model Answer
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-white dark:bg-[#0B1020] p-4 rounded-xl border border-slate-200 dark:border-[#1E293B] shadow-xs">
                        {q.modelAnswer}
                      </p>
                    </div>

                    {keyPoints.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                          Core Evaluator Checkpoints
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {keyPoints.map((pt, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-[#151C2E] p-2.5 rounded-lg border border-slate-200 dark:border-[#1E293B]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestionBankPage;
