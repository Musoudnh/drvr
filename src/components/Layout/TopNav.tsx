import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface TopNavProps {
  onToggleSidebar: () => void;
  title: string;
}

const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar, title }) => {
  const { logout, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-[#1E2A38]">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F87171] text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#1E2A38]">Notifications</h3>
                    <span className="text-sm text-gray-500">{unreadCount} unread</span>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-l-4 hover:bg-gray-50 cursor-pointer ${
                        notification.type === 'critical' ? 'border-[#F87171]' :
                        notification.type === 'warning' ? 'border-[#F59E0B]' :
                        notification.type === 'success' ? 'border-[#4ADE80]' :
                        'border-[#3AB7BF]'
                      }`}
                    >
                      <div className="flex items-start">
                        <span className="text-lg mr-3">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <p className={`text-sm ${notification.unread ? 'font-semibold text-[#1E2A38]' : 'font-medium text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-[#3AB7BF] rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200 flex justify-between">
                  <Link 
                    to="/alerts" 
                    className="text-sm text-[#3AB7BF] hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all notifications
                  </Link>
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings Button */}
          <Link
            to="/admin/settings"
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <Link
              to="/admin"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-[#3AB7BF] rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-white" />
              </div>
            </Link>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default TopNav;