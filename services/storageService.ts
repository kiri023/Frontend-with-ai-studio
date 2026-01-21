
import { UserProfile, ChatSession, Announcement } from '../types';

const KEYS = {
  PROFILE: 'aipro_user_profile',
  SAVED_POLICIES: 'aipro_saved_policies',
  CHAT_SESSIONS: 'aipro_chat_sessions',
  SETTINGS: 'aipro_settings'
};

export const storageService = {
  getProfile: (): UserProfile | null => {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },
  
  getSavedPolicyIds: (): string[] => {
    const data = localStorage.getItem(KEYS.SAVED_POLICIES);
    return data ? JSON.parse(data) : [];
  },
  savePolicyId: (id: string) => {
    const current = storageService.getSavedPolicyIds();
    if (!current.includes(id)) {
      localStorage.setItem(KEYS.SAVED_POLICIES, JSON.stringify([...current, id]));
    }
  },
  removePolicyId: (id: string) => {
    const current = storageService.getSavedPolicyIds();
    localStorage.setItem(KEYS.SAVED_POLICIES, JSON.stringify(current.filter(i => i !== id)));
  },

  getChatSessions: (): ChatSession[] => {
    const data = localStorage.getItem(KEYS.CHAT_SESSIONS);
    return data ? JSON.parse(data) : [];
  },
  saveChatSession: (session: ChatSession) => {
    const sessions = storageService.getChatSessions();
    const idx = sessions.findIndex(s => s.session_id === session.session_id);
    if (idx > -1) {
      sessions[idx] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
  },
  deleteChatSession: (id: string) => {
    const sessions = storageService.getChatSessions();
    localStorage.setItem(KEYS.CHAT_SESSIONS, JSON.stringify(sessions.filter(s => s.session_id !== id)));
  },

  getSettings: () => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { reuseProfile: true };
  },
  saveSettings: (settings: any) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
};
