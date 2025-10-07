import React from 'react';
import { Users, Building, CreditCard, Activity, UserPlus, DollarSign } from 'lucide-react';
import Card from '../../components/UI/Card';

const AdminDashboard: React.FC = () => {
  const adminMetrics = [
    { label: 'Total Companies', value: '1,247', change: '+23', positive: true, icon: Building },
    { label: 'Active Users', value: '8,459', change: '+145', positive: true, icon: Users },
    { label: 'Monthly Revenue', value: '$284,750', change: '+18.5%', positive: true, icon: DollarSign },
    { label: 'System Health', value: '99.9%', change: 'Stable', positive: true, icon: Activity }
  ];

  const recentCompanies = [
    { name: 'TechStart Inc.', plan: 'Professional', joined: '2 hours ago', status: 'active' },
    { name: 'Global Manufacturing', plan: 'Enterprise', joined: '5 hours ago', status: 'setup' },
    { name: 'Digital Marketing Co.', plan: 'Starter', joined: '1 day ago', status: 'active' },
    { name: 'Healthcare Solutions', plan: 'Professional', joined: '2 days ago', status: 'active' }
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#1E2A38] to-[#3AB7BF] rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-[#C7D2FE]">Manage your SaaS platform and monitor system performance.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-[#101010] mt-1">{metric.value}</p>
                <p className="text-xs mt-2 text-[#4ADE80]">
                  +{metric.change}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#3AB7BF]/10">
                <metric.icon className="w-6 h-6 text-[#3AB7BF]" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Company Signups">
          <div className="space-y-4">
            {recentCompanies.map((company, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-[#101010]">{company.name}</p>
                  <p className="text-xs text-gray-500">{company.plan} • {company.joined}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  company.status === 'active' 
                    ? 'bg-[#4ADE80]/20 text-[#4ADE80]' 
                    : 'bg-[#F87171]/20 text-[#F87171]'
                }`}>
                  {company.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="System Overview">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-medium text-gray-700">Server Status</span>
              <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">Online</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-medium text-gray-700">Database</span>
              <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">Healthy</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-medium text-gray-700">API Response</span>
              <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">Fast</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-medium text-gray-700">Storage</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">78% Used</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-[#3AB7BF]/10 hover:bg-[#3AB7BF]/20 rounded-lg transition-colors text-left">
            <UserPlus className="w-6 h-6 text-[#3AB7BF] mb-2" />
            <p className="font-medium text-[#101010]">Add New Company</p>
            <p className="text-xs text-gray-600">Onboard a new client</p>
          </button>
          <button className="p-4 bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 rounded-lg transition-colors text-left">
            <BarChart3 className="w-6 h-6 text-[#4ADE80] mb-2" />
            <p className="font-medium text-[#101010]">System Report</p>
            <p className="text-xs text-gray-600">Generate platform analytics</p>
          </button>
          <button className="p-4 bg-[#F87171]/10 hover:bg-[#F87171]/20 rounded-lg transition-colors text-left">
            <AlertCircle className="w-6 h-6 text-[#F87171] mb-2" />
            <p className="font-medium text-[#101010]">Review Alerts</p>
            <p className="text-xs text-gray-600">Check system notifications</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;