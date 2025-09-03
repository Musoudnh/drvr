import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { MessageSquare, Users, Hash, Settings, Plus, Search } from 'lucide-react';

const ChatLayout: React.FC = () => {
  const location = useLocation();
  
  const chatNavItems = [
    { path: '/chat', label: 'All Channels', icon: Hash },
    { path: '/chat/direct', label: 'Direct Messages', icon: Users },
    { path: '/chat/mentions', label: 'Mentions & Reactions', icon: MessageSquare },
    { path: '/chat/settings', label: 'Chat Settings', icon: Settings }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Navigation */}
      <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Chat Navigation">
            {chatNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive(item.path)
                    ? 'border-[#4F46E5] text-[#4F46E5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;