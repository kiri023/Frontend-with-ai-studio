
import { Announcement } from './types';

export const REGIONS = [
  "전국", "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
];

export const INDUSTRIES = [
  "도매 및 소매업", "숙박 및 음식점업", "제조업", "건설업", "운수 및 창고업",
  "정보통신업", "예술, 스포츠 및 여가관련 서비스업", "기타"
];

// Mock data based on SBIZ24 style for MVP demonstration
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    policy_id: "L001",
    title: "2024년 소상공인 전통시장 자금 대출",
    category: "loan",
    region: "전국",
    target: "전통시장 상인 및 일반 소상공인",
    content: "전통시장 활성화를 위해 저금리로 운영자금을 대출해드립니다. 지원대상은 전통시장 상인 확인서를 보유하거나 관련 업종 종사자입니다.",
    apply_link: "https://www.semas.or.kr",
    deadline: "2024-12-31"
  },
  {
    policy_id: "L002",
    title: "경기도 소상공인 희망대출",
    category: "loan",
    region: "경기",
    target: "경기도 내 사업장을 둔 소상공인",
    content: "경기도 내 소상공인의 경영 안정을 위해 보증 한도 및 금리 우대를 제공합니다.",
    apply_link: "https://www.gmoney.or.kr",
    deadline: "2024-08-15"
  },
  {
    policy_id: "Y001",
    title: "중소기업 기술보증 기금 특례보증",
    category: "yugwan",
    region: "전국",
    target: "기술력을 보유한 소기업",
    content: "혁신 기술을 보유한 기업에 대해 담보 없이 보증을 제공합니다.",
    apply_link: "https://www.kibo.or.kr",
    deadline: "2024-10-30"
  },
  {
    policy_id: "S001",
    title: "소상공인시장진흥공단 혁신성장촉진자금",
    category: "sojingong",
    region: "전국",
    target: "6개월 이상 영업중인 소상공인",
    content: "디지털 전환이나 매출 성장이 기대되는 우수 소상공인에게 성장 자금을 지원합니다.",
    apply_link: "https://www.sbiz.or.kr",
    deadline: "2024-07-20"
  },
  {
    policy_id: "L003",
    title: "서울시 소상공인 긴급 경영안정자금",
    category: "loan",
    region: "서울",
    target: "서울시 내 소상공인",
    content: "매출 감소를 겪고 있는 서울 지역 소상공인 대상 긴급 자금 지원입니다.",
    apply_link: "https://www.seoul.go.kr",
    deadline: "2024-05-30"
  }
];
