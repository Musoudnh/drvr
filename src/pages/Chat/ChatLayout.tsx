import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { MessageSquare, Users, Hash, Settings, Plus, Search } from 'lucide-react';

const ChatLayout: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <Outlet />
    </div>
  );
};

export default ChatLayout;