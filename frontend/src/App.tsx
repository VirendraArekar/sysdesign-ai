import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { logout } from './store/slices/authSlice';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/profile/ProfilePage';
import CurriculumListPage from './pages/curriculum/CurriculumListPage';
import TopicDetailPage from './pages/curriculum/TopicDetailPage';
import HldListPage from './pages/practice/HldListPage';
import HldDetailPage from './pages/practice/HldDetailPage';
import LldListPage from './pages/practice/LldListPage';
import LldDetailPage from './pages/practice/LldDetailPage';
import QuestionBankPage from './pages/practice/QuestionBankPage';
import InterviewPage from './pages/interview/InterviewPage';
import InterviewHistoryPage from './pages/interview/InterviewHistoryPage';
import { 
  BookOpen, 
  Layers, 
  Code2, 
  Bot, 
  Network, 
  Calculator, 
  BarChart3, 
  HelpCircle,
  Sparkles,
  ShieldCheck,
  User,
  LogOut
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-xs font-medium text-[#A78BFA]">
          <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Next-Gen AI Mock Interview Simulator for Staff & Principal Engineers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Master System Design with <br />
          <span className="bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#A78BFA] bg-clip-text text-transparent">
            Real-Time AI Principal Architects
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Simulate high-pressure architecture rounds, explore 40+ production HLD blueprints, 
          solve 20+ SOLID LLD systems, and model distributed systems with interactive drag-and-drop canvases.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link to="/interview" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white font-semibold shadow-lg shadow-[#6366F1]/30 flex items-center gap-2 transition-all">
            <Bot className="w-5 h-5" /> Start Mock Interview
          </Link>
          <Link to="/curriculum" className="px-6 py-3 rounded-xl bg-[#151C2E] hover:bg-[#1E293B] border border-[#334155] text-slate-200 font-semibold flex items-center gap-2 transition-all">
            <BookOpen className="w-5 h-5 text-[#06B6D4]" /> Explore Curriculum
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-16 text-left">
          <div className="p-5 rounded-2xl bg-[#151C2E]/60 border border-[#1E293B] backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1] mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">13 Complete Curriculum Modules</h3>
            <p className="text-sm text-slate-400">From CAP theorem & Consistent Hashing to Kafka, CQRS, and Multi-Region Architectures.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#151C2E]/60 border border-[#1E293B] backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4] mb-3">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">Interactive Architecture Designer</h3>
            <p className="text-sm text-slate-400">Design systems with React Flow and get instant AI audits for SPOFs, bottlenecks, and security.</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#151C2E]/60 border border-[#1E293B] backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 flex items-center justify-center text-[#A78BFA] mb-3">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white mb-1">18 Distributed Simulators</h3>
            <p className="text-sm text-slate-400">Hands-on QPS calculations, partition rebalancing, rate limiting, and cache sizing engines.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#0B1020] text-[#F8FAFC]">
        {/* Top Navigation */}
        <header className="h-16 border-b border-[#1E293B] bg-[#151C2E]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] flex items-center justify-center font-bold text-white shadow-lg shadow-[#6366F1]/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-[#A78BFA] bg-clip-text text-transparent">
                  System Design AI
                </span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#6366F1]/20 text-[#A78BFA] border border-[#6366F1]/30 font-medium">
                  v1.0 Pro
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors">
              Dashboard
            </Link>
            <Link to="/curriculum" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors">
              Curriculum
            </Link>
            <Link to="/hld" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors">
              HLD Practice
            </Link>
            <Link to="/lld" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors">
              LLD Practice
            </Link>
            <Link to="/interview" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors">
              AI Interview
            </Link>
            <Link to="/designer" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors">
              Designer
            </Link>
            <Link to="/simulators" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors">
              Simulators
            </Link>
            <Link to="/questions" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1E293B] transition-colors">
              Questions
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-sm text-white transition-all">
                  <User className="w-4 h-4 text-[#A78BFA]" />
                  <span className="font-medium text-xs">{user.fullName}</span>
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md shadow-[#6366F1]/25 transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Dynamic Route View */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/curriculum" element={<CurriculumListPage />} />
          <Route path="/curriculum/topic/:topicId" element={<TopicDetailPage />} />
          <Route path="/hld" element={<HldListPage />} />
          <Route path="/hld/:id" element={<HldDetailPage />} />
          <Route path="/lld" element={<LldListPage />} />
          <Route path="/lld/:id" element={<LldDetailPage />} />
          <Route path="/questions" element={<QuestionBankPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/interview/history" element={<InterviewHistoryPage />} />
        </Routes>

        {/* Footer */}
        <footer className="border-t border-[#1E293B] py-6 px-6 text-center text-xs text-slate-500">
          <p>© 2026 System Design AI. Built for Senior, Staff, and Principal Engineers worldwide.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
