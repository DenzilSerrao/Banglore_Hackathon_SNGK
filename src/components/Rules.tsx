import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examRules } from '../data/mockData';
import screenfull from 'screenfull';
import { useExamStore } from '../store/examStore';

export const Rules: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  const startExam = useExamStore((state) => state.startExam);

  const handleStartExam = async () => {
    if (screenfull.isEnabled) {
      await screenfull.request();
      startExam();
      navigate('/exam');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center">Exam Rules</h2>
        <div className="space-y-4">
          {examRules.map((rule, index) => (
            <div key={index} className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <p>{rule}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="h-4 w-4 text-indigo-600"
          />
          <label className="text-sm text-gray-700">
            I have read and accept all the rules
          </label>
        </div>
        <button
          onClick={handleStartExam}
          disabled={!accepted}
          className={`w-full py-2 px-4 rounded-md shadow-sm text-white ${
            accepted
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Ready for Exam
        </button>
      </div>
    </div>
  );
};