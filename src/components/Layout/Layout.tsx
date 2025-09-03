import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Footer from './Footer';
import SkipLink from '../UI/SkipLink';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title={title} />
        
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;