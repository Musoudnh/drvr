import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Filter, 
  Share2, 
  Save, 
  Clock, 
  ChevronDown, 
  ChevronRight,
  Eye,
  Mail,
  Link as LinkIcon,
  Settings,
  Brain,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Minus,
  Building,
  Users,
  Target,
  Zap,
  RefreshCw,
  X
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface ReportData {
  summaryCards: {
    revenue: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
    grossMargin: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
    ebitda: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
    netIncome: { value: string; change: string; trend: 'up' | 'down' | 'stable' };
  };
  chartData: any[];
  tableData: any[];
  insights: string[];
}

interface AIInsight {
  id: string;
  type: 'trend' | 'risk' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  metrics: string[];
}

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('profit-loss');
  const [dateRange, setDateRange] = useState('current-year');
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showFilters, setShowFilters] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [savedViews, setSavedViews] = useState([
    { id: '1', name: 'Board Report Q4', filters: { dateRange: 'q4-2024', entity: 'all' } },
    { id: '2', name: 'Monthly Executive Summary', filters: { dateRange: 'current-month', entity: 'all' } }
  ]);

  const reportTypes = [
    { id: 'profit-loss', name: 'Profit & Loss', icon: TrendingUp, description: 'Income statement and profitability analysis' },
    { id: 'balance-sheet', name: 'Balance Sheet', icon: BarChart3, description: 'Assets, liabilities, and equity overview' },
    { id: 'cash-flow', name: 'Cash Flow', icon: DollarSign, description: 'Cash inflows and outflows analysis' },
    { id: 'forecast-actual', name: 'Forecast vs. Actuals', icon: Target, description: 'Budget variance and performance tracking' },
    { id: 'kpis-ratios', name: 'KPIs & Ratios', icon: PieChart, description: 'Key performance indicators and financial ratios' },
    { id: 'custom', name: 'Custom Reports', icon: Settings, description: 'User-generated report templates' }
  ];

  const dateRanges = [
    { value: 'current-month', label: 'Current Month' },
    { value: 'current-quarter', label: 'Current Quarter' },
    { value: 'current-year', label: 'Current Year' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const entities = [
    { value: 'all', label: 'All Entities' },
    { value: 'parent', label: 'Parent Company' },
    { value: 'subsidiary-1', label: 'Subsidiary 1' },
    { value: 'subsidiary-2', label: 'Subsidiary 2' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' }
  ];

  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'trend',
      title: 'Revenue Growth Acceleration',
      description: 'Revenue growth has accelerated to 15.4% YoY, outpacing industry average of 12.1%. This trend is driven by strong performance in enterprise sales.',
      impact: 'high',
      metrics: ['revenue', 'growth-rate']
    },
    {
      id: '2',
      type: 'risk',
      title: 'Operating Expense Increase',
      description: 'Operating expenses have increased 18% QoQ, primarily due to headcount expansion. Monitor burn rate closely.',
      impact: 'medium',
      metrics: ['opex', 'burn-rate']
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'Margin Expansion Potential',
      description: 'Gross margins improved to 62.1%. Consider strategic pricing adjustments to capture additional value.',
      impact: 'medium',
      metrics: ['gross-margin', 'pricing']
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Cash Flow Optimization',
      description: 'Implement automated invoicing to reduce DSO from 45 to 35 days, improving cash flow by $245K.',
      impact: 'high',
      metrics: ['dso', 'cash-flow']
    }
  ]);

  const getReportData = (reportType: string): ReportData => {
    switch (reportType) {
      case 'profit-loss':
        return {
          summaryCards: {
            revenue: { value: '$6,595,000', change: '+15.4%', trend: 'up' },
            grossMargin: { value: '62.1%', change: '+3.2%', trend: 'up' },
            ebitda: { value: '$1,847,500', change: '+22.8%', trend: 'up' },
            netIncome: { value: '$975,000', change: '+28.4%', trend: 'up' }
          },
          chartData: [],
          tableData: [
            { category: 'Revenue', subcategories: [
              { name: 'Product Sales', amount: 5076000, percentage: 77.0 },
              { name: 'Service Revenue', amount: 1124500, percentage: 17.0 },
              { name: 'Other Income', amount: 394500, percentage: 6.0 }
            ]},
            { category: 'Cost of Goods Sold', subcategories: [
              { name: 'Materials & Supplies', amount: -1690400, percentage: 55.0 },
              { name: 'Direct Labor', amount: -913600, percentage: 29.7 },
              { name: 'Manufacturing Overhead', amount: -469000, percentage: 15.3 }
            ]},
            { category: 'Operating Expenses', subcategories: [
              { name: 'Salaries & Benefits', amount: -970400, percentage: 48.0 },
              { name: 'Marketing & Advertising', amount: -313600, percentage: 15.5 },
              { name: 'Rent & Utilities', amount: -249000, percentage: 12.3 }
            ]}
          ],
          insights: [
            'Revenue growth accelerated to 15.4% YoY',
            'Gross margin improved by 3.2 percentage points',
            'Operating leverage driving EBITDA expansion'
          ]
        };
      case 'balance-sheet':
        return {
          summaryCards: {
            revenue: { value: '$2,847,500', change: '+8.3%', trend: 'up' },
            grossMargin: { value: '$1,245,800', change: '+2.1%', trend: 'up' },
            ebitda: { value: '$1,601,700', change: '+12.7%', trend: 'up' },
            netIncome: { value: '2.19', change: '+0.15', trend: 'up' }
          },
          chartData: [],
          tableData: [
            { category: 'Current Assets', subcategories: [
              { name: 'Cash & Cash Equivalents', amount: 485200, percentage: 48.1 },
              { name: 'Accounts Receivable', amount: 324800, percentage: 32.2 },
              { name: 'Inventory', amount: 156300, percentage: 15.5 }
            ]},
            { category: 'Non-Current Assets', subcategories: [
              { name: 'Property, Plant & Equipment', amount: 1245600, percentage: 67.7 },
              { name: 'Intangible Assets', amount: 425800, percentage: 23.2 },
              { name: 'Investments', amount: 167700, percentage: 9.1 }
            ]}
          ],
          insights: [
            'Strong liquidity position with current ratio of 2.19',
            'Asset base growing to support expansion',
            'Healthy balance sheet structure'
          ]
        };
      case 'cash-flow':
        return {
          summaryCards: {
            revenue: { value: '$847,500', change: '+12.5%', trend: 'up' },
            grossMargin: { value: '$623,200', change: '+8.3%', trend: 'up' },
            ebitda: { value: '$224,300', change: '+18.7%', trend: 'up' },
            netIncome: { value: '8.2', change: '+1.2', trend: 'up' }
          },
          chartData: [],
          tableData: [
            { category: 'Operating Activities', subcategories: [
              { name: 'Net Income', amount: 224300, percentage: 71.0 },
              { name: 'Depreciation', amount: 45600, percentage: 14.4 },
              { name: 'Working Capital Changes', amount: 45990, percentage: 14.6 }
            ]},
            { category: 'Investing Activities', subcategories: [
              { name: 'Capital Expenditures', amount: -285400, percentage: 63.3 },
              { name: 'Asset Purchases', amount: -165325, percentage: 36.7 }
            ]}
          ],
          insights: [
            'Strong operating cash flow generation',
            'Heavy investment in growth initiatives',
            'Healthy cash runway of 8.2 months'
          ]
        };
      default:
        return {
          summaryCards: {
            revenue: { value: '$0', change: '0%', trend: 'stable' },
            grossMargin: { value: '0%', change: '0%', trend: 'stable' },
            ebitda: { value: '$0', change: '0%', trend: 'stable' },
            netIncome: { value: '$0', change: '0%', trend: 'stable' }
          },
          chartData: [],
          tableData: [],
          insights: []
        };
    }
  };

  const currentReportData = getReportData(selectedReport);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return ArrowUp;
      case 'down': return ArrowDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#4ADE80';
      case 'down': return '#F87171';
      default: return '#F59E0B';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'opportunity': return Target;
      default: return Info;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend': return '#3AB7BF';
      case 'risk': return '#F87171';
      case 'opportunity': return '#4ADE80';
      default: return '#8B5CF6';
    }
  };

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev =>
      prev.includes(rowId)
        ? prev.filter(id => id !== rowId)
        : [...prev, rowId]
    );
  };

  const handleSaveView = () => {
    const viewName = prompt('Enter a name for this view:');
    if (viewName) {
      const newView = {
        id: Date.now().toString(),
        name: viewName,
        filters: { dateRange, entity: selectedEntity, currency: selectedCurrency, report: selectedReport }
      };
      setSavedViews(prev => [...prev, newView]);
    }
  };

  const renderSummaryCards = () => {
    const cards = [
      { label: 'Revenue', data: currentReportData.summaryCards.revenue, icon: DollarSign },
      { label: 'Gross Margin', data: currentReportData.summaryCards.grossMargin, icon: TrendingUp },
      { label: 'EBITDA', data: currentReportData.summaryCards.ebitda, icon: BarChart3 },
      { label: 'Net Income', data: currentReportData.summaryCards.netIncome, icon: PieChart }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          const TrendIcon = getTrendIcon(card.data.trend);
          const trendColor = getTrendColor(card.data.trend);
          
          return (
            <Card key={index}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">{card.label}</p>
                  <p className="text-2xl font-bold text-[#1E2A38]">{card.data.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendIcon className="w-4 h-4 mr-1" style={{ color: trendColor }} />
                    <span className="text-sm font-medium" style={{ color: trendColor }}>
                      {card.data.change}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-[#3AB7BF]/10 rounded-lg flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-[#3AB7BF]" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderChart = () => (
    <Card title="Performance Trend" className="mb-8">
      <div className="relative h-64">
        <svg className="w-full h-full">
          {/* Revenue trend line */}
          <polyline
            fill="none"
            stroke="#3AB7BF"
            strokeWidth="3"
            points="50,180 150,160 250,140 350,120 450,100 550,80 650,60"
          />
          {/* Data points */}
          {[180, 160, 140, 120, 100, 80, 60].map((y, index) => (
            <circle key={index} cx={50 + index * 100} cy={y} r="4" fill="#3AB7BF" />
          ))}
          
          {/* Forecast line (dashed) */}
          <polyline
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="3"
            strokeDasharray="5,5"
            points="650,60 750,45 850,30"
          />
          {[45, 30].map((y, index) => (
            <circle key={index} cx={750 + index * 100} cy={y} r="4" fill="#8B5CF6" />
          ))}
        </svg>
        
        {/* Chart labels */}
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((month, index) => (
            <span key={index}>{month}</span>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-[#3AB7BF] rounded mr-2"></div>
          <span className="text-sm text-gray-600">Actual</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-0.5 bg-[#8B5CF6] mr-2" style={{ borderTop: '3px dashed #8B5CF6' }}></div>
          <span className="text-sm text-gray-600">Forecast</span>
        </div>
      </div>
    </Card>
  );

  const renderDetailedTable = () => (
    <Card title="Detailed Breakdown" className="mb-8">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Total</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">vs Prior Period</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReportData.tableData.map((row, index) => (
              <React.Fragment key={index}>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleRowExpansion(row.category)}
                      className="flex items-center font-semibold text-[#1E2A38] hover:text-[#3AB7BF] transition-colors"
                    >
                      {expandedRows.includes(row.category) ? (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-2" />
                      )}
                      {row.category}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#1E2A38]">
                    ${Math.abs(row.subcategories.reduce((sum: number, sub: any) => sum + sub.amount, 0)).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {row.subcategories.reduce((sum: number, sub: any) => sum + sub.percentage, 0).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[#4ADE80] font-medium">+12.5%</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                  </td>
                </tr>
                
                {/* Expanded subcategories */}
                {expandedRows.includes(row.category) && row.subcategories.map((sub: any, subIndex: number) => (
                  <tr key={`${index}-${subIndex}`} className="bg-gray-50 border-b border-gray-100">
                    <td className="py-2 px-4 pl-12 text-sm text-gray-700">{sub.name}</td>
                    <td className="py-2 px-4 text-right text-sm font-medium">
                      ${Math.abs(sub.amount).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right text-sm text-gray-600">{sub.percentage}%</td>
                    <td className="py-2 px-4 text-right text-sm text-[#4ADE80]">+8.2%</td>
                    <td className="py-2 px-4"></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Report Selector Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1E2A38] mb-2">Reports</h2>
            <p className="text-sm text-gray-600">View, export, and analyze your financial performance</p>
          </div>

          {/* Report Types */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {reportTypes.map(report => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                    selectedReport === report.id
                      ? 'bg-[#3AB7BF]/10 border border-[#3AB7BF]/20 text-[#3AB7BF]'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <report.icon className="w-5 h-5 mr-3" />
                    <span className="font-semibold">{report.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{report.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Views */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="font-semibold text-[#1E2A38] mb-3">Saved Views</h3>
            <div className="space-y-2">
              {savedViews.map(view => (
                <button
                  key={view.id}
                  className="w-full p-2 text-left hover:bg-gray-50 rounded text-sm text-gray-700"
                >
                  <Save className="w-3 h-3 mr-2 inline" />
                  {view.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Bar */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#1E2A38]">
                  {reportTypes.find(r => r.id === selectedReport)?.name || 'Reports'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {reportTypes.find(r => r.id === selectedReport)?.description}
                </p>
              </div>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
                
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  {entities.map(entity => (
                    <option key={entity.value} value={entity.value}>{entity.label}</option>
                  ))}
                </select>
                
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>{currency.label}</option>
                  ))}
                </select>
                
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                
                <Button variant="outline" onClick={handleSaveView}>
                  <Save className="w-4 h-4 mr-2" />
                  Save View
                </Button>
                
                <Button variant="outline" onClick={() => setShowShareModal(true)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                <Button variant="primary">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Main Report Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Report Display Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderSummaryCards()}
              {renderChart()}
              {renderDetailedTable()}
            </div>

            {/* AI Insights Panel */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#1E2A38] flex items-center">
                    <Brain className="w-4 h-4 mr-2 text-[#8B5CF6]" />
                    AI Insights
                  </h3>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Notable trends, risks & recommendations</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiInsights.map(insight => {
                  const InsightIcon = getInsightIcon(insight.type);
                  const insightColor = getInsightColor(insight.type);
                  
                  return (
                    <div key={insight.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
                      <div className="flex items-start mb-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                          style={{ backgroundColor: `${insightColor}20` }}
                        >
                          <InsightIcon className="w-4 h-4" style={{ color: insightColor }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#1E2A38] text-sm">{insight.title}</h4>
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
                      <p className="text-sm text-gray-700 leading-relaxed">{insight.description}</p>
                      
                      {insight.metrics.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {insight.metrics.map((metric, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {metric}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-[#1E2A38] mb-3 text-sm">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Zap className="w-3 h-3 mr-2" />
                      Generate Forecast
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Target className="w-3 h-3 mr-2" />
                      Set Targets
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Bell className="w-3 h-3 mr-2" />
                      Create Alert
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Share Report</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share via Email</label>
                <input
                  type="email"
                  placeholder="Enter email addresses (comma separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  placeholder="Add a message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Generate shareable link</span>
                <Button variant="outline" size="sm">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <Button variant="primary">
                <Mail className="w-4 h-4 mr-2" />
                Send Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Schedule Report</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <input
                  type="email"
                  placeholder="Enter email addresses"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <Button variant="primary">
                <Clock className="w-4 h-4 mr-2" />
                Schedule Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;