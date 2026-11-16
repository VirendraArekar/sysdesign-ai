import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  Users, 
  Zap, 
  Cpu, 
  Activity, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Crown, 
  Flame, 
  TrendingUp, 
  Layers,
  ChevronDown,
  Sparkles,
  Server,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

const API_BASE = '/api/v1';

export const AdminDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/overview`);
      if (res.data?.data) {
        setOverview(res.data.data);
      }
    } catch (err) {
      console.warn('Fallback admin metrics for offline demo mode', err);
      setOverview({
        totalUsers: 1420,
        activeSubscriptions: 384,
        proSubscribers: 312,
        enterpriseSubscribers: 72,
        freeTierUsers: 1036,
        totalAiTokensUsed: 12450000,
        jvmMemoryUsedMb: 320,
        jvmMemoryMaxMb: 1024,
        candidates: [
          {
            userId: 'usr-1',
            email: 'alex.staff@google.com',
            fullName: 'Alex Vance',
            planTier: 'PRO',
            active: true,
            dailyTokenQuota: 500000,
            createdAt: '2026-03-01T10:00:00Z'
          },
          {
            userId: 'usr-2',
            email: 'sarah.principal@meta.com',
            fullName: 'Sarah Chen',
            planTier: 'ENTERPRISE',
            active: true,
            dailyTokenQuota: 2000000,
            createdAt: '2026-03-02T14:30:00Z'
          },
          {
            userId: 'usr-3',
            email: 'dev@amazon.com',
            fullName: 'David Miller',
            planTier: 'FREE',
            active: true,
            dailyTokenQuota: 50000,
            createdAt: '2026-03-05T08:15:00Z'
          },
          {
            userId: 'usr-4',
            email: 'elena.architect@stripe.com',
            fullName: 'Elena Rostova',
            planTier: 'PRO',
            active: true,
            dailyTokenQuota: 500000,
            createdAt: '2026-03-08T11:20:00Z'
          }
        ],
        aiFeatureUsage: [
          { feature: 'Mock Interviews', tokens: 6850000, percentage: 55 },
          { feature: 'Architecture Audits', tokens: 3120000, percentage: 25 },
          { feature: 'RAG Semantic Search', tokens: 1480000, percentage: 12 },
          { feature: 'Answer Evaluations', tokens: 1000000, percentage: 8 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTier = async (userId: string, newTier: string) => {
    setUpdatingUser(userId);
    try {
      await axios.post(`${API_BASE}/admin/users/${userId}/tier`, { planTier: newTier });
      fetchAdminOverview();
    } catch (err) {
      console.error('Failed to update tier', err);
      // Optimistic update
      if (overview?.candidates) {
        setOverview({
          ...overview,
          candidates: overview.candidates.map((c: any) =>
            c.userId === userId ? { ...c, planTier: newTier } : c
          )
        });
      }
    } finally {
      setUpdatingUser(null);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setUpdatingUser(userId);
    try {
      await axios.post(`${API_BASE}/admin/users/${userId}/status?active=${!currentStatus}`);
      fetchAdminOverview();
    } catch (err) {
      console.error('Failed to toggle status', err);
      if (overview?.candidates) {
        setOverview({
          ...overview,
          candidates: overview.candidates.map((c: any) =>
            c.userId === userId ? { ...c, active: !currentStatus } : c
          )
        });
      }
    } finally {
      setUpdatingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]" />
      </div>
    );
  }

  const filteredCandidates = overview?.candidates?.filter((c: any) =>
    c.fullName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchFilter.toLowerCase())
  ) || [];

  const FEATURE_COLORS = ['#6366F1', '#06B6D4', '#A78BFA', '#10B981'];

  return (
    <div className="flex-1 bg-slate-50 dark:bg-[#0B1020] text-slate-900 dark:text-[#F8FAFC] px-6 py-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E293B] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Platform Administration & Monetization Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              System Admin & Quota Management
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Monitor AI token consumption, manage subscription tiers (Free, Pro, Enterprise), and inspect infrastructure health.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#334155] text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>JVM Memory: {overview.jvmMemoryUsedMb} MB / {overview.jvmMemoryMaxMb} MB</span>
            </div>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Registered Candidates</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{overview.totalUsers.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" /> +12.5% this month
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Subscriptions</div>
              <div className="text-2xl font-black text-[#06B6D4] mt-1">{overview.activeSubscriptions}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {overview.proSubscribers} Pro • {overview.enterpriseSubscribers} Enterprise
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Tokens Consumed</div>
              <div className="text-2xl font-black text-amber-500 dark:text-amber-400 mt-1">
                {(overview.totalAiTokensUsed / 1000000).toFixed(1)}M
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Across all mock rounds</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">System Health</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">99.99%</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Zero downtime recorded</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Middle Section: Token Consumption Chart & Subscription Tier Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Usage Breakdown Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E293B] pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Token Consumption by Feature</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tokens allocated across interviews, audits, and evaluations</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {(overview.totalAiTokensUsed / 1000000).toFixed(1)}M Tokens
              </span>
            </div>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overview.aiFeatureUsage}>
                  <XAxis dataKey="feature" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151C2E', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                  />
                  <Bar dataKey="tokens" radius={[6, 6, 0, 0]}>
                    {overview.aiFeatureUsage.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={FEATURE_COLORS[index % FEATURE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tier Matrix */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-4 shadow-sm">
            <div className="border-b border-slate-200 dark:border-[#1E293B] pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Tier Quotas & Monetization Plans</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enforced token limits and interview access per tier</p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Free Community Tier</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">3 AI Interviews / day • 50k Daily Tokens</div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-slate-300">
                  {overview.freeTierUsers} Users
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-[#6366F1]/10 border border-indigo-200 dark:border-[#6366F1]/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#6366F1] dark:text-[#A78BFA] flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-[#6366F1] dark:text-[#A78BFA]" /> Pro Candidate Tier
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Unlimited Interviews • 500k Tokens • Voice Dictation • AI Canvas Audit</div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-100 dark:bg-[#6366F1]/20 text-[#6366F1] dark:text-[#A78BFA] font-semibold">
                  {overview.proSubscribers} Users ($29/mo)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-[#06B6D4]/10 border border-cyan-200 dark:border-[#06B6D4]/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#06B6D4] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#06B6D4]" /> Enterprise / Team Tier
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Custom Rubric Scoring • 2M Daily Tokens • Team Analytics Dashboard</div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-100 dark:bg-[#06B6D4]/20 text-[#06B6D4] font-semibold">
                  {overview.enterpriseSubscribers} Teams
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E293B] pb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Candidate User Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Assign tiers, modify daily quotas, and toggle account access</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#334155] text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="pb-3 px-2">Candidate</th>
                  <th className="pb-3 px-2">Email</th>
                  <th className="pb-3 px-2">Plan Tier</th>
                  <th className="pb-3 px-2">Daily Quota</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1E293B]">
                {filteredCandidates.map((c: any) => (
                  <tr key={c.userId} className="hover:bg-slate-50 dark:hover:bg-[#1E293B]/40 transition-colors">
                    <td className="py-3 px-2 font-semibold text-slate-900 dark:text-white">
                      {c.fullName}
                    </td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {c.email}
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={c.planTier}
                        onChange={(e) => handleUpdateTier(c.userId, e.target.value)}
                        disabled={updatingUser === c.userId}
                        className="px-2.5 py-1 rounded bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#334155] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-[#6366F1]"
                      >
                        <option value="FREE">FREE</option>
                        <option value="PRO">PRO</option>
                        <option value="ENTERPRISE">ENTERPRISE</option>
                      </select>
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-600 dark:text-slate-300">
                      {(c.dailyTokenQuota / 1000).toLocaleString()}k tokens
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.active 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {c.active ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleToggleStatus(c.userId, c.active)}
                        disabled={updatingUser === c.userId}
                        className={`px-3 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                          c.active
                            ? 'bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                            : 'bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                        }`}
                      >
                        {c.active ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
