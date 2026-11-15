import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { ApiResponse } from '../../types';
import { 
  BookOpen, 
  Layers, 
  Network, 
  Database, 
  Server, 
  Cpu, 
  GitBranch, 
  Radio, 
  Boxes, 
  ShieldCheck, 
  Cloud, 
  Activity, 
  Shapes, 
  Calculator,
  Clock,
  ChevronRight,
  Search,
  Sparkles,
  Loader2
} from 'lucide-react';

interface TopicSummary {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  difficulty: string;
  sequenceOrder: number;
  subtopics: string[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  sequenceOrder: number;
  estimatedHours: number;
  topicCount: number;
  topics: TopicSummary[];
}

const iconMap: Record<string, React.ReactNode> = {
  Layers: <Layers className="w-6 h-6" />,
  Network: <Network className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Server: <Server className="w-6 h-6" />,
  Cpu: <Cpu className="w-6 h-6" />,
  GitBranch: <GitBranch className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
  Boxes: <Boxes className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Cloud: <Cloud className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Shapes: <Shapes className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
};

export const CurriculumListPage: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await apiClient.get<any, ApiResponse<Module[]>>('/curriculum/modules');
        if (res.success && res.data) {
          setModules(res.data);
        }
      } catch (err) {
        console.error('Error fetching curriculum:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const filteredModules = modules.map((mod) => {
    const matchingTopics = mod.topics.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiff = selectedDifficulty === 'ALL' || t.difficulty === selectedDifficulty;
      return matchesSearch && matchesDiff;
    });
    return { ...mod, matchingTopics };
  }).filter((mod) => searchQuery === '' && selectedDifficulty === 'ALL' ? true : mod.matchingTopics.length > 0);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-medium text-[#06B6D4] mb-2">
            <Sparkles className="w-3.5 h-3.5" /> 13 Structured Modules
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Design Curriculum</h1>
          <p className="text-slate-400 text-sm mt-1">
            Comprehensive roadmap from fundamentals to Staff & Principal distributed architecture.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search topics (e.g. CAP, Kafka)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#151C2E] border border-[#1E293B] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] w-64"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-[#151C2E] border border-[#1E293B] rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
          >
            <option value="ALL">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="SENIOR">Senior</option>
            <option value="STAFF">Staff</option>
            <option value="PRINCIPAL">Principal</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
        </div>
      ) : (
        <div className="space-y-6">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 transition-all hover:border-[#334155]"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center font-bold">
                    {iconMap[mod.icon] || <BookOpen className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#A78BFA] tracking-wider uppercase">
                      Module {mod.sequenceOrder}
                    </div>
                    <h2 className="text-xl font-bold text-white">{mod.title}</h2>
                    <p className="text-slate-400 text-xs mt-0.5">{mod.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 bg-[#0B1020] px-3 py-1.5 rounded-xl border border-[#1E293B]">
                  <Clock className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>~{mod.estimatedHours} hrs</span>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {(mod.matchingTopics || mod.topics).map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/curriculum/topic/${topic.id}`}
                    className="p-4 rounded-xl bg-[#0B1020] border border-[#1E293B] hover:border-[#6366F1]/50 hover:bg-[#1E293B]/40 transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-[#A78BFA] transition-colors">
                          {topic.title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          topic.difficulty === 'PRINCIPAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          topic.difficulty === 'STAFF' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          topic.difficulty === 'SENIOR' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {topic.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{topic.summary}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurriculumListPage;
