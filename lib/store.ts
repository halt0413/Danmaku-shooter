import { create } from 'zustand';

//難易度の保存
export const useGameStore = create((set) => ({
    difficulty: 'easy',
  setDifficulty: (d) => set({ difficulty: d }),
}));
