import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { logout } from './store/slices/authSlice';
import { useTheme } from './context/ThemeContext';
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
import ArchitectureDesignerPage from './pages/designer/ArchitectureDesignerPage';
import SimulatorsHubPage from './pages/simulators/SimulatorsHubPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import TopicsExplorerPage from './pages/topics/TopicsExplorerPage';
import SemanticSearchModal from './components/search/SemanticSearchModal';
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
  LogOut, 
  Search,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-xs font-medium text-indigo-600 dark:text-[#A78BFA]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-[#06B6D4]" />
          <span>Next-Gen AI Mock Interview Simulator for Staff & Principal Engineers</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Master System Design with <br />
          <span className="bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#A78BFA] bg-clip-text text-transparent">
            Real-Time AI Principal Architects
          </span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Simulate high-pressure architecture rounds, explore 40+ production HLD blueprints, 
          solve 20+ SOLID LLD systems, and model distributed systems with interactive drag-and-drop canvases.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link to="/interview" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white font-semibold shadow-lg shadow-[#6366F1]/30 flex items-center gap-2 transition-all">
            <Bot className="w-5 h-5" /> Start Mock Interview
          </Link>
          <Link to="/topics" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] hover:opacity-95 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all">
            <Sparkles className="w-5 h-5" /> Topics Hub (HLD & LLD)
          </Link>
          <Link to="/curriculum" className="px-6 py-3 rounded-xl bg-white dark:bg-[#151C2E] hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-[#334155] text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2 transition-all shadow-sm">
            <BookOpen className="w-5 h-5 text-cyan-500 dark:text-[#06B6D4]" /> Curriculum
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-16 text-left">
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#151C2E]/60 border border-slate-200 dark:border-[#1E293B] shadow-sm backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1] mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">13 Complete Curriculum Modules</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">From CAP theorem & Consistent Hashing to Kafka, CQRS, and Multi-Region Architectures.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#151C2E]/60 border border-slate-200 dark:border-[#1E293B] shadow-sm backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4] mb-3">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Interactive Architecture Designer</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Design systems with React Flow and get instant AI audits for SPOFs, bottlenecks, and security.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 dark:bg-[#151C2E]/60 border border-slate-200 dark:border-[#1E293B] shadow-sm backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 flex items-center justify-center text-[#A78BFA] mb-3">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">18 Distributed Simulators</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hands-on QPS calculations, partition rebalancing, rate limiting, and cache sizing engines.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const isDesigner = location.pathname === '/designer';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B1020] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
        {/* Top Navigation */}
        <header className="h-16 border-b border-slate-200 dark:border-[#1E293B] bg-white/90 dark:bg-[#151C2E]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 sm:gap-3">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] flex items-center justify-center font-bold text-white shadow-lg shadow-[#6366F1]/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-slate-200 dark:to-[#A78BFA] bg-clip-text text-transparent">
                  System Design AI
                </span>
                <span className="ml-1.5 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-600 dark:text-[#A78BFA] border border-indigo-200 dark:border-[#6366F1]/30 font-medium">
                  v1.0 Pro
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/dashboard" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
              Dashboard
            </Link>
            <Link to="/topics" className="px-3 py-1.5 rounded-lg text-sm font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Topics (HLD/LLD)</span>
            </Link>
            <Link to="/curriculum" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
              Curriculum
            </Link>
            <Link to="/hld" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
              HLD Practice
            </Link>
            <Link to="/lld" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
              LLD Practice
            </Link>
            <Link to="/interview" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
              AI Interview
            </Link>
            <Link to="/designer" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
              Designer
            </Link>
            <Link to="/simulators" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
              Simulators
            </Link>
            <Link to="/questions" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
              Questions
            </Link>
            <Link to="/admin" className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-amber-400 transition-all cursor-pointer"
              title={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              title="Search System Design Topics (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-cyan-600 dark:text-[#06B6D4]" />
              <span className="hidden sm:inline">Search & Ask AI...</span>
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-[#0B1020] text-slate-500 dark:text-slate-400 font-mono border border-slate-200 dark:border-[#334155]">⌘K</kbd>
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link to="/profile" className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-xs sm:text-sm text-slate-800 dark:text-white transition-all">
                  <User className="w-4 h-4 text-indigo-500 dark:text-[#A78BFA]" />
                  <span className="font-medium text-xs hidden sm:inline">{user.fullName}</span>
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md shadow-[#6366F1]/25 transition-all">
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#151C2E] border-b border-slate-200 dark:border-[#1E293B] px-4 py-3 space-y-1 z-40 animate-in slide-in-from-top-2">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/topics', label: 'Topics Hub (HLD/LLD)' },
              { to: '/curriculum', label: 'Curriculum' },
              { to: '/hld', label: 'HLD Practice' },
              { to: '/lld', label: 'LLD Practice' },
              { to: '/interview', label: 'AI Interview' },
              { to: '/designer', label: 'Architecture Designer' },
              { to: '/simulators', label: '18 Distributed Simulators' },
              { to: '/questions', label: 'Question Bank' },
              { to: '/admin', label: 'Admin & Monetization' }
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-[#1E293B] flex items-center justify-between px-3 py-2">
              <span className="text-xs text-slate-500">Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#1E293B] text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {resolvedTheme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Route View */}
        <Routes>
          <Route path="/" element={isAuthenticated ? <DashboardPage /> : <LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/topics" element={<TopicsExplorerPage />} />
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
          <Route path="/designer" element={<ArchitectureDesignerPage />} />
          <Route path="/simulators" element={<SimulatorsHubPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>

        {/* Global Semantic Search & RAG Modal */}
        <SemanticSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Footer - hidden on full-canvas designer */}
        {!isDesigner && (
          <footer className="border-t border-slate-200 dark:border-[#1E293B] bg-slate-50 dark:bg-[#0B1020] py-6 px-6 text-center text-xs text-slate-500">
            <p>© 2026 System Design AI. Built for Senior, Staff, and Principal Engineers worldwide.</p>
          </footer>
        )}
      </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
