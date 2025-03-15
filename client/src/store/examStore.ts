import { create } from 'zustand';
import { ExamState } from '../types';

interface ExamStore extends ExamState {
  setCurrentQuestion: (questionNumber: number) => void;
  setAnswer: (questionId: number, answer: number) => void;
  incrementWarnings: () => void;
  setFullScreen: (isFullScreen: boolean) => void;
  startExam: () => void;
  completeExam: () => void;
}

export const useExamStore = create<ExamStore>((set) => ({
  currentQuestion: 0,
  answers: {},
  warnings: 0,
  isFullScreen: false,
  examStarted: false,
  examCompleted: false,
  setCurrentQuestion: (questionNumber) => set({ currentQuestion: questionNumber }),
  setAnswer: (questionId, answer) => 
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
  incrementWarnings: () => 
    set((state) => ({ warnings: state.warnings + 1 })),
  setFullScreen: (isFullScreen) => set({ isFullScreen }),
  startExam: () => set({ examStarted: true }),
  completeExam: () => set({ examCompleted: true }),
}));