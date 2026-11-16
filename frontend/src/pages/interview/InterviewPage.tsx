import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import apiClient from '../../services/api';
import { ApiResponse } from '../../types';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Loader2, 
  Award, 
  ArrowRight,
  History,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Message {
  id: string;
  senderRole: 'INTERVIEWER' | 'CANDIDATE';
  stepStage: string;
  content: string;
  sequenceOrder: number;
  createdAt: string;
}

interface Evaluation {
  overallScore: number;
  categoryScores: string;
  strengths: string;
  weaknesses: string;
  missingConcepts: string;
  incorrectAssumptions: string;
  suggestedImprovements: string;
  idealAnswerOutline: string;
  recommendedTopics: string;
}

interface Session {
  id: string;
  category: string;
  targetLevel: string;
  interviewerPersona: string;
  problemTitle: string;
  status: string;
  currentStage: string;
  durationSeconds: number;
  messages: Message[];
  evaluation?: Evaluation;
}

const STAGES = [
  'REQUIREMENTS',
  'CAPACITY_ESTIMATION',
  'API_DESIGN',
  'DATABASE_DESIGN',
  'HIGH_LEVEL_ARCH',
  'SCALABILITY_CHALLENGE',
  'SECURITY_AND_SPOF',
  'TRADE_OFFS',
  'COMPLETED',
];

export const InterviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Setup Form State
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [problemTitle, setProblemTitle] = useState(searchParams.get('problem') || 'Design a Scalable URL Shortener (TinyURL)');
  const [category, setCategory] = useState('HLD');
  const [targetLevel, setTargetLevel] = useState('STAFF');
  const [interviewerPersona, setInterviewerPersona] = useState('PRINCIPAL_ARCHITECT');

  // Active Session State
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (session && session.status === 'IN_PROGRESS' && !isPaused) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session, isPaused]);

  // WebSocket STOMP listener
  useEffect(() => {
    if (session?.id) {
      const client = new Client({
        webSocketFactory: () => new SockJS('/ws'),
        reconnectDelay: 5000,
        onConnect: () => {
          client.subscribe(`/topic/interview/${session.id}`, (message) => {
            const newMsg: Message = JSON.parse(message.body);
            setSession((prev) => {
              if (!prev) return prev;
              const exists = prev.messages.some((m) => m.id === newMsg.id);
              if (exists) return prev;
              return { ...prev, messages: [...prev.messages, newMsg] };
            });
          });
        },
      });
      client.activate();
      stompClientRef.current = client;

      return () => {
        client.deactivate();
      };
    }
  }, [session?.id]);

  // Web Speech API Voice Dictation
  const handleToggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setReplyText((prev) => (prev ? prev + ' ' + transcript : transcript));
      };

      recognition.start();
    }
  };

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post<any, ApiResponse<Session>>('/interviews/start', {
        problemTitle,
        category,
        targetLevel,
        interviewerPersona,
      });

      if (res.success && res.data) {
        setSession(res.data);
        setTimerSeconds(0);
      }
    } catch (err) {
      console.error('Error starting interview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || sending || !session) return;

    setSending(true);
    const contentToSend = replyText;
    setReplyText('');

    try {
      const res = await apiClient.post<any, ApiResponse<Session>>(`/interviews/${session.id}/reply`, {
        content: contentToSend,
        durationDeltaSeconds: 15,
      });

      if (res.success && res.data) {
        setSession(res.data);
      }
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setSending(false);
    }
  };

  const handleTogglePause = async () => {
    if (!session) return;
    try {
      if (isPaused) {
        await apiClient.post(`/interviews/${session.id}/resume`);
        setIsPaused(false);
      } else {
        await apiClient.post(`/interviews/${session.id}/pause`);
        setIsPaused(true);
      }
    } catch (err) {
      console.error('Error toggling pause:', err);
    }
  };

  const handleFinishInterview = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await apiClient.post<any, ApiResponse<Session>>(`/interviews/${session.id}/finish`);
      if (res.success && res.data) {
        setSession(res.data);
        setShowEvalModal(true);
      }
    } catch (err) {
      console.error('Error finishing interview:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parseArray = (str?: string): string[] => {
    try { return JSON.parse(str || '[]'); } catch { return []; }
  };

  const parseMap = (str?: string): Record<string, number> => {
    try { return JSON.parse(str || '{}'); } catch { return {}; }
  };

  // If no active session, show Interview Setup Screen
  if (!session) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs font-medium text-indigo-600 dark:text-[#A78BFA] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-[#06B6D4]" /> Real-Time Adaptive AI Simulation
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI System Design Mock Interview</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Experience high-pressure technical rounds with adaptive AI interviewers modeled after FAANG Staff Engineers and Principal Architects.
          </p>
        </div>

        <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleStartInterview} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                System Design Problem
              </label>
              <input
                type="text"
                value={problemTitle}
                onChange={(e) => setProblemTitle(e.target.value)}
                placeholder="e.g. Design WhatsApp, Design Netflix, Design Uber"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                >
                  <option value="HLD">High-Level Design (HLD)</option>
                  <option value="LLD">Low-Level Design (LLD)</option>
                  <option value="DISTRIBUTED_SYSTEMS">Distributed Systems</option>
                  <option value="DATABASE_ARCHITECTURE">Database Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Target Level
                </label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                >
                  <option value="BEGINNER">Beginner (L3)</option>
                  <option value="INTERMEDIATE">Intermediate (L4)</option>
                  <option value="SENIOR">Senior SDE (L5)</option>
                  <option value="STAFF">Staff Engineer (L6)</option>
                  <option value="PRINCIPAL">Principal Architect (L7)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Interviewer Persona
                </label>
                <select
                  value={interviewerPersona}
                  onChange={(e) => setInterviewerPersona(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                >
                  <option value="PRINCIPAL_ARCHITECT">Principal Architect (Rigorous)</option>
                  <option value="STAFF_ENGINEER">Staff Engineer (Collaborative)</option>
                  <option value="SRE_LEAD">SRE Lead (Faults & Reliability)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-[#1E293B]">
              <Link
                to="/interview/history"
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <History className="w-4 h-4 text-[#A78BFA]" /> View Previous Interviews
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white font-semibold text-sm shadow-lg shadow-[#6366F1]/20 hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                <span>Begin Simulation</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Active Simulation View
  const currentStageIndex = STAGES.indexOf(session.currentStage);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Session Top Bar */}
      <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-bold uppercase tracking-wider">
              {session.category} • {session.targetLevel}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Persona: {session.interviewerPersona}</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{session.problemTitle}</h2>
        </div>

        {/* Stage Progression Bar */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-[#0B1020] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E293B]">
          {STAGES.slice(0, -1).map((stg, idx) => {
            const isDone = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={stg}
                title={stg.replace(/_/g, ' ')}
                className={`w-5 h-2 rounded-full transition-all ${
                  isDone ? 'bg-emerald-500' : isCurrent ? 'bg-[#6366F1] animate-pulse' : 'bg-slate-300 dark:bg-[#1E293B]'
                }`}
              />
            );
          })}
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0B1020] px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E293B] font-mono text-sm text-cyan-600 dark:text-cyan-400 font-bold">
            <Clock className="w-4 h-4" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <button
            onClick={handleTogglePause}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title={isPaused ? 'Resume Timer' : 'Pause Timer'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={handleFinishInterview}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20 dark:hover:bg-red-500/30 border border-red-500/30 dark:border-red-500/40 text-red-600 dark:text-red-400 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Finish Interview</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-6 overflow-y-auto space-y-4 mb-4 shadow-sm">
        {session.messages.map((msg) => {
          const isInterviewer = msg.senderRole === 'INTERVIEWER';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isInterviewer ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
                  isInterviewer
                    ? 'bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] shadow-md shadow-[#6366F1]/20'
                    : 'bg-slate-200 dark:bg-[#1E293B] text-slate-700 dark:text-slate-300'
                }`}
              >
                {isInterviewer ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  isInterviewer
                    ? 'bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B] text-slate-800 dark:text-slate-200'
                    : 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white shadow-lg shadow-[#6366F1]/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-[10px] opacity-70 uppercase font-bold tracking-wider">
                  <span>{isInterviewer ? 'Principal Architect' : 'You (Candidate)'}</span>
                  <span>•</span>
                  <span>{msg.stepStage.replace(/_/g, ' ')}</span>
                </div>
                <div className="whitespace-pre-line">{msg.content}</div>
              </div>
            </div>
          );
        })}
        {sending && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 italic">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6366F1]" />
            <span>Architect is evaluating your solution and formulating challenge...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input Bar */}
      <form onSubmit={handleSendReply} className="flex items-center gap-3 bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-3 shadow-sm">
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            isRecording
              ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse'
              : 'bg-slate-100 dark:bg-[#0B1020] border-slate-200 dark:border-[#1E293B] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title={isRecording ? 'Listening (Click to Stop)' : 'Dictate with Voice'}
        >
          {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Articulate your architectural decision, schema, or capacity calculation..."
          disabled={sending || session.status === 'COMPLETED'}
          className="flex-1 px-4 py-2 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!replyText.trim() || sending || session.status === 'COMPLETED'}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-[#6366F1]/20"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Send</span>
        </button>
      </form>

      {/* 15-Category Evaluation Report Modal */}
      {showEvalModal && session.evaluation && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E293B] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-600 dark:text-[#A78BFA] flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Interview Evaluation Report</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{session.problemTitle} • {session.targetLevel} Level</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-extrabold text-[#22C55E]">
                  {session.evaluation.overallScore} / 100
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Overall Score</div>
              </div>
            </div>

            {/* Category Scores Grid */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                15-Dimension Technical Mastery Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(parseMap(session.evaluation.categoryScores)).map(([cat, score]) => (
                  <div key={cat} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400 truncate max-w-[140px]">{cat}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#6366F1] to-[#06B6D4] h-full rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Demonstrated Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {parseArray(session.evaluation.strengths).map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Identified Weaknesses
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {parseArray(session.evaluation.weaknesses).map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">!</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ideal Answer & Recommendations */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-slate-200 dark:border-[#1E293B]">
              <h4 className="text-xs font-bold text-cyan-700 dark:text-[#06B6D4] uppercase tracking-wider mb-2">
                Ideal Staff-Level Blueprint Outline
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {session.evaluation.idealAnswerOutline}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-[#1E293B]">
              <button
                onClick={() => setShowEvalModal(false)}
                className="px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-[#6366F1]/20"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
