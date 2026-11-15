import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import apiClient from '../../services/api';
import { ApiResponse } from '../../types';
import MermaidViewer from '../../components/common/MermaidViewer';
import { 
  ArrowLeft, 
  Code2, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Terminal, 
  FileCode, 
  Loader2, 
  Sparkles,
  Bot
} from 'lucide-react';

interface LldDetail {
  id: string;
  title: string;
  difficulty: string;
  problemStatement: string;
  solidPrinciplesApplied: string;
  designPatternsUsed: string;
  classDiagramMermaid: string;
  javaSolutionCode: string;
  unitTestsCode: string;
  extensibilityNotes: string;
}

export const LldDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<LldDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'diagram' | 'solid' | 'tests' | 'extensibility'>('code');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiClient.get<any, ApiResponse<LldDetail>>(`/practice/lld/${id}`);
        if (res.success && res.data) {
          setProblem(res.data);
        }
      } catch (err) {
        console.error('Error fetching LLD problem detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white mb-2">LLD Problem Not Found</h2>
        <Link to="/lld" className="text-[#A78BFA] hover:underline text-sm">
          Return to LLD Practice
        </Link>
      </div>
    );
  }

  const parseArray = (str: string): string[] => {
    try { return JSON.parse(str || '[]'); } catch { return []; }
  };

  const solidPrinciples = parseArray(problem.solidPrinciplesApplied);
  const designPatterns = parseArray(problem.designPatternsUsed);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/lld"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to LLD Hub
        </Link>

        <Link
          to={`/interview?problem=${problem.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white text-xs font-semibold shadow-md shadow-[#6366F1]/20 hover:opacity-95 transition-all"
        >
          <Bot className="w-4 h-4" /> Mock Interview for this LLD
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6366F1]/20 text-[#A78BFA] border border-[#6366F1]/30 font-semibold uppercase">
            Object-Oriented Design
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold uppercase">
            {problem.difficulty}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{problem.title}</h1>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">{problem.problemStatement}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1E293B] mb-6 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'code'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4 text-[#6366F1]" /> Java 25 Production Code
        </button>

        <button
          onClick={() => setActiveTab('diagram')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'diagram'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-[#06B6D4]" /> UML Class Diagram
        </button>

        <button
          onClick={() => setActiveTab('solid')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'solid'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#A78BFA]" /> SOLID & Design Patterns
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tests'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" /> Unit Tests Suite
        </button>

        <button
          onClick={() => setActiveTab('extensibility')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'extensibility'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Extensibility & Future Scope
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'code' && (
        <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-4 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E293B] mb-2 text-xs text-slate-400">
            <span className="flex items-center gap-2 font-mono text-[#06B6D4]">
              <FileCode className="w-4 h-4" /> Solution.java
            </span>
            <span>Java 25 / Clean Architecture</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-[#1E293B]">
            <Editor
              height="550px"
              language="java"
              theme="vs-dark"
              value={problem.javaSolutionCode}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
              }}
            />
          </div>
        </div>
      )}

      {activeTab === 'diagram' && (
        <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#06B6D4]" /> Object-Oriented UML Class Diagram
          </h3>
          <MermaidViewer chart={problem.classDiagramMermaid} />
        </div>
      )}

      {activeTab === 'solid' && (
        <div className="space-y-6">
          <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#6366F1]" /> SOLID Principles Applied
            </h3>
            <div className="space-y-3">
              {solidPrinciples.map((sp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0B1020] border border-[#1E293B] text-slate-200 text-sm">
                  {sp}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#A78BFA]" /> Design Patterns Utilized
            </h3>
            <div className="space-y-3">
              {designPatterns.map((dp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0B1020] border border-[#1E293B] text-slate-200 text-sm">
                  {dp}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-4 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E293B] mb-2 text-xs text-slate-400">
            <span className="flex items-center gap-2 font-mono text-emerald-400">
              <Terminal className="w-4 h-4" /> SolutionTest.java (JUnit 5)
            </span>
            <span>Comprehensive Test Coverage</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-[#1E293B]">
            <Editor
              height="450px"
              language="java"
              theme="vs-dark"
              value={problem.unitTestsCode}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>
      )}

      {activeTab === 'extensibility' && (
        <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Extensibility & Follow-Up Discussion
          </h3>
          <div className="p-5 rounded-xl bg-[#0B1020] border border-[#1E293B] text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {problem.extensibilityNotes}
          </div>
        </div>
      )}
    </div>
  );
};

export default LldDetailPage;
