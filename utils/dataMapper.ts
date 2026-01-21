
import { Announcement, Category } from '../types';

/**
 * Maps raw crawl data to normalized Announcement structure.
 */
export const normalizeAnnouncement = (raw: any): Announcement => {
  return {
    policy_id: raw.policy_id || raw.id || raw.p_id || `ID_${Math.random().toString(36).substr(2, 9)}`,
    title: raw.title || raw.name || "제목 없음",
    category: (raw.category || "loan") as Category,
    region: raw.region || raw.area || "미상",
    target: raw.target || raw.eligible || "대상 정보 없음",
    content: raw.content || raw.desc || raw.description || "상세 내용이 없습니다.",
    apply_link: raw.apply_link || raw.link || null,
    deadline: raw.deadline || raw.due_date || null,
  };
};

export const filterAnnouncements = (
  items: Announcement[],
  filters: { category?: Category; region?: string; search?: string }
) => {
  return items.filter(item => {
    const matchCategory = filters.category ? item.category === filters.category : true;
    const matchRegion = filters.region && filters.region !== "전국" 
      ? (item.region === filters.region || item.region === "전국") 
      : true;
    const matchSearch = filters.search 
      ? item.title.toLowerCase().includes(filters.search.toLowerCase()) || 
        item.content.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    return matchCategory && matchRegion && matchSearch;
  });
};
