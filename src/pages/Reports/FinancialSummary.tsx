import React, { useState } from 'react';
import { Download, Filter, Calendar, MessageSquare, Eye, TrendingUp, TrendingDown, BarChart3, PieChart, FileText, Plus, X, Edit3, Save, Share2, Bell, Target, Zap, RefreshCw, Brain, Lightbulb, AlertTriangle, CheckCircle, Users, Clock } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface Annotation {
  id: string;
  lineItem: string;
  content: string;
  author: string;
  createdAt: Date;
  type: 'note' | 'question' | 'explanation';
  replies: AnnotationReply[];
}

interface AnnotationReply {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface ComparisonPeriod {
  id: string;
  name: string;
  data: any;
  isActive: boolean;
}

interface VarianceAnalysis {
  lineItem: string;
  variance: number;
  variancePercent: number;
  explanation: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface InteractiveFilter {
  id: string;
  name: string;
  type: 'date' | 'department' | 'category' | 'amount';
  value: any;
  isActive: boolean;
}

interface NarrativeInsight {
  section: string;
  insight: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

const FinancialSummary: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      lineItem: 'revenue-jan',
      content: 'Strong performance driven by new product launch',
      author: 'Sarah Johnson',
      createdAt: new Date(Date.now() - 3600000),
      type: 'explanation',
      replies: [
        {
          id: 'r1',
          content: 'Which product specifically? The enterprise tier?',
          author: 'Michael Chen',
          createdAt: new Date(Date.now() - 1800000)
        }
      ]
    },
    {
      id: '2',
      lineItem: 'expenses-jan',
      content: 'Marketing spend increased for Q1 campaign',
      author: 'Michael Chen',
      createdAt: new Date(Date.now() - 7200000),
      type: 'note',
      replies: []
    }
  ]);

  const [comparisonPeriods, setComparisonPeriods] = useState<ComparisonPeriod[]>([
    { id: 'current', name: 'Current Period', data: {}, isActive: true },
    { id: 'previous', name: 'Previous Period', data: {}, isActive: true },
    { id: 'budget', name: 'Budget', data: {}, isActive: false },
    { id: 'industry', name: 'Industry Benchmark', data: {}, isActive: false }
  ]);

  const [varianceAnalyses] = useState<VarianceAnalysis[]>([
    {
      lineItem: 'Revenue',
      variance: 47245,
      variancePercent: 12.5,
      explanation: 'New product launch exceeded expectations with strong market adoption',
      impact: 'high',
      recommendation: 'Continue marketing investment in this product line'
    },
    {
      lineItem: 'Marketing Expenses',
      variance: 15000,
      variancePercent: 23.0,
      explanation: 'Increased digital advertising spend for Q1 campaign launch',
      impact: 'medium',
      recommendation: 'Monitor ROI closely and adjust spend based on performance'
    },
    {
      lineItem: 'Operating Expenses',
      variance: -8500,
      variancePercent: -3.2,
      explanation: 'Cost optimization initiatives showing positive results',
      impact: 'medium',
      recommendation: 'Expand cost optimization to other departments'
    }
  ]);

  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<string>('');
  const [newAnnotation, setNewAnnotation] = useState({
    content: '',
    type: 'note' as const
  });
  const [showVarianceModal, setShowVarianceModal] = useState(false);
  const [showNarrativeModal, setShowNarrativeModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [interactiveFilters, setInteractiveFilters] = useState<InteractiveFilter[]>([
    { id: '1', name: 'Date Range', type: 'date', value: 'current-month', isActive: true },
    { id: '2', name: 'Department', type: 'department', value: 'all', isActive: false },
    { id: '3', name: 'Amount Threshold', type: 'amount', value: 1000, isActive: false }
  ]);
  const [narrativeInsights, setNarrativeInsights] = useState<NarrativeInsight[]>([
    {
      section: 'Revenue Analysis',
      insight: 'Revenue growth acceleration driven by enterprise product tier adoption',
      confidence: 89,
      impact: 'high',
      recommendation: 'Increase enterprise sales team capacity by 30%'
    },
    {
      section: 'Cost Management',
      insight: 'Marketing efficiency declining with 15% ROI decrease this quarter',
      confidence: 92,
      impact: 'medium',
      recommendation: 'Reallocate budget to higher-performing channels'
    },
    {
      section: 'Cash Flow',
      insight: 'Payment terms optimization could improve cash flow by $85K monthly',
      confidence: 78,
      impact: 'medium',
      recommendation: 'Negotiate extended payment terms with top 5 suppliers'
    }
  ]);

  const [activeFilters, setActiveFilters] = useState({
    dateRange: 'current-month',
    comparison: 'previous-period',
    format: 'detailed'
  });

  const [isInteractive, setIsInteractive] = useState(true);

  const monthlyData = [
    { 
      month: 'January 2025', 
      revenue: 425000, 
      expenses: 285000, 
      profit: 140000, 
      margin: 32.9,
      revenueVsBudget: 112.5,
      expensesVsBudget: 95.0,
      revenueVsPrevious: 115.4,
      expensesVsPrevious: 108.7
    },
    { 
      month: 'December 2024', 
      revenue: 398000, 
      expenses: 272000, 
      profit: 126000, 
      margin: 31.7,
      revenueVsBudget: 108.2,
      expensesVsBudget: 97.1,
      revenueVsPrevious: 109.8,
      expensesVsPrevious: 105.2
    },
    { 
      month: 'November 2024', 
      revenue: 367000, 
      expenses: 251000, 
      profit: 116000, 
      margin: 31.6,
      revenueVsBudget: 105.7,
      expensesVsBudget: 94.8,
      revenueVsPrevious: 106.3,
      expensesVsPrevious: 102.1
    },
    { 
      month: 'October 2024', 
      revenue: 342000, 
      expenses: 239000, 
      profit: 103000, 
      margin: 30.1,
      revenueVsBudget: 102.4,
      expensesVsBudget: 96.2,
      revenueVsPrevious: 103.7,
      expensesVsPrevious: 101.8
    }
  ];

  const narrativeReport = {
    executiveSummary: "January 2025 delivered exceptional performance with revenue of $425K, representing a 15.4% increase over the previous month and 12.5% above budget. This strong performance was primarily driven by the successful launch of our enterprise product tier, which contributed $85K in new revenue.",
    keyFindings: [
      "Revenue exceeded budget by $47K due to enterprise product success",
      "Gross margin improved to 32.9%, up from 31.7% in December",
      "Operating expenses remained well-controlled at 95% of budget",
      "Cash flow generation accelerated with $140K in net profit"
    ],
    riskFactors: [
      "Marketing spend increased 23% - monitor ROI sustainability",
      "Customer acquisition cost trending upward in competitive market",
      "Seasonal Q2 slowdown historically impacts performance"
    ],
    opportunities: [
      "Pricing optimization could yield additional 5-8% margin improvement",
      "Enterprise tier expansion to additional market segments",
      "Cost optimization initiatives showing early success"
    ],
    recommendations: [
      "Maintain current marketing investment while optimizing channel mix",
      "Implement dynamic pricing strategy for premium offerings",
      "Accelerate enterprise sales team hiring to capitalize on momentum"
    ]
  };

  const handleAddAnnotation = () => {
    if (newAnnotation.content.trim() && selectedLineItem) {
      const annotation: Annotation = {
        id: Date.now().toString(),
        lineItem: selectedLineItem,
        content: newAnnotation.content,
        author: 'Current User',
        createdAt: new Date(),
        type: newAnnotation.type,
        replies: []
      };
      setAnnotations(prev => [...prev, annotation]);
      setNewAnnotation({ content: '', type: 'note' });
      setShowAnnotationModal(false);
    }
  };

  const getAnnotationsForLineItem = (lineItem: string) => {
    return annotations.filter(ann => ann.lineItem === lineItem);
  };

  const toggleComparison = (periodId: string) => {
    setComparisonPeriods(prev => prev.map(period =>
      period.id === periodId ? { ...period, isActive: !period.isActive } : period
    ));
  };

  const toggleFilter = (filterId: string) => {
    setInteractiveFilters(prev => prev.map(filter =>
      filter.id === filterId ? { ...filter, isActive: !filter.isActive } : filter
    ));
  };

  const updateFilterValue = (filterId: string, value: any) => {
    setInteractiveFilters(prev => prev.map(filter =>
      filter.id === filterId ? { ...filter, value } : filter
    ));
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 105) return 'text-[#4ADE80]';
    if (variance < 95) return 'text-[#F87171]';
    return 'text-[#F59E0B]';
  };

  const getVarianceImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-[#F87171] bg-[#F87171]/10';
      case 'medium': return 'text-[#F59E0B] bg-[#F59E0B]/10';
      case 'low': return 'text-[#4ADE80] bg-[#4ADE80]/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderAnnotationIcon = (lineItem: string) => {
    const lineAnnotations = getAnnotationsForLineItem(lineItem);
    if (lineAnnotations.length === 0) return null;

    return (
      <button
        onClick={() => {
          setSelectedLineItem(lineItem);
          setShowAnnotationModal(true);
        }}
        className="ml-2 p-1 hover:bg-gray-100 rounded"
        title={`${lineAnnotations.length} annotation(s)`}
      >
        <MessageSquare className="w-3 h-3 text-[#3AB7BF]" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F87171] text-white text-xs rounded-full flex items-center justify-center">
          {lineAnnotations.length}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Advanced Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Financial Summary</h2>
          <p className="text-gray-600 mt-1">Interactive financial analysis with AI-powered insights</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsInteractive(!isInteractive)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isInteractive ? 'Static View' : 'Interactive'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAdvancedFilters(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowVarianceModal(true)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Variance Analysis
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowNarrativeModal(true)}
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Narrative
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
          <Button variant="primary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Enhanced Comparison Controls */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1E2A38]">Comparative Analysis</h3>
          <div className="flex gap-2">
            {comparisonPeriods.map(period => (
              <button
                key={period.id}
                onClick={() => toggleComparison(period.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  period.isActive 
                    ? 'bg-[#3AB7BF] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-[#4ADE80]">$1,247,850</p>
            <div className="flex items-center justify-center mt-2">
              <span className="text-sm text-[#4ADE80] mr-2">+15.3% vs Previous</span>
              {comparisonPeriods.find(p => p.id === 'budget')?.isActive && (
                <span className="text-sm text-[#4ADE80]">+12.5% vs Budget</span>
              )}
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-[#F87171]">$847,200</p>
            <div className="flex items-center justify-center mt-2">
              <span className="text-sm text-[#F87171] mr-2">+8.7% vs Previous</span>
              {comparisonPeriods.find(p => p.id === 'budget')?.isActive && (
                <span className="text-sm text-[#4ADE80]">-5.0% vs Budget</span>
              )}
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Net Profit</p>
            <p className="text-3xl font-bold text-[#3AB7BF]">$400,650</p>
            <div className="flex items-center justify-center mt-2">
              <span className="text-sm text-[#4ADE80] mr-2">+28.4% vs Previous</span>
              {comparisonPeriods.find(p => p.id === 'industry')?.isActive && (
                <span className="text-sm text-[#4ADE80]">+15% vs Industry</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Monthly Breakdown with Enhanced Features */}
      <Card title="Interactive Monthly Analysis">
        <div className="space-y-4">
          {isInteractive && (
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Click on any row to add annotations or view details</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Chart View
                </Button>
                <Button variant="outline" size="sm">
                  <PieChart className="w-4 h-4 mr-2" />
                  Breakdown
                </Button>
                <Button variant="outline" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Trend Analysis
                </Button>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Expenses</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Net Profit</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Margin</th>
                  {comparisonPeriods.find(p => p.id === 'budget')?.isActive && (
                    <>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Rev vs Budget</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Exp vs Budget</th>
                    </>
                  )}
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 ${isInteractive ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
                    onClick={() => isInteractive && setSelectedLineItem(`row-${index}`)}
                  >
                    <td className="py-3 px-4 font-medium text-[#1E2A38]">
                      <div className="flex items-center">
                        {row.month}
                        {renderAnnotationIcon(`row-${index}`)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-[#4ADE80] font-medium">
                      ${row.revenue.toLocaleString()}
                      {isInteractive && (
                        <div className="text-xs text-gray-500 mt-1">
                          {row.revenueVsPrevious > 100 ? '+' : ''}{(row.revenueVsPrevious - 100).toFixed(1)}% vs prev
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-[#F87171] font-medium">
                      ${row.expenses.toLocaleString()}
                      {isInteractive && (
                        <div className="text-xs text-gray-500 mt-1">
                          {row.expensesVsPrevious > 100 ? '+' : ''}{(row.expensesVsPrevious - 100).toFixed(1)}% vs prev
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-[#3AB7BF] font-medium">${row.profit.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium">{row.margin}%</td>
                    {comparisonPeriods.find(p => p.id === 'budget')?.isActive && (
                      <>
                        <td className={`py-3 px-4 text-right font-medium ${getVarianceColor(row.revenueVsBudget)}`}>
                          {row.revenueVsBudget}%
                        </td>
                        <td className={`py-3 px-4 text-right font-medium ${getVarianceColor(100 - (row.expensesVsBudget - 100))}`}>
                          {row.expensesVsBudget}%
                        </td>
                      </>
                    )}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getAnnotationsForLineItem(`row-${index}`).length > 0 && (
                          <span className="w-2 h-2 bg-[#3AB7BF] rounded-full" />
                        )}
                        {isInteractive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLineItem(`row-${index}`);
                              setShowAnnotationModal(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Plus className="w-3 h-3 text-gray-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Enhanced Trend Analysis */}
      <Card title="Trend Analysis & Insights">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-[#1E2A38] mb-4">Revenue Trends</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#4ADE80]/10 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-[#4ADE80] mr-2" />
                  <span className="text-sm font-medium text-gray-700">Growth Acceleration</span>
                </div>
                <span className="text-sm font-bold text-[#4ADE80]">+15.4% YoY</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#3AB7BF]/10 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-[#3AB7BF] mr-2" />
                  <span className="text-sm font-medium text-gray-700">Seasonal Pattern</span>
                </div>
                <span className="text-sm font-bold text-[#3AB7BF]">Q1 Strong</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F59E0B]/10 rounded-lg">
                <div className="flex items-center">
                  <PieChart className="w-4 h-4 text-[#F59E0B] mr-2" />
                  <span className="text-sm font-medium text-gray-700">Diversification</span>
                </div>
                <span className="text-sm font-bold text-[#F59E0B]">Improving</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-[#1E2A38] mb-4">Expense Analysis</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#F87171]/10 rounded-lg">
                <div className="flex items-center">
                  <TrendingDown className="w-4 h-4 text-[#F87171] mr-2" />
                  <span className="text-sm font-medium text-gray-700">Cost Control</span>
                </div>
                <span className="text-sm font-bold text-[#F87171]">Needs Attention</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#4ADE80]/10 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 text-[#4ADE80] mr-2" />
                  <span className="text-sm font-medium text-gray-700">Efficiency Gains</span>
                </div>
                <span className="text-sm font-bold text-[#4ADE80]">+8.3%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F59E0B]/10 rounded-lg">
                <div className="flex items-center">
                  <PieChart className="w-4 h-4 text-[#F59E0B] mr-2" />
                  <span className="text-sm font-medium text-gray-700">Variable Costs</span>
                </div>
                <span className="text-sm font-bold text-[#F59E0B]">Optimizing</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Annotations Display */}
      {annotations.length > 0 && (
        <Card title="Recent Annotations & Collaboration">
          <div className="space-y-3">
            {annotations.slice(0, 3).map(annotation => (
              <div key={annotation.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-[#1E2A38] text-sm">{annotation.author}</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        annotation.type === 'explanation' ? 'bg-[#3AB7BF]/20 text-[#3AB7BF]' :
                        annotation.type === 'question' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {annotation.type}
                      </span>
                      {annotation.replies.length > 0 && (
                        <span className="ml-2 px-2 py-1 bg-[#4ADE80]/20 text-[#4ADE80] rounded-full text-xs">
                          {annotation.replies.length} replies
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{annotation.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{annotation.createdAt.toLocaleString()}</p>
                    
                    {/* Show replies */}
                    {annotation.replies.length > 0 && (
                      <div className="mt-2 ml-4 space-y-1">
                        {annotation.replies.map(reply => (
                          <div key={reply.id} className="p-2 bg-white rounded border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-[#1E2A38]">{reply.author}</span>
                              <span className="text-xs text-gray-500">{reply.createdAt.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-700">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Advanced Filters</h3>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {interactiveFilters.map(filter => (
                <div key={filter.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-[#1E2A38]">{filter.name}</h4>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={filter.isActive}
                        onChange={() => toggleFilter(filter.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                    </label>
                  </div>
                  
                  {filter.isActive && (
                    <div>
                      {filter.type === 'date' && (
                        <select
                          value={filter.value}
                          onChange={(e) => updateFilterValue(filter.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                        >
                          <option value="current-month">Current Month</option>
                          <option value="last-month">Last Month</option>
                          <option value="current-quarter">Current Quarter</option>
                          <option value="current-year">Current Year</option>
                          <option value="custom">Custom Range</option>
                        </select>
                      )}
                      {filter.type === 'department' && (
                        <select
                          value={filter.value}
                          onChange={(e) => updateFilterValue(filter.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                        >
                          <option value="all">All Departments</option>
                          <option value="sales">Sales</option>
                          <option value="marketing">Marketing</option>
                          <option value="operations">Operations</option>
                          <option value="finance">Finance</option>
                        </select>
                      )}
                      {filter.type === 'amount' && (
                        <input
                          type="number"
                          value={filter.value}
                          onChange={(e) => updateFilterValue(filter.id, parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                          placeholder="Minimum amount"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <Button variant="primary">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Variance Analysis Modal */}
      {showVarianceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Automated Variance Analysis</h3>
              <button
                onClick={() => setShowVarianceModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {varianceAnalyses.map((analysis, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[#1E2A38]">{analysis.lineItem}</h4>
                      <p className="text-sm text-gray-600">
                        Variance: {analysis.variance > 0 ? '+' : ''}${analysis.variance.toLocaleString()} 
                        ({analysis.variancePercent > 0 ? '+' : ''}{analysis.variancePercent}%)
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVarianceImpactColor(analysis.impact)}`}>
                      {analysis.impact} impact
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h5 className="font-medium text-[#1E2A38] mb-1">Explanation:</h5>
                      <p className="text-sm text-gray-700">{analysis.explanation}</p>
                    </div>
                    
                    <div className="p-3 bg-[#4ADE80]/10 rounded-lg">
                      <h5 className="font-medium text-[#1E2A38] mb-1">Recommendation:</h5>
                      <p className="text-sm text-gray-700">{analysis.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Analysis
              </Button>
              <button
                onClick={() => setShowVarianceModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Narrative Report Modal */}
      {showNarrativeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">AI-Generated Narrative Report</h3>
              <button
                onClick={() => setShowNarrativeModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Executive Summary */}
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-3">Executive Summary</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{narrativeReport.executiveSummary}</p>
              </div>
              
              {/* Key Findings */}
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-3">Key Findings</h4>
                <ul className="space-y-2">
                  {narrativeReport.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-[#4ADE80] rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Risk Factors */}
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-3">Risk Factors</h4>
                <ul className="space-y-2">
                  {narrativeReport.riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-[#F87171] rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Opportunities */}
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-3">Opportunities</h4>
                <ul className="space-y-2">
                  {narrativeReport.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-[#3AB7BF] rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Recommended Actions with Priority */}
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-4">Recommended Actions</h4>
                <div className="space-y-3">
                  {narrativeInsights.map((insight, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-[#1E2A38]">{insight.section}</h5>
                          <p className="text-sm text-gray-700">{insight.insight}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.impact === 'high' ? 'bg-[#F87171]/20 text-[#F87171]' :
                          insight.impact === 'medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                          'bg-[#4ADE80]/20 text-[#4ADE80]'
                        }`}>
                          {insight.confidence}% confidence
                        </span>
                      </div>
                      <div className="p-3 bg-[#4ADE80]/10 rounded-lg">
                        <p className="text-sm text-gray-700">{insight.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Report
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <button
                onClick={() => setShowNarrativeModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Annotation Modal */}
      {showAnnotationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Add Annotation</h3>
              <button
                onClick={() => setShowAnnotationModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annotation Type</label>
                <select
                  value={newAnnotation.type}
                  onChange={(e) => setNewAnnotation({...newAnnotation, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="note">Note</option>
                  <option value="question">Question</option>
                  <option value="explanation">Explanation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  value={newAnnotation.content}
                  onChange={(e) => setNewAnnotation({...newAnnotation, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  rows={3}
                  placeholder="Add your note or explanation..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAnnotationModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAnnotation}
                disabled={!newAnnotation.content.trim()}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Annotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialSummary;