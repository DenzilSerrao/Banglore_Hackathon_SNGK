import React from 'react';
import { useExamStore } from '../store/examStore';
import { mockQuestions } from '../data/mockData';

export const Result: React.FC = () => {
  const { answers, warnings } = useExamStore();

  const calculateScore = () => {
    let correct = 0;
    Object.entries(answers).forEach(([questionId, answer]) => {
      if (mockQuestions[Number(questionId)].correctAnswer === answer) {
        correct++;
      }
    });
    return (correct / mockQuestions.length) * 100;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Exam Results</h2>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-6xl font-bold text-indigo-600">
              {calculateScore().toFixed(0)}%
            </p>
            <p className="text-gray-600 mt-2">Final Score</p>
          </div>

          <div className="border-t border-b py-4">
            <p className="text-center text-lg">
              Warning Count: <span className="font-bold">{warnings}</span>
            </p>
            {warnings >= 3 && (
              <p className="text-center text-red-600 mt-2">
                Exam was automatically submitted due to multiple violations
              </p>
            )}
          </div>

          <div className="space-y-4">
            {mockQuestions.map((question, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <p className="font-medium">{question.question}</p>
                <p className="text-sm mt-2">
                  Your answer: {
                    answers[index] !== undefined 
                      ? question.options[answers[index]]
                      : 'Not answered'
                  }
                </p>
                <p className={`text-sm mt-1 ${
                  answers[index] === question.correctAnswer 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  Correct answer: {question.options[question.correctAnswer]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};