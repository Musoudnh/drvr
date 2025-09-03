import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  Target, 
  BarChart3, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Zap,
  MessageSquare,
  Eye,
  RefreshCw,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import AIChatButton from '../../components/AI/AIChatButton';
import ChatButton from '../../components/Chat/ChatButton';
import AIChat from '../../components/AI/AIChat';
import ChatInterface from '../../components/Chat/ChatInterface';

const CompanyDashboard: React.FC = () => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showTeamChat, setShowTeamChat] = useState(false);

  // Holistic snapshot data
  const dashboardMetrics = {
    cashRunway: 18.5,
    mrrGrowth: 15.4,
    opexTrend: 8.7,
    hiringPipeline: 12,
    activeAlerts: 3,
    revenue: 847245,
    profit: 224300,
    cashFlow: 185600,
    burnRate: 285000
  };

  const quickActions = [
    {
      title: 'View Financial Reports',
      description: 'P&L, Balance Sheet, Cash Flow',
      icon: BarChart3,
      path: '/reports/financial',
      color: '#4ADE80'
    },
    {
      title: 'Update Forecasts',
      description: 'AI-powered predictions',
      icon: Target,
      path: '/forecasting',
      color: '#8B5CF6'
    },
    {
      title: 'Review Runway',
      description: 'Revenue, OpEx, Hiring plans',
      icon: TrendingUp,
      path: '/runway',
      color: '#3AB7BF'
    },
    {
      title: 'Check Alerts',
      description: 'Smart alerts & monitoring',
      icon: AlertTriangle,
      path: '/alerts',
      color: '#F87171'
    }
  ];

  const recentActivity = [
    {
      type: 'forecast',
      title: 'Q2 Revenue Forecast Updated',
      description: 'AI model predicts $2.85M with 87% confidence',
      time: '2 hours ago',
      user: 'AI System',
      color: '#8B5CF6'
    },
    {
      type: 'alert',
      title: 'Cash Flow Alert Triggered',
      description: 'Potential shortage detected in 45 days',
      time: '4 hours ago',
      user: 'Predictive Model',
      color: '#F87171'
    },
    {
      type: 'approval',
      title: 'Q1 Budget Approved',
      description: 'Sarah Johnson approved marketing budget increase',
      time: '6 hours ago',
      user: 'Sarah Johnson',
      color: '#4ADE80'
    },
    {
      type: 'insight',
      title: 'Cost Optimization Identified',
      description: 'AI found $45K monthly savings opportunity',
      time: '1 day ago',
      user: 'AI Optimizer',
      color: '#3AB7BF'
    }
  ];

  const upcomingTasks = [
    {
      task: 'Review Q2 Payroll Driver',
      assignee: 'Michael Chen',
      dueDate: 'Jan 25',
      priority: 'high',
      linkedTo: 'Hiring Runway'
    },
    {
      task: 'Approve Marketing Budget Variance',
      assignee: 'Sarah Johnson',
      dueDate: 'Jan 26',
      priority: 'medium',
      linkedTo: 'OpEx Planning'
    },
    {
      task: 'Update Revenue Assumptions',
      assignee: 'Emily Rodriguez',
      dueDate: 'Jan 28',
      priority: 'medium',
      linkedTo: 'Revenue Runway'
    },
    {
      task: 'Monthly Close Review',
      assignee: 'David Kim',
      dueDate: 'Jan 30',
      priority: 'low',
      linkedTo: 'Financial Reports'
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header with AI Insights */}
      <div className="bg-gradient-to-r from-[#1E2A38] to-[#3AB7BF] rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Financial Command Center</h1>
            <p className="text-blue-100 text-lg">AI-powered insights for strategic decision making</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold">${(dashboardMetrics.revenue / 1000).toFixed(0)}K</p>
              <p className="text-blue-200 text-sm">Monthly Revenue</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics - Holistic Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Runway</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">{dashboardMetrics.cashRunway}</p>
              <p className="text-sm text-gray-600 mt-1">Months remaining</p>
            </div>
            <Target className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">MRR Growth</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">{dashboardMetrics.mrrGrowth}%</p>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="w-4 h-4 text-[#4ADE80] mr-1" />
                <span className="text-sm text-[#4ADE80]">vs last month</span>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">OpEx Trend</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">{dashboardMetrics.opexTrend}%</p>
              <div className="flex items-center mt-1">
                <ArrowUpRight className="w-4 h-4 text-[#F59E0B] mr-1" />
                <span className="text-sm text-[#F59E0B]">Monthly increase</span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hiring Pipeline</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">{dashboardMetrics.hiringPipeline}</p>
              <p className="text-sm text-gray-600 mt-1">Planned hires</p>
            </div>
            <Users className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">{dashboardMetrics.activeAlerts}</p>
              <p className="text-sm text-gray-600 mt-1">Need attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>
      </div>

      {/* AI Insights & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="AI-Powered Insights">
          <div className="space-y-4">
            <div className="p-4 bg-[#4ADE80]/10 rounded-lg border border-[#4ADE80]/20">
              <div className="flex items-center mb-2">
                <Brain className="w-4 h-4 text-[#4ADE80] mr-2" />
                <h4 className="font-semibold text-[#1E2A38]">Revenue Opportunity</h4>
                <span className="ml-auto text-xs text-[#4ADE80] font-medium">87% confidence</span>
              </div>
              <p className="text-sm text-gray-700">AI analysis suggests Q2 revenue could increase by 18% with optimized pricing strategy.</p>
            </div>
            
            <div className="p-4 bg-[#F87171]/10 rounded-lg border border-[#F87171]/20">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-4 h-4 text-[#F87171] mr-2" />
                <h4 className="font-semibold text-[#1E2A38]">Cash Flow Risk</h4>
                <span className="ml-auto text-xs text-[#F87171] font-medium">92% confidence</span>
              </div>
              <p className="text-sm text-gray-700">Predictive model indicates potential cash shortage in 45 days. Consider accelerating collections.</p>
            </div>
            
            <div className="p-4 bg-[#3AB7BF]/10 rounded-lg border border-[#3AB7BF]/20">
              <div className="flex items-center mb-2">
                <Target className="w-4 h-4 text-[#3AB7BF] mr-2" />
                <h4 className="font-semibold text-[#1E2A38]">Cost Optimization</h4>
                <span className="ml-auto text-xs text-[#3AB7BF] font-medium">78% confidence</span>
              </div>
              <p className="text-sm text-gray-700">Identified $45K monthly savings through vendor consolidation and process automation.</p>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <div className="p-4 rounded-lg border-2 border-gray-200 hover:shadow-md transition-all cursor-pointer hover:border-opacity-50" style={{ borderColor: `${action.color}30` }}>
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${action.color}15` }}
                  >
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <h3 className="font-semibold text-[#1E2A38] mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity">
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ backgroundColor: activity.color }}
                >
                  {activity.type === 'forecast' && <Brain className="w-4 h-4 text-white" />}
                  {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-white" />}
                  {activity.type === 'approval' && <Users className="w-4 h-4 text-white" />}
                  {activity.type === 'insight' && <Zap className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#1E2A38] text-sm">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time} • {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Upcoming Tasks">
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    task.priority === 'high' ? 'bg-[#F87171]' :
                    task.priority === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#4ADE80]'
                  }`} />
                  <div>
                    <p className="font-medium text-[#1E2A38] text-sm">{task.task}</p>
                    <p className="text-xs text-gray-600">{task.assignee} • Due {task.dueDate}</p>
                    <p className="text-xs text-[#3AB7BF]">Linked to: {task.linkedTo}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Financial Performance Chart */}
      <Card title="Financial Performance Trend">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-[#4ADE80]">${(dashboardMetrics.revenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-600">Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#3AB7BF]">${(dashboardMetrics.profit / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-600">Profit</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#F59E0B]">${(dashboardMetrics.cashFlow / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-600">Cash Flow</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
          
          <div className="relative h-48 bg-gray-50 rounded-lg p-4">
            <svg className="w-full h-full">
              {/* Revenue line */}
              <polyline
                fill="none"
                stroke="#4ADE80"
                strokeWidth="3"
                points="30,120 90,110 150,105 210,100 270,95 330,90 390,85 450,80"
              />
              {/* Profit line */}
              <polyline
                fill="none"
                stroke="#3AB7BF"
                strokeWidth="3"
                points="30,140 90,135 150,130 210,125 270,120 330,115 390,110 450,105"
              />
              {/* Cash flow line */}
              <polyline
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
                points="30,150 90,145 150,140 210,135 270,130 330,125 390,120 450,115"
              />
            </svg>
            
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, index) => (
                <span key={index}>{month}</span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#4ADE80] rounded mr-2"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#3AB7BF] rounded mr-2"></div>
              <span className="text-gray-600">Profit</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#F59E0B] rounded mr-2"></div>
              <span className="text-gray-600">Cash Flow</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Workspace Navigation */}
      <Card title="Workspaces">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/workspace/finance">
            <div className="p-4 bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 rounded-lg transition-all cursor-pointer">
              <BarChart3 className="w-6 h-6 text-[#4ADE80] mb-2" />
              <p className="font-medium text-[#1E2A38]">Finance</p>
              <p className="text-sm text-gray-600">Reports, Forecasting, Scenarios</p>
            </div>
          </Link>
          
          <Link to="/workspace/operations">
            <div className="p-4 bg-[#3AB7BF]/10 hover:bg-[#3AB7BF]/20 rounded-lg transition-all cursor-pointer">
              <Users className="w-6 h-6 text-[#3AB7BF] mb-2" />
              <p className="font-medium text-[#1E2A38]">Operations</p>
              <p className="text-sm text-gray-600">Commissions, Workflows</p>
            </div>
          </Link>
          
          <Link to="/workspace/admin">
            <div className="p-4 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 rounded-lg transition-all cursor-pointer">
              <Users className="w-6 h-6 text-[#8B5CF6] mb-2" />
              <p className="font-medium text-[#1E2A38]">Admin</p>
              <p className="text-sm text-gray-600">Security, Audit, Team</p>
            </div>
          </Link>
          
          <Link to="/workspace/ai">
            <div className="p-4 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 rounded-lg transition-all cursor-pointer">
              <Brain className="w-6 h-6 text-[#F59E0B] mb-2" />
              <p className="font-medium text-[#1E2A38]">AI Copilot</p>
              <p className="text-sm text-gray-600">Chat, Insights, Predictions</p>
            </div>
          </Link>
        </div>
      </Card>

      {/* Floating Action Buttons */}
      <AIChatButton onClick={() => setShowAIChat(true)} />
      <ChatButton onClick={() => setShowTeamChat(true)} unreadCount={6} />

      {/* AI Chat Interface */}
      <AIChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
      
      {/* Team Chat Interface */}
      <ChatInterface isOpen={showTeamChat} onClose={() => setShowTeamChat(false)} />
    </div>
  );
};

export default CompanyDashboard;