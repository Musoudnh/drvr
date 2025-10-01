import React from 'react';
import { MessageSquare, Users } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
  unreadCount?: number;
}

const ChatButton: React.FC<ChatButtonProps> = ({ onClick, unreadCount = 0 }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 w-14 h-14 bg-[#101010] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-40"
      title="Open Team Chat"
    >
      <div className="relative">
        <MessageSquare className="w-6 h-6 text-white" />
        <Users className="w-3 h-3 text-white absolute -top-1 -right-1 opacity-80" />
        
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#F87171] rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </div>
        )}
      </div>
      
      {/* Pulse animation for unread messages */}
      {unreadCount > 0 && (
        <div className="absolute inset-0 rounded-full bg-[#F87171] animate-ping opacity-20" />
      )}
      
      {/* Tooltip */}
      <div className="absolute left-full ml-3 bg-[#101010] text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Team Chat
        {unreadCount > 0 && ` (${unreadCount} unread)`}
        <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-[#101010] rotate-45" />
      </div>
    </button>
  );
};

export default ChatButton;