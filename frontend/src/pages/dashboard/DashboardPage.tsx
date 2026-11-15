import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { 
  Bot, 
  BookOpen, 
  Network, 
  Calculator, 
  Flame, 
  Clock, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Target
} from 'lucide-react';

const API_BASE = '/api/v1';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      const res = await axios.get(`${API_BASE}/analytics/dashboard`);
      if (res.data?.data) {
        setMetrics(res.data.data);
      }
    } catch (err) {
      console.warn('Using client fallback metrics', err);
      // Fallback default state for offline/guest mode
      setMetrics({
        readinessScore: 84,
        readinessLevel: 'Staff / Principal Architect (L6 / L7 Level)',
        currentStreakDays: 5,
        totalHoursLearned: 24.5,
        completedTopicsCount: 18,
        totalTopicsCount: 40,
        mockInterviewsCompleted: 6,
        averageInterviewScore: 86.5,
        architecturesDesignedCount: 4,
        skillRadar: [
          { skill: 'Requirements & Scope', score: 88, benchmark: 85 },
          { skill: 'Capacity Sizing', score: 94, benchmark: 80 },
          { skill: 'DB Architecture', score: 86, benchmark: 80 },
          { skill: 'Scalability & Sharding', score: 92, benchmark: 85 },
          { skill: 'Caching & CDN', score: 95, benchmark: 90 },
          { skill: 'Messaging & Queues', score: 88, benchmark: 80 },
          { skill: 'Fault Tolerance & SLA', score: 85, benchmark: 85 },
          { skill: 'Trade-Off Analysis', score: 90, benchmark: 85 }
        ],
        weeklyActivity: [
          { day: 'Mon', hours: 2.5, topics: 3 },
          { day: 'Tue', hours: 1.8, topics: 2 },
          { day: 'Wed', hours: 3.2, topics: 4 },
          { day: 'Thu', hours: 2.0, topics: 2 },
          { day: 'Fri', hours: 4.0, topics: 5 },
          { day: 'Sat', hours: 3.5, topics: 4 },
          { day: 'Sun', hours: 1.5, topics: 1 }
        ],
        recommendedNextSteps: [
          {
            title: 'Practice Google HLD: Distributed In-Memory Cache',
            type: 'INTERVIEW',
            link: '/interview',
            reason: 'Strengthen cache invalidation & eviction algorithms'
          },
          {
            title: 'Review Topic: Kafka Consumer Rebalancing & Partition Lag',
            type: 'CURRICULUM',
            link: '/curriculum',
            reason: 'High-frequency interview topic at Netflix and Uber'
          },
          {
            title: 'Design Uber Dispatch Architecture in Visual Designer',
            type: 'DESIGNER',
            link: '/designer',
            reason: 'Audit Geospatial H3 indexing for single points of failure'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]" />
      </div>
    );
  }

  const data = metrics;

  return (
    <div className="flex-1 bg-[#0B1020] text-[#F8FAFC] px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome & Readiness Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 text-xs font-semibold text-[#A78BFA] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>Target: Staff & Principal Software Engineer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              System Design Candidate Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Comprehensive analytics, 15-category skill breakdown, and AI interview readiness tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/interview"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-[#6366F1]/20 flex items-center gap-2 transition-all"
            >
              <Bot className="w-4 h-4 text-[#06B6D4]" />
              <span>New AI Mock Interview</span>
            </Link>
            <Link
              to="/designer"
              className="px-4 py-2 rounded-xl bg-[#151C2E] hover:bg-[#1E293B] border border-[#334155] text-xs font-medium text-slate-200 flex items-center gap-2 transition-all"
            >
              <Network className="w-4 h-4 text-[#A78BFA]" />
              <span>Open Designer</span>
            </Link>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#151C2E] border border-[#1E293B] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Daily Streak</div>
              <div className="text-2xl font-black text-white mt-1 flex items-center gap-1.5">
                <span>{data.currentStreakDays}</span>
                <span className="text-xs font-medium text-slate-400">days</span>
              </div>
              <div className="text-[11px] text-amber-400 flex items-center gap-1 mt-1 font-medium">
                <Flame className="w-3.5 h-3.5" /> Keep momentum going
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#151C2E] border border-[#1E293B] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Study Time</div>
              <div className="text-2xl font-black text-white mt-1 flex items-center gap-1.5">
                <span>{data.totalHoursLearned}</span>
                <span className="text-xs font-medium text-slate-400">hours</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Across 13 modules</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#151C2E] border border-[#1E293B] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Curriculum Progress</div>
              <div className="text-2xl font-black text-[#A78BFA] mt-1 flex items-center gap-1.5">
                <span>{data.completedTopicsCount}</span>
                <span className="text-xs font-medium text-slate-400">/ {data.totalTopicsCount}</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 font-medium">
                {Math.round((data.completedTopicsCount / data.totalTopicsCount) * 100)}% Mastered
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#151C2E] border border-[#1E293B] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">Mock Interview Avg</div>
              <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-1.5">
                <span>{data.averageInterviewScore}</span>
                <span className="text-xs font-medium text-slate-400">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{data.mockInterviewsCompleted} full interviews taken</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Readiness Gauge & Skill Radar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Readiness Score Card (1 col) */}
          <div className="p-6 rounded-2xl bg-[#151C2E] border border-[#1E293B] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Target className="w-4 h-4 text-[#06B6D4]" />
                <span>Overall Interview Readiness</span>
              </div>

              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-36 h-36 rounded-full border-8 border-[#6366F1] bg-[#0B1020] shadow-2xl shadow-[#6366F1]/30">
                  <div>
                    <span className="text-4xl font-black text-white">{data.readinessScore}</span>
                    <span className="text-sm text-slate-400 block font-normal">out of 100</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-base font-bold text-white">{data.readinessLevel}</div>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Benchmarked against Staff level expectations at Google (L6), Meta (E6), Amazon (L6), and Netflix.
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-breakdown bars */}
            <div className="space-y-3 pt-4 border-t border-[#1E293B] text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Curriculum Mastery (35%)</span>
                  <span className="font-mono text-emerald-400">
                    {Math.round((data.completedTopicsCount / data.totalTopicsCount) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#0B1020] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(data.completedTopicsCount / data.totalTopicsCount) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Mock Interview Performance (45%)</span>
                  <span className="font-mono text-[#06B6D4]">{data.averageInterviewScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0B1020] rounded-full overflow-hidden">
                  <div className="h-full bg-[#06B6D4] rounded-full" style={{ width: `${data.averageInterviewScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Architecture Designer Depth (20%)</span>
                  <span className="font-mono text-[#A78BFA]">{Math.min(100, data.architecturesDesignedCount * 25)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0B1020] rounded-full overflow-hidden">
                  <div className="h-full bg-[#A78BFA] rounded-full" style={{ width: `${Math.min(100, data.architecturesDesignedCount * 25)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Skill Radar Chart (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#151C2E] border border-[#1E293B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <h3 className="font-bold text-white text-base">System Design Competency Radar</h3>
                <p className="text-xs text-slate-400">
                  Scores across 8 foundational pillars vs. Staff Architect benchmark.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" /> Candidate Score
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" /> Staff Benchmark
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data.skillRadar}>
                  <PolarGrid stroke="#1E293B" />
                  <PolarAngleAxis dataKey="skill" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis stroke="#334155" domain={[0, 100]} />
                  <Radar name="Candidate" dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                  <Radar name="Benchmark" dataKey="benchmark" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Weekly Activity & Recommended Next Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Learning Hours Bar Chart */}
          <div className="p-6 rounded-2xl bg-[#151C2E] border border-[#1E293B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Weekly Study Velocity</h3>
                <p className="text-xs text-slate-400">Hours invested per day over the current week</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                18.5 hrs Total
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyActivity}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} unit="h" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151C2E', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                  />
                  <Bar dataKey="hours" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Recommended Next Steps */}
          <div className="p-6 rounded-2xl bg-[#151C2E] border border-[#1E293B] space-y-4">
            <div className="border-b border-[#1E293B] pb-3">
              <h3 className="font-bold text-white text-base">AI Personalized Roadmap</h3>
              <p className="text-xs text-slate-400">Recommended high-leverage activities based on your weak areas</p>
            </div>

            <div className="space-y-3">
              {data.recommendedNextSteps?.map((step: any, idx: number) => (
                <Link
                  key={idx}
                  to={step.link}
                  className="p-3.5 rounded-xl bg-[#1E293B]/60 hover:bg-[#1E293B] border border-[#334155]/60 hover:border-[#6366F1] flex items-center justify-between transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#6366F1]/20 text-[#A78BFA] uppercase">
                        {step.type}
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-[#06B6D4] transition-colors">
                        {step.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {step.reason}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access Tools Grid */}
        <div className="pt-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick Exploration Launchpad
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/curriculum"
              className="p-4 rounded-xl bg-[#151C2E] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#6366F1] transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm text-white">13 Curriculum Modules</div>
              <div className="text-xs text-slate-400 mt-0.5">CAP theorem, Kafka, Sharding</div>
            </Link>

            <Link
              to="/hld"
              className="p-4 rounded-xl bg-[#151C2E] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#06B6D4] transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm text-white">40+ HLD Blueprints</div>
              <div className="text-xs text-slate-400 mt-0.5">TinyURL, Netflix, Uber, WhatsApp</div>
            </Link>

            <Link
              to="/designer"
              className="p-4 rounded-xl bg-[#151C2E] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#A78BFA] transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#A78BFA]/10 text-[#A78BFA] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Network className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm text-white">Architecture Canvas</div>
              <div className="text-xs text-slate-400 mt-0.5">Drag-and-drop & AI audits</div>
            </Link>

            <Link
              to="/simulators"
              className="p-4 rounded-xl bg-[#151C2E] hover:bg-[#1E293B] border border-[#1E293B] hover:border-emerald-400 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="font-semibold text-sm text-white">18 Live Simulators</div>
              <div className="text-xs text-slate-400 mt-0.5">QPS, Little's Law, Bloom filter</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
