export interface User {
  id: string;
  username: string;
  role: 'student' | 'admin';
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ExamState {
  currentQuestion: number;
  answers: Record<number, number>;
  warnings: number;
  isFullScreen: boolean;
  examStarted: boolean;
  examCompleted: boolean;
}