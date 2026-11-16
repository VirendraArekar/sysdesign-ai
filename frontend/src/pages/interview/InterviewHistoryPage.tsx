import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { ApiResponse } from '../../types';
import { 
  History, 
  Bot, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Award, 
  ChevronRight, 
  Loader2,
  CheckCircle2,
  Play
} from 'lucide-react';

interface SessionItem {
  id: string;
  category: string;
  targetLevel: string;
  interviewerPersona: string;
  problemTitle: string;
  status: string;
  durationSeconds: number;
  startedAt: string;
  evaluation?: {
    overallScore: number;
  };
}

export const InterviewHistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiClient.get<any, ApiResponse<SessionItem[]>>('/interviews/history');
        if (res.success && res.data) {
          setSessions(res.data);
        }
      } catch (err) {
        console.error('Error fetching interview history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    return `${mins} mins`;
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/interview"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Interview Simulator
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Interview History & Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Review past evaluations, mock scores, and staff challenges.</p>
        </div>

        <Link
          to="/interview"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-[#6366F1]/20 transition-all"
        >
          <Bot className="w-4 h-4" /> New Simulation
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 space-y-4 shadow-sm">
          <History className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Mock Interviews Taken Yet</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
            Take your first system design interview with our AI Principal Architect to get detailed feedback.
          </p>
          <Link
            to="/interview"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366F1] text-white text-xs font-semibold hover:bg-[#4F46E5] transition-all shadow-md shadow-[#6366F1]/20"
          >
            Start Your First Interview
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-[#334155] shadow-sm transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-bold uppercase tracking-wider">
                    {sess.category}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-bold uppercase tracking-wider">
                    {sess.targetLevel}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    sess.status === 'COMPLETED' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                  }`}>
                    {sess.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{sess.problemTitle}</h3>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(sess.startedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDuration(sess.durationSeconds || 0)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-[#1E293B]">
                {sess.evaluation ? (
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-[#22C55E]">
                      {sess.evaluation.overallScore}%
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Evaluated Score</div>
                  </div>
                ) : (
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Incomplete</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewHistoryPage;
