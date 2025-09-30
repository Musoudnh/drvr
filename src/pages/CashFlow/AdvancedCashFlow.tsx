import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Calendar, Clock, Target, BarChart3, PieChart, Activity, RefreshCw, Download, Filter, Settings, ArrowRight, Info, Zap, Brain, FileText } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { CashFlowService } from '../../services/cashFlowService';
import type { CashFlowForecast, ARaging, APTiming, WorkingCapitalSnapshot } from '../../types/financial';

type TabType = 'forecasting' | 'ar-aging' | 'ap-timing' | 'working-capital' | 'runway' | 'seasonal' | 'sensitivity';

const AdvancedCashFlow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('forecasting');
  const [isLoading, setIsLoading] = useState(false);
  const [forecasts, setForecasts] = useState<CashFlowForecast[]>([]);
  const [arAging, setArAging] = useState<ARaging[]>([]);
  const [apTiming, setApTiming] = useState<APTiming[]>([]);
  const [workingCapital, setWorkingCapital] = useState<WorkingCapitalSnapshot | null>(null);
  const [cashRunway, setCashRunway] = useState<{
    runway_days: number;
    burn_rate: number;
    estimated_depletion_date: string;
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const organizationId = 'org-123';

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'forecasting':
          const forecastData = await CashFlowService.getCashFlowForecasts(
            organizationId,
            dateRange.start,
            dateRange.end
          );
          setForecasts(forecastData);
          break;
        case 'ar-aging':
          const arData = await CashFlowService.getARAgingReport(organizationId);
          setArAging(arData);
          break;
        case 'ap-timing':
          const apData = await CashFlowService.getAPTimingOptimization(organizationId);
          setApTiming(apData);
          break;
        case 'working-capital':
          const wcData = await CashFlowService.getLatestWorkingCapitalSnapshot(organizationId);
          setWorkingCapital(wcData);
          break;
        case 'runway':
          const runwayData = await CashFlowService.calculateCashRunway(organizationId);
          setCashRunway(runwayData);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'forecasting' as TabType, label: 'ML Forecasting', icon: Brain },
    { id: 'ar-aging' as TabType, label: 'AR Aging', icon: Clock },
    { id: 'ap-timing' as TabType, label: 'AP Timing', icon: Calendar },
    { id: 'working-capital' as TabType, label: 'Working Capital', icon: Activity },
    { id: 'runway' as TabType, label: 'Cash Runway', icon: Target },
    { id: 'seasonal' as TabType, label: 'Seasonal Patterns', icon: BarChart3 },
    { id: 'sensitivity' as TabType, label: 'Sensitivity Analysis', icon: Zap }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'forecasting':
        return renderForecastingTab();
      case 'ar-aging':
        return renderARAgingTab();
      case 'ap-timing':
        return renderAPTimingTab();
      case 'working-capital':
        return renderWorkingCapitalTab();
      case 'runway':
        return renderRunwayTab();
      case 'seasonal':
        return renderSeasonalTab();
      case 'sensitivity':
        return renderSensitivityTab();
      default:
        return null;
    }
  };

  const renderForecastingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Projected Inflow (Next 30 Days)</p>
              <h3 className="text-2xl font-bold text-[#4ADE80]">$1.2M</h3>
            </div>
            <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#4ADE80]" />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="text-[#4ADE80] font-medium">+12.5%</span> vs last month
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Projected Outflow (Next 30 Days)</p>
              <h3 className="text-2xl font-bold text-[#F87171]">$850K</h3>
            </div>
            <div className="w-12 h-12 bg-[#F87171]/10 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-[#F87171]" />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="text-[#F87171] font-medium">+8.3%</span> vs last month
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Net Cash Flow (Next 30 Days)</p>
              <h3 className="text-2xl font-bold text-[#3AB7BF]">$350K</h3>
            </div>
            <div className="w-12 h-12 bg-[#3AB7BF]/10 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#3AB7BF]" />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            ML Confidence: <span className="text-[#3AB7BF] font-medium">87%</span>
          </div>
        </Card>
      </div>

      <Card title="Cash Flow Forecast - 12 Month Projection">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-[#8B5CF6]" />
            <span className="text-sm text-gray-600">Machine Learning Model v2.3</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure Model
            </Button>
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="relative h-80 bg-gray-50 rounded-lg p-6">
          <svg className="w-full h-full">
            <path
              d="M 50 200 L 120 180 L 190 160 L 260 150 L 330 140 L 400 135 L 470 130 L 540 128 L 610 125 L 680 123 L 750 120"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="3"
            />
            <path
              d="M 50 200 L 120 210 L 190 220 L 260 225 L 330 235 L 400 240 L 470 250 L 540 255 L 610 260 L 680 265 L 750 270"
              fill="none"
              stroke="#F87171"
              strokeWidth="3"
            />
            <path
              d="M 50 200 Q 400 160 750 140"
              fill="rgba(74, 222, 128, 0.1)"
              stroke="none"
            />
            <path
              d="M 50 200 Q 400 240 750 280"
              fill="rgba(248, 113, 113, 0.1)"
              stroke="none"
            />
          </svg>

          <div className="absolute bottom-4 left-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#4ADE80] mr-2"></div>
              <span className="text-gray-700">Inflows</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#F87171] mr-2"></div>
              <span className="text-gray-700">Outflows</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#D1D5DB] mr-2"></div>
              <span className="text-gray-700">Confidence Band</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-[#F59E0B] mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-1">Key Insight</h4>
                <p className="text-sm text-gray-700">
                  Cash inflows are projected to increase by 18% in Q2 due to seasonal revenue patterns detected by the ML model.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#3AB7BF]/10 border border-[#3AB7BF]/20 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-[#3AB7BF] mr-3 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-1">Recommendation</h4>
                <p className="text-sm text-gray-700">
                  Consider negotiating extended payment terms with vendors to optimize cash position during low-flow months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Payment Terms Scenario Modeling">
        <p className="text-gray-600 mb-4">Compare different payment scenarios to optimize cash flow</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Net 30', impact: '+$45K', color: '#4ADE80' },
            { name: 'Net 45', impact: '+$72K', color: '#3AB7BF' },
            { name: 'Net 60', impact: '+$95K', color: '#8B5CF6' }
          ].map((scenario) => (
            <div key={scenario.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <h4 className="font-semibold text-[#1E2A38] mb-2">{scenario.name}</h4>
              <p className="text-2xl font-bold mb-1" style={{ color: scenario.color }}>
                {scenario.impact}
              </p>
              <p className="text-sm text-gray-600">Cash position improvement</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Apply Scenario
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderARAgingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { bucket: 'Current', amount: '$485K', count: 42, priority: 'low', color: '#4ADE80' },
          { bucket: '1-30 Days', amount: '$128K', count: 18, priority: 'medium', color: '#F59E0B' },
          { bucket: '31-60 Days', amount: '$67K', count: 12, priority: 'high', color: '#F87171' },
          { bucket: '60+ Days', amount: '$43K', count: 8, priority: 'critical', color: '#EF4444' }
        ].map((bucket) => (
          <Card key={bucket.bucket}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-600">{bucket.bucket}</h4>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bucket.color }}></div>
            </div>
            <p className="text-2xl font-bold text-[#1E2A38] mb-1">{bucket.amount}</p>
            <p className="text-sm text-gray-600">{bucket.count} invoices</p>
          </Card>
        ))}
      </div>

      <Card title="Accounts Receivable Aging Analysis">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Outstanding</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collection Probability</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { customer: 'Acme Corp', invoice: 'INV-1234', amount: '$25,000', days: 67, priority: 'high', probability: 85 },
                { customer: 'TechStart Inc', invoice: 'INV-1235', amount: '$18,500', days: 45, priority: 'medium', probability: 92 },
                { customer: 'Global Solutions', invoice: 'INV-1236', amount: '$32,000', days: 28, priority: 'medium', probability: 95 }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-[#1E2A38]">{row.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.invoice}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#1E2A38]">{row.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.days} days</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      row.priority === 'high' ? 'bg-[#F87171]/10 text-[#F87171]' :
                      row.priority === 'medium' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      'bg-[#4ADE80]/10 text-[#4ADE80]'
                    }`}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-[#4ADE80] h-2 rounded-full"
                          style={{ width: `${row.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{row.probability}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Collection Recommendations">
        <div className="space-y-4">
          {[
            {
              customer: 'Acme Corp',
              action: 'Send follow-up email',
              impact: 'High probability of payment within 7 days',
              urgency: 'high'
            },
            {
              customer: 'TechStart Inc',
              action: 'Schedule phone call',
              impact: 'May require payment plan discussion',
              urgency: 'medium'
            }
          ].map((rec, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-semibold text-[#1E2A38] mb-1">{rec.customer}</h4>
                <p className="text-sm text-gray-700 mb-1">{rec.action}</p>
                <p className="text-xs text-gray-500">{rec.impact}</p>
              </div>
              <Button variant="primary" size="sm">
                <ArrowRight className="w-4 h-4 mr-2" />
                Take Action
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderAPTimingTab = () => (
    <div className="space-y-6">
      <Card>
        <div className="bg-gradient-to-r from-[#3AB7BF]/10 to-[#4ADE80]/10 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#1E2A38] mb-2">Optimal Payment Strategy</h3>
          <p className="text-gray-700 mb-4">
            Our AI has analyzed your payment obligations and cash position to recommend the optimal payment schedule.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Potential Cash Savings</p>
              <p className="text-2xl font-bold text-[#4ADE80]">$12,450</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Early Payment Discounts</p>
              <p className="text-2xl font-bold text-[#3AB7BF]">$3,200</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Extended Terms Value</p>
              <p className="text-2xl font-bold text-[#8B5CF6]">$9,250</p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Upcoming Payments - Optimized Schedule">
        <div className="space-y-3">
          {[
            { vendor: 'Office Supplies Co', invoice: 'INV-5432', amount: '$5,200', due: '2024-02-15', optimal: '2024-02-14', discount: '$52', score: 95 },
            { vendor: 'Cloud Services Inc', invoice: 'INV-5433', amount: '$12,500', due: '2024-02-18', optimal: '2024-02-18', discount: '$0', score: 88 },
            { vendor: 'Marketing Agency', invoice: 'INV-5434', amount: '$8,900', due: '2024-02-20', optimal: '2024-02-28', discount: '$0', score: 82 }
          ].map((payment, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1E2A38]">{payment.vendor}</h4>
                  <p className="text-sm text-gray-600">{payment.invoice}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#1E2A38]">{payment.amount}</p>
                  {payment.discount !== '$0' && (
                    <p className="text-sm text-[#4ADE80]">Save {payment.discount}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-700">{payment.due}</p>
                </div>
                <div>
                  <p className="text-gray-500">Optimal Date</p>
                  <p className="font-medium text-[#3AB7BF]">{payment.optimal}</p>
                </div>
                <div>
                  <p className="text-gray-500">Impact Score</p>
                  <p className="font-medium text-gray-700">{payment.score}/100</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  {payment.discount !== '$0'
                    ? 'Early payment discount available'
                    : 'Maximize cash position with delayed payment'}
                </p>
                <Button variant="outline" size="sm">
                  Schedule Payment
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderWorkingCapitalTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Working Capital', value: '$1.8M', change: '+8.5%', color: '#3AB7BF' },
          { label: 'Current Ratio', value: '2.4', change: '+0.3', color: '#4ADE80' },
          { label: 'Quick Ratio', value: '1.8', change: '+0.2', color: '#8B5CF6' },
          { label: 'Cash Conversion Cycle', value: '32 days', change: '-5 days', color: '#F59E0B' }
        ].map((metric) => (
          <Card key={metric.label}>
            <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
            <p className="text-2xl font-bold text-[#1E2A38] mb-1">{metric.value}</p>
            <p className="text-sm" style={{ color: metric.color }}>
              {metric.change} vs last quarter
            </p>
          </Card>
        ))}
      </div>

      <Card title="Working Capital Optimization Score">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="16"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                fill="none"
                stroke="#4ADE80"
                strokeWidth="16"
                strokeDasharray={`${(85 / 100) * 502.4} 502.4`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold text-[#4ADE80]">85</p>
              <p className="text-sm text-gray-600">out of 100</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-lg p-4">
            <h4 className="font-semibold text-[#1E2A38] mb-2">Strengths</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-[#4ADE80] mr-2">✓</span>
                Strong current ratio above industry average
              </li>
              <li className="flex items-start">
                <span className="text-[#4ADE80] mr-2">✓</span>
                Efficient cash conversion cycle
              </li>
            </ul>
          </div>

          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg p-4">
            <h4 className="font-semibold text-[#1E2A38] mb-2">Opportunities</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-[#F59E0B] mr-2">•</span>
                Reduce DSO by 5 days to free up $120K
              </li>
              <li className="flex items-start">
                <span className="text-[#F59E0B] mr-2">•</span>
                Extend DPO by 7 days to improve cash position
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderRunwayTab = () => (
    <div className="space-y-6">
      <Card>
        <div className="bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-lg p-8 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-2">Current Cash Runway</p>
              <h2 className="text-5xl font-bold mb-2">18 months</h2>
              <p className="text-white/90">Estimated depletion: August 2025</p>
            </div>
            <Target className="w-24 h-24 text-white/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Monthly Burn Rate</p>
            <p className="text-2xl font-bold text-[#F87171]">$125K</p>
            <p className="text-sm text-gray-600 mt-1">Average over last 6 months</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Current Cash Balance</p>
            <p className="text-2xl font-bold text-[#4ADE80]">$2.25M</p>
            <p className="text-sm text-gray-600 mt-1">As of today</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Burn Rate Trend</p>
            <p className="text-2xl font-bold text-[#3AB7BF]">Decreasing</p>
            <p className="text-sm text-gray-600 mt-1">-8% vs previous period</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-[#1E2A38] mb-4">Runway Projection</h4>
          <div className="relative h-64">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="runwayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#F87171" />
                </linearGradient>
              </defs>
              <path
                d="M 50 200 L 150 150 L 250 120 L 350 100 L 450 85 L 550 75 L 650 70 L 750 68"
                fill="none"
                stroke="url(#runwayGradient)"
                strokeWidth="4"
              />
              <line x1="50" y1="210" x2="750" y2="210" stroke="#E5E7EB" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-12">
              <span>Today</span>
              <span>6mo</span>
              <span>12mo</span>
              <span>18mo</span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Burn Rate Analysis by Category">
        <div className="space-y-4">
          {[
            { category: 'Payroll & Benefits', amount: '$68,000', percent: 54, color: '#3AB7BF' },
            { category: 'Technology & Software', amount: '$22,500', percent: 18, color: '#8B5CF6' },
            { category: 'Marketing & Sales', amount: '$18,750', percent: 15, color: '#F59E0B' },
            { category: 'Operations', amount: '$15,750', percent: 13, color: '#F87171' }
          ].map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.category}</span>
                <span className="text-sm font-bold text-[#1E2A38]">{item.amount}/mo ({item.percent}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSeasonalTab = () => (
    <Card title="Seasonal Pattern Detection">
      <p className="text-gray-600 mb-6">
        AI-detected seasonal patterns in your business based on 3 years of historical data
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-[#1E2A38] mb-4">Revenue Seasonality</h4>
          <div className="space-y-3">
            {[
              { month: 'Q1', factor: 0.85, impact: 'Below Average' },
              { month: 'Q2', factor: 1.15, impact: 'Above Average' },
              { month: 'Q3', factor: 1.05, impact: 'Slightly Above' },
              { month: 'Q4', factor: 0.95, impact: 'Slightly Below' }
            ].map((item) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{item.impact}</span>
                  <span className={`text-sm font-bold ${item.factor > 1 ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    {(item.factor * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-[#1E2A38] mb-4">Expense Seasonality</h4>
          <div className="space-y-3">
            {[
              { month: 'Q1', factor: 1.10, impact: 'Above Average' },
              { month: 'Q2', factor: 0.95, impact: 'Below Average' },
              { month: 'Q3', factor: 0.90, impact: 'Below Average' },
              { month: 'Q4', factor: 1.05, impact: 'Slightly Above' }
            ].map((item) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.month}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{item.impact}</span>
                  <span className={`text-sm font-bold ${item.factor > 1 ? 'text-[#F87171]' : 'text-[#4ADE80]'}`}>
                    {(item.factor * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-[#3AB7BF]/10 border border-[#3AB7BF]/20 rounded-lg p-4">
        <h4 className="font-semibold text-[#1E2A38] mb-2">Adjustment Recommendations</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-[#3AB7BF] mr-2">•</span>
            Build cash reserves during Q2 high-revenue period to cover Q1 shortfalls
          </li>
          <li className="flex items-start">
            <span className="text-[#3AB7BF] mr-2">•</span>
            Plan major capital expenditures for Q3 when both revenue and expenses are moderate
          </li>
          <li className="flex items-start">
            <span className="text-[#3AB7BF] mr-2">•</span>
            Consider seasonal pricing adjustments to smooth revenue throughout the year
          </li>
        </ul>
      </div>
    </Card>
  );

  const renderSensitivityTab = () => (
    <Card title="Cash Flow Sensitivity Analysis">
      <p className="text-gray-600 mb-6">
        Understand how changes in key variables impact your cash position
      </p>

      <div className="space-y-6">
        {[
          {
            variable: 'Payment Terms Extension',
            description: 'Impact of extending customer payment terms from Net 30 to Net 45',
            scenarios: [
              { change: '+15 days', impact: '-$85K', color: '#F87171' },
              { change: '+30 days', impact: '-$170K', color: '#EF4444' },
              { change: '+45 days', impact: '-$255K', color: '#DC2626' }
            ]
          },
          {
            variable: 'Revenue Growth Rate',
            description: 'Cash flow impact of different revenue growth scenarios',
            scenarios: [
              { change: '+5%', impact: '+$62K', color: '#4ADE80' },
              { change: '+10%', impact: '+$125K', color: '#22C55E' },
              { change: '+15%', impact: '+$187K', color: '#16A34A' }
            ]
          },
          {
            variable: 'Operating Expense Changes',
            description: 'Impact of cost reduction or increase initiatives',
            scenarios: [
              { change: '-10%', impact: '+$105K', color: '#4ADE80' },
              { change: '-5%', impact: '+$52K', color: '#22C55E' },
              { change: '+5%', impact: '-$52K', color: '#F87171' }
            ]
          }
        ].map((analysis) => (
          <div key={analysis.variable} className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-[#1E2A38] mb-2">{analysis.variable}</h4>
            <p className="text-sm text-gray-600 mb-4">{analysis.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.scenarios.map((scenario, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">{scenario.change}</p>
                  <p className="text-2xl font-bold" style={{ color: scenario.color }}>
                    {scenario.impact}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Cash impact (monthly)</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-lg p-4">
        <div className="flex items-start">
          <Brain className="w-5 h-5 text-[#8B5CF6] mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[#1E2A38] mb-2">AI Recommendation</h4>
            <p className="text-sm text-gray-700">
              Based on sensitivity analysis, your cash flow is most vulnerable to changes in payment terms.
              Consider implementing automated collection reminders to reduce DSO by 5 days, which would improve cash position by approximately $42K monthly.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[#1E2A38]">Advanced Cash Flow Management</h2>
          <p className="text-gray-600 mt-2">AI-powered cash flow forecasting and optimization</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#3AB7BF] text-[#3AB7BF]'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-[#3AB7BF] animate-spin" />
        </div>
      ) : (
        renderTabContent()
      )}
    </div>
  );
};

export default AdvancedCashFlow;
