import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Footer from './Footer';
import SkipLink from '../UI/SkipLink';
import AIChatButton from '../AI/AIChatButton';
import AIChat from '../AI/AIChat';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  onOpenViewSettings?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ title, children, onOpenViewSettings }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <div className="flex h-screen bg-white relative">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          title={title}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenViewSettings={onOpenViewSettings}
        />
        
        <main id="main-content" className="flex-1 overflow-auto px-6 py-6">
          {children}
        </main>
        
        <Footer />
      </div>
      
      {/* Floating AI Chat Button */}
      <AIChatButton onClick={() => setShowAIChat(true)} />
      
      {/* AI Chat Interface */}
      <AIChat 
        isOpen={showAIChat} 
        onClose={() => setShowAIChat(false)} 
      />
    </div>
  );
};

export default Layout;