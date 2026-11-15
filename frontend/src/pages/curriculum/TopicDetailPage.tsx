import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { ApiResponse } from '../../types';
import MermaidViewer from '../../components/common/MermaidViewer';
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  FileText, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Save, 
  Loader2,
  Terminal,
  Cpu
} from 'lucide-react';

interface TopicDetail {
  id: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  summary: string;
  difficulty: string;
  subtopics: string[];
  beginnerExplanation: string;
  deepTechnicalExplanation: string;
  architectureDiagramMermaid: string;
  advantages: string;
  disadvantages: string;
  realWorldUseCases: string;
  interviewQuestions: string;
  practicalExercises: string;
  userProgressStatus: string;
  isBookmarked: boolean;
  userNote: string;
}

export const TopicDetailPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'deep' | 'beginner' | 'diagram' | 'tradeoffs' | 'interview' | 'exercises'>('deep');
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [progressStatus, setProgressStatus] = useState('NOT_STARTED');

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await apiClient.get<any, ApiResponse<TopicDetail>>(`/curriculum/topics/${topicId}`);
        if (res.success && res.data) {
          setTopic(res.data);
          setNoteContent(res.data.userNote || '');
          setBookmarked(res.data.isBookmarked);
          setProgressStatus(res.data.userProgressStatus);
        }
      } catch (err) {
        console.error('Error fetching topic detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicId]);

  const handleToggleBookmark = async () => {
    try {
      const res = await apiClient.post<any, ApiResponse<boolean>>('/curriculum/bookmarks', {
        itemType: 'TOPIC',
        itemId: topicId,
      });
      if (res.success) {
        setBookmarked(res.data);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      await apiClient.post('/curriculum/notes', {
        itemType: 'TOPIC',
        itemId: topicId,
        content: noteContent,
      });
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleToggleCompleted = async () => {
    const nextStatus = progressStatus === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    try {
      await apiClient.post('/curriculum/progress', {
        topicId,
        status: nextStatus,
        timeSpentSeconds: 300,
      });
      setProgressStatus(nextStatus);
    } catch (err) {
      console.error('Error recording progress:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-400">
        <h2 className="text-xl font-bold text-white mb-2">Topic Not Found</h2>
        <Link to="/curriculum" className="text-[#A78BFA] hover:underline text-sm">
          Return to Curriculum
        </Link>
      </div>
    );
  }

  const parseJsonArray = (jsonStr: string): string[] => {
    try {
      return JSON.parse(jsonStr || '[]');
    } catch {
      return [];
    }
  };

  const advantages = parseJsonArray(topic.advantages);
  const disadvantages = parseJsonArray(topic.disadvantages);
  const useCases = parseJsonArray(topic.realWorldUseCases);
  const interviewQuestions = parseJsonArray(topic.interviewQuestions);
  const practicalExercises = parseJsonArray(topic.practicalExercises);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Back breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/curriculum"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Curriculum
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              bookmarked
                ? 'bg-[#6366F1]/20 border-[#6366F1] text-[#A78BFA]'
                : 'bg-[#151C2E] border-[#1E293B] text-slate-400 hover:text-white'
            }`}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4 text-[#A78BFA]" /> : <Bookmark className="w-4 h-4" />}
            <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          <button
            onClick={handleToggleCompleted}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              progressStatus === 'COMPLETED'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-[#151C2E] border-[#1E293B] text-slate-300 hover:text-white hover:border-[#6366F1]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{progressStatus === 'COMPLETED' ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#6366F1]/20 text-[#A78BFA] border border-[#6366F1]/30 font-semibold uppercase">
            {topic.moduleTitle}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold uppercase">
            {topic.difficulty} Level
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{topic.title}</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">{topic.summary}</p>

        {topic.subtopics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1E293B]">
            {topic.subtopics.map((sub, idx) => (
              <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-[#0B1020] text-slate-300 border border-[#1E293B]">
                • {sub}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#1E293B] mb-6 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('deep')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'deep'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4 text-[#6366F1]" /> Deep Technical Architecture
        </button>

        <button
          onClick={() => setActiveTab('beginner')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'beginner'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#06B6D4]" /> Intuitive Explanation
        </button>

        <button
          onClick={() => setActiveTab('diagram')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'diagram'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-[#A78BFA]" /> Architecture Diagram
        </button>

        <button
          onClick={() => setActiveTab('tradeoffs')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tradeoffs'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ThumbsUp className="w-4 h-4 text-emerald-400" /> Trade-offs & Use Cases
        </button>

        <button
          onClick={() => setActiveTab('interview')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'interview'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" /> Interview Questions
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'exercises'
              ? 'border-[#6366F1] text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4 text-indigo-400" /> Exercises
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'deep' && (
            <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#6366F1]" /> Deep Technical Analysis
              </h3>
              <div className="text-slate-300 leading-relaxed text-sm whitespace-pre-line space-y-4">
                {topic.deepTechnicalExplanation}
              </div>
            </div>
          )}

          {activeTab === 'beginner' && (
            <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#06B6D4]" /> Intuitive Mental Model
              </h3>
              <div className="p-4 rounded-xl bg-[#0B1020] border border-[#1E293B] text-slate-300 text-sm leading-relaxed italic">
                "{topic.beginnerExplanation}"
              </div>
            </div>
          )}

          {activeTab === 'diagram' && (
            <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#A78BFA]" /> System Flow & Topology
              </h3>
              <MermaidViewer chart={topic.architectureDiagramMermaid} />
            </div>
          )}

          {activeTab === 'tradeoffs' && (
            <div className="space-y-6">
              <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6">
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2 mb-3">
                  <ThumbsUp className="w-4 h-4" /> Architectural Advantages
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {advantages.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6">
                <h3 className="text-base font-bold text-red-400 flex items-center gap-2 mb-3">
                  <ThumbsDown className="w-4 h-4" /> Disadvantages & Trade-offs
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {disadvantages.map((dis, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">✗</span>
                      <span>{dis}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6">
                <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4" /> Real-World Production Implementations
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {useCases.map((uc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">▸</span>
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'interview' && (
            <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-amber-400" /> Staff & Principal Interview Questions
              </h3>
              <div className="space-y-3">
                {interviewQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0B1020] border border-[#1E293B] text-slate-200 text-sm">
                    <span className="text-[#A78BFA] font-bold mr-2">Q{idx + 1}.</span>
                    {q}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'exercises' && (
            <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-indigo-400" /> Practical Hands-On Exercises
              </h3>
              <div className="space-y-3">
                {practicalExercises.map((ex, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0B1020] border border-[#1E293B] text-slate-200 text-sm">
                    <span className="text-indigo-400 font-bold mr-2">Exercise {idx + 1}:</span>
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Notes & Quick Links */}
        <div className="space-y-6">
          <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#A78BFA]" /> Private Study Notes
            </h3>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Record your architectural insights, key takeaways, and mock interview reminders..."
              rows={8}
              className="w-full p-3 bg-[#0B1020] border border-[#1E293B] rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSaveNote}
                disabled={savingNote}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold disabled:opacity-50 transition-all cursor-pointer"
              >
                {savingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Note</span>
              </button>
            </div>
          </div>

          <div className="bg-[#151C2E] border border-[#1E293B] rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white">Next Steps</h3>
            <Link
              to="/interview"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#06B6D4] text-white text-xs font-semibold shadow-md shadow-[#6366F1]/20 hover:opacity-95 transition-all"
            >
              Test with AI Interviewer
            </Link>
            <Link
              to="/designer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0B1020] border border-[#1E293B] text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              Model in Architecture Designer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
