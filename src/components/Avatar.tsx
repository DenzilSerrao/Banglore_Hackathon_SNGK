import React from "react";
import { useExamStore } from "../store/examStore";

interface AvatarProps {
  idleTime: number;
  cheatingDetected?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ idleTime, cheatingDetected = false }) => {
  const warnings = useExamStore((state) => state.warnings);

  // Get the appropriate GIF based on state
  const getGif = () => {
    if (warnings >= 3) return "/assets/gifs/angry.gif";
    if (cheatingDetected) return "/assets/gifs/annoyed.gif"; 
    
    if(warnings>1) return "/assets/gifs/BeCareful.gif";
    if (idleTime > 10) return "/assets/gifs/thinking.gif";
    return "/assets/gifs/smiling.gif";
  };

  // Get the appropriate message based on state
  const getMessage = () => {
    if (warnings >= 3) return "Exam automatically submitted!";
    if (cheatingDetected) return "Please don't try to cheat!";
    if (warnings > 0) return "Be careful!";
    if (idleTime > 10) return "Don't think too much, try answering!";
    return "Good luck!";
  };

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white p-2 rounded-lg shadow-md z-50">
      <img src={getGif()} alt="Status gif" className="w-24 h-24" />
      <p className="text-sm font-medium">{getMessage()}</p>
    </div>
  );
};