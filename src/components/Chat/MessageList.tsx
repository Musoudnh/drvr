import React, { useRef, useEffect } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { Thread, Message, ChatUser } from '../../types/chat';
import MessageItem from './MessageItem';

interface MessageListProps {
  thread: Thread | null;
  messages: Message[];
  currentUser: ChatUser;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  thread,
  messages,
  currentUser,
  onAddReaction
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-medium">Select a thread</p>
          <p className="text-xs">Choose a thread to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Thread Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg text-[#101010]">{thread.title}</h2>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span>{thread.messageCount} messages</span>
              <span className="mx-2">•</span>
              <span>{thread.participants.length} participants</span>
              {thread.isAISummarized && (
                <>
                  <span className="mx-2">•</span>
                  <span className="flex items-center text-[#F59E0B]">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Summarized
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="font-medium">No messages yet</p>
            <p className="text-xs">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const showAvatar = index === 0 || messages[index - 1].authorId !== message.authorId;
            const showTimestamp = index === 0 || 
              (message.createdAt.getTime() - messages[index - 1].createdAt.getTime()) > 300000; // 5 minutes
            
            return (
              <MessageItem
                key={message.id}
                message={message}
                currentUser={currentUser}
                showAvatar={showAvatar}
                showTimestamp={showTimestamp}
                onAddReaction={onAddReaction}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;