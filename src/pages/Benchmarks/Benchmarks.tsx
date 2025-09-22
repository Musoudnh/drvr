import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target, 
  Users, 
  DollarSign, 
  Building2,
  ChevronDown,
  ChevronUp,
  Download,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Filter,
  RefreshCw,
  Eye,
  Settings,
  ArrowUp,
  ArrowDown,
  Minus,
  Brain,
  Zap,
  PieChart,
  LineChart,
  Globe,
  Calendar,
  X,
  Plus,
  Bell
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface BenchmarkMetric {
  id: string;
  name: string;
  companyValue: number;
  industryAverage: number;
  topQuartile: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  performance: 'outperforming' | 'underperforming' | 'average';
  description: string;
  category: 'revenue' | 'expenses' | 'productivity' | 'efficiency';
}

interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  metrics: string[];
}

interface CompanyProfile {
  revenueRange: string;
  employeeCount: number;
  industry: string;
  region: string;
  businessModel: string;
}

const Benchmarks: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('saas');
  const [selectedRevenueRange, setSelectedRevenueRange] = useState('5-20m');
  const [selectedRegion, setSelectedRegion] = useState('north-america');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('current-year');
  const [expandedSections, setExpandedSections] = useState<string[]>(['revenue-drivers']);
  const [showFilters, setShowFilters] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Define initial company profile data as a constant
  const initialCompanyProfile: CompanyProfile = {
    revenueRange: '$5-20M',
    employeeCount: 45,
    industry: 'SaaS',
    region: 'North America',
    businessModel: 'B2B Subscription'
  };

  const [companyProfile] = useState<CompanyProfile>(initialCompanyProfile);
  
  const [profileForm, setProfileForm] = useState({
    industry: initialCompanyProfile.industry,
    revenueRange: initialCompanyProfile.revenueRange,
    employeeCount: initialCompanyProfile.employeeCount.toString(),
    region: initialCompanyProfile.region,
    businessModel: initialCompanyProfile.businessModel,
    state: '',
    city: ''
  });


  const [benchmarkMetrics] = useState<BenchmarkMetric[]>([
    {
      id: 'revenue-growth',
      name: 'Revenue Growth Rate',
      companyValue: 15.4,
      industryAverage: 12.1,
      topQuartile: 18.7,
      unit: '%',
      trend: 'up',
      performance: 'outperforming',
      description: 'Year-over-year revenue growth rate',
      category: 'revenue'
    },
    {
      id: 'gross-margin',
      name: 'Gross Margin',
      companyValue: 62.1,
      industryAverage: 58.3,
      topQuartile: 72.5,
      unit: '%',
      trend: 'up',
      performance: 'outperforming',
      description: 'Gross profit as percentage of revenue',
      category: 'revenue'
    },
    {
      id: 'opex-ratio',
      name: 'Operating Expense Ratio',
      companyValue: 45.2,
      industryAverage: 42.8,
      topQuartile: 35.1,
      unit: '% of Revenue',
      trend: 'up',
      performance: 'underperforming',
      description: 'Operating expenses as percentage of revenue',
      category: 'expenses'
    },
    {
      id: 'payroll-ratio',
      name: 'Payroll % of Revenue',
      companyValue: 38.5,
      industryAverage: 35.2,
      topQuartile: 28.9,
      unit: '%',
      trend: 'up',
      performance: 'underperforming',
      description: 'Employee compensation as percentage of revenue',
      category: 'expenses'
    },
    {
      id: 'marketing-spend',
      name: 'Marketing Spend',
      companyValue: 12.8,
      industryAverage: 15.3,
      topQuartile: 18.2,
      unit: '% of Revenue',
      trend: 'down',
      performance: 'underperforming',
      description: 'Marketing and advertising spend as percentage of revenue',
      category: 'expenses'
    },
    {
      id: 'cac-ltv',
      name: 'CAC to LTV Ratio',
      companyValue: 3.2,
      industryAverage: 3.8,
      topQuartile: 5.1,
      unit: ':1',
      trend: 'stable',
      performance: 'underperforming',
      description: 'Customer Lifetime Value to Customer Acquisition Cost ratio',
      category: 'efficiency'
    },
    {
      id: 'ebitda-margin',
      name: 'EBITDA Margin',
      companyValue: 18.7,
      industryAverage: 16.4,
      topQuartile: 24.8,
      unit: '%',
      trend: 'up',
      performance: 'outperforming',
      description: 'Earnings before interest, taxes, depreciation, and amortization',
      category: 'productivity'
    },
    {
      id: 'revenue-per-employee',
      name: 'Revenue per Employee',
      companyValue: 185000,
      industryAverage: 165000,
      topQuartile: 220000,
      unit: '$',
      trend: 'up',
      performance: 'outperforming',
      description: 'Annual revenue divided by total employee count',
      category: 'productivity'
    }
  ]);

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'opportunity',
      title: 'Marketing Investment Opportunity',
      description: 'Your marketing spend is 2.5% below industry average. Increasing to 15% could drive additional $2.3M in revenue based on peer performance.',
      impact: 'high',
      actionable: true,
      metrics: ['marketing-spend', 'revenue-growth']
    },
    {
      id: '2',
      type: 'risk',
      title: 'Payroll Cost Optimization Needed',
      description: 'Payroll costs are 3.3% above industry average. Consider automation or process optimization to improve efficiency.',
      impact: 'medium',
      actionable: true,
      metrics: ['payroll-ratio', 'revenue-per-employee']
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Strong Gross Margin Position',
      description: 'Your gross margin exceeds industry average by 3.8%. This provides flexibility for strategic investments in growth.',
      impact: 'medium',
      actionable: false,
      metrics: ['gross-margin']
    }
  ]);

  const industries = [
    { value: 'saas', label: 'Software as a Service (SaaS)' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'healthcare', label: 'Healthcare & Medical' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'fintech', label: 'Financial Technology' },
    { value: 'consulting', label: 'Professional Services' }
  ];

  const revenueRanges = [
    { value: 'under-5m', label: 'Under $5M' },
    { value: '5-20m', label: '$5M - $20M' },
    { value: '20-100m', label: '$20M - $100M' },
    { value: 'over-100m', label: 'Over $100M' }
  ];

  const regions = [
    { value: 'north-america', label: 'North America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia-pacific', label: 'Asia Pacific' },
    { value: 'global', label: 'Global' }
  ];

  const timePeriods = [
    { value: 'current-year', label: 'Current Year' },
    { value: '3-year-trend', label: '3-Year Trend' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'outperforming': return '#4ADE80';
      case 'underperforming': return '#F87171';
      default: return '#F59E0B';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'outperforming': return ArrowUp;
      case 'underperforming': return ArrowDown;
      default: return Minus;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return TrendingUp;
      case 'risk': return AlertTriangle;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return '#4ADE80';
      case 'risk': return '#F87171';
      default: return '#3AB7BF';
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '$' && value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `${value}${unit}`;
  };

  const calculatePerformanceGap = (companyValue: number, benchmark: number, unit: string) => {
    const gap = companyValue - benchmark;
    const percentage = (gap / benchmark) * 100;
    const sign = gap > 0 ? '+' : '';
    
    if (unit === '$') {
      return `${sign}$${Math.abs(gap).toLocaleString()}`;
    }
    return `${sign}${percentage.toFixed(1)}%`;
  };

  // Get headline insight
  const getHeadlineInsight = () => {
    const underperformingMetrics = benchmarkMetrics.filter(m => m.performance === 'underperforming');
    if (underperformingMetrics.length > 0) {
      const metric = underperformingMetrics[0];
      const gap = calculatePerformanceGap(metric.companyValue, metric.industryAverage, metric.unit);
      return {
        text: `You spend ${gap} more on ${metric.name.toLowerCase()} than industry average`,
        type: 'warning' as const,
        metric: metric.name
      };
    }
    
    const outperformingMetrics = benchmarkMetrics.filter(m => m.performance === 'outperforming');
    if (outperformingMetrics.length > 0) {
      const metric = outperformingMetrics[0];
      const gap = calculatePerformanceGap(metric.companyValue, metric.industryAverage, metric.unit);
      return {
        text: `Your ${metric.name.toLowerCase()} exceeds industry average by ${gap}`,
        type: 'success' as const,
        metric: metric.name
      };
    }
    
    return {
      text: 'Your performance aligns closely with industry benchmarks',
      type: 'neutral' as const,
      metric: 'Overall Performance'
    };
  };

  const headlineInsight = getHeadlineInsight();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-[#1E2A38]">Industry Benchmarks</h2>
            <p className="text-gray-600 mt-2 text-lg">Compare your performance against industry peers and identify growth opportunities</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              variant="primary"
              onClick={() => setShowExportModal(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Company Profile & Filters */}
        <Card>
          <div className="space-y-6">
            {/* Company Profile Snapshot */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1E2A38] mb-3">Your Company Profile</h3>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Industry:</span>
                    <span className="font-medium text-[#1E2A38] ml-1">{companyProfile.industry}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium text-[#1E2A38] ml-1">{companyProfile.revenueRange}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Employees:</span>
                    <span className="font-medium text-[#1E2A38] ml-1">{companyProfile.employeeCount}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium text-[#1E2A38] ml-1">{companyProfile.region}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-[#3AB7BF] text-[#3AB7BF] hover:bg-[#3AB7BF] hover:text-white focus:ring-[#3AB7BF] px-3 py-1.5 text-sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Update Profile
                </button>
              </Button>
            </div>

            {/* Dynamic Filters */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    >
                      {industries.map(industry => (
                        <option key={industry.value} value={industry.value}>{industry.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Range</label>
                    <select
                      value={selectedRevenueRange}
                      onChange={(e) => setSelectedRevenueRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    >
                      {revenueRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    >
                      {regions.map(region => (
                        <option key={region.value} value={region.value}>{region.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                    <select
                      value={selectedTimePeriod}
                      onChange={(e) => setSelectedTimePeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    >
                      {timePeriods.map(period => (
                        <option key={period.value} value={period.value}>{period.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Headline Insight */}
        <Card>
          <div className={`p-6 rounded-lg border-l-4 ${
            headlineInsight.type === 'success' ? 'bg-[#4ADE80]/10 border-[#4ADE80]' :
            headlineInsight.type === 'warning' ? 'bg-[#F59E0B]/10 border-[#F59E0B]' :
            'bg-[#3AB7BF]/10 border-[#3AB7BF]'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  headlineInsight.type === 'success' ? 'bg-[#4ADE80]' :
                  headlineInsight.type === 'warning' ? 'bg-[#F59E0B]' :
                  'bg-[#3AB7BF]'
                }`}>
                  {headlineInsight.type === 'success' ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : headlineInsight.type === 'warning' ? (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  ) : (
                    <Info className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E2A38] mb-2">Key Performance Insight</h3>
                  <p className="text-lg text-gray-700">{headlineInsight.text}</p>
                  <p className="text-sm text-gray-500 mt-2">Based on {selectedIndustry.toUpperCase()} industry data for {selectedRevenueRange} companies</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Benchmark Dashboard */}
      <Card title="Performance Benchmark Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {benchmarkMetrics.map(metric => {
            const PerformanceIcon = getPerformanceIcon(metric.performance);
            const performanceColor = getPerformanceColor(metric.performance);
            
            return (
              <div key={metric.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1E2A38] mb-1">{metric.name}</h3>
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                  <div className="flex items-center">
                    <PerformanceIcon 
                      className="w-4 h-4 mr-1" 
                      style={{ color: performanceColor }}
                    />
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${performanceColor}20`,
                        color: performanceColor
                      }}
                    >
                      {metric.performance === 'outperforming' ? 'Above Avg' : 
                       metric.performance === 'underperforming' ? 'Below Avg' : 'Average'}
                    </span>
                  </div>
                </div>

                {/* Company Value */}
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-[#1E2A38]">
                      {formatValue(metric.companyValue, metric.unit)}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">Your Company</span>
                  </div>
                </div>

                {/* Benchmark Comparison */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Industry Average</span>
                    <span className="font-medium text-gray-700">
                      {formatValue(metric.industryAverage, metric.unit)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Top Quartile</span>
                    <span className="font-medium text-[#4ADE80]">
                      {formatValue(metric.topQuartile, metric.unit)}
                    </span>
                  </div>

                  {/* Performance Gap */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">vs Industry Avg</span>
                      <span 
                        className="font-bold"
                        style={{ color: performanceColor }}
                      >
                        {calculatePerformanceGap(metric.companyValue, metric.industryAverage, metric.unit)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mt-4">
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, (metric.companyValue / metric.topQuartile) * 100)}%`,
                          backgroundColor: performanceColor
                        }}
                      />
                    </div>
                    {/* Industry Average Marker */}
                    <div 
                      className="absolute top-0 w-0.5 h-2 bg-gray-600"
                      style={{ left: `${(metric.industryAverage / metric.topQuartile) * 100}%` }}
                      title="Industry Average"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>Top Quartile</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* AI-Powered Insights Panel */}
      {showAIInsights && (
        <Card title="AI-Powered Performance Insights">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Brain className="w-5 h-5 text-[#8B5CF6] mr-2" />
                <span className="font-medium text-[#1E2A38]">Intelligent Analysis</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAIInsights(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiInsights.map(insight => {
                const InsightIcon = getInsightIcon(insight.type);
                const insightColor = getInsightColor(insight.type);
                
                return (
                  <div 
                    key={insight.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: `${insightColor}20` }}
                        >
                          <InsightIcon className="w-4 h-4" style={{ color: insightColor }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#1E2A38]">{insight.title}</h4>
                          <span 
                            className="text-xs font-medium px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: `${insightColor}20`,
                              color: insightColor
                            }}
                          >
                            {insight.impact} impact
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                    
                    {insight.actionable && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Zap className="w-4 h-4 mr-2" />
                        Take Action
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Expandable Deep-Dive Sections */}
      <div className="space-y-4">
        {/* Revenue Drivers Section */}
        <Card>
          <button
            onClick={() => toggleSection('revenue-drivers')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-[#4ADE80] mr-3" />
              <h3 className="text-lg font-semibold text-[#1E2A38]">Revenue Drivers Analysis</h3>
            </div>
            {expandedSections.includes('revenue-drivers') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.includes('revenue-drivers') && (
            <div className="px-4 pb-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-[#4ADE80]/10 rounded-lg">
                  <h4 className="font-semibold text-[#1E2A38] mb-2">ARPU (Annual)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Your Company</span>
                      <span className="font-bold text-[#4ADE80]">$4,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Industry Avg</span>
                      <span className="text-gray-700">$3,890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Top Quartile</span>
                      <span className="text-[#4ADE80]">$5,120</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#F87171]/10 rounded-lg">
                  <h4 className="font-semibold text-[#1E2A38] mb-2">Churn Rate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Your Company</span>
                      <span className="font-bold text-[#F87171]">5.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Industry Avg</span>
                      <span className="text-gray-700">4.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Top Quartile</span>
                      <span className="text-[#4ADE80]">2.1%</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
                  <h4 className="font-semibold text-[#1E2A38] mb-2">Sales Efficiency</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Your Company</span>
                      <span className="font-bold text-[#3AB7BF]">$285K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Industry Avg</span>
                      <span className="text-gray-700">$245K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Top Quartile</span>
                      <span className="text-[#4ADE80]">$380K</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Interactive Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-[#1E2A38] mb-4">Revenue Growth Distribution</h4>
                <div className="relative h-48">
                  <svg className="w-full h-full">
                    {/* Bell curve visualization */}
                    <path
                      d="M 50 150 Q 200 50 350 150 Q 500 50 650 150"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                    />
                    {/* Your position marker */}
                    <circle cx="280" cy="90" r="6" fill="#4ADE80" />
                    <text x="280" y="80" textAnchor="middle" className="text-xs font-medium fill-[#4ADE80]">You</text>
                    {/* Industry average marker */}
                    <circle cx="350" cy="150" r="4" fill="#6B7280" />
                    <text x="350" y="170" textAnchor="middle" className="text-xs fill-gray-600">Avg</text>
                  </svg>
                </div>
                <p className="text-sm text-gray-600 text-center">Your revenue growth rate positions you in the 75th percentile</p>
              </div>
            </div>
          )}
        </Card>

        {/* Expense Breakdown Section */}
        <Card>
          <button
            onClick={() => toggleSection('expense-breakdown')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <PieChart className="w-5 h-5 text-[#F87171] mr-3" />
              <h3 className="text-lg font-semibold text-[#1E2A38]">Expense Breakdown Analysis</h3>
            </div>
            {expandedSections.includes('expense-breakdown') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.includes('expense-breakdown') && (
            <div className="px-4 pb-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#1E2A38] mb-4">Expense Categories vs Industry</h4>
                  <div className="space-y-4">
                    {[
                      { category: 'Payroll & Benefits', company: 38.5, industry: 35.2, topQuartile: 28.9 },
                      { category: 'Technology & Software', company: 8.2, industry: 9.1, topQuartile: 12.5 },
                      { category: 'Facilities & Rent', company: 6.8, industry: 7.2, topQuartile: 5.1 },
                      { category: 'Marketing & Sales', company: 12.8, industry: 15.3, topQuartile: 18.2 }
                    ].map((expense, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                          <span className="text-sm font-bold text-[#1E2A38]">{expense.company}%</span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-[#3AB7BF]" 
                              style={{ width: `${(expense.company / expense.topQuartile) * 100}%` }}
                            />
                          </div>
                          {/* Industry average marker */}
                          <div 
                            className="absolute top-0 w-0.5 h-2 bg-gray-600"
                            style={{ left: `${(expense.industry / expense.topQuartile) * 100}%` }}
                            title="Industry Average"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Industry: {expense.industry}%</span>
                          <span>Top: {expense.topQuartile}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#1E2A38] mb-4">Cost Optimization Opportunities</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
                      <h5 className="font-medium text-[#1E2A38] mb-1">Payroll Optimization</h5>
                      <p className="text-sm text-gray-600">3.3% above industry average. Consider automation or process improvements.</p>
                      <p className="text-xs text-[#F59E0B] mt-1">Potential savings: $180K annually</p>
                    </div>
                    
                    <div className="p-3 bg-[#4ADE80]/10 rounded-lg border border-[#4ADE80]/20">
                      <h5 className="font-medium text-[#1E2A38] mb-1">Technology Investment</h5>
                      <p className="text-sm text-gray-600">Below industry average. Room for strategic tech investments.</p>
                      <p className="text-xs text-[#4ADE80] mt-1">Investment opportunity: $85K annually</p>
                    </div>
                    
                    <div className="p-3 bg-[#3AB7BF]/10 rounded-lg border border-[#3AB7BF]/20">
                      <h5 className="font-medium text-[#1E2A38] mb-1">Marketing Underinvestment</h5>
                      <p className="text-sm text-gray-600">2.5% below average. Potential growth opportunity.</p>
                      <p className="text-xs text-[#3AB7BF] mt-1">Growth potential: $2.3M revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Productivity Metrics Section */}
        <Card>
          <button
            onClick={() => toggleSection('productivity-metrics')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 text-[#8B5CF6] mr-3" />
              <h3 className="text-lg font-semibold text-[#1E2A38]">Productivity & Efficiency Metrics</h3>
            </div>
            {expandedSections.includes('productivity-metrics') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.includes('productivity-metrics') && (
            <div className="px-4 pb-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { metric: 'Revenue per Employee', company: '$185K', industry: '$165K', topQuartile: '$220K', performance: 'outperforming' },
                  { metric: 'Profit per Employee', company: '$52K', industry: '$48K', topQuartile: '$68K', performance: 'outperforming' },
                  { metric: 'Sales per Location', company: '$2.4M', industry: '$2.1M', topQuartile: '$3.2M', performance: 'outperforming' },
                  { metric: 'Customer per Employee', company: '12.5', industry: '11.8', topQuartile: '15.2', performance: 'average' }
                ].map((metric, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-[#1E2A38] mb-2">{metric.metric}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">You</span>
                        <span className="font-bold text-[#1E2A38]">{metric.company}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Industry</span>
                        <span className="text-gray-600">{metric.industry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Top 25%</span>
                        <span className="text-[#4ADE80]">{metric.topQuartile}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#3AB7BF]/10 rounded-lg p-6">
                <h4 className="font-semibold text-[#1E2A38] mb-3">Productivity Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-[#4ADE80] mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#1E2A38]">Strong Revenue Efficiency</p>
                      <p className="text-xs text-gray-600">Revenue per employee exceeds industry average by 12%</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B] mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#1E2A38]">Scaling Opportunity</p>
                      <p className="text-xs text-gray-600">Customer-to-employee ratio suggests room for growth</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Action-Oriented Features */}
      <Card title="Take Action">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Download className="w-6 h-6 mb-2" />
            <span className="text-sm">Export Report</span>
          </Button>
          
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Target className="w-6 h-6 mb-2" />
            <span className="text-sm">Set Targets</span>
          </Button>
          
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <LineChart className="w-6 h-6 mb-2" />
            <span className="text-sm">Forecast Impact</span>
          </Button>
          
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <Bell className="w-6 h-6 mb-2" />
            <span className="text-sm">Setup Alerts</span>
          </Button>
        </div>
      </Card>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Export Benchmark Report</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Format</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent">
                  <option value="pdf">PDF Report</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="powerpoint">PowerPoint Presentation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Include Sections</label>
                <div className="space-y-2">
                  {['Executive Summary', 'Detailed Metrics', 'AI Insights', 'Action Items'].map(section => (
                    <label key={section} className="flex items-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF] mr-3" />
                      <span className="text-sm text-gray-700">{section}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  // Simulate export
                  alert('Benchmark report exported successfully!');
                }}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Update Company Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={profileForm.industry}
                  onChange={(e) => setProfileForm({...profileForm, industry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="SaaS">Software as a Service (SaaS)</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Healthcare">Healthcare & Medical</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Fintech">Financial Technology</option>
                  <option value="Consulting">Professional Services</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Range</label>
                <select
                  value={profileForm.revenueRange}
                  onChange={(e) => setProfileForm({...profileForm, revenueRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="Under $5M">Under $5M</option>
                  <option value="$5-20M">$5M - $20M</option>
                  <option value="$20-100M">$20M - $100M</option>
                  <option value="Over $100M">Over $100M</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee Count</label>
                <input
                  type="number"
                  value={profileForm.employeeCount}
                  onChange={(e) => setProfileForm({...profileForm, employeeCount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="Enter number of employees"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <select
                  value={profileForm.region}
                  onChange={(e) => setProfileForm({...profileForm, region: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="Global">Global</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Model</label>
                <select
                  value={profileForm.businessModel}
                  onChange={(e) => setProfileForm({...profileForm, businessModel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="B2B Subscription">B2B Subscription</option>
                  <option value="B2C Subscription">B2C Subscription</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="Enterprise Software">Enterprise Software</option>
                  <option value="Professional Services">Professional Services</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    placeholder="e.g., California"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    placeholder="e.g., San Francisco"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Update the company profile with form data
                  console.log('Updated profile:', profileForm);
                  alert('Company profile updated successfully!');
                  setShowProfileModal(false);
                }}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Benchmarks;