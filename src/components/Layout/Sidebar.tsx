import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Users,
  Settings,
  CreditCard,
  Zap,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Shield,
  ChevronDown,
  ChevronRight,
  Building2,
  DollarSign,
  PieChart,
  LineChart,
  Target,
  Receipt,
  AlertCircle,
  LogOut,
  MessageSquare,
  Hash,
  Lock,
  Plus,
  Trash2,
  X,
  MessageCircle,
  Gift,
  HelpCircle,
  Calculator,
  Database,
  GitBranch,
  Brain,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
}

interface ChatChannel {
  id: string;
  name: string;
  type: 'team' | 'project' | 'client' | 'private';
  unreadCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'team' | 'project' | 'client' | 'private'>('team');
  const [newChannelDescription, setNewChannelDescription] = useState('');
  const [contextMenu, setContextMenu] = useState<{ channelId: string; x: number; y: number } | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showExpertContact, setShowExpertContact] = useState(false);
  const [selectedExpertType, setSelectedExpertType] = useState<'tax' | 'finance' | null>(null);
  const [expertContactForm, setExpertContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [supportMessage, setSupportMessage] = useState('');
  const [supportAttachments, setSupportAttachments] = useState<File[]>([]);
  const [channels, setChannels] = useState<ChatChannel[]>([
    { id: '1', name: 'General', type: 'team', unreadCount: 3 },
    { id: '2', name: 'Finance Team', type: 'team', unreadCount: 1 },
    { id: '3', name: 'Q1 Planning', type: 'project' },
    { id: '4', name: 'Client: Acme Corp', type: 'client', unreadCount: 2 }
  ]);
  
  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Check if we're on a financial/forecasting page
  const isFinancialPage = location.pathname.startsWith('/forecasting') || 
                         location.pathname.startsWith('/scenario-planning') || 
                         location.pathname.startsWith('/runway');
  
  const adminNavItems: NavItem[] = [
    { path: '/admin/profile', label: 'Account Profile', icon: User },
    { path: '/admin/team', label: 'Team Management', icon: Users },
    { path: '/admin/billing', label: 'Subscription', icon: CreditCard },
    { path: '/admin/integrations', label: 'Integrations', icon: Zap },
    { path: '/admin/security', label: 'Security & SOX', icon: Shield },
    { path: '/admin/audit', label: 'Audit Log', icon: FileText },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  const companyNavItems: NavItem[] = [
    { path: '/dashboard', label: 'Overview', icon: Home },
    { path: '/analytics', label: 'Analysis', icon: PieChart },
    {
      path: '/financials',
      label: 'Financials',
      icon: DollarSign,
      children: [
        { path: '/forecasting', label: 'Forecasting', icon: Target },
        { path: '/forecasting/variance-insights', label: 'Variance & Insights', icon: BarChart3 },
        { path: '/runway', label: 'Scenario Planner', icon: TrendingUp },
        { path: '/financials/sandbox', label: 'Sandbox', icon: Calculator }
      ]
    },
    { path: '/benchmarks', label: 'Benchmarks', icon: BarChart3 },
    { path: '/tasks', label: 'Tasks', icon: CheckCircle },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/alerts', label: 'Alerts', icon: AlertCircle }
  ];

  // Financial navigation items (shown when on forecasting-related pages)
  const financialNavItems: NavItem[] = [
    { path: '/dashboard', label: 'Overview', icon: Home },
    { path: '/analytics', label: 'Analysis', icon: PieChart },
    {
      path: '/financials',
      label: 'Financials',
      icon: DollarSign,
      children: [
        { path: '/forecasting', label: 'Forecasting', icon: Target },
        { path: '/forecasting/variance-insights', label: 'Variance & Insights', icon: BarChart3 },
        { path: '/runway', label: 'Scenario Planner', icon: TrendingUp },
        { path: '/financials/sandbox', label: 'Sandbox', icon: Calculator }
      ]
    },
    { path: '/benchmarks', label: 'Benchmarks', icon: BarChart3 },
    { path: '/tasks', label: 'Tasks', icon: CheckCircle },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/alerts', label: 'Alerts', icon: AlertCircle }
  ];
  // Use appropriate nav items based on current page context
  const navItems = isAdminPage ? adminNavItems : 
                   isFinancialPage ? financialNavItems : 
                   companyNavItems;
  
  // Check if any items with children are expanded
  const hasExpandedChildren = expandedItems.some(path => 
    navItems.some(item => item.path === path && item.children && item.children.length > 0)
  );
  
  // Dynamic width based on expansion state
  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  const handleCreateChannel = () => {
    if (newChannelName.trim()) {
      const newChannel: ChatChannel = {
        id: `c${Date.now()}`,
        name: newChannelName,
        type: newChannelType
      };
      setChannels(prev => [...prev, newChannel]);
      setNewChannelName('');
      setNewChannelDescription('');
      setShowCreateModal(false);
    }
  };

  const handleDeleteChannel = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel && window.confirm(`Are you sure you want to delete "${channel.name}"? This action cannot be undone.`)) {
      setChannels(prev => prev.filter(c => c.id !== channelId));
    }
    setContextMenu(null);
  };

  const handleContactSupportClick = () => {
    setShowContactSupport(true);
  };

  const handleExpertClick = (expertType: 'tax' | 'finance') => {
    setSelectedExpertType(expertType);
    setShowExpertContact(true);
  };

  const handleSendExpertRequest = () => {
    if (expertContactForm.name.trim() && expertContactForm.email.trim() && expertContactForm.message.trim()) {
      console.log('Expert request:', { type: selectedExpertType, ...expertContactForm });
      alert(`Your request has been sent to our ${selectedExpertType} expert. We'll get back to you within 2 hours.`);
      setExpertContactForm({ name: '', email: '', phone: '', company: '', message: '' });
      setShowExpertContact(false);
      setShowExpertModal(false);
      setSelectedExpertType(null);
    }
  };

  const handleSendSupportMessage = () => {
    if (supportMessage.trim()) {
      // In a real app, this would send the message to support
      console.log('Support message:', supportMessage);
      console.log('Attachments:', supportAttachments);
      alert('Your message has been sent to our support team. We\'ll get back to you within 2 hours.');
      setSupportMessage('');
      setSupportAttachments([]);
      setShowContactSupport(false);
      setShowHelpModal(false);
    }
  };

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSupportAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setSupportAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleRightClick = (e: React.MouseEvent, channelId: string) => {
    e.preventDefault();
    setContextMenu({
      channelId,
      x: e.clientX,
      y: e.clientY
    });
  };

  const getChannelIcon = (type: ChatChannel['type']) => {
    switch (type) {
      case 'private':
        return <Lock className="w-4 h-4" />;
      case 'client':
        return <Users className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const getChannelsByType = (type: ChatChannel['type']) => {
    return channels.filter(channel => channel.type === type);
  };
  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.path);
    const active = isActive(item.path) || (hasChildren && item.children?.some(child => isActive(child.path)));

    return (
      <div key={item.path} className="mb-2">
        <div className="flex items-center">
          <Link
            to={item.path}
            className={`flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex-1 ${
              active
                ? 'text-[#101010] shadow-sm'
                : 'text-[#101010] hover:text-[#101010]'
            } ${depth > 0 ? 'ml-3' : ''}`}
            style={{
              backgroundColor: active ? '#eff1f4' : 'transparent',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: active ? 'translateX(4px)' : 'translateX(0)',
              color: '#101010',
              fontSize: '12px',
              fontWeight: 'var(--font-heavy)'
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = '#F5F5F0';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <item.icon className={`${isCollapsed ? 'w-4 h-4' : 'w-3 h-3 mr-2'} flex-shrink-0`} />
            {!isCollapsed && <span className="truncate tracking-wide">{item.label}</span>}
          </Link>
          {hasChildren && !isCollapsed && (
            <button
              onClick={() => toggleExpanded(item.path)}
              className="p-0.5 text-[#101010] hover:text-[#101010] transition-colors ml-1"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && !isCollapsed && (
          <div className={`mt-1 space-y-1 ${depth > 0 ? 'ml-2' : ''}`}>
            {item.children!.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderChannelSection = (title: string, type: ChatChannel['type']) => {
    const sectionChannels = getChannelsByType(type);
    
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          <span>{title}</span>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="hover:text-white transition-colors"
            title="Create new channel"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        
        <div className="space-y-1">
          {sectionChannels.map(channel => (
            <div
              key={channel.id}
              onContextMenu={(e) => handleRightClick(e, channel.id)}
              className="group"
            >
              <Link
                to="/chat"
                className="flex items-center px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 text-[#101010] hover:text-[#101010] hover:bg-[#F5F5F0]"
                onClick={() => handleChannelSelect(channel.id)}
              >
                <span className="mr-2 text-gray-400">
                  {getChannelIcon(channel.type)}
                </span>
                <span className="flex-1 text-left truncate">{channel.name}</span>
                {channel.unreadCount && channel.unreadCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-[#F87171] text-white text-xs rounded-full min-w-[18px] text-center">
                    {channel.unreadCount > 99 ? '99+' : channel.unreadCount}
                  </span>
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleChannelSelect = (channelId: string) => {
    // Store selected channel in localStorage or context for the chat page to use
    localStorage.setItem('selectedChannelId', channelId);
  };

  const renderChatNavigation = () => (
    <nav className="flex-1 overflow-y-auto mt-12">
      {!isCollapsed && (
        <div className="space-y-1">
          {renderChannelSection('Team Channels', 'team')}
          {renderChannelSection('Projects', 'project')}
          {renderChannelSection('Private', 'private')}
        </div>
      )}
    </nav>
  );

  // Close context menu when clicking elsewhere
  React.useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const [navigationColor, setNavigationColor] = React.useState('#4F46E5');

  // Listen for navigation color changes
  React.useEffect(() => {
    const handleColorChange = () => {
      const color = document.documentElement.style.getPropertyValue('--nav-bg-color') || '#4F46E5';
      setNavigationColor(color);
    };

    // Set up observer for CSS custom property changes
    const observer = new MutationObserver(handleColorChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    // Auto-expand Forecasting when on financial pages
    if (isFinancialPage && !expandedItems.includes('/financials')) {
      setExpandedItems(prev => [...prev, '/financials']);
    }

    return () => observer.disconnect();
  }, [isFinancialPage]);

  return (
    <div className={`h-screen transition-all duration-500 ease-in-out ${sidebarWidth} flex flex-col px-4 pb-6 gap-8 mr-3 relative`} style={{ backgroundColor: '#f8f9fb' }}>
      <nav className="flex-1 overflow-y-auto mt-8">
        <div className="space-y-4">
          {navItems.map(item => renderNavItem(item))}
        </div>
      </nav>
      
      <div className="pt-3">
        {isAdminPage ? (
          <div className="space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 text-[#101010] hover:text-[#101010] hover:bg-[#F5F5F0]"
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateX(0)',
                fontSize: '12px',
                fontWeight: 'var(--font-heavy)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5F0';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Home className={`${isCollapsed ? 'w-4 h-4' : 'w-3 h-3 mr-2'} flex-shrink-0`} />
              {!isCollapsed && <span className="truncate tracking-wide">Back to Dashboard</span>}
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 text-[#101010] hover:text-[#F87171] hover:bg-[#F5F5F0]"
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateX(0)',
                fontSize: '12px',
                fontWeight: 'var(--font-heavy)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5F0';
                e.currentTarget.style.color = '#F87171';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <LogOut className={`${isCollapsed ? 'w-4 h-4' : 'w-3 h-3 mr-2'} flex-shrink-0`} />
              {!isCollapsed && <span className="truncate tracking-wide">Logout</span>}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => setShowExpertModal(true)}
              className="w-full flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 text-[#101010] hover:text-[#101010] hover:bg-[#F5F5F0]"
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateX(0)',
                fontSize: '12px',
                fontWeight: 'var(--font-heavy)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5F0';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <MessageCircle className={`${isCollapsed ? 'w-4 h-4' : 'w-3 h-3 mr-2'} flex-shrink-0`} />
              {!isCollapsed && <span className="truncate tracking-wide">Talk to Expert</span>}
            </button>
            <button
              onClick={() => navigate('/referrals')}
              className="w-full flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 text-[#101010] hover:text-[#101010] hover:bg-[#F5F5F0]"
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateX(0)',
                fontSize: '12px',
                fontWeight: 'var(--font-heavy)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5F0';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Gift className={`${isCollapsed ? 'w-4 h-4' : 'w-3 h-3 mr-2'} flex-shrink-0`} />
              {!isCollapsed && <span className="truncate tracking-wide">Referrals</span>}
            </button>
            <button
              onClick={() => setShowHelpModal(true)}
              className="w-full flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 text-[#101010] hover:text-[#101010] hover:bg-[#F5F5F0]"
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateX(0)',
                fontSize: '12px',
                fontWeight: 'var(--font-heavy)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5F0';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <HelpCircle className={`${isCollapsed ? 'w-4 h-4' : 'w-3 h-3 mr-2'} flex-shrink-0`} />
              {!isCollapsed && <span className="truncate tracking-wide">Help Center</span>}
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 text-[#101010] hover:text-[#F87171] hover:bg-[#F5F5F0]"
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateX(0)',
                fontSize: '12px',
                fontWeight: 'var(--font-heavy)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5F0';
                e.currentTarget.style.color = '#F87171';
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#101010';
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <LogOut className={`${isCollapsed ? 'w-4 h-4' : 'w-3 h-3 mr-2'} flex-shrink-0`} />
              {!isCollapsed && <span className="truncate tracking-wide">Logout</span>}
            </button>
          </div>
        )}
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#101010]">Create New Channel</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channel Name</label>
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateChannel()}
                  placeholder="e.g., Marketing Team"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  autoFocus
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                  placeholder="Brief description of the channel purpose"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChannel}
                disabled={!newChannelName.trim()}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Channel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Center Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg p-6 max-w-[90vw] max-h-[80vh] overflow-y-auto ${
            showContactSupport ? 'w-[500px]' : 'w-[450px]'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">
                {showContactSupport ? 'Contact Support' : 'Help Center'}
              </h3>
              <button
                onClick={() => {
                  setShowHelpModal(false);
                  setShowContactSupport(false);
                  setSupportMessage('');
                  setSupportAttachments([]);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {showContactSupport ? (
              /* Contact Support Message Interface */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How can we help you?
                  </label>
                  <textarea
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe your issue or question in detail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent resize-none"
                    rows={6}
                  />
                </div>

                {/* File Attachments */}
                {supportAttachments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                    <div className="space-y-2">
                      {supportAttachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      id="support-file-upload"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileAttachment}
                      className="hidden"
                    />
                    <label
                      htmlFor="support-file-upload"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Attach File
                    </label>
                    <button
                      onClick={() => {
                        setShowContactSupport(false);
                        setSupportAttachments([]);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <button
                    onClick={handleSendSupportMessage}
                    disabled={!supportMessage.trim()}
                    className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </button>
                </div>
              </div>
            ) : (
              /* Help Center Options */
              <div className="space-y-4">
                {/* Contact Support Option */}
                <div 
                  onClick={handleContactSupportClick}
                  className="p-4 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[#3AB7BF]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-[#3AB7BF]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#101010] mb-1">Contact Support</h4>
                      <p className="text-sm text-gray-600 mb-2">Get direct help from our support team</p>
                    </div>
                  </div>
                </div>

                {/* Separator Line */}
                <div className="border-t border-gray-200"></div>

                {/* Help Desk Option */}
                <div className="p-4 hover:bg-gray-50 transition-all cursor-pointer">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-[#4ADE80]/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <FileText className="w-4 h-4 text-[#4ADE80]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#101010] mb-1">Help Desk</h4>
                      <p className="text-sm text-gray-600 mb-2">Browse our knowledge base and articles</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Footer with email contact */}
            {!showContactSupport && (
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    setShowHelpModal(false);
                    setShowContactSupport(false);
                    setSupportMessage('');
                    setSupportAttachments([]);
                  }}
                  className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200"
                  style={{
                    backgroundColor: '#212B36',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a2028';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#212B36';
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expert Modal */}
      {showExpertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg p-6 max-w-[90vw] max-h-[80vh] overflow-y-auto ${
            showExpertContact ? 'w-[500px]' : 'w-[450px]'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">
                {showExpertContact ? 'Contact Expert' : 'Talk to Expert'}
              </h3>
              <button
                onClick={() => {
                  setShowExpertModal(false);
                  setShowExpertContact(false);
                  setSelectedExpertType(null);
                  setExpertContactForm({ name: '', email: '', phone: '', company: '', message: '' });
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {showExpertContact ? (
              /* Expert Contact Form */
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-full flex items-center justify-center mx-auto mb-3">
                    {selectedExpertType === 'tax' ? (
                      <Calculator className="w-8 h-8 text-white" />
                    ) : (
                      <DollarSign className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-[#101010]">
                    {selectedExpertType === 'tax' ? 'Tax Expert' : 'Finance Expert'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedExpertType === 'tax' 
                      ? 'Get help with tax planning and compliance'
                      : 'Expert guidance on financial planning and analysis'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={expertContactForm.name}
                      onChange={(e) => setExpertContactForm({...expertContactForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={expertContactForm.email}
                      onChange={(e) => setExpertContactForm({...expertContactForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={expertContactForm.phone}
                      onChange={(e) => setExpertContactForm({...expertContactForm, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={expertContactForm.company}
                      onChange={(e) => setExpertContactForm({...expertContactForm, company: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How can our {selectedExpertType} expert help you?
                  </label>
                  <textarea
                    value={expertContactForm.message}
                    onChange={(e) => setExpertContactForm({...expertContactForm, message: e.target.value})}
                    placeholder="Describe your specific needs or questions..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowExpertContact(false);
                      setSelectedExpertType(null);
                      setExpertContactForm({ name: '', email: '', phone: '', company: '', message: '' });
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSendExpertRequest}
                    disabled={!expertContactForm.name.trim() || !expertContactForm.email.trim() || !expertContactForm.message.trim()}
                    className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Request
                  </button>
                </div>
              </div>
            ) : (
              /* Expert Selection Options */
              <div className="space-y-4">
                {/* Tax Expert Option */}
                <div 
                  onClick={() => handleExpertClick('tax')}
                  className="p-4 hover:bg-gray-50 transition-all cursor-pointer rounded-lg border border-gray-200 hover:border-[#3AB7BF]"
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Calculator className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#101010] mb-1">Tax Expert</h4>
                      <p className="text-sm text-gray-600 mb-2">Get help with tax planning, compliance, and optimization strategies</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="w-2 h-2 bg-[#4ADE80] rounded-full mr-2"></span>
                        Available now • Response within 2 hours
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finance Expert Option */}
                <div 
                  onClick={() => handleExpertClick('finance')}
                  className="p-4 hover:bg-gray-50 transition-all cursor-pointer rounded-lg border border-gray-200 hover:border-[#3AB7BF]"
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#3AB7BF]/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-[#3AB7BF]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#101010] mb-1">Finance Expert</h4>
                      <p className="text-sm text-gray-600 mb-2">Expert guidance on financial planning, analysis, and business strategy</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="w-2 h-2 bg-[#4ADE80] rounded-full mr-2"></span>
                        Available now • Response within 1 hour
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Footer with cancel button */}
            {!showExpertContact && (
              <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                <button
                  onClick={() => {
                    setShowExpertModal(false);
                    setShowExpertContact(false);
                    setSelectedExpertType(null);
                    setExpertContactForm({ name: '', email: '', phone: '', company: '', message: '' });
                  }}
                  className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200"
                  style={{
                    backgroundColor: '#212B36',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a2028';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#212B36';
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Context Menu for Channel Deletion */}
      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
          style={{
            left: contextMenu.x,
            top: contextMenu.y
          }}
        >
          <button
            onClick={() => handleDeleteChannel(contextMenu.channelId)}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Channel
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;