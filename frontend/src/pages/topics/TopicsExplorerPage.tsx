import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { TopicHubSummary, TopicHubDetail } from '../../types';
import MermaidViewer from '../../components/common/MermaidViewer';
import {
  Layers,
  Code2,
  GitFork,
  Play,
  HelpCircle,
  Search,
  Sparkles,
  Bot,
  Copy,
  Check,
  ChevronRight,
  Network,
  CheckCircle2,
  Zap,
  Info,
  Maximize2,
  FileCode,
  ArrowRight,
  ShieldAlert,
  Server,
  Columns
} from 'lucide-react';

export const TopicsExplorerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'ALL';
  const initialTopic = searchParams.get('topic') || '';

  const [typeFilter, setTypeFilter] = useState<'ALL' | 'HLD' | 'LLD'>(initialType as any);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [summaries, setSummaries] = useState<TopicHubSummary[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopic);
  const [topicDetail, setTopicDetail] = useState<TopicHubDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Detail view perspective: 'hld' | 'lld' | 'side-by-side' | 'answers'
  const [activePerspective, setActivePerspective] = useState<'hld' | 'lld' | 'side-by-side' | 'answers'>('hld');

  // Options Code active language
  const [activeLang, setActiveLang] = useState<'java' | 'python' | 'cpp' | 'go'>('java');
  const [copiedCode, setCopiedCode] = useState(false);

  // UML sub-tab
  const [umlSubTab, setUmlSubTab] = useState<'class' | 'sequence'>('class');

  // Fetch summaries
  useEffect(() => {
    fetchSummaries();
  }, [typeFilter, categoryFilter, searchQuery]);

  // Fetch detail when selectedTopicId changes
  useEffect(() => {
    if (selectedTopicId) {
      fetchTopicDetail(selectedTopicId);
    }
  }, [selectedTopicId]);

  const fetchSummaries = async () => {
    try {
      setLoadingList(true);
      const params: any = {};
      if (typeFilter !== 'ALL') params.type = typeFilter;
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res: any = await apiClient.get('/practice/topics-hub', { params });
      const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (res?.data?.data || []));
      setSummaries(data);

      if (data.length > 0 && (!selectedTopicId || !data.some((d: any) => d.id === selectedTopicId))) {
        setSelectedTopicId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load topic hub summaries', err);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchTopicDetail = async (id: string) => {
    try {
      setLoadingDetail(true);
      const res: any = await apiClient.get(`/practice/topics-hub/${id}`);
      const data = res?.data?.data || res?.data || res;
      setTopicDetail(data);
    } catch (err) {
      console.error(`Failed to load topic detail for ${id}`, err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCopyCode = () => {
    if (!topicDetail?.codeOptions) return;
    const code = topicDetail.codeOptions[activeLang] || '';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const categories = [
    'ALL',
    'Infrastructure',
    'Social Media',
    'Object-Oriented Design',
    'Algorithms & State Machines',
    'Concurrency & Algorithms'
  ];

  // Default fallback HLD points if not returned by backend
  const hldPoints = topicDetail?.hldPoints || [
    "High Throughput & Low Latency SLA: Sub-50ms p99 latency target with read/write ratio modeling.",
    "Stateless Compute Layer: Auto-scaled microservice pods behind an L7 Application Load Balancer.",
    "Distributed Multi-Tier Caching: Redis Cluster caching hot read paths using cache-aside with LRU eviction.",
    "Database Partitioning & Storage: Sharded relational/NoSQL storage by entity hash, with primary-replica replication.",
    "Fault Tolerance & Disaster Recovery: Multi-AZ deployment, circuit breakers, and dead-letter queues."
  ];

  // Default fallback LLD points if not returned by backend
  const lldPoints = topicDetail?.lldPoints || [
    "SOLID Principles Adherence: Strict Single Responsibility (SRP) and Open/Closed (OCP) across models and services.",
    "Design Patterns: Strategy Pattern for swappable algorithms, Factory Method for instantiation, and Observer/State for event management.",
    "Thread-Safety & Concurrency: Built with atomic references, ReentrantLock, and ConcurrentHashMap for high-contention synchronization.",
    "Extensible Domain Model: Decoupled interfaces allowing pluggable extensions without modifying existing production classes."
  ];

  return (
    <div className="max-w-[1600px] mx-auto py-6 px-3 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#6366F1]/10 via-[#06B6D4]/5 to-transparent pointer-events-none rounded-full blur-3xl" />
        
        <div className="space-y-2 max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs font-semibold text-cyan-600 dark:text-[#06B6D4]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Integrated High-Level Design (HLD) & Low-Level Design (LLD) Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Design Topics (HLD & LLD)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Select any system design topic to explore both its <strong>High-Level Design (HLD)</strong> (architecture diagrams, capacity scaling, edge caching, sharding) 
            and <strong>Low-Level Design (LLD)</strong> (UML class & sequence diagrams, SOLID principles, design patterns, working code in Java/Python/C++/Go, and interview explanations).
          </p>
        </div>

        {/* Global Quick Action */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            to="/designer"
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-slate-800 dark:text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Layers className="w-4 h-4 text-cyan-600 dark:text-[#06B6D4]" />
            <span>Architecture Canvas</span>
          </Link>
          <Link
            to="/interview"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-[#6366F1]/20 flex items-center gap-2 transition-all"
          >
            <Bot className="w-4 h-4 text-cyan-300" />
            <span>Start AI Mock Interview</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm transition-colors">
        {/* Category & Topic Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
          {(['ALL', 'HLD', 'LLD'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === t
                  ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'All System Design Topics' : t === 'HLD' ? 'HLD Focus' : 'LLD Focus'}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-3 flex-1 justify-end">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search topics (e.g. TinyURL, WhatsApp, Parking)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] rounded-xl text-slate-800 dark:text-white text-xs focus:outline-none focus:border-[#6366F1] cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Workspace: Left Topic List + Right Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Topic List (4 Columns on LG) */}
        <div className="lg:col-span-4 space-y-3 max-h-[900px] overflow-y-auto pr-1">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between pb-1">
            <span>System Design Topics ({summaries.length})</span>
            <span className="text-[10px] text-slate-400 font-mono">Select to explore</span>
          </div>

          {loadingList ? (
            <div className="py-20 text-center text-xs text-slate-400">
              Loading system design catalog...
            </div>
          ) : summaries.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl text-xs text-slate-500 dark:text-slate-400">
              No matching topics found. Try adjusting your search or filters.
            </div>
          ) : (
            summaries.map((s) => {
              const isSelected = s.id === selectedTopicId;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedTopicId(s.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-[#151C2E] border-[#6366F1] shadow-lg shadow-[#6366F1]/10 ring-1 ring-[#6366F1]/30'
                      : 'bg-white dark:bg-[#151C2E]/60 hover:bg-slate-50 dark:hover:bg-[#151C2E] border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6366F1]/15 text-indigo-700 dark:text-[#A78BFA] border border-[#6366F1]/30">
                        HLD
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#06B6D4]/15 text-cyan-800 dark:text-[#06B6D4] border border-[#06B6D4]/30">
                        LLD
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-slate-400 font-mono">
                      {s.difficulty}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold leading-snug mb-1 transition-colors ${
                    isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                  }`}>
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {s.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1E293B]/60 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[180px]">{s.category}</span>
                    <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-[#6366F1]">
                      Explore HLD & LLD <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Pane (8 Columns on LG) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-5 sm:p-7 shadow-2xl min-h-[900px] flex flex-col transition-colors">
          {loadingDetail ? (
            <div className="py-40 text-center text-xs text-slate-400">
              Loading technical blueprint, HLD/LLD points, and diagrams...
            </div>
          ) : !topicDetail ? (
            <div className="py-40 text-center text-xs text-slate-400">
              Select a system design topic from the left catalog to explore its architecture, HLD/LLD points, and working code.
            </div>
          ) : (
            <>
              {/* Detail Header */}
              <div className="pb-5 mb-5 border-b border-slate-200 dark:border-[#1E293B] flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#6366F1]/15 text-indigo-700 dark:text-[#A78BFA] border border-[#6366F1]/30">
                      HLD & LLD Integrated
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-slate-300 font-medium">
                      {topicDetail.category}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 font-bold uppercase">
                      {topicDetail.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {topicDetail.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {topicDetail.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/interview?problem=${topicDetail.id}`}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 hover:opacity-95 transition-all"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Mock Interview</span>
                  </Link>
                  <Link
                    to="/designer"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-[#06B6D4]" />
                    <span>Canvas</span>
                  </Link>
                </div>
              </div>

              {/* Main Perspective Selector: HLD, LLD, Side-by-Side, Interviewer Q&A */}
              <div className="flex border-b border-slate-200 dark:border-[#1E293B] mb-5 overflow-x-auto gap-2 no-scrollbar">
                <button
                  onClick={() => setActivePerspective('hld')}
                  className={`px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activePerspective === 'hld'
                      ? 'border-[#6366F1] text-indigo-600 dark:text-white'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Network className="w-4 h-4 text-[#6366F1]" />
                  <span>🏢 High-Level Design (HLD)</span>
                </button>

                <button
                  onClick={() => setActivePerspective('lld')}
                  className={`px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activePerspective === 'lld'
                      ? 'border-[#06B6D4] text-cyan-600 dark:text-white'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-4 h-4 text-[#06B6D4]" />
                  <span>⚙️ Low-Level Design (LLD)</span>
                </button>

                <button
                  onClick={() => setActivePerspective('side-by-side')}
                  className={`px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activePerspective === 'side-by-side'
                      ? 'border-purple-500 text-purple-600 dark:text-white'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Columns className="w-4 h-4 text-purple-500" />
                  <span>⚡ Compare HLD & LLD</span>
                </button>

                <button
                  onClick={() => setActivePerspective('answers')}
                  className={`px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activePerspective === 'answers'
                      ? 'border-emerald-500 text-emerald-600 dark:text-white'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                  <span>🎯 Interviewer Q&A ({topicDetail.relatedAnswers?.length || 0})</span>
                </button>
              </div>

              {/* ============================================================== */}
              {/* VIEW 1: HIGH-LEVEL DESIGN (HLD) VIEW */}
              {/* ============================================================== */}
              {activePerspective === 'hld' && (
                <div className="space-y-6">
                  {/* HLD Key Points Card */}
                  <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-[#151C2E] border border-indigo-200 dark:border-[#1E293B] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-indigo-900 dark:text-[#A78BFA] uppercase tracking-wider flex items-center gap-2">
                        <Zap className="w-4 h-4 text-indigo-600 dark:text-[#6366F1]" />
                        <span>Core High-Level Design (HLD) Architecture Points</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-mono">
                        Key Scaling & Reliability Checklist
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {hldPoints.map((point, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#0B1020] border border-indigo-100 dark:border-[#1E293B] flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-[#6366F1] flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* HLD Architecture Diagram */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Network className="w-4 h-4 text-[#6366F1]" />
                        <span>High-Level System Architecture Diagram</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1E293B] text-cyan-700 dark:text-[#06B6D4] font-mono">
                        Interactive Topology Flowchart
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] overflow-x-auto shadow-inner">
                      <MermaidViewer chart={topicDetail.systemDesignDiagram} />
                    </div>
                  </div>

                  {/* HLD Request Lifecycle & Architecture Explanation */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] space-y-4 shadow-xs">
                    <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Play className="w-4 h-4 text-amber-500 fill-current" />
                      <span>HLD System Request Flow & Architecture Explanation</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {topicDetail.hldExplanation || topicDetail.description}
                    </p>

                    {/* Step-by-step Request Flow */}
                    {topicDetail.workingSteps && topicDetail.workingSteps.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#1E293B]">
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          End-to-End Request Progression ({topicDetail.workingSteps.length} Steps):
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {topicDetail.workingSteps.map((step) => (
                            <div key={step.stepNumber} className="p-3 rounded-xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-black flex items-center justify-center">
                                    {step.stepNumber}
                                  </span>
                                  {step.component}
                                </span>
                                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{step.latency}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                {step.action}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Deep Dives & Trade-Offs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] space-y-2 shadow-xs">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-cyan-500" /> Key Deep-Dive Topics
                      </div>
                      <ul className="space-y-1.5">
                        {topicDetail.deepDiveTopics?.map((topic, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-cyan-500 mt-0.5">•</span>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] space-y-2 shadow-xs">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-500" /> Architectural Trade-offs
                      </div>
                      <ul className="space-y-1.5">
                        {topicDetail.tradeOffs?.map((trade, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>{trade}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW 2: LOW-LEVEL DESIGN (LLD) VIEW */}
              {/* ============================================================== */}
              {activePerspective === 'lld' && (
                <div className="space-y-6">
                  {/* LLD Key Points Card */}
                  <div className="p-5 rounded-2xl bg-cyan-50/50 dark:bg-[#151C2E] border border-cyan-200 dark:border-[#1E293B] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-cyan-900 dark:text-[#06B6D4] uppercase tracking-wider flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-cyan-600 dark:text-[#06B6D4]" />
                        <span>Core Low-Level Design (LLD) & OOP Points</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 dark:bg-[#06B6D4]/20 text-cyan-800 dark:text-[#06B6D4] font-mono">
                        SOLID & Pattern Architecture
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {lldPoints.map((point, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white dark:bg-[#0B1020] border border-cyan-100 dark:border-[#1E293B] flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-[#06B6D4] flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LLD UML Diagrams (Class & Sequence) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                        <button
                          onClick={() => setUmlSubTab('class')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            umlSubTab === 'class'
                              ? 'bg-[#06B6D4] text-slate-950 shadow-md font-bold'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          UML Class Diagram
                        </button>
                        <button
                          onClick={() => setUmlSubTab('sequence')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            umlSubTab === 'sequence'
                              ? 'bg-[#06B6D4] text-slate-950 shadow-md font-bold'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          UML Sequence Diagram
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">
                        Standard UML Notation
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] overflow-x-auto shadow-inner">
                      {umlSubTab === 'class' ? (
                        <MermaidViewer chart={topicDetail.umlClassDiagram} />
                      ) : (
                        <MermaidViewer chart={topicDetail.umlSequenceDiagram} />
                      )}
                    </div>
                  </div>

                  {/* LLD Working Code Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                        {(['java', 'python', 'cpp', 'go'] as const).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
                              activeLang === lang
                                ? 'bg-[#06B6D4] text-slate-950 shadow-md shadow-[#06B6D4]/30'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {lang === 'cpp' ? 'C++ 20' : lang === 'java' ? 'Java 25' : lang === 'python' ? 'Python 3' : 'Go'}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleCopyCode}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <div className="rounded-2xl bg-slate-900 dark:bg-[#0B1020] border border-slate-800 dark:border-[#1E293B] p-4 overflow-x-auto max-h-[600px] shadow-lg">
                      <pre className="text-xs text-slate-200 font-mono leading-relaxed">
                        <code>{topicDetail.codeOptions[activeLang] || '// No code available for this language'}</code>
                      </pre>
                    </div>
                  </div>

                  {/* LLD Explanation */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] space-y-2 shadow-xs">
                    <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Info className="w-4 h-4 text-cyan-500" />
                      <span>LLD Object-Oriented Architecture & Concurrency Explanation</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {topicDetail.lldExplanation || "The low-level object-oriented design cleanly separates data models from business logic. State encapsulation, immutability where appropriate, and thread-safe concurrent data structures ensure that operations remain lock-free or minimally contested under multi-threaded execution."}
                    </p>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW 3: SIDE-BY-SIDE COMPARE (HLD + LLD) */}
              {/* ============================================================== */}
              {activePerspective === 'side-by-side' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Left Column: HLD Overview */}
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-50/60 dark:bg-[#0B1020]/60 border border-slate-200 dark:border-[#1E293B]">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E293B] pb-2">
                      <span className="text-xs font-black uppercase text-indigo-600 dark:text-[#A78BFA] flex items-center gap-1.5">
                        <Network className="w-4 h-4" /> High-Level Architecture (HLD)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-mono">
                        System Scale
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] overflow-x-auto shadow-inner">
                      <MermaidViewer chart={topicDetail.systemDesignDiagram} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                        Key HLD Points:
                      </div>
                      <ul className="space-y-1">
                        {hldPoints.slice(0, 3).map((p, idx) => (
                          <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-[#6366F1] flex-shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: LLD Overview */}
                  <div className="space-y-4 p-4 rounded-2xl bg-slate-50/60 dark:bg-[#0B1020]/60 border border-slate-200 dark:border-[#1E293B]">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E293B] pb-2">
                      <span className="text-xs font-black uppercase text-cyan-600 dark:text-[#06B6D4] flex items-center gap-1.5">
                        <GitFork className="w-4 h-4" /> Low-Level Design & UML (LLD)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-100 dark:bg-[#06B6D4]/20 text-cyan-800 dark:text-[#06B6D4] font-mono">
                        OOP / SOLID
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] overflow-x-auto shadow-inner">
                      <MermaidViewer chart={topicDetail.umlClassDiagram} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase">
                        Key LLD Points:
                      </div>
                      <ul className="space-y-1">
                        {lldPoints.slice(0, 3).map((p, idx) => (
                          <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* VIEW 4: INTERVIEWER PRESENTATION & FAANG Q&A */}
              {/* ============================================================== */}
              {activePerspective === 'answers' && (
                <div className="space-y-6">
                  {/* Interviewer Delivery Script */}
                  <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-[#151C2E] border border-emerald-200 dark:border-[#1E293B] space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                        <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>45-Minute Interviewer Delivery Script & Strategy</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-mono">
                        FAANG Framework
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#0B1020] border border-emerald-100 dark:border-[#1E293B] space-y-1">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400">1. Clarify Scope (5m)</div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Clarify DAU, read/write ratio, and data retention before jumping to solutions.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-[#0B1020] border border-emerald-100 dark:border-[#1E293B] space-y-1">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400">2. HLD Diagram (15m)</div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Draw client &rarr; CDN &rarr; ALB &rarr; service &rarr; cache &rarr; sharded DB path clearly.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-[#0B1020] border border-emerald-100 dark:border-[#1E293B] space-y-1">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400">3. LLD & UML (15m)</div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Decompose classes, show SOLID interfaces, and explain concurrency locks.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-[#0B1020] border border-emerald-100 dark:border-[#1E293B] space-y-1">
                        <div className="font-bold text-emerald-700 dark:text-emerald-400">4. Bottlenecks (10m)</div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          Address SPOFs, network partitions, failovers, and caching cache misses.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* FAANG Model Questions & Answers */}
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Top FAANG / Tier-1 Tech Interview Follow-up Questions & Model Answers</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {topicDetail.relatedAnswers?.length || 0} Questions
                      </span>
                    </div>

                    <div className="space-y-4">
                      {topicDetail.relatedAnswers?.map((qa, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] space-y-3 shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-start gap-2">
                              <span className="text-emerald-600 dark:text-emerald-400 font-black">Q{idx + 1}:</span>
                              <span>{qa.question}</span>
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 flex-shrink-0">
                              Interviewer Intent
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-purple-50 dark:bg-[#151C2E] border border-purple-200 dark:border-[#1E293B] text-xs text-purple-900 dark:text-purple-200">
                            <strong>Testing:</strong> {qa.interviewerIntent}
                          </div>

                          <div className="space-y-1.5">
                            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              Model Answer & Technical Defense:
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                              {qa.modelAnswer}
                            </p>
                          </div>

                          {qa.keyPoints && qa.keyPoints.length > 0 && (
                            <div className="pt-2 border-t border-slate-200 dark:border-[#1E293B] space-y-1">
                              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                Crucial Checklist to Mention:
                              </div>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                {qa.keyPoints.map((kp, kIdx) => (
                                  <li key={kIdx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                    <span>{kp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicsExplorerPage;
