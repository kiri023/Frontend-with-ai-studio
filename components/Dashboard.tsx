
import React, { useState, useMemo } from 'react';
import { Search, Clock, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_ANNOUNCEMENTS, REGIONS } from '../constants';
import { storageService } from '../services/storageService';
import { Category } from '../types';

const Dashboard: React.FC = () => {
  const [category, setCategory] = useState<Category>('loan');
  const [region, setRegion] = useState<string>('전국');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedIds, setSavedIds] = useState(storageService.getSavedPolicyIds());

  const filteredItems = useMemo(() => {
    return MOCK_ANNOUNCEMENTS.filter(item => {
      const matchCat = item.category === category;
      const matchReg = region === '전국' ? true : (item.region === region || item.region === '전국');
      const matchSearch = item.title.includes(searchTerm) || item.content.includes(searchTerm);
      return matchCat && matchReg && matchSearch;
    });
  }, [category, region, searchTerm]);

  const endingSoon = useMemo(() => {
    return MOCK_ANNOUNCEMENTS.filter(i => i.deadline && (i.deadline.includes('2024-05') || i.deadline.includes('2024-06'))).slice(0, 3);
  }, []);

  const savedItems = useMemo(() => {
    return MOCK_ANNOUNCEMENTS.filter(i => savedIds.includes(i.policy_id));
  }, [savedIds]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (savedIds.includes(id)) {
      storageService.removePolicyId(id);
    } else {
      storageService.savePolicyId(id);
    }
    setSavedIds(storageService.getSavedPolicyIds());
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-6 md:mb-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">대시보드</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-slate-500 font-medium">오늘의 공고</span>
            <span className="bg-[#1545E4] text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:py-1 rounded-full">{MOCK_ANNOUNCEMENTS.length}</span>
          </div>
        </div>
        <p className="text-sm md:text-base text-slate-500">사장님의 사업장에 꼭 맞는 정책자금을 한눈에 확인하세요.</p>
      </header>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
        <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Clock className="text-orange-500" size={18} />
            <h3 className="font-bold text-slate-800 text-sm md:text-base">마감 임박 (D-7)</h3>
          </div>
          <div className="space-y-2 md:space-y-3">
            {endingSoon.map(item => (
              <Link key={item.policy_id} to={`/policy/${item.policy_id}`} className="flex items-center justify-between p-2 md:p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-xs md:text-sm font-semibold text-slate-800 truncate">{item.title}</span>
                  <span className="text-[10px] md:text-xs text-orange-600 font-medium">마감: {item.deadline}</span>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-[#1545E4] shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Star className="text-yellow-400 fill-yellow-400" size={18} />
            <h3 className="font-bold text-slate-800 text-sm md:text-base">저장한 공고</h3>
          </div>
          {savedItems.length === 0 ? (
            <div className="h-24 md:h-32 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed">
              <span className="text-xs md:text-sm">저장한 공고가 없습니다.</span>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {savedItems.map(item => (
                <Link key={item.policy_id} to={`/policy/${item.policy_id}`} className="flex items-center justify-between p-2 md:p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                  <span className="text-xs md:text-sm font-semibold text-slate-800 truncate pr-2">{item.title}</span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-[#1545E4] shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Main Filter Section */}
      <section>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {(['loan', 'yugwan', 'sojingong'] as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all shrink-0 ${category === cat ? 'bg-[#1545E4] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}
              >
                {cat === 'loan' ? '대출/보증' : cat === 'yugwan' ? '유관기관' : '소진공'}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="검색어를 입력하세요..." 
                className="w-full pl-9 pr-4 py-2.5 md:py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1545E4]/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-white border border-slate-200 rounded-xl text-sm px-3 py-2.5 md:py-2 focus:outline-none"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {filteredItems.length === 0 ? (
            <div className="py-12 md:py-20 text-center text-slate-400 bg-white rounded-2xl md:rounded-3xl border border-dashed border-slate-200">
              <p className="text-sm">해당하는 공고가 없습니다.</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <Link key={item.policy_id} to={`/policy/${item.policy_id}`} className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 hover:border-[#1545E4]/30 hover:shadow-md transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-2 md:mb-4">
                  <div className="min-w-0 pr-2">
                    <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-1.5 inline-block ${item.category === 'loan' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                      {item.category}
                    </span>
                    <h4 className="text-sm md:text-lg font-bold text-slate-900 group-hover:text-[#1545E4] transition-colors truncate">{item.title}</h4>
                  </div>
                  <button 
                    onClick={(e) => toggleSave(item.policy_id, e)}
                    className="p-1.5 md:p-2 hover:bg-slate-50 rounded-full transition-colors shrink-0"
                  >
                    <Star size={18} className={savedIds.includes(item.policy_id) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-700">지역:</span> {item.region}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-700">마감:</span> {item.deadline || '상시'}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
