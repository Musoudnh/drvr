import React, { useState } from 'react';
import { BarChart3, TrendingUp, Award, Target, Users, DollarSign, Brain, Zap, Eye, Filter, RefreshCw, Building, Globe, Calendar, CheckCircle, AlertTriangle, Lightbulb, X, Plus } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface BenchmarkInsight {
  metric: string;
  yourValue: number;
  industryAverage: number;
  topQuartile: number;
  performance: 'excellent' | 'good' | 'average' | 'below_average';
  trend: 'improving' | 'stable' | 'declining';
  recommendation: string;
  confidence: number;
}

interface PeerGroup {
  id: string;
  name: string;
  criteria: string[];
  companyCount: number;
  isSelected: boolean;
}

interface CompetitiveIntel {
  competitor: string;
  marketShare: number;
  growthRate: number;
  strengths: string[];
  weaknesses: string[];
  threatLevel: 'high' | 'medium' | 'low';
}

const Benchmarks: React.FC = () => {
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showPeerGroupModal, setShowPeerGroupModal] = useState(false);
  const [showCompetitiveModal, setShowCompetitiveModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('current-year');
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  
  const [benchmarkInsights, setBenchmarkInsights] = useState<BenchmarkInsight[]>([
    {
      metric: 'Revenue Growth Rate',
      yourValue: 15.4,
      industryAverage: 12.1,
      topQuartile: 18.5,
      performance: 'good',
      trend: 'improving',
      recommendation: 'Continue current growth strategy, consider expanding to new markets',
      confidence: 89
    },
    {
      metric: 'Profit Margin',
      yourValue: 26.4,
      industryAverage: 22.3,
      topQuartile: 28.7,
      performance: 'good',
      trend: 'stable',
      recommendation: 'Optimize operational efficiency to reach top quartile',
      confidence: 92
    },
    {
      metric: 'Customer Acquisition Cost',
      yourValue: 145,
      industryAverage: 180,
      topQuartile: 120,
      performance: 'good',
      trend: 'improving',
      recommendation: 'Focus on organic acquisition channels to reach top quartile',
      confidence: 85
    },
    {
      metric: 'Employee Productivity',
      yourValue: 285000,
      industryAverage: 245000,
      topQuartile: 320000,
      performance: 'good',
      trend: 'improving',
      recommendation: 'Invest in automation tools to boost productivity',
      confidence: 78
    }
  ]);

  const [peerGroups, setPeerGroups] = useState<PeerGroup[]>([
    {
      id: '1',
      name: 'SaaS Companies (10-50M ARR)',
      criteria: ['SaaS business model', '$10-50M ARR', 'B2B focus'],
      companyCount: 247,
      isSelected: true
    },
    {
      id: '2',
      name: 'Technology Companies (Similar Size)',
      criteria: ['Technology sector', '50-200 employees', 'North America'],
      companyCount: 156,
      isSelected: false
    },
    {
      id: '3',
      name: 'High-Growth Companies',
      criteria: ['15%+ growth rate', 'Series B+', 'Venture backed'],
      companyCount: 89,
      isSelected: false
    }
  ]);

  const [competitiveIntel, setCompetitiveIntel] = useState<CompetitiveIntel[]>([
    {
      competitor: 'FinanceFlow Pro',
      marketShare: 23.5,
      growthRate: 18.2,
      strengths: ['Strong enterprise features', 'Established brand', 'Large customer base'],
      weaknesses: ['Higher pricing', 'Complex onboarding', 'Limited integrations'],
      threatLevel: 'high'
    },
    {
      competitor: 'QuickFinance',
      marketShare: 15.8,
      growthRate: 12.4,
      strengths: ['User-friendly interface', 'Competitive pricing', 'Fast implementation'],
      weaknesses: ['Limited advanced features', 'Smaller team', 'Less customization'],
      threatLevel: 'medium'
    },
    {
      competitor: 'Enterprise Financial Suite',
      marketShare: 31.2,
      growthRate: 8.7,
      strengths: ['Comprehensive features', 'Enterprise focus', 'Strong compliance'],
      weaknesses: ['Expensive', 'Slow innovation', 'Poor user experience'],
      threatLevel: 'medium'
    }
  ]);

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return '#4ADE80';
      case 'good': return '#3AB7BF';
      case 'average': return '#F59E0B';
      case 'below_average': return '#F87171';
      default: return '#6B7280';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'high': return '#F87171';
      case 'medium': return '#F59E0B';
      case 'low': return '#4ADE80';
      default: return '#6B7280';
    }
  };

  const togglePeerGroup = (groupId: string) => {
    setPeerGroups(prev => prev.map(group =>
      group.id === groupId ? { ...group, isSelected: !group.isSelected } : group
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Industry Benchmarks & Competitive Intelligence</h2>
          <p className="text-gray-600 mt-1">AI-driven insights and granular peer comparisons</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowPeerGroupModal(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Custom Peer Groups
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowCompetitiveModal(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Competitive Intel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => setShowInsightsModal(true)}
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Enhanced Controls */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
            >
              <option value="technology">Technology</option>
              <option value="saas">SaaS</option>
              <option value="fintech">FinTech</option>
              <option value="healthcare">Healthcare</option>
              <option value="manufacturing">Manufacturing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent">
              <option value="10-50">10-50 employees</option>
              <option value="50-200">50-200 employees</option>
              <option value="200-1000">200-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent">
              <option value="north-america">North America</option>
              <option value="europe">Europe</option>
              <option value="asia-pacific">Asia Pacific</option>
              <option value="global">Global</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
            >
              <option value="current-year">Current Year</option>
              <option value="last-year">Last Year</option>
              <option value="3-year">3-Year Average</option>
              <option value="5-year">5-Year Trend</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Score</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">8.7/10</p>
              <p className="text-sm text-[#4ADE80] mt-1">Above average</p>
            </div>
            <Award className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Industry Rank</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">#12</p>
              <p className="text-sm text-gray-600 mt-1">Out of 500</p>
            </div>
            <Target className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peer Group</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">Top 25%</p>
              <p className="text-sm text-gray-600 mt-1">Similar companies</p>
            </div>
            <Users className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">15.4%</p>
              <p className="text-sm text-gray-600 mt-1">vs 12.1% avg</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>
      </div>

      {/* AI-Driven Benchmark Insights */}
      <Card title="AI-Driven Performance Insights">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#1E2A38]">Intelligent Benchmark Analysis</h3>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
          
          <div className="space-y-4">
            {benchmarkInsights.slice(0, 2).map((insight, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-[#3AB7BF] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-[#1E2A38]">{insight.metric}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">
                        Your: <span className="font-medium">{insight.yourValue.toLocaleString()}</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Industry: <span className="font-medium">{insight.industryAverage.toLocaleString()}</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Top 25%: <span className="font-medium">{insight.topQuartile.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={{
                      backgroundColor: `${getPerformanceColor(insight.performance)}20`,
                      color: getPerformanceColor(insight.performance)
                    }}>
                      {insight.performance.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="relative h-3 rounded-full bg-gradient-to-r from-[#F87171] via-[#F59E0B] to-[#4ADE80]">
                      <div 
                        className="absolute top-0 w-2 h-3 bg-[#1E2A38] rounded-full"
                        style={{ 
                          left: `${Math.min(95, (insight.yourValue / insight.topQuartile) * 100)}%`,
                          transform: 'translateX(-50%)'
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Bottom</span>
                    <span>Industry Avg</span>
                    <span>Top Quartile</span>
                  </div>
                </div>
                
                <div className="p-3 bg-[#4ADE80]/10 rounded-lg">
                  <p className="text-sm text-gray-700">{insight.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Predictive Benchmarking */}
      <Card title="Predictive Benchmarking">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#1E2A38]">Future Industry Trends</h3>
            <span className="text-sm text-[#8B5CF6] font-medium">AI-powered predictions</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-[#1E2A38]">6-Month Predictions</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-[#4ADE80]/10 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Industry Growth Rate</span>
                  <span className="font-bold text-[#4ADE80]">+2.3%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#F59E0B]/10 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Avg Profit Margin</span>
                  <span className="font-bold text-[#F59E0B]">-1.1%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#3AB7BF]/10 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Customer Acquisition Cost</span>
                  <span className="font-bold text-[#3AB7BF]">+8.5%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-[#1E2A38]">Strategic Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Lightbulb className="w-4 h-4 text-[#F59E0B] mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Prepare for margin compression by optimizing operations</span>
                </div>
                <div className="flex items-start">
                  <Target className="w-4 h-4 text-[#3AB7BF] mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Invest in customer retention to offset rising CAC</span>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-[#4ADE80] mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Capitalize on industry growth with expansion plans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Benchmark Comparisons */}
      <Card title="Revenue Distribution Analysis">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[#1E2A38] mb-2">Industry Revenue Distribution</h3>
            <p className="text-sm text-gray-600">See where your business stands in the revenue distribution curve</p>
          </div>
          
          {/* Key Insights */}
          <div className="bg-gradient-to-r from-[#3AB7BF]/10 to-[#4ADE80]/10 rounded-lg p-4 border border-[#3AB7BF]/20">
            <h4 className="font-semibold text-[#1E2A38] mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-[#3AB7BF]" />
              Performance Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#4ADE80] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">Your revenue significantly outperforms the industry median by $2M annually</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#3AB7BF] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">Positioned in the top quartile with strong competitive advantage</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">Growth trajectory suggests potential to reach 85th percentile</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">Revenue stability indicates sustainable business model</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Industry Insights */}
      <Card title="Industry Insights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <TrendingUp className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Growth Opportunity</h3>
            <p className="text-sm text-gray-600">Your growth rate exceeds industry average by 3.3%</p>
          </div>
          <div className="text-center p-4 bg-[#3AB7BF]/10 rounded-lg">
            <DollarSign className="w-8 h-8 text-[#3AB7BF] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Profit Excellence</h3>
            <p className="text-sm text-gray-600">Profit margins 4.2% above industry benchmark</p>
          </div>
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <Target className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Market Position</h3>
            <p className="text-sm text-gray-600">Strong competitive position in top quartile</p>
          </div>
        </div>
      </Card>

      {/* AI Insights Modal */}
      {showInsightsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">AI Benchmark Insights</h3>
              <button
                onClick={() => setShowInsightsModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {benchmarkInsights.map((insight, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-[#1E2A38]">{insight.metric}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={{
                      backgroundColor: `${getPerformanceColor(insight.performance)}20`,
                      color: getPerformanceColor(insight.performance)
                    }}>
                      {insight.performance.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="font-bold text-[#1E2A38]">{insight.yourValue.toLocaleString()}</p>
                      <p className="text-gray-600">Your Value</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="font-bold text-[#F59E0B]">{insight.industryAverage.toLocaleString()}</p>
                      <p className="text-gray-600">Industry Avg</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="font-bold text-[#4ADE80]">{insight.topQuartile.toLocaleString()}</p>
                      <p className="text-gray-600">Top 25%</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-[#4ADE80]/10 rounded-lg">
                    <p className="text-sm text-gray-700">{insight.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowInsightsModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Peer Groups Modal */}
      {showPeerGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Custom Peer Groups</h3>
              <button
                onClick={() => setShowPeerGroupModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {peerGroups.map(group => (
                <div 
                  key={group.id} 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    group.isSelected ? 'border-[#3AB7BF] bg-[#3AB7BF]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => togglePeerGroup(group.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-[#1E2A38]">{group.name}</h4>
                      <p className="text-sm text-gray-600">{group.companyCount} companies</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={group.isSelected}
                      onChange={() => togglePeerGroup(group.id)}
                      className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF]"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {group.criteria.map((criterion, index) => (
                      <span key={index} className="px-2 py-1 bg-[#3AB7BF]/10 text-[#3AB7BF] rounded text-xs">
                        {criterion}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Group
              </Button>
              <button
                onClick={() => setShowPeerGroupModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Apply Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Competitive Intelligence Modal */}
      {showCompetitiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[900px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Competitive Intelligence</h3>
              <button
                onClick={() => setShowCompetitiveModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {competitiveIntel.map((competitor, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-[#1E2A38] text-lg">{competitor.competitor}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">
                          Market Share: <span className="font-medium">{competitor.marketShare}%</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Growth: <span className="font-medium">{competitor.growthRate}%</span>
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium`} style={{
                      backgroundColor: `${getThreatColor(competitor.threatLevel)}20`,
                      color: getThreatColor(competitor.threatLevel)
                    }}>
                      {competitor.threatLevel} threat
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-[#1E2A38] mb-2">Strengths</h5>
                      <ul className="space-y-1">
                        {competitor.strengths.map((strength, sIndex) => (
                          <li key={sIndex} className="flex items-start text-sm text-gray-700">
                            <CheckCircle className="w-3 h-3 text-[#4ADE80] mr-2 mt-0.5" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-[#1E2A38] mb-2">Weaknesses</h5>
                      <ul className="space-y-1">
                        {competitor.weaknesses.map((weakness, wIndex) => (
                          <li key={wIndex} className="flex items-start text-sm text-gray-700">
                            <AlertTriangle className="w-3 h-3 text-[#F87171] mr-2 mt-0.5" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Update Intelligence
              </Button>
              <button
                onClick={() => setShowCompetitiveModal(false)}
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

export default Benchmarks;