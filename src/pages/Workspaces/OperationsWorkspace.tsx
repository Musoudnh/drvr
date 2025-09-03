import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Users, Zap, GitBranch, Target, Settings, Workflow, Database } from 'lucide-react';
import Card from '../../components/UI/Card';

const OperationsWorkspace: React.FC = () => {
  const operationsModules = [
    {
      title: 'Sales Commissions',
      description: 'Manage sales team compensation and commission structures',
      icon: DollarSign,
      path: '/commissions',
      color: '#4ADE80',
      features: ['Commission Plans', 'Team Management', 'Quota Tracking', 'Payout Automation']
    },
    {
      title: 'Workflow Management',
      description: 'Approval workflows and collaboration tools',
      icon: GitBranch,
      path: '/admin', // Placeholder - would need dedicated workflow page
      color: '#8B5CF6',
      features: ['Approval Chains', 'Task Management', 'Comments & Mentions', 'Process Automation']
    },
    {
      title: 'Data Integrations',
      description: 'Connect external systems and automate data flows',
      icon: Database,
      path: '/admin/integrations',
      color: '#3AB7BF',
      features: ['QuickBooks', 'Stripe', 'Slack', 'HubSpot', 'Custom APIs']
    },
    {
      title: 'Team Management',
      description: 'Manage team members and accounting firm partnerships',
      icon: Users,
      path: '/admin/team',
      color: '#F59E0B',
      features: ['User Roles', 'Permissions', 'Accounting Firms', 'Access Control']
    }
  ];

  const operationalMetrics = [
    { label: 'Active Workflows', value: '12', color: '#8B5CF6' },
    { label: 'Team Members', value: '24', color: '#4ADE80' },
    { label: 'Integrations', value: '8', color: '#3AB7BF' },
    { label: 'Commission Plans', value: '4', color: '#F59E0B' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1E2A38] mb-4">Operations Workspace</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Streamline operations with commission management, workflow automation, and seamless integrations.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {operationalMetrics.map((metric, index) => (
          <Card key={index}>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${metric.color}15` }}
              >
                <Target className="w-6 h-6" style={{ color: metric.color }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Operations Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {operationsModules.map((module, index) => (
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

      {/* Workflow Status */}
      <Card title="Active Workflows">
        <div className="space-y-4">
          {[
            { name: 'Q1 Budget Approval', status: 'In Progress', assignee: 'Sarah Johnson', dueDate: 'Jan 25', priority: 'high' },
            { name: 'Monthly Forecast Review', status: 'Pending', assignee: 'Michael Chen', dueDate: 'Jan 24', priority: 'medium' },
            { name: 'Expense Report Approval', status: 'Completed', assignee: 'Emily Rodriguez', dueDate: 'Jan 22', priority: 'low' }
          ].map((workflow, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  workflow.status === 'Completed' ? 'bg-[#4ADE80]' :
                  workflow.status === 'In Progress' ? 'bg-[#3AB7BF]' : 'bg-[#F59E0B]'
                }`} />
                <div>
                  <p className="font-medium text-[#1E2A38]">{workflow.name}</p>
                  <p className="text-sm text-gray-600">Assigned to {workflow.assignee} • Due {workflow.dueDate}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                workflow.priority === 'high' ? 'bg-[#F87171]/20 text-[#F87171]' :
                workflow.priority === 'medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                'bg-[#4ADE80]/20 text-[#4ADE80]'
              }`}>
                {workflow.priority}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OperationsWorkspace;