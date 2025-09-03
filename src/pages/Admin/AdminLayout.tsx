import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, Users, CreditCard, Zap, Shield, FileText, Settings } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  const adminNavItems = [
    { path: '/admin/profile', label: 'Account Profile', icon: User },
    { path: '/admin/team', label: 'Team Management', icon: Users },
    { path: '/admin/billing', label: 'Billing', icon: CreditCard },
    { path: '/admin/integrations', label: 'Integrations', icon: Zap },
    { path: '/admin/security', label: 'Security', icon: Shield },
    { path: '/admin/audit', label: 'Audit Log', icon: FileText }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="space-y-6">
      {/* Admin Navigation */}
      <div className="bg-white rounded-lg mt-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 pt-6 mt-4" aria-label="Admin Navigation">
            {adminNavItems.map((item) => (
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
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;