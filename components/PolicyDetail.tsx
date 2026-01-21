
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Share2, ExternalLink, Calendar, MapPin, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { MOCK_ANNOUNCEMENTS } from '../constants';
import { storageService } from '../services/storageService';
import { Announcement } from '../types';

const PolicyDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Announcement | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const found = MOCK_ANNOUNCEMENTS.find(a => a.policy_id === id);
    if (found) {
      setPolicy(found);
      setIsSaved(storageService.getSavedPolicyIds().includes(found.policy_id));
    }
  }, [id]);

  const toggleSave = () => {
    if (!policy) return;
    if (isSaved) {
      storageService.removePolicyId(policy.policy_id);
      setIsSaved(false);
    } else {
      storageService.savePolicyId(policy.policy_id);
      setIsSaved(true);
    }
  };

  if (!policy) return <div className="p-12 text-center text-slate-500">공고를 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10">
      <button 
        onClick={() => navigate(-1)}
        className="hidden md:flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        뒤로가기
      </button>

      <div className="bg-white rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-12 border-b border-slate-50">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
            <span className="bg-blue-50 text-[#1545E4] px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-black uppercase">{policy.category}</span>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold">{policy.region}</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
            <h2 className="text-xl md:text-3xl font-black text-slate-900 leading-tight flex-1">{policy.title}</h2>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={toggleSave}
                className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl border transition-all ${isSaved ? 'bg-yellow-400 border-yellow-400 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
              >
                <Star size={20} className={isSaved ? 'fill-current md:w-6 md:h-6' : 'md:w-6 md:h-6'} />
              </button>
              <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl border border-slate-200 bg-white text-slate-400">
                <Share2 size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-12 space-y-8 md:space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Calendar className="text-orange-500" size={18} />
              </div>
              <div>
                <h4 className="text-[10px] md:text-sm font-bold text-slate-400 mb-0.5 md:mb-1">신청 마감일</h4>
                <p className="text-sm md:text-base text-slate-800 font-bold">{policy.deadline || '상시 접수'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MapPin className="text-blue-500" size={18} />
              </div>
              <div>
                <h4 className="text-[10px] md:text-sm font-bold text-slate-400 mb-0.5 md:mb-1">지원 지역</h4>
                <p className="text-sm md:text-base text-slate-800 font-bold">{policy.region}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <Tag className="text-green-500" size={18} />
              </div>
              <div>
                <h4 className="text-[10px] md:text-sm font-bold text-slate-400 mb-0.5 md:mb-1">지원 대상</h4>
                <p className="text-sm md:text-base text-slate-800 font-bold">{policy.target}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <FileText className="text-purple-500" size={18} />
              </div>
              <div>
                <h4 className="text-[10px] md:text-sm font-bold text-slate-400 mb-0.5 md:mb-1">분류</h4>
                <p className="text-sm md:text-base text-slate-800 font-bold capitalize">{policy.category}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 border-l-4 border-[#1545E4] pl-3">상세 내용</h3>
            <div className="bg-slate-50 p-5 md:p-6 rounded-2xl md:rounded-3xl text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
              {policy.content}
            </div>
          </div>

          {policy.apply_link && (
             <div className="pt-4 md:pt-8">
               <a 
                href={policy.apply_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#1545E4] hover:bg-blue-700 text-white font-bold py-4 md:py-5 rounded-2xl md:rounded-3xl flex items-center justify-center gap-2 md:gap-3 transition-all text-base md:text-lg shadow-lg shadow-blue-500/20"
              >
                공고문 확인 및 신청하기 <ExternalLink size={18} />
              </a>
             </div>
          )}
        </div>
      </div>

      <div className="mt-6 md:mt-8 bg-[#FFDC17]/10 border border-[#FFDC17]/30 p-5 md:p-6 rounded-2xl md:rounded-[30px] flex items-start gap-3 md:gap-4">
        <CheckCircle2 size={20} className="text-[#FFA417] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm md:text-base font-bold text-[#1545E4] mb-0.5 md:mb-1">신청 전 필수 확인</h4>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            위 정보는 SBIZ24 데이터를 기반으로 생성되었으며, 실제 공고 시점과 차이가 있을 수 있습니다. 반드시 해당 기관의 공식 홈페이지를 방문하여 상세 요건을 재확인하십시오.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetail;
