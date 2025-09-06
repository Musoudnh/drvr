import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, AlertTriangle, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Target, Calendar, Settings, Bell, Eye, RefreshCw, Zap, Brain, Plus, X, Edit3, Maximize2, Minimize2, Grip, Move, Layout, Save, Lightbulb, CheckCircle, Clock, Filter, Download } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface Widget {
  id: string;
  type: 'metric' | 'chart' | 'insight' | 'goal';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  data: any;
  isVisible: boolean;
  size: 'small' | 'medium' | 'large';
}

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  category: 'revenue' | 'profit' | 'growth' | 'efficiency';
  progress: number;
  status: 'on_track' | 'at_risk' | 'behind';
}

interface PredictiveAlert {
  id: string;
  type: 'warning' | 'opportunity' | 'critical';
  title: string;
  description: string;
  prediction: string;
  confidence: number;
  daysAhead: number;
  actions: string[];
  createdAt: Date;
  severity: 'high' | 'medium' | 'low';
  category: 'cash_flow' | 'revenue' | 'expenses' | 'compliance';
}

interface SmartInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'optimization' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  actions: string[];
  dataPoints: string[];
  createdAt: Date;
}

interface CustomWidget {
  id: string;
  type: 'kpi' | 'chart' | 'metric' | 'goal' | 'alert';
  title: string;
  dataSource: string;
  refreshRate: 'realtime' | 'hourly' | 'daily';
  position: { x: number; y: number; w: number; h: number };
  config: any;
  isVisible: boolean;
}

interface DepartmentMetric {
  department: string;
  revenue: number;
  target: number;
  efficiency: number;
  impact: number;
  trend: 'up' | 'down' | 'stable';
  kpis: {
    name: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

const CompanyDashboard: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'revenue-metric',
      type: 'metric',
      title: 'Monthly Revenue',
      position: { x: 0, y: 0, w: 1, h: 1 },
      data: { value: '$847,245', change: '+12.5%', trend: 'up', target: '$850,000' },
      isVisible: true,
      size: 'medium'
    },
    {
      id: 'profit-metric',
      type: 'metric',
      title: 'Net Profit',
      position: { x: 1, y: 0, w: 1, h: 1 },
      data: { value: '$224,300', change: '+18.7%', trend: 'up', target: '$220,000' },
      isVisible: true,
      size: 'medium'
    },
    {
      id: 'cash-metric',
      type: 'metric',
      title: 'Cash Balance',
      position: { x: 2, y: 0, w: 1, h: 1 },
      data: { value: '$485K', change: '8.2 months runway', trend: 'neutral', target: '$500K' },
      isVisible: true,
      size: 'medium'
    },
    {
      id: 'margin-metric',
      type: 'metric',
      title: 'Profit Margin',
      position: { x: 3, y: 0, w: 1, h: 1 },
      data: { value: '26.4%', change: '+3.2%', trend: 'up', target: '25%' },
      isVisible: true,
      size: 'medium'
    }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: '1', 
      name: 'Monthly Revenue', 
      target: 850000, 
      current: 847245, 
      period: 'monthly', 
      category: 'revenue',
      progress: 99.7,
      status: 'on_track'
    },
    { 
      id: '2', 
      name: 'Profit Margin', 
      target: 25, 
      current: 26.4, 
      period: 'monthly', 
      category: 'profit',
      progress: 105.6,
      status: 'on_track'
    },
    { 
      id: '3', 
      name: 'Customer Growth', 
      target: 15, 
      current: 12.5, 
      period: 'monthly', 
      category: 'growth',
      progress: 83.3,
      status: 'at_risk'
    },
    { 
      id: '4', 
      name: 'Cash Runway', 
      target: 12, 
      current: 8.2, 
      period: 'monthly', 
      category: 'efficiency',
      progress: 68.3,
      status: 'behind'
    }
  ]);

  const [predictiveAlerts, setPredictiveAlerts] = useState<PredictiveAlert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Cash Flow Shortage Predicted',
      description: 'Based on current spending patterns and revenue trends',
      prediction: 'Cash flow may turn negative in 45 days',
      confidence: 87,
      daysAhead: 45,
      actions: ['Review expense categories', 'Accelerate collections', 'Consider credit line'],
      createdAt: new Date(Date.now() - 3600000),
      severity: 'high',
      category: 'cash_flow'
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Revenue Growth Opportunity',
      description: 'Market conditions and performance trends suggest potential',
      prediction: 'Revenue could increase by 23% with optimized pricing',
      confidence: 78,
      daysAhead: 30,
      actions: ['Analyze pricing strategy', 'Review competitor pricing', 'Test price increases'],
      createdAt: new Date(Date.now() - 7200000),
      severity: 'medium',
      category: 'revenue'
    },
    {
      id: '3',
      type: 'critical',
      title: 'Expense Trend Alert',
      description: 'Operating expenses growing faster than revenue',
      prediction: 'OpEx will exceed 75% of revenue in 60 days',
      confidence: 92,
      daysAhead: 60,
      actions: ['Implement cost controls', 'Review vendor contracts', 'Optimize operations'],
      createdAt: new Date(Date.now() - 1800000),
      severity: 'high',
      category: 'expenses'
    }
  ]);

  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [showWidgetConfig, setShowWidgetConfig] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [smartInsights, setSmartInsights] = useState<SmartInsight[]>([
    {
      id: '1',
      type: 'opportunity',
      title: 'Revenue Optimization Opportunity',
      description: 'AI analysis suggests 8-12% revenue increase possible through pricing optimization',
      impact: 'high',
      confidence: 87,
      actionable: true,
      actions: ['Review pricing strategy', 'A/B test price increases', 'Analyze competitor pricing'],
      dataPoints: ['Historical pricing data', 'Customer price sensitivity', 'Market analysis'],
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      type: 'risk',
      title: 'Cash Flow Risk Alert',
      description: 'Predictive model indicates potential cash shortage in 45-60 days',
      impact: 'high',
      confidence: 92,
      actionable: true,
      actions: ['Accelerate collections', 'Review payment terms', 'Consider credit line'],
      dataPoints: ['Payment patterns', 'Seasonal trends', 'Outstanding invoices'],
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      id: '3',
      type: 'optimization',
      title: 'Cost Reduction Opportunity',
      description: 'Software consolidation could reduce monthly costs by $15K',
      impact: 'medium',
      confidence: 78,
      actionable: true,
      actions: ['Audit software licenses', 'Negotiate with vendors', 'Implement usage tracking'],
      dataPoints: ['Software usage analytics', 'License costs', 'User activity'],
      createdAt: new Date(Date.now() - 10800000)
    }
  ]);
  const [customWidgets, setCustomWidgets] = useState<CustomWidget[]>([]);
  const [showSmartInsights, setShowSmartInsights] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    period: 'monthly' as const,
    category: 'revenue' as const
  });

  const [dailyInsight, setDailyInsight] = useState({
    summary: "January performance shows strong momentum with revenue exceeding targets by 12.5%. Cash flow remains healthy at $224K positive, and profit margins improved to 26.4% - above industry average of 22.3%.",
    highlights: [
      "Revenue growth accelerating",
      "Margins expanding consistently", 
      "Cash position strengthening",
      "Watch Q2 seasonal trends"
    ],
    keyStrength: "Revenue diversification across product lines reducing risk",
    watchArea: "Marketing spend up 23% - monitor ROI closely",
    opportunity: "Consider pricing optimization for 5-8% margin boost"
  });

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [realTimeData, setRealTimeData] = useState({
    lastUpdate: new Date(),
    isConnected: true,
    dataPoints: 24567
  });

  // Enhanced department metrics with KPIs
  const [departmentMetrics, setDepartmentMetrics] = useState<DepartmentMetric[]>([
    { 
      department: 'Sales', 
      revenue: 485000, 
      target: 500000, 
      efficiency: 97,
      impact: 57.2,
      trend: 'up',
      kpis: [
        { name: 'Conversion Rate', value: '3.2%', change: '+0.4%', trend: 'up' },
        { name: 'Deal Size', value: '$12.5K', change: '+8%', trend: 'up' },
        { name: 'Sales Cycle', value: '45 days', change: '-3 days', trend: 'up' }
      ]
    },
    { 
      department: 'Marketing', 
      revenue: 245000, 
      target: 220000, 
      efficiency: 111,
      impact: 28.9,
      trend: 'up',
      kpis: [
        { name: 'CAC', value: '$145', change: '-$12', trend: 'up' },
        { name: 'ROAS', value: '4.2x', change: '+0.3x', trend: 'up' },
        { name: 'Lead Quality', value: '78%', change: '+5%', trend: 'up' }
      ]
    },
    { 
      department: 'Operations', 
      revenue: 87500, 
      target: 90000, 
      efficiency: 97,
      impact: 10.3,
      trend: 'stable',
      kpis: [
        { name: 'Efficiency', value: '94%', change: '+2%', trend: 'up' },
        { name: 'Cost per Unit', value: '$23', change: '-$1', trend: 'up' },
        { name: 'Quality Score', value: '96%', change: '0%', trend: 'stable' }
      ]
    },
    { 
      department: 'Customer Success', 
      revenue: 30000, 
      target: 35000, 
      efficiency: 86,
      impact: 3.6,
      trend: 'down',
      kpis: [
        { name: 'Retention', value: '92%', change: '-1%', trend: 'down' },
        { name: 'NPS', value: '67', change: '+3', trend: 'up' },
        { name: 'Upsell Rate', value: '18%', change: '+2%', trend: 'up' }
      ]
    }
  ]);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        lastUpdate: new Date(),
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 10)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getGoalProgress = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getGoalColor = (status: string) => {
    switch (status) {
      case 'on_track': return '#4ADE80';
      case 'at_risk': return '#F59E0B';
      case 'behind': return '#F87171';
      default: return '#6B7280';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return '#F87171';
      case 'warning': return '#F59E0B';
      case 'opportunity': return '#4ADE80';
      default: return '#3AB7BF';
    }
  };

  const handleAddGoal = () => {
    if (newGoal.name.trim() && newGoal.target) {
      const current = Math.random() * parseFloat(newGoal.target);
      const progress = (current / parseFloat(newGoal.target)) * 100;
      const status = progress >= 90 ? 'on_track' : progress >= 70 ? 'at_risk' : 'behind';
      
      const goal: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: current,
        period: newGoal.period,
        category: newGoal.category,
        progress: progress,
        status: status as any
      };
      setGoals(prev => [...prev, goal]);
      setNewGoal({ name: '', target: '', period: 'monthly', category: 'revenue' });
      setShowGoalModal(false);
    }
  };

  const handleDismissAlert = (alertId: string) => {
    setPredictiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleDismissInsight = (insightId: string) => {
    setSmartInsights(prev => prev.filter(insight => insight.id !== insightId));
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return '#4ADE80';
      case 'risk': return '#F87171';
      case 'optimization': return '#3AB7BF';
      case 'trend': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'optimization': return Target;
      case 'trend': return BarChart3;
      default: return Lightbulb;
    }
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId ? { ...widget, isVisible: !widget.isVisible } : widget
    ));
  };

  const handleWidgetResize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId ? { ...widget, size } : widget
    ));
  };

  const addCustomWidget = (type: string, title: string) => {
    const newWidget: Widget = {
      id: `custom-${Date.now()}`,
      type: type as any,
      title,
      position: { x: 0, y: 1, w: 1, h: 1 },
      data: { value: '$0', change: '0%', trend: 'neutral' },
      isVisible: true,
      size: 'medium'
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const handleDragStart = (widgetId: string) => {
    setDraggedWidget(widgetId);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
  };

  const getWidgetSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'large': return 'col-span-2';
      default: return 'col-span-1';
    }
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Enhanced Header with Real-time Status */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Financial Dashboard</h2>
          <div className="flex items-center mt-1">
            <p className="text-gray-600">Real-time insights and performance tracking</p>
            <div className="flex items-center ml-4">
              <div className={`w-2 h-2 rounded-full mr-2 ${realTimeData.isConnected ? 'bg-[#4ADE80] animate-pulse' : 'bg-[#F87171]'}`} />
              <span className="text-xs text-gray-500">
                {realTimeData.isConnected ? 'Live' : 'Disconnected'} • Updated {realTimeData.lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowGoalModal(true)}
          >
            <Target className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCustomizeModal(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowInsightModal(true)}
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Enhanced Predictive Alerts with Categories */}
      {predictiveAlerts.length > 0 && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#1E2A38] flex items-center">
                <Zap className="w-4 h-4 mr-2 text-[#F59E0B]" />
                AI-Powered Predictive Alerts
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{predictiveAlerts.length} active</span>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Alerts
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {predictiveAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className="p-4 rounded-lg border-l-4 hover:shadow-md transition-all"
                  style={{ 
                    backgroundColor: `${getAlertColor(alert.type)}10`,
                    borderLeftColor: getAlertColor(alert.type)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="font-semibold text-[#1E2A38]">{alert.title}</h4>
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium" style={{
                          backgroundColor: `${getAlertColor(alert.type)}20`,
                          color: getAlertColor(alert.type)
                        }}>
                          {alert.confidence}% confidence
                        </span>
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          {alert.category.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                      <p className="text-sm font-medium mb-3" style={{ color: getAlertColor(alert.type) }}>
                        {alert.prediction}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {alert.actions.map((action, index) => (
                          <button
                            key={index}
                            className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-gray-500">{alert.daysAhead} days ahead</span>
                      <button
                        onClick={() => handleDismissAlert(alert.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Smart AI Insights */}
      {smartInsights.length > 0 && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#1E2A38] flex items-center">
                <Brain className="w-4 h-4 mr-2 text-[#8B5CF6]" />
                AI-Powered Smart Insights
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{smartInsights.length} insights</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowSmartInsights(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {smartInsights.slice(0, 2).map(insight => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div 
                    key={insight.id}
                    className="p-4 rounded-lg border-l-4 hover:shadow-md transition-all"
                    style={{ 
                      backgroundColor: `${getInsightColor(insight.type)}10`,
                      borderLeftColor: getInsightColor(insight.type)
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Icon className="w-4 h-4 mr-2" style={{ color: getInsightColor(insight.type) }} />
                          <h4 className="font-semibold text-[#1E2A38]">{insight.title}</h4>
                          <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium" style={{
                            backgroundColor: `${getInsightColor(insight.type)}20`,
                            color: getInsightColor(insight.type)
                          }}>
                            {insight.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                        {insight.actionable && (
                          <div className="flex flex-wrap gap-2">
                            {insight.actions.slice(0, 2).map((action, index) => (
                              <button
                                key={index}
                                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                              >
                                {action}
                              </button>
                            ))}
                            {insight.actions.length > 2 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{insight.actions.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDismissInsight(insight.id)}
                        className="p-1 hover:bg-gray-100 rounded ml-4"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Performance vs Goals with Progress Tracking */}
      <Card title="Performance vs Goals">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {goals.map(goal => {
            const progress = getGoalProgress(goal);
            const color = getGoalColor(goal.status);
            
            return (
              <div key={goal.id} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-[#1E2A38]">{goal.name}</h4>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 text-gray-400 mr-2" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={{
                      backgroundColor: `${color}20`,
                      color: color
                    }}>
                      {goal.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current: {goal.current.toLocaleString()}</span>
                  <span className="text-gray-600">Target: {goal.target.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Customizable Widgets with Drag & Drop */}
      <Card title="Key Metrics">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Drag widgets to reorder</span>
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                isCustomizing ? 'bg-[#3AB7BF] text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isCustomizing ? 'Done' : 'Customize'}
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowWidgetConfig(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Widget
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {widgets.filter(w => w.isVisible).map(widget => (
            <div
              key={widget.id}
              className={`${getWidgetSizeClass(widget.size)} ${isCustomizing ? 'cursor-move' : ''}`}
              draggable={isCustomizing}
              onDragStart={() => handleDragStart(widget.id)}
              onDragEnd={handleDragEnd}
            >
              <Card className="hover:shadow-md transition-shadow relative">
                {isCustomizing && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleWidgetResize(widget.id, widget.size === 'small' ? 'medium' : widget.size === 'medium' ? 'large' : 'small')}
                      className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      {widget.size === 'small' ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => toggleWidgetVisibility(widget.id)}
                      className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600">{widget.title}</p>
                    <p className="text-xl font-bold text-[#1E2A38] mt-1">{widget.data.value}</p>
                    <p className={`text-xs mt-2 ${widget.data.trend === 'up' ? 'text-[#4ADE80]' : widget.data.trend === 'down' ? 'text-[#F87171]' : 'text-[#F59E0B]'}`}>
                      {widget.data.change}
                    </p>
                    {widget.data.target && (
                      <p className="text-xs text-gray-500 mt-1">Target: {widget.data.target}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${widget.data.trend === 'up' ? 'bg-[#4ADE80]/10' : widget.data.trend === 'down' ? 'bg-[#F87171]/10' : 'bg-[#F59E0B]/10'}`}>
                    <DollarSign className={`w-6 h-6 ${widget.data.trend === 'up' ? 'text-[#4ADE80]' : widget.data.trend === 'down' ? 'text-[#F87171]' : 'text-[#F59E0B]'}`} />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>

      {/* Enhanced Cross-Functional Department Performance with KPIs */}
      <Card title="Department Performance Impact">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentMetrics.map((dept, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-[#1E2A38]">{dept.department}</h4>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dept.efficiency >= 100 ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 
                      dept.efficiency >= 90 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-[#F87171]/20 text-[#F87171]'
                    }`}>
                      {dept.efficiency}% efficiency
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Revenue Impact</span>
                    <span className="font-medium text-[#3AB7BF]">${(dept.revenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target</span>
                    <span className="text-gray-600">${(dept.target / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${dept.efficiency >= 100 ? 'bg-[#4ADE80]' : dept.efficiency >= 90 ? 'bg-[#F59E0B]' : 'bg-[#F87171]'}`}
                      style={{ width: `${Math.min(dept.efficiency, 100)}%` }}
                    />
                  </div>
                </div>
                
                {/* Department KPIs */}
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold text-gray-700 uppercase">Key Metrics</h5>
                  {dept.kpis.map((kpi, kpiIndex) => (
                    <div key={kpiIndex} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{kpi.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-[#1E2A38] mr-1">{kpi.value}</span>
                        <span className={`text-xs ${kpi.trend === 'up' ? 'text-[#4ADE80]' : kpi.trend === 'down' ? 'text-[#F87171]' : 'text-gray-500'}`}>
                          {kpi.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Real-time Data Streaming Indicator with Enhanced Info */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#4ADE80] rounded-full mr-3 animate-pulse" />
            <div>
              <h3 className="font-semibold text-[#1E2A38]">Live Data Stream</h3>
              <p className="text-sm text-gray-600">
                Last updated: {realTimeData.lastUpdate.toLocaleTimeString()} • 
                {realTimeData.dataPoints.toLocaleString()} data points processed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-sm text-[#4ADE80] font-medium">Connected</span>
              <p className="text-xs text-gray-500">5 integrations active</p>
            </div>
            <RefreshCw className="w-4 h-4 text-[#4ADE80]" />
          </div>
        </div>
      </Card>

      {/* Enhanced AI Financial Summary with Actionable Insights */}
      <Card title="AI Financial Summary" className="lg:col-span-2">
        <div className="space-y-4">
          <div className="flex items-start p-4 bg-gradient-to-r from-[#3AB7BF]/10 to-[#4ADE80]/10 rounded-lg border border-[#3AB7BF]/20">
            <div className="w-8 h-8 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <Brain className="text-white text-sm font-bold w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#1E2A38] mb-2">January 2025 Performance Insights</h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {dailyInsight.summary}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {dailyInsight.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-[#4ADE80] rounded-full mr-2"></div>
                    <span className="text-gray-600">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-[#4ADE80]/10 rounded-lg">
              <h5 className="font-medium text-[#1E2A38] mb-1">Key Strength</h5>
              <p className="text-sm text-gray-600">{dailyInsight.keyStrength}</p>
            </div>
            <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
              <h5 className="font-medium text-[#1E2A38] mb-1">Watch Area</h5>
              <p className="text-sm text-gray-600">{dailyInsight.watchArea}</p>
            </div>
            <div className="p-3 bg-[#3AB7BF]/10 rounded-lg">
              <h5 className="font-medium text-[#1E2A38] mb-1">Opportunity</h5>
              <p className="text-sm text-gray-600">{dailyInsight.opportunity}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">Last updated: 2 hours ago • Confidence: 89%</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowInsightModal(true)}
                className="text-xs text-[#3AB7BF] hover:underline"
              >
                Ask AI for deeper analysis →
              </button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Widget Configuration Modal */}
      {showWidgetConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Add Custom Widget</h3>
              <button
                onClick={() => setShowWidgetConfig(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { type: 'metric', title: 'Custom Metric', icon: BarChart3 },
                  { type: 'chart', title: 'Custom Chart', icon: PieChart },
                  { type: 'goal', title: 'Performance Goal', icon: Target },
                  { type: 'insight', title: 'AI Insight', icon: Brain }
                ].map((widgetType, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addCustomWidget(widgetType.type, widgetType.title);
                      setShowWidgetConfig(false);
                    }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#3AB7BF] hover:bg-[#3AB7BF]/5 transition-all text-center"
                  >
                    <widgetType.icon className="w-6 h-6 text-[#3AB7BF] mx-auto mb-2" />
                    <p className="font-medium text-[#1E2A38]">{widgetType.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customize Dashboard Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Customize Dashboard</h3>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-4">Widget Visibility</h4>
                <div className="space-y-3">
                  {widgets.map(widget => (
                    <div key={widget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Grip className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-[#1E2A38]">{widget.title}</p>
                          <p className="text-sm text-gray-600">{widget.type} widget • {widget.size} size</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={widget.size}
                          onChange={(e) => handleWidgetResize(widget.id, e.target.value as any)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={widget.isVisible}
                            onChange={() => toggleWidgetVisibility(widget.id)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-4">Dashboard Layout</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['Compact', 'Standard', 'Expanded'].map((layout, index) => (
                    <button
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg hover:border-[#3AB7BF] transition-colors text-center"
                    >
                      <Layout className="w-5 h-5 text-[#3AB7BF] mx-auto mb-2" />
                      <span className="text-sm font-medium text-[#1E2A38]">{layout}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <Button variant="primary">
                <Save className="w-4 h-4 mr-2" />
                Save Layout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Add Performance Goal</h3>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="e.g., Monthly Revenue Target"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Value</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    placeholder="850000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                  <select
                    value={newGoal.period}
                    onChange={(e) => setNewGoal({...newGoal, period: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="revenue">Revenue</option>
                  <option value="profit">Profit</option>
                  <option value="growth">Growth</option>
                  <option value="efficiency">Efficiency</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                disabled={!newGoal.name.trim() || !newGoal.target}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced AI Insights Modal */}
      {showInsightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38] flex items-center">
                <Brain className="w-5 h-5 mr-2 text-[#3AB7BF]" />
                AI Financial Analysis
              </h3>
              <button
                onClick={() => setShowInsightModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Quick Insights */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1E2A38]">Key Insights</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-[#4ADE80]/10 rounded-lg border border-[#4ADE80]/20">
                    <h5 className="font-medium text-[#1E2A38] mb-2">Revenue Optimization</h5>
                    <p className="text-sm text-gray-700">Your current pricing strategy has room for 5-8% improvement. Consider testing price increases on your premium product line.</p>
                    <div className="mt-2 flex gap-2">
                      <button className="px-3 py-1 bg-[#4ADE80] text-white rounded text-xs hover:bg-[#3BC66F]">
                        View Analysis
                      </button>
                      <button className="px-3 py-1 bg-white border border-[#4ADE80] text-[#4ADE80] rounded text-xs hover:bg-[#4ADE80]/10">
                        Schedule Review
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
                    <h5 className="font-medium text-[#1E2A38] mb-2">Cost Management</h5>
                    <p className="text-sm text-gray-700">Marketing ROI has decreased 15% this quarter. Reallocating budget to higher-performing channels could improve efficiency.</p>
                    <div className="mt-2 flex gap-2">
                      <button className="px-3 py-1 bg-[#F59E0B] text-white rounded text-xs hover:bg-[#E08E0A]">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-white border border-[#F59E0B] text-[#F59E0B] rounded text-xs hover:bg-[#F59E0B]/10">
                        Create Action Plan
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-[#3AB7BF]/10 rounded-lg border border-[#3AB7BF]/20">
                    <h5 className="font-medium text-[#1E2A38] mb-2">Cash Flow</h5>
                    <p className="text-sm text-gray-700">Extending payment terms with suppliers by 15 days could improve cash flow by $85K monthly.</p>
                    <div className="mt-2 flex gap-2">
                      <button className="px-3 py-1 bg-[#3AB7BF] text-white rounded text-xs hover:bg-[#2A9BA3]">
                        Model Impact
                      </button>
                      <button className="px-3 py-1 bg-white border border-[#3AB7BF] text-[#3AB7BF] rounded text-xs hover:bg-[#3AB7BF]/10">
                        Contact Suppliers
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Actions with Priority */}
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-4">Recommended Actions</h4>
                <div className="space-y-2">
                  {[
                    { action: 'Review pricing strategy for premium products', priority: 'high', impact: 'High Revenue Impact' },
                    { action: 'Optimize marketing channel allocation', priority: 'medium', impact: 'Medium Cost Savings' },
                    { action: 'Negotiate extended payment terms with top 5 suppliers', priority: 'high', impact: 'High Cash Flow Impact' },
                    { action: 'Implement automated invoice follow-up system', priority: 'low', impact: 'Low Efficiency Gain' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          item.priority === 'high' ? 'bg-[#F87171]' : 
                          item.priority === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#4ADE80]'
                        }`}>
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-700">{item.action}</span>
                          <p className="text-xs text-gray-500">{item.impact}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === 'high' ? 'bg-[#F87171]/20 text-[#F87171]' :
                        item.priority === 'medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-[#4ADE80]/20 text-[#4ADE80]'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowInsightModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart Insights Modal */}
      {showSmartInsights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38] flex items-center">
                <Brain className="w-5 h-5 mr-2 text-[#8B5CF6]" />
                Smart AI Insights
              </h3>
              <button
                onClick={() => setShowSmartInsights(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {smartInsights.map(insight => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div 
                    key={insight.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" style={{ color: getInsightColor(insight.type) }} />
                        <div>
                          <h4 className="font-semibold text-[#1E2A38]">{insight.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={{
                              backgroundColor: `${getInsightColor(insight.type)}20`,
                              color: getInsightColor(insight.type)
                            }}>
                              {insight.type}
                            </span>
                            <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              insight.impact === 'high' ? 'bg-[#F87171]/20 text-[#F87171]' :
                              insight.impact === 'medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                              'bg-[#4ADE80]/20 text-[#4ADE80]'
                            }`}>
                              {insight.impact} impact
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{insight.createdAt.toLocaleString()}</span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">{insight.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-[#1E2A38] mb-2">Recommended Actions:</h5>
                        <div className="space-y-1">
                          {insight.actions.map((action, index) => (
                            <div key={index} className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-[#4ADE80] mr-2" />
                              <span className="text-sm text-gray-700">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-[#1E2A38] mb-2">Based on:</h5>
                        <div className="flex flex-wrap gap-2">
                          {insight.dataPoints.map((point, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Insights
              </Button>
              <button
                onClick={() => setShowSmartInsights(false)}
                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;