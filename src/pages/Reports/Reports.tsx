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
  X,
  Plus
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface ReportItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  lastGenerated?: string;
  size?: string;
}

interface ReportCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  reports: ReportItem[];
  expanded: boolean;
}

interface ExportSettings {
  format: 'pdf' | 'excel' | 'csv';
  showAccountNumbers: boolean;
  showDecimals: boolean;
  collapseSubaccounts: boolean;
  includeAIInsights: boolean;
  dateRange: string;
  entity: string;
}

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['business-overview']);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [dateRange, setDateRange] = useState('current-month');
  const [accountingMethod, setAccountingMethod] = useState('accrual');
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'pdf',
    showAccountNumbers: true,
    showDecimals: true,
    collapseSubaccounts: false,
    includeAIInsights: true,
    dateRange: 'current-month',
    entity: 'all'
  });

  const [reportCategories, setReportCategories] = useState<ReportCategory[]>([
    {
      id: 'business-overview',
      name: 'Business Overview',
      icon: BarChart3,
      expanded: true,
      reports: [
        {
          id: 'profit-loss',
          name: 'Profit & Loss',
          description: 'Income statement showing revenue, expenses, and net income',
          icon: TrendingUp,
          category: 'business-overview',
          lastGenerated: '2 hours ago',
          size: '2.4 MB'
        },
        {
          id: 'balance-sheet',
          name: 'Balance Sheet',
          description: 'Assets, liabilities, and equity at a point in time',
          icon: BarChart3,
          category: 'business-overview',
          lastGenerated: '2 hours ago',
          size: '1.8 MB'
        },
        {
          id: 'cash-flow',
          name: 'Cash Flow Statement',
          description: 'Cash inflows and outflows from operations, investing, and financing',
          icon: DollarSign,
          category: 'business-overview',
          lastGenerated: '3 hours ago',
          size: '1.5 MB'
        }
      ]
    },
    {
      id: 'sales',
      name: 'Sales',
      icon: TrendingUp,
      expanded: false,
      reports: [
        {
          id: 'revenue-by-product',
          name: 'Revenue by Product',
          description: 'Revenue breakdown by product lines and services',
          icon: PieChart,
          category: 'sales',
          lastGenerated: '4 hours ago',
          size: '1.2 MB'
        },
        {
          id: 'ar-aging',
          name: 'Accounts Receivable Aging',
          description: 'Outstanding customer invoices by age',
          icon: Clock,
          category: 'sales',
          lastGenerated: '6 hours ago',
          size: '890 KB'
        },
        {
          id: 'customer-analysis',
          name: 'Customer Analysis',
          description: 'Customer profitability and lifetime value analysis',
          icon: Users,
          category: 'sales',
          lastGenerated: '1 day ago',
          size: '1.7 MB'
        }
      ]
    },
    {
      id: 'expenses',
      name: 'Expenses',
      icon: DollarSign,
      expanded: false,
      reports: [
        {
          id: 'ap-aging',
          name: 'Accounts Payable Aging',
          description: 'Outstanding vendor bills by age',
          icon: Clock,
          category: 'expenses',
          lastGenerated: '5 hours ago',
          size: '750 KB'
        },
        {
          id: 'expenses-by-vendor',
          name: 'Expenses by Vendor',
          description: 'Expense breakdown by vendor and category',
          icon: Building,
          category: 'expenses',
          lastGenerated: '8 hours ago',
          size: '1.1 MB'
        },
        {
          id: 'expense-trends',
          name: 'Expense Trends',
          description: 'Monthly expense trends and variance analysis',
          icon: BarChart3,
          category: 'expenses',
          lastGenerated: '1 day ago',
          size: '1.3 MB'
        }
      ]
    },
    {
      id: 'forecasting',
      name: 'Forecasting',
      icon: Target,
      expanded: false,
      reports: [
        {
          id: 'forecast-vs-actual',
          name: 'Forecast vs. Actual',
          description: 'Budget variance analysis and performance tracking',
          icon: Target,
          category: 'forecasting',
          lastGenerated: '3 hours ago',
          size: '2.1 MB'
        },
        {
          id: 'scenario-analysis',
          name: 'Scenario Analysis',
          description: 'Multiple scenario comparisons and projections',
          icon: BarChart3,
          category: 'forecasting',
          lastGenerated: '1 day ago',
          size: '1.9 MB'
        },
        {
          id: 'cash-flow-forecast',
          name: 'Cash Flow Forecast',
          description: '13-week rolling cash flow projections',
          icon: DollarSign,
          category: 'forecasting',
          lastGenerated: '6 hours ago',
          size: '1.4 MB'
        }
      ]
    },
    {
      id: 'kpis-ratios',
      name: 'KPIs & Ratios',
      icon: PieChart,
      expanded: false,
      reports: [
        {
          id: 'financial-ratios',
          name: 'Financial Ratios',
          description: 'Liquidity, profitability, and efficiency ratios',
          icon: PieChart,
          category: 'kpis-ratios',
          lastGenerated: '4 hours ago',
          size: '1.6 MB'
        },
        {
          id: 'customer-metrics',
          name: 'Customer Metrics',
          description: 'CAC, LTV, ARPU, churn rate, and retention analysis',
          icon: Users,
          category: 'kpis-ratios',
          lastGenerated: '2 hours ago',
          size: '1.8 MB'
        },
        {
          id: 'operational-kpis',
          name: 'Operational KPIs',
          description: 'Revenue per employee, margin trends, and efficiency metrics',
          icon: BarChart3,
          category: 'kpis-ratios',
          lastGenerated: '5 hours ago',
          size: '1.3 MB'
        }
      ]
    }
  ]);

  const toggleCategory = (categoryId: string) => {
    setReportCategories(prev => prev.map(category =>
      category.id === categoryId
        ? { ...category, expanded: !category.expanded }
        : category
    ));
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleReportSelect = (report: ReportItem) => {
    setSelectedReport(report);
  };

  const handleExport = () => {
    console.log('Exporting report with settings:', exportSettings);
    // Simulate export process
    setTimeout(() => {
      alert(`Report exported as ${exportSettings.format.toUpperCase()}`);
      setShowExportModal(false);
    }, 1000);
  };

  const renderReportContent = () => {
    if (!selectedReport) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">Select a Report</h3>
            <p className="text-gray-400">Choose a report from the sidebar to view its content</p>
          </div>
        </div>
      );
    }

    // Mock data based on selected report
    const getMockData = () => {
      switch (selectedReport.id) {
        case 'profit-loss':
          return {
            summaryCards: [
              { label: 'Total Revenue', value: '$6,595,000', change: '+15.4%', trend: 'up' },
              { label: 'Gross Margin', value: '62.1%', change: '+3.2%', trend: 'up' },
              { label: 'EBITDA', value: '$1,847,500', change: '+22.8%', trend: 'up' },
              { label: 'Net Income', value: '$975,000', change: '+28.4%', trend: 'up' }
            ],
            tableData: [
              { category: 'Revenue', amount: 6595000, variance: 15.4, subcategories: [
                { name: 'Product Sales', amount: 5076000, variance: 12.8 },
                { name: 'Service Revenue', amount: 1124500, variance: 23.1 },
                { name: 'Other Income', amount: 394500, variance: 8.7 }
              ]},
              { category: 'Cost of Goods Sold', amount: -3073000, variance: 8.2, subcategories: [
                { name: 'Materials', amount: -1690400, variance: 6.5 },
                { name: 'Labor', amount: -913600, variance: 12.3 },
                { name: 'Overhead', amount: -469000, variance: 4.8 }
              ]},
              { category: 'Operating Expenses', amount: -2021400, variance: 11.7, subcategories: [
                { name: 'Salaries & Benefits', amount: -970400, variance: 8.9 },
                { name: 'Marketing', amount: -313600, variance: 23.5 },
                { name: 'Rent & Utilities', amount: -249000, variance: 3.2 }
              ]}
            ]
          };
        case 'balance-sheet':
          return {
            summaryCards: [
              { label: 'Total Assets', value: '$2,847,500', change: '+8.3%', trend: 'up' },
              { label: 'Total Liabilities', value: '$1,245,800', change: '+2.1%', trend: 'up' },
              { label: 'Shareholders Equity', value: '$1,601,700', change: '+12.7%', trend: 'up' },
              { label: 'Current Ratio', value: '2.19', change: '+0.15', trend: 'up' }
            ],
            tableData: [
              { category: 'Current Assets', amount: 1008400, variance: 12.5, subcategories: [
                { name: 'Cash & Equivalents', amount: 485200, variance: 18.3 },
                { name: 'Accounts Receivable', amount: 324800, variance: 8.7 },
                { name: 'Inventory', amount: 156300, variance: 5.2 }
              ]},
              { category: 'Non-Current Assets', amount: 1839100, variance: 6.8, subcategories: [
                { name: 'Property & Equipment', amount: 1245600, variance: 4.2 },
                { name: 'Intangible Assets', amount: 425800, variance: 12.8 },
                { name: 'Investments', amount: 167700, variance: 8.9 }
              ]}
            ]
          };
        default:
          return {
            summaryCards: [
              { label: 'Key Metric 1', value: '$0', change: '0%', trend: 'stable' },
              { label: 'Key Metric 2', value: '$0', change: '0%', trend: 'stable' },
              { label: 'Key Metric 3', value: '$0', change: '0%', trend: 'stable' },
              { label: 'Key Metric 4', value: '$0', change: '0%', trend: 'stable' }
            ],
            tableData: []
          };
      }
    };

    const reportData = getMockData();

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportData.summaryCards.map((card, index) => {
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
            
            const TrendIcon = getTrendIcon(card.trend);
            const trendColor = getTrendColor(card.trend);
            
            return (
              <Card key={index}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{card.label}</p>
                    <p className="text-2xl font-bold text-[#1E2A38]">{card.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendIcon className="w-4 h-4 mr-1" style={{ color: trendColor }} />
                      <span className="text-sm font-medium" style={{ color: trendColor }}>
                        {card.change}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Interactive Chart */}
        <Card title="Performance Trend">
          <div className="relative h-64">
            <svg className="w-full h-full">
              {/* Actual data line */}
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

        {/* Detailed Data Table */}
        <Card title="Detailed Breakdown">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Account</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Total</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Variance</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportData.tableData.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <button
                          className="flex items-center font-semibold text-[#1E2A38] hover:text-[#3AB7BF] transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 mr-2" />
                          {row.category}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#1E2A38]">
                        ${Math.abs(row.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {((Math.abs(row.amount) / 6595000) * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-medium ${row.variance > 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                          {row.variance > 0 ? '+' : ''}{row.variance.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Sidebar - Report Categories */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#1E2A38] mb-2">Reports</h2>
            <p className="text-sm text-gray-600">View, export, and analyze your financial performance</p>
          </div>

          {/* Report Categories */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {reportCategories.map(category => (
                <div key={category.id} className="mb-4">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <category.icon className="w-5 h-5 text-[#3AB7BF] mr-3" />
                      <span className="font-semibold text-[#1E2A38]">{category.name}</span>
                    </div>
                    {category.expanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  {category.expanded && (
                    <div className="ml-8 mt-2 space-y-1">
                      {category.reports.map(report => (
                        <button
                          key={report.id}
                          onClick={() => handleReportSelect(report)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedReport?.id === report.id
                              ? 'bg-[#3AB7BF]/10 border border-[#3AB7BF]/20 text-[#3AB7BF]'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start">
                            <report.icon className="w-4 h-4 mr-3 mt-0.5 text-gray-400" />
                            <div className="flex-1">
                              <h4 className="font-medium text-[#1E2A38] text-sm">{report.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{report.description}</p>
                              {report.lastGenerated && (
                                <p className="text-xs text-gray-500 mt-1">Updated: {report.lastGenerated}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
                  {selectedReport?.name || 'Reports'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {selectedReport?.description || 'Select a report to view financial data and insights'}
                </p>
              </div>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="current-month">Current Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="current-quarter">Current Quarter</option>
                  <option value="last-quarter">Last Quarter</option>
                  <option value="current-year">Current Year</option>
                  <option value="last-year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
                
                <select
                  value={accountingMethod}
                  onChange={(e) => setAccountingMethod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="accrual">Accrual</option>
                  <option value="cash">Cash</option>
                </select>
                
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="all">All Entities</option>
                  <option value="parent">Parent Company</option>
                  <option value="subsidiary-1">Subsidiary 1</option>
                  <option value="subsidiary-2">Subsidiary 2</option>
                </select>
                
                <Button variant="outline" onClick={() => setShowExportModal(true)}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                
                <Button variant="outline" onClick={() => setShowScheduleModal(true)}>
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
                
                <Button variant="primary">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Main Report Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Report Display Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderReportContent()}
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
                {[
                  {
                    type: 'opportunity',
                    title: 'Revenue Growth Acceleration',
                    description: 'Revenue growth has accelerated to 15.4% YoY, outpacing industry average of 12.1%. This trend is driven by strong performance in enterprise sales.',
                    impact: 'high',
                    metrics: ['revenue', 'growth-rate']
                  },
                  {
                    type: 'risk',
                    title: 'Operating Expense Increase',
                    description: 'Operating expenses have increased 18% QoQ, primarily due to headcount expansion. Monitor burn rate closely.',
                    impact: 'medium',
                    metrics: ['opex', 'burn-rate']
                  },
                  {
                    type: 'recommendation',
                    title: 'Margin Expansion Potential',
                    description: 'Gross margins improved to 62.1%. Consider strategic pricing adjustments to capture additional value.',
                    impact: 'medium',
                    metrics: ['gross-margin', 'pricing']
                  }
                ].map((insight, index) => {
                  const getInsightIcon = (type: string) => {
                    switch (type) {
                      case 'opportunity': return TrendingUp;
                      case 'risk': return AlertTriangle;
                      default: return Info;
                    }
                  };
                  
                  const getInsightColor = (type: string) => {
                    switch (type) {
                      case 'opportunity': return '#4ADE80';
                      case 'risk': return '#F87171';
                      default: return '#3AB7BF';
                    }
                  };
                  
                  const InsightIcon = getInsightIcon(insight.type);
                  const insightColor = getInsightColor(insight.type);
                  
                  return (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
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
                            {insight.metrics.map((metric, metricIndex) => (
                              <span key={metricIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
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
                      <AlertTriangle className="w-3 h-3 mr-2" />
                      Create Alert
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Export Report</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Export Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'pdf', label: 'PDF', icon: FileText },
                    { value: 'excel', label: 'Excel', icon: BarChart3 },
                    { value: 'csv', label: 'CSV', icon: FileText }
                  ].map(format => (
                    <button
                      key={format.value}
                      onClick={() => setExportSettings({...exportSettings, format: format.value as any})}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        exportSettings.format === format.value
                          ? 'border-[#3AB7BF] bg-[#3AB7BF]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <format.icon className="w-6 h-6 mx-auto mb-2 text-[#3AB7BF]" />
                      <p className="font-medium text-[#1E2A38]">{format.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Export Settings</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Show Account Numbers</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={exportSettings.showAccountNumbers}
                        onChange={(e) => setExportSettings({...exportSettings, showAccountNumbers: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Show Decimals</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={exportSettings.showDecimals}
                        onChange={(e) => setExportSettings({...exportSettings, showDecimals: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Collapse Subaccounts</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={exportSettings.collapseSubaccounts}
                        onChange={(e) => setExportSettings({...exportSettings, collapseSubaccounts: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Include AI Insights</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={exportSettings.includeAIInsights}
                        onChange={(e) => setExportSettings({...exportSettings, includeAIInsights: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
                    </label>
                  </div>
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
              <Button variant="primary" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Now
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