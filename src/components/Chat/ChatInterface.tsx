import React, { useState, useEffect } from 'react';
import { X, Plus, Hash, Users, Sparkles, MessageSquare } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import ChatSidebar from './ChatSidebar';
import ThreadList from './ThreadList';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import AISummaryPanel from './AISummaryPanel';
import Button from '../UI/Button';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  const {
    channels,
    threads,
    messages,
    users,
    currentUser,
    sendMessage,
    addReaction,
    createThread,
    createChannel,
    deleteChannel,
    markChannelAsRead,
    searchMessages
  } = useChat();

  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAISummary, setShowAISummary] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'team' | 'project' | 'client' | 'private'>('team');
  const [newThreadTitle, setNewThreadTitle] = useState('');

  // Auto-select first channel and thread
  useEffect(() => {
    if (channels.length > 0 && !selectedChannelId) {
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

  const handleDeleteChannel = (channelId: string) => {
    const channelToDelete = channels.find(c => c.id === channelId);
    if (window.confirm(`Are you sure you want to delete "${channelToDelete?.name}"? This action cannot be undone and will remove all messages and threads.`)) {
      // If deleting the currently selected channel, select another one
      if (selectedChannelId === channelId) {
        const remainingChannels = channels.filter(c => c.id !== channelId);
        if (remainingChannels.length > 0) {
          setSelectedChannelId(remainingChannels[0].id);
        } else {
          setSelectedChannelId(null);
          setSelectedThreadId(null);
        }
      }
      deleteChannel(channelId);
    }
  };

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      createChannel(newChannelName, newChannelType, `${newChannelType} channel for collaboration`);
      setNewChannelName('');
      setShowCreateChannel(false);
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

  const handleSendMessage = (content: string, mentions: string[], attachments: any[]) => {
    if (selectedThreadId) {
      sendMessage(selectedThreadId, content, mentions, attachments);
    }
  };

  const selectedChannel = channels.find(c => c.id === selectedChannelId) || null;
  const selectedThread = selectedThreadId 
    ? Object.values(threads).flat().find(t => t.id === selectedThreadId) || null
    : null;
  const threadMessages = selectedThreadId ? messages[selectedThreadId] || [] : [];
  const channelThreads = selectedChannelId ? threads[selectedChannelId] || [] : [];

  if (!isOpen) return null;

  return (
    <div className="h-full">
      <div className="text-center text-gray-500 py-8">
        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-xl font-medium">Team Chat</p>
        <p className="text-sm">Chat functionality coming soon</p>
      </div>

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-[#1E2A38] mb-4">Create New Channel</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channel Name</label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g., Marketing Team"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channel Type</label>
                <select
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="team">Team</option>
                  <option value="project">Project</option>
                  <option value="client">Client</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateChannel(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateChannel}>
                Create Channel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Thread Modal */}
    </div>
  );
};

export default ChatInterface;