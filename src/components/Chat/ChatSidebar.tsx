import React, { useState } from 'react';
import { Hash, Lock, Users, Plus, Search, MessageSquare, ChevronDown, ChevronRight, X, Trash2 } from 'lucide-react';
import { Channel } from '../../types/chat';

interface ChatSidebarProps {
  channels: Channel[];
  selectedChannelId: string | null;
  onChannelSelect: (channelId: string) => void;
  onCreateChannel: () => void;
  onDeleteChannel: (channelId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  channels,
  selectedChannelId,
  onChannelSelect,
  onCreateChannel,
  onDeleteChannel,
  searchQuery,
  onSearchChange
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['team', 'project']);
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'client':
        return <Users className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const getChannelsByType = (type: Channel['type']) => {
    return channels.filter(channel => channel.type === type);
  };

  const renderChannelSection = (title: string, type: Channel['type']) => {
    const sectionChannels = getChannelsByType(type);
    const isExpanded = expandedSections.includes(type);

    if (sectionChannels.length === 0) return null;

    return (
      <div key={type} className="mb-4">
        <button
          onClick={() => toggleSection(type)}
          className="flex items-center w-full px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 mr-1" />
          ) : (
            <ChevronRight className="w-3 h-3 mr-1" />
          )}
          {title}
          <Plus
            className="w-3 h-3 ml-auto hover:text-[#3AB7BF] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onCreateChannel();
            }}
          />
        </button>
        
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {sectionChannels.map(channel => (
              <button
                key={channel.id}
                onMouseEnter={() => setHoveredChannel(channel.id)}
                onMouseLeave={() => setHoveredChannel(null)}
                onClick={() => onChannelSelect(channel.id)}
                className={`w-full flex items-center px-2 py-2 text-sm rounded-lg transition-colors group ${
                  selectedChannelId === channel.id
                    ? 'bg-[#3AB7BF]/10 text-[#3AB7BF] font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2 text-gray-400">
                  {getChannelIcon(channel.type)}
                </span>
                <span className="flex-1 text-left truncate">{channel.name}</span>
                {hoveredChannel === channel.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChannel(channel.id);
                    }}
                    className="ml-2 p-1 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete channel"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </button>
                )}
                {channel.unreadCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-[#F87171] text-white text-xs rounded-full min-w-[18px] text-center">
                    {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-[#1E2A38] text-white flex flex-col h-full">
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
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
          />
        </div>
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderChannelSection('Team Channels', 'team')}
        {renderChannelSection('Projects', 'project')}
        {renderChannelSection('Clients', 'client')}
        {renderChannelSection('Private', 'private')}
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
  );
};

export default ChatSidebar