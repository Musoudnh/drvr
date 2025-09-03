import React, { useState, useEffect } from 'react';
import { Hash, Lock, Users, Plus, Search, MessageSquare, Sparkles, Send, Paperclip, Smile, MoreHorizontal, Reply, Clock, X } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import Button from '../../components/UI/Button';

const ChatMain: React.FC = () => {
  const {
    channels,
    threads,
    messages,
    users,
    currentUser,
    sendMessage,
    addReaction,
    createThread,
    markChannelAsRead
  } = useChat();

  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');

  // Auto-select first channel and thread
  useEffect(() => {
    // Check if there's a selected channel from sidebar
    const storedChannelId = localStorage.getItem('selectedChannelId');
    if (storedChannelId && channels.find(c => c.id === storedChannelId)) {
      setSelectedChannelId(storedChannelId);
      localStorage.removeItem('selectedChannelId'); // Clear after use
    } else if (channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0].id);
    }
  }, [channels, selectedChannelId]);

  useEffect(() => {
    if (selectedChannelId && threads[selectedChannelId]?.length > 0 && !selectedThreadId) {
      setSelectedThreadId(threads[selectedChannelId][0].id);
    }
  }, [selectedChannelId, threads, selectedThreadId]);

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    setSelectedThreadId(null);
    markChannelAsRead(channelId);
    
    // Auto-select first thread in channel
    if (threads[channelId]?.length > 0) {
      setSelectedThreadId(threads[channelId][0].id);
    }
  };

  const handleCreateThread = () => {
    if (newThreadTitle.trim() && selectedChannelId) {
      const threadId = createThread(selectedChannelId, newThreadTitle);
      setSelectedThreadId(threadId);
      setNewThreadTitle('');
      setShowCreateThread(false);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedThreadId) {
      sendMessage(selectedThreadId, newMessage);
      setNewMessage('');
    }
  };

  const selectedChannel = channels.find(c => c.id === selectedChannelId) || null;
  const selectedThread = selectedThreadId 
    ? Object.values(threads).flat().find(t => t.id === selectedThreadId) || null
    : null;
  const threadMessages = selectedThreadId ? messages[selectedThreadId] || [] : [];
  const channelThreads = selectedChannelId ? threads[selectedChannelId] || [] : [];

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'client':
        return <Users className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!selectedChannel) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-medium">Select a channel</p>
          <p className="text-sm">Choose a channel from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white">
      {/* Thread List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Channel Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">
                {getChannelIcon(selectedChannel.type)}
              </span>
              <h3 className="font-bold text-lg text-[#1E2A38]">{selectedChannel.name}</h3>
            </div>
            <button
              onClick={() => setShowCreateThread(true)}
              className="p-1 hover:bg-gray-100 rounded text-[#3AB7BF]"
              title="Create new thread"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {selectedChannel.description && (
            <p className="text-sm text-gray-600">{selectedChannel.description}</p>
          )}
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <Users className="w-3 h-3 mr-1" />
            {selectedChannel.memberCount} members
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          {channelThreads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No threads yet</p>
              <p className="text-sm">Start a new conversation</p>
              <button
                onClick={() => setShowCreateThread(true)}
                className="mt-3 px-4 py-2 bg-[#3AB7BF] text-white rounded-lg text-sm hover:bg-[#2A9BA3] transition-colors"
              >
                Create Thread
              </button>
            </div>
          ) : (
            <div className="p-2">
              {channelThreads.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full p-3 rounded-lg mb-2 text-left transition-colors ${
                    selectedThreadId === thread.id
                      ? 'bg-[#3AB7BF]/10 border border-[#3AB7BF]/20'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-[#1E2A38] text-sm line-clamp-2">
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

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {!selectedThread ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-medium">Select a thread</p>
              <p className="text-sm">Choose a thread to start chatting</p>
            </div>
          </div>
        ) : (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg text-[#1E2A38]">{selectedThread.title}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>{selectedThread.messageCount} messages</span>
                    <span className="mx-2">•</span>
                    <span>{selectedThread.participants.length} participants</span>
                    {selectedThread.isAISummarized && (
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
              {threadMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="font-medium">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                threadMessages.map((message, index) => {
                  const showAvatar = index === 0 || threadMessages[index - 1].authorId !== message.authorId;
                  
                  return (
                    <div key={message.id} className={`group relative ${showAvatar ? 'mt-4' : 'mt-1'}`}>
                      <div className="flex items-start">
                        {/* Avatar */}
                        <div className="mr-3">
                          {showAvatar ? (
                            <div className="w-8 h-8 bg-[#3AB7BF] rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {message.authorName.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                          ) : (
                            <div className="w-8 h-8" />
                          )}
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 min-w-0">
                          {/* Author and Timestamp */}
                          {showAvatar && (
                            <div className="flex items-center mb-1">
                              <span className="font-semibold text-[#1E2A38] text-sm mr-2">
                                {message.authorName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTime(message.createdAt)}
                              </span>
                            </div>
                          )}

                          {/* Message Body */}
                          <div className="text-sm text-gray-800 leading-relaxed">
                            {message.body}
                          </div>

                          {/* Reactions */}
                          {message.reactions.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {Object.entries(
                                message.reactions.reduce((acc, reaction) => {
                                  if (!acc[reaction.emoji]) acc[reaction.emoji] = [];
                                  acc[reaction.emoji].push(reaction);
                                  return acc;
                                }, {} as { [emoji: string]: typeof message.reactions })
                              ).map(([emoji, reactions]) => (
                                <button
                                  key={emoji}
                                  onClick={() => addReaction(message.id, emoji)}
                                  className={`flex items-center px-2 py-1 rounded-full text-xs border transition-colors ${
                                    reactions.some(r => r.userId === currentUser.id)
                                      ? 'bg-[#3AB7BF]/20 border-[#3AB7BF]/30 text-[#3AB7BF]'
                                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  <span className="mr-1">{emoji}</span>
                                  <span>{reactions.length}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Message Actions */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                            <button
                              onClick={() => addReaction(message.id, '👍')}
                              className="p-2 hover:bg-gray-100 rounded-l-lg"
                              title="Add reaction"
                            >
                              <Smile className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              className="p-2 hover:bg-gray-100"
                              title="Reply"
                            >
                              <Reply className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              className="p-2 hover:bg-gray-100 rounded-r-lg"
                              title="More actions"
                            >
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex items-end gap-3">
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent resize-none"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                    }}
                  />
                </div>

                <button
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Add emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  variant="primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </>
        )}
      </div>

      {/* Create Thread Modal */}
      {showCreateThread && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1E2A38]">Create New Thread</h3>
              <button
                onClick={() => setShowCreateThread(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thread Title</label>
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateThread()}
                  placeholder="e.g., Q1 Budget Discussion"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateThread(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateThread}
                disabled={!newThreadTitle.trim()}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Thread
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMain;