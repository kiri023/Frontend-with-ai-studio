
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Announcement, GeminiRecommendation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async recommendTop3(profile: UserProfile, candidates: Announcement[]): Promise<GeminiRecommendation[]> {
    const profileStr = JSON.stringify(profile);
    const candidatesStr = candidates.map(c => `[ID: ${c.policy_id}] ${c.title}: ${c.content}`).join("\n\n");

    const systemInstruction = `
      당신은 대한민국 소상공인 정책자금 전문가 'AI브로'입니다.
      사용자의 사업자 프로필을 바탕으로 제공된 공고 리스트 중 가장 적합한 TOP 3를 추천하세요.
      
      [규칙]
      1. 점수는 0~100점 사이로, 사용자와 공고의 적합도를 나타냅니다. (절대 대출 승인 확률이 아님을 명시)
      2. 추천 이유는 "사용자는 A인데, 이 프로그램은 B를 요구함"과 같은 사실 비교 형식으로 작성하세요.
      3. 각 추천 항목에 대해 반드시 3~5개의 "확인 필요 체크리스트"를 생성하세요.
      4. 지역 불일치나 누락된 정보가 있다면 "위험 요소" 항목에 정직하게 기술하세요.
      5. 과장된 표현("무조건 승인", "100% 보장")은 금지합니다.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `사용자 프로필: ${profileStr}\n\n추천 후보 공고들:\n${candidatesStr}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reason: { type: Type.STRING },
              checklist: { type: Type.ARRAY, items: { type: Type.STRING } },
              risk_note: { type: Type.STRING },
            },
            required: ["id", "score", "reason", "checklist", "risk_note"],
          },
        },
      },
    });

    try {
      return JSON.parse(response.text.trim());
    } catch (e) {
      console.error("Gemini response parsing failed", e);
      return [];
    }
  },

  async generateSessionTitle(firstMessage: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `채팅 제목을 10자 이내의 한글로 지어줘. 첫 메시지: "${firstMessage}"`,
      config: {
        systemInstruction: "채팅 내용을 요약하는 짧은 제목 하나만 반환하세요.",
      }
    });
    return response.text.trim().replace(/"/g, '');
  }
};
