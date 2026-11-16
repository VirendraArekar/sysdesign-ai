import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { ApiResponse } from '../../types';
import { Code2, Search, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface LldSummary {
  id: string;
  title: string;
  difficulty: string;
  problemStatement: string;
  solidPrinciplesApplied: string;
  designPatternsUsed: string;
}

export const LldListPage: React.FC = () => {
  const [problems, setProblems] = useState<LldSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLld = async () => {
      try {
        const res = await apiClient.get<any, ApiResponse<LldSummary[]>>('/practice/lld');
        if (res.success && res.data) {
          setProblems(res.data);
        }
      } catch (err) {
        console.error('Error fetching LLD problems:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLld();
  }, []);

  const parseArray = (str: string): string[] => {
    try { return JSON.parse(str || '[]'); } catch { return []; }
  };

  const filtered = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.problemStatement.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs font-medium text-cyan-700 dark:text-[#06B6D4] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-[#06B6D4]" /> 20 Comprehensive OOP & SOLID Problems
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Low-Level Design (LLD) Hub</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Production Java 25 solutions, UML class diagrams, design pattern mastery, and unit test suites.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search LLD problems (e.g. Parking Lot, Elevator)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] w-72 shadow-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prob) => {
            const patterns = parseArray(prob.designPatternsUsed);
            return (
              <Link
                key={prob.id}
                to={`/lld/${prob.id}`}
                className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] hover:border-[#6366F1]/50 rounded-2xl p-6 transition-all group flex flex-col justify-between shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-medium border border-indigo-200 dark:border-[#6366F1]/30">
                      OOP & SOLID
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      prob.difficulty === 'STAFF' ? 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30' :
                      prob.difficulty === 'SENIOR' ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                      'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#A78BFA] transition-colors mb-2">
                    {prob.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {prob.problemStatement}
                  </p>

                  {/* Patterns Tags */}
                  {patterns.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {patterns.slice(0, 2).map((pat, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#0B1020] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1E293B]">
                          {pat.split(':')[0]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-[#06B6D4] group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
                  <span>Explore UML & Java Solution</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LldListPage;
