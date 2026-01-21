
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, User, Menu, X, PlusCircle, Trash2, ChevronLeft } from 'lucide-react';
import { storageService } from './services/storageService';
import { UserProfile, ChatSession } from './types';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import MyPage from './components/MyPage';
import PolicyDetail from './components/PolicyDetail';

const Sidebar = ({ 
  sessions, 
  onDeleteSession, 
  isOpen, 
  onClose 
}: { 
  sessions: ChatSession[], 
  onDeleteSession: (id: string) => void, 
  isOpen: boolean, 
  onClose: () => void 
}) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden" 
          onClick={onClose}
        />
      )}
      <aside className={`w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-[70] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-2xl font-black italic flex items-center gap-2">
            <span className="bg-[#FFDC17] text-[#1545E4] px-2 py-0.5 rounded italic">AI</span>
            <span className="text-[#1545E4]">브로</span>
          </h1>
          <button onClick={onClose} className="md:hidden text-slate-400 p-1">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-4">
            <Link 
              to="/chat/new" 
              onClick={onClose}
              className="flex items-center gap-2 w-full bg-[#1545E4] hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all"
            >
              <PlusCircle size={18} />
              새로운 추천 받기
            </Link>
          </div>

          <div className="hidden md:block space-y-1 px-2">
            <Link to="/" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
              <Home size={20} />
              <span>대시보드</span>
            </Link>
            <Link to="/mypage" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${location.pathname === '/mypage' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}>
              <User size={20} />
              <span>마이페이지</span>
            </Link>
          </div>

          <div className="mt-8">
            <h3 className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">과거 채팅 기록</h3>
            <div className="space-y-1 px-2">
              {sessions.length === 0 ? (
                <p className="px-6 text-xs text-slate-600 italic">기록이 없습니다.</p>
              ) : (
                sessions.map(s => (
                  <div key={s.session_id} className="group relative">
                    <Link 
                      to={`/chat/${s.session_id}`} 
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors overflow-hidden whitespace-nowrap text-ellipsis ${location.pathname.includes(s.session_id) ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <MessageSquare size={16} className="shrink-0" />
                      <span className="text-sm truncate pr-6">{s.title}</span>
                    </Link>
                    <button 
                      onClick={(e) => { e.preventDefault(); onDeleteSession(s.session_id); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

const MobileHeader = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDetail = location.pathname.startsWith('/policy/');

  return (
    <header className="md:hidden bg-white border-b border-slate-100 h-14 flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {isDetail ? (
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
        ) : (
          <button onClick={onOpenSidebar} className="p-1 -ml-1">
            <Menu size={24} className="text-slate-600" />
          </button>
        )}
        <h1 className="text-lg font-bold text-slate-900 truncate">
          {location.pathname === '/' ? '대시보드' : 
           location.pathname.includes('/chat/') ? '추천 챗봇' :
           location.pathname === '/mypage' ? '마이페이지' : '상세 정보'}
        </h1>
      </div>
      <div className="w-8" /> {/* Spacer */}
    </header>
  );
};

const BottomNav = () => {
  const location = useLocation();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center h-16 z-40 px-2">
      <Link to="/" className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${location.pathname === '/' ? 'text-[#1545E4]' : 'text-slate-400'}`}>
        <Home size={20} />
        <span className="text-[10px] font-bold">홈</span>
      </Link>
      <Link to="/chat/new" className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${location.pathname.includes('/chat/') ? 'text-[#1545E4]' : 'text-slate-400'}`}>
        <MessageSquare size={20} />
        <span className="text-[10px] font-bold">추천받기</span>
      </Link>
      <Link to="/mypage" className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${location.pathname === '/mypage' ? 'text-[#1545E4]' : 'text-slate-400'}`}>
        <User size={20} />
        <span className="text-[10px] font-bold">내 정보</span>
      </Link>
    </nav>
  );
};

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setSessions(storageService.getChatSessions());
    setProfile(storageService.getProfile());
  }, []);

  const handleDeleteSession = (id: string) => {
    if (confirm('이 채팅을 삭제할까요?')) {
      storageService.deleteChatSession(id);
      setSessions(storageService.getChatSessions());
    }
  };

  const handleRefreshSessions = () => {
    setSessions(storageService.getChatSessions());
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
        <Sidebar 
          sessions={sessions} 
          onDeleteSession={handleDeleteSession} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen pb-16 md:pb-0">
          <MobileHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
          <div className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat/:sessionId" element={<Chat onNewSession={handleRefreshSessions} />} />
              <Route path="/policy/:id" element={<PolicyDetail />} />
              <Route path="/mypage" element={<MyPage onProfileUpdate={() => setProfile(storageService.getProfile())} />} />
            </Routes>
          </div>
          <BottomNav />
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
