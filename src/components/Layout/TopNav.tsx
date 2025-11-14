import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, LogOut, User, ChevronDown, Settings, Filter, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { companyService, type Company } from '../../services/companyService';

interface TopNavProps {
  onToggleSidebar: () => void;
  title: string;
  onOpenViewSettings?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar, title, onOpenViewSettings }) => {
  const { logout, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompanyState] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const userCompanies = await companyService.getUserCompanies();
        setCompanies(userCompanies);

        const selectedId = await companyService.getSelectedCompany();
        if (selectedId) {
          const selected = userCompanies.find(c => c.id === selectedId);
          setSelectedCompanyState(selected || userCompanies[0] || null);
        } else if (userCompanies.length > 0) {
          setSelectedCompanyState(userCompanies[0]);
        }
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCompany = (company: Company) => {
    setSelectedCompanyState(company);
    companyService.setSelectedCompany(company.id);
    setShowCompanyDropdown(false);
  };

  const notifications = [
    {
      id: 1,
      title: 'Cash Flow Alert',
      message: 'Cash flow projection shows potential shortage in 30 days',
      time: '2 hours ago',
      type: 'critical',
      unread: true
    },
    {
      id: 2,
      title: 'Payment Received',
      message: 'Invoice #INV-2025-045 payment of $12,500 received',
      time: '4 hours ago',
      type: 'success',
      unread: true
    },
    {
      id: 3,
      title: 'Monthly Report Ready',
      message: 'January financial report has been generated',
      time: '6 hours ago',
      type: 'info',
      unread: false
    },
    {
      id: 4,
      title: 'Budget Variance',
      message: 'Marketing spend is 15% over budget for this month',
      time: '1 day ago',
      type: 'warning',
      unread: false
    },
    {
      id: 5,
      title: 'Team Member Added',
      message: 'Emily Rodriguez has been added to the Finance team',
      time: '2 days ago',
      type: 'info',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-gray-600 hover:text-[#101010] transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Company Selector */}
          <div className="relative" ref={companyRef}>
            <button
              onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors"
              disabled={loading || companies.length === 0}
            >
              <Building2 className="w-4 h-4 text-[#7B68EE]" />
              <span>{selectedCompany?.name || 'Select Company'}</span>
              {companies.length > 1 && <ChevronDown className="w-3 h-3 ml-1" />}
            </button>

            {/* Company Dropdown */}
            {showCompanyDropdown && companies.length > 1 && (
              <div className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2 max-h-64 overflow-y-auto">
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleSelectCompany(company)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCompany?.id === company.id
                          ? 'bg-[#F5F3FF] text-[#7B68EE] font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-xs text-gray-500">{company.code}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <h1 className="text-lg font-semibold text-[#101010]">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Settings Filter */}
          {onOpenViewSettings && (
            <button
              onClick={onOpenViewSettings}
              className="px-2 py-1 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
              title="View Settings"
            >
              <Filter className="w-4 h-4" />
            </button>
          )}

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative px-2 py-1 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#F87171] text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-1 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#101010] text-sm">Notifications</h3>
                    <span className="text-xs text-gray-500">{unreadCount} unread</span>
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-l-4 hover:bg-gray-50 cursor-pointer ${
                        notification.type === 'critical' ? 'border-[#F87171]' :
                        notification.type === 'warning' ? 'border-[#F59E0B]' :
                        notification.type === 'success' ? 'border-[#4ADE80]' :
                        'border-[#3AB7BF]'
                      }`}
                    >
                      <div className="flex items-start">
                        <span className="text-base mr-2">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <p className={`text-xs ${notification.unread ? 'font-semibold text-[#101010]' : 'font-medium text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-1.5 h-1.5 bg-[#3AB7BF] rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-gray-200 flex justify-between">
                  <Link 
                    to="/alerts" 
                    className="text-xs text-[#3AB7BF] hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                  <button className="text-xs text-gray-500 hover:text-gray-700">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <Link
            to="/admin/profile"
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <Link
              to="/admin"
              className="px-2 py-1 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default TopNav;