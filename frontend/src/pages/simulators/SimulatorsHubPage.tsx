import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { 
  Calculator, 
  Activity, 
  Layers, 
  Radio, 
  Database, 
  Network, 
  ShieldAlert, 
  HardDrive, 
  Zap, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  Clock,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Sliders,
  ChevronDown
} from 'lucide-react';

const API_BASE = '/api/v1';

export const SimulatorsHubPage: React.FC = () => {
  const [activeSuite, setActiveSuite] = useState<'capacity' | 'algorithms' | 'resilience' | 'storage'>('capacity');

  // --- Suite 1: Capacity & Estimation State ---
  const [dau, setDau] = useState<number>(50000000); // 50M
  const [actionsPerUser, setActionsPerUser] = useState<number>(20);
  const [readWriteRatio, setReadWriteRatio] = useState<number>(10); // 10:1
  const [peakMultiplier, setPeakMultiplier] = useState<number>(2.5);
  const [payloadSizeKb, setPayloadSizeKb] = useState<number>(2);
  const [retentionYears, setRetentionYears] = useState<number>(5);
  const [replicationFactor, setReplicationFactor] = useState<number>(3);
  const [slaPercent, setSlaPercent] = useState<number>(99.99); // Four Nines
  const [arrivalRps, setArrivalRps] = useState<number>(10000);
  const [latencyMs, setLatencyMs] = useState<number>(45);
  const [podCapacity, setPodCapacity] = useState<number>(200);

  // Derived calculations for Capacity
  const totalDailyRequests = dau * actionsPerUser;
  const avgQps = Math.round(totalDailyRequests / 86400);
  const peakQps = Math.round(avgQps * peakMultiplier);
  const writeFraction = 1 / (1 + readWriteRatio);
  const readFraction = readWriteRatio / (1 + readWriteRatio);
  const readQps = Math.round(peakQps * readFraction);
  const writeQps = Math.round(peakQps * writeFraction);
  const dailyStorageGb = Math.round(((totalDailyRequests * writeFraction * payloadSizeKb * 1024 * replicationFactor) / (1024 * 1024 * 1024)) * 100) / 100;
  const fiveYearStorageTb = Math.round(((dailyStorageGb * 365 * retentionYears) / 1024) * 100) / 100;
  const cacheRamGb = Math.round((((totalDailyRequests * readFraction * payloadSizeKb * 1024) * 0.20) / (1024 * 1024 * 1024)) * 100) / 100;

  // SLA Downtime calculations
  const downtimeFraction = 1 - (slaPercent / 100);
  const yearlyDowntimeMin = Math.round(((31557600 * downtimeFraction) / 60) * 100) / 100;
  const monthlyDowntimeMin = Math.round((yearlyDowntimeMin / 12) * 100) / 100;
  const dailyDowntimeSec = Math.round((86400 * downtimeFraction) * 100) / 100;

  // Little's Law
  const concurrentInFlight = Math.round((arrivalRps * (latencyMs / 1000)) * 10) / 10;
  const recommendedPods = Math.max(2, Math.ceil(concurrentInFlight / (podCapacity * 0.70)));

  // --- Suite 2: Consistent Hashing State ---
  const [ringNodes, setRingNodes] = useState<string[]>(['Server-A', 'Server-B', 'Server-C', 'Server-D']);
  const [virtualNodesSlider, setVirtualNodesSlider] = useState<number>(3);
  const [testKeysList, setTestKeysList] = useState<string[]>(['usr_101', 'usr_102', 'usr_103', 'usr_104', 'usr_105', 'usr_106', 'usr_107', 'usr_108']);

  // Simple ring positions for visualizer
  const ringAngles = useMemo(() => {
    return ringNodes.map((node, idx) => ({
      name: node,
      angle: (idx / ringNodes.length) * 360,
      color: ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#A78BFA'][idx % 6]
    }));
  }, [ringNodes]);

  // --- Suite 3: Resilience (Rate Limiter & Circuit Breaker) ---
  const [tokenBucketCapacity, setTokenBucketCapacity] = useState<number>(10);
  const [currentTokens, setCurrentTokens] = useState<number>(10);
  const [rateLimiterLog, setRateLimiterLog] = useState<{ id: number; status: 'ALLOWED' | 'REJECTED'; time: string }[]>([]);

  // Circuit Breaker
  const [cbState, setCbState] = useState<'CLOSED' | 'OPEN' | 'HALF_OPEN'>('CLOSED');
  const [cbFailures, setCbFailures] = useState<number>(0);
  const [cbSuccesses, setCbSuccesses] = useState<number>(0);

  const triggerRateLimitRequest = () => {
    const now = new Date().toLocaleTimeString();
    if (currentTokens > 0) {
      setCurrentTokens(prev => prev - 1);
      setRateLimiterLog(prev => [{ id: Date.now(), status: 'ALLOWED', time: now }, ...prev.slice(0, 7)]);
    } else {
      setRateLimiterLog(prev => [{ id: Date.now(), status: 'REJECTED', time: now }, ...prev.slice(0, 7)]);
    }
  };

  // Refill tokens periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTokens(prev => Math.min(tokenBucketCapacity, prev + 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [tokenBucketCapacity]);

  // Circuit breaker actions
  const recordCbCall = (success: boolean) => {
    if (cbState === 'CLOSED') {
      if (!success) {
        const newFailures = cbFailures + 1;
        setCbFailures(newFailures);
        if (newFailures >= 3) {
          setCbState('OPEN');
          setCbFailures(0);
        }
      } else {
        setCbFailures(0);
      }
    } else if (cbState === 'HALF_OPEN') {
      if (success) {
        const newSuccess = cbSuccesses + 1;
        setCbSuccesses(newSuccess);
        if (newSuccess >= 2) {
          setCbState('CLOSED');
          setCbSuccesses(0);
        }
      } else {
        setCbState('OPEN');
        setCbSuccesses(0);
      }
    }
  };

  // --- Suite 4: Cache Eviction & Bloom Filter ---
  const [cacheItems, setCacheItems] = useState<{ key: string; val: string }[]>([
    { key: 'user:1', val: 'Alice' },
    { key: 'user:2', val: 'Bob' },
    { key: 'user:3', val: 'Charlie' }
  ]);
  const [bloomItems, setBloomItems] = useState<string[]>(['apple', 'google', 'meta']);
  const [bloomQuery, setBloomQuery] = useState<string>('netflix');
  const [bloomQueryResult, setBloomQueryResult] = useState<string | null>(null);

  const putLruItem = (k: string, v: string) => {
    setCacheItems(prev => {
      const filtered = prev.filter(i => i.key !== k);
      const updated = [{ key: k, val: v }, ...filtered];
      return updated.slice(0, 4); // Max 4 capacity
    });
  };

  const checkBloom = (item: string) => {
    const lower = item.toLowerCase().trim();
    if (bloomItems.includes(lower)) {
      setBloomQueryResult('PROBABLY IN SET (Hash Match)');
    } else {
      setBloomQueryResult('DEFINITELY NOT IN SET');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0B1020] text-slate-900 dark:text-[#F8FAFC] transition-colors">
      {/* Top Banner Header */}
      <div className="border-b border-slate-200 dark:border-[#1E293B] bg-white dark:bg-[#151C2E] px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 text-xs font-semibold text-[#6366F1] dark:text-[#A78BFA] mb-2">
              <Calculator className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>18 Production Simulators & Distributed Calculation Engines</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              System Design Simulators & Calculators
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Model real-world traffic scaling, consistent hashing rings, token-bucket rate limiters, 
              circuit breakers, Little's law thread concurrency, and SLA downtime budgets.
            </p>
          </div>

          {/* Suite Switcher Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
            <button
              onClick={() => setActiveSuite('capacity')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeSuite === 'capacity'
                  ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" /> Capacity & Estimation
            </button>
            <button
              onClick={() => setActiveSuite('algorithms')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeSuite === 'algorithms'
                  ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Network className="w-4 h-4" /> Consistent Hashing & Ring
            </button>
            <button
              onClick={() => setActiveSuite('resilience')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeSuite === 'resilience'
                  ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" /> Rate Limiter & Circuit Breaker
            </button>
            <button
              onClick={() => setActiveSuite('storage')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeSuite === 'storage'
                  ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" /> Cache LRU & Bloom Filter
            </button>
          </div>
        </div>
      </div>

      {/* Main Suite Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8">

        {/* ========================================================================= */}
        {/* SUITE 1: CAPACITY, QPS, STORAGE, SLA & LITTLE'S LAW */}
        {/* ========================================================================= */}
        {activeSuite === 'capacity' && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Average QPS</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{avgQps.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Based on {dau / 1000000}M DAU</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Peak Traffic QPS</div>
                <div className="text-2xl font-black text-[#06B6D4] mt-1">{peakQps.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{peakMultiplier}x Peak Multiplier</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Daily Storage Growth</div>
                <div className="text-2xl font-black text-[#6366F1] dark:text-[#A78BFA] mt-1">{dailyStorageGb} GB</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{replicationFactor}x Replication Factor</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">5-Year Storage Capacity</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{fiveYearStorageTb} TB</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{retentionYears} Years Data Retention</div>
              </div>
            </div>

            {/* Interactive Calculators Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tool 1 & 2: QPS & Storage Sliders */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E293B] pb-3">
                  <Calculator className="w-5 h-5 text-[#6366F1]" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">QPS & Storage Sizing Engine</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                      <span>Daily Active Users (DAU)</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{(dau / 1000000).toFixed(0)} Million</span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={500000000}
                      step={5000000}
                      value={dau}
                      onChange={(e) => setDau(Number(e.target.value))}
                      className="w-full accent-[#6366F1]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                      <span>Actions per User / Day</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{actionsPerUser}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={actionsPerUser}
                      onChange={(e) => setActionsPerUser(Number(e.target.value))}
                      className="w-full accent-[#6366F1]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                      <span>Read : Write Ratio</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{readWriteRatio} : 1 ({Math.round(readFraction * 100)}% Reads)</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={readWriteRatio}
                      onChange={(e) => setReadWriteRatio(Number(e.target.value))}
                      className="w-full accent-[#06B6D4]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                      <span>Peak Traffic Multiplier</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{peakMultiplier}x</span>
                    </div>
                    <input
                      type="range"
                      min={1.2}
                      max={5.0}
                      step={0.1}
                      value={peakMultiplier}
                      onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                      className="w-full accent-[#A78BFA]"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-[#1E293B] grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Peak Read Throughput</div>
                      <div className="text-lg font-bold text-[#06B6D4]">{readQps.toLocaleString()} QPS</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Peak Write Throughput</div>
                      <div className="text-lg font-bold text-[#F43F5E]">{writeQps.toLocaleString()} QPS</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Tool 4 & 5: Cache RAM & SLA Downtime Budget */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E293B] pb-3">
                  <Clock className="w-5 h-5 text-[#06B6D4]" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">High Availability SLA & Cache RAM</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                      <span>Service Level Agreement (SLA)</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{slaPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={99.0}
                      max={99.999}
                      step={0.001}
                      value={slaPercent}
                      onChange={(e) => setSlaPercent(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  {/* Downtime Budget Cards */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Yearly Downtime</div>
                      <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">{yearlyDowntimeMin} min</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Monthly Downtime</div>
                      <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">{monthlyDowntimeMin} min</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Daily Downtime</div>
                      <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">{dailyDowntimeSec} sec</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#1E293B]/70 border border-slate-200 dark:border-[#334155] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Recommended Redis RAM (80/20 Rule)</span>
                      <span className="font-mono font-bold text-[#6366F1] dark:text-[#A78BFA]">{cacheRamGb} GB</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      By caching the top 20% most active read items (Pareto Principle), your Redis cluster can satisfy 80% of read traffic directly from memory, eliminating database load.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool 7: Little's Law Concurrency & Worker Sizing */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Little's Law Concurrency & Pod Sizing</h3>
                </div>
                <div className="font-mono text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-slate-300">
                  Formula: L = λ × W
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Arrival Rate (λ in RPS): <strong className="text-slate-900 dark:text-white">{arrivalRps.toLocaleString()}</strong></label>
                  <input
                    type="range"
                    min={1000}
                    max={100000}
                    step={1000}
                    value={arrivalRps}
                    onChange={(e) => setArrivalRps(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Average Latency (W in ms): <strong className="text-slate-900 dark:text-white">{latencyMs} ms</strong></label>
                  <input
                    type="range"
                    min={5}
                    max={500}
                    step={5}
                    value={latencyMs}
                    onChange={(e) => setLatencyMs(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Threads / Pod: <strong className="text-slate-900 dark:text-white">{podCapacity}</strong></label>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    step={10}
                    value={podCapacity}
                    onChange={(e) => setPodCapacity(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Concurrent Requests In Flight (L)</div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{concurrentInFlight.toLocaleString()} concurrent requests</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Recommended Pod Replicas</div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{recommendedPods} Pods (70% Max Thread Load)</div>
                </div>
              </div>
            </div>

            {/* Tool 8: Latency Numbers Every Programmer Should Know */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E293B] pb-3">
                <Info className="w-5 h-5 text-[#6366F1]" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Latency Numbers Every Engineer Must Know</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-center">
                  <div className="font-semibold text-slate-900 dark:text-white">L1 Cache</div>
                  <div className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">1 ns</div>
                  <div className="text-[10px] text-slate-500">Fastest CPU</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-center">
                  <div className="font-semibold text-slate-900 dark:text-white">RAM Access</div>
                  <div className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">100 ns</div>
                  <div className="text-[10px] text-slate-500">100x slower L1</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-center">
                  <div className="font-semibold text-slate-900 dark:text-white">NVMe SSD Read</div>
                  <div className="text-base font-mono font-bold text-[#06B6D4] mt-1">16 µs</div>
                  <div className="text-[10px] text-slate-500">Solid State Disk</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-center">
                  <div className="font-semibold text-slate-900 dark:text-white">Datacenter RTT</div>
                  <div className="text-base font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">500 µs</div>
                  <div className="text-[10px] text-slate-500">0.5 ms Local Net</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-center">
                  <div className="font-semibold text-slate-900 dark:text-white">Cross-Country RTT</div>
                  <div className="text-base font-mono font-bold text-rose-600 dark:text-rose-400 mt-1">150 ms</div>
                  <div className="text-[10px] text-slate-500">SF to NYC Speed</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-center">
                  <div className="font-semibold text-slate-900 dark:text-white">HDD Seek Time</div>
                  <div className="text-base font-mono font-bold text-rose-600 dark:text-rose-400 mt-1">10 ms</div>
                  <div className="text-[10px] text-slate-500">Mechanical arm</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUITE 2: CONSISTENT HASHING RING VISUALIZER */}
        {/* ========================================================================= */}
        {activeSuite === 'algorithms' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E293B] pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Consistent Hashing Ring Visualizer</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Visualize 360° circular key distribution, virtual node placement, and minimal key remapping when adding/removing servers.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const nextChar = String.fromCharCode(65 + ringNodes.length);
                      if (ringNodes.length < 8) {
                        setRingNodes([...ringNodes, `Server-${nextChar}`]);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    + Add Server Node
                  </button>

                  <button
                    onClick={() => {
                      if (ringNodes.length > 2) {
                        setRingNodes(ringNodes.slice(0, -1));
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-[#1E293B] hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-500/30 transition-all"
                  >
                    - Remove Node
                  </button>
                </div>
              </div>

              {/* Ring Canvas Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* SVG Circular Ring */}
                <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0B1020] rounded-2xl border border-slate-200 dark:border-[#1E293B]">
                  <svg width="320" height="320" viewBox="0 0 320 320" className="overflow-visible">
                    {/* Background Ring */}
                    <circle cx="160" cy="160" r="120" fill="none" stroke="#CBD5E1" strokeWidth="12" className="dark:stroke-[#1E293B]" />
                    <circle cx="160" cy="160" r="120" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" className="dark:stroke-[#334155]" />

                    {/* Nodes positioned along the circle */}
                    {ringAngles.map((node, i) => {
                      const rad = (node.angle * Math.PI) / 180;
                      const x = 160 + 120 * Math.cos(rad);
                      const y = 160 + 120 * Math.sin(rad);

                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="16" fill={node.color} stroke="#FFFFFF" strokeWidth="3" className="dark:stroke-[#0B1020] transition-all duration-300" />
                          <text x={x} y={y + 4} textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                            {node.name.slice(-1)}
                          </text>
                          <text x={x} y={y < 160 ? y - 22 : y + 30} textAnchor="middle" fill={node.color} fontSize="11" fontWeight="600">
                            {node.name}
                          </text>
                        </g>
                      );
                    })}

                    {/* Center Ring Label */}
                    <text x="160" y="155" textAnchor="middle" fill="#0F172A" className="dark:fill-[#F8FAFC]" fontSize="13" fontWeight="bold">
                      Hash Space
                    </text>
                    <text x="160" y="175" textAnchor="middle" fill="#64748B" className="dark:fill-[#94A3B8]" fontSize="10">
                      0 to 2³² - 1
                    </text>
                  </svg>
                </div>

                {/* Key Assignment Table */}
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Current Servers ({ringNodes.length}) & Key Routing
                  </div>

                  <div className="space-y-2">
                    {ringAngles.map((node, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-[#1E293B]/70 border border-slate-200 dark:border-[#334155] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: node.color }} />
                          <span className="font-semibold text-xs text-slate-900 dark:text-white">{node.name}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                          Angle: {Math.round(node.angle)}° (~{Math.round(100 / ringNodes.length)}% key share)
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-[#6366F1]/10 border border-indigo-200 dark:border-[#6366F1]/30 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-[#06B6D4]">Key Insight:</span> When adding or removing a node in consistent hashing, only <strong>1/N</strong> of total keys are remapped, compared to 100% key churn in traditional <code>hash(key) % N</code> modulus hashing!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUITE 3: RATE LIMITER & CIRCUIT BREAKER */}
        {/* ========================================================================= */}
        {activeSuite === 'resilience' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tool 12: Token Bucket Rate Limiter */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Token Bucket Rate Limiter</h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Refill: 1 token / 1.5s
                </span>
              </div>

              {/* Bucket Visualizer */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                  <span>Tokens in Bucket:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{currentTokens} / {tokenBucketCapacity}</span>
                </div>

                <div className="h-6 w-full rounded-full bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] overflow-hidden p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#06B6D4] transition-all duration-300"
                    style={{ width: `${(currentTokens / tokenBucketCapacity) * 100}%` }}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={triggerRateLimitRequest}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Simulate Client Request
                  </button>
                  <button
                    onClick={() => setCurrentTokens(tokenBucketCapacity)}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                    title="Reset Bucket"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Request Log */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-[#1E293B]">
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Live Request Traffic Log
                </div>
                <div className="space-y-1">
                  {rateLimiterLog.map((log) => (
                    <div key={log.id} className="p-2 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">{log.time}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'ALLOWED' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {log.status === 'ALLOWED' ? '200 OK (Allowed)' : '429 TOO MANY REQUESTS'}
                      </span>
                    </div>
                  ))}
                  {rateLimiterLog.length === 0 && (
                    <div className="text-center py-4 text-xs text-slate-400 dark:text-slate-500">
                      Click "Simulate Client Request" to generate traffic.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tool 13: Circuit Breaker State Machine */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#06B6D4]" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Circuit Breaker (Resilience4j)</h3>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  cbState === 'CLOSED'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : cbState === 'OPEN'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 animate-pulse'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}>
                  State: {cbState}
                </span>
              </div>

              {/* States visual */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-3 rounded-xl border ${cbState === 'CLOSED' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-[#0B1020] border-slate-200 dark:border-[#1E293B]'}`}>
                  <div className="font-bold">CLOSED</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Traffic Flows</div>
                </div>
                <div className={`p-3 rounded-xl border ${cbState === 'OPEN' ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400' : 'bg-slate-50 dark:bg-[#0B1020] border-slate-200 dark:border-[#1E293B]'}`}>
                  <div className="font-bold">OPEN</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Fast Fail</div>
                </div>
                <div className={`p-3 rounded-xl border ${cbState === 'HALF_OPEN' ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400' : 'bg-slate-50 dark:bg-[#0B1020] border-slate-200 dark:border-[#1E293B]'}`}>
                  <div className="font-bold">HALF-OPEN</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Probe Canary</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Consecutive Failures: <strong className="text-slate-900 dark:text-white">{cbFailures} / 3</strong></span>
                  <span>Canary Successes: <strong className="text-slate-900 dark:text-white">{cbSuccesses} / 2</strong></span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => recordCbCall(true)}
                    className="py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 font-semibold text-xs transition-all cursor-pointer"
                  >
                    Simulate Success (200 OK)
                  </button>
                  <button
                    onClick={() => recordCbCall(false)}
                    className="py-2.5 rounded-xl bg-rose-50 dark:bg-rose-600/20 hover:bg-rose-100 dark:hover:bg-rose-600/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 font-semibold text-xs transition-all cursor-pointer"
                  >
                    Simulate Failure (500 Error)
                  </button>
                </div>

                {cbState === 'OPEN' && (
                  <button
                    onClick={() => setCbState('HALF_OPEN')}
                    className="w-full py-2 rounded-xl bg-amber-50 dark:bg-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 text-xs font-semibold mt-2 cursor-pointer"
                  >
                    Cooldown Finished: Transition to Half-Open
                  </button>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">Pattern Rule:</strong> When error rate exceeds threshold (3 consecutive failures), the breaker trips to <strong>OPEN</strong>, short-circuiting calls immediately without straining the failing downstream database or service.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUITE 4: CACHE LRU & BLOOM FILTER */}
        {/* ========================================================================= */}
        {activeSuite === 'storage' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tool 16: LRU Cache Eviction Pipeline */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">LRU Cache Eviction (Capacity: 4)</h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Doubly Linked List + Hash Map</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Most Recently Used (MRU)</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">Least Recently Used (LRU - Next to Evict)</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {cacheItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-center space-y-1">
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">Slot {idx + 1}</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.key}</div>
                      <div className="text-[11px] text-[#06B6D4] truncate">{item.val}</div>
                    </div>
                  ))}
                  {Array.from({ length: 4 - cacheItems.length }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="p-3 rounded-xl bg-slate-50/50 dark:bg-[#0B1020]/40 border border-dashed border-slate-300 dark:border-[#334155] text-center flex items-center justify-center text-xs text-slate-400 dark:text-slate-600">
                      Empty Slot
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#1E293B]">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Push Key to Cache</div>
                <div className="grid grid-cols-3 gap-2">
                  {['user:4 (Diana)', 'user:5 (Evan)', 'user:1 (Alice)'].map((entry, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const [k, v] = entry.split(' ');
                        putLruItem(k, v.replace('(', '').replace(')', ''));
                      }}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-xs font-medium text-slate-700 dark:text-slate-200 transition-all text-center cursor-pointer"
                    >
                      PUT {entry}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tool 18: Bloom Filter Visualizer */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E293B] pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#6366F1] dark:text-[#A78BFA]" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Bloom Filter Probabilistic Set</h3>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">O(1) Check, 0% False Negatives</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-slate-600 dark:text-slate-400 mb-1">Items Inserted in Filter:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {bloomItems.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#6366F1] dark:text-[#A78BFA] font-mono text-xs">
                        "{item}"
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-medium">Test Membership Query:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bloomQuery}
                      onChange={(e) => setBloomQuery(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-[#6366F1]"
                      placeholder="e.g. apple or netflix"
                    />
                    <button
                      onClick={() => checkBloom(bloomQuery)}
                      className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs transition-all cursor-pointer shadow-sm"
                    >
                      Check Filter
                    </button>
                  </div>
                </div>

                {bloomQueryResult && (
                  <div className={`p-3 rounded-xl border text-xs font-bold text-center ${
                    bloomQueryResult.includes('PROBABLY')
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400'
                  }`}>
                    Result: {bloomQueryResult}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">Bloom Filter Guarantee:</strong> A Bloom filter guarantees that if it returns <em>"Definitely Not In Set"</em>, the item has 100% never been seen before. If it returns <em>"Probably In Set"</em>, it might be a false positive due to bit collision. Used by Cassandra and Bigtable to avoid expensive disk seeks!
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SimulatorsHubPage;
