import { create } from 'zustand';

export const useGameStore = create((set) => ({
  score: 0,
  setScore: (s: number) => set({ score: s }),
}));
