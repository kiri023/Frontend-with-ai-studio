
import React, { useState } from 'react';
import { Settings, MapPin, Building2, Users, Calendar, Wallet, ShieldCheck, ChevronRight } from 'lucide-react';
import { storageService } from '../services/storageService';
import { REGIONS, INDUSTRIES } from '../constants';
import { UserProfile } from '../types';

const MyPage: React.FC<{ onProfileUpdate: () => void }> = ({ onProfileUpdate }) => {
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile() || {
    region: '전국',
    industry: '기타',
    employees: 1,
    opening_date: '',
    revenue: '0'
  });
  const [settings, setSettings] = useState(storageService.getSettings());
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = () => {
    storageService.saveProfile(profile);
    setIsSaved(true);
    onProfileUpdate();
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleToggleSetting = () => {
    const newSettings = { ...settings, reuseProfile: !settings.reuseProfile };
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-6 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">마이페이지</h2>
        <p className="text-sm md:text-base text-slate-500">사장님의 정보를 최신으로 유지하면 더 정확한 추천을 받을 수 있습니다.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-2 space-y-6 md:space-y-8">
          {/* Profile Section */}
          <section className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 md:mb-8">
              <Building2 className="text-[#1545E4]" size={20} />
              <h3 className="text-lg md:text-xl font-bold text-slate-800">사업자 정보 설정</h3>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin size={14} /> 사업장 위치
                </label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1545E4]/20 appearance-none"
                  value={profile.region}
                  onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                >
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <p className="text-[10px] md:text-[11px] text-slate-400 pl-1">* 시/군/구 필터는 준비 중입니다.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Settings size={14} /> 업종 카테고리
                </label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1545E4]/20 appearance-none"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                >
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Users size={14} /> 상시 근로자수
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1545E4]/20"
                    value={profile.employees}
                    onChange={(e) => setProfile({ ...profile, employees: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar size={14} /> 개업 일자
                  </label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1545E4]/20"
                    value={profile.opening_date}
                    onChange={(e) => setProfile({ ...profile, opening_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Wallet size={14} /> 연매출액 (만원 단위)
                </label>
                <input 
                  type="text" 
                  placeholder="예: 5000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1545E4]/20"
                  value={profile.revenue}
                  onChange={(e) => setProfile({ ...profile, revenue: e.target.value })}
                />
              </div>
            </div>

            <button 
              onClick={handleSaveProfile}
              className={`mt-8 md:mt-10 w-full py-3.5 md:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${isSaved ? 'bg-green-500 text-white' : 'bg-[#1545E4] hover:bg-blue-700 text-white'}`}
            >
              {isSaved ? '저장 완료!' : '프로필 정보 저장하기'}
            </button>
          </section>

          {/* Settings Section */}
          <section className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-6">설정</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="pr-4">
                  <h4 className="text-xs md:text-sm font-bold text-slate-800">프로필 자동 재사용</h4>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-tight mt-0.5">새 채팅 시 위 정보를 자동 반영합니다.</p>
                </div>
                <button 
                  onClick={handleToggleSetting}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${settings.reuseProfile ? 'bg-[#1545E4]' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${settings.reuseProfile ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="bg-[#FFDC17] p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm">
            <h4 className="font-black text-[#1545E4] text-base md:text-lg mb-1.5 italic">사장님을 위한 팁</h4>
            <p className="text-xs md:text-sm text-[#1545E4] font-medium leading-relaxed">
              정책자금은 지역별, 업종별 경쟁률이 다릅니다. 업종을 정확히 선택하시면 AI브로가 더 세밀한 분석을 해드릴 수 있습니다.
            </p>
          </div>

          <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 md:mb-4 text-sm md:text-base">도움말</h4>
            <div className="space-y-2.5">
              <button className="flex items-center justify-between w-full text-xs md:text-sm text-slate-600 hover:text-slate-900 group transition-colors">
                <span>자주 묻는 질문</span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
              </button>
              <button className="flex items-center justify-between w-full text-xs md:text-sm text-slate-600 hover:text-slate-900 group transition-colors">
                <span>데이터 수집 기준</span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
              </button>
              <button className="flex items-center justify-between w-full text-xs md:text-sm text-slate-600 hover:text-slate-900 group transition-colors">
                <span>개인정보 처리방침</span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-1">
             <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-slate-400 px-2">
                <ShieldCheck size={12} className="shrink-0" />
                보안을 위해 데이터는 브라우저에만 저장됩니다.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
