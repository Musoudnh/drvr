import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Footer from './Footer';
import SkipLink from '../UI/SkipLink';
import ChatInterface from '../Chat/ChatInterface';
import AIChatButton from '../AI/AIChatButton';
import AIChat from '../AI/AIChat';
import ChatButton from '../Chat/ChatButton';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <div className="flex h-screen bg-white relative">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title={title} />
        
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
        
        <Footer />
      </div>
      
      {/* Floating Chat Buttons */}
      <ChatButton 
        onClick={() => setShowChat(true)} 
        unreadCount={5} 
      />
      <AIChatButton onClick={() => setShowAIChat(true)} />
      
      {/* Chat Interfaces */}
      <ChatInterface 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
      />
      <AIChat 
        isOpen={showAIChat} 
        onClose={() => setShowAIChat(false)} 
      />
    </div>
  );
};

export default Layout;