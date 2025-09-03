import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BarChart3, Settings, Brain, Briefcase } from 'lucide-react';

const WorkspaceLayout: React.FC = () => {
  const location = useLocation();
  
  const workspaces = [
    { 
      path: '/workspace/finance', 
      label: 'Finance', 
      icon: BarChart3,
      description: 'Reports, Forecasting, Scenarios, Runway, Benchmarks'
    },
    { 
      path: '/workspace/operations', 
      label: 'Operations', 
      icon: Briefcase,
      description: 'Commissions, Workflows, Integrations'
    },
    { 
      path: '/workspace/admin', 
      label: 'Admin', 
      icon: Settings,
      description: 'Security, Audit, Billing, Team, Profile'
    },
    { 
      path: '/workspace/ai', 
      label: 'AI Copilot', 
      icon: Brain,
      description: 'Chat, AI Summaries, Predictive Insights'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="space-y-6">
      {/* Workspace Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Workspace Navigation">
            {workspaces.map((workspace) => (
              <Link
                key={workspace.path}
                to={workspace.path}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive(workspace.path)
                    ? 'border-[#4F46E5] text-[#4F46E5]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <workspace.icon className="w-4 h-4 mr-2" />
                <div>
                  <div>{workspace.label}</div>
                  <div className="text-xs text-gray-400 font-normal">{workspace.description}</div>
                </div>
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

export default WorkspaceLayout;