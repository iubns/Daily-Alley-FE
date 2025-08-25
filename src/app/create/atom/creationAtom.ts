import { atom } from 'jotai';

export interface AiCreationResult {
  imageUrl: string;
  headline: string; // 제목
  body: string[];     // 본문
  cta: string;      // 행동 유도 문구
  hashtags: string[]; // 해시태그
  mood: string;
}

export const creationResultAtom = atom<AiCreationResult | null>(null);


