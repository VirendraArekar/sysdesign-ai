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
  Moon,
  ChevronDown
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
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
  const moreMenuRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isDesigner = location.pathname === '/designer';

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B1020] text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
        {/* Top Navigation */}
        <header className="h-16 border-b border-slate-200 dark:border-[#1E293B] bg-white/90 dark:bg-[#151C2E]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#06B6D4] flex items-center justify-center font-bold text-white shadow-lg shadow-[#6366F1]/20 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="whitespace-nowrap">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-slate-200 dark:to-[#A78BFA] bg-clip-text text-transparent whitespace-nowrap">
                  System Design AI
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {/* 1. Topics Hub (HLD/LLD) */}
            <Link 
              to="/topics" 
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                location.pathname.startsWith('/topics')
                  ? 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 shadow-xs'
                  : 'text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Topics (HLD/LLD)</span>
            </Link>

            {/* 2. Architecture Designer */}
            <Link 
              to="/designer" 
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/designer')
                  ? 'bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-semibold'
                  : 'font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              Designer
            </Link>

            {/* 3. AI Interview Simulator */}
            <Link 
              to="/interview" 
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/interview')
                  ? 'bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-semibold'
                  : 'font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              AI Interview
            </Link>

            {/* 4. Distributed Simulators */}
            <Link 
              to="/simulators" 
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/simulators')
                  ? 'bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-semibold'
                  : 'font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              Simulators
            </Link>

            {/* 5. 13-Module Curriculum */}
            <Link 
              to="/curriculum" 
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/curriculum')
                  ? 'bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-semibold'
                  : 'font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              Curriculum
            </Link>

            {/* 6. Dashboard */}
            <Link 
              to="/dashboard" 
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap ${
                location.pathname === '/dashboard'
                  ? 'bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-semibold'
                  : 'font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B]'
              }`}
            >
              Dashboard
            </Link>

            {/* 7. More Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  moreMenuOpen || ['/hld', '/lld', '/questions', '/admin'].some(p => location.pathname.startsWith(p))
                    ? 'text-indigo-600 dark:text-[#A78BFA] bg-indigo-50 dark:bg-[#1E293B] font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-[#151C2E] border border-slate-200 dark:border-[#1E293B] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <Link
                    to="/hld"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors whitespace-nowrap"
                  >
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span>HLD Blueprints (40+)</span>
                  </Link>
                  <Link
                    to="/lld"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors whitespace-nowrap"
                  >
                    <Code2 className="w-4 h-4 text-cyan-500" />
                    <span>LLD Practice (20+)</span>
                  </Link>
                  <Link
                    to="/questions"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors whitespace-nowrap"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>Question Bank</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100 dark:border-[#1E293B]" />
                  <Link
                    to="/admin"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors whitespace-nowrap"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Admin & Monetization</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-slate-600 dark:text-amber-400 transition-all cursor-pointer shrink-0"
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
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title="Search System Design Topics (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-cyan-600 dark:text-[#06B6D4] shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Search & Ask AI...</span>
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-[#0B1020] text-slate-500 dark:text-slate-400 font-mono border border-slate-200 dark:border-[#334155]">⌘K</kbd>
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Link to="/profile" className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] border border-slate-200 dark:border-[#334155] text-xs sm:text-sm text-slate-800 dark:text-white transition-all shrink-0 whitespace-nowrap">
                  <User className="w-4 h-4 text-indigo-500 dark:text-[#A78BFA] shrink-0" />
                  <span className="font-medium text-xs hidden sm:inline whitespace-nowrap">{user.fullName}</span>
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors shrink-0"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Link to="/login" className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 whitespace-nowrap">
                  Sign In
                </Link>
                <Link to="/register" className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md shadow-[#6366F1]/25 transition-all shrink-0 whitespace-nowrap">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] hover:bg-slate-200 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#151C2E] border-b border-slate-200 dark:border-[#1E293B] px-4 py-3 space-y-1 z-40 animate-in slide-in-from-top-2 shadow-xl">
            {[
              { to: '/topics', label: 'Topics Hub (HLD/LLD)', icon: Sparkles, highlight: true },
              { to: '/designer', label: 'Architecture Designer', icon: Network },
              { to: '/interview', label: 'AI Mock Interview', icon: Bot },
              { to: '/simulators', label: '18 Distributed Simulators', icon: Calculator },
              { to: '/curriculum', label: '13-Module Curriculum', icon: BookOpen },
              { to: '/dashboard', label: 'Learning Dashboard', icon: BarChart3 },
              { to: '/hld', label: 'HLD Blueprints (40+)', icon: Layers },
              { to: '/lld', label: 'LLD Practice (20+)', icon: Code2 },
              { to: '/questions', label: 'Question Bank', icon: HelpCircle },
              { to: '/admin', label: 'Admin & Monetization', icon: ShieldCheck }
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap ${
                  location.pathname.startsWith(link.to)
                    ? 'bg-indigo-50 dark:bg-[#6366F1]/20 text-indigo-700 dark:text-[#A78BFA] font-semibold'
                    : link.highlight
                      ? 'text-cyan-700 dark:text-cyan-300 font-medium hover:bg-cyan-50 dark:hover:bg-cyan-950/30'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                }`}
              >
                <link.icon className={`w-4 h-4 shrink-0 ${link.highlight ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-[#1E293B] flex items-center justify-between px-3 py-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#1E293B] text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#334155]"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
                <span>{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
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
