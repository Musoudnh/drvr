import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Eye, BarChart3, ArrowUp, ArrowDown, Brain, Target, Users, Calendar, Settings, RefreshCw, Zap, AlertTriangle, CheckCircle, X, Plus, Lightbulb, Filter, Download, Share2 } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface CorrelationAnalysis {
  metric1: string;
  metric2: string;
  correlation: number;
  strength: 'strong' | 'moderate' | 'weak';
  insight: string;
}

interface CohortData {
  cohort: string;
  period: string;
  revenue: number;
  retention: number;
  growth: number;
}

interface RootCauseAnalysis {
  metric: string;
  deviation: number;
  potentialCauses: string[];
  confidence: number;
  recommendation: string;
}

interface PrescriptiveAction {
  metric: string;
  currentValue: string;
  targetValue: string;
  actions: string[];
  expectedImpact: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
}

interface CustomerSegment {
  segment: string;
  revenue: number;
  growth: number;
  retention: number;
  ltv: number;
  cac: number;
  trend: 'up' | 'down' | 'stable';
}

interface PrescriptiveAction {
  metric: string;
  currentValue: string;
  targetValue: string;
  actions: string[];
  expectedImpact: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  timeframe: string;
}

interface CustomerSegment {
  segment: string;
  revenue: number;
  growth: number;
  retention: number;
  ltv: number;
  cac: number;
  trend: 'up' | 'down' | 'stable';
}

const Analytics: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('12-months');
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'profit']);
  const [showCorrelationModal, setShowCorrelationModal] = useState(false);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [showRootCauseModal, setShowRootCauseModal] = useState(false);
  const [selectedRootCause, setSelectedRootCause] = useState<RootCauseAnalysis | null>(null);
  const [showPrescriptiveModal, setShowPrescriptiveModal] = useState(false);
  const [showCustomerSegments, setShowCustomerSegments] = useState(false);

  const [prescriptiveActions, setPrescriptiveActions] = useState<PrescriptiveAction[]>([
    {
      metric: 'Revenue Growth',
      currentValue: '15.4%',
      targetValue: '20%',
      actions: [
        'Increase marketing spend in high-ROI channels by 25%',
        'Implement upselling program for existing customers',
        'Launch referral incentive program',
        'Optimize pricing for premium products'
      ],
      expectedImpact: '+$125K monthly revenue',
      confidence: 78,
      priority: 'high',
      timeframe: '3-6 months'
    },
    {
      metric: 'Customer Acquisition Cost',
      currentValue: '$145',
      targetValue: '$120',
      actions: [
        'Optimize ad targeting to reduce cost per click',
        'Improve landing page conversion rates',
        'Focus on organic acquisition channels',
        'Implement customer referral program'
      ],
      expectedImpact: 'Save $25K monthly on acquisition',
      confidence: 85,
      priority: 'high',
      timeframe: '2-4 months'
    },
    {
      metric: 'Customer Lifetime Value',
      currentValue: '$2,450',
      targetValue: '$3,000',
      actions: [
        'Implement customer success program',
        'Develop upselling strategies',
        'Improve product stickiness',
        'Reduce churn through better onboarding'
      ],
      expectedImpact: '+$550 per customer LTV',
      confidence: 72,
      priority: 'medium',
      timeframe: '6-12 months'
    }
  ]);

  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([
    { segment: 'Enterprise', revenue: 485000, growth: 28.5, retention: 95, ltv: 4500, cac: 180, trend: 'up' },
    { segment: 'Mid-Market', revenue: 245000, growth: 15.2, retention: 87, ltv: 2800, cac: 145, trend: 'up' },
    { segment: 'Small Business', revenue: 125000, growth: 8.7, retention: 78, ltv: 1200, cac: 95, trend: 'stable' },
    { segment: 'Startup', revenue: 65000, growth: 35.8, retention: 65, ltv: 850, cac: 125, trend: 'up' }
  ]);

  const [correlations] = useState<CorrelationAnalysis[]>([
    {
      metric1: 'Marketing Spend',
      metric2: 'Customer Acquisition',
      correlation: 0.87,
      strength: 'strong',
      insight: 'Strong positive correlation suggests marketing efficiency is high'
    },
    {
      metric1: 'Customer Satisfaction',
      metric2: 'Revenue Growth',
      correlation: 0.73,
      strength: 'strong',
      insight: 'Customer satisfaction directly impacts revenue performance'
    },
    {
      metric1: 'Employee Count',
      metric2: 'Operating Expenses',
      correlation: 0.92,
      strength: 'strong',
      insight: 'Headcount is the primary driver of operational costs'
    },
    {
      metric1: 'Product Price',
      metric2: 'Sales Volume',
      correlation: -0.45,
      strength: 'moderate',
      insight: 'Price sensitivity exists but demand remains relatively stable'
    }
  ]);

  const [cohortData] = useState<CohortData[]>([
    { cohort: 'Q1 2024 Customers', period: 'Month 1', revenue: 125000, retention: 100, growth: 0 },
    { cohort: 'Q1 2024 Customers', period: 'Month 6', revenue: 145000, retention: 87, growth: 16 },
    { cohort: 'Q1 2024 Customers', period: 'Month 12', revenue: 165000, retention: 78, growth: 32 },
    { cohort: 'Q2 2024 Customers', period: 'Month 1', revenue: 135000, retention: 100, growth: 0 },
    { cohort: 'Q2 2024 Customers', period: 'Month 6', revenue: 158000, retention: 89, growth: 17 },
    { cohort: 'Q3 2024 Customers', period: 'Month 1', revenue: 142000, retention: 100, growth: 0 },
    { cohort: 'Q3 2024 Customers', period: 'Month 3', revenue: 155000, retention: 92, growth: 9 }
  ]);

  const [rootCauseAnalyses] = useState<RootCauseAnalysis[]>([
    {
      metric: 'Customer Acquisition Cost',
      deviation: 23.5,
      potentialCauses: [
        'Increased competition in digital advertising',
        'Shift in customer acquisition channels',
        'Higher quality leads requiring more nurturing',
        'Seasonal market conditions'
      ],
      confidence: 87,
      recommendation: 'Focus on organic acquisition channels and improve conversion funnel efficiency'
    },
    {
      metric: 'Gross Margin',
      deviation: -4.2,
      potentialCauses: [
        'Rising material costs',
        'Supply chain disruptions',
        'Product mix shift toward lower-margin items',
        'Increased labor costs'
      ],
      confidence: 92,
      recommendation: 'Implement cost optimization program and review pricing strategy'
    }
  ]);

  const availableMetrics = [
    { id: 'revenue', name: 'Revenue', color: '#4ADE80' },
    { id: 'profit', name: 'Profit', color: '#3AB7BF' },
    { id: 'expenses', name: 'Expenses', color: '#F87171' },
    { id: 'margin', name: 'Margin', color: '#F59E0B' },
    { id: 'customers', name: 'Customers', color: '#8B5CF6' },
    { id: 'cac', name: 'Customer Acquisition Cost', color: '#EC4899' }
  ];

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return '#4ADE80';
    if (abs >= 0.4) return '#F59E0B';
    return '#F87171';
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return 'Strong';
    if (abs >= 0.4) return 'Moderate';
    return 'Weak';
  };

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#F87171]/20 text-[#F87171]';
      case 'medium': return 'bg-[#F59E0B]/20 text-[#F59E0B]';
      case 'low': return 'bg-[#4ADE80]/20 text-[#4ADE80]';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Advanced Analytics</h2>
          <p className="text-gray-600 mt-1">Deep insights with correlation analysis and predictive recommendations</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCorrelationModal(true)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Correlations
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCohortModal(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Cohort Analysis
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowPrescriptiveModal(true)}
          >
            <Brain className="w-4 h-4 mr-2" />
            Prescriptive Analytics
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCustomerSegments(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Customer Segments
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowPrescriptiveModal(true)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Prescriptive Analytics
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCustomerSegments(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Customer Segments
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowRootCauseModal(true)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Root Cause Analysis
          </Button>
        </div>
      </div>

      {/* Customizable Chart Controls */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1E2A38]">Chart Customization</h3>
            <div className="flex gap-2">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              >
                <option value="3-months">3 Months</option>
                <option value="6-months">6 Months</option>
                <option value="12-months">12 Months</option>
                <option value="24-months">24 Months</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {availableMetrics.map(metric => (
              <button
                key={metric.id}
                onClick={() => handleMetricToggle(metric.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetrics.includes(metric.id)
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedMetrics.includes(metric.id) ? metric.color : undefined
                }}
              >
                {metric.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Analytics Section */}
      <Card title="Key Performance Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        </div>
      </Card>

      {/* Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Actual vs Budget (YTD)">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1E2A38]">Revenue</p>
                <p className="text-sm text-gray-600">Actual: $3,670K</p>
                <p className="text-sm text-gray-600">Budget: $3,400K</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +7.9%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1E2A38]">Gross Profit</p>
                <p className="text-sm text-gray-600">Actual: $2,080K</p>
                <p className="text-sm text-gray-600">Budget: $1,950K</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +6.7%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1E2A38]">Operating Expenses</p>
                <p className="text-sm text-gray-600">Actual: $1,246K</p>
                <p className="text-sm text-gray-600">Budget: $1,300K</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                  <ArrowDown className="w-4 h-4 mr-1" />
                  -4.2%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1E2A38]">Net Income</p>
                <p className="text-sm text-gray-600">Actual: $834K</p>
                <p className="text-sm text-gray-600">Budget: $650K</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +28.3%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Actual vs Prior Year (YTD)">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1E2A38]">Revenue</p>
                <p className="text-sm text-gray-600">2025: $3,670K</p>
                <p className="text-sm text-gray-600">2024: $3,180K</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +15.4%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1E2A38]">Gross Profit</p>
                <p className="text-sm text-gray-600">2025: $2,080K</p>
                <p className="text-sm text-gray-600">2024: $1,850K</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +12.4%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1E2A38]">Operating Expenses</p>
                <p className="text-sm text-gray-600">2025: $1,246K</p>
                <p className="text-sm text-gray-600">2024: $1,200K</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#F87171] flex items-center justify-end">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +3.8%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#1E2A38]">Net Income</p>
                <p className="text-sm text-gray-600">2025: $834K</p>
                <p className="text-sm text-gray-600">2024: $650K</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[#4ADE80] flex items-center justify-end">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +28.3%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Analytics with AI Insights */}
      <Card title="AI-Powered Performance Analysis">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Intelligent Performance Insights</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Customize Analysis
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Insights
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prescriptiveActions.slice(0, 3).map((action, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-[#1E2A38]">{action.metric}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                    {action.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {action.currentValue} → {action.targetValue}
                </p>
                <p className="text-sm font-medium text-[#4ADE80]">{action.expectedImpact}</p>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 12-Month Revenue Trend Chart */}
      <Card title="12-Month Revenue Trend with Predictive Overlay">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Monthly Revenue Performance with AI Predictions</span>
            <div className="flex gap-2">
              <span className="text-sm text-[#4ADE80] font-medium">+15.4% YoY Growth</span>
              <Button variant="outline" size="sm">
                <Brain className="w-4 h-4 mr-2" />
                AI Forecast
              </Button>
            </div>
          </div>
          <div className="relative h-64">
            {/* Enhanced Chart with Predictions */}
            <div className="h-48 relative">
              {/* Historical data */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  points="30,120 90,110 150,105 210,100 270,95 330,90 390,85 450,80"
                />
              </svg>
              
              {/* Predicted data with confidence band */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
                <polygon
                  fill="#8B5CF6"
                  fillOpacity="0.1"
                  points="450,70 510,65 570,60 630,55 690,50 690,90 630,85 570,80 510,75 450,80"
                />
                <polyline
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  points="450,80 510,75 570,70 630,65 690,60"
                />
              </svg>
            </div>
            
            {/* Month Labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                <span key={index} className="flex-1 text-center">{month}</span>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#3B82F6] rounded mr-2"></div>
              <span className="text-sm text-gray-600">Historical</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-0.5 bg-[#8B5CF6] mr-2" style={{ borderTop: '3px dashed #8B5CF6' }}></div>
              <span className="text-sm text-gray-600">AI Prediction</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#8B5CF6] opacity-20 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Confidence Band</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-[#3B82F6]">$847K</p>
              <p className="text-xs text-gray-500">Current Month</p>
              <p className="text-xs text-[#4ADE80]">+12.5% vs Prior Month</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#8B5CF6]">$1.2M</p>
              <p className="text-xs text-gray-500">AI Predicted (Next 3M)</p>
              <p className="text-xs text-[#8B5CF6]">87% confidence</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#4ADE80]">$4.8M</p>
              <p className="text-xs text-gray-500">Annual Projection</p>
              <p className="text-xs text-[#4ADE80]">+22% growth potential</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Prescriptive Analytics Modal */}
      {showPrescriptiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Prescriptive Analytics</h3>
              <button
                onClick={() => setShowPrescriptiveModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {prescriptiveActions.map((action, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[#1E2A38]">{action.metric} Optimization</h4>
                      <p className="text-sm text-gray-600">
                        Current: {action.currentValue} → Target: {action.targetValue}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>
                        {action.priority} priority
                      </span>
                      <span className="text-xs text-gray-500">{action.timeframe}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <h5 className="font-medium text-[#1E2A38]">Recommended Actions:</h5>
                    {action.actions.map((actionItem, actionIndex) => (
                      <div key={actionIndex} className="flex items-start">
                        <div className="w-5 h-5 bg-[#3AB7BF] rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-white text-xs font-bold">{actionIndex + 1}</span>
                        </div>
                        <span className="text-sm text-gray-700">{actionItem}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-[#4ADE80]/10 rounded-lg flex-1 mr-3">
                      <p className="text-sm font-medium text-[#4ADE80]">Expected Impact: {action.expectedImpact}</p>
                    </div>
                    <span className="text-sm text-gray-600">{action.confidence}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Actions
              </Button>
              <button
                onClick={() => setShowPrescriptiveModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Segments Modal */}
      {showCustomerSegments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[900px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Customer Segment Analysis</h3>
              <button
                onClick={() => setShowCustomerSegments(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Segment</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Growth</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Retention</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">LTV</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">CAC</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerSegments.map((segment, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-[#1E2A38]">{segment.segment}</td>
                        <td className="py-3 px-4 text-right font-medium text-[#3AB7BF]">
                          ${segment.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          <span className={segment.growth > 20 ? 'text-[#4ADE80]' : segment.growth > 10 ? 'text-[#F59E0B]' : 'text-[#F87171]'}>
                            {segment.growth}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          <span className={segment.retention >= 90 ? 'text-[#4ADE80]' : segment.retention >= 80 ? 'text-[#F59E0B]' : 'text-[#F87171]'}>
                            {segment.retention}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-[#8B5CF6]">
                          ${segment.ltv.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-[#F87171]">
                          ${segment.cac}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className={`w-2 h-2 rounded-full mx-auto ${
                            segment.trend === 'up' ? 'bg-[#4ADE80]' :
                            segment.trend === 'down' ? 'bg-[#F87171]' : 'bg-[#F59E0B]'
                          }`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-[#4ADE80]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#4ADE80]">$920K</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
                <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#3AB7BF]">19.8%</p>
                  <p className="text-sm text-gray-600">Avg Growth</p>
                </div>
                <div className="p-4 bg-[#F59E0B]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#F59E0B]">81%</p>
                  <p className="text-sm text-gray-600">Avg Retention</p>
                </div>
                <div className="p-4 bg-[#8B5CF6]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#8B5CF6]">3.2:1</p>
                  <p className="text-sm text-gray-600">LTV:CAC Ratio</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Analysis
              </Button>
              <button
                onClick={() => setShowCustomerSegments(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Correlation Analysis Modal */}
      {showCorrelationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Correlation Analysis</h3>
              <button
                onClick={() => setShowCorrelationModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {correlations.map((correlation, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[#1E2A38]">
                        {correlation.metric1} ↔ {correlation.metric2}
                      </h4>
                      <p className="text-sm text-gray-600">{correlation.insight}</p>
                    </div>
                    <div className="text-right">
                      <span 
                        className="text-lg font-bold"
                        style={{ color: getCorrelationColor(correlation.correlation) }}
                      >
                        {correlation.correlation.toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-500">{getCorrelationStrength(correlation.correlation)}</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${Math.abs(correlation.correlation) * 100}%`,
                        backgroundColor: getCorrelationColor(correlation.correlation)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCorrelationModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cohort Analysis Modal */}
      {showCohortModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Customer Cohort Analysis</h3>
              <button
                onClick={() => setShowCohortModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Cohort</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Retention</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map((cohort, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-[#1E2A38]">{cohort.cohort}</td>
                        <td className="py-3 px-4 text-gray-600">{cohort.period}</td>
                        <td className="py-3 px-4 text-right font-medium text-[#3AB7BF]">
                          ${cohort.revenue.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          <span className={cohort.retention >= 85 ? 'text-[#4ADE80]' : cohort.retention >= 70 ? 'text-[#F59E0B]' : 'text-[#F87171]'}>
                            {cohort.retention}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          <span className={cohort.growth > 0 ? 'text-[#4ADE80]' : 'text-gray-600'}>
                            {cohort.growth > 0 ? '+' : ''}{cohort.growth}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-[#4ADE80]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#4ADE80]">83%</p>
                  <p className="text-sm text-gray-600">Avg Retention</p>
                </div>
                <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#3AB7BF]">18%</p>
                  <p className="text-sm text-gray-600">Avg Growth</p>
                </div>
                <div className="p-4 bg-[#F59E0B]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#F59E0B]">$1.4M</p>
                  <p className="text-sm text-gray-600">Cohort LTV</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCohortModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Root Cause Analysis Modal */}
      {showRootCauseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Root Cause Analysis</h3>
              <button
                onClick={() => setShowRootCauseModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {rootCauseAnalyses.map((analysis, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-[#F59E0B] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[#1E2A38]">{analysis.metric}</h4>
                      <p className="text-sm text-gray-600">
                        Deviation: {analysis.deviation > 0 ? '+' : ''}{analysis.deviation}%
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-[#F59E0B]/20 text-[#F59E0B] rounded-full text-xs font-medium">
                      {analysis.confidence}% confidence
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="font-medium text-[#1E2A38] mb-2">Potential Causes:</h5>
                    <div className="space-y-1">
                      {analysis.potentialCauses.map((cause, causeIndex) => (
                        <div key={causeIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-[#F59E0B] rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{cause}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#4ADE80]/10 rounded-lg">
                    <h5 className="font-medium text-[#1E2A38] mb-1">Recommendation:</h5>
                    <p className="text-sm text-gray-700">{analysis.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRootCauseModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
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

export default Analytics;