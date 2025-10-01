import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Calendar,
  Download,
  Share2,
  RefreshCw,
  Eye,
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
  Lightbulb,
  Info,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Bell,
  MessageSquare,
  Save,
  Copy,
  GitBranch,
  Plus,
  Edit3,
  Trash2,
  FileText,
  Users,
  X
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface VarianceData {
  metric: string;
  category: 'revenue' | 'expenses' | 'profitability' | 'operational';
  actual: number;
  forecast: number;
  variance: number;
  variancePercent: number;
  trend: 'improving' | 'declining' | 'stable';
  significance: 'high' | 'medium' | 'low';
  explanation: string;
  recommendations: string[];
  drillDownData?: DrillDownItem[];
}

interface DrillDownItem {
  id: string;
  name: string;
  actual: number;
  forecast: number;
  variance: number;
}

interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'recommendation' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionItems: string[];
}

interface BudgetVersion {
  id: string;
  name: string;
  version: string;
  type: 'original' | 'revised' | 'forecast';
  createdDate: Date;
  status: 'active' | 'archived';
  description: string;
  createdBy: string;
}

interface VarianceAlert {
  id: string;
  metric: string;
  threshold: number;
  condition: 'above' | 'below' | 'deviation';
  frequency: 'immediate' | 'daily' | 'weekly';
  recipients: string[];
  active: boolean;
}

interface Commentary {
  id: string;
  metricId: string;
  author: string;
  date: Date;
  comment: string;
  attachments?: string[];
}

const VarianceInsights: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'variance' | 'budgets' | 'alerts' | 'commentary'>('variance');
  const [expandedVariances, setExpandedVariances] = useState<string[]>([]);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariance, setSelectedVariance] = useState<VarianceData | null>(null);
  const [showDrillDownModal, setShowDrillDownModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string>('v1');

  const [varianceData] = useState<VarianceData[]>([
    {
      metric: 'Total Revenue',
      category: 'revenue',
      actual: 847500,
      forecast: 825000,
      variance: 22500,
      variancePercent: 2.7,
      trend: 'improving',
      significance: 'medium',
      explanation: 'Revenue exceeded forecast due to strong performance in enterprise sales and higher-than-expected average deal size.',
      recommendations: [
        'Increase Q2 sales targets by 5% to capitalize on momentum',
        'Analyze enterprise sales process for replication',
        'Consider raising pricing for premium products'
      ],
      drillDownData: [
        { id: '1', name: 'Enterprise Sales', actual: 485000, forecast: 450000, variance: 35000 },
        { id: '2', name: 'SMB Sales', actual: 245000, forecast: 250000, variance: -5000 },
        { id: '3', name: 'Service Revenue', actual: 117500, forecast: 125000, variance: -7500 }
      ]
    },
    {
      metric: 'Marketing Expenses',
      category: 'expenses',
      actual: 65400,
      forecast: 55000,
      variance: 10400,
      variancePercent: 18.9,
      trend: 'declining',
      significance: 'high',
      explanation: 'Marketing spend significantly exceeded budget due to unplanned digital advertising campaigns and conference participation.',
      recommendations: [
        'Implement stricter budget controls for marketing spend',
        'Analyze ROI of additional campaigns before approval',
        'Negotiate better rates with advertising platforms'
      ],
      drillDownData: [
        { id: '1', name: 'Digital Advertising', actual: 35400, forecast: 25000, variance: 10400 },
        { id: '2', name: 'Events & Conferences', actual: 18000, forecast: 15000, variance: 3000 },
        { id: '3', name: 'Content Marketing', actual: 12000, forecast: 15000, variance: -3000 }
      ]
    },
    {
      metric: 'Gross Margin',
      category: 'profitability',
      actual: 62.1,
      forecast: 58.5,
      variance: 3.6,
      variancePercent: 6.2,
      trend: 'improving',
      significance: 'high',
      explanation: 'Gross margin improvement driven by cost optimization initiatives and favorable product mix shift toward higher-margin offerings.',
      recommendations: [
        'Continue focus on high-margin product lines',
        'Implement cost optimization across all product categories',
        'Consider strategic pricing adjustments'
      ]
    },
    {
      metric: 'Employee Headcount',
      category: 'operational',
      actual: 28,
      forecast: 32,
      variance: -4,
      variancePercent: -12.5,
      trend: 'stable',
      significance: 'medium',
      explanation: 'Hiring slower than planned due to competitive talent market and extended interview processes.',
      recommendations: [
        'Streamline hiring process to reduce time-to-hire',
        'Consider remote hiring to expand talent pool',
        'Review compensation packages for competitiveness'
      ]
    },
    {
      metric: 'Customer Acquisition Cost',
      category: 'operational',
      actual: 145,
      forecast: 125,
      variance: 20,
      variancePercent: 16.0,
      trend: 'declining',
      significance: 'high',
      explanation: 'CAC increased due to higher competition in digital channels and reduced conversion rates.',
      recommendations: [
        'Optimize ad targeting to improve conversion rates',
        'Invest in organic acquisition channels',
        'Improve landing page performance'
      ]
    }
  ]);

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'opportunity',
      title: 'Revenue Acceleration Opportunity',
      description: 'Enterprise sales momentum suggests potential for 25% revenue upside if sales process is optimized and team expanded.',
      impact: 'high',
      confidence: 87,
      actionItems: [
        'Hire 2 additional enterprise sales reps',
        'Implement sales automation tools',
        'Create enterprise customer success program'
      ]
    },
    {
      id: '2',
      type: 'risk',
      title: 'Marketing Spend Efficiency Risk',
      description: 'Marketing costs are trending 19% above forecast with diminishing returns. Immediate optimization required.',
      impact: 'high',
      confidence: 92,
      actionItems: [
        'Pause underperforming ad campaigns',
        'Renegotiate platform rates',
        'Shift budget to higher-ROI channels'
      ]
    },
    {
      id: '3',
      type: 'trend',
      title: 'Margin Expansion Trend',
      description: 'Gross margins are consistently outperforming forecasts, indicating successful cost optimization efforts.',
      impact: 'medium',
      confidence: 78,
      actionItems: [
        'Document successful cost optimization practices',
        'Apply learnings to other product lines',
        'Consider strategic pricing increases'
      ]
    }
  ]);

  const [budgetVersions] = useState<BudgetVersion[]>([
    {
      id: 'v1',
      name: '2025 Original Budget',
      version: '1.0',
      type: 'original',
      createdDate: new Date('2024-12-01'),
      status: 'active',
      description: 'Original annual budget approved by board',
      createdBy: 'Finance Team'
    },
    {
      id: 'v2',
      name: '2025 Q1 Revision',
      version: '1.1',
      type: 'revised',
      createdDate: new Date('2025-01-15'),
      status: 'active',
      description: 'Adjusted for market conditions and Q4 actuals',
      createdBy: 'CFO'
    },
    {
      id: 'v3',
      name: '2025 Rolling Forecast',
      version: '2.0',
      type: 'forecast',
      createdDate: new Date('2025-02-01'),
      status: 'active',
      description: 'Dynamic rolling 12-month forecast updated monthly',
      createdBy: 'FP&A Team'
    }
  ]);

  const [varianceAlerts] = useState<VarianceAlert[]>([
    {
      id: 'a1',
      metric: 'Revenue',
      threshold: 10,
      condition: 'deviation',
      frequency: 'immediate',
      recipients: ['cfo@company.com', 'finance@company.com'],
      active: true
    },
    {
      id: 'a2',
      metric: 'Marketing Expenses',
      threshold: 15,
      condition: 'above',
      frequency: 'daily',
      recipients: ['marketing@company.com', 'cfo@company.com'],
      active: true
    }
  ]);

  const [commentaries] = useState<Commentary[]>([
    {
      id: 'c1',
      metricId: 'revenue',
      author: 'Sarah Chen (VP Finance)',
      date: new Date('2025-01-20'),
      comment: 'Strong enterprise sales driven by two large deals closing earlier than expected. Team performance exceptional this quarter.'
    },
    {
      id: 'c2',
      metricId: 'marketing',
      author: 'Mike Johnson (CMO)',
      date: new Date('2025-01-22'),
      comment: 'Increased spend on digital campaigns for new product launch. ROI tracking shows positive early indicators.'
    }
  ]);

  const filteredVariances = varianceData.filter(variance => {
    const matchesCategory = selectedCategory === 'all' || variance.category === selectedCategory;
    const matchesSearch = variance.metric.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         variance.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleVarianceExpansion = (metric: string) => {
    setExpandedVariances(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return '#F87171';
      case 'medium': return '#F59E0B';
      case 'low': return '#4ADE80';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'declining': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return '#4ADE80';
      case 'declining': return '#F87171';
      default: return '#6B7280';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'recommendation': return Lightbulb;
      case 'trend': return BarChart3;
      default: return Info;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return '#4ADE80';
      case 'risk': return '#F87171';
      case 'recommendation': return '#3AB7BF';
      case 'trend': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const formatVarianceValue = (value: number, isPercentage: boolean = false) => {
    if (isPercentage) {
      return `${value.toFixed(1)}%`;
    }
    return value >= 1000000
      ? `$${(value / 1000000).toFixed(1)}M`
      : value >= 1000
      ? `$${(value / 1000).toFixed(0)}K`
      : `$${Math.abs(value).toLocaleString()}`;
  };

  const refreshInsights = async () => {
    setIsGeneratingInsights(true);
    setTimeout(() => {
      setIsGeneratingInsights(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#1E2A38]">Variance & Insights</h2>
          <p className="text-gray-600 mt-2">Analyze actual vs forecasted performance with AI-powered explanations</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={refreshInsights}
            disabled={isGeneratingInsights}
          >
            {isGeneratingInsights ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Refresh Insights
              </>
            )}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="primary">
            <Share2 className="w-4 h-4 mr-2" />
            Share Analysis
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'variance', label: 'Variance Analysis', icon: BarChart3 },
            { id: 'budgets', label: 'Budget Versions', icon: GitBranch },
            { id: 'alerts', label: 'Alert Configuration', icon: Bell },
            { id: 'commentary', label: 'Commentary & Notes', icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-2 border-b-2 font-medium transition-colors flex items-center ${
                  isActive
                    ? 'border-[#3AB7BF] text-[#3AB7BF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'variance' && (
        <>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="current-month">Current Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="current-quarter">Current Quarter</option>
                  <option value="last-quarter">Last Quarter</option>
                  <option value="ytd">Year to Date</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="revenue">Revenue</option>
                  <option value="expenses">Expenses</option>
                  <option value="profitability">Profitability</option>
                  <option value="operational">Operational</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Version</label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  {budgetVersions.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search variances..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {showAIInsights && (
            <Card title="AI-Powered Insights">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Automated analysis of variance patterns and recommendations</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={refreshInsights}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <button
                      onClick={() => setShowAIInsights(false)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiInsights.map(insight => {
                    const Icon = getInsightIcon(insight.type);
                    const color = getInsightColor(insight.type);

                    return (
                      <div key={insight.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                              style={{ backgroundColor: `${color}20` }}
                            >
                              <Icon className="w-4 h-4" style={{ color }} />
                            </div>
                            <div>
                              <h4 className="font-bold text-[#1E2A38] text-sm">{insight.title}</h4>
                              <span
                                className="text-xs font-medium px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: `${color}20`,
                                  color: color
                                }}
                              >
                                {insight.impact} impact
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">{insight.description}</p>

                        <div className="space-y-2">
                          <h5 className="font-medium text-[#1E2A38] text-xs">Action Items:</h5>
                          {insight.actionItems.slice(0, 2).map((action, index) => (
                            <div key={index} className="flex items-start text-xs text-gray-600">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                              {action}
                            </div>
                          ))}
                          {insight.actionItems.length > 2 && (
                            <button className="text-xs text-[#3AB7BF] hover:underline">
                              +{insight.actionItems.length - 2} more actions
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          <Card title="Variance Analysis">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#4ADE80]/10 rounded-lg text-center">
                  <TrendingUp className="w-8 h-8 text-[#4ADE80] mx-auto mb-2" />
                  <p className="text-lg font-bold text-[#4ADE80]">
                    {filteredVariances.filter(v => v.variancePercent > 0).length}
                  </p>
                  <p className="text-sm text-gray-600">Positive Variances</p>
                </div>

                <div className="p-4 bg-[#F87171]/10 rounded-lg text-center">
                  <TrendingDown className="w-8 h-8 text-[#F87171] mx-auto mb-2" />
                  <p className="text-lg font-bold text-[#F87171]">
                    {filteredVariances.filter(v => v.variancePercent < 0).length}
                  </p>
                  <p className="text-sm text-gray-600">Negative Variances</p>
                </div>

                <div className="p-4 bg-[#F59E0B]/10 rounded-lg text-center">
                  <AlertTriangle className="w-8 h-8 text-[#F59E0B] mx-auto mb-2" />
                  <p className="text-lg font-bold text-[#F59E0B]">
                    {filteredVariances.filter(v => v.significance === 'high').length}
                  </p>
                  <p className="text-sm text-gray-600">High Significance</p>
                </div>

                <div className="p-4 bg-[#3AB7BF]/10 rounded-lg text-center">
                  <Target className="w-8 h-8 text-[#3AB7BF] mx-auto mb-2" />
                  <p className="text-lg font-bold text-[#3AB7BF]">
                    {(filteredVariances.reduce((sum, v) => sum + Math.abs(v.variancePercent), 0) / filteredVariances.length).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Avg Variance</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-4 px-6 font-bold text-gray-800">Metric</th>
                        <th className="text-right py-4 px-6 font-bold text-gray-800">Actual</th>
                        <th className="text-right py-4 px-6 font-bold text-gray-800">Forecast</th>
                        <th className="text-right py-4 px-6 font-bold text-gray-800">Variance</th>
                        <th className="text-center py-4 px-6 font-bold text-gray-800">Trend</th>
                        <th className="text-center py-4 px-6 font-bold text-gray-800">Significance</th>
                        <th className="text-center py-4 px-6 font-bold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVariances.map(variance => {
                        const isExpanded = expandedVariances.includes(variance.metric);
                        const TrendIcon = getTrendIcon(variance.trend);
                        const isPercentageMetric = variance.metric.includes('Margin') || variance.metric.includes('Rate');

                        return (
                          <React.Fragment key={variance.metric}>
                            <tr className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-6">
                                <button
                                  onClick={() => toggleVarianceExpansion(variance.metric)}
                                  className="flex items-center font-medium text-[#1E2A38] hover:text-[#3AB7BF] transition-colors"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 mr-2" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 mr-2" />
                                  )}
                                  {variance.metric}
                                </button>
                              </td>
                              <td className="py-4 px-6 text-right font-bold text-[#1E2A38]">
                                {formatVarianceValue(variance.actual, isPercentageMetric)}
                              </td>
                              <td className="py-4 px-6 text-right text-gray-600">
                                {formatVarianceValue(variance.forecast, isPercentageMetric)}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end">
                                  {variance.variancePercent > 0 ? (
                                    <ArrowUp className="w-4 h-4 text-[#4ADE80] mr-1" />
                                  ) : variance.variancePercent < 0 ? (
                                    <ArrowDown className="w-4 h-4 text-[#F87171] mr-1" />
                                  ) : (
                                    <Minus className="w-4 h-4 text-gray-400 mr-1" />
                                  )}
                                  <span
                                    className="font-bold"
                                    style={{
                                      color: variance.variancePercent > 0 ? '#4ADE80' :
                                             variance.variancePercent < 0 ? '#F87171' : '#6B7280'
                                    }}
                                  >
                                    {variance.variancePercent > 0 ? '+' : ''}{variance.variancePercent.toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center">
                                  <TrendIcon
                                    className="w-4 h-4 mr-1"
                                    style={{ color: getTrendColor(variance.trend) }}
                                  />
                                  <span className="text-sm capitalize">{variance.trend}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span
                                  className="px-3 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: `${getSignificanceColor(variance.significance)}20`,
                                    color: getSignificanceColor(variance.significance)
                                  }}
                                >
                                  {variance.significance}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedVariance(variance);
                                      setShowDrillDownModal(true);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="Drill down"
                                  >
                                    <Eye className="w-4 h-4 text-gray-400" />
                                  </button>
                                  <button
                                    className="p-1 hover:bg-gray-100 rounded"
                                    title="View details"
                                  >
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr className="bg-gray-50">
                                <td colSpan={7} className="py-6 px-6">
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      <div>
                                        <h5 className="font-bold text-[#1E2A38] mb-3 flex items-center">
                                          <Info className="w-4 h-4 mr-2 text-[#3AB7BF]" />
                                          Explanation
                                        </h5>
                                        <p className="text-sm text-gray-700 leading-relaxed">{variance.explanation}</p>
                                      </div>

                                      <div>
                                        <h5 className="font-bold text-[#1E2A38] mb-3 flex items-center">
                                          <Lightbulb className="w-4 h-4 mr-2 text-[#F59E0B]" />
                                          Recommendations
                                        </h5>
                                        <ul className="space-y-2">
                                          {variance.recommendations.map((rec, index) => (
                                            <li key={index} className="flex items-start text-sm text-gray-700">
                                              <CheckCircle className="w-4 h-4 text-[#4ADE80] mr-2 mt-0.5 flex-shrink-0" />
                                              {rec}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>

                                    {variance.drillDownData && (
                                      <div className="mt-6 pt-4 border-t border-gray-200">
                                        <h5 className="font-bold text-[#1E2A38] mb-3">Breakdown Analysis</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                          {variance.drillDownData.map(item => (
                                            <div key={item.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                              <p className="font-medium text-[#1E2A38] text-sm">{item.name}</p>
                                              <div className="flex justify-between mt-2">
                                                <span className="text-xs text-gray-600">Variance:</span>
                                                <span
                                                  className="text-xs font-bold"
                                                  style={{
                                                    color: item.variance > 0 ? '#4ADE80' :
                                                           item.variance < 0 ? '#F87171' : '#6B7280'
                                                  }}
                                                >
                                                  {item.variance > 0 ? '+' : ''}{formatVarianceValue(item.variance)}
                                                </span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Variance Trend Analysis">
              <div className="space-y-4">
                <div className="relative h-64">
                  <svg className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#3AB7BF"
                      strokeWidth="3"
                      points="40,180 120,160 200,140 280,120 360,100 440,80"
                    />
                    <polyline
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                      points="40,190 120,170 200,150 280,130 360,110 440,90"
                    />

                    {[180, 160, 140, 120, 100, 80].map((y, index) => (
                      <circle key={index} cx={40 + index * 80} cy={y} r="4" fill="#3AB7BF" />
                    ))}
                    {[190, 170, 150, 130, 110, 90].map((y, index) => (
                      <circle key={index} cx={40 + index * 80} cy={y} r="4" fill="#8B5CF6" />
                    ))}
                  </svg>
                </div>

                <div className="flex justify-center gap-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#3AB7BF] rounded mr-2" />
                    <span className="text-sm text-gray-600">Actual</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-0.5 bg-[#8B5CF6] mr-2" style={{ borderTop: '3px dashed #8B5CF6' }} />
                    <span className="text-sm text-gray-600">Forecast</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Key Performance Indicators">
              <div className="space-y-4">
                {[
                  { label: 'Forecast Accuracy', value: '87.3%', trend: 'improving', description: 'Overall prediction accuracy' },
                  { label: 'Revenue Variance', value: '+2.7%', trend: 'improving', description: 'Above forecast performance' },
                  { label: 'Expense Control', value: '94.2%', trend: 'stable', description: 'Within budget targets' },
                  { label: 'Margin Improvement', value: '+3.6%', trend: 'improving', description: 'Better than expected margins' }
                ].map((kpi, index) => {
                  const TrendIcon = getTrendIcon(kpi.trend);
                  const trendColor = getTrendColor(kpi.trend);

                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-[#1E2A38]">{kpi.label}</p>
                        <p className="text-sm text-gray-600">{kpi.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end mb-1">
                          <TrendIcon className="w-4 h-4 mr-1" style={{ color: trendColor }} />
                          <span className="font-bold text-[#1E2A38]">{kpi.value}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'budgets' && (
        <Card title="Budget Version Management">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Manage multiple budget versions and rolling forecasts</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Version
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgetVersions.map(version => (
                <div
                  key={version.id}
                  className={`p-6 border-2 rounded-xl hover:shadow-lg transition-all cursor-pointer ${
                    selectedBudget === version.id
                      ? 'border-[#3AB7BF] bg-[#3AB7BF]/5'
                      : 'border-gray-200 hover:border-[#3AB7BF]/50'
                  }`}
                  onClick={() => setSelectedBudget(version.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-[#1E2A38] mb-1">{version.name}</h4>
                      <p className="text-xs text-gray-500">v{version.version}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        version.type === 'original'
                          ? 'bg-blue-100 text-blue-700'
                          : version.type === 'revised'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {version.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{version.description}</p>

                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-2" />
                      {version.createdDate.toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-2" />
                      {version.createdBy}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button className="flex-1 px-3 py-2 text-xs bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors">
                      <Eye className="w-3 h-3 inline mr-1" />
                      View
                    </button>
                    <button className="flex-1 px-3 py-2 text-xs border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Copy className="w-3 h-3 inline mr-1" />
                      Clone
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#3AB7BF]/10 p-6 rounded-xl">
              <h4 className="font-bold text-[#1E2A38] mb-4">Budget Comparison Tool</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compare From</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    {budgetVersions.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Compare To</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    {budgetVersions.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button variant="primary">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Comparison Report
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'alerts' && (
        <Card title="Variance Alert Configuration">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Set up automated alerts for significant variances</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Alert Rule
              </Button>
            </div>

            <div className="space-y-4">
              {varianceAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell className="w-5 h-5 text-[#3AB7BF]" />
                        <h4 className="font-bold text-[#1E2A38]">{alert.metric} Alert</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {alert.active ? 'Active' : 'Paused'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Threshold:</span>
                          <span className="ml-2 font-medium text-[#1E2A38]">
                            {alert.threshold}% {alert.condition}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Frequency:</span>
                          <span className="ml-2 font-medium text-[#1E2A38] capitalize">
                            {alert.frequency}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Recipients:</span>
                          <span className="ml-2 font-medium text-[#1E2A38]">
                            {alert.recipients.length} users
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Notifying:</p>
                    <div className="flex flex-wrap gap-2">
                      {alert.recipients.map((email, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {email}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#1E2A38] mb-2">Recent Alert Activity</h5>
                  <ul className="space-y-2 text-sm">
                    <li className="text-gray-700">
                      <span className="font-medium">Marketing Expenses:</span> Triggered 2 alerts in the last 7 days
                    </li>
                    <li className="text-gray-700">
                      <span className="font-medium">Revenue:</span> No alerts triggered this month
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'commentary' && (
        <Card title="Commentary & Annotations">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Add context and explanations to variance data</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            </div>

            <div className="space-y-4">
              {commentaries.map(comment => (
                <div
                  key={comment.id}
                  className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-[#3AB7BF] rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {comment.author.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1E2A38]">{comment.author}</h4>
                        <p className="text-xs text-gray-500">
                          {comment.date.toLocaleDateString()} at {comment.date.toLocaleTimeString()}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {comment.metricId}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit3 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{comment.comment}</p>

                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Attachments:</p>
                      <div className="flex gap-2">
                        {comment.attachments.map((attachment, idx) => (
                          <button
                            key={idx}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs text-gray-700 flex items-center"
                          >
                            <FileText className="w-3 h-3 mr-2" />
                            {attachment}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-[#3AB7BF]/10 p-6 rounded-xl">
              <h5 className="font-bold text-[#1E2A38] mb-3">Quick Add Commentary</h5>
              <div className="space-y-3">
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select metric to comment on...</option>
                  {varianceData.map(v => (
                    <option key={v.metric} value={v.metric}>{v.metric}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Add your commentary here..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                />
                <div className="flex gap-2">
                  <Button variant="primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Comment
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Attach File
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {showDrillDownModal && selectedVariance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-[1000px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#1E2A38]">
                Drill Down: {selectedVariance.metric}
              </h3>
              <button
                onClick={() => setShowDrillDownModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[#3AB7BF]/10 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Actual</p>
                  <p className="text-xl font-bold text-[#3AB7BF]">
                    {formatVarianceValue(selectedVariance.actual, selectedVariance.metric.includes('Margin'))}
                  </p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Forecast</p>
                  <p className="text-xl font-bold text-gray-600">
                    {formatVarianceValue(selectedVariance.forecast, selectedVariance.metric.includes('Margin'))}
                  </p>
                </div>
                <div className="p-4 bg-[#F59E0B]/10 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Variance</p>
                  <p
                    className="text-xl font-bold"
                    style={{
                      color: selectedVariance.variancePercent > 0 ? '#4ADE80' :
                             selectedVariance.variancePercent < 0 ? '#F87171' : '#6B7280'
                    }}
                  >
                    {selectedVariance.variancePercent > 0 ? '+' : ''}{selectedVariance.variancePercent.toFixed(1)}%
                  </p>
                </div>
              </div>

              {selectedVariance.drillDownData && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h4 className="font-bold text-[#1E2A38]">Component Breakdown</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Component</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Actual</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Forecast</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Variance</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVariance.drillDownData.map(item => {
                          const impactPercent = (item.variance / selectedVariance.variance) * 100;

                          return (
                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium text-[#1E2A38]">{item.name}</td>
                              <td className="py-3 px-4 text-right font-medium text-[#1E2A38]">
                                {formatVarianceValue(item.actual)}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600">
                                {formatVarianceValue(item.forecast)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span
                                  className="font-bold"
                                  style={{
                                    color: item.variance > 0 ? '#4ADE80' :
                                           item.variance < 0 ? '#F87171' : '#6B7280'
                                  }}
                                >
                                  {item.variance > 0 ? '+' : ''}{formatVarianceValue(item.variance)}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right text-sm text-gray-600">
                                {Math.abs(impactPercent).toFixed(1)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 bg-[#3AB7BF]/10 rounded-xl">
                  <h5 className="font-bold text-[#1E2A38] mb-3">Analysis</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedVariance.explanation}</p>
                </div>

                <div className="p-6 bg-[#4ADE80]/10 rounded-xl">
                  <h5 className="font-bold text-[#1E2A38] mb-3">Recommendations</h5>
                  <ul className="space-y-2">
                    {selectedVariance.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-[#4ADE80] mr-2 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Details
              </Button>
              <button
                onClick={() => setShowDrillDownModal(false)}
                className="px-6 py-3 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors font-medium"
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

export default VarianceInsights;
