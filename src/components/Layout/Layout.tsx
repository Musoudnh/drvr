import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import Footer from './Footer';
import SkipLink from '../UI/SkipLink';
import AIChatButton from '../AI/AIChatButton';
import AIChat from '../AI/AIChat';
import ViewSettingsPanel from '../Forecasting/ViewSettingsPanel';
import { getViewSettings, updateViewSetting } from '../../utils/viewSettings';

interface LayoutProps {
  title: string;
  children: React.ReactNode;
  onOpenViewSettings?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ title, children, onOpenViewSettings }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showViewSettingsPanel, setShowViewSettingsPanel] = useState(false);
  const [hideEmptyAccounts, setHideEmptyAccounts] = useState(() => getViewSettings().hideEmptyAccounts);
  const [showAccountCodes, setShowAccountCodes] = useState(() => getViewSettings().showAccountCodes);
  const [showActualsAsAmount, setShowActualsAsAmount] = useState(() => getViewSettings().showActualsAsAmount);
  const [numberFormat, setNumberFormat] = useState<'actual' | 'thousands' | 'millions'>(() => getViewSettings().numberFormat);

  const handleOpenViewSettings = () => {
    if (onOpenViewSettings) {
      onOpenViewSettings();
    } else {
      setShowViewSettingsPanel(true);
    }
  };

  return (
    <div className="flex h-screen bg-white relative">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          title={title}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenViewSettings={handleOpenViewSettings}
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

      {/* Global View Settings Panel */}
      <ViewSettingsPanel
        isOpen={showViewSettingsPanel}
        onClose={() => setShowViewSettingsPanel(false)}
        hideEmptyAccounts={hideEmptyAccounts}
        onHideEmptyAccountsChange={(value) => {
          setHideEmptyAccounts(value);
          updateViewSetting('hideEmptyAccounts', value);
        }}
        showAccountCodes={showAccountCodes}
        onShowAccountCodesChange={(value) => {
          setShowAccountCodes(value);
          updateViewSetting('showAccountCodes', value);
        }}
        showActualsAsAmount={showActualsAsAmount}
        onShowActualsAsAmountChange={(value) => {
          setShowActualsAsAmount(value);
          updateViewSetting('showActualsAsAmount', value);
        }}
        numberFormat={numberFormat}
        onNumberFormatChange={(value) => {
          setNumberFormat(value);
          updateViewSetting('numberFormat', value);
        }}
      />
    </div>
  );
};

export default Layout;