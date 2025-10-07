import React from 'react';
import { MessageSquare, Users, Clock, Sparkles } from 'lucide-react';
import { Thread, Channel } from '../../types/chat';

interface ThreadListProps {
  channel: Channel | null;
  threads: Thread[];
  selectedThreadId: string | null;
  onThreadSelect: (threadId: string) => void;
  onCreateThread: () => void;
}

const ThreadList: React.FC<ThreadListProps> = ({
  channel,
  threads,
  selectedThreadId,
  onThreadSelect,
  onCreateThread
}) => {
  if (!channel) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Select a channel</p>
          <p className="text-xs">Choose a channel to view threads</p>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Channel Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-[#101010]">#{channel.name}</h3>
          <button
            onClick={onCreateThread}
            className="p-1 hover:bg-gray-100 rounded text-[#3AB7BF]"
            title="Create new thread"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
        {channel.description && (
          <p className="text-xs text-gray-600">{channel.description}</p>
        )}
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <Users className="w-3 h-3 mr-1" />
          {channel.memberCount} members
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No threads yet</p>
            <p className="text-xs">Start a new conversation</p>
            <button
              onClick={onCreateThread}
              className="mt-3 px-4 py-2 bg-[#3AB7BF] text-white rounded-lg text-xs hover:bg-[#2A9BA3] transition-colors"
            >
              Create Thread
            </button>
          </div>
        ) : (
          <div className="p-2">
            {threads.map(thread => (
              <button
                key={thread.id}
                onClick={() => onThreadSelect(thread.id)}
                className={`w-full p-3 rounded-lg mb-2 text-left transition-colors ${
                  selectedThreadId === thread.id
                    ? 'bg-[#3AB7BF]/10 border border-[#3AB7BF]/20'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-[#101010] text-xs line-clamp-2">
                    {thread.title}
                  </h4>
                  {thread.isAISummarized && (
                    <Sparkles className="w-3 h-3 text-[#F59E0B] ml-2 flex-shrink-0" title="AI Summarized" />
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {thread.messageCount} messages
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(thread.lastActivity)}
                  </div>
                </div>
                
                {thread.participants.length > 1 && (
                  <div className="flex items-center mt-2">
                    <div className="flex -space-x-1">
                      {thread.participants.slice(0, 3).map((participantId, index) => (
                        <div
                          key={participantId}
                          className="w-5 h-5 bg-[#3AB7BF] rounded-full border border-white flex items-center justify-center"
                          style={{ zIndex: 3 - index }}
                        >
                          <span className="text-xs text-white font-medium">
                            {participantId.charAt(participantId.length - 1)}
                          </span>
                        </div>
                      ))}
                      {thread.participants.length > 3 && (
                        <div className="w-5 h-5 bg-gray-400 rounded-full border border-white flex items-center justify-center text-xs text-white">
                          +{thread.participants.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadList;