
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Bot, AlertCircle, ChevronRight, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { ChatSession, Message, UserProfile, Announcement, GeminiRecommendation } from '../types';
import { MOCK_ANNOUNCEMENTS } from '../constants';

const Chat: React.FC<{ onNewSession: () => void }> = ({ onNewSession }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(storageService.getProfile());
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId === 'new') {
      createNewSession();
    } else {
      const savedSession = storageService.getChatSessions().find(s => s.session_id === sessionId);
      if (savedSession) {
        setSession(savedSession);
      } else {
        navigate('/chat/new');
      }
    }
  }, [sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.messages]);

  const createNewSession = () => {
    const currentProfile = storageService.getProfile();
    const newSession: ChatSession = {
      session_id: Math.random().toString(36).substr(2, 9),
      title: '새로운 추천 대화',
      created_at: Date.now(),
      updated_at: Date.now(),
      profile_snapshot: currentProfile || { region: '전국', industry: '기타', employees: 1, opening_date: '2024-01-01', revenue: '0' },
      messages: [{
        message_id: 'welcome',
        role: 'assistant',
        content: profile ? `반갑습니다! 사장님의 ${profile.region} 지역 ${profile.industry} 사업에 딱 맞는 정책자금을 찾아드릴게요. 무엇이 궁금하신가요?` : "반갑습니다! 추천을 받으시려면 먼저 프로필 정보를 입력해주셔야 합니다. 마이페이지에서 프로필을 설정하고 와주시겠어요?",
        created_at: Date.now()
      }]
    };
    storageService.saveChatSession(newSession);
    setSession(newSession);
    onNewSession();
    navigate(`/chat/${newSession.session_id}`, { replace: true });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !session || !profile) return;

    const userMsg: Message = {
      message_id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: inputValue,
      created_at: Date.now()
    };

    const updatedSession = {
      ...session,
      messages: [...session.messages, userMsg],
      updated_at: Date.now()
    };

    setSession(updatedSession);
    setInputValue('');
    setIsLoading(true);

    try {
      if (session.messages.length <= 1) {
        const title = await geminiService.generateSessionTitle(userMsg.content);
        updatedSession.title = title;
      }

      const candidates = MOCK_ANNOUNCEMENTS.filter(a => 
        a.region === '전국' || a.region === profile.region
      );

      const geminiRecs: GeminiRecommendation[] = await geminiService.recommendTop3(profile, candidates.slice(0, 10));

      const fullRecs: Announcement[] = geminiRecs.map(gr => {
        const found = MOCK_ANNOUNCEMENTS.find(a => a.policy_id === gr.id) || MOCK_ANNOUNCEMENTS[0];
        return {
          ...found,
          score: gr.score,
          reason: gr.reason,
          checklist: gr.checklist,
          risk_note: gr.risk_note
        };
      }).sort((a, b) => (b.score || 0) - (a.score || 0));

      const assistantMsg: Message = {
        message_id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: `사장님을 위한 최적의 정책자금 ${fullRecs.length}건을 찾았습니다. 점수와 체크리스트를 확인해보세요.`,
        created_at: Date.now(),
        recommendations: fullRecs
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMsg],
        updated_at: Date.now()
      };

      storageService.saveChatSession(finalSession);
      setSession(finalSession);
      onNewSession();
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        message_id: 'error',
        role: 'assistant',
        content: "죄송합니다. 추천을 생성하는 도중 오류가 발생했습니다. 다시 시도해 주세요.",
        created_at: Date.now()
      };
      setSession(s => s ? { ...s, messages: [...s.messages, errorMsg] } : null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return <div className="p-8 text-center text-slate-500">대화를 준비 중입니다...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen max-w-4xl mx-auto border-x border-slate-100 bg-white relative">
      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-24 md:pb-32">
        {session.messages.map(m => (
          <div key={m.message_id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[95%] sm:max-w-[85%] md:max-w-[80%] ${m.role === 'user' ? 'order-1' : 'order-2'}`}>
              <div className="flex items-center gap-2 mb-1">
                {m.role === 'assistant' ? (
                  <>
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#1545E4] flex items-center justify-center">
                      <Bot size={12} className="text-white md:hidden" />
                      <Bot size={14} className="text-white hidden md:block" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-slate-700">AI브로</span>
                  </>
                ) : (
                  <span className="text-[10px] md:text-xs font-bold text-slate-500 ml-auto">사장님</span>
                )}
              </div>
              
              <div className={`p-3 md:p-4 rounded-2xl shadow-sm border text-sm ${m.role === 'user' ? 'bg-[#1545E4] text-white border-transparent rounded-tr-none' : 'bg-slate-50 text-slate-800 border-slate-100 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>

              {m.recommendations && (
                <div className="mt-4 space-y-4">
                  {m.recommendations.map(rec => (
                    <div key={rec.policy_id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-4 md:p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-bold bg-blue-50 text-[#1545E4] px-1.5 py-0.5 rounded shrink-0">FIT {rec.score}%</span>
                              <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">{rec.category}</span>
                            </div>
                            <h4 className="font-bold text-sm md:text-base text-slate-900 leading-tight truncate">{rec.title}</h4>
                          </div>
                          <div className="text-right shrink-0">
                            <div className={`text-xl md:text-2xl font-black ${rec.score && rec.score > 80 ? 'text-blue-600' : 'text-slate-700'}`}>
                              {rec.score}<span className="text-xs md:text-sm font-medium">점</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50/50 p-3 rounded-xl mb-4 border border-blue-100">
                          <div className="flex gap-2 items-start">
                            <Info size={14} className="text-[#1545E4] mt-0.5 shrink-0" />
                            <p className="text-[11px] md:text-xs text-slate-700 leading-relaxed italic">"{rec.reason}"</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">확인 필요 체크리스트</h5>
                          <div className="grid grid-cols-1 gap-1.5">
                            {rec.checklist?.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-[11px] md:text-xs text-slate-600">
                                <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" />
                                <span className="leading-tight">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {rec.risk_note && (
                          <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg mb-4 border border-orange-100">
                            <AlertCircle size={12} className="text-orange-600 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-orange-800 font-medium leading-tight">위험 요소: {rec.risk_note}</p>
                          </div>
                        )}

                        <button 
                          onClick={() => navigate(`/policy/${rec.policy_id}`)}
                          className="w-full bg-[#1545E4] hover:bg-blue-700 text-white text-xs md:text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                          상세보기 <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 p-3 md:p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-3 max-w-[90%]">
              <Loader2 className="animate-spin text-[#1545E4] shrink-0" size={16} />
              <span className="text-xs md:text-sm text-slate-500 font-medium leading-tight">사장님의 프로필과 공고를 매칭 중입니다...</span>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 border-t border-slate-100 bg-white/95 backdrop-blur-sm z-10">
        {!profile ? (
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1">추천을 받으려면 프로필 작성이 필요합니다.</p>
            <button 
              onClick={() => navigate('/mypage')}
              className="text-xs font-bold text-[#1545E4] underline"
            >
              마이페이지로 이동하기
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 max-w-3xl mx-auto bg-slate-100 rounded-2xl p-1.5 pr-2">
            <input 
              type="text" 
              placeholder="궁금한 내용을 입력하세요"
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 py-2"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-[#1545E4] text-white p-2 rounded-xl disabled:opacity-50 disabled:bg-slate-400 transition-colors shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        )}
        <p className="hidden md:block text-[10px] text-slate-400 text-center mt-3">
          AI브로는 정보를 분석할 뿐, 실제 신청 자격 여부는 각 기관에 문의하시기 바랍니다.
        </p>
      </div>
    </div>
  );
};

export default Chat;
