import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { ApiResponse } from '../../types';
import MermaidViewer from '../../components/common/MermaidViewer';
import { 
  ArrowLeft, 
  Layers, 
  Database, 
  Cpu, 
  Scale, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  Bot,
  Code,
  Sparkles
} from 'lucide-react';

interface HldDetail {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  functionalRequirements: string;
  nonFunctionalRequirements: string;
  capacityEstimation: string;
  apiDesign: string;
  databaseSchema: string;
  architectureDiagramMermaid: string;
  deepDiveTopics: string;
  tradeOffs: string;
}

export const HldDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<HldDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'architecture' | 'requirements' | 'api-db' | 'deepdives'>('architecture');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await apiClient.get<any, ApiResponse<HldDetail>>(`/practice/hld/${id}`);
        if (res.success && res.data) {
          setProblem(res.data);
        }
      } catch (err) {
        console.error('Error fetching HLD problem detail:', err);
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
        <h2 className="text-xl font-bold text-white mb-2">HLD Problem Not Found</h2>
        <Link to="/hld" className="text-[#A78BFA] hover:underline text-sm">
          Return to HLD Practice
        </Link>
      </div>
    );
  }

  const parseArray = (str: string): string[] => {
    try { return JSON.parse(str || '[]'); } catch { return []; }
  };

  const parseObject = (str: string): Record<string, string> => {
    try { return JSON.parse(str || '{}'); } catch { return {}; }
  };

  const functionalReqs = parseArray(problem.functionalRequirements);
  const nonFunctionalReqs = parseArray(problem.nonFunctionalRequirements);
  const capacity = parseObject(problem.capacityEstimation);
  const apis = parseArray(problem.apiDesign);
  const deepDives = parseArray(problem.deepDiveTopics);
  const tradeOffs = parseArray(problem.tradeOffs);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Back button */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          to="/hld"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to HLD Hub
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/topics?type=HLD&topic=${problem.id}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-cyan-700 dark:text-cyan-300 text-xs font-semibold shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Topics Hub (Code, UML, Answers)
          </Link>

          <Link
            to={`/interview?problem=${problem.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white text-xs font-semibold shadow-md shadow-[#6366F1]/20 hover:opacity-95 transition-all"
          >
            <Bot className="w-4 h-4" /> Practice in AI Interview
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] border border-indigo-200 dark:border-[#6366F1]/30 font-semibold uppercase">
            {problem.category}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 font-semibold uppercase">
            {problem.difficulty}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{problem.title}</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">{problem.description}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-[#1E293B] mb-6 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'border-[#6366F1] text-indigo-600 dark:text-white'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-[#6366F1]" /> Architecture Diagram & Flow
        </button>

        <button
          onClick={() => setActiveTab('requirements')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'requirements'
              ? 'border-[#6366F1] text-indigo-600 dark:text-white'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" /> Requirements & Capacity
        </button>

        <button
          onClick={() => setActiveTab('api-db')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'api-db'
              ? 'border-[#6366F1] text-indigo-600 dark:text-white'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-[#A78BFA]" /> API & Database Schema
        </button>

        <button
          onClick={() => setActiveTab('deepdives')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'deepdives'
              ? 'border-[#6366F1] text-indigo-600 dark:text-white'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4 text-amber-500" /> Deep Dives & Trade-offs
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'architecture' && (
        <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#6366F1]" /> High-Level Architecture Topology
          </h3>
          <MermaidViewer chart={problem.architectureDiagramMermaid} />
        </div>
      )}

      {activeTab === 'requirements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Functional Requirements
            </h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {functionalReqs.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-500" /> Non-Functional Requirements
            </h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {nonFunctionalReqs.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#A78BFA]" /> Back-of-the-Envelope Capacity Estimations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(capacity).map(([key, val]) => (
                <div key={key} className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                  <div className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 mb-1">{key}</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api-db' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-[#6366F1]" /> REST / RPC API Specification
            </h3>
            <div className="space-y-2">
              {apis.map((api, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] font-mono text-xs text-cyan-600 dark:text-[#06B6D4]">
                  {api}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#A78BFA]" /> Relational / NoSQL Schema & Shard Keys
            </h3>
            <pre className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
              {JSON.stringify(parseObject(problem.databaseSchema), null, 2)}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'deepdives' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Architectural Deep Dives
            </h3>
            <div className="space-y-3">
              {deepDives.map((dd, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-200 text-sm">
                  <span className="text-[#6366F1] dark:text-[#A78BFA] font-bold mr-2">#{idx + 1}</span>
                  {dd}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4 text-red-500" /> Architectural Trade-offs & SPOF Mitigations
            </h3>
            <div className="space-y-3">
              {tradeOffs.map((to, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-slate-700 dark:text-slate-200 text-sm">
                  <span className="text-red-500 font-bold mr-2">Trade-off {idx + 1}:</span>
                  {to}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HldDetailPage;
