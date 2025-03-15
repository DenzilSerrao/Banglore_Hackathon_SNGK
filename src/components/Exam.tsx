// Language: TypeScript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import screenfull from 'screenfull';
import { useExamStore } from '../store/examStore';
import { mockQuestions } from '../data/mockData';
import { Avatar } from './Avatar';

export const Exam: React.FC = () => {
  const navigate = useNavigate();
  const [idleTime, setIdleTime] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [cheatingDetected, setCheatingDetected] = useState(false); // Track cheating state for avatar

  const {
    currentQuestion,
    answers,
    warnings,
    setCurrentQuestion,
    setAnswer,
    incrementWarnings,
    completeExam
  } = useExamStore();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setRiskLevel('high');
        setCheatingDetected(true);
        handleCheatingAttempt();
      }
    };
  
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRiskLevel('high');
        setShowWarning(true);
        setCheatingDetected(true);
        handleCheatingAttempt();
      }
      // Disable Ctrl+Shift+I (Dev Tools)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setRiskLevel('high');
        setShowWarning(true);
        setCheatingDetected(true);
        handleCheatingAttempt();
      }
      // Disable Ctrl+P (Print)
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setRiskLevel('high');
        setShowWarning(true);
        setCheatingDetected(true);
        handleCheatingAttempt();
      }
    };
  
    const handleFullscreenChange = () => {
      if (!screenfull.isFullscreen) {
        setShowFullscreenPrompt(true);
        setRiskLevel('high');
        setCheatingDetected(true);
        handleCheatingAttempt();
      }
    };
  
    const handleRightClick = (event: MouseEvent) => {
      event.preventDefault();
      setRiskLevel('high');
      setShowWarning(true);
      setCheatingDetected(true);
      handleCheatingAttempt();
    };
  
    const handleCopy = (event: ClipboardEvent) => event.preventDefault();
  
    // NEW: Handle when the window loses focus (browser goes out-of-focus)
    const handleWindowBlur = () => {
      setRiskLevel('high');
      setShowWarning(true);
      setCheatingDetected(true);
      handleCheatingAttempt();
    };
    // Disable right-click, copy and add focus/blur events
    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    if (screenfull.isEnabled) {
      document.addEventListener(screenfull.raw.fullscreenchange, handleFullscreenChange);
    }

    const idleInterval = setInterval(() => {
      const idle = (Date.now() - lastActivity) / 1000;
      setIdleTime(idle);

      if (!showWarning && !showFullscreenPrompt) {
        if (idle >= 10) {
          setRiskLevel('medium'); // Yellow (Medium Risk)
        } else {
          setRiskLevel('low'); // Green (Low Risk)
        }
      }
    }, 1000);

    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      if (screenfull.isEnabled) {
        document.removeEventListener(screenfull.raw.fullscreenchange, handleFullscreenChange);
      }
      clearInterval(idleInterval);
    };
  }, [lastActivity, warnings, showWarning, showFullscreenPrompt]);

  const handleCheatingAttempt = () => {
    setCheatingDetected(true);
    incrementWarnings();
    if (warnings >= 2) {
      completeExam();
      navigate('/result');
    }
  };

  const handleReturnToFullscreen = async () => {
    if (screenfull.isEnabled) {
      try {
        await screenfull.request();
        setShowFullscreenPrompt(false);
        setRiskLevel('medium');
        setTimeout(() => {
          setCheatingDetected(false);
          setRiskLevel('low');
        }, 3000);
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
      }
    }
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
    setRiskLevel('medium');
    setTimeout(() => {
      setCheatingDetected(false);
      setRiskLevel('low');
    }, 3000);
  };

  const handleActivity = () => {
    setLastActivity(Date.now());
  };

  const handleAnswer = (answer: number) => {
    setAnswer(currentQuestion, answer);
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const currentQuestionData = mockQuestions[currentQuestion];

  return (
    <div
      className={`exam-container min-h-screen bg-gray-50 p-4 ${riskLevel}`}
      onMouseMove={handleActivity}
      onKeyDown={handleActivity}
      onClick={handleActivity}
    >
      {/* Pass both idleTime and cheatingDetected to Avatar */}
      <Avatar idleTime={idleTime} cheatingDetected={cheatingDetected} />

      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-red-600 mb-4">Warning!</h3>
            <p className="mb-4">
              Suspicious activity detected. This incident has been logged.
              Further violations may result in exam termination.
            </p>
            <button
              onClick={handleCloseWarning}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {showFullscreenPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Warning!</h3>
            <p className="mb-4">Please return to full-screen mode to continue the exam.</p>
            <button
              onClick={handleReturnToFullscreen}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Return to Full-screen
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Question {currentQuestion + 1} of {mockQuestions.length}
          </h2>
          <p className="text-lg">{currentQuestionData.question}</p>
        </div>

        <div className="space-y-4">
          {currentQuestionData.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full p-4 text-left rounded-lg border ${
                answers[currentQuestion] === index
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {currentQuestion === mockQuestions.length - 1 && (
          <button
            onClick={() => {
              completeExam();
              navigate('/result');
            }}
            className="mt-8 w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Submit Exam
          </button>
        )}
      </div>
    </div>
  );
};