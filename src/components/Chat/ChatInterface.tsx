import React, { useState, useEffect } from 'react';
import { X, Plus, Hash, Users, Sparkles, MessageSquare, Send, Paperclip, Smile, Settings, Search, Lock, FileText } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import Button from '../UI/Button';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'slack' | 'teams' | 'google' | 'native'>('native');
  const [slackConnected, setSlackConnected] = useState(false);
  const [teamsConnected, setTeamsConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectForm, setConnectForm] = useState({
    tabName: '',
    platform: 'slack' as 'slack' | 'teams' | 'google'
  });
  const [connectedChats, setConnectedChats] = useState<Array<{
    id: string;
    name: string;
    platform: 'slack' | 'teams' | 'google';
    connected: boolean;
  }>>([]);

  // Native chat state
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>('general');
  const [newMessage, setNewMessage] = useState('');
  const [showRightPanel, setShowRightPanel] = useState(true);

  const nativeChannels = [
    { id: 'general', name: 'General', type: 'team', unreadCount: 3 },
    { id: 'finance', name: 'Finance', type: 'team', unreadCount: 1 },
    { id: 'marketing', name: 'Marketing', type: 'team', unreadCount: 0 },
    { id: 'operations', name: 'Operations', type: 'team', unreadCount: 2 }
  ];

  const nativeMessages = [
    {
      id: '1',
      author: 'Sarah Johnson',
      content: 'Great work on the Q4 results everyone!',
      timestamp: new Date(Date.now() - 1800000),
      avatar: 'SJ'
    },
    {
      id: '2',
      author: 'Michael Chen',
      content: 'The profit margins improved significantly. Should we schedule a team meeting to discuss Q1 strategy?',
      timestamp: new Date(Date.now() - 900000),
      avatar: 'MC'
    },
    {
      id: '3',
      author: 'Emily Rodriguez',
      content: 'I can prepare the Q1 forecast presentation. When works best for everyone?',
      timestamp: new Date(Date.now() - 300000),
      avatar: 'ER'
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const renderIntegrationTab = (type: 'slack' | 'teams' | 'google') => {
    const isConnected = type === 'slack' ? slackConnected : type === 'teams' ? teamsConnected : googleConnected;
    const setConnected = type === 'slack' ? setSlackConnected : type === 'teams' ? setTeamsConnected : setGoogleConnected;
    const serviceName = type === 'slack' ? 'Slack' : type === 'teams' ? 'Microsoft Teams' : 'Google Chat';
    const serviceColor = type === 'slack' ? '#4A154B' : type === 'teams' ? '#6264A7' : '#34A853';

    if (!isConnected) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${serviceColor}20` }}
            >
              <MessageSquare className="w-8 h-8" style={{ color: serviceColor }} />
            </div>
            <h3 className="text-xl font-semibold text-[#101010] mb-2">Connect to {serviceName}</h3>
            <p className="text-gray-600 mb-6">
              Connect your {serviceName} workspace to chat directly within FinanceFlow.
            </p>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                onClick={() => setConnected(true)}
                className="w-full"
                style={{ backgroundColor: serviceColor }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Connect {serviceName}
              </Button>
              <p className="text-xs text-gray-500">
                Secure OAuth integration • Read-only access • Revoke anytime
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center mr-2"
              style={{ backgroundColor: serviceColor }}
            >
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-[#101010]">Connected to {serviceName}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 h-[600px]">
          <iframe
            src={type === 'slack' 
              ? 'https://app.slack.com/embed' 
              : type === 'teams'
              ? 'https://teams.microsoft.com/embed'
              : 'https://chat.google.com/embed'
            }
            className="w-full h-full rounded-lg"
            title={`${serviceName} Chat`}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    );
  };

  const renderNativeChat = () => (
    <div className="h-full flex bg-white rounded-lg border border-gray-200">
      {/* Left Panel - Channels */}
      <div className="w-64 bg-[#101010] text-white flex flex-col rounded-l-lg">
        {/* Header */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Team Chat</h2>
            <MessageSquare className="w-5 h-5 text-[#3AB7BF]" />
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              <span>Channels</span>
              <button className="hover:text-white transition-colors">
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-1">
              {nativeChannels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannelId(channel.id)}
                  className={`w-full flex items-center px-2 py-2 text-sm rounded-lg transition-colors ${
                    selectedChannelId === channel.id
                      ? 'bg-[#3AB7BF]/10 text-[#3AB7BF] font-medium'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="flex-1 text-left">{channel.name}</span>
                  {channel.unreadCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-[#F87171] text-white text-xs rounded-full min-w-[18px] text-center">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Status */}
        <div className="p-4 border-t border-gray-600">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#3AB7BF] rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-medium">SJ</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Sarah Johnson</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#4ADE80] rounded-full mr-2"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Hash className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="font-bold text-lg text-[#101010]">
                {nativeChannels.find(c => c.id === selectedChannelId)?.name || 'General'}
              </h2>
            </div>
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {nativeMessages.map((message, index) => {
            const showAvatar = index === 0 || nativeMessages[index - 1].author !== message.author;
            
            return (
              <div key={message.id} className={`group relative ${showAvatar ? 'mt-4' : 'mt-1'}`}>
                <div className="flex items-start">
                  {/* Avatar */}
                  <div className="mr-3">
                    {showAvatar ? (
                      <div className="w-8 h-8 bg-[#3AB7BF] rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {message.avatar}
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
                        <span className="font-semibold text-[#101010] text-sm mr-2">
                          {message.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </span>
                      </div>
                    )}

                    {/* Message Body */}
                    <div className="text-sm text-gray-800 leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
      </div>

      {/* Right Panel */}
      {showRightPanel && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col rounded-r-lg">
          {/* Panel Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-[#101010]">Channel Info</h3>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Pinned Messages */}
            <div>
              <h4 className="font-medium text-[#101010] mb-3">Pinned Messages</h4>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">Q4 results meeting scheduled for tomorrow at 2 PM</p>
                  <p className="text-xs text-gray-500 mt-1">Pinned by Sarah Johnson</p>
                </div>
              </div>
            </div>

            {/* Shared Files */}
            <div>
              <h4 className="font-medium text-[#101010] mb-3">Shared Files</h4>
              <div className="space-y-2">
                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-[#3AB7BF]/10 rounded flex items-center justify-center mr-3">
                    <FileText className="w-4 h-4 text-[#3AB7BF]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#101010]">Q1_Forecast.xlsx</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Notes */}
            <div>
              <h4 className="font-medium text-[#101010] mb-3">Quick Notes</h4>
              <textarea
                placeholder="Add your notes here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent text-sm"
                rows={4}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] h-[90vh] max-w-7xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#101010]">Team Chat</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Chat Navigation">
            <button
              onClick={() => setActiveTab('native')}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'native'
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Native Chat
            </button>
            {connectedChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveTab(chat.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === chat.id
                    ? `border-[${chat.platform === 'slack' ? '#4A154B' : chat.platform === 'teams' ? '#6264A7' : '#34A853'}] text-[${chat.platform === 'slack' ? '#4A154B' : chat.platform === 'teams' ? '#6264A7' : '#34A853'}]`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className={`w-4 h-4 rounded mr-2`} style={{ backgroundColor: chat.platform === 'slack' ? '#4A154B' : chat.platform === 'teams' ? '#6264A7' : '#34A853' }} />
                {chat.name}
              </button>
            ))}
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Chat
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-hidden">
          {activeTab === 'native' && (
            <div className="h-full">
              {renderNativeChat()}
            </div>
          )}
          {activeTab === 'slack' && renderIntegrationTab('slack')}
          {activeTab === 'teams' && renderIntegrationTab('teams')}
          {activeTab === 'google' && renderIntegrationTab('google')}
          
          {connectedChats.map(chat => (
            activeTab === chat.id && (
              <div key={chat.id}>
                {renderIntegrationTab(chat.platform)}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Connect Chat Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Connect Chat</h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tab Name</label>
                <input
                  type="text"
                  value={connectForm.tabName}
                  onChange={(e) => setConnectForm({...connectForm, tabName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="e.g., Marketing Chat"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setConnectForm({...connectForm, platform: 'slack'})}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      connectForm.platform === 'slack'
                        ? 'border-[#4A154B] bg-[#4A154B]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 bg-[#4A154B] rounded mx-auto mb-2" />
                    <p className="font-medium text-[#101010]">Slack</p>
                  </button>
                  <button
                    onClick={() => setConnectForm({...connectForm, platform: 'teams'})}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      connectForm.platform === 'teams'
                        ? 'border-[#6264A7] bg-[#6264A7]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 bg-[#6264A7] rounded mx-auto mb-2" />
                    <p className="font-medium text-[#101010]">Teams</p>
                  </button>
                  <button
                    onClick={() => setConnectForm({...connectForm, platform: 'google'})}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      connectForm.platform === 'google'
                        ? 'border-[#34A853] bg-[#34A853]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 bg-[#34A853] rounded mx-auto mb-2" />
                    <p className="font-medium text-[#101010]">Google</p>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="viewType"
                      value="embedded"
                      defaultChecked
                      className="w-4 h-4 text-[#4F46E5] border-gray-300 focus:ring-[#4F46E5] mr-3"
                    />
                    <div>
                      <p className="font-medium text-[#101010]">Connected as Embedded</p>
                      <p className="text-sm text-gray-600">Display the chat directly within FinanceFlow</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="viewType"
                      value="link"
                      className="w-4 h-4 text-[#4F46E5] border-gray-300 focus:ring-[#4F46E5] mr-3"
                    />
                    <div>
                      <p className="font-medium text-[#101010]">Connected as Link</p>
                      <p className="text-sm text-gray-600">Open the chat in a new tab/window</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code</label>
                <textarea
                  placeholder="Paste your embed code here (for embedded view type)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-sm"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  For embedded view: Paste the iframe embed code from your platform
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (connectForm.tabName.trim()) {
                    const newChat = {
                      id: `chat_${Date.now()}`,
                      name: connectForm.tabName,
                      platform: connectForm.platform,
                      connected: true
                    };
                    setConnectedChats(prev => [...prev, newChat]);
                    setActiveTab(newChat.id as any);
                    setConnectForm({ tabName: '', platform: 'slack' });
                    setShowConnectModal(false);
                  }
                }}
                disabled={!connectForm.tabName.trim()}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#212B36',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#1a2028';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#212B36';
                  }
                }}
              >
                Connect Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;