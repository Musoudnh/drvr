import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

interface AIChatButtonProps {
  onClick: () => void;
}

const AIChatButton: React.FC<AIChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-40"
      title="Open AI Financial Analyst"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6 text-white" />
        <Sparkles className="w-3 h-3 text-white absolute -top-1 -right-1 opacity-80" />
      </div>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] animate-ping opacity-20" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 bg-[#1E2A38] text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        AI Financial Analyst
        <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-[#1E2A38] rotate-45" />
      </div>
    </button>
  );
};

export default AIChatButton;