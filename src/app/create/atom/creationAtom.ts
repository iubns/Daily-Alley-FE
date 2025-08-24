import { atom } from 'jotai';

export interface AiCreationResult {
  imageUrl: string;
  text: string;
  hashtags: string[];
  mood: string;
}

export const creationResultAtom = atom<AiCreationResult | null>(null);


