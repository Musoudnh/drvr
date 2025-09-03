import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, CreditCard, Users, User, Settings, Eye, Lock } from 'lucide-react';
import Card from '../../components/UI/Card';

const AdminWorkspace: React.FC = () => {
  const adminModules = [
    {
      title: 'Security & SOX',
      description: 'Security settings and SOX compliance management',
      icon: Shield,
      path: '/admin/security',
      color: '#4ADE80',
      features: ['SOX Compliance', 'Security Score', 'Access Controls', 'SSL Management']
    },
    {
      title: 'Audit Log',
      description: 'Comprehensive audit trail and compliance monitoring',
      icon: FileText,
      path: '/admin/audit',
      color: '#3AB7BF',
      features: ['Activity Tracking', 'Change History', 'Compliance Reports', 'Data Retention']
    },
    {
      title: 'Billing & Subscription',
      description: 'Manage subscription, billing, and usage analytics',
      icon: CreditCard,
      path: '/admin/billing',
      color: '#F59E0B',
      features: ['Usage Analytics', 'Payment Methods', 'Billing History', 'Auto-pay']
    },
    {
      title: 'Team Management',
      description: 'User management and accounting firm partnerships',
      icon: Users,
      path: '/admin/team',
      color: '#8B5CF6',
      features: ['User Roles', 'Permissions', 'Accounting Firms', 'Access Levels']
    },
    {
      title: 'Account Profile',
      description: 'Personal settings and notification preferences',
      icon: User,
      path: '/admin/profile',
      color: '#EC4899',
      features: ['Profile Settings', 'Notifications', '2FA Setup', 'Privacy Controls']
    },
    {
      title: 'System Settings',
      description: 'Platform configuration and appearance settings',
      icon: Settings,
      path: '/admin/settings',
      color: '#10B981',
      features: ['Navigation Colors', 'System Config', 'Display Settings', 'Preferences']
    }
  ];

  const securityMetrics = [
    { label: 'Security Score', value: '94/100', color: '#4ADE80' },
    { label: 'Active Sessions', value: '24', color: '#3AB7BF' },
    { label: 'Failed Logins', value: '3', color: '#F87171' },
    { label: 'Compliance', value: '98%', color: '#8B5CF6' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1E2A38] mb-4">Admin Workspace</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive administration with security, compliance, team management, and system configuration.
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${metric.color}15` }}
              >
                <Shield className="w-6 h-6" style={{ color: metric.color }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Admin Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module, index) => (
          <Link key={index} to={module.path}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-opacity-30 cursor-pointer" style={{ borderColor: `${module.color}20` }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${module.color}15` }}
                  >
                    <module.icon className="w-6 h-6" style={{ color: module.color }} />
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${module.color}20`,
                      color: module.color
                    }}
                  >
                    Active
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-[#1E2A38] mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-[#1E2A38] text-sm">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {module.features.map((feature, featureIndex) => (
                      <span 
                        key={featureIndex}
                        className="px-2 py-1 rounded text-xs"
                        style={{ 
                          backgroundColor: `${module.color}10`,
                          color: module.color
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Admin Activity */}
      <Card title="Recent Admin Activity">
        <div className="space-y-4">
          {[
            { 
              action: 'User Login', 
              user: 'John Doe', 
              resource: 'Authentication System', 
              time: '2 hours ago',
              status: 'success',
              ip: '192.168.1.100'
            },
            { 
              action: 'Permission Change', 
              user: 'Sarah Johnson', 
              resource: 'User Management', 
              time: '4 hours ago',
              status: 'success',
              ip: '192.168.1.105'
            },
            { 
              action: 'Data Export', 
              user: 'Michael Chen', 
              resource: 'Financial Reports', 
              time: '6 hours ago',
              status: 'success',
              ip: '192.168.1.102'
            },
            { 
              action: 'Failed Login', 
              user: 'Unknown', 
              resource: 'Authentication System', 
              time: '8 hours ago',
              status: 'failed',
              ip: '203.0.113.45'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  activity.status === 'success' ? 'bg-[#4ADE80]' : 'bg-[#F87171]'
                }`}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1E2A38]">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user} • {activity.resource} • {activity.ip}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'success' ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-[#F87171]/20 text-[#F87171]'
                }`}>
                  {activity.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Compliance Status */}
      <Card title="Compliance Status">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <Shield className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">SOX Compliance</h3>
            <p className="text-sm text-gray-600">All controls in place and regularly audited</p>
            <div className="mt-2">
              <span className="px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">Compliant</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-[#3AB7BF]/10 rounded-lg">
            <Lock className="w-8 h-8 text-[#3AB7BF] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Data Security</h3>
            <p className="text-sm text-gray-600">256-bit encryption and secure access controls</p>
            <div className="mt-2">
              <span className="px-2 py-1 bg-[#3AB7BF]/20 text-[#3AB7BF] rounded-full text-xs">Secure</span>
            </div>
          </div>
          
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <Eye className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Audit Trail</h3>
            <p className="text-sm text-gray-600">Complete activity logging and change tracking</p>
            <div className="mt-2">
              <span className="px-2 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full text-xs">Active</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminWorkspace;