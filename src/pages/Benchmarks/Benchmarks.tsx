import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, Building, Users, DollarSign, Percent, Award, AlertTriangle, CheckCircle, Info, Eye, Filter, Download, RefreshCw, Settings } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface BenchmarkData {
  metric: string;
  yourValue: number;
  industryAverage: number;
  topQuartile: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  performance: 'excellent' | 'good' | 'average' | 'below_average';
  description: string;
}

const Benchmarks: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [selectedCompanySize, setSelectedCompanySize] = useState('mid-market');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  const benchmarkData: BenchmarkData[] = [
    {
      metric: 'Gross Margin',
      yourValue: 62.1,
      industryAverage: 58.3,
      topQuartile: 68.5,
      unit: '%',
      trend: 'up',
      performance: 'good',
      description: 'Your gross margin is above industry average, indicating strong pricing power and cost control.'
    },
    {
      metric: 'Operating Margin',
      yourValue: 22.8,
      industryAverage: 18.4,
      topQuartile: 25.2,
      unit: '%',
      trend: 'up',
      performance: 'good',
      description: 'Operating efficiency is strong compared to peers in your industry segment.'
    },
    {
      metric: 'Current Ratio',
      yourValue: 2.19,
      industryAverage: 1.85,
      topQuartile: 2.45,
      unit: 'x',
      trend: 'stable',
      performance: 'good',
      description: 'Liquidity position is healthy with good short-term debt coverage.'
    },
    {
      metric: 'Revenue per Employee',
      yourValue: 285000,
      industryAverage: 245000,
      topQuartile: 320000,
      unit: '$',
      trend: 'up',
      performance: 'good',
      description: 'Employee productivity is above average, showing efficient operations.'
    },
    {
      metric: 'Days Sales Outstanding',
      yourValue: 42,
      industryAverage: 35,
      topQuartile: 28,
      unit: 'days',
      trend: 'down',
      performance: 'below_average',
      description: 'Collection period is longer than industry average. Consider improving collection processes.'
    },
    {
      metric: 'Inventory Turnover',
      yourValue: 8.5,
      industryAverage: 6.8,
      topQuartile: 12.2,
      unit: 'x',
      trend: 'up',
      performance: 'good',
      description: 'Inventory management is efficient with good turnover rates.'
    }
  ];

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return '#4ADE80';
      case 'good': return '#3AB7BF';
      case 'average': return '#F59E0B';
      case 'below_average': return '#F87171';
      default: return '#6B7280';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'excellent': return Award;
      case 'good': return CheckCircle;
      case 'average': return Info;
      case 'below_average': return AlertTriangle;
      default: return Info;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return `$${value.toLocaleString()}`;
    } else if (unit === '%') {
      return `${value.toFixed(1)}%`;
    } else if (unit === 'x') {
      return `${value.toFixed(1)}x`;
    } else {
      return `${value} ${unit}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Industry Benchmarks</h2>
          <p className="text-gray-600 mt-1">Compare your performance against industry standards</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
          >
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="retail">Retail</option>
            <option value="finance">Financial Services</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
          <select
            value={selectedCompanySize}
            onChange={(e) => setSelectedCompanySize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
          >
            <option value="startup">Startup (1-50 employees)</option>
            <option value="mid-market">Mid-Market (51-500 employees)</option>
            <option value="enterprise">Enterprise (500+ employees)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed Analysis</option>
          </select>
        </div>
      </div>

      {/* Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benchmarkData.map((benchmark, index) => {
          const PerformanceIcon = getPerformanceIcon(benchmark.performance);
          const performanceColor = getPerformanceColor(benchmark.performance);
          
          return (
            <div
              key={index}
              className="flex-shrink-0 w-full p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg"
              style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="px-3 py-1 text-white rounded-full text-xs font-semibold"
                  style={{ backgroundColor: performanceColor }}
                >
                  {benchmark.performance.replace('_', ' ')}
                </span>
                <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
                  <PerformanceIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-2xl font-bold text-white">
                  {formatValue(benchmark.yourValue, benchmark.unit)}
                </p>
                <p className="text-sm text-gray-400">{benchmark.metric}</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Industry Avg:</span>
                  <span className="text-gray-300">{formatValue(benchmark.industryAverage, benchmark.unit)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Top Quartile:</span>
                  <span className="text-gray-300">{formatValue(benchmark.topQuartile, benchmark.unit)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">vs Industry</span>
                <div className="flex items-center">
                  {benchmark.yourValue > benchmark.industryAverage ? (
                    <TrendingUp className="w-3 h-3 text-[#4ADE80] mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-[#F87171] mr-1" />
                  )}
                  <span 
                    className="text-xs font-medium"
                    style={{ 
                      color: benchmark.yourValue > benchmark.industryAverage ? '#4ADE80' : '#F87171'
                    }}
                  >
                    {benchmark.yourValue > benchmark.industryAverage ? '+' : ''}
                    {(((benchmark.yourValue - benchmark.industryAverage) / benchmark.industryAverage) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Analysis */}
      {viewMode === 'detailed' && (
        <Card title="Detailed Benchmark Analysis">
          <div className="space-y-6">
            {benchmarkData.map((benchmark, index) => {
              const PerformanceIcon = getPerformanceIcon(benchmark.performance);
              const performanceColor = getPerformanceColor(benchmark.performance);
              
              return (
                <div key={index} className="p-6 border border-gray-200 rounded-lg hover:border-[#3AB7BF] transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                        style={{ backgroundColor: `${performanceColor}20` }}
                      >
                        <PerformanceIcon className="w-5 h-5" style={{ color: performanceColor }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1E2A38] text-lg">{benchmark.metric}</h3>
                        <p className="text-sm text-gray-600">{benchmark.description}</p>
                      </div>
                    </div>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        backgroundColor: `${performanceColor}20`,
                        color: performanceColor
                      }}
                    >
                      {benchmark.performance.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div className="text-center p-4 bg-[#3AB7BF]/10 rounded-lg">
                      <p className="text-xl font-bold text-[#3AB7BF]">
                        {formatValue(benchmark.yourValue, benchmark.unit)}
                      </p>
                      <p className="text-sm text-gray-600">Your Performance</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg">
                      <p className="text-xl font-bold text-gray-600">
                        {formatValue(benchmark.industryAverage, benchmark.unit)}
                      </p>
                      <p className="text-sm text-gray-600">Industry Average</p>
                    </div>
                    <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
                      <p className="text-xl font-bold text-[#4ADE80]">
                        {formatValue(benchmark.topQuartile, benchmark.unit)}
                      </p>
                      <p className="text-sm text-gray-600">Top Quartile</p>
                    </div>
                  </div>
                  
                  {/* Performance Bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((benchmark.yourValue / benchmark.topQuartile) * 100, 100)}%`,
                          backgroundColor: performanceColor
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>0</span>
                      <span>Industry Avg</span>
                      <span>Top Quartile</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Industry Comparison */}
      <Card title="Industry Comparison Matrix">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Your Value</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Industry Avg</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Top Quartile</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Performance</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Trend</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkData.map((benchmark, index) => {
                const PerformanceIcon = getPerformanceIcon(benchmark.performance);
                const performanceColor = getPerformanceColor(benchmark.performance);
                const TrendIcon = benchmark.trend === 'up' ? TrendingUp : benchmark.trend === 'down' ? TrendingDown : Target;
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-[#1E2A38]">{benchmark.metric}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#3AB7BF]">
                      {formatValue(benchmark.yourValue, benchmark.unit)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatValue(benchmark.industryAverage, benchmark.unit)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatValue(benchmark.topQuartile, benchmark.unit)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <PerformanceIcon 
                          className="w-4 h-4 mr-1" 
                          style={{ color: performanceColor }}
                        />
                        <span 
                          className="text-xs font-medium capitalize"
                          style={{ color: performanceColor }}
                        >
                          {benchmark.performance.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <TrendIcon 
                        className="w-4 h-4 mx-auto" 
                        style={{ 
                          color: benchmark.trend === 'up' ? '#4ADE80' : 
                                 benchmark.trend === 'down' ? '#F87171' : '#6B7280'
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex-shrink-0 w-full p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[#4ADE80] text-white rounded-full text-xs font-semibold">Excellent</span>
            <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-white">{benchmarkData.filter(b => b.performance === 'excellent').length}</p>
            <p className="text-sm text-gray-400">Metrics</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Top performer</span>
            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
          </div>
        </div>

        <div className="flex-shrink-0 w-full p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[#3AB7BF] text-white rounded-full text-xs font-semibold">Good</span>
            <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-white">{benchmarkData.filter(b => b.performance === 'good').length}</p>
            <p className="text-sm text-gray-400">Metrics</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Above average</span>
            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
          </div>
        </div>

        <div className="flex-shrink-0 w-full p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[#F59E0B] text-white rounded-full text-xs font-semibold">Average</span>
            <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <Info className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-white">{benchmarkData.filter(b => b.performance === 'average').length}</p>
            <p className="text-sm text-gray-400">Metrics</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Industry standard</span>
            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
          </div>
        </div>

        <div className="flex-shrink-0 w-full p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg" style={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-[#F87171] text-white rounded-full text-xs font-semibold">Below Avg</span>
            <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-bold text-white">{benchmarkData.filter(b => b.performance === 'below_average').length}</p>
            <p className="text-sm text-gray-400">Metrics</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#F87171]">Needs improvement</span>
            <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Improvement Opportunities */}
      <Card title="Improvement Opportunities">
        <div className="space-y-4">
          {benchmarkData
            .filter(b => b.performance === 'below_average' || b.performance === 'average')
            .map((benchmark, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1E2A38]">{benchmark.metric}</h3>
                    <p className="text-sm text-gray-600">{benchmark.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#3AB7BF]">
                      {formatValue(benchmark.yourValue, benchmark.unit)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Target: {formatValue(benchmark.topQuartile, benchmark.unit)}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                    <h4 className="font-medium text-[#1E2A38] mb-2">Gap Analysis</h4>
                    <p className="text-sm text-gray-700">
                      {benchmark.yourValue < benchmark.topQuartile 
                        ? `${formatValue(benchmark.topQuartile - benchmark.yourValue, benchmark.unit)} improvement needed to reach top quartile`
                        : 'Already performing at top quartile level'
                      }
                    </p>
                  </div>
                  
                  <div className="p-3 bg-[#3AB7BF]/10 rounded-lg">
                    <h4 className="font-medium text-[#1E2A38] mb-2">Recommended Actions</h4>
                    <p className="text-sm text-gray-700">
                      {benchmark.metric === 'Days Sales Outstanding' 
                        ? 'Implement automated payment reminders and offer early payment discounts'
                        : benchmark.metric === 'Operating Margin'
                        ? 'Focus on cost optimization and operational efficiency improvements'
                        : 'Analyze top quartile companies for best practices and implementation strategies'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Peer Comparison */}
      <Card title="Peer Group Analysis">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Similar Companies</h3>
            <div className="space-y-3">
              {[
                { name: 'TechCorp Inc.', size: 'Mid-Market', margin: 24.5, revenue: 12.5 },
                { name: 'InnovateSoft', size: 'Mid-Market', margin: 19.8, revenue: 8.9 },
                { name: 'DataSolutions Pro', size: 'Mid-Market', margin: 26.1, revenue: 15.2 },
                { name: 'CloudTech Systems', size: 'Mid-Market', margin: 21.3, revenue: 11.7 }
              ].map((company, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#1E2A38]">{company.name}</p>
                    <p className="text-sm text-gray-600">{company.size} • Similar industry</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#3AB7BF]">{company.margin}% margin</p>
                    <p className="text-xs text-gray-500">{company.revenue}% growth</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Ranking Position</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
                <p className="text-3xl font-bold text-[#4ADE80]">23rd</p>
                <p className="text-sm text-gray-600">Out of 150 companies</p>
                <p className="text-xs text-gray-500">Top 15% performer</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-[#3AB7BF]">85th</p>
                  <p className="text-xs text-gray-600">Percentile</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-[#4ADE80]">A-</p>
                  <p className="text-xs text-gray-600">Grade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Items */}
      <Card title="Recommended Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <Target className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Optimize Collections</h3>
            <p className="text-sm text-gray-600">Reduce DSO by 7 days to match industry average</p>
            <Button variant="outline" size="sm" className="mt-3">
              View Strategy
            </Button>
          </div>
          
          <div className="text-center p-4 bg-[#3AB7BF]/10 rounded-lg">
            <TrendingUp className="w-8 h-8 text-[#3AB7BF] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Maintain Margins</h3>
            <p className="text-sm text-gray-600">Continue strong margin performance vs peers</p>
            <Button variant="outline" size="sm" className="mt-3">
              Best Practices
            </Button>
          </div>
          
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <BarChart3 className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Scale Operations</h3>
            <p className="text-sm text-gray-600">Improve revenue per employee efficiency</p>
            <Button variant="outline" size="sm" className="mt-3">
              Action Plan
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Benchmarks;