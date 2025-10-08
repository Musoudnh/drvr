import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, Users, DollarSign, Building, Globe, Award, ArrowRight, Settings, X, ChevronRight, ChevronLeft, Filter, ChevronUp, ChevronDown, RefreshCw, Download, Building2, Eye, Info, AlertTriangle, Brain, Zap, PieChart, CheckCircle, LineChart, Bell, ArrowUp, ArrowDown, Minus, Lightbulb } from 'lucide-react';
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
  const [setupStep, setSetupStep] = useState(1);
  const [setupData, setSetupData] = useState({
    // Step 1: Company Profile
    industry: '',
    businessModel: '',
    annualRevenue: '',
    revenueRange: '',
    employeeCount: '',
    region: '',
    businessStage: ''
  });

  // Define initial company profile data as a constant
  const initialCompanyProfile: CompanyProfile = {
    revenueRange: '$5-20M',
    employeeCount: 45,
    industry: 'SaaS',
    region: 'North America',
    businessModel: 'B2B Subscription'
  };

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(initialCompanyProfile);
  
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

  const handleSetupNext = () => {
    if (setupStep < 1) { // Only 1 step for now, can be expanded
      setSetupStep(setupStep + 1);
    } else {
      handleSetupComplete();
    }
  };

  const handleSetupPrevious = () => {
    if (setupStep > 1) {
      setSetupStep(setupStep - 1);
    }
  };

  const handleSetupComplete = () => {
    // Update company profile with setup data
    setCompanyProfile(prev => ({
      ...prev,
      industry: setupData.industry,
      businessModel: setupData.businessModel,
      revenue: setupData.annualRevenue,
      revenueRange: setupData.revenueRange,
      employees: parseInt(setupData.employeeCount) || prev.employeeCount,
      region: setupData.region,
      businessStage: setupData.businessStage
    }));
    
    // Reset wizard
    setSetupStep(1);
    setSetupData({
      industry: '',
      businessModel: '',
      annualRevenue: '',
      revenueRange: '',
      employeeCount: '',
      region: '',
      businessStage: ''
    });
    setShowProfileModal(false);
  };

  const renderSetupStep = () => {
    switch (setupStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-[#101010] mb-2">Company Profile</h3>
              <p className="text-gray-600">Tell us about your company to get personalized benchmarks</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={setupData.industry}
                  onChange={(e) => setSetupData({...setupData, industry: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
                >
                  <option value="">Select Industry</option>
                  <option value="Software as a Service (SaaS)">Software as a Service (SaaS)</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Education">Education</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Energy">Energy</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Construction">Construction</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Business Model</label>
                <select
                  value={setupData.businessModel}
                  onChange={(e) => setSetupData({...setupData, businessModel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
                >
                  <option value="">Select Business Model</option>
                  <option value="SaaS">Software as a Service (SaaS)</option>
                  <option value="eCommerce">eCommerce</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Freemium">Freemium</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                  <option value="B2B2C">B2B2C</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Annual Revenue (USD)</label>
                <input
                  type="number"
                  value={setupData.annualRevenue}
                  onChange={(e) => setSetupData({...setupData, annualRevenue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
                  placeholder="e.g., 5000000"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Revenue Range</label>
                <select
                  value={setupData.revenueRange}
                  onChange={(e) => setSetupData({...setupData, revenueRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
                >
                  <option value="">Select Revenue Range</option>
                  <option value="Under $1M">Under $1M</option>
                  <option value="$1M - $5M">$1M - $5M</option>
                  <option value="$5M - $20M">$5M - $20M</option>
                  <option value="$20M - $100M">$20M - $100M</option>
                  <option value="Over $100M">Over $100M</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Employee Count</label>
                <input
                  type="number"
                  value={setupData.employeeCount}
                  onChange={(e) => setSetupData({...setupData, employeeCount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
                  placeholder="e.g., 45"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Region</label>
                <select
                  value={setupData.region}
                  onChange={(e) => setSetupData({...setupData, region: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
                >
                  <option value="">Select Region</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="Latin America">Latin America</option>
                  <option value="Middle East & Africa">Middle East & Africa</option>
                  <option value="Global">Global</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Stage of Business</label>
              <select
                value={setupData.businessStage}
                onChange={(e) => setSetupData({...setupData, businessStage: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
              >
                <option value="">Select Business Stage</option>
                <option value="Startup">Startup (0-2 years)</option>
                <option value="Growth">Growth (3-7 years)</option>
                <option value="Mature">Mature (8+ years)</option>
                <option value="Pre-IPO">Pre-IPO</option>
                <option value="Public">Public Company</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>
            <button className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center px-3 py-2 bg-[#7B68EE] text-white rounded-lg hover:bg-[#6B58DE] transition-colors text-xs font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Company Profile & Filters */}
        <Card>
          <div className="space-y-6">
            {/* Company Profile Snapshot */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#101010] mb-3">Your Company Profile</h3>
                <div className="flex items-center gap-6 text-xs">
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Industry:</span>
                    <span className="font-medium text-[#101010] ml-1">{companyProfile.industry}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium text-[#101010] ml-1">{companyProfile.revenueRange}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Employees:</span>
                    <span className="font-medium text-[#101010] ml-1">{companyProfile.employeeCount}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium text-[#101010] ml-1">{companyProfile.region}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Update Profile
              </button>
            </div>

            {/* Dynamic Filters */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Industry</label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
                    >
                      {industries.map(industry => (
                        <option key={industry.value} value={industry.value}>{industry.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Revenue Range</label>
                    <select
                      value={selectedRevenueRange}
                      onChange={(e) => setSelectedRevenueRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
                    >
                      {revenueRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Region</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
                    >
                      {regions.map(region => (
                        <option key={region.value} value={region.value}>{region.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Time Period</label>
                    <select
                      value={selectedTimePeriod}
                      onChange={(e) => setSelectedTimePeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-xs"
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
          <div className="p-6 rounded-lg border-l-4 bg-[#7B68EE]/10 border-[#7B68EE]">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-[#7B68EE]">
                  {headlineInsight.type === 'success' ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : headlineInsight.type === 'warning' ? (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  ) : (
                    <Info className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#101010] mb-2">Key Performance Insight</h3>
                  <p className="text-sm text-gray-700">{headlineInsight.text}</p>
                  <p className="text-xs text-gray-500 mt-2">Based on {selectedIndustry.toUpperCase()} industry data for {selectedRevenueRange} companies</p>
                </div>
              </div>
              <button className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Benchmark Dashboard */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {benchmarkMetrics.map(metric => {
            const PerformanceIcon = getPerformanceIcon(metric.performance);
            const performanceColor = getPerformanceColor(metric.performance);
            
            return (
              <div key={metric.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-[#101010] mb-1">{metric.name}</div>
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
                <div className="mb-3">
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-[#101010]">
                      {formatValue(metric.companyValue, metric.unit)}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">Your Company</span>
                  </div>
                </div>

                {/* Benchmark Comparison */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Industry Average</span>
                    <span className="font-medium text-gray-700">
                      {formatValue(metric.industryAverage, metric.unit)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Top Quartile</span>
                    <span className="font-medium text-[#4ADE80]">
                      {formatValue(metric.topQuartile, metric.unit)}
                    </span>
                  </div>

                  {/* Performance Gap */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">vs Industry Avg</span>
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

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-[600px] max-w-[90vw] max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Export Benchmark Report</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-[800px] max-w-[90vw] max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#101010]">Update Company Profile</h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="px-6 mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#7B68EE] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(setupStep / 1) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Step Content */}
            <div className="px-6 pb-6 max-h-[60vh] overflow-y-auto">
              {renderSetupStep()}
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
              <div>
                {setupStep > 1 && (
                  <button
                    onClick={handleSetupPrevious}
                    className="flex items-center px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetupComplete}
                  disabled={!setupData.industry || !setupData.businessModel || !setupData.revenueRange || !setupData.region}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-[#7B68EE] hover:bg-[#6B58DE] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Benchmarks;