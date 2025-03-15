import { Question } from '../types';

export const examRules = [
  "Do not switch tabs or windows during the exam",
  "Maintain full-screen mode throughout the exam",
  "Do not use any external resources",
  "Three warnings will result in automatic submission",
  "Complete all questions within the allocated time",
];

export const mockQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1
  }
];